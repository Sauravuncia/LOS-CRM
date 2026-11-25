import { useSyncExternalStore } from 'react';
import { FIGMA_ICONS } from '../../../engine/icons.js';
import { store, type State } from '../store';

export const useDocState = (): State => useSyncExternalStore(store.subscribe, store.getState);

const OWN: Record<string, string> = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  x: '<path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  alert: '<path d="M12 4 2.8 19.5h18.4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 10v4.2M12 17.3v.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="1.6"/>',
};

export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const inner = OWN[name] ?? (FIGMA_ICONS as Record<string, string>)[name] ?? '';
  return <svg className="dx-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: inner }} />;
}

export const Spinner = () => <span className="dx-spin" role="progressbar" aria-label="Reading" />;
