import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { otherDetails, tokenDiff, type Group } from './logic';
import type { MismatchFlow } from './useMismatchFlow';
import type { UploadedDoc } from './types';

function Diff({ value, other }: { value: string; other: string }) {
  return <>{tokenDiff(value, other).map((t, i) => <Fragment key={i}>{i > 0 && ' '}{t.diff ? <mark>{t.text}</mark> : t.text}</Fragment>)}</>;
}

interface Props { flow: MismatchFlow; groups: Group[]; index: number; onIndex: (i: number) => void; onClose: () => void; onNext: () => void }

/** One dialog per pair of documents. Keyed by pair so its picks and ticks reset when the pair changes. */
export default function MismatchDialog(props: Props) {
  const g = props.groups[Math.min(props.index, props.groups.length - 1)];
  return g ? <PairDialog key={g.key} {...props} group={g} /> : null;
}

function PairDialog({ flow, groups, index, onIndex, onClose, onNext, group }: Props & { group: Group }) {
  const docA = flow.docs.find((d) => d.id === group.a), docB = flow.docs.find((d) => d.id === group.b);
  const labelA = flow.typeLabel(docA?.docType), labelB = flow.typeLabel(docB?.docType);
  const rows = group.rows;
  const [picks, setPicks] = useState<Record<string, string>>({});
  const others = useMemo(() => otherDetails(docA, docB, rows, flow.fieldDefs), [docA, docB, rows, flow.fieldDefs]);
  const [ticks, setTicks] = useState<Record<string, boolean>>(() => {
    const t: Record<string, boolean> = {};
    for (const x of flow.excluded) t[x] = false;
    return t;
  });
  const on = (docId: string, key: string) => ticks[`${docId}|${key}`] !== false;
  const flip = (docId: string, key: string) => setTicks((t) => ({ ...t, [`${docId}|${key}`]: !on(docId, key) }));
  const setAll = (doc: UploadedDoc | undefined, v: boolean) => { if (!doc) return; setTicks((t) => { const n = { ...t }; for (const o of others) if (o.a || o.b) if ((doc.id === group.a ? o.a : o.b)) n[`${doc.id}|${o.key}`] = v; return n; }); };

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLElement>('[data-first]')?.focus(); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const major = rows.some((r) => r.severity === 'major');
  const allSkippable = rows.every((r) => r.skippable);
  const picked = rows.filter((r) => picks[r.id]).length;
  const showA = others.filter((o) => o.a), showB = others.filter((o) => o.b);
  const tickedCount = showA.filter((o) => on(group.a, o.key)).length + showB.filter((o) => on(group.b, o.key)).length;
  const pick = (id: string, v: string) => setPicks((p) => ({ ...p, [id]: p[id] === v ? '' : v }));
  const all = (v: string) => setPicks(Object.fromEntries(rows.map((r) => [r.id, v])));

  const apply = () => {
    const unticked = [
      ...showA.filter((o) => !on(group.a, o.key)).map((o) => `${group.a}|${o.key}`),
      ...showB.filter((o) => !on(group.b, o.key)).map((o) => `${group.b}|${o.key}`),
    ];
    flow.applyChoices(group.a, group.b, Object.fromEntries(rows.map((r) => [r.id, picks[r.id]])), unticked);
    onNext();
  };
  const title = `${labelA} and ${labelB} have different details`;

  return createPortal(
    <div className="mf-wrap">
      <div className="mf-scrim" onClick={onClose} />
      <div className="mf-modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <header>
          <div>
            <b>{title}</b>
            <span className={`mf-pill ${major ? 'major' : 'minor'}`}>{major ? 'Mismatch' : 'Minor mismatch'}</span>
            {rows.some((r) => r.ai_checked) && <span className="mf-pill ai">AI-assisted check</span>}
          </div>
          {groups.length > 1 && (
            <div className="mf-nav">
              <button className="dx-btn dx-btn-g dx-sm" disabled={index === 0} onClick={() => onIndex(index - 1)}>Previous</button>
              <span>{index + 1} of {groups.length}</span>
              <button className="dx-btn dx-btn-g dx-sm" disabled={index >= groups.length - 1} onClick={() => onIndex(index + 1)}>Next</button>
            </div>
          )}
          <button className="dx-x" onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="mf-body">
          <h4>Differing details</h4>
          <table className="mf-table">
            <thead>
              <tr>
                <th>Detail</th><th>{labelA} <button className="dx-link" onClick={() => all(group.a)}>Use all</button></th>
                <th>{labelB} <button className="dx-link" onClick={() => all(group.b)}>Use all</button></th><th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <th scope="row">{r.label}<small>{r.reason}</small></th>
                  <td><button className="mf-cell" data-first={i === 0 ? '' : undefined} aria-pressed={picks[r.id] === group.a} title={r.left.snippet ?? undefined} onClick={() => pick(r.id, group.a)}><Diff value={r.left.value} other={r.right.value} /></button></td>
                  <td><button className="mf-cell" aria-pressed={picks[r.id] === group.b} title={r.right.snippet ?? undefined} onClick={() => pick(r.id, group.b)}><Diff value={r.right.value} other={r.left.value} /></button></td>
                  <td><button className="dx-btn dx-btn-s dx-sm" aria-pressed={picks[r.id] === 'none'} onClick={() => pick(r.id, 'none')}>Neither</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {others.length > 0 && (
            <>
              <h4>Other details found</h4>
              <p className="dx-muted">These are used from both documents unless you untick them.</p>
              <table className="mf-table">
                <thead>
                  <tr>
                    <th>Detail</th>
                    <th>{labelA} <button className="dx-link" onClick={() => setAll(docA, !showA.every((o) => on(group.a, o.key)))}>{showA.every((o) => on(group.a, o.key)) ? 'Untick all' : 'Tick all'}</button></th>
                    <th>{labelB} <button className="dx-link" onClick={() => setAll(docB, !showB.every((o) => on(group.b, o.key)))}>{showB.every((o) => on(group.b, o.key)) ? 'Untick all' : 'Tick all'}</button></th>
                  </tr>
                </thead>
                <tbody>
                  {others.map((o) => (
                    <tr key={o.key}>
                      <th scope="row">{o.label}</th>
                      {([[group.a, o.a], [group.b, o.b]] as const).map(([id, v]) => (
                        <td key={id}>
                          {v ? <button className={`mf-cell tick${on(id, o.key) ? '' : ' off'}`} role="checkbox" aria-checked={on(id, o.key)} aria-pressed={on(id, o.key)} title={v.snippet ?? undefined} onClick={() => flip(id, o.key)}><span aria-hidden>{on(id, o.key) ? '☑' : '☐'}</span> {v.value}</button>
                            : <span className="dx-muted">Not in this document</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <footer>
          <div className="mf-count">{picked} of {rows.length} chosen · {tickedCount} of {showA.length + showB.length} ticked</div>
          <div className="mf-actions">
            <button className="dx-btn dx-btn-p" disabled={picked < rows.length} onClick={apply}>Apply my choices</button>
            <button className="dx-btn dx-btn-s" onClick={() => { flow.trust(group.a, group.b); onNext(); }}>{labelA} is correct</button>
            <button className="dx-btn dx-btn-s" onClick={() => { flow.trust(group.b, group.a); onNext(); }}>{labelB} is correct</button>
            <button className="dx-btn dx-btn-s" onClick={() => { flow.skipForNow(group.a, group.b); onNext(); }}>Skip for now, upload later</button>
            {allSkippable && <button className="dx-btn dx-btn-s" onClick={() => { flow.acceptBoth(rows.map((r) => r.id)); onNext(); }}>Accept both as they are</button>}
            <button className="dx-btn dx-btn-g" onClick={onClose}>Decide later</button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
