import { analyzeApplicant } from './fields';
import { evaluateSlots, type SlotFitInput } from './slotFit';
import { supportingSlot } from './slotConfig';
import type { Analysis, ApplicantView, FieldRecord, FieldKey, FileEntry, Issue, SlotConfig } from './types';

/**
 * Everything the screen shows is derived from the inputs here: files, their extractions and the
 * user's decisions. No model calls, no clock, no randomness, so the same inputs give the same screen.
 */
export function analyze(input: SlotFitInput): Analysis {
  const { applicants, files, decisions } = input;

  // a "supporting document" slot appears when the user chose that option for a conflict
  const slots: SlotConfig[] = [...input.slots];
  for (const a of applicants) if (decisions.resolutions[a.id]?.option === 'support' && !slots.some((s) => s.type === 'SUPPORTING' && s.applicantId === a.id)) slots.push(supportingSlot(a));

  const { views, usable } = evaluateSlots({ ...input, slots });
  const out: Analysis = { slots: views, applicants: {}, slotOrder: slots.map((s) => s.id) };

  for (const a of applicants) {
    const mine = slots.filter((s) => s.applicantId === a.id && s.type !== 'SUPPORTING');
    const ready = !mine.some((s) => views[s.id].files.some((f: FileEntry) => f.status === 'reading'));
    if (!ready) {
      // the comparison waits until every pending file of this applicant has been read
      const fields: FieldRecord[] = [];
      const name = decisions.manual[`${a.id}.name`] ?? a.name;
      if (name) fields.push({ key: 'name', applicantId: a.id, value: name, source: decisions.manual[`${a.id}.name`] ? 'manual' : 'lead', status: 'filled' });
      out.applicants[a.id] = { id: a.id, ready: false, fields, conflict: null, conflictResolved: false } satisfies ApplicantView;
      continue;
    }
    const res = analyzeApplicant(a, mine.flatMap((s) => usable[s.id]), decisions);
    out.applicants[a.id] = { id: a.id, ready: true, fields: res.fields, conflict: res.conflict, conflictResolved: res.conflictResolved };

    for (const [slotId, reason] of Object.entries(res.correctedSlots)) {
      const v = views[slotId];
      const issue: Issue = { kind: 'CORRECTED_COPY', severity: 'warn', message: 'Upload a corrected copy', detail: reason, actions: [{ kind: 'upload', label: 'Upload a corrected copy', fromSlotId: slotId }] };
      v.issues.push(issue);
      if (v.state === 'done') v.state = 'attention';
      v.summary = undefined;
    }
    for (const slotId of res.laterSlots) {
      const v = views[slotId];
      v.state = 'later';
      v.summary = 'Upload later. Its data is not used until then.';
    }
  }
  return out;
}

export const isPending = (a: Analysis, slotId: string) => { const s = a.slots[slotId]?.state; return s !== 'done'; };

/** Form values by `${applicantId}.${key}`, for the rest of the app to read. */
export function formValues(a: Analysis): Record<string, FieldRecord> {
  const out: Record<string, FieldRecord> = {};
  for (const v of Object.values(a.applicants)) for (const f of v.fields) out[`${f.applicantId}.${f.key as FieldKey}`] = f;
  return out;
}
