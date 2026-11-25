import { useState } from 'react';
import type { Issue, IssueAction, SlotView } from '../types';
import { addFiles, attachBoth, markLater, moveFile, removeFile, retry, ui, useAnyway } from '../store';
import { Icon, Spinner } from './shared';

interface Props { caseId: string; view: SlotView; readOnly: boolean; onPick: (slotId: string, replaceFileId?: string) => void }

const STATE_LABEL: Record<SlotView['state'], string> = {
  empty: 'Not uploaded', reading: 'Reading', done: 'Read', attention: 'Needs attention', failed: 'Couldn’t read', later: 'Upload later',
};

export default function SlotRow({ caseId, view, readOnly, onPick }: Props) {
  const { slot, state, issues, files } = view;
  const [over, setOver] = useState(false);

  const run = (a: IssueAction, issue: Issue) => {
    switch (a.kind) {
      case 'move': return moveFile(caseId, a.fileId!, a.fromSlotId!, a.toSlotId!, false);
      case 'replace': return moveFile(caseId, a.fileId!, a.fromSlotId!, a.toSlotId!, true);
      case 'useAnyway': return useAnyway(caseId, a.fileId!, a.fromSlotId ?? slot.id);
      case 'attachBoth': return attachBoth(caseId, a.fileId!, a.toSlotId!);
      case 'retry': return retry(caseId, a.fileId!);
      case 'remove': return removeFile(caseId, a.fileId!, a.fromSlotId ?? slot.id);
      case 'upload': return onPick(slot.id, a.fileId ?? (issue.kind === 'CORRECTED_COPY' ? files[0]?.id : undefined));
      case 'addFile': return onPick(slot.id);
      case 'uploadLater': return markLater(caseId, slot.id, true);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setOver(false);
    if (readOnly) return;
    const list = Array.from(e.dataTransfer.files);
    if (list.length) void addFiles(caseId, slot.id, list);
  };

  const readable = files.filter((f) => f.status !== 'rejected' || f.rejectReason !== 'UNMASKED_AADHAAR');

  return (
    <div
      className={`dx-slot dx-${state}${over ? ' dx-over' : ''}`}
      onDragOver={(e) => { if (!readOnly) { e.preventDefault(); setOver(true); } }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      data-slot={slot.id}
    >
      <div className="dx-slot-h">
        <Icon name={slot.type === 'SUPPORTING' ? 'file' : 'memo'} size={18} />
        <span className="dx-slot-t">{slot.label}</span>
        <span className={`dx-chip dx-chip-${state}`}>
          {state === 'reading' ? <Spinner /> : state === 'done' ? <Icon name="check" size={13} /> : state === 'attention' || state === 'failed' ? <Icon name="alert" size={13} /> : null}
          {STATE_LABEL[state]}
        </span>
        {!readOnly && (
          <span className="dx-slot-act">
            {state === 'empty' && (<>
              <button className="dx-btn dx-btn-s" onClick={() => onPick(slot.id)}><Icon name="upload" size={15} />Upload</button>
              <button className="dx-btn dx-btn-g" onClick={() => markLater(caseId, slot.id, true)}>Upload later</button>
            </>)}
            {state === 'later' && (<>
              <button className="dx-btn dx-btn-s" onClick={() => onPick(slot.id)}><Icon name="upload" size={15} />Upload now</button>
              <button className="dx-btn dx-btn-g" onClick={() => markLater(caseId, slot.id, false)}>Undo</button>
            </>)}
            {(state === 'done' || state === 'attention') && files.length > 0 && slot.type !== 'SUPPORTING' && (
              <button className="dx-btn dx-btn-g" onClick={() => onPick(slot.id)}><Icon name="plus" size={14} />Add a file</button>
            )}
          </span>
        )}
      </div>

      {state === 'done' && view.summary && <p className="dx-sum">{view.summary}</p>}
      {state === 'reading' && <p className="dx-sum dx-muted">Reading the file. You can keep working.</p>}
      {state === 'later' && view.summary && <p className="dx-sum dx-muted">{view.summary}</p>}
      {state === 'empty' && <p className="dx-sum dx-muted">{slot.type === 'SALARY_SLIP' ? 'Drop the salary slips here. One PDF can hold several months.' : slot.type === 'AADHAAR' ? 'Drop the masked Aadhaar here. Add the back side if it is a separate file.' : 'Drop a file here, or choose one.'}</p>}

      {view.coverage && (
        <div className="dx-months" aria-label="Months covered">
          {[...view.coverage.covered.map((m) => [m, 'ok'] as const), ...view.coverage.missing.map((m) => [m, 'miss'] as const), ...view.coverage.outOfRange.map((m) => [m, 'out'] as const)].map(([m, k]) => (
            <span key={m + k} className={`dx-mon dx-mon-${k}`}>{monthShort(m)}{k === 'miss' ? ' missing' : k === 'out' ? ' out of range' : ''}</span>
          ))}
        </div>
      )}

      {issues.map((i, n) => (
        <div key={n} className={`dx-issue dx-issue-${i.severity}`} role={i.severity === 'error' ? 'alert' : undefined}>
          <Icon name={i.severity === 'info' ? 'chev' : 'alert'} size={15} />
          <div className="dx-issue-b">
            <b>{i.message}</b>
            {i.detail && <small>{i.detail}</small>}
            {!readOnly && (
              <div className="dx-issue-a">
                {i.actions.map((a, k) => (
                  <button key={k} className={`dx-btn ${k === 0 ? 'dx-btn-p' : 'dx-btn-s'} dx-sm${a.kind === 'remove' ? ' dx-danger' : ''}`} onClick={() => run(a, i)}>{a.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {readable.length > 0 && (
        <div className="dx-files">
          {readable.map((f) => (
            <span className="dx-file" key={f.id}>
              <button className="dx-thumb" title="Preview" onClick={() => f.previewUrl && ui.openPreview({ url: f.previewUrl, mime: f.mime, name: f.name })} disabled={!f.previewUrl}>
                {f.thumbUrl ? <img src={f.thumbUrl} alt="" /> : <Icon name="file" size={16} />}
              </button>
              <span className="dx-fn" title={f.name}>{f.name}</span>
              {f.status === 'reading' && <Spinner />}
              {!readOnly && <button className="dx-x" aria-label={`Remove ${f.name}`} onClick={() => removeFile(caseId, f.id, slot.id)}><Icon name="x" size={13} /></button>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthShort = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MON[m - 1]} ${y}`; };
