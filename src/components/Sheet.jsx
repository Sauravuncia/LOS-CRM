import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import LeadDocs from '../features/documentExtraction/ui/LeadDocs';

/**
 * The sheet is an HTML string from the engine. The document pickers in the New lead form are a React component:
 * its host element is created once and moved into the #nl-docs placeholder after each render, so picked files survive re-renders.
 */
export default function Sheet({ html }) {
  const host = useRef(null);
  if (!host.current && typeof document !== 'undefined') host.current = document.createElement('div');
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    const ph = document.getElementById('nl-docs');
    if (ph) { ph.appendChild(host.current); setShow(true); }
    else { host.current.remove(); setShow(false); }
  }, [html]);

  return (
    <>
      <div id="sheet" dangerouslySetInnerHTML={{ __html: html }} />
      {show && createPortal(<LeadDocs />, host.current)}
    </>
  );
}
