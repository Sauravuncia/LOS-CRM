import type { Analysis, Decisions, FieldRecord } from './types';

/** Fields whose current value came from this file. Used to ask what to do when the file is removed. */
export function fieldsFilledFrom(analysis: Analysis, fileId: string): FieldRecord[] {
  return Object.values(analysis.applicants).flatMap((a) => a.fields.filter((f) => typeof f.source === 'object' && f.source !== null && f.source.fileId === fileId));
}

/** "Keep them as manual values": freeze the fields the file filled so they survive its removal. */
export function freezeAsManual(analysis: Analysis, fileId: string, decisions: Decisions): Decisions {
  const manual = { ...decisions.manual };
  for (const f of fieldsFilledFrom(analysis, fileId)) if (f.value) manual[`${f.applicantId}.${f.key}`] = f.value;
  return { ...decisions, manual };
}

/**
 * When a file is replaced, anything the user edited by hand is kept. A manual value that now differs from the new
 * document shows up as "Check" through the normal comparison, so nothing is overwritten silently.
 */
export function editedByHand(decisions: Decisions, applicantId: string): string[] {
  return Object.keys(decisions.manual).filter((k) => k.startsWith(`${applicantId}.`)).map((k) => k.slice(applicantId.length + 1));
}
