import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FIELD_LABELS } from '../constants';
import { removeOnly, resolveConflict, ui } from '../store';
import type { Conflict, FieldKey, Resolution, ResolutionOption } from '../types';
import { Icon, useDocState } from './shared';

function Modal({ title, sub, onClose, children, foot, wide }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode; foot?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return createPortal(
    <div className="dx-modal-wrap">
      <div className="dx-scrim" onClick={onClose} />
      <div className={`dx-modal${wide ? ' dx-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><div><b>{title}</b>{sub && <small>{sub}</small>}</div><button className="dx-x" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button></header>
        <div className="dx-modal-b">{children}</div>
        {foot && <footer>{foot}</footer>}
      </div>
    </div>,
    document.body,
  );
}

function ConflictDialog({ caseId, applicantId }: { caseId: string; applicantId: string }) {
  const { cases } = useDocState();
  const c = cases[caseId];
  const conflict: Conflict | null = c?.analysis.applicants[applicantId]?.conflict ?? null;
  const app = c?.applicants.find((a) => a.id === applicantId);
  const [option, setOption] = useState<ResolutionOption>('pick');
  const [picks, setPicks] = useState<Resolution['picks']>({});
  const [typed, setTyped] = useState<Partial<Record<FieldKey, string>>>({});
  const [trust, setTrust] = useState('');
  const [later, setLater] = useState('');
  const [note, setNote] = useState('');
  const [showMatches, setShowMatches] = useState(false);

  const firstSug = conflict?.fields[0]?.suggestedDocKey ?? '';
  const trustDoc = trust || firstSug;
  const laterSlot = later || conflict?.docs[0]?.slotId || '';
  const docs = conflict?.docs ?? [];
  const valueOf = (key: FieldKey, docKey: string) => conflict?.fields.find((f) => f.key === key)?.values.find((v) => v.docKey === docKey);

  const chosenFor = (key: FieldKey) => {
    const p = picks[key];
    if (p && 'docKey' in p) return p.docKey;
    return conflict?.fields.find((f) => f.key === key)?.suggestedDocKey ?? '';
  };

  if (!c || !conflict || !app) return null;

  const apply = () => {
    const finalPicks: Resolution['picks'] = {};
    if (option === 'pick') for (const f of conflict.fields) {
      const t = (typed[f.key] ?? '').trim();
      finalPicks[f.key] = picks[f.key] && 'manual' in (picks[f.key] as object) && t ? { manual: t } : { docKey: chosenFor(f.key) };
    }
    resolveConflict(caseId, { applicantId, option, note: note.trim(), picks: finalPicks, trustDocKey: option === 'one' ? trustDoc : undefined, reuploadSlotId: option === 'skip' ? laterSlot : undefined });
  };

  const opts: { id: ResolutionOption; t: string; d: string }[] = [
    { id: 'pick', t: 'Pick a source for each field', d: 'Choose which document each value comes from, or type a value.' },
    { id: 'one', t: 'Use one document for everything', d: 'The other document’s slot will ask for a corrected copy.' },
    { id: 'skip', t: 'Skip for now', d: 'Use no data from these documents. The fields stay empty for you to fill in.' },
    { id: 'support', t: 'Add a supporting document', d: 'For a real name change, such as after marriage. Keep both documents and ask for a marriage certificate or declaration.' },
  ];

  return (
    <Modal wide title={`Documents disagree: ${app.name}`} sub="Compare the documents side by side, then decide." onClose={ui.closeDialog}
      foot={<><button className="dx-btn dx-btn-s" onClick={ui.closeDialog}>Cancel</button><button className="dx-btn dx-btn-p" onClick={apply}>Apply</button></>}>
      <div className="dx-cmp" style={{ gridTemplateColumns: `150px repeat(${docs.length}, minmax(0, 1fr))` }}>
        <div />
        {docs.map((d) => (
          <div className="dx-cmp-doc" key={d.docKey}>
            <button className="dx-bigthumb" onClick={() => d.previewUrl && ui.openPreview({ url: d.previewUrl, mime: d.mime, name: d.fileName })} aria-label={`Open ${d.label}`}>
              {d.thumbUrl ? <img src={d.thumbUrl} alt="" /> : <Icon name="file" size={26} />}
              <span><Icon name="eye" size={13} />Larger</span>
            </button>
            <b>{d.label}</b><small>{d.fileName}</small>
          </div>
        ))}
        {conflict.fields.map((f) => (
          <div className="dx-cmp-row dx-cmp-bad" key={f.key} style={{ display: 'contents' }}>
            <div className="dx-cmp-l bad">{FIELD_LABELS[f.key]}</div>
            {docs.map((d) => {
              const v = valueOf(f.key, d.docKey);
              return (
                <div className="dx-cmp-c bad" key={d.docKey}>
                  {v ? (
                    <label className={option === 'pick' ? 'dx-pickv' : undefined}>
                      {option === 'pick' && <input type="radio" name={`pick-${f.key}`} checked={chosenFor(f.key) === d.docKey && !(picks[f.key] && 'manual' in (picks[f.key] as object))} onChange={() => setPicks({ ...picks, [f.key]: { docKey: d.docKey } })} />}
                      <span>{v.value}</span>
                      {v.confidence < 0.75 && <em>low confidence</em>}
                    </label>
                  ) : <span className="dx-muted">Not on this document</span>}
                </div>
              );
            })}
            {option === 'pick' && (
              <div className="dx-cmp-type" style={{ gridColumn: '1 / -1' }}>
                <label><input type="radio" name={`pick-${f.key}`} checked={!!picks[f.key] && 'manual' in (picks[f.key] as object)} onChange={() => setPicks({ ...picks, [f.key]: { manual: typed[f.key] ?? '' } })} />Type a value for {FIELD_LABELS[f.key].toLowerCase()}</label>
                <input className="dx-in" value={typed[f.key] ?? ''} placeholder="Type the correct value" onChange={(e) => { setTyped({ ...typed, [f.key]: e.target.value }); setPicks({ ...picks, [f.key]: { manual: e.target.value } }); }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {conflict.matches.length > 0 && (
        <div className="dx-matches">
          <button className="dx-link" onClick={() => setShowMatches((s) => !s)} aria-expanded={showMatches}>{conflict.matches.length} {conflict.matches.length === 1 ? 'field matches' : 'fields match'}</button>
          {showMatches && <ul>{conflict.matches.map((m) => <li key={m.key}><span>{FIELD_LABELS[m.key]}</span><b>{m.value}</b></li>)}</ul>}
        </div>
      )}

      <fieldset className="dx-opts">
        <legend>What do you want to do?</legend>
        {opts.map((o) => (
          <label key={o.id} className={`dx-opt${option === o.id ? ' on' : ''}`}>
            <input type="radio" name="dx-opt" checked={option === o.id} onChange={() => setOption(o.id)} />
            <span><b>{o.t}</b><small>{o.d}</small>
              {option === o.id && o.id === 'one' && (
                <select className="dx-in" value={trustDoc} onChange={(e) => setTrust(e.target.value)} aria-label="Document to trust">
                  {docs.map((d) => <option key={d.docKey} value={d.docKey}>Trust {d.label}</option>)}
                </select>
              )}
              {option === o.id && o.id === 'skip' && (
                <select className="dx-in" value={laterSlot} onChange={(e) => setLater(e.target.value)} aria-label="Document to upload later">
                  {docs.map((d) => <option key={d.slotId} value={d.slotId}>Re-upload {d.label} later</option>)}
                </select>
              )}
            </span>
          </label>
        ))}
      </fieldset>
      <label className="dx-note">Note (optional)<textarea className="dx-in" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="For example: customer married in 2024" /></label>
    </Modal>
  );
}

function RemovePrompt() {
  const { ui: u, cases } = useDocState();
  const p = u.removePrompt;
  if (!p) return null;
  const file = cases[p.caseId]?.files.find((f) => f.id === p.fileId);
  return (
    <Modal title={`Remove ${file?.name ?? 'this file'}?`} sub={`It filled ${p.fields.length} ${p.fields.length === 1 ? 'field' : 'fields'} in the form.`} onClose={ui.cancelRemove}
      foot={<><button className="dx-btn dx-btn-s" onClick={ui.cancelRemove}>Cancel</button><button className="dx-btn dx-btn-s dx-danger" onClick={() => removeOnly(p.caseId, p.fileId, p.slotId, 'clear')}>Clear those fields</button><button className="dx-btn dx-btn-p" onClick={() => removeOnly(p.caseId, p.fileId, p.slotId, 'keep')}>Keep them as typed values</button></>}>
      <ul className="dx-list">{p.fields.map((f) => <li key={f.applicantId + f.key}><span>{FIELD_LABELS[f.key]}</span><b>{f.value}</b></li>)}</ul>
    </Modal>
  );
}

function Preview() {
  const { ui: u } = useDocState();
  const p = u.preview;
  if (!p) return null;
  return (
    <Modal wide title={p.name} onClose={ui.closePreview}>
      {p.mime === 'application/pdf' && !p.url.startsWith('data:') ? <iframe className="dx-frame" title={p.name} src={p.url} /> : <img className="dx-full" src={p.url} alt={p.name} />}
    </Modal>
  );
}

/** Mounted once at the app root: the conflict dialog, the preview and the remove prompt. */
export default function Dialogs() {
  const { ui: u } = useDocState();
  const ctx = useMemo(() => u.dialogApplicant, [u.dialogApplicant]);
  return (
    <>
      {ctx && <ConflictDialog key={ctx.caseId + ctx.applicantId} caseId={ctx.caseId} applicantId={ctx.applicantId} />}
      <RemovePrompt />
      <Preview />
    </>
  );
}
