import { useState } from 'react';
import { FIELD_LABELS, FIELD_ORDER } from '../constants';
import { pickField, setManual, ui } from '../store';
import type { ApplicantView, FieldKey, FieldRecord } from '../types';
import { Icon } from './shared';

const CORE: FieldKey[] = ['name', 'dob', 'pan', 'address'];

const sourceText = (f: FieldRecord): string => {
  if (f.source === 'manual') return 'Typed by you';
  if (f.source === 'lead') return 'From the lead';
  if (f.source) return `From ${f.source.label}${f.source.page ? `, page ${f.source.page}` : ''}${f.confidence != null ? `. Confidence ${Math.round(f.confidence * 100)}%` : ''}`;
  return '';
};

function FieldRow({ caseId, applicantId, k, rec, readOnly }: { caseId: string; applicantId: string; k: FieldKey; rec?: FieldRecord; readOnly: boolean }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const value = draft ?? rec?.value ?? '';
  const commit = () => { if (draft != null && draft !== (rec?.value ?? '')) setManual(caseId, applicantId, k, draft); setDraft(null); };
  const status = rec?.status;
  const marker = status === 'conflict' ? 'Choose' : status === 'needs-check' ? 'Check' : null;

  return (
    <div className={`dx-fr${status ? ' dx-fr-' + status : ''}`}>
      <label htmlFor={`dx-${applicantId}-${k}`}>{FIELD_LABELS[k]}</label>
      <div className="dx-fr-v">
        <input
          id={`dx-${applicantId}-${k}`}
          value={value}
          placeholder={rec ? '' : 'Not read yet'}
          readOnly={readOnly}
          title={rec ? sourceText(rec) : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setDraft(null); }}
        />
        {rec && <span className="dx-src" title={sourceText(rec)}>{rec.source === 'manual' ? 'Typed' : rec.source === 'lead' ? 'Lead' : rec.source ? rec.source.label : ''}</span>}
        {status === 'confirmed' && <span className="dx-ok" title="Confirmed"><Icon name="check" size={14} /></span>}
        {marker && (
          <button className={`dx-mark dx-mark-${status}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>{marker}</button>
        )}
      </div>
      {open && rec && (
        <div className="dx-pop" role="group" aria-label={`Check ${FIELD_LABELS[k]}`}>
          {rec.note && <p>{rec.note}</p>}
          {(rec.alternatives ?? []).map((a, i) => (
            <button key={i} className="dx-alt" disabled={readOnly} onClick={() => { pickField(caseId, applicantId, k, i); setOpen(false); }}>
              <b>{a.value}</b><small>{a.sourceLabel}</small>
            </button>
          ))}
          {!rec.alternatives && <button className="dx-alt" disabled={readOnly} onClick={() => { pickField(caseId, applicantId, k, 'confirm'); setOpen(false); }}><b>{rec.value}</b><small>Keep this value</small></button>}
          {rec.alternatives && rec.status === 'needs-check' && <button className="dx-btn dx-btn-g dx-sm" disabled={readOnly} onClick={() => { pickField(caseId, applicantId, k, 'confirm'); setOpen(false); }}>Keep {rec.value}</button>}
        </div>
      )}
    </div>
  );
}

export default function FormPanel({ caseId, name, view, readOnly }: { caseId: string; name: string; view: ApplicantView; readOnly: boolean }) {
  const [shown, setShown] = useState(true);
  const byKey = new Map(view.fields.map((f) => [f.key, f]));
  const keys = FIELD_ORDER.filter((k) => byKey.has(k) || CORE.includes(k));
  const conflictKeys = view.conflict?.fields.map((f) => FIELD_LABELS[f.key]) ?? [];
  const checks = view.fields.filter((f) => f.status === 'needs-check' || f.status === 'conflict').length;

  return (
    <section className="dx-form">
      <header onClick={() => setShown((s) => !s)}>
        <b>Application form, {name}</b>
        <span className="dx-form-n">{checks ? `${checks} to check` : view.ready ? 'Filled from documents' : 'Reading'}</span>
        <Icon name="chev" size={16} />
      </header>
      {shown && (
        <div className="dx-form-b">
          {view.conflict && !view.conflictResolved && (
            <div className="dx-banner">
              <Icon name="alert" size={16} />
              <span>The documents disagree on {conflictKeys.join(' and ').toLowerCase()}.</span>
              <button className="dx-btn dx-btn-p dx-sm" disabled={readOnly} onClick={() => ui.openDialog(caseId, view.id)}>Resolve</button>
            </div>
          )}
          {view.conflict && view.conflictResolved && (
            <div className="dx-banner dx-banner-ok"><Icon name="check" size={16} /><span>Document mismatch resolved.</span><button className="dx-btn dx-btn-g dx-sm" disabled={readOnly} onClick={() => ui.openDialog(caseId, view.id)}>Change</button></div>
          )}
          <div className="dx-grid">
            {keys.map((k) => <FieldRow key={k + (byKey.get(k)?.value ?? '') + (byKey.get(k)?.status ?? '')} caseId={caseId} applicantId={view.id} k={k} rec={byKey.get(k)} readOnly={readOnly} />)}
          </div>
        </div>
      )}
    </section>
  );
}
