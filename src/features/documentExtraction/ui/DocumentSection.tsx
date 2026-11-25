import { useEffect, useRef } from 'react';
import { getBridge } from '../bridge';
import { SCENARIOS } from '../mock/scenarios';
import { addFiles, attachCase, loadScenario, ui } from '../store';
import FormPanel from './FormPanel';
import SlotRow from './SlotRow';
import type { SlotView } from '../types';
import { Icon, useDocState } from './shared';

const SHOW_SAMPLES = !!import.meta.env.DEV;
const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf';

export default function DocumentSection({ caseId, readOnly: forcedRo }: { caseId: string; readOnly: boolean }) {
  const st = useDocState();
  const input = useRef<HTMLInputElement>(null);
  const c = st.cases[caseId];

  // describe the case to the store whenever this section is shown for it
  useEffect(() => {
    const d = getBridge()?.describe(caseId);
    if (d) attachCase(caseId, { ...d, readOnly: d.readOnly || forcedRo });
  });

  const pick = (slotId: string, replaceFileId?: string) => {
    ui.setPicker({ caseId, slotId, replaceFileId });
    input.current?.click();
  };
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = st.ui.picker, list = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (p && list.length) void addFiles(p.caseId, p.slotId, list, p.replaceFileId);
    ui.setPicker(null);
  };

  if (!c) return <div className="dx-root"><p className="dx-muted">Loading the document slots.</p></div>;

  const views = c.analysis.slotOrder.map((id) => c.analysis.slots[id]);
  const done = views.filter((v) => v.state === 'done' && v.slot.type !== 'SUPPORTING').length;
  const total = views.filter((v) => v.slot.type !== 'SUPPORTING').length;
  const reading = views.some((v) => v.state === 'reading');
  const readOnly = c.readOnly;
  // slots already filled when the lead was created are not asked for again; the form shows what they gave
  const fromLead = (v: SlotView) => v.state === 'done' && v.issues.length === 0 && v.files.length > 0 && v.files.every((f) => f.fromLead);
  const hidden = views.filter(fromLead);
  const allIn = hidden.length > 0 && views.every((v) => fromLead(v) || v.slot.type === 'SUPPORTING');

  return (
    <div className="dx-root">
      <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={onFiles} aria-hidden="true" tabIndex={-1} />
      <div className="up-h">
        <div>
          <h2>{allIn ? 'Application form' : 'Documents for the pre-screen'}</h2>
          <p>{allIn ? 'Filled in from the documents uploaded with the lead. Check it and correct anything that is wrong.' : 'Upload the customer’s documents. We read them and fill the application form. Identity and income only.'}{reading ? ' Reading now.' : ''}</p>
        </div>
        {!readOnly && SHOW_SAMPLES && (
          <div className="up-act dx-menu-wrap">
            <button className="btn btn-s btn-sm" onClick={() => (st.ui.menuOpen ? ui.closeMenu() : ui.openMenu())} aria-expanded={st.ui.menuOpen}>
              <Icon name="upload" size={15} />Load the sample files
            </button>
            {st.ui.menuOpen && (
              <div className="dx-menu" role="menu">
                <div className="dx-menu-h">Sample scenarios <span>dev only</span></div>
                {SCENARIOS.filter((s) => !s.needsCoApplicant || c.applicants.length > 1).map((s) => (
                  <button key={s.id} role="menuitem" onClick={() => void loadScenario(caseId, s.id)}>
                    <b>{s.label}</b><small>{s.description}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="up-bar" aria-label={`${done} of ${total} documents read`}><i style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>

      {c.applicants.map((a) => {
        const mine = views.filter((v) => v.slot.applicantId === a.id);
        const av = c.analysis.applicants[a.id];
        return (
          <section className="dx-person" key={a.id}>
            <header className="dx-person-h"><b>{a.name}</b><span>{a.role}</span><em>{mine.filter((v) => v.state === 'done' && v.slot.type !== 'SUPPORTING').length} of {mine.filter((v) => v.slot.type !== 'SUPPORTING').length} read</em></header>
            {mine.some(fromLead) && <p className="dx-sum dx-muted" style={{ margin: '4px 0 8px' }}>Uploaded with the lead: {mine.filter(fromLead).map((v) => v.slot.label).join(', ')}.</p>}
            {mine.filter((v) => !fromLead(v)).map((v) => <SlotRow key={v.slot.id} caseId={caseId} view={v} readOnly={readOnly} onPick={pick} />)}
            {av && <FormPanel caseId={caseId} name={a.name} view={av} readOnly={readOnly} />}
          </section>
        );
      })}
    </div>
  );
}
