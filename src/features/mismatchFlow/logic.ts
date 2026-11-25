/** Pure helpers. The backend decides what differs; this only shapes its answer for the screen. */
import type { FieldDef, Mismatch, MismatchResolution, ReadValue, UploadedDoc } from './types';

export interface Group { key: string; a: string; b: string; rows: Mismatch[] }

export const pairKey = (m: Mismatch) => [m.left.doc_id, m.right.doc_id].sort().join('|');

/** Open mismatches grouped by pair of documents. In each group, document A is always on the left. */
export function groupOpen(mismatches: Mismatch[]): Group[] {
  const map = new Map<string, Group>();
  for (const m of mismatches) {
    if (m.status !== 'open') continue;
    const key = pairKey(m), [a, b] = key.split('|');
    const g = map.get(key) ?? { key, a, b, rows: [] };
    g.rows.push(m.left.doc_id === a ? m : { ...m, left: m.right, right: m.left });
    map.set(key, g);
  }
  return [...map.values()];
}

const norm = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
/** Splits a value into words and flags the ones that do not appear in the other value. */
export function tokenDiff(value: string, other: string): { text: string; diff: boolean }[] {
  const seen = new Set(other.split(/\s+/).map(norm).filter(Boolean));
  return value.split(/\s+/).filter(Boolean).map((text) => ({ text, diff: !seen.has(norm(text)) }));
}

export interface OtherRow { key: string; label: string; a?: ReadValue; b?: ReadValue }
/** Every detail either document holds that is not already a differing row. Only visible form fields. */
export function otherDetails(a: UploadedDoc | undefined, b: UploadedDoc | undefined, rows: Mismatch[], defs: FieldDef[]): OtherRow[] {
  const skip = new Set(rows.flatMap((r) => [r.left.key, r.right.key]));
  const byKey = new Map(defs.map((d) => [d.key, d]));
  const keys = new Set([...Object.keys(a?.values ?? {}), ...Object.keys(b?.values ?? {})]);
  const out: OtherRow[] = [];
  for (const key of keys) {
    const d = byKey.get(key);
    if (skip.has(key) || !d || d.hidden || d.placement !== 'form') continue;
    const va = a?.values[key], vb = b?.values[key];
    if (!va?.value && !vb?.value) continue;
    const label = d.subgroup && /address/i.test(d.subgroup) ? `${d.subgroup}: ${d.label}` : d.label;
    out.push({ key, label, a: va?.value ? va : undefined, b: vb?.value ? vb : undefined });
  }
  return out;
}

/**
 * Next form values after a new analysis. Fills what the user has not edited, and clears what an earlier
 * analysis filled that has now gone (document parked, removed or replaced) unless the user changed it.
 */
export function reconcilePrefill(prevAuto: Record<string, string>, nextAuto: Record<string, string>, edited: ReadonlySet<string>, current: Record<string, string>): Record<string, string> {
  const out = { ...current };
  for (const [k, v] of Object.entries(nextAuto)) if (!edited.has(k)) out[k] = v;
  for (const [k, v] of Object.entries(prevAuto)) if (!(k in nextAuto) && !edited.has(k) && out[k] === v) delete out[k];
  return out;
}

export function buildResolutions(mismatches: Mismatch[]): MismatchResolution[] {
  return mismatches.filter((m) => m.status !== 'open').map((m) => ({
    id: m.id, label: m.label, left_doc: m.left.doc_label, right_doc: m.right.doc_label,
    resolution: m.status === 'skipped' ? 'Accepted both as they are'
      : m.chosen_doc_id === m.left.doc_id || m.chosen_doc_id === m.right.doc_id
        ? `Used ${m.chosen_doc_id === m.left.doc_id ? m.left.doc_label : m.right.doc_label}`
        : 'Used neither (entered manually)',
  }));
}
