import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { analyzeDocuments, ApiError, extractDocument, getFields, getRequirements, isAbort, submitApplication } from './api';
import { buildResolutions, groupOpen, reconcilePrefill } from './logic';
import type { AnalyzeResponse, DocTypeDef, FieldDef, SubmissionIssue, UploadedDoc } from './types';

/* All state lives in memory. Files and extracted values are never persisted or logged. */

interface RunOpts { docType?: string; force?: boolean; replaceId?: string; slotId?: string }
export interface Toast { id: number; kind: 'error' | 'info'; text: string }

const MAX_PARALLEL = 3;
let active = 0;
const waiting: (() => void)[] = [];
async function limited<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r));
  active++;
  try { return await fn(); } finally { active--; waiting.shift()?.(); }
}

const isPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
const uuid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `d${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`);

export function useMismatchFlow(context?: Record<string, string>) {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [excluded, setExcluded] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [docTypes, setDocTypes] = useState<DocTypeDef[]>([]);
  const [fieldDefs, setFieldDefs] = useState<FieldDef[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [issues, setIssues] = useState<SubmissionIssue[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const files = useRef(new Map<string, File>());
  const runOpts = useRef(new Map<string, RunOpts>());
  const edited = useRef(new Set<string>());
  const autoFilled = useRef<Record<string, string>>({});
  const typesRef = useRef<DocTypeDef[]>([]);
  typesRef.current = docTypes;

  const toast = useCallback((text: string, kind: Toast['kind'] = 'error') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  const typeLabel = useCallback((id: string | null | undefined) => docTypes.find((t) => t.id === id)?.label ?? id ?? 'document', [docTypes]);

  /* ---------- reference data ---------- */
  useEffect(() => {
    getRequirements().then((r) => setDocTypes(r.doc_types ?? [])).catch((e) => toast((e as Error).message));
    getFields().then(setFieldDefs).catch(() => { /* labels fall back to the field key */ });
  }, [toast]);

  /* ---------- upload and read ---------- */
  const patchDoc = (id: string, patch: Partial<UploadedDoc>) => setDocs((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  /** Finishes a read. A replaced document leaves in the same update, so old and new are never both in the list. */
  const settle = (id: string, patch: Partial<UploadedDoc>, dropId?: string) => {
    setDocs((p) => {
      const next = p.map((d) => (d.id === id ? { ...d, ...patch } : d));
      return dropId ? next.filter((d) => d.id !== dropId) : next;
    });
    if (dropId) { files.current.delete(dropId); runOpts.current.delete(dropId); }
  };

  const run = useCallback(async (id: string, file: File, opts: RunOpts) => {
    runOpts.current.set(id, opts);
    const def = typesRef.current.find((t) => t.id === opts.docType);
    if (!isPdf(file) || (def && !def.extract)) {
      // photos and reference-only types stay in the browser
      settle(id, { status: 'ready', docType: opts.docType ?? 'photo', slotId: opts.slotId ?? opts.docType ?? 'photo', values: {}, note: 'Kept for reference. Not read.' }, opts.replaceId);
      return;
    }
    try {
      const r = await limited(() => extractDocument(file, opts.docType, opts.force));
      if (r.wrong_document && r.doc_type) {
        // file it as what it really is; the expected document is still missing (and a parked original stays parked)
        settle(id, {
          status: 'ready', docType: r.doc_type, slotId: r.doc_type, values: r.values, warning: r.warning ?? undefined,
          note: `This looks like your ${typeLabel(r.doc_type)}, not your ${typeLabel(r.expected_type ?? opts.docType)}`,
        });
        toast(`This looks like your ${typeLabel(r.doc_type)}, not your ${typeLabel(r.expected_type ?? opts.docType)}. Please upload the ${typeLabel(r.expected_type ?? opts.docType)}.`);
        return;
      }
      if (r.needs_type || !r.doc_type) { settle(id, { status: 'needs_type', docType: '', values: {}, warning: r.warning ?? undefined }); return; }
      settle(id, { status: 'ready', docType: r.doc_type, slotId: opts.slotId ?? r.doc_type, values: r.values, warning: r.warning ?? undefined, error: undefined, note: undefined }, opts.replaceId);
    } catch (e) {
      settle(id, { status: 'failed', error: (e as ApiError).message || 'The reader did not answer' });
    }
  }, [toast, typeLabel]);

  const upload = useCallback((file: File, opts: RunOpts = {}) => {
    const id = uuid();
    files.current.set(id, file);
    setDocs((p) => [...p, { id, slotId: opts.slotId ?? opts.docType ?? 'pending', docType: opts.docType ?? '', filename: file.name, status: 'reading', values: {} }]);
    void run(id, file, opts);
  }, [run]);

  const uploadMany = (list: File[], docType?: string) => list.forEach((f) => upload(f, { docType }));
  /** Replace keeps type and slot; the old document stays until the new one is read. */
  const replace = (id: string, file: File) => {
    const old = docs.find((d) => d.id === id);
    if (old) upload(file, { docType: old.docType || undefined, slotId: old.slotId, replaceId: id });
  };
  /** Re-sends the stored file as the chosen type. */
  const changeType = (id: string, docType: string) => {
    const f = files.current.get(id);
    if (!f) return;
    const old = docs.find((d) => d.id === id);
    upload(f, { docType, force: true, replaceId: id, slotId: old?.status === 'needs_type' ? docType : undefined });
  };
  const retry = (id: string) => {
    const f = files.current.get(id);
    if (!f) return;
    patchDoc(id, { status: 'reading', error: undefined });
    void run(id, f, runOpts.current.get(id) ?? {});
  };
  const remove = (id: string) => { files.current.delete(id); runOpts.current.delete(id); setDocs((p) => p.filter((d) => d.id !== id)); };

  /* ---------- analyze: debounced, aborted when superseded ---------- */
  const ready = useMemo(() => docs.filter((d) => d.status === 'ready'), [docs]);
  const analyzeKey = JSON.stringify([ready.map((d) => [d.id, d.slotId, d.docType, d.values]), acknowledged, choices, excluded, context]);
  useEffect(() => {
    if (!ready.length) { setAnalysis(null); return; }
    const ctl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await analyzeDocuments({
          documents: ready.map((d) => ({ doc_id: d.id, slot_id: d.slotId, doc_type: d.docType, filename: d.filename, values: d.values })),
          context, acknowledged, choices, excluded,
        }, ctl.signal);
        if (!ctl.signal.aborted) setAnalysis(res);
      } catch (e) {
        if (isAbort(e) || ctl.signal.aborted) return;
        toast((e as Error).message);
      }
    }, 250);
    return () => { clearTimeout(t); ctl.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyzeKey]);

  /* ---------- pre-fill the form from the merged fields ---------- */
  useEffect(() => {
    if (!analysis) {
      const prev = autoFilled.current;
      autoFilled.current = {};
      setForm((cur) => reconcilePrefill(prev, {}, edited.current, cur));
      return;
    }
    const prev = autoFilled.current; // captured before the ref is replaced
    const next: Record<string, string> = {};
    for (const f of Object.values(analysis.fields)) if (f.value) next[f.key] = f.value;
    autoFilled.current = next;
    setForm((cur) => reconcilePrefill(prev, next, edited.current, cur));
  }, [analysis]);

  const setField = (key: string, value: string) => { edited.current.add(key); setForm((f) => ({ ...f, [key]: value })); };

  /* ---------- resolving ---------- */
  const groups = useMemo(() => groupOpen(analysis?.mismatches ?? []), [analysis]);
  const park = (...ids: string[]) => setDocs((p) => p.map((d) => (ids.includes(d.id) && d.status === 'ready' ? { ...d, status: 'parked' } : d)));
  const useAnyway = (id: string) => setDocs((p) => p.map((d) => (d.id === id && d.status === 'parked' ? { ...d, status: 'ready' } : d)));

  const applyChoices = (a: string, b: string, picks: Record<string, string>, unticked: string[]) => {
    setChoices((c) => ({ ...c, ...picks }));
    setExcluded((e) => [...e.filter((x) => !x.startsWith(`${a}|`) && !x.startsWith(`${b}|`)), ...unticked]);
  };
  const trust = (trustedId: string, otherId: string) => park(otherId);
  const skipForNow = (a: string, b: string) => park(a, b);
  const acceptBoth = (ids: string[]) => setAcknowledged((x) => [...new Set([...x, ...ids])]);

  /* ---------- blockers and submit ---------- */
  const openCount = analysis?.open_mismatches.length ?? 0;
  const parked = docs.filter((d) => d.status === 'parked');
  const missing = analysis?.missing ?? [];
  const blocked = openCount > 0 || missing.length > 0 || parked.length > 0 || docs.some((d) => d.status === 'reading' || d.status === 'needs_type' || d.status === 'failed');

  const submit = async () => {
    if (!analysis || blocked) return;
    setSubmitting(true); setIssues([]);
    try {
      await submitApplication({
        values: form,
        documents: ready.map((d) => ({ doc_id: d.id, slot_id: d.slotId, doc_type: d.docType, filename: d.filename, values: {} })),
        mismatch_resolutions: buildResolutions(analysis.mismatches),
      });
      setSubmitted(true);
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 422) setIssues(err.issues); else toast(err.message);
    } finally { setSubmitting(false); }
  };

  return {
    docs, docTypes, fieldDefs, form, analysis, groups, toasts, issues, submitting, submitted, blocked, openCount, parked, missing, choices, excluded, typeLabel,
    uploadMany, replace, changeType, retry, remove, setField, applyChoices, trust, skipForNow, acceptBoth, useAnyway, submit, toast,
    editedKeys: edited.current,
  };
}
export type MismatchFlow = ReturnType<typeof useMismatchFlow>;
