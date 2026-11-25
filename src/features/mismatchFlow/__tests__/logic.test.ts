import { describe, expect, it } from 'vitest';
import { buildResolutions, groupOpen, otherDetails, reconcilePrefill, tokenDiff } from '../logic';
import type { Mismatch, Reading, UploadedDoc } from '../types';

const rd = (doc_id: string, key: string, value: string): Reading => ({ doc_id, doc_type: 't', doc_label: doc_id.toUpperCase(), filename: 'f.pdf', key, label: key, value, snippet: null });
const mm = (id: string, l: string, r: string, over: Partial<Mismatch> = {}): Mismatch => ({
  id, concept: id, label: id, rule: 'NAME', severity: 'major', skippable: false, left: rd(l, 'name', 'X'), right: rd(r, 'name', 'Y'),
  reason: '', ai_checked: false, status: 'open', chosen_doc_id: null, ...over,
});
const doc = (id: string, values: UploadedDoc['values']): UploadedDoc => ({ id, slotId: id, docType: id, filename: id, status: 'ready', values });

describe('groupOpen', () => {
  it('groups by pair and puts document A on the left', () => {
    const g = groupOpen([mm('1', 'pan', 'aad'), mm('2', 'aad', 'pan'), mm('3', 'pan', 'pass'), mm('4', 'pan', 'aad', { status: 'chosen' })]);
    expect(g.map((x) => x.key)).toEqual(['aad|pan', 'pan|pass']);
    expect(g[0].rows.map((r) => r.id)).toEqual(['1', '2']);
    expect(g[0].rows.every((r) => r.left.doc_id === 'aad')).toBe(true);
  });
});
describe('tokenDiff', () => {
  it('flags only the words missing from the other value', () => {
    expect(tokenDiff('Rahul Kumar Sharma', 'rahul SHARMA.')).toEqual([{ text: 'Rahul', diff: false }, { text: 'Kumar', diff: true }, { text: 'Sharma', diff: false }]);
  });
});
describe('otherDetails', () => {
  const defs = [
    { key: 'name', label: 'Name', hidden: false, placement: 'form' }, { key: 'dob', label: 'DOB', hidden: false, placement: 'form' },
    { key: 'addr', label: 'Line 1', hidden: false, placement: 'form', subgroup: 'Current Address' },
    { key: 'sec', label: 'Secret', hidden: true, placement: 'form' }, { key: 'x', label: 'X', hidden: false, placement: 'card' },
  ];
  it('lists non-conflicting visible form fields with address prefix and missing sides', () => {
    const a = doc('a', { name: { value: 'A' }, dob: { value: '1' }, sec: { value: 's' }, x: { value: 'x' } });
    const b = doc('b', { name: { value: 'B' }, addr: { value: 'road' } });
    const rows = otherDetails(a, b, [mm('1', 'a', 'b')], defs);
    expect(rows.map((r) => [r.key, r.label, !!r.a, !!r.b])).toEqual([['dob', 'DOB', true, false], ['addr', 'Current Address: Line 1', false, true]]);
  });
});
describe('reconcilePrefill', () => {
  it('fills, never overwrites edits, and clears values that went away', () => {
    const out = reconcilePrefill({ name: 'A', dob: '1', city: 'C' }, { name: 'A2', city: 'C' }, new Set(['city']), { name: 'A', dob: '1', city: 'mine' });
    expect(out).toEqual({ name: 'A2', city: 'mine' });
  });
  it('keeps a gone value the user typed over', () => {
    expect(reconcilePrefill({ dob: '1' }, {}, new Set(), { dob: 'typed' })).toEqual({ dob: 'typed' });
  });
});
describe('buildResolutions', () => {
  it('describes each non-open mismatch', () => {
    const r = buildResolutions([mm('1', 'a', 'b', { status: 'skipped' }), mm('2', 'a', 'b', { status: 'chosen', chosen_doc_id: 'b' }), mm('3', 'a', 'b', { status: 'chosen', chosen_doc_id: 'none' }), mm('4', 'a', 'b')]);
    expect(r.map((x) => x.resolution)).toEqual(['Accepted both as they are', 'Used B', 'Used neither (entered manually)']);
  });
});
