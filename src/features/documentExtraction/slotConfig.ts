import { DEFAULT_SALARY_MONTHS } from './constants';
import type { Applicant, SlotConfig, SlotType } from './types';

export interface CaseDocLite { id: string; t: string; need?: string; months?: string[] }

const PREFIX: Record<string, SlotType> = { pan: 'PAN', adh: 'AADHAAR', sal: 'SALARY_SLIP' };

/** Turns the case's pre-screen document list into slot configs. Salary months come from here. */
export function buildSlots(docs: CaseDocLite[], applicants: Applicant[]): SlotConfig[] {
  const out: SlotConfig[] = [];
  for (const d of docs) {
    const m = /^([a-z]+)_(a\d+)$/.exec(d.id);
    if (!m || !PREFIX[m[1]] || !applicants.some((a) => a.id === m[2])) continue;
    const type = PREFIX[m[1]];
    out.push({ id: d.id, type, applicantId: m[2], label: d.t, months: type === 'SALARY_SLIP' ? d.months ?? DEFAULT_SALARY_MONTHS : undefined });
  }
  return out;
}

export const supportingSlotId = (applicantId: string) => `sup_${applicantId}`;
export const supportingSlot = (applicant: Applicant): SlotConfig => ({
  id: supportingSlotId(applicant.id), type: 'SUPPORTING', applicantId: applicant.id,
  label: `Marriage certificate or name-change declaration, ${applicant.name.split(/\s+/)[0]}`,
});

export const firstName = (n: string) => n.trim().split(/\s+/)[0] ?? n;
export const typeShort = (t: SlotType) => (t === 'AADHAAR' ? 'Aadhaar' : t === 'PAN' ? 'PAN' : t === 'SALARY_SLIP' ? 'salary slips' : 'document');
