export type DocType = 'PAN' | 'AADHAAR' | 'SALARY_SLIP' | 'OTHER' | 'UNREADABLE';
export type SlotType = 'PAN' | 'AADHAAR' | 'SALARY_SLIP' | 'SUPPORTING';
export type Readability = 'GOOD' | 'PARTIAL' | 'UNREADABLE';

/** A value exactly as printed on the document, with the model's confidence (0 to 1). */
export interface FieldRead { value: string | null; confidence: number }

export const RAW_FIELDS = [
  'name', 'fatherName', 'dob', 'panNumber', 'gender', 'address', 'relationLine', 'sidesPresent', 'last4',
  'fullNumberVisible', 'employeeName', 'employer', 'payMonth', 'grossPay', 'netPay', 'payslipPan', 'employeeId',
] as const;
export type RawFieldName = (typeof RAW_FIELDS)[number];

export interface ExtractedDoc {
  type: DocType;
  readability: Readability;
  readabilityReason: string | null;
  /** Short description of what the file looks like, used when type is OTHER. */
  description: string | null;
  fields: Partial<Record<RawFieldName, FieldRead>>;
}
export interface Extraction { documents: ExtractedDoc[] }

/** Fields of the application form that documents can fill. */
export type FieldKey =
  | 'name' | 'dob' | 'fatherName' | 'pan' | 'aadhaarLast4' | 'gender' | 'address' | 'relationLine'
  | 'employer' | 'grossPay' | 'netPay';

export interface ApplicantSample { pan?: string; last4?: string; address?: string; age?: number; employer?: string; netPay?: number }
export interface Applicant { id: string; name: string; role: string; sample?: ApplicantSample }

export interface SlotConfig {
  id: string; type: SlotType; applicantId: string; label: string;
  /** Expected salary months as YYYY-MM. Comes from the slot config, never hard-coded in rules. */
  months?: string[];
}

export type FileStatus = 'reading' | 'read' | 'failed' | 'rejected';
export type RejectReason = 'BAD_TYPE' | 'TOO_BIG' | 'PASSWORD' | 'UNMASKED_AADHAAR';

export interface FileEntry {
  id: string; name: string; mime: string; size: number; hash: string;
  slotIds: string[];
  status: FileStatus;
  docs: ExtractedDoc[];
  error?: string;
  rejectReason?: RejectReason;
  rejectMessage?: string;
  thumbUrl?: string;
  previewUrl?: string;
  virtual?: boolean;
  /** Uploaded while the lead was being created: its slot is not shown again on the pre-screen page. */
  fromLead?: boolean;
  addedAt: number;
}

export type FieldStatus = 'filled' | 'needs-check' | 'conflict' | 'confirmed';
export type FieldSource =
  | 'manual' | 'lead'
  | { documentId: string; fileId: string; docType: DocType; label: string; page?: number };
export interface FieldAlternative { value: string; sourceLabel: string; docKey?: string; existing?: boolean }
export interface FieldRecord {
  key: FieldKey; applicantId: string;
  value: string | null;
  source: FieldSource | null;
  confidence?: number;
  status: FieldStatus;
  alternatives?: FieldAlternative[];
  note?: string;
}

export type ResolutionOption = 'pick' | 'one' | 'skip' | 'support';
export interface Resolution {
  applicantId: string;
  option: ResolutionOption;
  /** Signature of the conflicts this answered. If the documents change, the resolution no longer applies. */
  signature: string;
  picks: Partial<Record<FieldKey, { docKey: string } | { manual: string }>>;
  trustDocKey?: string;
  reuploadSlotId?: string;
  note: string;
  by: string;
  at: string;
  conflictFields: FieldKey[];
  chosen: Partial<Record<FieldKey, string>>;
}

export interface Decisions {
  /** `${fileId}|${slotId}`: the user chose to use a document that is in another person's name. */
  useAnyway: string[];
  /** Slots the user marked "Upload later". */
  later: string[];
  /** `${applicantId}.${FieldKey}`: values typed by the user. */
  manual: Record<string, string>;
  /** `${applicantId}.${FieldKey}`: which of the alternatives the user picked. */
  fieldPicks: Record<string, 'confirm' | 'existing' | number>;
  resolutions: Record<string, Resolution>;
}
export const emptyDecisions = (): Decisions => ({ useAnyway: [], later: [], manual: {}, fieldPicks: {}, resolutions: {} });

export type IssueKind =
  | 'WRONG_TYPE' | 'WRONG_PERSON' | 'AADHAAR_BACK_MISSING' | 'SALARY_COVERAGE' | 'MULTI_DOC' | 'UNREADABLE'
  | 'PARTIAL' | 'UNMASKED' | 'OTHER_DOC' | 'DUPLICATE' | 'READ_FAILED' | 'REJECTED' | 'CORRECTED_COPY';

export type IssueActionKind =
  | 'move' | 'replace' | 'useAnyway' | 'attachBoth' | 'upload' | 'remove' | 'addFile' | 'retry' | 'uploadLater';
export interface IssueAction { kind: IssueActionKind; label: string; fileId?: string; fromSlotId?: string; toSlotId?: string }
export interface Issue { kind: IssueKind; severity: 'warn' | 'error' | 'info'; message: string; detail?: string; fileId?: string; actions: IssueAction[] }

export type SlotState = 'empty' | 'reading' | 'done' | 'attention' | 'failed' | 'later';
export interface SlotView {
  slot: SlotConfig; state: SlotState; summary?: string; issues: Issue[]; files: FileEntry[];
  coverage?: { covered: string[]; missing: string[]; outOfRange: string[] };
}

export interface DocRef { docKey: string; fileId: string; slotId: string; docType: DocType; label: string; thumbUrl?: string; previewUrl?: string; fileName: string; mime: string }
export interface ConflictValue { docKey: string; value: string; docLabel: string; confidence: number }
export interface ConflictField { key: FieldKey; values: ConflictValue[]; suggestedDocKey: string }
export interface Conflict {
  applicantId: string; signature: string; fields: ConflictField[];
  matches: { key: FieldKey; value: string }[];
  docs: DocRef[];
}
export interface ApplicantView {
  id: string; ready: boolean; fields: FieldRecord[];
  conflict: Conflict | null; conflictResolved: boolean;
}
export interface Analysis { slots: Record<string, SlotView>; applicants: Record<string, ApplicantView>; slotOrder: string[] }
