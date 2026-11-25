import { analyze } from '../analyze';
import { emptyDecisions, type Applicant, type Decisions, type FileEntry } from '../types';
import { buildSlots } from '../slotConfig';
import { SCENARIOS, type ScenarioBuild } from '../mock/scenarios';

export const APPS: Applicant[] = [
  { id: 'a1', name: 'Sameer Joshi', role: 'Applicant', sample: { pan: 'BQJPJ6612C', last4: '6612', address: 'B-12, Mayur Colony, Kothrud, Pune 411038', age: 36, employer: 'Bluewave Logistics Tech Pvt Ltd', netPay: 124000 } },
  { id: 'a2', name: 'Pooja Joshi', role: 'Co-applicant', sample: { pan: 'CPJPJ3390K', last4: '3390', address: 'B-12, Mayur Colony, Kothrud, Pune 411038', age: 34, employer: 'Deccan College of Commerce', netPay: 62000 } },
];
export const DOCS = ['pan_a1', 'adh_a1', 'sal_a1', 'pan_a2', 'adh_a2', 'sal_a2'].map((id) => ({ id, t: id, need: 'pre' }));
export const SLOTS = buildSlots(DOCS, APPS);

let n = 0;
export function fileFrom(name: string, slotIds: string[], build: ScenarioBuild, over: Partial<FileEntry> = {}): FileEntry {
  n++;
  return { id: `f${n}`, name, mime: 'image/jpeg', size: 1000, hash: 'h:' + name, slotIds, status: 'read', docs: build.fixtures[name].documents, virtual: true, addedAt: n, ...over };
}
export function scenarioFiles(id: string, apps = APPS): { files: FileEntry[]; build: ScenarioBuild } {
  const build = SCENARIOS.find((s) => s.id === id)!.build(apps);
  return { files: build.uploads.map((u) => fileFrom(u.sample, [u.slotId], build)), build };
}
export const run = (files: FileEntry[], decisions: Decisions = emptyDecisions(), apps = APPS, slots = SLOTS) => analyze({ applicants: apps, slots, files, decisions });
export const field = (a: ReturnType<typeof run>, app: string, key: string) => a.applicants[app].fields.find((f) => f.key === key);
