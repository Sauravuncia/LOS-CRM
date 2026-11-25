import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DocumentSection from '../features/documentExtraction/ui/DocumentSection';

/**
 * The screens are HTML strings from the engine. The document upload section is a real React component:
 * its host element is created once and moved into the new #docx-root placeholder after every engine render,
 * so the component keeps its state instead of being rebuilt each time.
 */
export default function Workspace({ html }) {
  const host = useRef(null);
  if (!host.current && typeof document !== 'undefined') {
    host.current = document.createElement('div');
    host.current.className = 'docx-host';
  }
  const [slot, setSlot] = useState(null);

  useLayoutEffect(() => {
    const ph = document.getElementById('docx-root');
    if (ph) {
      ph.appendChild(host.current);
      setSlot((s) => (s && s.caseId === ph.dataset.case && s.readOnly === (ph.dataset.ro === '1') ? s : { caseId: ph.dataset.case, readOnly: ph.dataset.ro === '1' }));
    } else {
      host.current.remove();
      setSlot(null);
    }
  }, [html]);

  return (
    <>
      <main id="main" dangerouslySetInnerHTML={{ __html: html }} />
      {slot && createPortal(<DocumentSection caseId={slot.caseId} readOnly={slot.readOnly} />, host.current)}
    </>
  );
}
