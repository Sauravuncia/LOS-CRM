/**
 * The ONLY module that talks to the document-reading backend (POST /api/documents/extract).
 * The backend reads one PDF per call, recognises its type and returns normalised field values.
 */
import { REQUEST_TIMEOUT_MS } from './constants';
import type { RetryableError } from './retry';

const env = import.meta.env as Record<string, string | undefined>;
export const API_URL = (env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export interface BackendValue { value: string | null; snippet?: string | null }
export interface BackendExtraction {
  doc_type: string | null;
  needs_type: boolean;
  wrong_document: boolean;
  ok: boolean;
  error: string | null;
  warning: string | null;
  filename: string;
  values: Record<string, BackendValue>;
}

export class BackendError extends Error implements RetryableError {
  retryable: boolean;
  status?: number;
  constructor(message: string, retryable: boolean, status?: number) { super(message); this.name = 'BackendError'; this.retryable = retryable; this.status = status; }
}

const detailOf = async (res: Response): Promise<string | null> => {
  try { const j = await res.json(); return typeof j?.detail === 'string' ? j.detail : null; } catch { return null; }
};

/** Sends one file to the backend. Network errors, timeouts and 5xx (except 503, a missing key) are worth retrying. */
export async function extractViaBackend(blob: Blob, name: string): Promise<BackendExtraction> {
  const form = new FormData();
  form.append('file', blob, name);
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}/api/documents/extract`, { method: 'POST', body: form, signal: ctl.signal });
    if (!res.ok) {
      const detail = await detailOf(res);
      if (res.status === 413) throw new BackendError('This file is too large for the reader', false, 413);
      if (res.status === 415) throw new BackendError('The reader accepts PDF files only', false, 415);
      if (res.status === 503) throw new BackendError(detail || 'The reader is not set up on the server', false, 503);
      throw new BackendError(detail || `The reader returned an error (${res.status})`, res.status >= 500, res.status);
    }
    return (await res.json()) as BackendExtraction;
  } catch (e) {
    if (e instanceof BackendError) throw e;
    if ((e as Error)?.name === 'AbortError') throw new BackendError('The reader took too long to answer', true);
    throw new BackendError('Could not reach the reader. Check that the backend is running.', true);
  } finally {
    clearTimeout(timer);
  }
}
