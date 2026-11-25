import type {
  AnalyzeRequest, AnalyzeResponse, DocumentExtractResponse, FieldDef, RequirementsResponse, SubmissionIssue,
} from './types';

const env = import.meta.env as Record<string, string | undefined>;
export const API_BASE = (env.VITE_ONBOARDING_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export class ApiError extends Error {
  status: number; issues: SubmissionIssue[];
  constructor(message: string, status: number, issues: SubmissionIssue[] = []) { super(message); this.name = 'ApiError'; this.status = status; this.issues = issues; }
}
export const isAbort = (e: unknown) => (e as { name?: string })?.name === 'AbortError';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try { res = await fetch(`${API_BASE}/api${path}`, init); }
  catch (e) {
    if (isAbort(e)) throw e;
    throw new ApiError('Could not reach the server. Check that the backend is running.', 0);
  }
  if (!res.ok) {
    let detail = `The server returned an error (${res.status})`, issues: SubmissionIssue[] = [];
    try {
      const j = await res.json();
      if (typeof j?.detail === 'string') detail = j.detail;
      if (Array.isArray(j?.issues)) issues = j.issues;
    } catch { /* body was not JSON */ }
    throw new ApiError(detail, res.status, issues);
  }
  return (await res.json()) as T;
}
const json = (body: unknown, signal?: AbortSignal): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });

export const getRequirements = () => call<RequirementsResponse>('/requirements');
export const getFields = async (): Promise<FieldDef[]> => {
  const r = await call<FieldDef[] | { fields: FieldDef[] }>('/fields');
  return Array.isArray(r) ? r : r.fields ?? [];
};

/** Reads ONE pdf. Omit docType to auto-detect; forceType is for a type the user chose on purpose. */
export function extractDocument(file: File, docType?: string, forceType?: boolean): Promise<DocumentExtractResponse> {
  const form = new FormData();
  form.append('file', file, file.name);
  if (docType) form.append('doc_type', docType);
  if (forceType) form.append('force_type', 'true');
  return call<DocumentExtractResponse>('/documents/extract', { method: 'POST', body: form });
}
export const analyzeDocuments = (req: AnalyzeRequest, signal: AbortSignal) => call<AnalyzeResponse>('/analyze', json(req, signal));
export const submitApplication = (body: unknown) => call<unknown>('/submissions', json(body));
