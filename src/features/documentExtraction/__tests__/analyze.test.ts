import { describe, expect, it } from 'vitest';
import { emptyDecisions, type Decisions, type Resolution } from '../types';
import { SCENARIOS } from '../mock/scenarios';
import { fieldsFilledFrom, freezeAsManual } from '../provenance';
import { APPS, field, fileFrom, run, scenarioFiles } from './helpers';

const kinds = (a: ReturnType<typeof run>, slot: string) => a.slots[slot].issues.map((i) => i.kind);
const actions = (a: ReturnType<typeof run>, slot: string, kind: string) => a.slots[slot].issues.find((i) => i.kind === kind)?.actions ?? [];

describe('clean set', () => {
  const { files } = scenarioFiles('clean');
  const a = run(files);
  it('every slot is done with a one-line summary', () => {
    for (const id of ['pan_a1', 'adh_a1', 'sal_a1', 'pan_a2', 'adh_a2', 'sal_a2']) expect(a.slots[id].state).toBe('done');
    expect(a.slots.pan_a1.summary).toMatch(/^SAMEER JOSHI, DOB \d{1,2} \w{3} \d{4}$/);
    expect(a.slots.adh_a1.summary).toBe('Sameer Joshi, ending 6612');
    expect(a.slots.sal_a1.summary).toContain('Aug 2026, Sep 2026, Oct 2026');
  });
  it('fills the form from the suggested sources with provenance and no conflicts', () => {
    expect(a.applicants.a1.conflict).toBeNull();
    const pan = field(a, 'a1', 'pan')!;
    expect(pan.value).toBe('BQJPJ6612C');
    expect(pan.source).toMatchObject({ docType: 'PAN', label: 'PAN, Sameer' });
    expect(field(a, 'a1', 'address')!.source).toMatchObject({ docType: 'AADHAAR' });
    expect(field(a, 'a1', 'employer')!.source).toMatchObject({ docType: 'SALARY_SLIP' });
    expect(field(a, 'a1', 'aadhaarLast4')!.value).toBe('6612');
  });
  it('matching name with the lead value is confirmed, not overwritten', () => {
    const n = field(a, 'a1', 'name')!;
    expect(n.value).toBe('Sameer Joshi'); expect(n.status).toBe('confirmed');
  });
});

describe('1.1 wrong document type', () => {
  it('offers to move a PAN from the Aadhaar slot to the empty PAN slot', () => {
    const { files } = scenarioFiles('pan-in-aadhaar-slot');
    const a = run(files);
    expect(a.slots.adh_a1.state).toBe('attention');
    const acts = actions(a, 'adh_a1', 'WRONG_TYPE');
    expect(acts.map((x) => x.kind)).toEqual(['move', 'upload', 'remove']);
    expect(acts[0]).toMatchObject({ label: 'Move to PAN, Sameer', toSlotId: 'pan_a1' });
  });
  it('offers to replace when the PAN slot is already filled', () => {
    const { files, build } = scenarioFiles('clean');
    const stray = fileFrom('PAN_Sameer.jpg', ['adh_a1'], build, { id: 'stray', hash: 'other-hash', addedAt: 99 });
    const a = run([...files.filter((f) => f.slotIds[0] !== 'adh_a1'), stray]);
    expect(actions(a, 'adh_a1', 'WRONG_TYPE')[0]).toMatchObject({ kind: 'replace', label: 'Replace the PAN there' });
  });
});

describe('1.2 right type, wrong person', () => {
  it('offers to move the co-applicant’s PAN to the co-applicant', () => {
    const { files } = scenarioFiles('other-persons-pan');
    const a = run(files);
    expect(kinds(a, 'pan_a1')).toContain('WRONG_PERSON');
    expect(a.slots.pan_a1.issues[0].message).toContain('matches Pooja Joshi');
    expect(a.slots.pan_a1.issues[0].actions[0]).toMatchObject({ kind: 'move', label: 'Move to PAN, Pooja', toSlotId: 'pan_a2' });
  });
  it('a name that matches nobody gets "Use it anyway", which opens the conflict flow', () => {
    const { files } = scenarioFiles('married-name-conflict');
    const a = run(files);
    const issue = a.slots.pan_a2.issues.find((i) => i.kind === 'WRONG_PERSON')!;
    expect(issue.message).toBe('This PAN is in the name of POOJA SHARMA');
    expect(issue.actions.map((x) => x.kind)).toEqual(['useAnyway', 'upload']);
    const d: Decisions = { ...emptyDecisions(), useAnyway: [`${files.find((f) => f.slotIds[0] === 'pan_a2')!.id}|pan_a2`] };
    const b = run(files, d);
    expect(b.applicants.a2.conflict?.fields.map((f) => f.key)).toContain('name');
  });
});

describe('1.3 incomplete documents', () => {
  it('Aadhaar without the back asks for the address side', () => {
    const { files } = scenarioFiles('aadhaar-front-only');
    const a = run(files);
    expect(kinds(a, 'adh_a1')).toEqual(['AADHAAR_BACK_MISSING']);
    expect(a.slots.adh_a1.issues[0].message).toBe('Address side missing');
    expect(field(a, 'a1', 'address')).toBeUndefined();
    expect(a.applicants.a1.conflict).toBeNull();
  });
  it('a second file with the back completes it', () => {
    const { files, build } = scenarioFiles('aadhaar-front-only');
    build.fixtures['back.jpg'] = { documents: [{ ...build.fixtures['Aadhaar_Sameer_front.jpg'].documents[0], fields: { ...build.fixtures['Aadhaar_Sameer_front.jpg'].documents[0].fields, sidesPresent: { value: 'back', confidence: 0.9 }, address: { value: 'B-12, Mayur Colony, Kothrud, Pune 411038', confidence: 0.95 } } }] };
    const a = run([...files, fileFrom('back.jpg', ['adh_a1'], build)]);
    expect(a.slots.adh_a1.state).toBe('done');
    expect(field(a, 'a1', 'address')!.value).toContain('Mayur Colony');
  });
  it('salary slips missing September name the missing month', () => {
    const { files } = scenarioFiles('missing-september');
    const a = run(files);
    expect(a.slots.sal_a1.coverage).toEqual({ covered: ['2026-08', '2026-10'], missing: ['2026-09'], outOfRange: [] });
    expect(a.slots.sal_a1.issues[0].message).toBe('Covers Aug 2026, Oct 2026. Missing Sep 2026');
    expect(a.slots.sal_a1.state).toBe('attention');
  });
  it('months come from the slot config, not from the rules', () => {
    const { files } = scenarioFiles('clean');
    const slots = [{ id: 'sal_a1', type: 'SALARY_SLIP' as const, applicantId: 'a1', label: 'Salary slips', months: ['2026-07', '2026-08', '2026-09', '2026-10'] }];
    const a = run(files.filter((f) => f.slotIds[0] === 'sal_a1'), emptyDecisions(), APPS.slice(0, 1), slots);
    expect(a.slots.sal_a1.coverage?.missing).toEqual(['2026-07']);
  });
  it('flags a slip outside the range, and one PDF can cover several months', () => {
    const { files, build } = scenarioFiles('clean');
    const slot = files.find((f) => f.slotIds[0] === 'sal_a1')!;
    const extra = { ...slot.docs[0], fields: { ...slot.docs[0].fields, payMonth: { value: 'June 2026', confidence: 0.9 } } };
    const a = run(files.map((f) => (f === slot ? { ...f, docs: [...f.docs, extra] } : f)));
    expect(a.slots.sal_a1.coverage?.covered).toHaveLength(3);
    expect(a.slots.sal_a1.coverage?.outOfRange).toEqual(['2026-06']);
    expect(a.slots.sal_a1.issues[0].message).toContain('Jun 2026 is outside');
    void build;
  });
});

describe('1.4 several documents in one file', () => {
  it('offers to use one file for both slots, then fills each slot from its part', () => {
    const { files, build } = scenarioFiles('clean');
    const pan = build.fixtures['PAN_Sameer.jpg'].documents[0], adh = build.fixtures['Aadhaar_Sameer.pdf'].documents[0];
    build.fixtures['Both.pdf'] = { documents: [pan, adh] };
    const rest = files.filter((f) => !['pan_a1', 'adh_a1'].includes(f.slotIds[0]));
    const both = fileFrom('Both.pdf', ['pan_a1'], build, { id: 'both' });
    const a = run([...rest, both]);
    const offer = a.slots.pan_a1.issues.find((i) => i.kind === 'MULTI_DOC')!;
    expect(offer.actions[0]).toMatchObject({ kind: 'attachBoth', label: 'Use this file for both', toSlotId: 'adh_a1' });
    expect(a.slots.adh_a1.state).toBe('empty');
    const b = run([...rest, { ...both, slotIds: ['pan_a1', 'adh_a1'] }]);
    expect(b.slots.pan_a1.state).toBe('done'); expect(b.slots.adh_a1.state).toBe('done');
    expect(b.slots.adh_a1.summary).toContain('ending 6612');
  });
});

describe('1.5 to 1.8 unreadable, unmasked, other, duplicate', () => {
  it('a blurry image shows the reason and asks for a clearer copy', () => {
    const a = run(scenarioFiles('blurry-image').files);
    const i = a.slots.pan_a1.issues[0];
    expect(i.kind).toBe('UNREADABLE'); expect(i.message).toContain('blurred');
    expect(i.actions[0].label).toBe('Upload a clearer copy');
  });
  it('a partly readable file fills only the fields read with good confidence', () => {
    const { files, build } = scenarioFiles('clean');
    const pan = files.find((f) => f.slotIds[0] === 'pan_a1')!;
    const d = pan.docs[0];
    const partial = { ...d, readability: 'PARTIAL' as const, readabilityReason: 'Cropped', fields: { ...d.fields, fatherName: { value: 'RAMESH JOSHI', confidence: 0.4 }, dob: { ...d.fields.dob!, confidence: 0.9 } } };
    const a = run(files.map((f) => (f === pan ? { ...f, docs: [partial] } : f)));
    expect(field(a, 'a1', 'fatherName')).toBeUndefined();
    expect(field(a, 'a1', 'dob')!.value).toMatch(/^\d{1,2} \w{3} 1990$/);
    expect(kinds(a, 'pan_a1')).toContain('PARTIAL');
    void build;
  });
  it('an unmasked Aadhaar is refused and its data is not used', () => {
    const a = run(scenarioFiles('unmasked-aadhaar').files);
    expect(kinds(a, 'adh_a1')).toEqual(['UNMASKED']);
    expect(a.slots.adh_a1.issues[0].message).toBe('This Aadhaar shows the full number. Upload the masked copy.');
    expect(a.slots.adh_a1.state).toBe('attention');
    expect(field(a, 'a1', 'aadhaarLast4')).toBeUndefined();
  });
  it('a bank statement in a salary slip slot says what it looks like', () => {
    const { files, build } = scenarioFiles('clean');
    build.fixtures['stmt.pdf'] = { documents: [{ type: 'OTHER', readability: 'GOOD', readabilityReason: null, description: 'a bank statement', fields: {} }] };
    const a = run([...files.filter((f) => f.slotIds[0] !== 'sal_a1'), fileFrom('stmt.pdf', ['sal_a1'], build)]);
    expect(a.slots.sal_a1.issues[0].kind).toBe('OTHER_DOC');
    expect(a.slots.sal_a1.issues[0].message).toContain('a bank statement');
  });
  it('the same file in two slots is a duplicate, but a file attached to both on purpose is not', () => {
    const { files, build } = scenarioFiles('clean');
    const dupe = fileFrom('Payslips_Sameer.pdf', ['sal_a2'], build, { id: 'dupe', addedAt: 500 });
    const a = run([...files.filter((f) => f.slotIds[0] !== 'sal_a2'), dupe]);
    expect(a.slots.sal_a2.issues[0].kind).toBe('DUPLICATE');
    expect(a.slots.sal_a2.issues[0].message).toContain('same file as the one in sal_a1');
    const both = run(files.map((f) => (f.slotIds[0] === 'sal_a1' ? { ...f, slotIds: ['sal_a1', 'sal_a2'] } : f)).filter((f) => f.slotIds[0] !== 'sal_a2' || f.slotIds.length > 1));
    expect(both.slots.sal_a2.issues.some((i) => i.kind === 'DUPLICATE')).toBe(false);
  });
});

describe('2. mismatches between one applicant’s documents', () => {
  it('tier 2: "S. Joshi" is filled from the PAN with a Check marker showing both values', () => {
    const a = run(scenarioFiles('minor-name-difference').files);
    expect(a.applicants.a1.conflict).toBeNull();
    const n = field(a, 'a1', 'name')!;
    expect(n.value).toBe('Sameer Joshi'); // the lead value is not overwritten
    expect(n.status).toBe('needs-check'); // but the small difference between the documents stays visible
    expect(n.alternatives!.map((x) => x.value)).toEqual(['SAMEER JOSHI', 'S. Joshi']);
    expect(n.alternatives![1].sourceLabel).toBe('Aadhaar, Sameer');
  });
  it('one click confirms the Check marker, or switches to the other value', () => {
    const { files } = scenarioFiles('minor-name-difference');
    const confirm = field(run(files, { ...emptyDecisions(), fieldPicks: { 'a1.name': 'confirm' } }), 'a1', 'name')!;
    expect(confirm.status).toBe('confirmed');
    const other = field(run(files, { ...emptyDecisions(), fieldPicks: { 'a1.name': 1 } }), 'a1', 'name')!;
    expect(other).toMatchObject({ value: 'S. Joshi', status: 'confirmed' });
    expect(other.source).toMatchObject({ docType: 'AADHAAR' });
  });
  it('tier 2 with no lead value: filled, needs a check, both values offered', () => {
    const noLead = APPS.map((p) => ({ ...p, name: '' }));
    const { files } = scenarioFiles('minor-name-difference');
    const a = run(files, emptyDecisions(), noLead.map((p) => ({ ...p, name: p.id === 'a1' ? 'S. Joshi' : 'Pooja Joshi' })));
    const n = field(a, 'a1', 'name')!;
    expect(n.value).toBe('S. Joshi'); // lead says "S. Joshi", PAN says SAMEER JOSHI
    expect(n.status).toBe('needs-check');
    expect(n.alternatives!.map((x) => x.value)).toEqual(['S. Joshi', 'SAMEER JOSHI']);
  });
  it('tier 2 between two documents: PAN value is pre-filled and both are listed', () => {
    const { files } = scenarioFiles('minor-name-difference');
    const a = run(files, emptyDecisions(), [{ ...APPS[0], name: 'Sameer Joshi' }, APPS[1]]);
    expect(a.applicants.a1.conflict).toBeNull(); // a minor difference never opens the dialog
    expect(a.slots.adh_a1.state).toBe('done');
  });
  it('tier 3: a different date of birth opens the conflict for that applicant only', () => {
    const a = run(scenarioFiles('dob-conflict').files);
    expect(a.applicants.a1.conflict!.fields.map((f) => f.key)).toEqual(['dob']);
    expect(a.applicants.a2.conflict).toBeNull();
    expect(field(a, 'a1', 'dob')!.status).toBe('conflict');
    expect(a.applicants.a1.conflict!.matches.map((m) => m.key)).toContain('name');
  });
  it('year-only Aadhaar matching the PAN is never a mismatch, and the full PAN date is used', () => {
    const a = run(scenarioFiles('year-only-aadhaar').files);
    expect(a.applicants.a1.conflict).toBeNull();
    const d = field(a, 'a1', 'dob')!;
    expect(d.value).toMatch(/^\d+ \w{3} \d{4}$/);
    expect(d.source).toMatchObject({ docType: 'PAN' });
  });
  it('a different PAN number on a salary slip is a conflict', () => {
    const { files } = scenarioFiles('clean');
    const sal = files.find((f) => f.slotIds[0] === 'sal_a1')!;
    const bad = sal.docs.map((d) => ({ ...d, fields: { ...d.fields, payslipPan: { value: 'ZZZZZ9999Z', confidence: 0.9 } } }));
    const a = run(files.map((f) => (f === sal ? { ...f, docs: bad } : f)));
    expect(a.applicants.a1.conflict!.fields.map((f) => f.key)).toEqual(['pan']);
  });
  it('address, relation line and gender are never compared', () => {
    const { files } = scenarioFiles('clean');
    const adh = files.find((f) => f.slotIds[0] === 'adh_a1')!;
    const d = adh.docs[0];
    const changed = { ...d, fields: { ...d.fields, relationLine: { value: 'W/O Someone Else', confidence: 0.9 } } };
    const a = run(files.map((f) => (f === adh ? { ...f, docs: [changed] } : f)));
    expect(a.applicants.a1.conflict).toBeNull();
    expect(field(a, 'a1', 'fatherName')!.value).toBe('RAMESH JOSHI');
    expect(field(a, 'a1', 'relationLine')!.value).toBe('W/O Someone Else');
  });
  it('incomplete documents do not create false mismatches', () => {
    const { files } = scenarioFiles('aadhaar-front-only');
    expect(run(files).applicants.a1.conflict).toBeNull();
  });
  it('the comparison waits until every pending file of the applicant is read', () => {
    const { files } = scenarioFiles('dob-conflict');
    const reading = files.map((f) => (f.slotIds[0] === 'adh_a1' ? { ...f, status: 'reading' as const, docs: [] } : f));
    const a = run(reading);
    expect(a.applicants.a1.ready).toBe(false); expect(a.applicants.a1.conflict).toBeNull();
    expect(a.slots.adh_a1.state).toBe('reading');
    expect(a.applicants.a2.ready).toBe(true);
    expect(run(files).applicants.a1.conflict).not.toBeNull();
  });
});

describe('3. resolving a conflict', () => {
  const base = scenarioFiles('dob-conflict');
  const conflict = run(base.files).applicants.a1.conflict!;
  const res = (over: Partial<Resolution>): Decisions => ({
    ...emptyDecisions(),
    resolutions: { a1: { applicantId: 'a1', option: 'pick', signature: conflict.signature, picks: {}, note: '', by: 'Rohit', at: 'now', conflictFields: ['dob'], chosen: {}, ...over } },
  });
  const aadhaarKey = conflict.fields[0].values.find((v) => v.docLabel.startsWith('Aadhaar'))!.docKey;
  const panKey = conflict.fields[0].values.find((v) => v.docLabel.startsWith('PAN'))!.docKey;

  it('suggests the PAN for date of birth', () => expect(conflict.fields[0].suggestedDocKey).toBe(panKey));
  it('pick per field uses the chosen document and marks the field confirmed', () => {
    const a = run(base.files, res({ picks: { dob: { docKey: aadhaarKey } } }));
    expect(a.applicants.a1.conflictResolved).toBe(true);
    expect(field(a, 'a1', 'dob')).toMatchObject({ status: 'confirmed', source: { docType: 'AADHAAR' } });
  });
  it('pick per field accepts a typed value', () => {
    const a = run(base.files, res({ picks: { dob: { manual: '14 Mar 1990' } } }));
    expect(field(a, 'a1', 'dob')).toMatchObject({ value: '14 Mar 1990', source: 'manual', status: 'confirmed' });
  });
  it('use one document for everything marks the other slot "Upload a corrected copy"', () => {
    const a = run(base.files, res({ option: 'one', trustDocKey: panKey }));
    expect(field(a, 'a1', 'dob')!.source).toMatchObject({ docType: 'PAN' });
    expect(a.slots.adh_a1.issues.some((i) => i.kind === 'CORRECTED_COPY')).toBe(true);
    expect(a.slots.adh_a1.state).toBe('attention');
    expect(a.slots.pan_a1.state).toBe('done');
  });
  it('skip uses no data from the conflicting documents and marks the chosen slot "Upload later"', () => {
    const a = run(base.files, res({ option: 'skip', reuploadSlotId: 'adh_a1' }));
    expect(field(a, 'a1', 'dob')?.value ?? null).toBeNull();
    expect(field(a, 'a1', 'fatherName')).toBeUndefined(); // only the PAN has it, and the PAN is excluded
    expect(a.slots.adh_a1.state).toBe('later');
  });
  it('adding a supporting document keeps both documents and adds a slot', () => {
    const { files } = scenarioFiles('married-name-conflict');
    const f = files.find((x) => x.slotIds[0] === 'pan_a2')!;
    const d: Decisions = { ...emptyDecisions(), useAnyway: [`${f.id}|pan_a2`] };
    const c = run(files, d).applicants.a2.conflict!;
    const a = run(files, { ...d, resolutions: { a2: { applicantId: 'a2', option: 'support', signature: c.signature, picks: {}, note: 'Married in 2024', by: 'Rohit', at: 'now', conflictFields: ['name'], chosen: {} } } });
    expect(a.slots.sup_a2.slot.label).toContain('Marriage certificate');
    expect(a.slots.sup_a2.state).toBe('empty');
    expect(field(a, 'a2', 'name')!.status).toBe('confirmed');
  });
  it('a resolution stops applying when the documents change', () => {
    const d = res({ picks: { dob: { docKey: aadhaarKey } } });
    const changed = base.files.map((f) => (f.slotIds[0] === 'adh_a1' ? { ...f, docs: f.docs.map((x) => ({ ...x, fields: { ...x.fields, dob: { value: '25/03/1990', confidence: 0.9 } } })) } : f));
    expect(run(changed, d).applicants.a1.conflictResolved).toBe(false);
  });
});

describe('4. AI values against values already in the form', () => {
  const clean = scenarioFiles('clean');
  it('a typed value is never overwritten; both are shown', () => {
    const d: Decisions = { ...emptyDecisions(), manual: { 'a1.address': '5 Other Street, Pune' } };
    const f = field(run(clean.files, d), 'a1', 'address')!;
    expect(f.value).toBe('5 Other Street, Pune'); expect(f.source).toBe('manual');
    expect(f.status).toBe('conflict'); expect(f.alternatives).toHaveLength(2);
  });
  it('the user picks the document value', () => {
    const d: Decisions = { ...emptyDecisions(), manual: { 'a1.address': '5 Other Street, Pune' }, fieldPicks: { 'a1.address': 1 } };
    expect(field(run(clean.files, d), 'a1', 'address')).toMatchObject({ status: 'confirmed', source: { docType: 'AADHAAR' } });
  });
  it('a lead name that differs from the PAN is a conflict, not an overwrite', () => {
    const apps = [{ ...APPS[0], name: 'Sameer Kulkarni' }, APPS[1]];
    const a = run(clean.files, emptyDecisions(), apps);
    expect(a.slots.pan_a1.issues.some((i) => i.kind === 'WRONG_PERSON')).toBe(true);
  });
  it('low confidence is filled but marked "Check this"', () => {
    const f = clean.files.find((x) => x.slotIds[0] === 'pan_a1')!;
    const d = f.docs[0];
    const low = { ...d, fields: { ...d.fields, fatherName: { value: 'RAMESH JOSHI', confidence: 0.6 } } };
    const r = field(run(clean.files.map((x) => (x === f ? { ...x, docs: [low] } : x))), 'a1', 'fatherName')!;
    expect(r).toMatchObject({ value: 'RAMESH JOSHI', status: 'needs-check', note: 'Read with low confidence' });
  });
  it('every field records its source for the hover text', () => {
    const f = field(run(clean.files), 'a2', 'pan')!;
    expect(f.source).toMatchObject({ label: 'PAN, Pooja' });
  });
});

describe('5. changes after filling', () => {
  const clean = scenarioFiles('clean');
  it('replacing a document updates the fields it filled', () => {
    const { build } = clean;
    build.fixtures['PAN_new.jpg'] = { documents: [{ ...build.fixtures['PAN_Sameer.jpg'].documents[0], fields: { ...build.fixtures['PAN_Sameer.jpg'].documents[0].fields, fatherName: { value: 'MOHAN JOSHI', confidence: 0.95 } } }] };
    const replaced = clean.files.filter((f) => f.slotIds[0] !== 'pan_a1').concat(fileFrom('PAN_new.jpg', ['pan_a1'], build));
    expect(field(run(replaced), 'a1', 'fatherName')!.value).toBe('MOHAN JOSHI');
  });
  it('a field the user edited by hand survives, and is flagged if the new value differs', () => {
    const { build } = clean;
    const d: Decisions = { ...emptyDecisions(), manual: { 'a1.fatherName': 'RAMESH K JOSHI' } };
    const replaced = clean.files.filter((f) => f.slotIds[0] !== 'pan_a1').concat(fileFrom('PAN_new.jpg', ['pan_a1'], build));
    const f = field(run(replaced, d), 'a1', 'fatherName')!;
    expect(f.value).toBe('RAMESH K JOSHI'); expect(f.source).toBe('manual'); expect(f.status).toBe('conflict');
  });
  it('removing a document: the fields it filled can be cleared', () => {
    const a = run(clean.files);
    const pan = clean.files.find((f) => f.slotIds[0] === 'pan_a1')!;
    expect(fieldsFilledFrom(a, pan.id).map((f) => f.key).sort()).toEqual(['dob', 'fatherName', 'pan'].sort());
    const cleared = run(clean.files.filter((f) => f !== pan));
    expect(field(cleared, 'a1', 'fatherName')).toBeUndefined();
  });
  it('removing a document: or kept as manual values', () => {
    const a = run(clean.files);
    const pan = clean.files.find((f) => f.slotIds[0] === 'pan_a1')!;
    const kept = freezeAsManual(a, pan.id, emptyDecisions());
    const after = run(clean.files.filter((f) => f !== pan), kept);
    expect(field(after, 'a1', 'fatherName')).toMatchObject({ value: 'RAMESH JOSHI', source: 'manual' });
  });
  it('upload later counts as pending', () => {
    const a = run(clean.files.filter((f) => f.slotIds[0] !== 'adh_a2'), { ...emptyDecisions(), later: ['adh_a2'] });
    expect(a.slots.adh_a2.state).toBe('later');
  });
});

describe('every sample scenario runs through the analysis without throwing', () => {
  it.each(SCENARIOS.map((s) => s.id))('%s', (id) => {
    const a = run(scenarioFiles(id).files);
    expect(Object.keys(a.slots).length).toBeGreaterThanOrEqual(6);
  });
});

describe('Aadhaar privacy in derived state', () => {
  it('no full Aadhaar number appears anywhere in the analysis of any scenario', () => {
    for (const s of SCENARIOS) {
      const dump = JSON.stringify(run(scenarioFiles(s.id).files));
      expect(dump).not.toMatch(/(?<!\d)\d{12}(?!\d)/);
    }
  });
});
