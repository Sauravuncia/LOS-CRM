/**
 * Files picked in the "New lead" form, before the lead exists. They are kept in memory only and handed to the
 * document store when the lead is created, so the usual reading and checking runs on them.
 */
export type DraftSlot = 'pan_a1' | 'adh_a1' | 'sal_a1' | 'pan_a2' | 'adh_a2' | 'sal_a2';

let files: Partial<Record<DraftSlot, File>> = {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const leadDraft = {
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  get: () => files,
  set(slot: DraftSlot, file: File | null) {
    const next = { ...files };
    if (file) next[slot] = file; else delete next[slot];
    files = next; emit();
  },
};
export const clearDraft = () => { files = {}; emit(); };
/** The picked files, leaving out the co-applicant's when the lead has no co-applicant. Empties the draft. */
export function takeDraft(withCo: boolean): Partial<Record<DraftSlot, File>> {
  const out = Object.fromEntries(Object.entries(files).filter(([k]) => withCo || !k.endsWith('_a2'))) as Partial<Record<DraftSlot, File>>;
  clearDraft();
  return out;
}
