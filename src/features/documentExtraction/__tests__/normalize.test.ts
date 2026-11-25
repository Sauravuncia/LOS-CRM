import { describe, expect, it } from 'vitest';
import { compareDob, formatDob, last4Of, nameTier, normName, panTier, parseDob, parseMoney, parsePayMonth, scrubAadhaar } from '../normalize';

describe('normName', () => {
  it.each([
    ['  Mr. Sameer   JOSHI ', 'SAMEER JOSHI'],
    ['Smt. Pooja Joshi', 'POOJA JOSHI'],
    ['Kumari Anita', 'ANITA'],
    ['Shri Ramesh Kumar', 'RAMESH KUMAR'],
  ])('%s -> %s', (a, b) => expect(normName(a)).toBe(b));
});

describe('nameTier', () => {
  it.each([
    ['Sameer Joshi', 'SAMEER JOSHI', 'match'],
    ['Mr Sameer Joshi', 'Sameer Joshi', 'match'],
    ['JOSHI SAMEER', 'Sameer Joshi', 'match'],
    ['S. Joshi', 'Sameer Joshi', 'minor'],
    ['Sameer K Joshi', 'Sameer Joshi', 'minor'],
    ['Sameer Kumar Joshi', 'S K Joshi', 'minor'],
    ['Sameer', 'Sameer Joshi', 'minor'],
    ['Puja Joshi', 'Pooja Joshi', 'minor'],
    ['Samir Joshi', 'Sameer Joshi', 'minor'],
    ['Pooja Sharma', 'Pooja Joshi', 'conflict'],
    ['Anita Rao', 'Pooja Joshi', 'conflict'],
    ['S. Rao', 'Sameer Joshi', 'conflict'],
    ['S', 'Sameer Joshi', 'conflict'],
    ['', 'Sameer Joshi', 'conflict'],
  ])('%s vs %s -> %s', (a, b, t) => expect(nameTier(a, b)).toBe(t));
});

describe('date of birth', () => {
  it.each([
    ['12/03/1990', { kind: 'full', y: 1990, m: 3, d: 12 }],
    ['12-03-1990', { kind: 'full', y: 1990, m: 3, d: 12 }],
    ['1990-03-12', { kind: 'full', y: 1990, m: 3, d: 12 }],
    ['12 Mar 1990', { kind: 'full', y: 1990, m: 3, d: 12 }],
    ['12 March 1990', { kind: 'full', y: 1990, m: 3, d: 12 }],
    ['1990', { kind: 'year', y: 1990 }],
    ['Year of Birth: 1990', { kind: 'year', y: 1990 }],
    ['31/02/1990', null],
    ['not a date', null],
  ])('parses %s', (raw, want) => expect(parseDob(raw)).toEqual(want));

  it.each([
    ['12/03/1990', '12 Mar 1990', 'match'],
    ['12/03/1990', '13/03/1990', 'conflict'],
    ['1990', '12/03/1990', 'match'],
    ['12/03/1990', '1990', 'match'],
    ['1991', '12/03/1990', 'conflict'],
    ['1990', '1990', 'match'],
  ])('compare %s with %s -> %s', (a, b, t) => expect(compareDob(a, b).tier).toBe(t));

  it('prefers the full date over a year', () => {
    expect(formatDob(compareDob('1990', '12/03/1990').preferred)).toBe('12 Mar 1990');
  });
});

describe('PAN, money, months', () => {
  it('compares PANs ignoring spaces and case', () => {
    expect(panTier('bqjpj 6612c', 'BQJPJ6612C')).toBe('match');
    expect(panTier('BQJPJ6612C', 'CPJPJ3390K')).toBe('conflict');
  });
  it.each([['₹1,24,000', 124000], ['124000.50', 124000.5], ['Rs. 62,000', 62000], ['abc', null]])('money %s', (a, b) => expect(parseMoney(a)).toBe(b));
  it.each([['October 2026', '2026-10'], ['Oct-2026', '2026-10'], ['Sep 26', '2026-09'], ['09/2026', '2026-09'], ['2026-08', '2026-08'], ['Smarch 2026', null]])('month %s', (a, b) => expect(parsePayMonth(a)).toBe(b));
});

describe('Aadhaar safety', () => {
  it('scrubs a full number wherever it appears', () => {
    expect(scrubAadhaar('Aadhaar 1234 5678 9012 of Sameer')).not.toMatch(/\d{4}/);
    expect(scrubAadhaar('123456789012')).not.toMatch(/\d/);
    expect(scrubAadhaar('House 12, Sector 4')).toBe('House 12, Sector 4');
  });
  it('keeps only the last 4 digits', () => {
    expect(last4Of('XXXX XXXX 6612')).toBe('6612');
    expect(last4Of('123456786612')).toBe('6612');
    expect(last4Of('12')).toBeNull();
  });
});
