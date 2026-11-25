import type { DocType, FieldKey } from './types';

/** Every threshold and rule table lives here so credit policy can change them in one place. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
export const IMAGE_MAX_SIDE = 2000;

/** A field read below this confidence is filled but marked "Check this". */
export const LOW_CONFIDENCE = 0.75;
/** Token similarity (0 to 1) at or above which two spellings count as the same name. */
export const NAME_TOKEN_SIMILARITY = 0.8;

export const EXTRACTION_CONCURRENCY = 2;
export const MAX_RETRIES = 2;
export const RETRY_BASE_MS = 800;
export const REQUEST_TIMEOUT_MS = 60_000;

/**
 * If true, identity documents marked "Upload later" hold back the pre-screen.
 * Default false: the pre-screen runs on what is in. Read in engine.js afterDocs().
 */
export const BLOCK_PRESCREEN_ON_PENDING_IDENTITY = false;

/** Which document a field is filled from when documents disagree or overlap. */
export const SUGGESTED_SOURCE: Record<FieldKey, DocType> = {
  name: 'PAN', dob: 'PAN', fatherName: 'PAN', pan: 'PAN',
  gender: 'AADHAAR', address: 'AADHAAR', relationLine: 'AADHAAR', aadhaarLast4: 'AADHAAR',
  employer: 'SALARY_SLIP', grossPay: 'SALARY_SLIP', netPay: 'SALARY_SLIP',
};

/** Fields compared between documents. Everything else comes from one source without comparison. */
export const COMPARABLE_FIELDS: FieldKey[] = ['name', 'dob', 'pan'];

export const FIELD_LABELS: Record<FieldKey, string> = {
  name: 'Name', dob: 'Date of birth', fatherName: 'Father’s name', pan: 'PAN', aadhaarLast4: 'Aadhaar, last 4 digits',
  gender: 'Gender', address: 'Address', relationLine: 'Relation line on Aadhaar', employer: 'Employer',
  grossPay: 'Gross pay', netPay: 'Net pay',
};
export const FIELD_ORDER: FieldKey[] = ['name', 'dob', 'fatherName', 'pan', 'aadhaarLast4', 'gender', 'address', 'relationLine', 'employer', 'grossPay', 'netPay'];

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  PAN: 'PAN', AADHAAR: 'Aadhaar', SALARY_SLIP: 'Salary slip', OTHER: 'Other document', UNREADABLE: 'Unreadable file',
};

/** Salary months expected when a slot does not carry its own list. Matches the sample cases. */
export const DEFAULT_SALARY_MONTHS = ['2026-08', '2026-09', '2026-10'];
