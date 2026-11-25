/** Contract of the Onboarding Accelerator API (the parts used by the mismatch flow). */
export interface ReadValue { value: string; snippet?: string | null }

export interface DocTypeDef { id: string; label: string; extract: boolean }
export interface FieldDef { key: string; label: string; hidden: boolean; placement: string; subgroup?: string | null }
export interface RequirementsResponse { doc_types: DocTypeDef[]; slots?: unknown[] }

export interface DocumentExtractResponse {
  doc_type: string | null;
  detected_by: 'user' | 'rules' | 'ai' | null;
  needs_type: boolean;
  wrong_document: boolean;
  expected_type: string | null;
  filename: string;
  ok: boolean;
  error: string | null;
  warning: string | null;
  values: Record<string, ReadValue>;
}

export interface DocRecord { doc_id: string; slot_id: string; doc_type: string; filename: string; values: Record<string, ReadValue> }
export interface AnalyzeRequest {
  documents: DocRecord[];
  context?: Record<string, string>;
  acknowledged?: string[];
  choices?: Record<string, string>;
  excluded?: string[];
}
export interface Reading { doc_id: string; doc_type: string; doc_label: string; filename: string; key: string; label: string; value: string; snippet: string | null }
export interface Mismatch {
  id: string; concept: string; label: string;
  rule: 'ID' | 'NAME' | 'DATE' | 'ADDR' | 'GEN' | 'AMT';
  severity: 'minor' | 'major'; skippable: boolean;
  left: Reading; right: Reading;
  reason: string; ai_checked: boolean;
  status: 'open' | 'skipped' | 'chosen';
  chosen_doc_id: string | null;
}
export interface ExtractedField {
  key: string; value: string | null; status: 'found' | 'not_found' | 'conflict';
  source_document: string | null; snippet: string | null;
  candidates: { value: string; source_document: string; snippet: string | null }[];
}
export interface AnalyzeResponse {
  fields: Record<string, ExtractedField>;
  mismatches: Mismatch[];
  slots: { id: string; active: boolean; satisfied: boolean; count: number; needed: number }[];
  missing: string[];
  open_mismatches: string[];
}

export interface MismatchResolution { id: string; label: string; left_doc: string; right_doc: string; resolution: string }
export interface SubmissionIssue { key: string; message: string }

export type DocStatus = 'reading' | 'ready' | 'failed' | 'needs_type' | 'parked';
export interface UploadedDoc {
  id: string; slotId: string; docType: string; filename: string;
  status: DocStatus;
  values: Record<string, ReadValue>;
  error?: string; warning?: string; note?: string;
}
