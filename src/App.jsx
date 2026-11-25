import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { bindEvents, start } from './engine/engine.js';
import Nav from './components/Nav.jsx';
import CaseBar from './components/CaseBar.jsx';
import Workspace from './components/Workspace.jsx';
import Sheet from './components/Sheet.jsx';
import Toast from './components/Toast.jsx';
import Dialogs from './features/documentExtraction/ui/Dialogs';

// Optional backend-driven mismatch flow (VITE_MISMATCH_FLOW=true). Off by default.
const MismatchFlow = import.meta.env.VITE_MISMATCH_FLOW === 'true' ? lazy(() => import('./features/mismatchFlow/MismatchFlow')) : null;

const EMPTY = { cls: 'app', navCls: 'nav', nav: '', inCase: false, cb: '', main: '', sheet: '' };

export default function App() {
  const [view, setView] = useState(EMPTY);
  const booting = useRef(true);

  useEffect(() => {
    bindEvents();
    // The engine owns state and business logic; React owns the DOM.
    // flushSync commits each paint immediately so the engine can restore
    // scroll position and focus right after render().
    start(next => {
      if (booting.current) setView(next);
      else flushSync(() => setView(next));
    });
    booting.current = false;
  }, []);

  return (
    <>
      <div className={view.cls} id="app">
        <Nav html={view.nav} cls={view.navCls} />
        <CaseBar html={view.cb} visible={view.inCase} />
        <Workspace html={view.main} />
      </div>
      <Sheet html={view.sheet} />
      <Toast />
      <Dialogs />
      {MismatchFlow && <Suspense fallback={null}><MismatchFlow /></Suspense>}
    </>
  );
}
