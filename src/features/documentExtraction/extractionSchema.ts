import { z } from 'zod';
import type { ExtractedDoc, Extraction, FieldRead, RawFieldName } from './types';
import { RAW_FIELDS } from './types';
import { last4Of, scrubAadhaar } from './normalize';

const fieldRead = z.object({
  value: z.string().nullable().describe('The value exactly as printed, or null if it is not on the document'),
  confidence: z.number().min(0).max(1).describe('0 to 1: how sure you are that you read this value correctly'),
});

const fields = z.object({
  name: fieldRead.describe('PAN or Aadhaar: the holder\'s name as printed'),
  fatherName: fieldRead.describe('PAN: the father\'s name as printed'),
  dob: fieldRead.describe('PAN or Aadhaar: date of birth as printed. If only a year is printed, return just the year as printed'),
  panNumber: fieldRead.describe('PAN: the 10-character PAN'),
  gender: fieldRead.describe('Aadhaar: gender as printed'),
  address: fieldRead.describe('Aadhaar: the address as printed, usually on the back'),
  relationLine: fieldRead.describe('Aadhaar: the relation line as printed, such as "S/O Mohan Kulkarni", "D/O ...", "W/O ...", "C/O ..."'),
  sidesPresent: fieldRead.describe('Aadhaar: which sides are in the image: exactly "front", "back" or "both"'),
  last4: fieldRead.describe('Aadhaar: ONLY the last 4 digits of the Aadhaar number. Never return more than 4 digits'),
  fullNumberVisible: fieldRead.describe('Aadhaar: exactly "true" if more than the last 4 digits of the Aadhaar number are visible, otherwise "false"'),
  employeeName: fieldRead.describe('Salary slip: employee name as printed'),
  employer: fieldRead.describe('Salary slip: employer or company name as printed'),
  payMonth: fieldRead.describe('Salary slip: the pay month and year as printed, for example "October 2026"'),
  grossPay: fieldRead.describe('Salary slip: gross pay for the month, as printed'),
  netPay: fieldRead.describe('Salary slip: net pay for the month, as printed'),
  payslipPan: fieldRead.describe('Salary slip: PAN if printed on the slip'),
  employeeId: fieldRead.describe('Salary slip: employee ID if printed'),
});

const documentSchema = z.object({
  type: z.enum(['PAN', 'AADHAAR', 'SALARY_SLIP', 'OTHER', 'UNREADABLE']),
  readability: z.enum(['GOOD', 'PARTIAL', 'UNREADABLE']),
  readabilityReason: z.string().nullable().describe('Why it is not GOOD: blurred, cropped, glare, rotated, and so on. Null if GOOD'),
  description: z.string().nullable().describe('For type OTHER: a few words on what the document looks like, such as "bank statement"'),
  fields,
});

export const extractionSchema = z.object({ documents: z.array(documentSchema) });

/** JSON Schema handed to Gemini as the response schema. Generated from the zod schema, so they cannot drift. */
export const geminiJsonSchema: Record<string, unknown> = (() => {
  const s = z.toJSONSchema(extractionSchema) as Record<string, unknown>;
  delete s.$schema;
  return s;
})();

export const EXTRACTION_PROMPT = `You read Indian identity and income documents for a home loan application. You only read; you do not judge whether a document is genuine.

The file may hold one document or several (for example a PAN card and an Aadhaar card on one scan, or three salary slips in one PDF). Return one entry in "documents" for each separate document you can see. For a two-sided Aadhaar, the front and back together are ONE document.

For each document:
- "type": PAN, AADHAAR, SALARY_SLIP, OTHER (a document of another kind, such as a bank statement; say what it is in "description"), or UNREADABLE (you cannot tell what it is).
- "readability": GOOD, PARTIAL or UNREADABLE. If it is not GOOD, give a short "readabilityReason" such as blurred, cropped, glare or rotated.
- "fields": every field must be present. If a field is not on the document, set value to null. Never guess, infer or fill in a value that is not printed.
- Return values exactly as printed. Do not reformat dates, names or amounts.
- "confidence" is 0 to 1 for each field: lower it for blurred, cut-off or ambiguous text.

Aadhaar safety rules, which override everything else:
- Never output the full Aadhaar number, or any 12-digit number, anywhere in your answer.
- For "last4" return only the last 4 digits.
- Set "fullNumberVisible" to "true" if more than the last 4 digits of the Aadhaar number are visible on the document, otherwise "false".

Return JSON only.`;

export class ExtractionInvalidError extends Error {
  constructor(message: string) { super(message); this.name = 'ExtractionInvalidError'; }
}

/** Validates a model response. A response that fails validation is a failed read, never data. */
export function parseExtraction(json: unknown): Extraction {
  const parsed = extractionSchema.safeParse(json);
  if (!parsed.success) throw new ExtractionInvalidError('The reader returned an answer we could not use');
  return { documents: parsed.data.documents.map(sanitizeDoc) };
}

function sanitizeDoc(d: z.infer<typeof documentSchema>): ExtractedDoc {
  const out: Partial<Record<RawFieldName, FieldRead>> = {};
  for (const k of RAW_FIELDS) {
    const f = d.fields[k];
    let value = f.value;
    if (value != null) {
      value = value.trim();
      if (!value) value = null;
    }
    if (value != null) {
      if (k === 'last4') value = last4Of(value);
      else if (k === 'fullNumberVisible') value = /^true$/i.test(value) ? 'true' : 'false';
      else if (k === 'sidesPresent') value = /both/i.test(value) ? 'both' : /back/i.test(value) ? 'back' : /front/i.test(value) ? 'front' : null;
      else value = scrubAadhaar(value);
    }
    out[k] = { value, confidence: value == null ? 0 : f.confidence };
  }
  return {
    type: d.type, readability: d.readability,
    readabilityReason: d.readabilityReason ? scrubAadhaar(d.readabilityReason) : null,
    description: d.description ? scrubAadhaar(d.description) : null,
    fields: out,
  };
}
