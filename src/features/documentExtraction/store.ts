import { analyze } from './analyze';
import { getBridge, type CaseDescription, type SyncPayload } from './bridge';
import { DEBUG_EXTRACTION, addFixtures, extractFile, registerFixtures } from './extractor';
import { ExtractionInvalidError } from './extractionSchema';
import { EXTRACTION_CONCURRENCY } from './constants';
import { SCENARIOS } from './mock/scenarios';
import { checkSize, checkType, downscaleImage, isPasswordProtectedPdf, mimeOf, passwordRejection, sha256Hex } from './precheck';
import { fieldsFilledFrom, freezeAsManual } from './provenance';
import { createQueue } from './retry';
import { buildSlots, firstName } from './slotConfig';
import {
  emptyDecisions, type Analysis, type Applicant, type Decisions, type FieldKey, type FieldRecord, type FileEntry, type Resolution, type ResolutionOption,
  type SlotConfig,
} from './types';

export interface AuditRecord {
  at: string; by: string; applicantId: string; applicantName: string; option: ResolutionOption;
  conflictFields: FieldKey[]; chosen: Partial<Record<FieldKey, string>>; note: string;
}
export interface CaseStore {
  caseId: string; readOnly: boolean;
  applicants: Applicant[]; slots: SlotConfig[];
  files: FileEntry[]; decisions: Decisions; analysis: Analysis; audit: AuditRecord[];
}
export interface UiState {
  menuOpen: boolean;
  dialogApplicant: { caseId: string; applicantId: string } | null;
  preview: { url: string; mime: string; name: string } | null;
  removePrompt: { caseId: string; fileId: string; slotId: string; fields: FieldRecord[] } | null;
  /** Slot that asked for "add another file" / "upload a different file": the file picker targets it. */
  picker: { caseId: string; slotId: string; replaceFileId?: string } | null;
}
export interface State { cases: Record<string, CaseStore>; ui: UiState }

let state: State = { cases: {}, ui: { menuOpen: false, dialogApplicant: null, preview: null, removePrompt: null, picker: null } };
const listeners = new Set<() => void>();
const queue = createQueue(EXTRACTION_CONCURRENCY);
const blobs = new Map<string, Blob>(); // kept in memory so "Try again" never loses the upload
const replaces = new Map<string, string>(); // new file id -> old file id, dropped when the new one is read
let uid = 0;
const newId = () => `f${Date.now().toString(36)}${(++uid).toString(36)}`;

const AUDIT_KEY = 'uncia.docx.resolutions.v1';
const loadAudit = (): Record<string, AuditRecord[]> => { try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || '{}'); } catch { return {}; } };
const saveAudit = () => { try { localStorage.setItem(AUDIT_KEY, JSON.stringify(Object.fromEntries(Object.values(state.cases).map((c) => [c.caseId, c.audit])))); } catch { /* storage unavailable */ } };

const emit = () => listeners.forEach((l) => l());
const setState = (next: State) => { state = next; emit(); };
const patchCase = (caseId: string, f: (c: CaseStore) => CaseStore) => {
  const c = state.cases[caseId];
  if (!c) return;
  const n = f(c);
  n.analysis = analyze({ applicants: n.applicants, slots: n.slots, files: n.files, decisions: n.decisions });
  setState({ ...state, cases: { ...state.cases, [caseId]: n } });
  scheduleSync(caseId);
};
const patchUi = (u: Partial<UiState>) => setState({ ...state, ui: { ...state.ui, ...u } });

/* ---------- sync to the case engine ---------- */
const pending = new Set<string>();
function scheduleSync(caseId: string) {
  if (pending.has(caseId)) return;
  pending.add(caseId);
  setTimeout(() => { pending.delete(caseId); pushSync(caseId); }, 0);
}
function pushSync(caseId: string) {
  const c = state.cases[caseId], b = getBridge();
  if (!c || !b) return;
  const payload: SyncPayload = { slots: {}, fields: {}, extraDocs: [] };
  for (const id of c.analysis.slotOrder) {
    const v = c.analysis.slots[id];
    payload.slots[id] = { state: v.state, files: v.files.filter((f) => f.status === 'read').map((f) => f.name) };
    if (v.slot.type === 'SUPPORTING') payload.extraDocs.push({ id, label: v.slot.label });
  }
  for (const a of Object.values(c.analysis.applicants)) for (const f of a.fields) payload.fields[`${f.applicantId}.${f.key}`] = f;
  b.sync(caseId, payload);
}

/* ---------- case lifecycle ---------- */
export function attachCase(caseId: string, desc: CaseDescription) {
  const slots = buildSlots(desc.docs, desc.applicants);
  const existing = state.cases[caseId];
  if (existing) {
    const same = JSON.stringify([existing.applicants, existing.slots, existing.readOnly]) === JSON.stringify([desc.applicants, slots, desc.readOnly]);
    if (same) return;
    patchCase(caseId, (c) => ({ ...c, applicants: desc.applicants, slots, readOnly: desc.readOnly }));
    return;
  }
  const decisions = emptyDecisions();
  const c: CaseStore = { caseId, readOnly: desc.readOnly, applicants: desc.applicants, slots, files: [], decisions, analysis: analyze({ applicants: desc.applicants, slots, files: [], decisions }), audit: loadAudit()[caseId] ?? [] };
  setState({ ...state, cases: { ...state.cases, [caseId]: c } });
}

const dropUrls = (f: FileEntry) => { if (f.previewUrl && f.previewUrl.startsWith('blob:')) URL.revokeObjectURL(f.previewUrl); };

export function resetCase(caseId: string) {
  const c = state.cases[caseId];
  if (!c) return;
  c.files.forEach((f) => { dropUrls(f); blobs.delete(f.id); });
  patchCase(caseId, (x) => ({ ...x, files: [], decisions: emptyDecisions() }));
}

export function resetAllCases() { Object.keys(state.cases).forEach(resetCase); }

/* ---------- ingesting files ---------- */
function virtualThumb(name: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><rect width="240" height="160" rx="10" fill="#F8F4FF"/><rect x="14" y="14" width="212" height="132" rx="8" fill="#fff" stroke="#AB97C5"/><text x="26" y="48" font-family="sans-serif" font-size="15" font-weight="700" fill="#552E8C">${label}</text><rect x="26" y="64" width="150" height="8" rx="4" fill="#D8DAE5"/><rect x="26" y="82" width="120" height="8" rx="4" fill="#EBECF2"/><rect x="26" y="100" width="170" height="8" rx="4" fill="#EBECF2"/><text x="26" y="132" font-family="sans-serif" font-size="10" fill="#64677A">${name.replace(/[<&>"]/g, '')}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function addEntry(caseId: string, e: FileEntry) { patchCase(caseId, (c) => ({ ...c, files: [...c.files, e] })); }
const entryBase = (name: string, mime: string, size: number, slotId: string): FileEntry => ({ id: newId(), name, mime, size, hash: '', slotIds: [slotId], status: 'reading', docs: [], addedAt: Date.now() });

function finishRead(caseId: string, fileId: string, p: Partial<FileEntry>) {
  patchCase(caseId, (c) => {
    const old = replaces.get(fileId);
    let files = c.files.map((f) => (f.id === fileId ? { ...f, ...p } : f));
    if (old && (p.status === 'read')) {
      // the new file is read: now the old one can go
      const slot = files.find((f) => f.id === fileId)!.slotIds[0];
      files = files.map((f) => (f.id === old ? { ...f, slotIds: f.slotIds.filter((s) => s !== slot) } : f)).filter((f) => { const keep = f.slotIds.length > 0; if (!keep) { dropUrls(f); blobs.delete(f.id); } return keep; });
      replaces.delete(fileId);
    }
    return { ...c, files };
  });
}

const friendly = (e: unknown): string => (e instanceof ExtractionInvalidError ? e.message : (e as Error)?.message || 'The reader didn’t answer');

async function readFile(caseId: string, fileId: string, name: string, mime: string, blob?: Blob) {
  try {
    const out = await queue.run(() => extractFile({ name, mime, blob }));
    const docs = out.documents;
    if (docs.some((d) => d.type === 'AADHAAR' && d.fields.fullNumberVisible?.value === 'true')) {
      // never keep a file that shows the full Aadhaar number
      const f = state.cases[caseId]?.files.find((x) => x.id === fileId);
      if (f) dropUrls(f);
      blobs.delete(fileId);
      finishRead(caseId, fileId, { status: 'rejected', rejectReason: 'UNMASKED_AADHAAR', rejectMessage: 'This Aadhaar shows the full number. Upload the masked copy.', docs: [], previewUrl: undefined, thumbUrl: undefined });
      return;
    }
    finishRead(caseId, fileId, { status: 'read', docs, error: undefined });
  } catch (e) {
    finishRead(caseId, fileId, { status: 'failed', error: friendly(e) });
  }
}

export async function addFiles(caseId: string, slotId: string, files: File[], replaceFileId?: string) {
  for (const file of files) await addOne(caseId, slotId, file, replaceFileId);
}

async function addOne(caseId: string, slotId: string, file: File, replaceFileId?: string) {
  const mime = mimeOf(file.name, file.type);
  const e = entryBase(file.name, mime, file.size, slotId);
  if (replaceFileId) replaces.set(e.id, replaceFileId);
  addEntry(caseId, e);
  const reject = (reason: FileEntry['rejectReason'], message: string, hash = '') => finishRead(caseId, e.id, { status: 'rejected', rejectReason: reason, rejectMessage: message, hash });

  const t = checkType(file.name, file.type); if (t) return reject(t.reason, t.message);
  const s = checkSize(file.size); if (s) return reject(s.reason, s.message);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (mime === 'application/pdf' && isPasswordProtectedPdf(bytes)) { const p = passwordRejection(); return reject(p.reason, p.message); }
  const hash = await sha256Hex(bytes);
  const url = URL.createObjectURL(file);
  patchCase(caseId, (c) => ({ ...c, files: c.files.map((f) => (f.id === e.id ? { ...f, hash, previewUrl: url, thumbUrl: mime.startsWith('image/') ? url : undefined } : f)) }));
  const send = await downscaleImage(file, mime);
  blobs.set(e.id, send);
  await readFile(caseId, e.id, file.name, mime, send);
}

/** Mock mode: a sample file by name. No bytes; the fixture stands in for the reading. */
export async function addSample(caseId: string, slotId: string, sample: string, replaceFileId?: string, fromLead?: boolean) {
  const e = { ...entryBase(sample, /\.pdf$/i.test(sample) ? 'application/pdf' : 'image/jpeg', 120_000, slotId), virtual: true, fromLead };
  e.hash = await sha256Hex(new TextEncoder().encode('sample:' + sample));
  e.thumbUrl = virtualThumb(sample, /pan/i.test(sample) ? 'PAN card' : /aadhaar/i.test(sample) ? 'Aadhaar' : /pay|slip/i.test(sample) ? 'Salary slips' : 'Document');
  e.previewUrl = e.thumbUrl;
  if (replaceFileId) replaces.set(e.id, replaceFileId);
  addEntry(caseId, e);
  await readFile(caseId, e.id, sample, e.mime);
}

export function retry(caseId: string, fileId: string) {
  const f = state.cases[caseId]?.files.find((x) => x.id === fileId);
  if (!f) return;
  patchCase(caseId, (c) => ({ ...c, files: c.files.map((x) => (x.id === fileId ? { ...x, status: 'reading', error: undefined } : x)) }));
  void readFile(caseId, fileId, f.name, f.mime, blobs.get(fileId));
}

/* ---------- actions from the slot ---------- */
const detachFrom = (files: FileEntry[], slotId: string, keepId?: string) =>
  files.map((f) => (f.id !== keepId && f.slotIds.includes(slotId) ? { ...f, slotIds: f.slotIds.filter((s) => s !== slotId) } : f)).filter((f) => { const keep = f.slotIds.length > 0; if (!keep) { dropUrls(f); blobs.delete(f.id); } return keep; });

export function moveFile(caseId: string, fileId: string, fromSlotId: string, toSlotId: string, replace: boolean) {
  patchCase(caseId, (c) => {
    let files = c.files;
    if (replace) files = detachFrom(files, toSlotId, fileId);
    files = files.map((f) => (f.id === fileId ? { ...f, slotIds: [...new Set([...f.slotIds.filter((s) => s !== fromSlotId), toSlotId])] } : f));
    return { ...c, files };
  });
}
export function attachBoth(caseId: string, fileId: string, toSlotId: string) {
  patchCase(caseId, (c) => ({ ...c, files: c.files.map((f) => (f.id === fileId ? { ...f, slotIds: [...new Set([...f.slotIds, toSlotId])] } : f)) }));
}
export function useAnyway(caseId: string, fileId: string, slotId: string) {
  patchCase(caseId, (c) => ({ ...c, decisions: { ...c.decisions, useAnyway: [...new Set([...c.decisions.useAnyway, `${fileId}|${slotId}`])] } }));
}
export function markLater(caseId: string, slotId: string, on: boolean) {
  patchCase(caseId, (c) => ({ ...c, decisions: { ...c.decisions, later: on ? [...new Set([...c.decisions.later, slotId])] : c.decisions.later.filter((s) => s !== slotId) } }));
}

/** Removing a file that filled fields asks whether to clear them or keep them as manual values. */
export function removeFile(caseId: string, fileId: string, slotId: string) {
  const c = state.cases[caseId];
  if (!c) return;
  const filled = fieldsFilledFrom(c.analysis, fileId);
  if (filled.length) { patchUi({ removePrompt: { caseId, fileId, slotId, fields: filled } }); return; }
  removeOnly(caseId, fileId, slotId, 'clear');
}

export function removeOnly(caseId: string, fileId: string, slotId: string, mode: 'clear' | 'keep') {
  patchCase(caseId, (c) => {
    const decisions = mode === 'keep' ? freezeAsManual(c.analysis, fileId, c.decisions) : c.decisions;
    const files = c.files.map((f) => (f.id === fileId ? { ...f, slotIds: f.slotIds.filter((s) => s !== slotId) } : f)).filter((f) => { const keep = f.slotIds.length > 0; if (!keep) { dropUrls(f); blobs.delete(f.id); } return keep; });
    return { ...c, decisions, files };
  });
  patchUi({ removePrompt: null });
}

export function setManual(caseId: string, applicantId: string, key: FieldKey, value: string) {
  patchCase(caseId, (c) => {
    const manual = { ...c.decisions.manual }, k = `${applicantId}.${key}`;
    if (value.trim() === '') delete manual[k]; else manual[k] = value;
    const fieldPicks = { ...c.decisions.fieldPicks }; delete fieldPicks[k];
    return { ...c, decisions: { ...c.decisions, manual, fieldPicks } };
  });
}
export function pickField(caseId: string, applicantId: string, key: FieldKey, choice: 'confirm' | 'existing' | number) {
  patchCase(caseId, (c) => ({ ...c, decisions: { ...c.decisions, fieldPicks: { ...c.decisions.fieldPicks, [`${applicantId}.${key}`]: choice } } }));
}

export interface ResolveInput {
  applicantId: string; option: ResolutionOption; note: string;
  picks?: Resolution['picks']; trustDocKey?: string; reuploadSlotId?: string;
}
export function resolveConflict(caseId: string, input: ResolveInput) {
  const c = state.cases[caseId], b = getBridge();
  const conflict = c?.analysis.applicants[input.applicantId]?.conflict;
  if (!c || !conflict) return;
  const app = c.applicants.find((a) => a.id === input.applicantId)!;
  const chosen: Partial<Record<FieldKey, string>> = {};
  for (const f of conflict.fields) {
    const pick = input.option === 'pick' ? input.picks?.[f.key] : undefined;
    if (pick && 'manual' in pick) chosen[f.key] = pick.manual;
    else {
      const dk = pick && 'docKey' in pick ? pick.docKey : input.option === 'one' && input.trustDocKey && f.values.some((v) => v.docKey === input.trustDocKey) ? input.trustDocKey : f.suggestedDocKey;
      const v = f.values.find((x) => x.docKey === dk);
      chosen[f.key] = input.option === 'skip' ? '(left empty)' : v?.value ?? '';
    }
  }
  const at = new Date().toISOString(), by = b?.user() ?? 'User';
  const res: Resolution = {
    applicantId: input.applicantId, option: input.option, signature: conflict.signature, picks: input.picks ?? {}, trustDocKey: input.trustDocKey,
    reuploadSlotId: input.reuploadSlotId, note: input.note, by, at, conflictFields: conflict.fields.map((f) => f.key), chosen,
  };
  const rec: AuditRecord = { at, by, applicantId: app.id, applicantName: app.name, option: input.option, conflictFields: res.conflictFields, chosen, note: input.note };
  patchCase(caseId, (x) => ({ ...x, audit: [rec, ...x.audit], decisions: { ...x.decisions, resolutions: { ...x.decisions.resolutions, [input.applicantId]: res } } }));
  saveAudit();
  const label: Record<ResolutionOption, string> = { pick: 'picked a source for each field', one: 'used one document for everything', skip: 'skipped for now', support: 'kept both and asked for a supporting document' };
  b?.log(caseId, `Resolved a document mismatch for ${firstName(app.name)}`, `${by} ${label[input.option]}. ${Object.entries(chosen).map(([k, v]) => `${k}: ${v}`).join('; ')}.${input.note ? ' Note: ' + input.note : ''}`);
  patchUi({ dialogApplicant: null });
}

/* ---------- dev scenarios ---------- */
export async function loadScenario(caseId: string, scenarioId: string) {
  const c = state.cases[caseId], sc = SCENARIOS.find((s) => s.id === scenarioId);
  if (!c || !sc) return;
  resetCase(caseId);
  const build = sc.build(c.applicants);
  registerFixtures(build.fixtures);
  patchUi({ menuOpen: false });
  await Promise.all(build.uploads.map((u) => addSample(caseId, u.slotId, u.sample)));
}

/** Documents uploaded in the New lead form: read into the case so the pre-screen page opens with the form already filled. */
export async function seedFromLead(caseId: string, desc: CaseDescription, slotIds: string[]) {
  attachCase(caseId, desc);
  const c = state.cases[caseId], sc = SCENARIOS.find((s) => s.id === 'clean');
  if (!c || !sc || c.files.length) return;
  const build = sc.build(c.applicants);
  addFixtures(build.fixtures);
  await Promise.all(build.uploads.filter((u) => slotIds.includes(u.slotId)).map((u) => addSample(caseId, u.slotId, u.sample, undefined, true)));
}

/* ---------- ui ---------- */
export const ui = {
  openMenu: () => patchUi({ menuOpen: true }), closeMenu: () => patchUi({ menuOpen: false }),
  openDialog: (caseId: string, applicantId: string) => patchUi({ dialogApplicant: { caseId, applicantId } }), closeDialog: () => patchUi({ dialogApplicant: null }),
  openPreview: (p: UiState['preview']) => patchUi({ preview: p }), closePreview: () => patchUi({ preview: null }),
  cancelRemove: () => patchUi({ removePrompt: null }),
  setPicker: (p: UiState['picker']) => patchUi({ picker: p }),
};

export const store = {
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  getState: () => state,
};

if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __docx: unknown }).__docx = { store, attachCase, addFiles, addSample, loadScenario, resolveConflict, setManual, debug: DEBUG_EXTRACTION };
}
