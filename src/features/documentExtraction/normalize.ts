import { NAME_TOKEN_SIMILARITY } from './constants';

/** Pure value comparison. No model calls: every decision here is repeatable and testable. */
export type Tier = 'match' | 'minor' | 'conflict';

const HONORIFICS = new Set(['MR', 'MRS', 'MS', 'MISS', 'SHRI', 'SHREE', 'SRI', 'SMT', 'SHRIMATI', 'KUMARI', 'KU', 'KM', 'DR', 'SHRIMAN']);

export function nameTokens(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !HONORIFICS.has(t));
}
export function normName(raw: string | null | undefined): string { return nameTokens(raw).join(' '); }

/** Rough sound-alike key so "Puja" and "Pooja", "Sameer" and "Samir" compare equal. */
export function phoneticKey(token: string): string {
  return token
    .replace(/PH/g, 'F').replace(/OO/g, 'U').replace(/EE/g, 'I').replace(/W/g, 'V').replace(/Z/g, 'J')
    .replace(/KH/g, 'K').replace(/([A-Z])\1+/g, '$1').replace(/(?<=[A-Z])H/g, '');
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
export function similarity(a: string, b: string): number {
  const L = Math.max(a.length, b.length);
  return L === 0 ? 1 : 1 - levenshtein(a, b) / L;
}

const compat = (x: string, y: string) => x === y || (x.length === 1 && y[0] === x) || (y.length === 1 && x[0] === y);

/** Every token of the shorter name has a distinct partner in the longer one (equal, or an initial). */
function subsetWithInitials(short: string[], long: string[]): boolean {
  const used = new Set<number>();
  let exact = 0;
  for (const s of short) {
    let hit = -1;
    for (let i = 0; i < long.length; i++) if (!used.has(i) && long[i] === s) { hit = i; break; }
    if (hit >= 0) { exact += s.length > 1 ? 1 : 0; used.add(hit); continue; }
    for (let i = 0; i < long.length; i++) if (!used.has(i) && compat(s, long[i])) { hit = i; break; }
    if (hit < 0) return false;
    used.add(hit);
  }
  return exact > 0;
}

function tokensSimilar(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const free = new Set(b.map((_, i) => i));
  for (const t of a) {
    let best = -1, bestSim = 0;
    for (const i of free) {
      const u = b[i];
      const keyA = phoneticKey(t), keyB = phoneticKey(u);
      const s = keyA === keyB ? 1 : Math.max(similarity(t, u), similarity(keyA, keyB));
      const needed = Math.min(t.length, u.length) < 3 ? 1 : NAME_TOKEN_SIMILARITY;
      if (s >= needed && s > bestSim) { best = i; bestSim = s; }
    }
    if (best < 0) return false;
    free.delete(best);
  }
  return true;
}

export function nameTier(a: string | null | undefined, b: string | null | undefined): Tier {
  const ta = nameTokens(a), tb = nameTokens(b);
  if (!ta.length || !tb.length) return 'conflict';
  if (ta.join(' ') === tb.join(' ')) return 'match';
  if ([...ta].sort().join(' ') === [...tb].sort().join(' ')) return 'match';
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  if (subsetWithInitials(short, long)) return 'minor';
  if (tokensSimilar(ta, tb)) return 'minor';
  return 'conflict';
}

/* ---------- date of birth ---------- */
export type Dob = { kind: 'full'; y: number; m: number; d: number } | { kind: 'year'; y: number };
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const monthIndex = (s: string) => MONTHS.indexOf(s.toUpperCase().slice(0, 3));

function validFull(y: number, m: number, d: number): Dob | null {
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const t = new Date(Date.UTC(y, m - 1, d));
  if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return null;
  return { kind: 'full', y, m, d };
}

export function parseDob(raw: string | null | undefined): Dob | null {
  if (!raw) return null;
  const s = raw.trim();
  let m = /^(?:YEAR OF BIRTH|YOB)?[:\s]*((?:19|20)\d{2})$/i.exec(s);
  if (m) return { kind: 'year', y: +m[1] };
  m = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/.exec(s);
  if (m) return validFull(+m[3], +m[2], +m[1]);
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return validFull(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/.exec(s);
  if (m) { const mi = monthIndex(m[2]); return mi < 0 ? null : validFull(+m[3], mi + 1, +m[1]); }
  return null;
}
export function formatDob(d: Dob | null): string {
  if (!d) return '';
  const cap = (s: string) => s[0] + s.slice(1).toLowerCase();
  return d.kind === 'year' ? String(d.y) : `${d.d} ${cap(MONTHS[d.m - 1])} ${d.y}`;
}
export function ageOn(d: Dob, today: Date): number {
  if (d.kind === 'year') return today.getFullYear() - d.y;
  let a = today.getFullYear() - d.y;
  if (today.getMonth() + 1 < d.m || (today.getMonth() + 1 === d.m && today.getDate() < d.d)) a--;
  return a;
}

/** Year-only against a full date with the same year is a match, and the full date wins. */
export function compareDob(a: string | null | undefined, b: string | null | undefined): { tier: Tier; preferred: Dob | null } {
  const pa = parseDob(a), pb = parseDob(b);
  if (!pa || !pb) return { tier: (a ?? '').trim().toUpperCase() === (b ?? '').trim().toUpperCase() && a ? 'match' : 'conflict', preferred: pa ?? pb };
  if (pa.kind === 'full' && pb.kind === 'full') return { tier: pa.y === pb.y && pa.m === pb.m && pa.d === pb.d ? 'match' : 'conflict', preferred: pa };
  if (pa.y !== pb.y) return { tier: 'conflict', preferred: pa.kind === 'full' ? pa : pb.kind === 'full' ? pb : pa };
  return { tier: 'match', preferred: pa.kind === 'full' ? pa : pb.kind === 'full' ? pb : pa };
}

/* ---------- PAN, money, months ---------- */
export const normPan = (s: string | null | undefined) => (s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
export const isValidPan = (s: string | null | undefined) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normPan(s));
export const panTier = (a: string | null | undefined, b: string | null | undefined): Tier => (normPan(a) && normPan(a) === normPan(b) ? 'match' : 'conflict');

export function parseMoney(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const n = parseFloat(raw.replace(/[₹,\s]|rs\.?|inr/gi, ''));
  return Number.isFinite(n) ? n : null;
}

/** Returns YYYY-MM, or null if the month cannot be read. */
export function parsePayMonth(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();
  const z = (n: number) => String(n).padStart(2, '0');
  let m = /^([A-Za-z]{3,9})[\s,.'\-/]*(\d{2}|\d{4})$/.exec(s);
  if (m) { const mi = monthIndex(m[1]); if (mi >= 0) { const y = m[2].length === 2 ? 2000 + +m[2] : +m[2]; return `${y}-${z(mi + 1)}`; } }
  m = /^(\d{1,2})[/\-.](\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[2]}-${z(+m[1])}`;
  m = /^(\d{4})-(\d{1,2})$/.exec(s);
  if (m && +m[2] >= 1 && +m[2] <= 12) return `${m[1]}-${z(+m[2])}`;
  return null;
}
export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  const n = MONTHS[m - 1];
  return `${n[0]}${n.slice(1).toLowerCase()} ${y}`;
}

/* ---------- Aadhaar safety ---------- */
const AADHAAR_RUN = /(?<!\d)\d{4}[\s-]?\d{4}[\s-]?\d{4}(?!\d)/g;
/** Removes anything that looks like a full 12-digit Aadhaar number from a string. */
export function scrubAadhaar(s: string): string { return s.replace(AADHAAR_RUN, '•••• •••• ••••'); }
/** Keeps only the last 4 digits, whatever the model returned. */
export function last4Of(raw: string | null | undefined): string | null {
  const d = (raw ?? '').replace(/\D/g, '');
  return d.length >= 4 ? d.slice(-4) : null;
}

/** Loose equality for free-text fields such as address or employer. */
export const normText = (s: string | null | undefined) => (s ?? '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
