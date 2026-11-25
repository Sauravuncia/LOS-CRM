import type { CaseDocLite } from './slotConfig';
import type { Applicant, FieldRecord, SlotState } from './types';

/**
 * The seam between this feature and the case engine (engine.js). The engine registers an implementation
 * at start-up; this feature never imports the engine, so it can be tested and moved on its own.
 */
export interface CaseDescription { applicants: Applicant[]; docs: CaseDocLite[]; readOnly: boolean }

export interface SyncPayload {
  /** One entry per slot: drives the "uploaded" ticks and the Documents counts. */
  slots: Record<string, { state: SlotState; files: string[] }>;
  /** Form values by `${applicantId}.${FieldKey}`, with provenance. The Case file reads these. */
  fields: Record<string, FieldRecord>;
  /** Extra document slots to track, such as a supporting document for a name change. */
  extraDocs: { id: string; label: string }[];
}

export interface Bridge {
  describe(caseId: string): CaseDescription | null;
  sync(caseId: string, payload: SyncPayload): void;
  log(caseId: string, text: string, detail: string): void;
  user(): string;
}

let bridge: Bridge | null = null;
export const setBridge = (b: Bridge) => { bridge = b; };
export const getBridge = () => bridge;
