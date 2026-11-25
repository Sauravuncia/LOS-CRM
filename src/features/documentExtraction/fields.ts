import { COMPARABLE_FIELDS, DOC_TYPE_LABEL, FIELD_ORDER, LOW_CONFIDENCE, SUGGESTED_SOURCE } from './constants';
import {
  compareDob, formatDob, last4Of, monthLabel, nameTier, normPan, normText, panTier, parseDob, parseMoney, parsePayMonth, type Tier,
} from './normalize';
import { firstName } from './slotConfig';
import type { UsableDoc } from './slotFit';
import type {
  Applicant, Conflict, ConflictField, Decisions, DocRef, DocType, FieldAlternative, FieldKey, FieldRecord, FieldSource, Resolution,
} from './types';

export interface Cand {
  key: FieldKey; value: string; confidence: number; docKey: string; docType: DocType; slotId: string;
  label: string; month: string | null; u: UsableDoc;
}

const TYPE_PRIORITY: DocType[] = ['PAN', 'AADHAAR', 'SALARY_SLIP'];

export function candidatesFrom(u: UsableDoc, applicant: Applicant): Cand[] {
  const f = u.doc.fields, out: Cand[] = [];
  const month = u.doc.type === 'SALARY_SLIP' ? parsePayMonth(f.payMonth?.value) : null;
  const label = u.doc.type === 'SALARY_SLIP' && month ? `Salary slip ${monthLabel(month)}, ${firstName(applicant.name)}` : `${DOC_TYPE_LABEL[u.doc.type]}, ${firstName(applicant.name)}`;
  const add = (key: FieldKey, raw: { value: string | null; confidence: number } | undefined, map: (v: string) => string = (v) => v) => {
    if (raw && raw.value) out.push({ key, value: map(raw.value), confidence: raw.confidence, docKey: u.docKey, docType: u.doc.type, slotId: u.slot.id, label, month, u });
  };
  const panMap = (v: string) => (normPan(v).length === 10 ? normPan(v) : v.trim());
  if (u.doc.type === 'PAN') {
    add('name', f.name); add('fatherName', f.fatherName); add('dob', f.dob); add('pan', f.panNumber, panMap);
  } else if (u.doc.type === 'AADHAAR') {
    add('name', f.name); add('dob', f.dob); add('gender', f.gender); add('address', f.address); add('relationLine', f.relationLine);
    const l4 = last4Of(f.last4?.value);
    if (l4) out.push({ key: 'aadhaarLast4', value: l4, confidence: f.last4?.confidence ?? 0, docKey: u.docKey, docType: 'AADHAAR', slotId: u.slot.id, label, month: null, u });
  } else if (u.doc.type === 'SALARY_SLIP') {
    add('name', f.employeeName); add('employer', f.employer); add('grossPay', f.grossPay); add('netPay', f.netPay); add('pan', f.payslipPan, panMap);
  }
  return out;
}

export function fieldTier(key: FieldKey, a: string, b: string): Tier {
  switch (key) {
    case 'name': return nameTier(a, b);
    case 'dob': return compareDob(a, b).tier;
    case 'pan': return panTier(a, b);
    case 'aadhaarLast4': return a === b ? 'match' : 'conflict';
    case 'grossPay': case 'netPay': { const x = parseMoney(a), y = parseMoney(b); return x != null && x === y ? 'match' : 'conflict'; }
    default: return normText(a) === normText(b) ? 'match' : 'conflict';
  }
}

const worse = (a: Tier, b: Tier): Tier => (a === 'conflict' || b === 'conflict' ? 'conflict' : a === 'minor' || b === 'minor' ? 'minor' : 'match');

function worstTier(key: FieldKey, cands: Cand[]): Tier {
  let t: Tier = 'match';
  for (let i = 0; i < cands.length; i++) for (let j = i + 1; j < cands.length; j++) t = worse(t, fieldTier(key, cands[i].value, cands[j].value));
  return t;
}

/** The candidate the form is filled from: the suggested source, then any other document. */
export function primaryOf(key: FieldKey, cands: Cand[]): Cand | null {
  if (!cands.length) return null;
  const want = SUGGESTED_SOURCE[key];
  const order = [want, ...TYPE_PRIORITY.filter((t) => t !== want)];
  for (const t of order) {
    const of = cands.filter((c) => c.docType === t);
    if (of.length) return of.sort((a, b) => (b.month ?? '').localeCompare(a.month ?? '') || b.confidence - a.confidence)[0];
  }
  return cands[0];
}

/** A year-only date of birth gives way to a full date in the same year. */
function pickDob(primary: Cand, cands: Cand[]): Cand {
  const isFull = (c: Cand) => parseDob(c.value)?.kind === 'full';
  if (isFull(primary)) return primary;
  return cands.find((c) => isFull(c) && compareDob(c.value, primary.value).tier === 'match') ?? primary;
}

const display = (key: FieldKey, v: string) => (key === 'dob' ? formatDob(compareDob(v, v).preferred) || v : v);

const sourceOf = (c: Cand): FieldSource => ({ documentId: c.docKey, fileId: c.u.file.id, docType: c.docType, label: c.label });
const altOf = (key: FieldKey, c: Cand): FieldAlternative => ({ value: display(key, c.value), sourceLabel: c.label, docKey: c.docKey });

export interface ApplicantAnalysis {
  fields: FieldRecord[];
  conflict: Conflict | null;
  conflictResolved: boolean;
  /** slots whose document lost an "use one document" choice */
  correctedSlots: Record<string, string>;
  /** slots the user picked to upload later after skipping a conflict */
  laterSlots: string[];
}

export function conflictSignature(fields: { key: FieldKey; values: { docKey: string; value: string }[] }[]): string {
  return fields
    .map((f) => `${f.key}:${f.values.map((v) => `${v.docKey}=${normText(v.value)}`).sort().join('|')}`)
    .sort().join(';');
}

export function analyzeApplicant(applicant: Applicant, usable: UsableDoc[], decisions: Decisions): ApplicantAnalysis {
  const id = applicant.id;
  const existingOf = (key: FieldKey): { value: string; source: FieldSource } | null => {
    const m = decisions.manual[`${id}.${key}`];
    if (m != null && m !== '') return { value: m, source: 'manual' };
    if (key === 'name' && applicant.name) return { value: applicant.name, source: 'lead' };
    return null;
  };

  let cands = usable.flatMap((u) => candidatesFrom(u, applicant));
  const byField = (key: FieldKey, list = cands) => list.filter((c) => c.key === key);

  // 1. conflicts between documents (comparable fields only; null values never compare)
  const conflictFields: ConflictField[] = [];
  const matches: Conflict['matches'] = [];
  for (const key of COMPARABLE_FIELDS) {
    const list = byField(key);
    const distinctDocs = new Set(list.map((c) => c.docKey));
    if (distinctDocs.size < 2) continue;
    const t = worstTier(key, list);
    if (t === 'conflict') {
      const sug = primaryOf(key, list)!;
      conflictFields.push({
        key, suggestedDocKey: sug.docKey,
        values: list.map((c) => ({ docKey: c.docKey, value: display(key, c.value), docLabel: c.label, confidence: c.confidence })),
      });
    } else if (t === 'match') {
      matches.push({ key, value: display(key, primaryOf(key, list)!.value) });
    }
  }
  // extra rows in the dialog: other fields present on 2+ documents are not compared, so nothing to add

  const signature = conflictSignature(conflictFields.map((f) => ({ key: f.key, values: f.values.map((v) => ({ docKey: v.docKey, value: v.value })) })));
  const res: Resolution | undefined = decisions.resolutions[id];
  const resolved = !!(conflictFields.length && res && res.signature === signature);

  const docsInConflict = new Set(conflictFields.flatMap((f) => f.values.map((v) => v.docKey)));
  const refOf = (docKey: string): DocRef => {
    const u = usable.find((x) => x.docKey === docKey)!;
    const c = cands.find((x) => x.docKey === docKey)!;
    return { docKey, fileId: u.file.id, slotId: u.slot.id, docType: u.doc.type, label: c?.label ?? DOC_TYPE_LABEL[u.doc.type], thumbUrl: u.file.thumbUrl, previewUrl: u.file.previewUrl, fileName: u.file.name, mime: u.file.mime };
  };
  const conflict: Conflict | null = conflictFields.length ? { applicantId: id, signature, fields: conflictFields, matches, docs: [...docsInConflict].map(refOf) } : null;

  const correctedSlots: Record<string, string> = {};
  const laterSlots: string[] = [];
  const decided: Partial<Record<FieldKey, Cand | { manual: string }>> = {};

  if (resolved && res) {
    if (res.option === 'skip') {
      cands = cands.filter((c) => !docsInConflict.has(c.docKey));
      const slotFor = res.reuploadSlotId ?? usable.find((u) => docsInConflict.has(u.docKey))?.slot.id;
      if (slotFor) laterSlots.push(slotFor);
    } else {
      for (const f of conflictFields) {
        const pick = res.option === 'pick' ? res.picks[f.key] : undefined;
        if (pick && 'manual' in pick) { decided[f.key] = { manual: pick.manual }; continue; }
        const wantDoc = pick && 'docKey' in pick ? pick.docKey : res.option === 'one' && res.trustDocKey && f.values.some((v) => v.docKey === res.trustDocKey) ? res.trustDocKey : f.suggestedDocKey;
        const c = byField(f.key).find((x) => x.docKey === wantDoc) ?? byField(f.key).find((x) => x.docKey === f.suggestedDocKey);
        if (c) decided[f.key] = c;
      }
      if (res.option === 'one' && res.trustDocKey) {
        for (const dk of docsInConflict) if (dk !== res.trustDocKey) {
          const u = usable.find((x) => x.docKey === dk);
          if (u) correctedSlots[u.slot.id] = `${DOC_TYPE_LABEL[u.doc.type]} doesn’t match the ${DOC_TYPE_LABEL[usable.find((x) => x.docKey === res.trustDocKey)!.doc.type]} you chose to trust`;
        }
      }
    }
  }

  // 2. build the form fields
  const fields: FieldRecord[] = [];
  for (const key of FIELD_ORDER) {
    const ex = existingOf(key);
    const list = byField(key);
    const inConflict = conflictFields.find((f) => f.key === key);
    const pickKey = `${id}.${key}`;
    const choice = decisions.fieldPicks[pickKey];

    // resolved conflict: the user decided, so it is not overwritten again by the lead value
    const d = decided[key];
    if (inConflict && resolved && d) {
      if ('manual' in d) { fields.push({ key, applicantId: id, value: d.manual, source: 'manual', status: 'confirmed', note: 'Typed in the conflict dialog' }); continue; }
      fields.push({ key, applicantId: id, value: display(key, d.value), source: sourceOf(d), confidence: d.confidence, status: 'confirmed', note: `Chosen from ${d.label} when the documents disagreed` });
      continue;
    }
    if (inConflict && resolved && res?.option === 'skip') {
      fields.push({ key, applicantId: id, value: ex?.value ?? null, source: ex?.source ?? null, status: ex ? 'filled' : 'needs-check', note: 'Left empty for manual entry' });
      continue;
    }
    if (inConflict) {
      fields.push({
        key, applicantId: id, value: ex?.value ?? null, source: ex?.source ?? null, status: 'conflict',
        alternatives: [...(ex ? [{ value: ex.value, sourceLabel: ex.source === 'lead' ? 'Lead' : 'Typed', existing: true }] : []), ...list.map((c) => altOf(key, c))],
        note: 'The documents disagree. Resolve this in the conflict dialog.',
      });
      continue;
    }

    if (!list.length) {
      if (ex) fields.push({ key, applicantId: id, value: ex.value, source: ex.source, status: 'filled' });
      continue;
    }

    let primary = primaryOf(key, list)!;
    if (key === 'dob') primary = pickDob(primary, list);
    const docTier = list.length > 1 && COMPARABLE_FIELDS.includes(key) ? worstTier(key, list) : 'match';
    const val = display(key, primary.value);
    const lowConf = primary.confidence < LOW_CONFIDENCE;
    let rec: FieldRecord = {
      key, applicantId: id, value: val, source: sourceOf(primary), confidence: primary.confidence,
      status: docTier === 'minor' || lowConf ? 'needs-check' : 'filled',
      note: docTier === 'minor' ? 'Small difference between documents' : lowConf ? 'Read with low confidence' : undefined,
    };
    if (docTier === 'minor') {
      const seen = new Set<string>();
      rec.alternatives = [primary, ...list.filter((c) => c !== primary)].filter((c) => { const k = normText(c.value); if (seen.has(k)) return false; seen.add(k); return true; }).map((c) => altOf(key, c));
    }

    // 3. against what is already in the form: never overwrite silently
    if (ex) {
      const t = fieldTier(key, ex.value, primary.value);
      if (t === 'match') {
        // keep any small difference between the documents visible: the existing value stays, the Check marker stays
        rec = docTier === 'minor'
          ? { ...rec, value: ex.value, source: ex.source }
          : { ...rec, value: ex.value, source: ex.source, status: lowConf ? 'needs-check' : 'confirmed', alternatives: undefined, note: `Matches ${primary.label}` };
      } else {
        rec = {
          key, applicantId: id, value: ex.value, source: ex.source, confidence: primary.confidence, status: t === 'minor' ? 'needs-check' : 'conflict',
          alternatives: [{ value: ex.value, sourceLabel: ex.source === 'lead' ? 'Lead' : 'Typed', existing: true }, ...(rec.alternatives ?? [altOf(key, primary)]).filter((x) => normText(x.value) !== normText(ex.value))],
          note: `${primary.label} reads ${val}`,
        };
      }
    }

    // user's answer on a "Check" field
    if (choice != null && rec.alternatives) {
      if (choice === 'confirm' || choice === 'existing') {
        const keep = choice === 'existing' ? rec.alternatives.find((a) => a.existing) : null;
        rec = { ...rec, value: keep ? keep.value : rec.value, status: 'confirmed', alternatives: rec.alternatives };
      } else if (typeof choice === 'number' && rec.alternatives[choice]) {
        const alt = rec.alternatives[choice];
        const c = alt.docKey ? list.find((x) => x.docKey === alt.docKey) : undefined;
        rec = { ...rec, value: alt.value, source: alt.existing ? rec.source : c ? sourceOf(c) : rec.source, confidence: c?.confidence ?? rec.confidence, status: 'confirmed' };
      }
    } else if (choice === 'confirm' && !rec.alternatives && rec.status === 'needs-check') {
      rec = { ...rec, status: 'confirmed' };
    }
    fields.push(rec);
  }
  return { fields, conflict, conflictResolved: resolved, correctedSlots, laterSlots };
}
