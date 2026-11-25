import { useRef, useSyncExternalStore } from 'react';
import { leadDraft, type DraftSlot } from '../leadDraft';
import { Icon } from './shared';

const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf';
const ROWS: { who: string; slots: [DraftSlot, string, string][] }[] = [
  { who: 'Applicant', slots: [['pan_a1', 'PAN', 'Drop a file here, or choose one.'], ['adh_a1', 'Aadhaar (masked)', 'The masked Aadhaar. Add the back side if it is a separate file.'], ['sal_a1', 'Salary slips', 'One PDF can hold several months.']] },
];

/** Document pickers inside the New lead form. Nothing is read until the lead is created. */
export default function LeadDocs() {
  const picked = useSyncExternalStore(leadDraft.subscribe, leadDraft.get);
  const input = useRef<HTMLInputElement>(null);
  const target = useRef<DraftSlot | null>(null);
  const choose = (s: DraftSlot) => { target.current = s; input.current?.click(); };

  return (
    <div className="dx-root nl-docs">
      <input ref={input} type="file" accept={ACCEPT} hidden aria-hidden="true" tabIndex={-1}
        onChange={(e) => { const f = e.target.files?.[0]; if (f && target.current) leadDraft.set(target.current, f); e.target.value = ''; }} />
      <div className="nl-docs-h"><b>Documents</b><span>Optional. Add them now, or later from the lead. We read them after the lead is created.</span></div>
      {ROWS.map((r) => (
        <section key={r.who} className="dx-person">
          <header className="dx-person-h"><b>{r.who}</b></header>
          {r.slots.map(([slot, label, hint]) => {
            const f = picked[slot];
            return (
              <div className="dx-slot nl-slot" key={slot}>
                <div className="dx-slot-h">
                  <Icon name="file" size={16} />
                  <span className="dx-slot-t">{label}</span>
                  <span className={`dx-chip${f ? ' dx-chip-done' : ''}`}>{f ? 'Ready to upload' : 'Not added'}</span>
                  <span className="dx-slot-act">
                    <button type="button" className="dx-btn dx-btn-s dx-sm" onClick={() => choose(slot)}><Icon name="upload" size={14} />{f ? 'Change' : 'Upload'}</button>
                    {f && <button type="button" className="dx-btn dx-btn-g dx-sm dx-danger" onClick={() => leadDraft.set(slot, null)}>Remove</button>}
                  </span>
                </div>
                {f ? <p className="dx-sum">{f.name}</p> : hint && <p className="dx-sum dx-muted">{hint}</p>}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
