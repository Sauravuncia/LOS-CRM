import { describe, expect, it } from 'vitest';
import { createQueue, withRetry } from '../retry';
import { checkSize, checkType, isPasswordProtectedPdf, mimeOf, scaleToFit, sha256Hex } from '../precheck';
import { ExtractionInvalidError, geminiJsonSchema, parseExtraction } from '../extractionSchema';
import { MAX_FILE_BYTES } from '../constants';
import { RAW_FIELDS } from '../types';

const retryable = () => Object.assign(new Error('429'), { retryable: true });

describe('withRetry', () => {
  it('retries retryable errors up to 2 times with growing backoff', async () => {
    const waits: number[] = []; let calls = 0;
    const r = await withRetry(async () => { if (++calls < 3) throw retryable(); return 'ok'; }, { sleep: async (ms) => { waits.push(ms); }, baseMs: 100 });
    expect(r).toBe('ok'); expect(calls).toBe(3); expect(waits).toEqual([100, 200]);
  });
  it('gives up after 2 retries', async () => {
    let calls = 0;
    await expect(withRetry(async () => { calls++; throw retryable(); }, { sleep: async () => {} })).rejects.toThrow('429');
    expect(calls).toBe(3);
  });
  it('does not retry other errors', async () => {
    let calls = 0;
    await expect(withRetry(async () => { calls++; throw new Error('bad'); }, { sleep: async () => {} })).rejects.toThrow('bad');
    expect(calls).toBe(1);
  });
});

describe('createQueue', () => {
  it('runs at most 2 jobs at once and a quick job does not wait behind a slow one', async () => {
    const q = createQueue(2); let active = 0, peak = 0; const order: string[] = [];
    const job = (name: string, ms: number) => q.run(async () => { active++; peak = Math.max(peak, active); await new Promise((r) => setTimeout(r, ms)); active--; order.push(name); });
    await Promise.all([job('slow', 60), job('fast', 5), job('third', 5), job('fourth', 5)]);
    expect(peak).toBe(2);
    expect(order.indexOf('third')).toBeLessThan(order.indexOf('slow'));
  });
});

describe('precheck', () => {
  it.each([['a.jpg', 'image/jpeg', true], ['a.PNG', '', true], ['a.webp', 'image/webp', true], ['a.pdf', 'application/pdf', true], ['a.docx', 'application/msword', false], ['a.heic', 'image/heic', false], ['a', '', false]])('type %s', (n, m, ok) => expect(checkType(n, m) === null).toBe(ok));
  it('infers mime from the extension', () => expect(mimeOf('scan.JPEG', '')).toBe('image/jpeg'));
  it('refuses oversize files', () => { expect(checkSize(MAX_FILE_BYTES)).toBeNull(); expect(checkSize(MAX_FILE_BYTES + 1)?.reason).toBe('TOO_BIG'); });
  it('detects an encrypted PDF', () => {
    const enc = new TextEncoder().encode('%PDF-1.7\n1 0 obj<<>>endobj\ntrailer<</Root 1 0 R/Encrypt 5 0 R>>');
    const plain = new TextEncoder().encode('%PDF-1.7\n1 0 obj<<>>endobj\ntrailer<</Root 1 0 R>>');
    expect(isPasswordProtectedPdf(enc)).toBe(true);
    expect(isPasswordProtectedPdf(plain)).toBe(false);
  });
  it('hashes with SHA-256', async () => {
    expect(await sha256Hex(new TextEncoder().encode('abc'))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  it('downscales so the longest side is 2000', () => {
    expect(scaleToFit(1000, 800, 2000)).toEqual({ width: 1000, height: 800, scaled: false });
    expect(scaleToFit(4000, 3000, 2000)).toEqual({ width: 2000, height: 1500, scaled: true });
    expect(scaleToFit(1500, 3000, 2000)).toEqual({ width: 1000, height: 2000, scaled: true });
  });
});

type F = { value: string | null; confidence: number };
const fields = (over: Record<string, F> = {}) => Object.fromEntries(RAW_FIELDS.map((k) => [k, over[k] ?? { value: null, confidence: 0 }]));
const aadhaar = (over: Record<string, F>) => ({ documents: [{ type: 'AADHAAR', readability: 'GOOD', readabilityReason: null, description: null, fields: fields(over) }] });

describe('parseExtraction', () => {
  it('accepts a valid answer', () => {
    const r = parseExtraction(aadhaar({ name: { value: ' Sameer Joshi ', confidence: 0.9 }, sidesPresent: { value: 'Both sides', confidence: 0.9 } }));
    expect(r.documents[0].fields.name?.value).toBe('Sameer Joshi');
    expect(r.documents[0].fields.sidesPresent?.value).toBe('both');
  });
  it('rejects an answer that does not match the schema', () => {
    expect(() => parseExtraction({ documents: [{ type: 'PASSPORT' }] })).toThrow(ExtractionInvalidError);
    expect(() => parseExtraction('nonsense')).toThrow(ExtractionInvalidError);
    expect(() => parseExtraction({ documents: [{ type: 'PAN', readability: 'GOOD', readabilityReason: null, description: null, fields: {} }] })).toThrow(ExtractionInvalidError);
  });
  it('never lets a full Aadhaar number through, even if the model returns one', () => {
    const r = parseExtraction(aadhaar({
      last4: { value: '1234 5678 6612', confidence: 0.9 },
      address: { value: 'H 4, Aadhaar 1234 5678 9012, Pune', confidence: 0.9 },
      name: { value: '123456789012', confidence: 0.5 },
    }));
    const dump = JSON.stringify(r);
    expect(dump).not.toMatch(/\d{12}/);
    expect(dump).not.toMatch(/1234 5678/);
    expect(r.documents[0].fields.last4?.value).toBe('6612');
  });
  it('hands Gemini a plain JSON schema without the $schema key', () => {
    expect(geminiJsonSchema.$schema).toBeUndefined();
    expect(geminiJsonSchema.type).toBe('object');
  });
});
