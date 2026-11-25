import { extractViaBackend, type BackendExtraction } from './backendClient';
import { parseExtraction } from './extractionSchema';
import { withRetry } from './retry';
import type { Extraction, RawFieldName } from './types';
import { RAW_FIELDS } from './types';

export const DEBUG_EXTRACTION = !!import.meta.env.DEV && (import.meta.env as Record<string, string | undefined>).VITE_DEBUG_EXTRACTION === 'true';

/** Sample fixtures (dev only), keyed by sample file name. Real uploads always go to the backend. */
const fixtures = new Map<string, Extraction>();
export const registerFixtures = (f: Record<string, Extraction>) => { fixtures.clear(); Object.entries(f).forEach(([k, v]) => fixtures.set(k, v)); };

export const addFixtures = (f: Record<string, Extraction>) => { Object.entries(f).forEach(([k, v]) => fixtures.set(k, v)); };

const delay = (name: string) => 250 + (name.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 450);

export interface ExtractInput { name: string; mime: string; blob?: Blob }

type KnownType = 'PAN' | 'AADHAAR' | 'SALARY_SLIP';

/** Backend field keys to the raw field the rest of the app reads, per document type. First non-empty key wins. */
const FIELD_MAP: Record<KnownType, Partial<Record<RawFieldName, string[]>>> = {
  PAN: {
    name: ['per__name_as_per_pan', 'per__name_source_pan'], fatherName: ['per__father_s_name'],
    dob: ['per__dob_as_per_pan'], panNumber: ['per__pan'],
  },
  AADHAAR: {
    name: ['per_aadhaar__name_source_aadhaar'], gender: ['per_aadhaar__gender_source_aadhaar', 'per__gender'],
    dob: ['per__dob_as_per_poi'], address: ['per_permanent_address__full_address'], last4: ['per_aadhaar__aadhaar_masked_last_4'],
  },
  SALARY_SLIP: {
    employeeName: ['verify__payslip_employee_name'], employer: ['per_employment_details__entity_name'],
  },
};
const TYPE_MAP: Record<string, KnownType> = { pan: 'PAN', aadhaar: 'AADHAAR', payslip: 'SALARY_SLIP' };

/** Turns the backend's answer into the shape the app already understands. Validated and Aadhaar-scrubbed by parseExtraction. */
export function fromBackend(r: BackendExtraction): Extraction {
  const type = r.doc_type ? TYPE_MAP[r.doc_type] : undefined;
  const readable = r.ok && !r.needs_type;
  const map = type ? FIELD_MAP[type] : {};
  const pick = (keys?: string[]) => keys?.map((k) => r.values?.[k]?.value).find((v) => v != null && String(v).trim() !== '') ?? null;

  const fields: Record<string, { value: string | null; confidence: number }> = {};
  for (const k of RAW_FIELDS) {
    const v = pick(map[k]);
    fields[k] = { value: v == null ? null : String(v), confidence: v == null ? 0 : 0.9 };
  }
  const filled = RAW_FIELDS.some((k) => fields[k].value != null);
  // the backend does not report whether the full Aadhaar number printed, so only flag it if the "last 4" is longer than 4 digits
  fields.fullNumberVisible = { value: type === 'AADHAAR' && (fields.last4.value ?? '').replace(/\D/g, '').length > 4 ? 'true' : 'false', confidence: 1 };

  const good = readable && (filled || !type);
  return parseExtraction({
    documents: [{
      type: !readable ? 'UNREADABLE' : type ?? 'OTHER',
      readability: !readable ? 'UNREADABLE' : good ? 'GOOD' : 'PARTIAL',
      readabilityReason: good ? null : r.error || r.warning || (readable ? 'Nothing could be read' : 'The reader could not tell what this file is'),
      description: !type && r.doc_type ? r.doc_type.replace(/_/g, ' ') : null,
      fields,
    }],
  });
}

/** One call per file: the backend classifies and extracts together. Returns validated data or throws. */
export async function extractFile(input: ExtractInput, onRetry?: (attempt: number) => void): Promise<Extraction> {
  const blob = input.blob;
  if (!blob) {
    // sample files carry no bytes: the registered fixture stands in for the reading
    await new Promise((r) => setTimeout(r, delay(input.name)));
    const f = fixtures.get(input.name);
    if (f) return f;
    throw new Error('There is no sample reading for this file');
  }
  const raw = await withRetry(() => extractViaBackend(blob, input.name), { onRetry: (n) => onRetry?.(n) });
  const out = fromBackend(raw);
  if (DEBUG_EXTRACTION) console.debug('[docx] extracted (dev only)', input.name, out);
  return out;
}
