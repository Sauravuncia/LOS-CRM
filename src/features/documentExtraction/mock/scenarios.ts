import type { Applicant, ExtractedDoc, Extraction, FieldRead, RawFieldName } from '../types';
import { RAW_FIELDS } from '../types';

/** Fixture readings and the sample scenarios behind "Load the sample files". Mock mode only. */
export interface SampleUpload { slotId: string; sample: string }
export interface ScenarioBuild { uploads: SampleUpload[]; fixtures: Record<string, Extraction> }
export interface Scenario { id: string; label: string; description: string; needsCoApplicant?: boolean; build(applicants: Applicant[]): ScenarioBuild }

const F = (value: string | null, confidence = 0.97): FieldRead => ({ value, confidence: value == null ? 0 : confidence });
const blank = () => Object.fromEntries(RAW_FIELDS.map((k) => [k, F(null)])) as Record<RawFieldName, FieldRead>;

interface DocOpts { readability?: ExtractedDoc['readability']; reason?: string; conf?: number; description?: string }
function doc(type: ExtractedDoc['type'], vals: Partial<Record<RawFieldName, string | null>>, o: DocOpts = {}): ExtractedDoc {
  const fields = blank();
  for (const [k, v] of Object.entries(vals) as [RawFieldName, string | null][]) fields[k] = F(v, o.conf ?? 0.97);
  return { type, readability: o.readability ?? 'GOOD', readabilityReason: o.reason ?? null, description: o.description ?? null, fields };
}

const first = (a: Applicant) => a.name.split(/\s+/)[0];
const last = (a: Applicant) => a.name.split(/\s+/).slice(-1)[0];
const hash = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dobOf(a: Applicant) {
  const h = hash(a.id + a.name), y = 2026 - (a.sample?.age ?? 35), m = 1 + (h % 12), d = 1 + ((h >>> 4) % 27);
  return { y, m, d, printed: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`, other: `${String(d + 1).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}` };
}
const panNo = (a: Applicant) => a.sample?.pan ?? 'ABCDE1234F';
const last4 = (a: Applicant) => a.sample?.last4 ?? '1234';
const addr = (a: Applicant) => a.sample?.address ?? '12, Sample Road, Pune 411001';
const employer = (a: Applicant) => a.sample?.employer ?? 'Sample Employer Pvt Ltd';
const net = (a: Applicant) => a.sample?.netPay ?? 90000;

const panDoc = (a: Applicant, over: Partial<Record<RawFieldName, string | null>> = {}, o?: DocOpts) =>
  doc('PAN', { name: a.name.toUpperCase(), fatherName: `RAMESH ${last(a).toUpperCase()}`, dob: dobOf(a).printed, panNumber: panNo(a), ...over }, o);
const aadhaarDoc = (a: Applicant, over: Partial<Record<RawFieldName, string | null>> = {}, o?: DocOpts) =>
  doc('AADHAAR', { name: a.name, dob: dobOf(a).printed, gender: 'Male', address: addr(a), relationLine: `S/O Ramesh ${last(a)}`, sidesPresent: 'both', last4: last4(a), fullNumberVisible: 'false', ...over }, o);
const slip = (a: Applicant, month: string, over: Partial<Record<RawFieldName, string | null>> = {}) =>
  doc('SALARY_SLIP', { employeeName: a.name, employer: employer(a), payMonth: month, grossPay: String(Math.round(net(a) * 1.18)), netPay: String(net(a)), payslipPan: panNo(a), employeeId: 'E' + (1000 + (hash(a.id) % 8000)), ...over });

const slotsOf = (a: Applicant) => ({ pan: `pan_${a.id}`, adh: `adh_${a.id}`, sal: `sal_${a.id}` });
const MONTHS3 = ['August 2026', 'September 2026', 'October 2026'];

interface Parts { uploads: SampleUpload[]; fixtures: Record<string, Extraction> }
const put = (p: Parts, slotId: string, sample: string, docs: ExtractedDoc[]) => { p.uploads.push({ slotId, sample }); p.fixtures[sample] = { documents: docs }; };

/** A clean, complete set for one applicant. `skip` leaves a slot out so a scenario can change it. */
function clean(p: Parts, a: Applicant, skip: Array<'pan' | 'adh' | 'sal'> = []) {
  const s = slotsOf(a), n = first(a);
  if (!skip.includes('pan')) put(p, s.pan, `PAN_${n}.jpg`, [panDoc(a)]);
  if (!skip.includes('adh')) put(p, s.adh, `Aadhaar_${n}.pdf`, [aadhaarDoc(a)]);
  if (!skip.includes('sal')) put(p, s.sal, `Payslips_${n}.pdf`, MONTHS3.map((m) => slip(a, m)));
}
const only = (applicants: Applicant[]) => applicants.filter((a) => a.sample?.netPay || a.role === 'Applicant');

export const SCENARIOS: Scenario[] = [
  {
    id: 'clean', label: 'A clean set', description: 'PAN, Aadhaar and three salary slips for each applicant. Everything matches.',
    build(apps) { const p: Parts = { uploads: [], fixtures: {} }; apps.forEach((a) => clean(p, a)); return p; },
  },
  {
    id: 'pan-in-aadhaar-slot', label: 'A PAN in the Aadhaar slot', description: 'The first applicant’s PAN is in the Aadhaar slot. We offer to move it.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['pan', 'adh']); put(p, slotsOf(a).adh, `PAN_${first(a)}.jpg`, [panDoc(a)]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'other-persons-pan', label: 'The co-applicant’s PAN in the applicant’s slot', needsCoApplicant: true,
    description: 'The most common joint-application mistake. We offer to move it to the right person.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const [a, b] = apps;
      clean(p, a, ['pan']); put(p, slotsOf(a).pan, `PAN_${first(b)}.jpg`, [panDoc(b)]);
      clean(p, b, ['pan']); return p;
    },
  },
  {
    id: 'aadhaar-front-only', label: 'An Aadhaar with only the front side', description: 'The address side is missing. We ask for a second file.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['adh']); put(p, slotsOf(a).adh, `Aadhaar_${first(a)}_front.jpg`, [aadhaarDoc(a, { sidesPresent: 'front', address: null, relationLine: null })]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'unmasked-aadhaar', label: 'An unmasked Aadhaar', description: 'The full number is visible. We refuse the file and ask for the masked copy.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['adh']); put(p, slotsOf(a).adh, `Aadhaar_${first(a)}_unmasked.jpg`, [aadhaarDoc(a, { fullNumberVisible: 'true' })]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'minor-name-difference', label: 'A minor name difference', description: '"S. Joshi" on the Aadhaar against the full name on the PAN. We fill it and ask for a quick check.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['adh']); put(p, slotsOf(a).adh, `Aadhaar_${first(a)}.pdf`, [aadhaarDoc(a, { name: `${first(a)[0]}. ${last(a)}` })]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'married-name-conflict', label: 'A married-name conflict', description: 'The PAN carries a different surname from the Aadhaar and the salary slips. Opens the conflict dialog.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[apps.length > 1 ? 1 : 0];
      apps.filter((x) => x !== a).forEach((b) => clean(p, b));
      clean(p, a, ['pan']); put(p, slotsOf(a).pan, `PAN_${first(a)}.jpg`, [panDoc(a, { name: `${first(a)} Sharma`.toUpperCase(), fatherName: 'RAMESH SHARMA' })]);
      return p;
    },
  },
  {
    id: 'dob-conflict', label: 'A date-of-birth conflict', description: 'The PAN and the Aadhaar show different dates of birth. Opens the conflict dialog.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['adh']); put(p, slotsOf(a).adh, `Aadhaar_${first(a)}.pdf`, [aadhaarDoc(a, { dob: dobOf(a).other })]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'year-only-aadhaar', label: 'An Aadhaar that shows only the year of birth', description: 'No mismatch: the year matches the PAN, so the full date comes from the PAN.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['adh']); put(p, slotsOf(a).adh, `Aadhaar_${first(a)}.pdf`, [aadhaarDoc(a, { dob: String(dobOf(a).y) })]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'missing-september', label: 'Salary slips missing September', description: 'A PDF with August and October only. We say which month is missing.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['sal']); put(p, slotsOf(a).sal, `Payslips_${first(a)}.pdf`, [slip(a, 'August 2026'), slip(a, 'October 2026')]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
  {
    id: 'blurry-image', label: 'A blurry image', description: 'The PAN photo cannot be read. We show why and ask for a clearer copy.',
    build(apps) {
      const p: Parts = { uploads: [], fixtures: {} }; const a = apps[0];
      clean(p, a, ['pan']); put(p, slotsOf(a).pan, `PAN_${first(a)}_blurry.jpg`, [doc('UNREADABLE', {}, { readability: 'UNREADABLE', reason: 'Blurred, and the text is out of focus' })]);
      apps.slice(1).forEach((b) => clean(p, b)); return p;
    },
  },
];
void only;
