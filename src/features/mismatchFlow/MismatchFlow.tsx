import { useEffect, useRef, useState } from 'react';
import MismatchDialog from './MismatchDialog';
import { useMismatchFlow } from './useMismatchFlow';
import type { UploadedDoc } from './types';
import './mismatchFlow.css';

/** Upload, differences and form preview, behind the VITE_MISMATCH_FLOW flag. Self-contained: it does not touch the case engine. */
export default function MismatchFlow() {
  const flow = useMismatchFlow();
  const { docs, docTypes, groups, openCount, analysis } = flow;
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [index, setIndex] = useState(0);
  const [pickType, setPickType] = useState('');
  const seen = useRef(new Set<string>());
  const reopen = useRef(false);

  /* open automatically the first time a new open mismatch appears */
  useEffect(() => {
    const open = analysis?.open_mismatches ?? [];
    const fresh = open.some((id) => !seen.current.has(id));
    if (open.length && (fresh || reopen.current) && !dialog) { setDrawer(true); setIndex(0); setDialog(true); open.forEach((id) => seen.current.add(id)); }
    if (!open.length) reopen.current = false;
    else if (reopen.current && dialog) reopen.current = false;
  }, [analysis, dialog]);

  const close = () => { (analysis?.open_mismatches ?? []).forEach((id) => seen.current.add(id)); reopen.current = false; setDialog(false); };
  /** After a resolution, show the next pair once the fresh analysis arrives. */
  const next = () => { setDialog(false); reopen.current = true; };

  const fileInput = useRef<HTMLInputElement>(null);
  const label = (d: UploadedDoc) => flow.typeLabel(d.docType) || 'Unknown document';

  return (
    <>
      <button className="mf-launch dx-btn dx-btn-p" onClick={() => setDrawer((v) => !v)}>
        Documents{openCount > 0 ? ` · ${openCount} difference${openCount > 1 ? 's' : ''}` : ''}
      </button>

      {drawer && (
        <aside className="mf-drawer" aria-label="Documents">
          <header><b>Documents</b><button className="dx-x" onClick={() => setDrawer(false)} aria-label="Close panel">×</button></header>

          <section>
            <div className="mf-up">
              <select value={pickType} onChange={(e) => setPickType(e.target.value)} aria-label="Document type">
                <option value="">Detect the type</option>
                {docTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <input ref={fileInput} type="file" multiple hidden accept=".pdf,image/*" onChange={(e) => { flow.uploadMany([...(e.target.files ?? [])], pickType || undefined); e.target.value = ''; }} />
              <button className="dx-btn dx-btn-p" onClick={() => fileInput.current?.click()}>Upload files</button>
            </div>

            {docs.map((d) => <DocRow key={d.id} d={d} flow={flow} label={label(d)} />)}
            {!docs.length && <p className="dx-muted">No documents yet.</p>}
          </section>

          {(openCount > 0 || flow.parked.length > 0 || flow.missing.length > 0) && (
            <section className="mf-block">
              <b>Before you continue</b>
              <ul>
                {groups.map((g, i) => {
                  const a = docs.find((d) => d.id === g.a), b = docs.find((d) => d.id === g.b);
                  return <li key={g.key}><button className="dx-link" onClick={() => { setIndex(i); setDialog(true); }}>Resolve differences: {flow.typeLabel(a?.docType)} vs {flow.typeLabel(b?.docType)} ({g.rows.length})</button></li>;
                })}
                {flow.parked.map((d) => <li key={d.id}>Waiting for the correct {label(d)}</li>)}
                {flow.missing.map((m) => <li key={m}>Still to upload: {flow.typeLabel(m)}</li>)}
              </ul>
            </section>
          )}

          {analysis && (
            <section>
              <b>Form preview</b>
              {Object.keys(flow.form).length === 0 && <p className="dx-muted">Nothing filled yet.</p>}
              {Object.entries(flow.form).map(([key, value]) => {
                const f = analysis.fields[key], def = flow.fieldDefs.find((x) => x.key === key);
                const state = flow.editedKeys.has(key) ? 'edited' : f?.status === 'conflict' ? 'review' : 'auto';
                return (
                  <label key={key} className={`mf-field ${state}`} title={f?.source_document ? `${f.source_document}${f.snippet ? `: ${f.snippet}` : ''}` : undefined}>
                    <span>{def?.label ?? key}{state === 'review' && <em> needs review</em>}{state === 'auto' && <em> from documents</em>}</span>
                    <input value={value} onChange={(e) => flow.setField(key, e.target.value)} />
                  </label>
                );
              })}
            </section>
          )}

          <footer>
            {flow.issues.map((i) => <p key={i.key} className="mf-err">{i.key.startsWith('doc:') ? `Missing document: ${flow.typeLabel(i.key.slice(4))}. ` : ''}{i.message}</p>)}
            {flow.submitted && <p className="mf-ok">Saved.</p>}
            <button className="dx-btn dx-btn-p" disabled={flow.blocked || flow.submitting || !analysis} onClick={flow.submit}>{flow.submitting ? 'Saving…' : 'Continue'}</button>
          </footer>
        </aside>
      )}

      {dialog && groups.length > 0 && <MismatchDialog flow={flow} groups={groups} index={index} onIndex={setIndex} onClose={close} onNext={next} />}

      <div className="mf-toasts" role="status" aria-live="polite">
        {flow.toasts.map((t) => <div key={t.id} className={`mf-toast ${t.kind}`}>{t.text}</div>)}
      </div>
    </>
  );
}

function DocRow({ d, flow, label }: { d: UploadedDoc; flow: ReturnType<typeof useMismatchFlow>; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const picker = (
    <select aria-label={`Type of ${d.filename}`} value={d.docType} onChange={(e) => e.target.value && flow.changeType(d.id, e.target.value)}>
      <option value="">{d.status === 'needs_type' ? 'What is this?' : 'Change type'}</option>
      {flow.docTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
    </select>
  );
  return (
    <div className={`mf-doc ${d.status}`}>
      <div className="mf-doc-h">
        <b>{d.status === 'needs_type' ? 'Unknown document' : label}</b>
        <small>{d.filename}</small>
        <span className="dx-chip">{d.status === 'reading' ? 'Reading…' : d.status === 'ready' ? 'Ready' : d.status === 'parked' ? 'Waiting' : d.status === 'failed' ? 'Failed' : 'Needs type'}</span>
      </div>
      {d.status === 'parked' && <p className="mf-warn">Waiting for the correct {label}. Nothing from this file is used.</p>}
      {d.status === 'needs_type' && <p className="mf-warn">We could not tell what this file is. Choose its type.</p>}
      {d.status === 'failed' && <p className="mf-err">{d.error}</p>}
      {d.note && <p className="mf-warn">{d.note}</p>}
      {d.warning && !d.note && <p className="dx-muted">{d.warning}</p>}
      <div className="mf-doc-a">
        <input ref={input} type="file" hidden accept=".pdf,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) flow.replace(d.id, f); e.target.value = ''; }} />
        {d.status === 'parked' && <>
          <button className="dx-btn dx-btn-p dx-sm" onClick={() => input.current?.click()}>Upload correct file</button>
          <button className="dx-link" onClick={() => flow.useAnyway(d.id)}>Use anyway</button>
        </>}
        {d.status === 'failed' && <button className="dx-btn dx-btn-s dx-sm" onClick={() => flow.retry(d.id)}>Try again</button>}
        {(d.status === 'ready' || d.status === 'needs_type' || d.status === 'failed') && picker}
        {d.status !== 'parked' && d.status !== 'reading' && <button className="dx-btn dx-btn-s dx-sm" onClick={() => input.current?.click()}>Replace</button>}
        {d.status !== 'reading' && <button className="dx-btn dx-btn-g dx-sm dx-danger" onClick={() => flow.remove(d.id)}>Remove</button>}
      </div>
    </div>
  );
}
