import { DOC_TYPE_LABEL, LOW_CONFIDENCE } from './constants';
import { monthLabel, nameTier, parsePayMonth, formatDob, parseDob } from './normalize';
import { firstName, typeShort } from './slotConfig';
import type {
  Applicant, Decisions, DocType, ExtractedDoc, FileEntry, Issue, IssueAction, SlotConfig, SlotState, SlotType, SlotView,
} from './types';

/** A document in a slot that passed the fit checks and can feed the form. */
export interface UsableDoc { docKey: string; doc: ExtractedDoc; file: FileEntry; slot: SlotConfig }

export const docKeyOf = (fileId: string, idx: number) => `${fileId}#${idx}`;
export const splitDocKey = (k: string) => { const i = k.lastIndexOf('#'); return { fileId: k.slice(0, i), idx: +k.slice(i + 1) }; };

export function docName(doc: ExtractedDoc): string | null {
  const f = doc.fields;
  return (doc.type === 'SALARY_SLIP' ? f.employeeName?.value : f.name?.value) ?? null;
}

const REAL_TYPES: DocType[] = ['PAN', 'AADHAAR', 'SALARY_SLIP'];
const isRealType = (t: DocType) => REAL_TYPES.includes(t);

/** Fields read below the confidence floor are dropped from partly readable documents. */
export function filterPartial(doc: ExtractedDoc): ExtractedDoc {
  if (doc.readability !== 'PARTIAL') return doc;
  const fields: ExtractedDoc['fields'] = {};
  for (const [k, v] of Object.entries(doc.fields) as [keyof ExtractedDoc['fields'], { value: string | null; confidence: number }][]) {
    fields[k] = v.confidence >= LOW_CONFIDENCE ? v : { value: null, confidence: 0 };
  }
  return { ...doc, fields };
}

export interface SlotFitInput {
  applicants: Applicant[];
  slots: SlotConfig[];
  files: FileEntry[];
  decisions: Decisions;
}

export interface SlotFitResult { views: Record<string, SlotView>; usable: Record<string, UsableDoc[]> }

const nameFor = (a: Applicant, d: Decisions) => d.manual[`${a.id}.name`] ?? a.name;

/** Does the slot hold something that looks like it belongs there (or is still being read)? */
function slotHasContent(slot: SlotConfig, files: FileEntry[]): boolean {
  return files.some((f) => f.slotIds.includes(slot.id) && (f.status === 'reading' || (f.status === 'read' && f.docs.some((d) => d.type === slot.type))));
}

export function evaluateSlots(input: SlotFitInput): SlotFitResult {
  const { applicants, slots, files, decisions } = input;
  const slotById = new Map(slots.map((s) => [s.id, s]));
  const appById = new Map(applicants.map((a) => [a.id, a]));
  const views: Record<string, SlotView> = {};
  const usable: Record<string, UsableDoc[]> = {};

  for (const slot of slots) {
    views[slot.id] = { slot, state: 'empty', issues: [], files: files.filter((f) => f.slotIds.includes(slot.id)) };
    usable[slot.id] = [];
  }
  const targetSlot = (type: SlotType, applicantId: string) => slots.find((s) => s.type === type && s.applicantId === applicantId);
  const person = (id: string) => appById.get(id)!;

  // earliest file wins when the same bytes show up twice
  const firstByHash = new Map<string, FileEntry>();
  [...files].sort((a, b) => a.addedAt - b.addedAt).forEach((f) => { if (f.status !== 'rejected' && !firstByHash.has(f.hash)) firstByHash.set(f.hash, f); });

  for (const slot of slots) {
    const view = views[slot.id];
    const owner = person(slot.applicantId);
    for (const file of view.files) {
      const issues = view.issues;
      const removeAction: IssueAction = { kind: 'remove', label: 'Remove', fileId: file.id, fromSlotId: slot.id };
      const uploadAction: IssueAction = { kind: 'upload', label: 'Upload a different file', fileId: file.id, fromSlotId: slot.id };

      if (file.status === 'reading') continue;
      if (file.status === 'failed') {
        issues.push({ kind: 'READ_FAILED', severity: 'error', message: 'Couldn’t read this file', detail: file.error, fileId: file.id, actions: [{ kind: 'retry', label: 'Try again', fileId: file.id }, removeAction] });
        continue;
      }
      if (file.status === 'rejected') {
        const unmasked = file.rejectReason === 'UNMASKED_AADHAAR';
        issues.push({
          kind: unmasked ? 'UNMASKED' : 'REJECTED', severity: 'error', message: file.rejectMessage ?? 'This file can’t be used', fileId: file.id,
          actions: [{ kind: 'upload', label: unmasked ? 'Upload the masked copy' : 'Upload a different file', fileId: file.id, fromSlotId: slot.id }, ...(unmasked ? [] : [removeAction])],
        });
        continue;
      }

      // read: duplicates first
      const first = firstByHash.get(file.hash);
      if (first && first.id !== file.id) {
        const where = slotById.get(first.slotIds[0]);
        issues.push({
          kind: 'DUPLICATE', severity: 'warn', message: where && first.slotIds[0] !== slot.id ? `This is the same file as the one in ${where.label}` : 'This file is already in this slot',
          fileId: file.id, actions: [uploadAction, removeAction],
        });
        continue;
      }

      // unmasked Aadhaar (the store drops these on arrival; this keeps the rule testable and safe)
      if (file.docs.some((d) => d.type === 'AADHAAR' && d.fields.fullNumberVisible?.value === 'true')) {
        issues.push({ kind: 'UNMASKED', severity: 'error', message: 'This Aadhaar shows the full number. Upload the masked copy.', fileId: file.id, actions: [{ ...uploadAction, label: 'Upload the masked copy' }] });
        continue;
      }

      // unreadable
      const readable = file.docs.map((d, i) => ({ d, i })).filter(({ d }) => d.type !== 'UNREADABLE' && d.readability !== 'UNREADABLE');
      if (!readable.length) {
        const reason = file.docs.map((d) => d.readabilityReason).find(Boolean);
        issues.push({ kind: 'UNREADABLE', severity: 'error', message: reason ? `We couldn’t read this file: ${reason.toLowerCase()}` : 'We couldn’t read this file', fileId: file.id, actions: [{ ...uploadAction, label: 'Upload a clearer copy' }, removeAction] });
        continue;
      }

      const types = [...new Set(readable.map(({ d }) => d.type).filter(isRealType))];
      const relevant = slot.type === 'SUPPORTING' ? readable : readable.filter(({ d }) => d.type === slot.type);

      if (!relevant.length) {
        const other = readable.find(({ d }) => d.type === 'OTHER');
        if (!types.length && other) {
          issues.push({ kind: 'OTHER_DOC', severity: 'warn', message: `This looks like ${other.d.description ?? 'another kind of document'}, not ${typeShort(slot.type)}`, fileId: file.id, actions: [uploadAction, removeAction] });
          continue;
        }
        const foundType = types.find((t) => targetSlot(t as SlotType, slot.applicantId));
        const target = foundType ? targetSlot(foundType as SlotType, slot.applicantId) : undefined;
        const actions: IssueAction[] = [];
        if (target) {
          const occupied = slotHasContent(target, files.filter((f) => f.id !== file.id));
          actions.push({
            kind: occupied ? 'replace' : 'move',
            label: occupied ? `Replace the ${typeShort(target.type)} there` : `Move to ${typeShort(target.type)}, ${firstName(owner.name)}`,
            fileId: file.id, fromSlotId: slot.id, toSlotId: target.id,
          });
        }
        actions.push(uploadAction, removeAction);
        const wanted = slot.type === 'SALARY_SLIP' ? 'salary slips' : slot.type === 'AADHAAR' ? 'an Aadhaar' : 'a PAN';
        const found = types.map((t) => (t === 'SALARY_SLIP' ? 'salary slips' : t === 'AADHAAR' ? 'an Aadhaar' : 'a PAN')).join(' and ');
        issues.push({ kind: 'WRONG_TYPE', severity: 'warn', message: `This looks like ${found}, not ${wanted}`, fileId: file.id, actions });
        continue;
      }

      // right type: is it the right person?
      let accepted = relevant;
      if (slot.type !== 'SUPPORTING') {
        accepted = [];
        for (const r of relevant) {
          const nm = docName(r.d);
          const tier = nm ? nameTier(nm, nameFor(owner, decisions)) : 'match';
          if (tier !== 'conflict' || decisions.useAnyway.includes(`${file.id}|${slot.id}`)) { accepted.push(r); continue; }
          const better = applicants.find((a) => a.id !== owner.id && nameTier(nm, nameFor(a, decisions)) !== 'conflict');
          const actions: IssueAction[] = [];
          if (better) {
            const t2 = targetSlot(slot.type, better.id);
            if (t2) {
              const occupied = slotHasContent(t2, files.filter((f) => f.id !== file.id));
              actions.push({ kind: occupied ? 'replace' : 'move', label: occupied ? `Replace ${typeShort(slot.type)}, ${firstName(better.name)}` : `Move to ${typeShort(slot.type)}, ${firstName(better.name)}`, fileId: file.id, fromSlotId: slot.id, toSlotId: t2.id });
            }
          } else {
            actions.push({ kind: 'useAnyway', label: 'Use it anyway', fileId: file.id, fromSlotId: slot.id });
          }
          actions.push(uploadAction);
          const what = slot.type === 'SALARY_SLIP' ? 'salary slip' : DOC_TYPE_LABEL[slot.type];
          issues.push({
            kind: 'WRONG_PERSON', severity: 'warn', fileId: file.id, actions,
            message: better ? `This ${what} is in the name of ${nm}, which matches ${better.name}` : `This ${what} is in the name of ${nm}`,
            detail: better ? undefined : 'If this is a maiden name or a spelling variant, you can use it anyway and we’ll ask you to confirm.',
          });
        }
        if (!accepted.length) continue;
      }

      // partly readable
      if (accepted.some(({ d }) => d.readability === 'PARTIAL')) {
        const reason = accepted.map(({ d }) => d.readabilityReason).find(Boolean);
        issues.push({ kind: 'PARTIAL', severity: 'info', message: `Only part of this file is readable${reason ? ': ' + reason.toLowerCase() : ''}. We filled what we could read clearly.`, fileId: file.id, actions: [{ ...uploadAction, label: 'Upload a clearer copy' }] });
      }

      // several documents in one file
      if (slot.type !== 'SUPPORTING' && file.slotIds.length === 1) {
        for (const t of types) {
          if (t === slot.type) continue;
          const t2 = targetSlot(t as SlotType, slot.applicantId);
          if (!t2 || slotHasContent(t2, files.filter((f) => f.id !== file.id))) continue;
          const part = readable.find(({ d }) => d.type === t);
          const nm = part ? docName(part.d) : null;
          if (nm && nameTier(nm, nameFor(owner, decisions)) === 'conflict') continue;
          issues.push({ kind: 'MULTI_DOC', severity: 'info', message: `This file also holds ${t === 'SALARY_SLIP' ? 'salary slips' : 'a ' + DOC_TYPE_LABEL[t]}`, fileId: file.id, actions: [{ kind: 'attachBoth', label: 'Use this file for both', fileId: file.id, fromSlotId: slot.id, toSlotId: t2.id }] });
        }
      }

      for (const r of accepted) usable[slot.id].push({ docKey: docKeyOf(file.id, r.i), doc: filterPartial(r.d), file, slot });
    }

    // completeness across all files in the slot: checked before any comparison
    const docs = usable[slot.id];
    if (slot.type === 'AADHAAR' && docs.length) {
      const sides = new Set(docs.map((u) => u.doc.fields.sidesPresent?.value).filter(Boolean));
      if (!sides.has('both') && !sides.has('back')) {
        view.issues.push({ kind: 'AADHAAR_BACK_MISSING', severity: 'warn', message: 'Address side missing', detail: 'Add a second file with the back of the Aadhaar. The address comes from there.', actions: [{ kind: 'addFile', label: 'Add the back side', fromSlotId: slot.id }] });
      }
    }
    if (slot.type === 'SALARY_SLIP' && docs.length) {
      const want = slot.months ?? [];
      const have = [...new Set(docs.map((u) => parsePayMonth(u.doc.fields.payMonth?.value)).filter((m): m is string => !!m))].sort();
      const covered = want.filter((m) => have.includes(m));
      const missing = want.filter((m) => !have.includes(m));
      const outOfRange = have.filter((m) => !want.includes(m));
      view.coverage = { covered, missing, outOfRange };
      if (missing.length || outOfRange.length) {
        const parts: string[] = [];
        if (covered.length) parts.push(`Covers ${covered.map(monthLabel).join(', ')}`);
        if (missing.length) parts.push(`Missing ${missing.map(monthLabel).join(', ')}`);
        if (outOfRange.length) parts.push(`${outOfRange.map(monthLabel).join(', ')} ${outOfRange.length > 1 ? 'are' : 'is'} outside the months we need`);
        view.issues.push({ kind: 'SALARY_COVERAGE', severity: 'warn', message: parts.join('. '), actions: [{ kind: 'addFile', label: missing.length ? 'Add the missing slips' : 'Add a file', fromSlotId: slot.id }] });
      }
    }
  }

  for (const slot of slots) finishState(views[slot.id], usable[slot.id], decisions);
  return { views, usable };
}

function finishState(view: SlotView, docs: UsableDoc[], decisions: Decisions) {
  const { files, issues, slot } = view;
  let state: SlotState;
  if (files.some((f) => f.status === 'reading')) state = 'reading';
  else if (issues.some((i) => i.kind === 'READ_FAILED')) state = 'failed';
  else if (issues.some((i) => i.severity !== 'info')) state = 'attention';
  else if (docs.length) state = 'done';
  else if (!files.length && decisions.later.includes(slot.id)) state = 'later';
  else if (files.length && !issues.length) state = 'done';
  else state = files.length ? 'attention' : 'empty';
  view.state = state;
  if (state === 'done') view.summary = summarize(slot, docs, files);
}

export function summarize(slot: SlotConfig, docs: UsableDoc[], files: FileEntry[]): string {
  if (slot.type === 'SUPPORTING') return files.map((f) => f.name).join(', ');
  const f = (u: UsableDoc, k: keyof ExtractedDoc['fields']) => u.doc.fields[k]?.value ?? null;
  const first = docs[0];
  if (!first) return '';
  if (slot.type === 'PAN') { const dob = formatDob(parseDob(f(first, 'dob'))); return [f(first, 'name'), dob ? `DOB ${dob}` : null].filter(Boolean).join(', '); }
  if (slot.type === 'AADHAAR') {
    const l4 = docs.map((u) => f(u, 'last4')).find(Boolean);
    return [docs.map((u) => f(u, 'name')).find(Boolean), l4 ? `ending ${l4}` : null].filter(Boolean).join(', ');
  }
  const months = [...new Set(docs.map((u) => parsePayMonth(f(u, 'payMonth'))).filter((m): m is string => !!m))].sort();
  return `${docs.map((u) => f(u, 'employeeName')).find(Boolean) ?? 'Salary slips'}: ${months.map(monthLabel).join(', ')}`;
}
