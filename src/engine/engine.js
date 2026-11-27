import { FIGMA_ICONS } from './icons.js';
import { setBridge } from '../features/documentExtraction/bridge';
import { resetCase as docxResetCase, resetAllCases as docxResetAll, attachCase as docxAttach, addFiles as docxAddFiles, seedFromLead as docxSeed } from '../features/documentExtraction/store';
import { BLOCK_PRESCREEN_ON_PENDING_IDENTITY } from '../features/documentExtraction/constants';
import logoUrl from '../assets/uncia-logo.jpg';

const ICO = {
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5"/><circle cx="17" cy="9" r="2.8"/><path d="M16.6 14.3c2.3.3 3.9 1.7 4.9 4.2"/>',
  truck: '<path d="M3 6.5h11V16H3z"/><path d="M14 9.5h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/>',
  bank: '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
  book: '<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>',
  route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/>',
  memo: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  upload: '<path d="M12 16V5M12 5l-4 4M12 5l4 4"/><path d="M5 15v4h14v-4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
  send: '<path d="M12 19V5M12 5l-6 6M12 5l6 6"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/>',
  print: '<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
};

const LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4.4" r="2.1"/><circle cx="18.6" cy="8.2" r="2.1"/><circle cx="18.6" cy="15.8" r="2.1"/><circle cx="12" cy="19.6" r="2.1"/><circle cx="5.4" cy="15.8" r="2.1"/><circle cx="5.4" cy="8.2" r="2.1" opacity=".5"/></g></svg>';

'use strict';
/* =====================================================================
   Uncia home loan credit workbench: helpers
   ===================================================================== */
const $ = s => document.querySelector(s);
let paint = () => {};
const MINUS = '\u2212', DASH = '\u2014', RS = '\u20B9';
Object.assign(ICO, {
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  fwd: '<path d="M9 5l7 7-7 7"/>',
  building: '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10.5 20.5v-3h3v3"/>',
  scale: '<path d="M12 4v16M7.5 20h9"/><path d="M5 8h14"/><path d="M5 8l-2.5 6a2.5 2.5 0 0 0 5 0L5 8zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0L19 8z"/>',
  pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4h4"/><path d="M12 8v4.5l3 2"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.2M12 17.3v.2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2M12 7.8v.2"/>',
  inbox: '<path d="M3.5 13.5 6 5.5h12l2.5 8V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19z"/><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21"/>',
  user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c1.3-3.9 4.1-5.8 7.5-5.8s6.2 1.9 7.5 5.8"/>',
  flag: '<path d="M5.5 21V4"/><path d="M5.5 4.5h11l-2 4 2 4h-11"/>',
  camera: '<path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  handoff: '<path d="M4 12h12"/><path d="M12 7l5 5-5 5"/><path d="M20 4.5v15"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
  power: '<path d="M12 3.5v8"/><path d="M7.2 6.5a7 7 0 1 0 9.6 0"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5z"/>'
});
Object.assign(ICO, FIGMA_ICONS); // Figma Linear icon set

/* ---------- demo clock: fixed, so the demo plays the same every time ---------- */
const NOW = new Date(2026, 10, 16, 11, 0);
let CLK = new Date(NOW);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function P(s) { if (s instanceof Date) return s; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-').map(Number); const [h, mi] = (t || '10:00').split(':').map(Number); return new Date(y, m - 1, dd, h, mi); }
function S8(t) { const z = n => String(n).padStart(2, '0'); return t.getFullYear() + '-' + z(t.getMonth() + 1) + '-' + z(t.getDate()) + ' ' + z(t.getHours()) + ':' + z(t.getMinutes()); }
function tick(min) { CLK = new Date(CLK.getTime() + (min || 3) * 60000); return S8(CLK); }
function fdate(s) { const t = P(s); return t.getDate() + ' ' + MON[t.getMonth()] + ' ' + t.getFullYear(); }
function fds(s) { const t = P(s); return t.getDate() + ' ' + MON[t.getMonth()]; }
function ftime(s) { const t = P(s); return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'); }
function fdt(s) { return fdate(s) + ', ' + ftime(s); }
function addWD(s, n) { const x = P(s); let k = 0; while (k < n) { x.setDate(x.getDate() + 1); const w = x.getDay(); if (w !== 0 && w !== 6) k++; } return S8(x); }
function addDays(s, n) { const x = P(s); x.setDate(x.getDate() + n); return S8(x); }
function wdLate(due, now) { const a = P(due), b = P(now || S8(CLK)); a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0); if (b <= a) return 0; let n = 0; const x = new Date(a); while (x < b) { x.setDate(x.getDate() + 1); const w = x.getDay(); if (w !== 0 && w !== 6) n++; } return n; }
function daysBetween(a, b) { return Math.round((P(b) - P(a)) / 86400000); }

/* ---------- text and numbers ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function trimz(s) { return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); }
function inr(n, d) { if (n == null || isNaN(n)) return DASH; d = d || 0; const neg = n < 0; n = Math.abs(n); let s = n.toFixed(d), fr = ''; if (d) { const p = s.split('.'); s = p[0]; fr = '.' + p[1]; } if (s.length > 3) { const h = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ','); s = h + ',' + s.slice(-3); } return (neg ? MINUS : '') + RS + s + fr; }
function lakh(n) { if (n == null || isNaN(n)) return DASH; if (Math.abs(n) >= 1e7) return RS + trimz((n / 1e7).toFixed(2)) + ' crore'; return RS + trimz((n / 1e5).toFixed(2)) + ' lakh'; }
function lakhS(n) { if (Math.abs(n) >= 1e7) return RS + trimz((n / 1e7).toFixed(2)) + ' Cr'; return RS + trimz((n / 1e5).toFixed(2)) + ' L'; }
function pct(x, d) { return x == null || isNaN(x) ? DASH : trimz(x.toFixed(d == null ? 1 : d)) + '%'; }
function pctf(x) { return x == null || isNaN(x) ? DASH : x.toFixed(1) + '%'; }
function pts(x) { return trimz(Math.abs(x).toFixed(1)) + (Math.abs(x) === 1 ? ' point' : ' points'); }
function emiCalc(P0, rate, n) { const r = rate / 1200; if (!P0 || !n) return 0; if (!r) return P0 / n; const f = Math.pow(1 + r, n); return P0 * r * f / (f - 1); }
function loanFor(emi, rate, n) { const r = rate / 1200; if (emi <= 0) return 0; const f = Math.pow(1 + r, n); return emi * (f - 1) / (r * f); }
function irrMonthly(net, emi, n) { let lo = 1e-6, hi = 0.1; for (let k = 0; k < 120; k++) { const m = (lo + hi) / 2; const pv = emi * (1 - Math.pow(1 + m, -n)) / m; if (pv > net) lo = m; else hi = m; } return (lo + hi) / 2; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function deep(o) { return JSON.parse(JSON.stringify(o)); }
function plural(n, w, p) { return n + ' ' + (n === 1 ? w : (p || w + 's')); }
function listAnd(a) { a = a.filter(Boolean); if (a.length < 2) return a.join(''); return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
function cap1(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function lc1(s) { return s && !(s.length > 1 && /[A-Z]/.test(s[1])) ? s[0].toLowerCase() + s.slice(1) : s; }
function yrsTxt(m) { return trimz((m / 12).toFixed(1)) + ' years'; }
function floor10k(x) { return Math.floor(x / 10000) * 10000; }
function sum(a, f) { return a.reduce((s, x) => s + (f ? f(x) : x), 0); }
const ic = (n, c) => `<svg class="ico${c ? ' ' + c : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n] || ''}</svg>`;
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* =====================================================================
   Policy, authority and model (illustrative: typical market values)
   ===================================================================== */
const LEVELS = ['L1', 'L2', 'L3', 'L4'];
const RANK = { SYS: 0, L1: 1, L2: 2, L3: 3, L4: 4, NX: 99 };
const AUTH = {
  L1: { title: 'Credit Manager', name: 'Rohit Kulkarni', ini: 'RK', sla: 'Same day' },
  L2: { title: 'Regional Credit Manager', name: 'Sneha Iyer', ini: 'SI', sla: 'Within 4 working hours' },
  L3: { title: 'Zonal Credit Manager', name: 'Vikram Rao', ini: 'VR', sla: 'Within 1 working day' },
  L4: { title: 'National Credit Head', name: 'Meera Nair', ini: 'MN', sla: 'Within 1 working day' }
};
const PEOPLE = {
  maker: { name: 'Ananya Rao', ini: 'AR', title: 'Credit Policy Manager' },
  checker: { name: 'Arjun Menon', ini: 'AM', title: 'Head of Credit Policy' }
};
const LENDER0 = {
  name: 'Sthira Home Finance Ltd', short: 'Sthira Home Finance', mark: 'SH',
  reg: 'A housing finance company registered with the Reserve Bank of India',
  addr: '4th Floor, Sthira House, Andheri-Kurla Road, Andheri East, Mumbai 400059',
  web: 'www.sthirahome.in', mail: 'care@sthirahome.in', phone: '1800 000 0000',
  nodal: 'Priya Desai, Nodal Grievance Officer, grievance@sthirahome.in',
  hrr: 15.20, pfPrime: 0.50, pfAff: 1.00, ltPrime: 5900, ltAff: 3540, val2: 2360,
  penal: 750, bounce: 590, switchFee: 0.50, validity: 90
};
let LENDER = deep(LENDER0);

const CATS = {
  apf: 'Builder flat, approved project', builder: 'Builder flat, project not approved', resale: 'Resale property',
  bt: 'Balance transfer', selfcon: 'Self-construction', plotcon: 'Plot and construction', nonstd: 'Non-standard title (gram panchayat patta)'
};
const PROG = { salaried: 'Salaried', selfdoc: 'Self-employed with ITR', aip: 'Assessed income programme' };
const SLABS = ['Up to \u20B930 lakh', '\u20B930 lakh to \u20B975 lakh', 'Above \u20B975 lakh'];
const BANDS = ['Up to \u20B925,000', '\u20B925,001 to \u20B950,000', '\u20B950,001 to \u20B91,00,000', 'Above \u20B91,00,000'];

const POL12 = {
  ver: 12, at: '2026-11-03 18:00', maker: 'Ananya Rao', checker: 'Arjun Menon',
  note: 'FOIR cap for salaried incomes above \u20B91 lakh a month raised from 55% to 60%.',
  foir: { bands: [25000, 50000, 100000], salaried: [45, 50, 55, 60], selfdoc: [45, 50, 55, 55], aip: [50, 50, 50, 50] },
  ltv: { reg: [90, 80, 75], apf: [90, 80, 75], builder: [85, 80, 75], resale: [90, 80, 75], bt: [85, 80, 75], selfcon: [80, 75, 70], plotcon: [75, 70, 65], nonstd: [70, 65, 60] },
  dev: { foirL1: 3, foirL2: 5, foirL3: 10, ltvL2: 5, scoreMin: 700, scoreL2: 650, scoreL3: 600, ageL2: 5, planTol: 10, planMax: 20 },
  age: { salaried: 60, selfemp: 65 },
  tenure: { prime: 360, affordable: 240 },
  minInc: { prime: 25000, affordable: 12000 },
  dualAbove: 5000000, valVar: 10,
  auth: { L1: 5000000, L2: 7500000, L3: 15000000 },
  sysAuth: 7500000, bump: 3,
  model: { on: true, approve: 3.0, reject: 8.0, ver: 'v2.3' }
};
function polVariant(base, ver, at, note, f) { const p = deep(base); p.ver = ver; p.at = at; p.note = note; f(p); return p; }
const POL11 = polVariant(POL12, 11, '2026-09-22 17:30', 'Self-construction LTV caps lowered by 5 points. Deviation model v2.3 switched on for FOIR, LTV, score and age deviations.', p => { p.foir.salaried = [45, 50, 55, 55]; });
const POL10 = polVariant(POL11, 10, '2026-07-14 16:10', 'Non-standard title category (gram panchayat patta) added with LTV caps of 65, 60 and 55%.', p => { p.ltv.selfcon = [85, 80, 75]; p.ltv.nonstd = [65, 60, 55]; p.model.ver = 'v2.1'; p.model.approve = 2.5; });
const VERS0 = [POL12, POL11, POL10];
let POL = deep(POL12);
let VERS = deep(VERS0);

const MODEL = {
  name: 'Home loan deviation model', id: 'HL-DEV',
  target: 'A payment 30 days or more late within 12 months of the first disbursement',
  data: '18,400 home-loan deviation cases sanctioned April 2021 to March 2025',
  validated: '14 Aug 2026, by the independent model risk team',
  approved: 'Risk Management Committee of the Board, 29 Aug 2026',
  gini: 0.41, psi: 0.06, review: 'February 2027',
  inScope: ['FOIR up to 5 points over the cap', 'LTV up to 5 points over the policy cap, never over the RBI cap', 'Bureau score between 650 and 699', 'Age at maturity up to 5 years over the limit'],
  outScope: ['Legal and technical findings', 'Negative areas, plan deviations and missing occupancy certificates', 'Fraud control findings', 'Hard stops of any kind']
};
const MONITOR = { decided: 412, approved: 318, rejected: 21, referred: 73, overrides: 9, obs: 1.9, pred: 2.1 };

const OVR_REASONS = ['Information the system did not have', 'Doubt about the income evidence', 'Concern about the property', 'Concern about conduct or identity', 'Other'];
const REJ = {
  r_legal: { t: 'Legal opinion: title not clear', en: 'The legal check found that the property\u2019s title is not clear: a civil suit about the plot is pending in court.', hi: '\u0915\u093e\u0928\u0942\u0928\u0940 \u091c\u093e\u0901\u091a \u092e\u0947\u0902 \u092a\u093e\u092f\u093e \u0917\u092f\u093e \u0915\u093f \u0938\u0902\u092a\u0924\u094d\u0924\u093f \u0915\u093e \u0938\u094d\u0935\u093e\u092e\u093f\u0924\u094d\u0935 (\u091f\u093e\u0907\u091f\u0932) \u0938\u094d\u092a\u0937\u094d\u091f \u0928\u0939\u0940\u0902 \u0939\u0948: \u092a\u094d\u0932\u0949\u091f \u0915\u094b \u0932\u0947\u0915\u0930 \u0905\u0926\u093e\u0932\u0924 \u092e\u0947\u0902 \u090f\u0915 \u0926\u0940\u0935\u093e\u0928\u0940 \u092e\u0941\u0915\u0926\u092e\u093e \u0932\u0902\u092c\u093f\u0924 \u0939\u0948\u0964' },
  r_neg: { t: 'Property in a barred area', en: 'The property is in an area where our policy does not allow lending: it is inside the river\u2019s flood line on the town plan.', hi: '\u0938\u0902\u092a\u0924\u094d\u0924\u093f \u0910\u0938\u0947 \u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u092e\u0947\u0902 \u0939\u0948 \u091c\u0939\u093e\u0901 \u0939\u092e\u093e\u0930\u0940 \u0928\u0940\u0924\u093f \u090b\u0923 \u0926\u0947\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092e\u0924\u093f \u0928\u0939\u0940\u0902 \u0926\u0947\u0924\u0940: \u092f\u0939 \u091f\u093e\u0909\u0928 \u092a\u094d\u0932\u093e\u0928 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u0928\u0926\u0940 \u0915\u0940 \u092c\u093e\u0922\u093c \u0930\u0947\u0916\u093e \u0915\u0947 \u092d\u0940\u0924\u0930 \u0939\u0948\u0964' },
  r_ltv_reg: { t: 'LTV above the RBI limit', en: 'The loan asked for is more than the share of the property\u2019s value that RBI rules allow.', hi: '\u092e\u093e\u0901\u0917\u093e \u0917\u092f\u093e \u090b\u0923, \u0938\u0902\u092a\u0924\u094d\u0924\u093f \u0915\u0947 \u092e\u0942\u0932\u094d\u092f \u0915\u0947 \u0909\u0938 \u0939\u093f\u0938\u094d\u0938\u0947 \u0938\u0947 \u0905\u0927\u093f\u0915 \u0939\u0948 \u091c\u093f\u0938\u0915\u0940 RBI \u0915\u0947 \u0928\u093f\u092f\u092e \u0905\u0928\u0941\u092e\u0924\u093f \u0926\u0947\u0924\u0947 \u0939\u0948\u0902\u0964' },
  r_foir: { t: 'Repayments too high for the income', en: 'Your repayments, including this loan, would be more than the share of income our policy allows.', hi: '\u0907\u0938 \u090b\u0923 \u0938\u0939\u093f\u0924 \u0906\u092a\u0915\u0940 \u0915\u093f\u0938\u094d\u0924\u0947\u0902 \u0906\u092a\u0915\u0940 \u0906\u092f \u0915\u0947 \u0909\u0938 \u0939\u093f\u0938\u094d\u0938\u0947 \u0938\u0947 \u0905\u0927\u093f\u0915 \u0939\u094b\u0902\u0917\u0940 \u091c\u093f\u0924\u0928\u093e \u0939\u092e\u093e\u0930\u0940 \u0928\u0940\u0924\u093f \u0905\u0928\u0941\u092e\u0924\u093f \u0926\u0947\u0924\u0940 \u0939\u0948\u0964' },
  r_score: { t: 'Credit history', en: 'Your credit history does not meet our policy.', hi: '\u0906\u092a\u0915\u093e \u0915\u094d\u0930\u0947\u0921\u093f\u091f \u0907\u0924\u093f\u0939\u093e\u0938 \u0939\u092e\u093e\u0930\u0940 \u0928\u0940\u0924\u093f \u0915\u0947 \u0905\u0928\u0941\u0930\u0942\u092a \u0928\u0939\u0940\u0902 \u0939\u0948\u0964' },
  other: { t: 'Other reason', en: 'The application does not meet our credit policy.', hi: '\u0906\u0935\u0947\u0926\u0928 \u0939\u092e\u093e\u0930\u0940 \u090b\u0923 \u0928\u0940\u0924\u093f \u0915\u0947 \u0905\u0928\u0941\u0930\u0942\u092a \u0928\u0939\u0940\u0902 \u0939\u0948\u0964' }
};
const MITS = {
  coinc: { t: 'Earning co-applicant', d: 'A second income supports the repayments' },
  bureau: { t: 'Clean repayment history', d: 'No late payments in the last 24 months' },
  apf: { t: 'Approved project', d: 'Project title and plans checked once for every unit' },
  ltvlow: { t: 'Low LTV', d: 'Well under the cap, so the property covers the loan' },
  tenure: { t: 'Long stay in job or business', d: 'Stable income over many years' },
  oblend: { t: 'An existing loan ends soon', d: 'FOIR falls when it closes' },
  pd: { t: 'Personal discussion supports the income', d: 'Field visit and records back the assessed figure' },
  family: { t: 'Family support', d: 'Other family members contribute to the household' }
};

/* =====================================================================
   Sample cases (people, places and lenders are fictional)
   ===================================================================== */
const DCAT = ['Application and consents', 'Identity and KYC', 'Income', 'Banking', 'Property'];
function dk(id, t, cat, need, f, at, by) { return { id, t, cat, need, up: at ? { f, at, by } : null, sample: f }; }
function tk(id, t, track, kind, vendor, slaD, st, assigned, recv, acc, extra) { return Object.assign({ id, t, track, kind, vendor, slaD, st, assigned, due: assigned && slaD ? addWD(assigned, slaD) : null, recv, acc }, extra || {}); }
const M6 = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const SEED = [
/* ---------------- A: prime, approved project, co-lent ---------------- */
{
  id: 'A', hint: 'Prime salaried, under-construction flat in an approved project, co-lent with a bank',
  seg: 'prime', prog: 'salaried', cat: 'apf', variant: 'uc', lang: 'en',
  v: { appNo: 'HL-2611-04817', branch: 'Pune Baner', src: 'Builder tie-up, Sankalp Developers', srcBy: 'Amit Joshi, sales', login: '2026-11-09 10:20', loan: 7500000, tenure: 300, roi: 9.5, purpose: 'Purchase of an under-construction flat', applied: { loan: 7500000, tenure: 300 } },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Aditya Deshpande', ini: 'AD', age: 34, sex: 'M', emp: 'Salaried', occ: 'Senior software engineer', org: 'Kestrel Software Pvt Ltd', orgCat: 'A', yrs: 9, inc: 118000, incDecl: 120000, incSrc: 'Salary slips, Form 16 and salary credits through the Account Aggregator', earning: true, cibil: 781, dpd: '000000000000000000000000', enq6: 2, accts: 4, pan: 'AKXPD4417K', aadhaar: 'XXXX XXXX 4417', ckyc: 'Found and downloaded', addr: 'Flat 4, Shree Apartments, Aundh, Pune 411007', mobile: '98XXXXX417', email: 'aditya.d@example.com' },
    { id: 'a2', role: 'Co-applicant', rel: 'Spouse', name: 'Neha Deshpande', ini: 'ND', age: 32, sex: 'F', emp: 'Salaried', occ: 'Teacher', org: 'Sharada Public School', orgCat: 'C', yrs: 6, inc: 34000, incDecl: 35000, incSrc: 'Salary slips and Form 16', earning: true, cibil: 752, dpd: '000000000000000000000000', enq6: 1, accts: 2, pan: 'BNRPD2208M', aadhaar: 'XXXX XXXX 2208', ckyc: 'Found and downloaded', addr: 'Flat 4, Shree Apartments, Aundh, Pune 411007', mobile: '97XXXXX208', email: 'neha.d@example.com' }
  ],
  oblig: [
    { id: 'o1', who: 'a1', t: 'Car loan', lender: 'A private bank', emi: 24600, out: 612000, left: 31, count: true, why: '' },
    { id: 'o2', who: 'a1', t: 'Credit card', lender: 'A private bank', emi: 3100, out: 62000, left: null, count: true, why: '5% of the \u20B962,000 balance' }
  ],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 4417', consent: 'Consent given 9 Nov 2026 for 12 months of data', months: M6, credits: [131000, 128500, 134000, 129800, 141200, 133600], debits: [118400, 124900, 121700, 119600, 136800, 127300], bal: [139000, 142500, 151800, 148900, 146200, 147600], salary: 'Kestrel Software credits \u20B91,18,000 on the 1st, every month for 12 months', bounces: 0 },
  pd: null,
  prop: {
    kind: 'Flat', addr: 'Flat B-1204, Godavari Heights Phase 2, Survey No. 112/3, Baner-Mahalunge Road, Pune 411045', carpet: 68.4, area: '68.4 m\u00B2 (736 sq ft) carpet, 2 bedrooms', owners: ['a1', 'a2'],
    agreement: 10200000, guideline: 8840000, builder: 'Sankalp Developers', project: 'Godavari Heights Phase 2',
    rera: { no: 'P52100049871', valid: '31 Dec 2027', ok: true },
    apf: { id: 'APF-PUN-0187', st: 'Approved', valid: '31 Mar 2027', limit: 400000000, used: 264000000, units: 120, financed: 31, legal: 'Kale & Associates, 12 Feb 2026', tech: 'Apex Valuers, 14 Feb 2026', unitFree: true },
    stage: 55, stageText: 'Slab 9 of 14 cast', built: null, resid: 60, oc: null, planDev: 2, neg: 'none',
    cersai: { st: 'clear', t: 'No charge registered on this unit' }, fcu: { st: 'pos', t: 'Salary slips and Form 16 sampled: positive' },
    legal: { by: 'Kale & Associates', op: 'clear', note: 'Project title was cleared when the project was approved. This opinion covers the unit.',
      chain: [{ y: '2019', t: 'Conveyance deed', p: 'Land owners to Sankalp Developers', n: 'Checked at project approval' }, { y: '2023', t: 'RERA registration', p: 'Godavari Heights Phase 2', n: 'P52100049871, valid to Dec 2027' }, { y: '2026', t: 'Agreement for sale', p: 'Sankalp Developers to Aditya and Neha Deshpande', n: 'Registered, doc. 8841/2026, Sub-Registrar Haveli 14', cls: 'now' }],
      conds: [], lod: ['Registered agreement for sale (8841/2026)', 'Allotment letter', 'Builder NOC and tripartite agreement', 'Stamp duty and registration receipts', 'Index II extract'], queries: [] },
    vals: [{ id: 'tech', by: 'Deshmukh & Associates', v: 10450000, note: 'Market value on completion' }, { id: 'tech2', by: 'Apex Valuers', v: 10100000, note: 'Market value on completion' }]
  },
  colend: { partner: 'Bharat Union Bank', share: 80, prate: 8.75, orate: 12.5, ref: 'BUB-CL-55021' },
  clp: { stages: [{ t: 'On booking', p: 10, done: true }, { t: 'On agreement', p: 20, done: true }, { t: 'Plinth', p: 10, done: true }, { t: 'Slabs 1 to 7', p: 15, done: true }, { t: 'Slabs 8 to 14', p: 15 }, { t: 'Walls and plaster', p: 15 }, { t: 'Possession', p: 15 }] },
  docs: [
    dk('app', 'Application form, signed', DCAT[0], 'login', 'Application_HL-2611-04817.pdf', '2026-11-09 10:20', 'Amit Joshi'),
    dk('cons', 'Consents: credit bureau, Account Aggregator and privacy notice', DCAT[0], 'login', 'Consent_record_e-signed.pdf', '2026-11-09 10:21', 'Customer, e-sign'),
    dk('pan_a1', 'PAN, Aditya', DCAT[1], 'login', 'PAN_Aditya.jpg', '2026-11-09 10:22', 'Amit Joshi'),
    dk('adh_a1', 'Aadhaar (masked), Aditya', DCAT[1], 'login', 'Aadhaar_masked_Aditya.pdf', '2026-11-09 10:22', 'Amit Joshi'),
    dk('pan_a2', 'PAN, Neha', DCAT[1], 'login', 'PAN_Neha.jpg', '2026-11-09 10:23', 'Amit Joshi'),
    dk('adh_a2', 'Aadhaar (masked), Neha', DCAT[1], 'login', 'Aadhaar_masked_Neha.pdf', '2026-11-09 10:23', 'Amit Joshi'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026, Aditya', DCAT[2], 'login', 'Payslips_Aditya_Q3.pdf', '2026-11-09 10:25', 'Amit Joshi'),
    dk('f16_a1', 'Form 16, two years, Aditya', DCAT[2], 'login', 'Form16_Aditya.pdf', '2026-11-09 10:25', 'Amit Joshi'),
    dk('sal_a2', 'Salary slips, Aug to Oct 2026, Neha', DCAT[2], 'login', 'Payslips_Neha_Q3.pdf', '2026-11-09 10:26', 'Amit Joshi'),
    dk('f16_a2', 'Form 16, two years, Neha', DCAT[2], 'login', 'Form16_Neha.pdf', '2026-11-09 10:26', 'Amit Joshi'),
    dk('bank_a1', 'Bank statement, 12 months, through the Account Aggregator', DCAT[3], 'login', 'Account Aggregator data', '2026-11-09 10:31', 'System'),
    dk('allot', 'Allotment letter', DCAT[4], 'login', 'Allotment_B1204.pdf', '2026-11-09 10:28', 'Amit Joshi'),
    dk('afs', 'Agreement for sale, registered', DCAT[4], 'login', 'AFS_8841_2026.pdf', '2026-11-09 10:28', 'Amit Joshi'),
    dk('bnoc', 'Builder NOC and demand letter', DCAT[4], 'login', 'Sankalp_NOC_demand.pdf', '2026-11-09 10:29', 'Amit Joshi'),
    dk('own', 'Own contribution receipts, \u20B927 lakh', DCAT[4], 'login', 'Receipts_own_contribution.pdf', '2026-11-09 10:29', 'Amit Joshi'),
    dk('tpa', 'Tripartite agreement, signed', DCAT[4], 'cp', 'Tripartite_agreement.pdf'),
    dk('ins', 'Property insurance with our interest noted', DCAT[4], 'cp', 'Insurance_policy.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-09 10:24', '2026-11-09 10:24'),
    tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-09 10:25', '2026-11-09 10:25'),
    tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-11-09 10:31', '2026-11-09 10:31'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Trust Field Services', 3, 'accepted', '2026-11-09 12:00', '2026-11-11 17:10', '2026-11-12 09:40'),
    tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Pune', 2, 'accepted', '2026-11-09 12:05', '2026-11-11 11:00', '2026-11-11 11:30'),
    tk('apf', 'Approved project check', 'prop', 'sys', 'Project register', 0, 'accepted', null, '2026-11-09 10:40', '2026-11-09 10:40'),
    tk('rera', 'RERA registration', 'prop', 'sys', 'MahaRERA register', 0, 'accepted', null, '2026-11-09 10:41', '2026-11-09 10:41'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Kale & Associates', 5, 'accepted', '2026-11-10 10:00', '2026-11-12 16:40', '2026-11-13 10:15'),
    tk('tech', 'Valuation 1', 'prop', 'ven', 'Deshmukh & Associates', 3, 'accepted', '2026-11-10 10:05', '2026-11-11 13:10', '2026-11-12 09:50'),
    tk('tech2', 'Valuation 2', 'prop', 'ven', 'Apex Valuers', 3, 'accepted', '2026-11-10 10:06', '2026-11-12 11:30', '2026-11-12 14:20'),
    tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'accepted', null, '2026-11-11 15:00', '2026-11-11 15:00'),
    tk('colend', 'Partner bank check', 'prop', 'sys', 'Bharat Union Bank', 1, 'accepted', '2026-11-13 11:00', '2026-11-13 14:05', '2026-11-13 14:05')
  ],
  w: { step: 'decide', sysAt: '2026-11-13 15:20' }
},
/* ---------------- B: affordable, self-construction, PMAY ---------------- */
{
  id: 'B', hint: 'Affordable self-employed, self-construction on a gram panchayat plot, eligible for PMAY',
  seg: 'affordable', prog: 'aip', cat: 'nonstd', variant: 'selfcon', lang: 'hi',
  v: { appNo: 'HL-2611-04902', branch: 'Chomu', src: 'Branch sales officer', srcBy: 'Ganesh Saini, sales', login: '2026-11-12 11:40', loan: 1200000, tenure: 240, roi: 11.75, purpose: 'Construction of a house on own plot', applied: { loan: 1200000, tenure: 240 } },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Ramesh Kumawat', ini: 'RK', age: 41, sex: 'M', emp: 'Self-employed', occ: 'Grocery shop owner', org: 'Kumawat Kirana Store', orgCat: null, yrs: 11, inc: 24100, incDecl: 38000, incSrc: 'Personal discussion: shop income and room rent', earning: true, cibil: 712, dpd: '000000000100000000000000', enq6: 1, accts: 3, pan: 'CKMPK7731R', aadhaar: 'XXXX XXXX 7731', ckyc: 'Not found: new record to be uploaded', addr: 'Ward 6, Gram Panchayat Sanwariya, Tehsil Chomu, Jaipur 303702', mobile: '94XXXXX731', email: '' },
    { id: 'a2', role: 'Co-applicant', rel: 'Spouse', name: 'Kamla Kumawat', ini: 'KK', age: 37, sex: 'F', emp: 'Self-employed', occ: 'Tailoring from home', org: 'Own work', orgCat: null, yrs: 6, inc: 5000, incDecl: 6000, incSrc: 'Personal discussion: tailoring orders', earning: true, cibil: null, dpd: null, enq6: 0, accts: 0, pan: 'No PAN: Form 60', aadhaar: 'XXXX XXXX 0952', ckyc: 'Not found: new record to be uploaded', addr: 'Ward 6, Gram Panchayat Sanwariya, Tehsil Chomu, Jaipur 303702', mobile: '94XXXXX952', email: '' }
  ],
  oblig: [
    { id: 'o1', who: 'a1', t: 'Two-wheeler loan', lender: 'An NBFC', emi: 2400, out: 18600, left: 8, count: true, why: '' },
    { id: 'o2', who: 'a1', t: 'Gold loan, bullet repayment', lender: 'A small finance bank', emi: 0, out: 60000, left: 2, count: false, why: 'Bullet loan due January 2027: no monthly EMI, closes within 3 months' }
  ],
  bank: { via: 'PDF read by the system (this bank is not on the Account Aggregator network yet)', acct: 'Current account ending 0418, Amber Sahakari Bank', consent: '12 months, uploaded by the branch', months: M6, credits: [102400, 118900, 96300, 121700, 131800, 119200], debits: [99800, 116200, 98900, 117300, 127600, 121400], bal: [21800, 24300, 18900, 22600, 26100, 20700], salary: 'Business account: about half of the shop\u2019s sales are banked; the rest is cash', bounces: 1, bounceNote: 'One inward cheque bounce in August 2026 (\u20B918,000 to a supplier), paid again in 2 days' },
  pd: {
    by: 'Pooja Sharma, credit officer', where: 'Shop at Sanwariya bus stand, and the residence 2 km away',
    sales: { daily: 8000, monthly: 240000, margin: 12, gross: 28800, ev: 'Sales register for 3 days, and UPI settlements averaging \u20B94,100 a day' },
    rows: [
      { t: 'Gross profit from the shop', s: '12% margin on \u20B92,40,000 monthly sales', asd: 28800 },
      { t: 'Helper wages', asd: -6000 }, { t: 'Electricity', asd: -1200 },
      { t: 'Net income from the shop', asd: 21600, sub: true },
      { t: 'Room rent', s: 'Tenant agreement seen', decl: 2500, asd: 2500 },
      { t: 'Kamla Kumawat, tailoring', s: 'Order book for 3 months', decl: 6000, asd: 5000 }
    ],
    decl: 44000, assessed: 29100, declShop: 35500,
    hh: { members: 5, exp: 14500, note: '2 adults, 2 school-going children and Ramesh\u2019s mother' },
    notes: ['The shop has run at the same spot for 11 years; neighbours confirm.', 'Stock seen: about \u20B93.5 lakh. Two suppliers extend 15 days\u2019 credit.', 'The plot is 2 km from the shop, with the plinth marked out. Water and power connections are on the road.', 'Declared income looks high against what was seen. The assessed figure is used.'],
    photos: [{ k: 'shop', t: 'Shop front', at: '11:20' }, { k: 'stock', t: 'Stock on the shelves', at: '11:26' }, { k: 'home', t: 'Current residence', at: '12:05' }, { k: 'plot', t: 'Plot with plinth marking', at: '12:30' }], geo: '27.14\u00B0 N, 75.74\u00B0 E'
  },
  prop: {
    kind: 'Plot with a house to be built', addr: 'Patta No. 214, Ward 6, Gram Panchayat Sanwariya, Tehsil Chomu, Jaipur 303702', carpet: 50.2, area: 'Plot 1,200 sq ft (111.5 m\u00B2). House: 650 sq ft built-up, 50.2 m\u00B2 carpet', owners: ['a1', 'a2'],
    agreement: null, est: 1420000, guideline: 360000, builder: null, project: null, rera: null, apf: null,
    stage: 0, stageText: 'Not started; plinth marked out', built: null, resid: 60, oc: null, planDev: null, neg: 'none', pmayArea: true,
    cersai: { st: 'clear', t: 'No charge registered on this plot' }, fcu: { st: 'pos', t: 'Gift deed and bank statement sampled: positive' },
    legal: { by: 'Adv. Rakesh Saini', op: 'cond', note: 'Title is good, subject to two conditions before the first disbursement.',
      chain: [{ y: '2009', t: 'Gram panchayat patta', p: 'Issued to Bhanwar Lal Kumawat', n: 'Village settlement (abadi) land' }, { y: '2014', t: 'Gift deed, registered', p: 'Bhanwar Lal to Ramesh and Kamla Kumawat', n: 'Sub-Registrar Chomu', cls: 'flag' }, { y: '2015', t: 'Panchayat record updated', p: 'In the names of Ramesh and Kamla', n: 'Name transfer entry' }, { y: '2026', t: 'No-dues certificate', p: 'Gram Panchayat Sanwariya', n: 'Issued 3 Nov 2026', cls: 'now' }],
      conds: ['Building permission from Gram Panchayat Sanwariya for the planned house', 'No-objection affidavits from Ramesh\u2019s two brothers, the other heirs of Bhanwar Lal Kumawat'],
      lod: ['Gram panchayat patta (2009)', 'Registered gift deed (2014)', 'Panchayat name-transfer record', 'No-dues certificate', 'Building permission', 'Brothers\u2019 no-objection affidavits'], queries: [] },
    vals: [{ id: 'tech', by: 'Rathore Valuation Services', v: 1780000, land: 420000, constr: 1360000, note: 'Land at \u20B9350 a sq ft. Construction estimated at \u20B92,092 a sq ft' }]
  },
  colend: null,
  pmay: { firstHome: true, noScheme: true, family: 5 },
  clp: { selfcon: true, stages: [{ t: 'Plinth', p: 20 }, { t: 'Lintel', p: 25 }, { t: 'Roof slab', p: 30 }, { t: 'Finishing', p: 25 }] },
  docs: [
    dk('app', 'Application form, signed', DCAT[0], 'login', 'Application_HL-2611-04902.pdf', '2026-11-12 11:40', 'Ganesh Saini'),
    dk('cons', 'Consents: credit bureau, bank data and privacy notice (Hindi)', DCAT[0], 'login', 'Consent_record_Hindi.pdf', '2026-11-12 11:42', 'Customer, OTP'),
    dk('pan_a1', 'PAN, Ramesh', DCAT[1], 'login', 'PAN_Ramesh.jpg', '2026-11-12 11:44', 'Ganesh Saini'),
    dk('adh_a1', 'Aadhaar (masked), Ramesh', DCAT[1], 'login', 'Aadhaar_masked_Ramesh.pdf', '2026-11-12 11:44', 'Ganesh Saini'),
    dk('adh_a2', 'Aadhaar (masked), Kamla', DCAT[1], 'login', 'Aadhaar_masked_Kamla.pdf', '2026-11-12 11:45', 'Ganesh Saini'),
    dk('f60_a2', 'Form 60 (no PAN), Kamla', DCAT[1], 'login', 'Form60_Kamla.pdf'),
    dk('biz', 'Shop registration (Udyam certificate)', DCAT[2], 'login', 'Udyam_Kumawat_Kirana.pdf'),
    dk('bank_a1', 'Bank statement, 12 months, Amber Sahakari Bank', DCAT[3], 'login', 'Amber_Sahakari_0418_statement.pdf'),
    dk('patta', 'Gram panchayat patta, 2009', DCAT[4], 'login', 'Patta_214_2009.pdf', '2026-11-12 11:47', 'Ganesh Saini'),
    dk('gift', 'Gift deed, registered 2014', DCAT[4], 'login', 'Gift_deed_2014.pdf'),
    dk('gpnd', 'Panchayat name-transfer record and no-dues certificate', DCAT[4], 'login', 'Panchayat_record_and_no_dues.pdf'),
    dk('est', 'Construction estimate by a civil engineer', DCAT[4], 'login', 'Estimate_650sqft_house.pdf'),
    dk('plan', 'House plan', DCAT[4], 'opt', 'House_plan.pdf'),
    dk('bperm', 'Building permission from the gram panchayat', DCAT[4], 'cp', 'Building_permission.pdf'),
    dk('noc', 'No-objection affidavits from the brothers', DCAT[4], 'cp', 'NOC_affidavits.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-12 11:46', '2026-11-12 11:46'),
    tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-12 11:46', '2026-11-12 11:46'),
    tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Statement reader', 0, 'todo', null, null, null),
    tk('pd', 'Personal discussion', 'inc', 'int', 'Pooja Sharma, credit officer', 2, 'todo', null, null, null),
    tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Jaipur', 2, 'todo', null, null, null),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Adv. Rakesh Saini', 5, 'todo', null, null, null),
    tk('tech', 'Valuation and site visit', 'prop', 'ven', 'Rathore Valuation Services', 3, 'todo', null, null, null),
    tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'todo', null, null, null)
  ],
  w: { step: 'login' }
},
/* ---------------- C: prime resale, LTV over the RBI cap ---------------- */
{
  id: 'C', hint: 'Prime resale flat where the loan breaks the RBI LTV cap',
  seg: 'prime', prog: 'salaried', cat: 'resale', variant: 'resale', lang: 'en',
  v: { appNo: 'HL-2611-04755', branch: 'Bengaluru HSR Layout', src: 'DSA, HomeKey Advisors', srcBy: 'HomeKey Advisors', login: '2026-11-06 15:10', loan: 4500000, tenure: 300, roi: 9.25, purpose: 'Purchase of a resale flat', applied: { loan: 4500000, tenure: 300 } },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Kavya Raghunathan', ini: 'KR', age: 29, sex: 'F', emp: 'Salaried', occ: 'Product designer', org: 'Northwind Analytics Pvt Ltd', orgCat: 'B', yrs: 5, inc: 105000, incDecl: 105000, incSrc: 'Salary slips, Form 16 and salary credits through the Account Aggregator', earning: true, cibil: 768, dpd: '000000000000000000000000', enq6: 1, accts: 2, pan: 'DQRPR5590H', aadhaar: 'XXXX XXXX 5590', ckyc: 'Found and downloaded', addr: '18, 4th Cross, Koramangala 6th Block, Bengaluru 560095', mobile: '99XXXXX590', email: 'kavya.r@example.com' }
  ],
  oblig: [{ id: 'o1', who: 'a1', t: 'Credit card', lender: 'A private bank', emi: 400, out: 8000, left: null, count: true, why: '5% of the \u20B98,000 balance' }],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 5590', consent: 'Consent given 6 Nov 2026 for 12 months of data', months: M6, credits: [108900, 107300, 106800, 112500, 107900, 108400], debits: [96400, 99800, 94100, 108300, 97700, 101200], bal: [212000, 219500, 231800, 228400, 237600, 244100], salary: 'Northwind Analytics credits \u20B91,05,000 on the last working day, every month for 12 months', bounces: 0 },
  pd: null,
  prop: {
    kind: 'Flat', addr: 'Flat 3B, Lakeview Residency, 27th Main, HSR Layout Sector 2, Bengaluru 560102', carpet: 74.3, area: '74.3 m\u00B2 (800 sq ft) carpet, 2 bedrooms, built 2009', owners: ['a1'],
    agreement: 5600000, guideline: 4860000, builder: null, project: null, rera: null, apf: null,
    stage: 100, stageText: 'Complete, occupied since 2009', built: 2009, resid: 43, oc: true, planDev: 3, neg: 'none',
    cersai: { st: 'closing', t: 'Charge in favour of Lakshmi Housing Finance (the seller\u2019s loan). It will be closed from this loan' }, fcu: { st: 'pos', t: 'Sale deeds and salary slips sampled: positive' },
    legal: { by: 'Rao & Partners, Advocates', op: 'clear', note: 'Title is clear. The seller\u2019s mortgage must be released before registration.',
      chain: [{ y: '2009', t: 'Sale deed', p: 'Builder to Suresh Babu', n: 'First owner' }, { y: '2016', t: 'Sale deed', p: 'Suresh Babu to Arvind Rao', n: 'Seller. Mortgaged to Lakshmi Housing Finance' }, { y: '2016', t: 'Khata transfer', p: 'In the name of Arvind Rao', n: 'Property tax paid to 2026-27' }, { y: '2026', t: 'Agreement to sell', p: 'Arvind Rao to Kavya Raghunathan', n: 'Signed 2 Nov 2026', cls: 'now' }],
      conds: [], lod: ['Sale deed 2009 (original)', 'Sale deed 2016 (original, with the seller\u2019s lender)', 'Khata certificate and tax receipts', 'Occupancy certificate', 'Encumbrance certificate 2009 to 2026', 'Release deed from Lakshmi Housing Finance'], queries: [] },
    vals: [{ id: 'tech', by: 'Prism Valuers', v: 5500000, note: 'Market value. Building age 17 years, residual life 43 years' }]
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('app', 'Application form, signed', DCAT[0], 'login', 'Application_HL-2611-04755.pdf', '2026-11-06 15:10', 'HomeKey Advisors'),
    dk('cons', 'Consents: credit bureau, Account Aggregator and privacy notice', DCAT[0], 'login', 'Consent_record_e-signed.pdf', '2026-11-06 15:12', 'Customer, e-sign'),
    dk('pan_a1', 'PAN, Kavya', DCAT[1], 'login', 'PAN_Kavya.jpg', '2026-11-06 15:13', 'HomeKey Advisors'),
    dk('adh_a1', 'Aadhaar (masked), Kavya', DCAT[1], 'login', 'Aadhaar_masked_Kavya.pdf', '2026-11-06 15:13', 'HomeKey Advisors'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026', DCAT[2], 'login', 'Payslips_Kavya.pdf', '2026-11-06 15:15', 'HomeKey Advisors'),
    dk('f16_a1', 'Form 16, two years', DCAT[2], 'login', 'Form16_Kavya.pdf', '2026-11-06 15:15', 'HomeKey Advisors'),
    dk('bank_a1', 'Bank statement, 12 months, through the Account Aggregator', DCAT[3], 'login', 'Account Aggregator data', '2026-11-06 15:20', 'System'),
    dk('ats', 'Agreement to sell', DCAT[4], 'login', 'ATS_Lakeview_3B.pdf', '2026-11-06 15:17', 'HomeKey Advisors'),
    dk('deeds', 'Sale deeds, 2009 and 2016 (copies)', DCAT[4], 'login', 'Sale_deeds_2009_2016.pdf', '2026-11-06 15:17', 'HomeKey Advisors'),
    dk('ec', 'Encumbrance certificate, 2009 to 2026', DCAT[4], 'login', 'EC_2009_2026.pdf', '2026-11-06 15:18', 'HomeKey Advisors'),
    dk('khata', 'Khata certificate and tax receipt', DCAT[4], 'login', 'Khata_tax_2026.pdf', '2026-11-06 15:18', 'HomeKey Advisors'),
    dk('oc', 'Occupancy certificate', DCAT[4], 'login', 'OC_Lakeview_2009.pdf', '2026-11-06 15:19', 'HomeKey Advisors'),
    dk('sloan', 'Seller\u2019s loan statement', DCAT[4], 'login', 'Seller_loan_statement.pdf', '2026-11-06 15:19', 'HomeKey Advisors'),
    dk('rel', 'Release deed from the seller\u2019s lender', DCAT[4], 'cp', 'Release_deed.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-06 15:14', '2026-11-06 15:14'),
    tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-06 15:14', '2026-11-06 15:14'),
    tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-11-06 15:20', '2026-11-06 15:20'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Southline Verifications', 3, 'accepted', '2026-11-06 17:00', '2026-11-09 16:20', '2026-11-10 10:05'),
    tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Bengaluru', 2, 'accepted', '2026-11-06 17:05', '2026-11-09 12:00', '2026-11-09 12:40'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Rao & Partners, Advocates', 5, 'accepted', '2026-11-09 10:00', '2026-11-12 13:10', '2026-11-12 16:30'),
    tk('tech', 'Valuation and site visit', 'prop', 'ven', 'Prism Valuers', 3, 'accepted', '2026-11-09 10:05', '2026-11-11 12:15', '2026-11-11 15:00'),
    tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'accepted', null, '2026-11-10 11:00', '2026-11-10 11:00')
  ],
  w: { step: 'decide', sysAt: '2026-11-12 17:05' }
},
/* ---------------- D: balance transfer with top-up ---------------- */
{
  id: 'D', hint: 'Prime balance transfer with a top-up, clean on every rule',
  seg: 'prime', prog: 'salaried', cat: 'bt', variant: 'bt', lang: 'en',
  v: { appNo: 'HL-2611-04688', branch: 'Mumbai Kandivali', src: 'Website lead, branch', srcBy: 'Farida Khan, sales', login: '2026-11-04 12:30', loan: 4440000, tenure: 216, roi: 9.1, purpose: 'Balance transfer of a home loan, with a top-up for renovation', applied: { loan: 4440000, tenure: 216 } },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Imran Shaikh', ini: 'IS', age: 38, sex: 'M', emp: 'Salaried', occ: 'Senior manager, regulatory affairs', org: 'Asterix Pharma Ltd', orgCat: 'A', yrs: 12, inc: 165000, incDecl: 165000, incSrc: 'Salary slips, Form 16 and salary credits through the Account Aggregator', earning: true, cibil: 802, dpd: '000000000000000000000000', enq6: 1, accts: 3, pan: 'ESKPS1176F', aadhaar: 'XXXX XXXX 1176', ckyc: 'Found and downloaded', addr: 'Flat 702, Sea Breeze CHS, Mahavir Nagar, Kandivali West, Mumbai 400067', mobile: '98XXXXX176', email: 'imran.s@example.com' },
    { id: 'a2', role: 'Co-applicant', rel: 'Spouse, co-owner', name: 'Zoya Shaikh', ini: 'ZS', age: 35, sex: 'F', emp: 'Homemaker', occ: 'Homemaker', org: '', orgCat: null, yrs: 0, inc: 0, incDecl: 0, incSrc: 'No income considered', earning: false, cibil: 761, dpd: '000000000000000000000000', enq6: 0, accts: 1, pan: 'FZSPS4410Q', aadhaar: 'XXXX XXXX 4410', ckyc: 'Found and downloaded', addr: 'Flat 702, Sea Breeze CHS, Mahavir Nagar, Kandivali West, Mumbai 400067', mobile: '98XXXXX410', email: '' }
  ],
  oblig: [{ id: 'o1', who: 'a1', t: 'Home loan being transferred', lender: 'Metro Home Finance Ltd', emi: 41200, out: 3840000, left: 158, count: false, why: 'Closed from this loan' }],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 1176', consent: 'Consent given 4 Nov 2026 for 12 months of data', months: M6, credits: [171200, 168900, 175300, 169800, 182400, 170100], debits: [154300, 159800, 148700, 162200, 171900, 158600], bal: [312000, 318400, 336900, 331700, 342800, 349100], salary: 'Asterix Pharma credits \u20B91,65,000 on the 1st, every month for 12 months', bounces: 0 },
  pd: null,
  bt: { lender: 'Metro Home Finance Ltd', out: 3840000, emi: 41200, paid: 58, bounces: 0, fcl: 'Foreclosure letter valid to 30 Nov 2026' },
  topup: { amt: 600000, use: 'Home renovation', est: 650000 },
  prop: {
    kind: 'Flat', addr: 'Flat 702, Sea Breeze CHS, Mahavir Nagar, Kandivali West, Mumbai 400067', carpet: 61.3, area: '61.3 m\u00B2 (660 sq ft) carpet, built 2012', owners: ['a1', 'a2'],
    agreement: null, guideline: 9450000, builder: null, project: null, rera: null, apf: null,
    stage: 100, stageText: 'Complete, owner-occupied', built: 2012, resid: 46, oc: true, planDev: 0, neg: 'none',
    cersai: { st: 'closing', t: 'Charge in favour of Metro Home Finance, the loan being transferred. It will be closed from this loan' }, fcu: { st: 'pos', t: 'Loan statement and salary slips sampled: positive' },
    legal: { by: 'N. Merchant & Co.', op: 'clear', note: 'Title is clear. Original documents are with Metro Home Finance; their list matches the chain.',
      chain: [{ y: '2012', t: 'Sale deed', p: 'Builder to Imran and Zoya Shaikh', n: 'Registered, Borivali' }, { y: '2012', t: 'Share certificate', p: 'Sea Breeze CHS', n: 'In both names' }, { y: '2021', t: 'Mortgage', p: 'Metro Home Finance', n: 'To be released on transfer', cls: 'now' }],
      conds: [], lod: ['Sale deed 2012 (from Metro Home Finance)', 'Share certificate', 'Society NOC for the transfer', 'Occupancy certificate'], queries: [] },
    vals: [{ id: 'tech', by: 'Coastal Valuers', v: 11200000, note: 'Market value. Building age 14 years' }]
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('app', 'Application form, signed', DCAT[0], 'login', 'Application_HL-2611-04688.pdf', '2026-11-04 12:30', 'Farida Khan'),
    dk('cons', 'Consents: credit bureau, Account Aggregator and privacy notice', DCAT[0], 'login', 'Consent_record_e-signed.pdf', '2026-11-04 12:31', 'Customer, e-sign'),
    dk('pan_a1', 'PAN, Imran', DCAT[1], 'login', 'PAN_Imran.jpg', '2026-11-04 12:33', 'Farida Khan'),
    dk('adh_a1', 'Aadhaar (masked), Imran', DCAT[1], 'login', 'Aadhaar_masked_Imran.pdf', '2026-11-04 12:33', 'Farida Khan'),
    dk('pan_a2', 'PAN, Zoya', DCAT[1], 'login', 'PAN_Zoya.jpg', '2026-11-04 12:34', 'Farida Khan'),
    dk('adh_a2', 'Aadhaar (masked), Zoya', DCAT[1], 'login', 'Aadhaar_masked_Zoya.pdf', '2026-11-04 12:34', 'Farida Khan'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026', DCAT[2], 'login', 'Payslips_Imran.pdf', '2026-11-04 12:36', 'Farida Khan'),
    dk('f16_a1', 'Form 16, two years', DCAT[2], 'login', 'Form16_Imran.pdf', '2026-11-04 12:36', 'Farida Khan'),
    dk('bank_a1', 'Bank statement, 12 months, through the Account Aggregator', DCAT[3], 'login', 'Account Aggregator data', '2026-11-04 12:40', 'System'),
    dk('btsan', 'Sanction letter from Metro Home Finance', DCAT[4], 'login', 'MHF_sanction_2021.pdf', '2026-11-04 12:37', 'Farida Khan'),
    dk('btsoa', 'Loan statement, 58 EMIs', DCAT[4], 'login', 'MHF_loan_statement.pdf', '2026-11-04 12:37', 'Farida Khan'),
    dk('lod', 'List of documents held by Metro Home Finance', DCAT[4], 'login', 'MHF_list_of_documents.pdf', '2026-11-04 12:38', 'Farida Khan'),
    dk('share', 'Society share certificate and NOC', DCAT[4], 'login', 'SeaBreeze_share_NOC.pdf', '2026-11-04 12:38', 'Farida Khan'),
    dk('reno', 'Renovation estimate, \u20B96.5 lakh', DCAT[4], 'login', 'Renovation_estimate.pdf', '2026-11-04 12:39', 'Farida Khan'),
    dk('fcl', 'Foreclosure letter from Metro Home Finance', DCAT[4], 'cp', 'MHF_foreclosure_letter.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-04 12:35', '2026-11-04 12:35'),
    tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-04 12:35', '2026-11-04 12:35'),
    tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-11-04 12:40', '2026-11-04 12:40'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Westline Field Checks', 3, 'accepted', '2026-11-04 15:00', '2026-11-06 18:00', '2026-11-09 10:20'),
    tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Mumbai', 2, 'accepted', '2026-11-04 15:05', '2026-11-06 11:30', '2026-11-06 12:00'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'N. Merchant & Co.', 5, 'accepted', '2026-11-05 10:00', '2026-11-09 17:40', '2026-11-10 10:30'),
    tk('tech', 'Valuation and site visit', 'prop', 'ven', 'Coastal Valuers', 3, 'accepted', '2026-11-05 10:05', '2026-11-06 16:10', '2026-11-09 10:25'),
    tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'accepted', null, '2026-11-05 12:00', '2026-11-05 12:00')
  ],
  w: { step: 'decide', sysAt: '2026-11-10 12:40' }
},
/* ---------------- E: waiting on an overdue legal report ---------------- */
{
  id: 'E', hint: 'Resale house, held up by a legal report that is a day late',
  seg: 'prime', prog: 'salaried', cat: 'resale', variant: 'resale', lang: 'en',
  v: { appNo: 'HL-2611-04731', branch: 'Ludhiana', src: 'DSA, Punjab Home Loans Point', srcBy: 'Punjab Home Loans Point', login: '2026-11-05 11:15', loan: 2800000, tenure: 240, roi: 9.6, purpose: 'Purchase of a resale house', applied: { loan: 2800000, tenure: 240 } },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Harpreet Kaur', ini: 'HK', age: 33, sex: 'F', emp: 'Salaried', occ: 'Staff nurse', org: 'Sutlej Multispeciality Hospital', orgCat: 'B', yrs: 7, inc: 58000, incDecl: 58000, incSrc: 'Salary slips, Form 16 and salary credits through the Account Aggregator', earning: true, cibil: 744, dpd: '000000000000000000000000', enq6: 2, accts: 2, pan: 'GHKPK3320A', aadhaar: 'XXXX XXXX 3320', ckyc: 'Found and downloaded', addr: 'House 211, Sector 32, Chandigarh Road, Ludhiana 141010', mobile: '98XXXXX320', email: 'harpreet.k@example.com' },
    { id: 'a2', role: 'Co-applicant', rel: 'Spouse', name: 'Gurdeep Singh', ini: 'GS', age: 36, sex: 'M', emp: 'Self-employed', occ: 'Electrical contractor', org: 'GS Electricals', orgCat: null, yrs: 9, inc: 40000, incDecl: 42000, incSrc: 'ITR for two years, average', earning: true, cibil: 721, dpd: '000000000000000010000000', enq6: 1, accts: 3, pan: 'BGSPS8841K', aadhaar: 'XXXX XXXX 8841', ckyc: 'Found and downloaded', addr: 'House 211, Sector 32, Chandigarh Road, Ludhiana 141010', mobile: '98XXXXX841', email: '' }
  ],
  oblig: [{ id: 'o1', who: 'a2', t: 'Equipment loan', lender: 'An NBFC', emi: 9500, out: 186000, left: 22, count: true, why: '' }],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 3320', consent: 'Consent given 5 Nov 2026 for 12 months of data', months: M6, credits: [61200, 59800, 60400, 58900, 63100, 60700], debits: [52800, 56100, 54900, 55700, 58800, 56300], bal: [41000, 44600, 47200, 46100, 48900, 50300], salary: 'Sutlej Multispeciality Hospital credits \u20B958,000 on the 7th, every month for 12 months', bounces: 0 },
  pd: null,
  prop: {
    kind: 'Independent house', addr: 'House 1432, Gali 7, Basant Vihar, Ludhiana 141013', carpet: 96.6, area: 'Plot 150 sq yd. House 1,040 sq ft carpet (96.6 m\u00B2), built 2011', owners: ['a1', 'a2'],
    agreement: 3650000, guideline: 3120000, builder: null, project: null, rera: null, apf: null,
    stage: 100, stageText: 'Complete, occupied', built: 2011, resid: 45, oc: true, planDev: 4, neg: 'none',
    cersai: { st: 'clear', t: 'No charge registered on this house' }, fcu: { st: 'pos', t: 'Sale deeds and ITR sampled: positive' },
    legal: { by: 'Adv. S. K. Bansal', op: 'clear', note: 'Title is clear and marketable.',
      chain: [{ y: '1996', t: 'Conveyance deed', p: 'Improvement trust to Mohinder Singh', n: 'Plot allotted in the trust\u2019s scheme' }, { y: '2011', t: 'Sale deed', p: 'Mohinder Singh to Baldev Raj', n: 'Seller. House built in 2011' }, { y: '2026', t: 'Agreement to sell', p: 'Baldev Raj to Harpreet Kaur and Gurdeep Singh', n: 'Signed 1 Nov 2026', cls: 'now' }],
      conds: [], lod: ['Conveyance deed 1996', 'Sale deed 2011', 'Encumbrance certificate 1996 to 2026', 'Property tax receipts'], queries: [] },
    vals: [{ id: 'tech', by: 'Punjab Valuers & Surveyors', v: 3720000, note: 'Market value. Building age 15 years' }]
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('app', 'Application form, signed', DCAT[0], 'login', 'Application_HL-2611-04731.pdf', '2026-11-05 11:15', 'Punjab Home Loans Point'),
    dk('cons', 'Consents: credit bureau, Account Aggregator and privacy notice', DCAT[0], 'login', 'Consent_record_e-signed.pdf', '2026-11-05 11:16', 'Customer, e-sign'),
    dk('pan_a1', 'PAN, Harpreet', DCAT[1], 'login', 'PAN_Harpreet.jpg', '2026-11-05 11:18', 'Punjab Home Loans Point'),
    dk('adh_a1', 'Aadhaar (masked), Harpreet', DCAT[1], 'login', 'Aadhaar_masked_Harpreet.pdf', '2026-11-05 11:18', 'Punjab Home Loans Point'),
    dk('pan_a2', 'PAN, Gurdeep', DCAT[1], 'login', 'PAN_Gurdeep.jpg', '2026-11-05 11:19', 'Punjab Home Loans Point'),
    dk('adh_a2', 'Aadhaar (masked), Gurdeep', DCAT[1], 'login', 'Aadhaar_masked_Gurdeep.pdf', '2026-11-05 11:19', 'Punjab Home Loans Point'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026, Harpreet', DCAT[2], 'login', 'Payslips_Harpreet.pdf', '2026-11-05 11:21', 'Punjab Home Loans Point'),
    dk('itr_a2', 'ITR, two years, Gurdeep', DCAT[2], 'login', 'ITR_Gurdeep_2yrs.pdf', '2026-11-05 11:21', 'Punjab Home Loans Point'),
    dk('bank_a1', 'Bank statement, 12 months, through the Account Aggregator', DCAT[3], 'login', 'Account Aggregator data', '2026-11-05 11:25', 'System'),
    dk('ats', 'Agreement to sell', DCAT[4], 'login', 'ATS_House_1432.pdf', '2026-11-05 11:23', 'Punjab Home Loans Point'),
    dk('deeds', 'Title deeds, 1996 and 2011 (copies)', DCAT[4], 'login', 'Title_deeds_1996_2011.pdf', '2026-11-05 11:23', 'Punjab Home Loans Point'),
    dk('tax', 'Property tax receipts', DCAT[4], 'login', 'Property_tax_2026.pdf', '2026-11-05 11:24', 'Punjab Home Loans Point')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-05 11:20', '2026-11-05 11:20'),
    tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-05 11:20', '2026-11-05 11:20'),
    tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-11-05 11:25', '2026-11-05 11:25'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Doaba Field Services', 3, 'accepted', '2026-11-05 14:00', '2026-11-09 15:30', '2026-11-10 09:45'),
    tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Chandigarh', 2, 'accepted', '2026-11-05 14:05', '2026-11-09 11:10', '2026-11-09 11:40'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Adv. S. K. Bansal', 5, 'assigned', '2026-11-06 11:00', null, null, { rem: '2026-11-13 17:05' }),
    tk('tech', 'Valuation and site visit', 'prop', 'ven', 'Punjab Valuers & Surveyors', 3, 'accepted', '2026-11-06 11:05', '2026-11-10 13:20', '2026-11-10 16:00'),
    tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'accepted', null, '2026-11-06 12:00', '2026-11-06 12:00')
  ],
  w: { step: 'verify' }
},
/* ---------------- F: declined, with reasons sent in writing ---------------- */
{
  id: 'F', hint: 'Plot and construction, declined: title not clear and plot in a barred area',
  seg: 'affordable', prog: 'selfdoc', cat: 'plotcon', variant: 'plotcon', lang: 'hi',
  v: { appNo: 'HL-2610-04412', branch: 'Kota', src: 'DSA, Hadoti Finserv', srcBy: 'Hadoti Finserv', login: '2026-10-26 13:00', loan: 2200000, tenure: 240, roi: 10.9, purpose: 'Purchase of a plot and construction of a house', applied: { loan: 2200000, tenure: 240 } },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Mahesh Meena', ini: 'MM', age: 45, sex: 'M', emp: 'Self-employed', occ: 'Transport contractor', org: 'Meena Transport', orgCat: null, yrs: 14, inc: 60000, incDecl: 62000, incSrc: 'ITR for two years, average', earning: true, cibil: 688, dpd: '000000000000003000000000', enq6: 4, accts: 5, pan: 'AMMPM6120L', aadhaar: 'XXXX XXXX 6120', ckyc: 'Found and downloaded', addr: '56, Shiv Shakti Nagar, Kota 324008', mobile: '94XXXXX120', email: '' }
  ],
  oblig: [{ id: 'o1', who: 'a1', t: 'Commercial vehicle loan', lender: 'An NBFC', emi: 14800, out: 420000, left: 30, count: true, why: '' }],
  bank: { via: 'Account Aggregator', acct: 'Current account ending 6120', consent: 'Consent given 26 Oct 2026 for 12 months of data', months: M6, credits: [148000, 132500, 161200, 139800, 152400, 146900], debits: [141300, 135100, 152600, 141900, 149700, 143200], bal: [38400, 35200, 44100, 40800, 42600, 41900], salary: 'Business account: freight receipts from three regular customers', bounces: 0 },
  pd: null,
  prop: {
    kind: 'Plot with a house to be built', addr: 'Plot 9, Shiv Shakti Nagar Extension, Kota 324008', carpet: 88.0, area: 'Plot 160 sq yd. House planned: 950 sq ft carpet (88 m\u00B2)', owners: ['a1'],
    agreement: 1250000, est: 1700000, guideline: 1080000, builder: null, project: null, rera: null, apf: null,
    stage: 0, stageText: 'Vacant plot', built: null, resid: 60, oc: null, planDev: null, neg: 'barred', negNote: 'Inside the river\u2019s flood line on the town plan',
    cersai: { st: 'clear', t: 'No charge registered on this plot' }, fcu: { st: 'pos', t: 'ITR and sale deed sampled: positive' },
    legal: { by: 'Adv. Naresh Gupta', op: 'notclear', note: 'Title is not clear. A civil suit about this plot is pending.',
      chain: [{ y: '2003', t: 'Sale deed', p: 'Land owner to Shiv Shakti housing society', n: 'Layout of 64 plots' }, { y: '2015', t: 'Sale deed', p: 'Society to Ram Prasad Meena', n: 'Seller' }, { y: '2024', t: 'Civil suit filed', p: 'Ram Prasad\u2019s brother claims a share', n: 'Suit No. 412/2024, pending', cls: 'bad' }, { y: '2026', t: 'Agreement to sell', p: 'Ram Prasad Meena to Mahesh Meena', n: 'Signed 20 Oct 2026', cls: 'now' }],
      conds: [], lod: [], queries: [] },
    vals: [{ id: 'tech', by: 'Hadoti Valuers', v: 2950000, land: 1250000, constr: 1700000, note: 'Plot inside the flood line on the town plan' }]
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('app', 'Application form, signed', DCAT[0], 'login', 'Application_HL-2610-04412.pdf', '2026-10-26 13:00', 'Hadoti Finserv'),
    dk('cons', 'Consents: credit bureau, Account Aggregator and privacy notice (Hindi)', DCAT[0], 'login', 'Consent_record_Hindi.pdf', '2026-10-26 13:02', 'Customer, OTP'),
    dk('pan_a1', 'PAN, Mahesh', DCAT[1], 'login', 'PAN_Mahesh.jpg', '2026-10-26 13:04', 'Hadoti Finserv'),
    dk('adh_a1', 'Aadhaar (masked), Mahesh', DCAT[1], 'login', 'Aadhaar_masked_Mahesh.pdf', '2026-10-26 13:04', 'Hadoti Finserv'),
    dk('itr_a1', 'ITR, two years', DCAT[2], 'login', 'ITR_Mahesh_2yrs.pdf', '2026-10-26 13:06', 'Hadoti Finserv'),
    dk('bank_a1', 'Bank statement, 12 months, through the Account Aggregator', DCAT[3], 'login', 'Account Aggregator data', '2026-10-26 13:10', 'System'),
    dk('ats', 'Agreement to sell, plot', DCAT[4], 'login', 'ATS_Plot9.pdf', '2026-10-26 13:07', 'Hadoti Finserv'),
    dk('deeds', 'Sale deeds, 2003 and 2015 (copies)', DCAT[4], 'login', 'Sale_deeds_2003_2015.pdf', '2026-10-26 13:07', 'Hadoti Finserv'),
    dk('est', 'Construction estimate', DCAT[4], 'login', 'Estimate_950sqft.pdf', '2026-10-26 13:08', 'Hadoti Finserv')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-10-26 13:05', '2026-10-26 13:05'),
    tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-10-26 13:05', '2026-10-26 13:05'),
    tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-10-26 13:10', '2026-10-26 13:10'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Hadoti Field Agency', 3, 'accepted', '2026-10-26 15:00', '2026-10-28 17:00', '2026-10-29 10:00'),
    tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Jaipur', 2, 'accepted', '2026-10-26 15:05', '2026-10-28 11:00', '2026-10-28 11:20'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Adv. Naresh Gupta', 5, 'accepted', '2026-10-27 10:00', '2026-10-31 16:00', '2026-11-02 10:10'),
    tk('tech', 'Valuation and site visit', 'prop', 'ven', 'Hadoti Valuers', 3, 'accepted', '2026-10-27 10:05', '2026-10-29 14:30', '2026-10-30 09:30'),
    tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'accepted', null, '2026-10-28 12:00', '2026-10-28 12:00')
  ],
  w: { step: 'closed', dec: { k: 'declined', by: 'L1', at: '2026-11-03 12:10', reasons: ['r_legal', 'r_neg'], note: 'Title not clear: a civil suit about the plot is pending. The plot is inside the flood line on the town plan, which the policy bars.' }, letter: { sent: '2026-11-03 12:30', ch: 'Registered post, email and SMS' } }
}
];
let CASES = [];

/* =====================================================================
   Engine: facts, rules, deviation model, outcomes
   ===================================================================== */
let S, E;
function C() { return CASES[S.i]; }
function task(c, id) { return c.tasks.find(t => t.id === id); }
function tIn(c, id) { const t = task(c, id); return !!t && t.st === 'accepted'; }
function slabI(loan) { return loan <= 3000000 ? 0 : loan <= 7500000 ? 1 : 2; }
function lvlAmt(loan, pol) { return loan <= pol.auth.L1 ? 'L1' : loan <= pol.auth.L2 ? 'L2' : loan <= pol.auth.L3 ? 'L3' : 'L4'; }
function bandI(inc, pol) { const b = pol.foir.bands; return inc <= b[0] ? 0 : inc <= b[1] ? 1 : inc <= b[2] ? 2 : 3; }
function maxAgeOf(emp, pol) { return emp === 'Salaried' ? pol.age.salaried : pol.age.selfemp; }
function maxLoanLtv(V, cat, pol, regOnly) {
  const R = [[0, 3000000], [3000001, 7500000], [7500001, 1e12]]; let best = 0;
  R.forEach(([lo, hi], i) => { const cap = regOnly ? pol.ltv.reg[i] : Math.min(pol.ltv.reg[i], pol.ltv[cat][i]); const L = Math.min(hi, cap / 100 * V); if (L >= lo && L > best) best = L; });
  return best;
}
function maxTenureOf(f, pol) {
  let m = pol.tenure[f.seg];
  f.earners.forEach(a => { m = Math.min(m, (maxAgeOf(a.emp, pol) - a.age) * 12); });
  return Math.max(0, Math.floor(m / 12) * 12);
}

/* ---------- facts from a case ---------- */
function factsOf(c) {
  const d = c.v, p = c.prop, earners = c.apps.filter(a => a.earning);
  const incTask = c.prog === 'aip' ? 'pd' : 'aa', incKnown = tIn(c, incTask);
  const incElig = sum(earners, a => a.inc || 0), incDecl = sum(earners, a => a.incDecl || 0);
  const scores = c.apps.filter(a => a.cibil).map(a => a.cibil);
  let d30 = 0, d90 = false;
  c.apps.forEach(a => { if (!a.dpd) return; for (let i = 0; i < a.dpd.length; i++) { const ch = a.dpd[i]; if (i >= 12 && '369'.includes(ch)) d30++; if (ch === '9') d90 = true; } });
  const vals = p.vals.filter(x => tIn(c, x.id));
  let valUsed = null, basis = '';
  if (vals.length) {
    if (c.variant === 'selfcon' || c.variant === 'plotcon') {
      const landV = Math.min(...vals.map(x => x.land)), land = p.agreement ? Math.min(p.agreement, landV) : landV;
      const con = Math.min(p.est || Infinity, ...vals.map(x => x.constr));
      valUsed = land + con; basis = 'land value plus the lower of the two construction estimates';
    } else {
      const cand = vals.map(x => x.v); if (p.agreement) cand.push(p.agreement);
      valUsed = Math.min(...cand); basis = p.agreement ? 'the lowest of the agreement value and the valuations' : (vals.length > 1 ? 'the lower of the two valuations' : 'the valuation');
    }
  }
  const vv = vals.map(x => x.v), valVar = vv.length > 1 ? (Math.max(...vv) - Math.min(...vv)) / Math.min(...vv) * 100 : null;
  return {
    seg: c.seg, prog: c.prog, cat: c.cat, variant: c.variant,
    loan: d.loan, tenure: d.tenure, roi: d.roi,
    incKnown, incWait: c.prog === 'aip' ? 'the personal discussion' : 'the bank statement analysis',
    incElig, incDecl, oblig: sum(c.oblig.filter(o => o.count), o => o.emi), obl: c.oblig.filter(o => o.count && o.emi > 0).map(o => ({ id: o.id, t: o.t, emi: o.emi })),
    earners: earners.map(a => ({ name: a.name.split(' ')[0], age: a.age, emp: a.emp })),
    yrs: c.apps[0].yrs, coEarning: earners.length > 1,
    bureauIn: tIn(c, 'bureau'), minScore: scores.length ? Math.min(...scores) : null, d30, d90,
    ntcPrimary: !c.apps[0].cibil, ntcCo: c.apps.slice(1).some(a => a.earning && !a.cibil),
    kycIn: tIn(c, 'kyc'),
    legalIn: tIn(c, 'legal'), legal: p.legal.op,
    techIn: tIn(c, 'tech'), nVals: vals.length, valUsed, basis, valVar, tech2Task: !!task(c, 'tech2'),
    neg: p.neg, planDev: p.planDev, needOC: ['resale', 'ready', 'bt'].includes(c.variant), oc: p.oc, resid: p.resid,
    cersaiIn: tIn(c, 'cersai'), cersai: p.cersai.st,
    uc: c.variant === 'uc', reraIn: tIn(c, 'rera'), reraOk: p.rera ? p.rera.ok : null,
    apf: !!(p.apf && p.apf.st === 'Approved'),
    fcuIn: tIn(c, 'fcu'), fcu: p.fcu.st,
    colend: c.colend ? (tIn(c, 'colend') ? 'approved' : 'pending') : null, partner: c.colend ? c.colend.partner : '',
    bounces: c.bank.bounces || 0,
    incVar: incKnown && incDecl > incElig ? (incDecl - incElig) / incElig * 100 : 0
  };
}

/* ---------- rules ---------- */
function evalFacts(f, pol) {
  const emi = emiCalc(f.loan, f.roi, f.tenure);
  const bI = bandI(f.incElig, pol), foirCap = pol.foir[f.prog][bI];
  const foir = f.incKnown && f.incElig ? (f.oblig + emi) / f.incElig * 100 : null;
  const sI = slabI(f.loan), capReg = pol.ltv.reg[sI], capPol = pol.ltv[f.cat][sI];
  const ltv = f.valUsed ? f.loan / f.valUsed * 100 : null;
  const maxF = f.incKnown ? Math.max(0, floor10k(loanFor(foirCap / 100 * f.incElig - f.oblig, f.roi, f.tenure))) : null;
  const maxL = f.valUsed ? floor10k(maxLoanLtv(f.valUsed, f.cat, pol, false)) : null;
  const maxLreg = f.valUsed ? floor10k(maxLoanLtv(f.valUsed, f.cat, pol, true)) : null;
  const elig = maxF != null && maxL != null ? Math.min(maxF, maxL) : (maxF != null ? maxF : maxL);
  const amtLvl = lvlAmt(f.loan, pol), dv = pol.dev;
  const m = { emi, foir, foirCap, bI, ltv, capReg, capPol, sI, maxF, maxL, maxLreg, elig, amtLvl, foirEx: foir != null ? Math.max(0, foir - foirCap) : 0 };
  const R = [];
  const add = (id, sec, name, cite, o) => R.push(Object.assign({ id, sec, name, cite, st: 'pass', kind: null, lvl: null, v: '', lim: '' }, o));
  const need = w => ({ st: 'needs', v: 'Waiting for ' + w });
  /* income */
  const minI = pol.minInc[f.seg];
  add('r_minc', 'Income', 'Minimum eligible income', 'Policy 3.1', !f.incKnown ? need(f.incWait) : { st: f.incElig >= minI ? 'pass' : 'fail', kind: f.incElig >= minI ? null : 'hard', v: inr(f.incElig) + ' a month', lim: 'At least ' + inr(minI) });
  if (!f.incKnown) add('r_foir', 'Income', 'FOIR within the cap', 'Policy 3.2', need(f.incWait));
  else {
    const ex = foir - foirCap, o = { v: pctf(foir), lim: foirCap + '%, ' + lc1(PROG[f.prog]) + ', income ' + lc1(BANDS[bI]), ex };
    if (ex <= 0) o.st = 'pass';
    else if (ex <= (dv.foirL1 || 0)) Object.assign(o, { st: 'fail', kind: 'dev', lvl: 'L1', ml: true });
    else if (ex <= dv.foirL2) Object.assign(o, { st: 'fail', kind: 'dev', lvl: 'L2', ml: true });
    else if (ex <= dv.foirL3) Object.assign(o, { st: 'fail', kind: 'dev', lvl: 'L3' });
    else Object.assign(o, { st: 'fail', kind: 'hard' });
    if (o.st === 'fail') o.why = 'FOIR is ' + pts(ex) + ' over the cap. Up to ' + dv.foirL1 + ' points the credit manager can approve, up to ' + dv.foirL2 + ' needs L2 and up to ' + dv.foirL3 + ' needs L3.';
    add('r_foir', 'Income', 'FOIR within the cap', 'Policy 3.2', o);
  }
  let worst = null; f.earners.forEach(a => { const mat = a.age + f.tenure / 12, over = mat - maxAgeOf(a.emp, pol); if (!worst || over > worst.over) worst = { a, mat, over }; });
  if (worst) {
    const o = { v: worst.a.name + ', ' + trimz(worst.mat.toFixed(1)) + ' at maturity', lim: 'Up to ' + maxAgeOf(worst.a.emp, pol) + ' for ' + lc1(worst.a.emp === 'Salaried' ? 'salaried' : 'self-employed') };
    if (worst.over <= 0) o.st = 'pass'; else if (worst.over <= dv.ageL2) Object.assign(o, { st: 'fail', kind: 'dev', lvl: 'L2', ml: true, why: 'Age at maturity is ' + trimz(worst.over.toFixed(1)) + ' years over the limit.' }); else Object.assign(o, { st: 'fail', kind: 'hard' });
    add('r_age', 'Income', 'Age at loan maturity', 'Policy 3.3', o);
  }
  add('r_ten', 'Loan', 'Tenure within the maximum', 'Policy 3.4', { st: f.tenure <= pol.tenure[f.seg] ? 'pass' : 'fail', kind: f.tenure <= pol.tenure[f.seg] ? null : 'hard', v: yrsTxt(f.tenure), lim: 'Up to ' + yrsTxt(pol.tenure[f.seg]) });
  /* bureau */
  if (!f.bureauIn) add('r_score', 'Bureau', 'Lowest bureau score', 'Policy 4.1', need('the bureau report'));
  else if (f.minScore == null) add('r_score', 'Bureau', 'Lowest bureau score', 'Policy 4.1', f.seg === 'affordable' ? { v: 'No credit history', lim: 'Allowed in the affordable programme' } : { st: 'fail', kind: 'dev', lvl: 'L2', v: 'No credit history', lim: 'Score of ' + dv.scoreMin + ' or more' });
  else {
    const s = f.minScore, o = { v: String(s), lim: dv.scoreMin + ' or more' };
    if (s >= dv.scoreMin) o.st = 'pass'; else if (s >= dv.scoreL2) Object.assign(o, { st: 'fail', kind: 'dev', lvl: 'L2', ml: true }); else if (s >= dv.scoreL3) Object.assign(o, { st: 'fail', kind: 'dev', lvl: 'L3' }); else Object.assign(o, { st: 'fail', kind: 'hard' });
    add('r_score', 'Bureau', 'Lowest bureau score', 'Policy 4.1', o);
  }
  if (f.bureauIn) add('r_dpd', 'Bureau', 'Repayment record', 'Policy 4.2', f.d90 ? { st: 'fail', kind: 'hard', v: 'A payment 90+ days late', lim: 'None in 24 months' } : f.d30 ? { st: 'fail', kind: 'dev', lvl: 'L2', v: plural(f.d30, 'payment') + ' 30+ days late in 12 months', lim: 'None in 12 months' } : { v: 'No payment 30+ days late in 12 months', lim: 'None in 12 months' });
  if (f.ntcCo || f.ntcPrimary) add('r_ntc', 'Bureau', 'Applicants new to credit', 'Policy 4.3', f.seg === 'affordable' ? { v: 'Earning co-applicant with no history', lim: 'Allowed in the affordable programme' } : { st: 'fail', kind: 'dev', lvl: 'L2', v: 'An earning applicant has no history', lim: 'Needs L2 in the prime programme' });
  /* KYC */
  add('r_kyc', 'KYC', 'KYC verified for every applicant', 'Policy 5.1', f.kycIn ? { v: 'PAN, Aadhaar and CKYC checked', lim: 'All applicants' } : need('KYC checks'));
  add('r_dedupe', 'KYC', 'No match in dedupe or negative lists', 'Policy 5.2', f.kycIn ? { v: 'No match', lim: 'No match' } : need('KYC checks'));
  /* property */
  if (!f.valUsed) add('r_ltv_reg', 'Property', 'LTV within the RBI cap', 'RBI HFC Directions, 2025, para 58', need('the valuation'));
  else add('r_ltv_reg', 'Property', 'LTV within the RBI cap', 'RBI HFC Directions, 2025, para 58', ltv <= capReg + 1e-9 ? { v: pctf(ltv), lim: capReg + '% for loans ' + lc1(SLABS[sI]) } : { st: 'fail', kind: 'hard', reg: true, v: pctf(ltv), lim: capReg + '% for loans ' + lc1(SLABS[sI]), why: 'Set by RBI. No level of authority can approve a loan above it.' });
  if (f.valUsed) {
    const o = { v: pctf(ltv), lim: capPol + '% for ' + lc1(CATS[f.cat]) };
    if (ltv > capReg + 1e-9) Object.assign(o, { st: 'na', v: 'See the RBI cap' });
    else if (ltv <= capPol + 1e-9) o.st = 'pass';
    else { const ex = ltv - capPol; Object.assign(o, ex <= dv.ltvL2 ? { st: 'fail', kind: 'dev', lvl: 'L2', ml: true } : { st: 'fail', kind: 'dev', lvl: 'L3' }, { why: 'LTV is ' + pts(ex) + ' over the policy cap for this property.' }); }
    add('r_ltv_pol', 'Property', 'LTV within the policy cap', 'Policy 6.2', o);
  }
  add('r_legal', 'Property', 'Legal opinion', 'Policy 6.3', !f.legalIn ? need('the legal report') : f.legal === 'clear' ? { v: 'Clear', lim: 'Clear' } : f.legal === 'cond' ? { st: 'fail', kind: 'ref', lvl: 'L1', v: 'Clear with conditions', lim: 'Clear', why: 'A person must accept the advocate\u2019s conditions; they become conditions before the first disbursement.' } : { st: 'fail', kind: 'hard', v: 'Not clear', lim: 'Clear' });
  add('r_val', 'Property', 'Valuation report', 'Policy 6.4', f.techIn ? { v: lakh(f.valUsed) + ' used', lim: 'Report accepted' } : need('the valuation report'));
  if (f.loan > pol.dualAbove) add('r_dual', 'Property', 'Two valuations above ' + lakh(pol.dualAbove), 'Policy 6.5', f.nVals >= 2 ? { v: '2 valuations', lim: '2 valuations' } : need(f.tech2Task ? 'the second valuation' : 'a second valuation to be ordered'));
  if (f.nVals >= 2) add('r_valvar', 'Property', 'Valuations agree', 'Policy 6.6', f.valVar <= pol.valVar ? { v: pctf(f.valVar) + ' apart', lim: 'Within ' + pol.valVar + '%' } : { st: 'fail', kind: 'ref', lvl: 'L2', v: pctf(f.valVar) + ' apart', lim: 'Within ' + pol.valVar + '%' });
  add('r_neg', 'Property', 'Property not in a negative area', 'Policy 6.7', !f.techIn ? need('the site visit') : f.neg === 'none' ? { v: 'Not on any list', lim: 'Not on any list' } : f.neg === 'caution' ? { st: 'fail', kind: 'dev', lvl: 'L3', v: 'Caution area', lim: 'Not on any list' } : { st: 'fail', kind: 'hard', v: 'Barred area', lim: 'Not on any list' });
  if (f.planDev != null) add('r_plan', 'Property', 'Construction within the approved plan', 'Policy 6.8', !f.techIn ? need('the site visit') : f.planDev <= dv.planTol ? { v: pct(f.planDev) + ' deviation', lim: 'Up to ' + dv.planTol + '%' } : f.planDev <= dv.planMax ? { st: 'fail', kind: 'dev', lvl: 'L2', v: pct(f.planDev) + ' deviation', lim: 'Up to ' + dv.planTol + '%' } : { st: 'fail', kind: 'hard', v: pct(f.planDev) + ' deviation', lim: 'Up to ' + dv.planTol + '%' });
  if (f.needOC) add('r_oc', 'Property', 'Occupancy certificate', 'Policy 6.9', f.oc ? { v: 'On file', lim: 'On file' } : { st: 'fail', kind: 'dev', lvl: 'L2', v: 'Not on file', lim: 'On file' });
  add('r_resid', 'Property', 'Building life covers the loan', 'Policy 6.10', !f.techIn ? need('the site visit') : f.resid >= f.tenure / 12 ? { v: f.resid + ' years left', lim: 'At least ' + yrsTxt(f.tenure) } : { st: 'fail', kind: 'dev', lvl: 'L2', v: f.resid + ' years left', lim: 'At least ' + yrsTxt(f.tenure) });
  add('r_cersai', 'Property', 'No other charge on the property', 'Policy 6.11', !f.cersaiIn ? need('the CERSAI search') : f.cersai === 'clear' ? { v: 'No charge', lim: 'No charge' } : f.cersai === 'closing' ? { v: 'Existing charge, closed from this loan', lim: 'No charge after disbursement' } : { st: 'fail', kind: 'hard', v: 'Charge to another lender', lim: 'No charge' });
  if (f.uc) add('r_rera', 'Property', 'Project registered under RERA', 'RERA Act, 2016, section 3', !f.reraIn ? need('the RERA check') : f.reraOk ? { v: 'Registered', lim: 'Registered' } : { st: 'fail', kind: 'hard', v: 'Not registered', lim: 'Registered' });
  add('r_fcu', 'Property', 'Fraud control sampling', 'Policy 6.13', !f.fcuIn ? need('fraud control sampling') : f.fcu === 'pos' ? { v: 'Positive', lim: 'Positive' } : f.fcu === 'refer' ? { st: 'fail', kind: 'dev', lvl: 'L3', v: 'Referred', lim: 'Positive' } : { st: 'fail', kind: 'hard', v: 'Negative', lim: 'Positive' });
  if (f.colend) add('r_colend', 'Loan', 'Partner bank approval', 'Co-lending agreement', f.colend === 'approved' ? { v: 'Approved by ' + f.partner, lim: 'Approved' } : need(f.partner));
  add('r_amt', 'Loan', 'Sanction authority for the amount', 'Policy 8.1', { v: lakh(f.loan), lim: amtLvl + ': ' + AUTH[amtLvl].title, info: true });
  const hard = R.filter(r => r.st === 'fail' && r.kind === 'hard'), devs = R.filter(r => r.st === 'fail' && r.kind === 'dev'), refs = R.filter(r => r.st === 'fail' && r.kind === 'ref'), needs = R.filter(r => r.st === 'needs');
  let lvl = amtLvl; devs.concat(refs).forEach(r => { if (RANK[r.lvl] > RANK[lvl]) lvl = r.lvl; });
  const bumped = devs.length + refs.length >= pol.bump && lvl !== 'L4'; if (bumped) lvl = LEVELS[RANK[lvl]];
  const ml = devs.length ? mlOf(f, m) : null;
  const ways = waysOf(f, m, R, pol);
  const ev = { f, m, R, hard, devs, refs, needs, lvl, bumped, amtLvl, ml, ways };
  ev.sys = sysOutcome(ev, pol);
  return ev;
}

/* ---------- deviation model (illustrative logistic score) ---------- */
function mlOf(f, m) {
  const F = [
    { l: 'FOIR over the cap', x: m.foirEx, b: 0.12, r: 2, s: '+' + trimz(m.foirEx.toFixed(1)) + ' pts' },
    { l: 'LTV', x: m.ltv ? Math.max(0, m.ltv - 60) : 10, b: 0.03, r: 10, s: m.ltv ? pctf(m.ltv) : DASH },
    { l: 'Lowest bureau score', x: f.minScore ? 750 - f.minScore : 20, b: 0.012, r: 20, s: f.minScore ? String(f.minScore) : 'none' },
    { l: 'Assessed-income programme', x: f.prog === 'aip' ? 1 : 0, b: 0.30, r: 0.4, s: f.prog === 'aip' ? 'yes' : 'no' },
    { l: 'Declared income above assessed', x: f.incVar > 20 ? 1 : 0, b: 0.25, r: 0.2, s: f.incVar > 20 ? '+' + Math.round(f.incVar) + '%' : 'no' },
    { l: 'Years in job or business', x: Math.min(15, f.yrs), b: -0.04, r: 6, s: f.yrs + ' years' },
    { l: 'Earning co-applicant', x: f.coEarning ? 1 : 0, b: -0.20, r: 0.5, s: f.coEarning ? 'yes' : 'no' },
    { l: 'Bounces in 6 months', x: f.bounces, b: 0.25, r: 0.3, s: String(f.bounces) },
    { l: 'Approved project', x: f.apf ? 1 : 0, b: -0.15, r: 0.3, s: f.apf ? 'yes' : 'no' },
    { l: 'Self-construction', x: f.cat === 'selfcon' || f.cat === 'plotcon' || f.variant === 'selfcon' ? 1 : 0, b: 0.20, r: 0.3, s: f.variant === 'selfcon' || f.variant === 'plotcon' ? 'yes' : 'no' }
  ];
  const b0 = -4.185; let z = b0, zt = b0;
  F.forEach(x => { z += x.b * x.x; zt += x.b * x.r; x.d = x.b * (x.x - x.r); x.mult = Math.exp(x.d); });
  const p = 100 / (1 + Math.exp(-z)), pt = 100 / (1 + Math.exp(-zt));
  const dr = F.filter(x => Math.abs(x.d) > 0.04).sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 6);
  return { p, pt, up: dr.filter(x => x.d > 0), dn: dr.filter(x => x.d < 0) };
}

/* ---------- system outcome when automatic decisioning is on ---------- */


/* ---------- ways forward ---------- */
function waysOf(f, m, R, pol) {
  const W = [], fails = id => R.find(r => r.id === id && r.st === 'fail');
  const cands = []; if (m.maxF != null) cands.push(m.maxF); if (m.maxL != null) cands.push(m.maxL);
  const Lc = cands.length ? Math.min(...cands) : null;
  if ((fails('r_ltv_reg') || fails('r_ltv_pol') || fails('r_foir')) && Lc && Lc < f.loan && Lc >= f.loan * 0.5) {
    const e2 = emiCalc(Lc, f.roi, f.tenure), fo = f.incKnown ? (f.oblig + e2) / f.incElig * 100 : null, lt = f.valUsed ? Lc / f.valUsed * 100 : null;
    W.push({ k: 'loan', t: 'Lower the loan to ' + lakh(Lc), d: 'The customer pays ' + inr(f.loan - Lc) + ' more from own funds. ' + (fo != null ? 'FOIR becomes ' + pctf(fo) : '') + (lt != null ? (fo != null ? ' and LTV ' : 'LTV becomes ') + pctf(lt) : '') + '.', apply: { loan: Lc }, cure: true, key: true });
  }
  if (fails('r_foir') && f.incKnown) {
    const mt = maxTenureOf(f, pol);
    for (let n = Math.ceil((f.tenure + 1) / 12) * 12; n <= mt; n += 12) {
      const fo = (f.oblig + emiCalc(f.loan, f.roi, n)) / f.incElig * 100;
      if (fo <= m.foirCap) { W.push({ k: 'tenure', t: 'Extend the tenure to ' + yrsTxt(n), d: 'FOIR becomes ' + pctf(fo) + '. Age at maturity stays within the limit.', apply: { tenure: n } }); break; }
    }
    f.obl.slice().sort((a, b) => a.emi - b.emi).forEach(o => { const fo = (f.oblig - o.emi + m.emi) / f.incElig * 100; if (fo <= m.foirCap && !W.some(x => x.k === 'close')) W.push({ k: 'close', t: 'Close the ' + lc1(o.t) + ' before disbursement', d: 'Its ' + inr(o.emi) + ' EMI drops out. FOIR becomes ' + pctf(fo) + '. The closure letter becomes a condition.', apply: { close: o.id } }); });
    const need = (f.oblig + m.emi) / (m.foirCap / 100) - f.incElig;
    W.push({ k: 'income', t: 'Add ' + inr(Math.ceil(need / 100) * 100) + ' a month of eligible income', d: 'For example, an earning co-applicant. FOIR then meets the ' + m.foirCap + '% cap.' });
  }
  if (fails('r_age')) { const mt = maxTenureOf(f, pol); if (mt >= 60) W.push({ k: 'tenure', t: 'Shorten the tenure to ' + yrsTxt(mt), d: 'Age at maturity comes within the limit. EMI becomes ' + inr(emiCalc(f.loan, f.roi, mt)) + '.', apply: { tenure: mt } }); }
  return W;
}

/* ---------- full evaluation of a case, with people's decisions ---------- */
function fullEval(c, pol) {
  pol = pol || POL;
  const f = factsOf(c), ev = evalFacts(f, pol);
  ev.c = c; ev.st = statusOf(c, ev);
  return ev;
}

const TONE = { approve: 'ok', approved: 'ok', refer: 'warn', pending: 'warn', returned: 'warn', counter: 'warn', decline: 'err', declined: 'err', incomplete: 'info' };
function byName(by) { return by === 'SYS' ? 'the system' : by && AUTH[by] ? AUTH[by].name : ''; }



/* ---------- strengths, observations and conditions ---------- */
function strengthsOf(c, ev) {
  const f = ev.f, m = ev.m, out = [];
  if (f.bureauIn && f.minScore >= 750 && !f.d30) out.push('Lowest bureau score is ' + f.minScore + ', with no late payments in the last 24 months.');
  if (m.ltv != null && m.ltv <= m.capReg - 10) out.push('LTV is ' + pctf(m.ltv) + ', ' + pts(m.capReg - m.ltv) + ' under the RBI cap.');
  if (m.foir != null && m.foir <= m.foirCap - 15) out.push('FOIR of ' + pctf(m.foir) + ' leaves room if rates rise.');
  if (f.yrs >= 5) out.push(c.apps[0].name.split(' ')[0] + ' has ' + f.yrs + ' years in the same ' + (c.apps[0].emp === 'Salaried' ? 'job' : 'business') + '.');
  if (f.coEarning) out.push('Two earning applicants, so the repayments do not rest on one income.');
  if (f.apf) out.push('The project is approved (' + c.prop.apf.id + '), so its title and plans were checked once for every unit.');
  if (c.bt) out.push(c.bt.paid + ' EMIs paid on time to ' + c.bt.lender + '.');
  if (c.pd && tIn(c, 'pd')) out.push('The shop has run at the same spot for 11 years, confirmed on the visit.');
  if (c.bank.bounces === 0 && f.prog !== 'aip') out.push('No bounces in 12 months of bank data.');
  return out.slice(0, 5);
}
function obsOf(c, ev) {
  const f = ev.f, p = c.prop, out = [];
  if (f.valVar != null) out.push('The two valuations are ' + pctf(f.valVar) + ' apart. The lower one is used.');
  if (f.valUsed && p.guideline) out.push('Government guideline value is ' + lakh(p.guideline) + ', ' + pctf((f.valUsed - p.guideline) / f.valUsed * 100) + ' below the value used. Stamp duty is paid on the higher of the two.');
  if (f.incVar > 20) out.push('Declared income is ' + Math.round(f.incVar) + '% above the assessed figure. The assessed figure is used.');
  if (c.bank.via && c.bank.via.indexOf('PDF') === 0) out.push('The bank is not on the Account Aggregator network, so the statement was read from a PDF.');
  if (c.bank.bounceNote) out.push(c.bank.bounceNote + '.');
  if (c.oblig.some(o => !o.count && o.emi === 0 && o.out)) { const o = c.oblig.find(x => !x.count && x.emi === 0 && x.out); out.push(o.t + ' of ' + inr(o.out) + ' left out of FOIR: ' + lc1(o.why) + '.'); }
  out.push('Stamp duty and registration are not counted in the property cost.');
  return out;
}
function condsOf(c, ev) {
  const p = c.prop, L = [], add = (w, t, d) => L.push({ w, t, d });
  if (c.colend && !tIn(c, 'colend')) add('now', 'Approval from ' + c.colend.partner, 'Partner check pending');
  p.legal.queries.filter(q => !q.ans).forEach(q => add('now', 'Answer the legal query: ' + q.t, q.by));
  if (tIn(c, 'legal')) {
    p.legal.conds.forEach(t => add('cp', t, 'Legal opinion, ' + p.legal.by));
    if (p.legal.lod.length) add('cp', 'Deposit the original documents', listAnd(p.legal.lod.map(lc1)));
  }
  if (c.variant === 'uc') { add('cp', 'Tripartite agreement signed by the builder, the customer and us', 'Approved project ' + p.apf.id); add('cp', 'Proof that the customer\u2019s own share of ' + lakh(Math.max(0, p.agreement - c.v.loan)) + ' is paid', 'Builder receipts'); }
  if (c.variant === 'resale') add('cp', 'Seller\u2019s loan closure and release of the mortgage', c.prop.cersai.st === 'closing' ? 'Part of the loan is paid to the seller\u2019s lender directly' : 'If the seller has a loan');
  if (c.bt) add('cp', 'Foreclosure letter and list of documents from ' + c.bt.lender, c.bt.fcl);
  if (c.variant === 'selfcon') add('cp', 'Building permission and a house plan approved by the gram panchayat', 'Also a legal condition');
  add('cp', 'Mortgage created on the property', c.variant === 'uc' ? 'Equitable mortgage by deposit of the agreement' : 'Deposit of title deeds');
  add('cp', 'Property insurance with our interest noted', 'Customer\u2019s choice of insurer');
  add('cp', 'NACH mandate registered for the EMI', 'From the salary or business account');
  (c.w.extra || []).forEach(x => add(x.w, x.t, x.d));
  if (c.w.dec && c.w.dec.conds) c.w.dec.conds.forEach(t => add('cp', t, 'Added by ' + byName(c.w.dec.by)));
  add('pdd', 'Register our charge with CERSAI within 30 days of the mortgage', 'Operations');
  if (c.variant === 'uc') { add('pdd', 'Registered sale deed after possession', 'Builder and customer'); add('pdd', 'Occupancy certificate within 6 months of possession', 'Builder'); }
  if (c.variant === 'selfcon') add('pdd', 'Site photos and a stage report before each tranche', 'Technical team');
  if (c.topup) add('pdd', 'Renovation bills within 6 months', 'Top-up end use');
  if (c.pmay && pmayOf(c, ev).ok) add('pdd', 'File the PMAY-U 2.0 interest subsidy claim', 'After the first disbursement');
  return L;
}

/* ---------- sanction pack calculations ---------- */
function kfsOf(c, ev) {
  const v = c.v, L = v.loan, n = v.tenure, emi = ev.m.emi, prime = c.seg === 'prime';
  const pf = Math.round(L * (prime ? LENDER.pfPrime : LENDER.pfAff) / 100 * 1.18);
  const lt = (prime ? LENDER.ltPrime : LENDER.ltAff) + (c.prop.vals.length > 1 ? LENDER.val2 : 0);
  const cer = L > 500000 ? 118 : 59;
  const fees = pf + lt + cer, net = L - fees, apr = irrMonthly(net, emi, n) * 1200;
  const r = v.roi / 1200, rows = []; let bal = L;
  for (let k = 1; k <= n; k++) { const it = bal * r, pr = emi - it; bal = Math.max(0, bal - pr); if (k <= 3 || k === n) rows.push({ k, emi, it, pr, bal }); }
  return { L, n, emi, pf, lt, cer, fees, net, apr, totInt: emi * n - L, totPay: emi * n + fees, rows };
}
function tranchesOf(c) {
  const L = c.v.loan, out = [];
  if (c.variant === 'uc' && c.clp) {
    const base = c.prop.agreement, own = Math.max(0, base - L); let dueNow = 0;
    c.clp.stages.forEach(s => { if (s.done) dueNow += base * s.p / 100; });
    let first = Math.max(0, dueNow - own), left = L - first;
    out.push({ t: 'First disbursement', s: 'Stages paid so far: ' + listAnd(c.clp.stages.filter(s => s.done).map(s => lc1(s.t))), amt: first, when: 'After the conditions are met', pay: 'Builder\u2019s RERA collection account' });
    c.clp.stages.filter(s => !s.done).forEach(s => { const a = Math.min(left, base * s.p / 100); left -= a; out.push({ t: s.t, s: s.p + '% of the agreement value', amt: a, when: 'On the builder\u2019s demand, after a stage visit', pay: 'Builder\u2019s RERA collection account' }); });
    return { rows: out, own, note: 'The customer\u2019s own share of ' + lakh(own) + ' is used up first.' };
  }
  if (c.clp && c.clp.selfcon) {
    c.clp.stages.forEach(s => out.push({ t: s.t, s: s.p + '% of the loan', amt: L * s.p / 100, when: 'After a stage visit with photos', pay: 'Customer\u2019s account' }));
    return { rows: out, own: null, note: 'The land is the customer\u2019s own contribution.' };
  }
  if (c.bt) {
    out.push({ t: 'Balance transfer', s: 'Closes the loan with ' + c.bt.lender, amt: c.bt.out, when: 'After the conditions are met', pay: c.bt.lender });
    out.push({ t: 'Top-up', s: c.topup.use, amt: L - c.bt.out, when: 'After the original documents reach us', pay: 'Customer\u2019s account' });
    return { rows: out, own: null, note: '' };
  }
  if (c.variant === 'resale') {
    out.push({ t: 'Single disbursement', s: 'At registration of the sale deed', amt: L, when: 'On the day of registration', pay: c.prop.cersai.st === 'closing' ? 'Split: seller\u2019s lender, then the seller' : 'Seller' });
    return { rows: out, own: null, note: '' };
  }
  out.push({ t: 'Single disbursement', s: '', amt: L, when: 'After the conditions are met', pay: 'Seller' });
  return { rows: out, own: null, note: '' };
}
function pmayOf(c, ev) {
  const f = ev.f, ann = f.incElig * 12, cost = c.prop.agreement ? c.prop.agreement : (f.valUsed || 0), p = c.pmay || {};
  const cat = ann <= 300000 ? 'EWS' : ann <= 600000 ? 'LIG' : ann <= 900000 ? 'MIG' : null;
  const rows = [
    { t: 'Household income up to \u20B99 lakh a year', v: inr(ann) + (cat ? ', ' + cat : ''), ok: ann <= 900000 },
    { t: 'Loan up to \u20B925 lakh', v: lakh(c.v.loan), ok: c.v.loan <= 2500000 },
    { t: 'House value up to \u20B935 lakh', v: lakh(cost), ok: cost <= 3500000 },
    { t: 'Carpet area up to 120 m\u00B2', v: c.prop.carpet + ' m\u00B2', ok: c.prop.carpet <= 120 },
    { t: 'No pucca house owned by the family anywhere in India', v: p.firstHome ? 'Declared, undertaking signed' : 'Not declared', ok: !!p.firstHome },
    { t: 'No housing scheme benefit in the last 20 years', v: p.noScheme ? 'Declared' : 'Not declared', ok: !!p.noScheme },
    { t: 'A woman as owner or co-owner', v: c.apps.some(a => a.sex === 'F' && c.prop.owners.includes(a.id)) ? 'Yes' : 'No', ok: c.apps.some(a => a.sex === 'F' && c.prop.owners.includes(a.id)) },
    { t: 'Property in a PMAY-U 2.0 area', v: c.prop.pmayArea ? 'Yes, notified planning area (technical report)' : 'Not confirmed', ok: !!c.prop.pmayArea },
    { t: 'Aadhaar of all family members', v: p.family ? p.family + ' captured, masked' : 'Not captured', ok: !!p.family }
  ];
  return { rows, ok: rows.every(r => r.ok), cat, ann };
}

/* ---------- policy simulation on past applications ---------- */
let SIM = null;
function simData() {
  if (SIM) return SIM;
  const r = rng(20261116), N = 720, out = [], pick = a => a[Math.floor(r() * a.length)], nrm = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  for (let i = 0; i < N; i++) {
    const seg = r() < 0.6 ? 'prime' : 'affordable';
    const prog = seg === 'prime' ? (r() < 0.75 ? 'salaried' : 'selfdoc') : (r() < 0.7 ? 'aip' : 'salaried');
    const cat = seg === 'prime' ? pick(['apf', 'apf', 'apf', 'builder', 'resale', 'resale', 'resale', 'bt', 'bt']) : pick(['selfcon', 'selfcon', 'selfcon', 'nonstd', 'nonstd', 'resale', 'plotcon']);
    const age = Math.round(26 + r() * 22), emp = prog === 'salaried' ? 'Salaried' : 'Self-employed', maxA = emp === 'Salaried' ? 60 : 65;
    const inc = Math.round(seg === 'prime' ? clamp(115000 * Math.exp(nrm() * 0.45), 30000, 600000) : clamp(30000 * Math.exp(nrm() * 0.35), 12000, 90000));
    const roi = seg === 'prime' ? 9 + r() * 1 : 11 + r() * 1.5, foirT = clamp(52 + nrm() * 9, 20, 75), oblig = Math.round(inc * (0.04 + r() * 0.12));
    let tenure = seg === 'prime' ? pick([240, 300, 360]) : pick([180, 240]); if (r() > 0.06) tenure = Math.min(tenure, Math.max(60, (maxA - age) * 12));
    const loan = Math.round(clamp(loanFor(Math.max(1500, foirT / 100 * inc - oblig), roi, tenure), 300000, 30000000) / 10000) * 10000;
    const ltv = clamp((seg === 'prime' ? 66 : 68) + nrm() * (seg === 'prime' ? 9 : 8), 35, 92), valUsed = loan / ltv * 100;
    const ntc = seg === 'affordable' && r() < 0.15, score = ntc ? null : Math.round(clamp((seg === 'prime' ? 755 : 718) + nrm() * (seg === 'prime' ? 32 : 42), 560, 890));
    const legal = r() < 0.88 ? 'clear' : r() < 0.75 ? 'cond' : 'notclear', neg = r() < 0.015 ? 'barred' : r() < 0.03 ? 'caution' : 'none';
    const f = { seg, prog, cat, variant: cat === 'selfcon' || cat === 'nonstd' ? 'selfcon' : cat, loan, tenure, roi, incKnown: true, incElig: inc, incDecl: inc, oblig, obl: [], earners: [{ name: 'A', age, emp }], yrs: Math.round(2 + r() * 14), coEarning: r() < 0.45, bureauIn: true, minScore: score, d30: r() < 0.05 ? 1 : 0, d90: r() < 0.01, ntcPrimary: ntc, ntcCo: false, kycIn: true, legalIn: true, legal, techIn: true, nVals: loan > 5000000 ? 2 : 1, valUsed, basis: '', valVar: loan > 5000000 ? r() * 12 : null, tech2Task: loan > 5000000, neg, planDev: cat === 'selfcon' || cat === 'nonstd' ? null : Math.round(r() < 0.9 ? r() * 9 : 10 + r() * 14), needOC: cat === 'resale' || cat === 'bt', oc: r() < 0.93, resid: 30 + Math.round(r() * 30), cersaiIn: true, cersai: 'clear', uc: cat === 'apf' || cat === 'builder', reraIn: true, reraOk: true, apf: cat === 'apf', fcuIn: true, fcu: r() < 0.985 ? 'pos' : 'refer', colend: null, partner: '', bounces: r() < 0.2 ? 1 : 0, incVar: prog === 'aip' && r() < 0.3 ? 30 : 0 };
    const pb = mlOf(f, { foirEx: Math.max(0, foirT - 50), ltv }).p;
    out.push({ id: 'P-' + (10400 + i), f, pbad: clamp(pb * (0.7 + r() * 0.6), 0.2, 30) });
  }
  SIM = out; return out;
}
function simRun(pol, auto) {
  const res = { n: 0, within: 0, dev: 0, hard: 0, sysDecided: 0, sysApproved: 0, mlApprove: 0, mlReject: 0, people: 0, approvedBad: 0, approvedN: 0, out: {} };
  simData().forEach(x => {
    const ev = evalFacts(x.f, pol); res.n++;
    let o;
    if (ev.hard.length) { res.hard++; o = 'Hard stop'; }
    else if (!ev.devs.length && !ev.refs.length) { res.within++; o = 'Within policy'; }
    else { res.dev++; o = 'Needs a deviation'; }
    const so = ev.sys;
    if (so.k === 'approved') { res.sysDecided++; res.sysApproved++; if (so.ml === 'approve') res.mlApprove++; }
    else if (so.k === 'decline' && so.model) { res.sysDecided++; res.mlReject++; }
    else if (so.k === 'decline') res.sysDecided++;
    else res.people++;
    if (!ev.hard.length && !(so.k === 'decline' && so.model)) { res.approvedN++; res.approvedBad += x.pbad; }
    res.out[x.id] = { o, ev };
  });
  res.bad = res.approvedN ? res.approvedBad / res.approvedN : 0;
  return res;
}

/* =====================================================================
   Shell: state, audit log, nav, case bar, work basket
   ===================================================================== */
S = { view: 'basket', i: 0, tab: 'decide', role: 'cm', lvl: 'L2', auto: true, theme: 'auto', bf: 'all', bq: '', rf: 'fail', rq: '', open: {}, lang: null, dtab: 'letter', af: 'all', ptab: 'foir', lw: 44, sheet: null, edit: null, reading: null, form: {}, pdraft: null, psim: null, ppend: null };
const ORDER = ['login', 'verify', 'decide', 'sanction', 'closed'];
const who = (t, n, s) => ({ t, n, s });
const L1W = () => who('ppl', AUTH.L1.name, 'L1, ' + AUTH.L1.title);
const meW = () => { const m = meWho(); return who('ppl', m.name, m.sub); };

function log(c, w, cat, txt, det, x) { c.w.log.push(Object.assign({ at: tick(2), w, cat, txt, det: det || '' }, x || {})); }
function sysTaskText(c, t) {
  switch (t.id) {
    case 'kyc': return 'KYC checked for ' + plural(c.apps.length, 'applicant');
    case 'bureau': return 'Credit bureau reports pulled';
    case 'aa': return c.bank.via.indexOf('PDF') === 0 ? 'Bank statement read and analysed' : 'Bank data fetched through the Account Aggregator';
    case 'apf': return 'Project found in the approved project register';
    case 'rera': return 'RERA registration confirmed';
    case 'cersai': return 'CERSAI searched for charges on the property';
    case 'colend': return 'Partner bank approved its share';
  }
  return t.t;
}
function sysTaskDet(c, t) {
  switch (t.id) {
    case 'kyc': return 'PAN checked with the Income Tax database. Aadhaar checked by offline e-KYC and stored masked. CKYC: ' + listAnd(c.apps.map(a => a.name.split(' ')[0] + ', ' + lc1(a.ckyc))) + '.';
    case 'bureau': return listAnd(c.apps.map(a => a.name.split(' ')[0] + ': ' + (a.cibil || 'no credit history'))) + '.';
    case 'aa': return c.bank.acct + '. ' + c.bank.consent + '.';
    case 'apf': return c.prop.apf.id + ', approved until ' + c.prop.apf.valid + '.';
    case 'rera': return c.prop.rera.no + ', valid until ' + c.prop.rera.valid + '.';
    case 'cersai': return c.prop.cersai.t + '.';
    case 'colend': return c.colend.partner + ' takes ' + c.colend.share + '% at ' + c.colend.prate.toFixed(2) + '%. Reference ' + c.colend.ref + '.';
  }
  return '';
}
function taskOutcome(c, t) {
  const p = c.prop;
  switch (t.id) {
    case 'legal': return 'Opinion: ' + { clear: 'clear', cond: 'clear with conditions', notclear: 'not clear' }[p.legal.op] + '. ' + p.legal.note;
    case 'tech': case 'tech2': { const v = p.vals.find(x => x.id === t.id); return 'Value ' + lakh(v.v) + '. ' + v.note + '.'; }
    case 'fi': return 'Positive: residence and place of work confirmed.';
    case 'fcu': return p.fcu.t + '.';
    case 'pd': return 'Assessed household income ' + inr(c.pd.assessed) + ' a month, against ' + inr(c.pd.decl) + ' declared.';
  }
  return '';
}
function seedLog(c) {
  const L = [], add = (at, w, cat, txt, det, x) => L.push(Object.assign({ at, w, cat, txt, det: det || '' }, x || {})), v = c.v;
  add(v.login, who('ppl', v.srcBy, v.src), 'doc', 'Application logged in', v.purpose + ', ' + lakh(v.applied.loan) + ' over ' + yrsTxt(v.applied.tenure) + '.');
  const g = {};
  c.docs.filter(d => d.up && d.up.by !== 'System').forEach(d => { const k = d.up.by + '|' + d.up.at.slice(0, 10); if (!g[k]) g[k] = { at: d.up.at, by: d.up.by, list: [] }; g[k].list.push(d.t); if (d.up.at > g[k].at) g[k].at = d.up.at; });
  Object.values(g).forEach(x => { const cus = x.by.indexOf('Customer') === 0; add(x.at, who(cus ? 'cus' : 'ppl', cus ? c.apps[0].name : x.by, cus ? 'Customer, ' + x.by.split(', ')[1] : 'Sales'), 'doc', cus ? 'Consents given' : 'Uploaded ' + plural(x.list.length, 'document'), listAnd(x.list.map(lc1)) + '.'); });
  c.tasks.forEach(t => {
    if (t.kind === 'sys') { if (t.acc) add(t.acc, who('sys', 'System', t.vendor), 'data', sysTaskText(c, t), sysTaskDet(c, t)); return; }
    if (t.assigned) add(t.assigned, L1W(), 'vendor', t.t + ' assigned to ' + t.vendor, 'Due ' + fdt(t.due) + '.');
    if (t.rem) add(t.rem, L1W(), 'vendor', 'Reminder sent to ' + t.vendor, 'The report was due ' + fdt(t.due) + '.');
    if (t.recv) add(t.recv, who(t.kind === 'ven' ? 'ven' : 'ppl', t.vendor, t.kind === 'ven' ? 'Empanelled vendor' : 'Internal team'), 'vendor', t.t + ': report received', taskOutcome(c, t));
    if (t.acc) add(t.acc, L1W(), 'vendor', t.t + ': report accepted', '');
  });
  if (c.w.dec) { const d = c.w.dec; add(d.at, who('ppl', AUTH[d.by].name, d.by + ', ' + AUTH[d.by].title), 'decision', d.k === 'declined' ? 'Application declined' : 'Application approved', d.note, { dec: true, reasons: d.reasons }); }
  if (c.w.letter) add(c.w.letter.sent, L1W(), 'comms', 'Rejection letter sent in ' + (c.lang === 'hi' ? 'Hindi and English' : 'English') + ', with the reasons', c.w.letter.ch + '.');
  L.sort((a, b) => a.at < b.at ? -1 : a.at > b.at ? 1 : 0);
  return L;
}
function fresh(seed) { const c = deep(seed); c.w = Object.assign({ dec: null, req: null, ovr: null, san: {}, extra: [] }, c.w); c.w.log = seedLog(c); return c; }

function caseName(c) {
  const a = c.apps, sur = a.map(x => x.name.split(' ').slice(-1)[0]);
  if (a.length > 1 && sur.every(s => s === sur[0])) return listAnd(a.map(x => x.name.split(' ')[0])) + ' ' + sur[0];
  return listAnd(a.map(x => x.name));
}
const VAR = { uc: 'Under-construction flat', resale: 'Resale', selfcon: 'Self-construction', plotcon: 'Plot and construction', bt: 'Balance transfer and top-up', ready: 'Ready flat' };

/* ---------- render loop ---------- */


const full = h => `<div class="full" id="full"><div class="content">${h}</div></div>`;
const split = (l, r, f) => `<div class="work" style="--lw:${S.lw}%"><div class="lp" id="lp">${l}</div><div class="vsplit" id="vsplit" role="separator" aria-orientation="vertical" aria-label="Drag to resize the panels" tabindex="0"></div><div class="rp"><div class="rp-scroll" id="rps">${r}</div><div class="rp-foot">${f || ''}</div></div></div>`;
function applyTheme() { const r = document.documentElement; if (S.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', S.theme); }
let toastT;
function toast(t) { const el = $('#toast'); if (!el) return; el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2800); }

/* ---------- nav ---------- */


/* ---------- case bar ---------- */
function stepInfo(c) {
  const at = ORDER.indexOf(c.w.step), st = E.st, ap = st.k === 'approved', dc = st.k === 'declined';
  const ln = c.docs.filter(d => d.need === 'login'), li = ln.filter(d => d.up).length;
  const vt = c.tasks, vi = vt.filter(t => t.st === 'accepted').length;
  const sanDone = !!(c.w.san && c.w.san.handoff) || (dc && !!c.w.letter);
  const S4 = dc ? 'Letter' : 'Sanction';
  const s4sub = dc ? (c.w.letter ? 'Sent ' + fds(c.w.letter.sent) : 'Letter to send') : !ap ? 'After approval' : c.w.san.handoff ? 'With operations' : c.w.san.sent ? 'Sent to the customer' : 'Ready to send';
  const L = [
    { k: 'login', t: 'Login', sub: li + ' of ' + ln.length + ' documents', done: at > 0, dis: false },
    { k: 'verify', t: 'Verification', sub: at < 1 ? 'After login' : vi + ' of ' + vt.length + ' checks in', done: at > 1, dis: at < 1 },
    { k: 'decide', t: 'Decision', sub: at < 2 ? 'After verification' : stLabel(st), done: ap || (at > 2 && !dc), bad: dc || st.k === 'decline', dis: at < 2 },
    { k: 'sanction', t: S4, sub: s4sub, done: sanDone, dis: !(ap || dc) }
  ];
  L.forEach(s => { s.cls = S.tab === s.k ? 'cur' + (s.bad ? ' bad' : '') : s.done ? 'done' : s.bad ? 'bad' : s.dis ? 'todo' : 'ready'; });
  return L;
}


/* ---------- work basket ---------- */
function waitingOn(c, ev) {
  const st = ev.st, step = c.w.step;
  if (step === 'login') { const m = c.docs.filter(d => d.need === 'login' && !d.up); return { t: plural(m.length, 'document') + ' still to come', s: 'Before verification can start' }; }
  if (step === 'verify') {
    const open = c.tasks.filter(t => t.st !== 'accepted');
    const late = open.find(t => t.st === 'assigned' && t.due && wdLate(t.due) > 0);
    if (late) return { t: late.t + ' from ' + late.vendor, s: plural(wdLate(late.due), 'working day') + ' late', late: true };
    const rec = open.find(t => t.st === 'received'); if (rec) return { t: rec.t + ' to review', s: 'Report in' };
    return { t: plural(open.length, 'check') + ' in progress', s: open.map(t => lc1(t.t)).slice(0, 2).join(', ') };
  }
  if (st.k === 'declined') return { t: 'Closed', s: c.w.letter ? 'Rejection letter sent ' + fds(c.w.letter.sent) : 'Letter to send' };
  if (st.k === 'approved') return c.w.san.handoff ? { t: 'With operations for disbursement', s: 'Handed off ' + fds(c.w.san.handoff) } : c.w.san.sent ? { t: 'Customer\u2019s acceptance', s: 'Sanction sent ' + fds(c.w.san.sent) } : { t: 'Sanction letter and KFS to send', s: st.by === 'SYS' ? 'Approved by the system' : 'Approved by ' + byName(st.by) };
  if (st.k === 'pending') return { t: AUTH[st.lvl].name + ', ' + st.lvl, s: 'Approval requested ' + fds(c.w.req.at) };
  if (st.k === 'counter') return { t: 'Credit manager to send the counter-offer', s: 'The system proposes ' + lakh(st.cure.apply.loan) };
  if (st.k === 'decline') return { t: 'Credit manager\u2019s decision', s: ev.hard.length ? lc1(ev.hard[0].name) + ' not met' : 'The model would reject' };
  if (st.k === 'returned') return { t: 'Credit manager, sent back', s: 'By ' + byName(st.by) };
  if (st.k === 'refer') return { t: 'Credit manager to send to ' + st.lvl, s: ev.devs.length + ev.refs.length ? plural(ev.devs.length + ev.refs.length, 'item') + ' need approval' : 'Amount above ' + lakh(POL.auth.L1) };
  if (st.k === 'approve') return { t: 'Credit manager to approve', s: 'Within policy and authority' };
  return { t: 'Data still to come', s: listAnd(ev.needs.map(r => lc1(r.v.replace('Waiting for ', '')))) };
}
function needsMe(c, ev) {
  const st = ev.st;
  if (S.role === 'ap') return st.k === 'pending' && RANK[S.lvl] >= RANK[st.lvl];
  if (S.role !== 'cm') return false;
  if (c.w.step === 'login') return true;
  if (c.w.step === 'verify') return c.tasks.some(t => t.st === 'received' || t.st === 'todo' || (t.st === 'assigned' && t.due && wdLate(t.due) > 0));
  if (st.k === 'approved') return !c.w.san.sent;
  if (st.k === 'declined') return !c.w.letter;
  return ['approve', 'refer', 'decline', 'counter', 'returned'].includes(st.k);
}
function bucket(c, ev) {
  const st = ev.st;
  if (st.k === 'declined' || c.w.san.handoff) return 'done';
  if (st.k === 'pending') return 'appr';
  if (c.w.step === 'verify' && c.tasks.some(t => t.st === 'assigned' || t.st === 'query')) return 'vendor';
  return 'work';
}
function tat(c, ev) {
  const end = c.w.dec && c.w.dec.at ? c.w.dec.at : c.w.san.handoff || S8(CLK);
  const n = wdLate(c.v.login, end) + 1, tgt = c.seg === 'prime' ? 7 : 10;
  return { n, tgt, late: n > tgt && !(ev.st.k === 'declined'), closed: ev.st.k === 'declined' || !!c.w.san.handoff };
}
function basketHTML() {
  const rows = CASES.map((c, i) => ({ c, i, ev: fullEval(c) }));
  rows.forEach(r => { r.me = needsMe(r.c, r.ev); r.b = bucket(r.c, r.ev); });
  const F = [['all', 'All cases', rows.length], ['me', S.role === 'ap' ? 'Waiting for me' : 'Needs me', rows.filter(r => r.me).length], ['vendor', 'Waiting on outside reports', rows.filter(r => r.b === 'vendor').length], ['appr', 'With approvers', rows.filter(r => r.b === 'appr').length], ['done', 'Closed', rows.filter(r => r.b === 'done').length]];
  const q = S.bq.trim().toLowerCase();
  let list = rows.filter(r => S.bf === 'all' ? true : S.bf === 'me' ? r.me : r.b === S.bf);
  if (q) list = list.filter(r => (caseName(r.c) + ' ' + r.c.v.appNo + ' ' + r.c.v.branch).toLowerCase().includes(q));
  list.sort((a, b) => (b.me - a.me) || (ORDER.indexOf(a.c.w.step) - ORDER.indexOf(b.c.w.step)));
  const decided = rows.filter(r => ['approved', 'declined', 'decline', 'counter'].includes(r.ev.st.k) || r.ev.st.k === 'refer' && r.ev.st.by === 'SYS');
  const sysd = rows.filter(r => r.ev.st.by === 'SYS' && ['approved', 'decline', 'counter'].includes(r.ev.st.k)).length;
  const tats = rows.filter(r => r.c.w.sysAt || (r.c.w.dec && r.c.w.dec.at)).map(r => wdLate(r.c.v.login, (r.c.w.dec && r.c.w.dec.at) || r.c.w.sysAt) + 1).sort((a, b) => a - b);
  const med = tats.length ? (tats.length % 2 ? tats[(tats.length - 1) / 2] : (tats[tats.length / 2 - 1] + tats[tats.length / 2]) / 2) : null;
  const vend = rows.filter(r => r.b === 'vendor'), lateN = rows.filter(r => r.c.tasks.some(t => t.st === 'assigned' && t.due && wdLate(t.due) > 0)).length;
  const title = S.role === 'ap' ? 'Approvals for ' + AUTH[S.lvl].name : S.role === 'pol' ? 'Work basket (read only)' : 'Work basket';
  const sub = S.role === 'ap' ? 'Cases referred to you, and cases you can approve at ' + S.lvl + '. Others show for context.' : S.role === 'pol' ? 'Credit policy sees the basket for context. Changes to the policy are made in the policy studio.' : 'Home-loan cases at the central underwriting hub, from login to sanction.';
  const met = (l, v, s) => `<div class="met"><div class="met-l">${l}</div><div class="met-v">${v}</div><div class="met-s">${s}</div></div>`;
  return `<div class="bk-h"><div><h2>${esc(title)}</h2><p>${esc(sub)}</p></div><div class="act"></div></div>
  <div class="kpis">${met('Cases', rows.length, rows.filter(r => r.me).length + (S.role === 'ap' ? ' waiting for you' : ' need you'))}${met('Waiting on outside reports', vend.length, lateN ? plural(lateN, 'report') + ' late' : 'None late')}${met('With approvers', rows.filter(r => r.b === 'appr').length, 'Above the credit manager\u2019s authority')}${met('Decided by the system', S.auto ? sysd + ' <small class="of">of ' + decided.length + '</small>' : 'Off', S.auto ? 'Rules engine and deviation model' : 'Every decision by people')}${met('Login to decision', med != null ? trimz(med.toFixed(1)) + ' <small class="of">days</small>' : DASH, 'Median, working days')}</div>
  <div class="bk"><div class="bk-top">${F.map(([k, l, n]) => `<button class="flt${S.bf === k ? ' on' : ''}" data-act="bf" data-v="${k}">${l} ${n}</button>`).join('')}<input class="srch" id="bq" type="search" placeholder="Search name, application or branch" value="${esc(S.bq)}" aria-label="Search cases"></div>
  <div class="bk-row hd" role="presentation"><span>Applicant</span><span>Loan</span><span>Stage</span><span>Waiting on</span><span>Decision</span><span>Turnaround</span></div>
  ${list.length ? list.map(r => bkRow(r)).join('') : `<div class="bk-empty">No cases match. <button class="lnk" data-act="bf" data-v="all">Show all cases</button></div>`}</div>`;
}
function bkRow(r) {
  const c = r.c, ev = r.ev, w = waitingOn(c, ev), at = ORDER.indexOf(c.w.step), t = tat(c, ev);
  const dots = [0, 1, 2, 3].map(k => `<i class="${ev.st.k === 'declined' && k === 2 ? 'x' : k < at || (k === 3 && c.w.san.handoff) || (k === 2 && ev.st.k === 'approved') ? 'd' : k === Math.min(at, 3) ? 'c' : ''}"></i>`).join('');
  const stageT = { login: 'Login', verify: 'Verification', decide: 'Decision', sanction: 'Sanction', closed: ev.st.k === 'declined' ? 'Closed' : 'Sanctioned' }[c.w.step];
  const by = ev.st.by === 'SYS' ? 'By the system' : ev.st.k === 'approved' || ev.st.k === 'declined' ? 'By ' + byName(ev.st.by) : ev.devs.length + ev.refs.length ? plural(ev.devs.length + ev.refs.length, 'item') + ' for approval' : '';
  return `<button class="bk-row${r.me ? ' mine' : ''}" data-act="open" data-v="${r.i}"><span class="bk-n"><b>${esc(caseName(c))}</b><small>${esc(c.v.appNo)}, ${esc(c.v.branch)}</small></span>
  <span class="bk-l"><b>${esc(lakh(c.v.loan))}</b><small>${esc(VAR[c.variant])}, ${c.seg}</small></span>
  <span class="bk-l"><b>${stageT}</b><span class="mst" aria-hidden="true">${dots}</span></span>
  <span class="bk-w${w.late ? ' late' : ''}">${esc(w.t)}<small>${esc(w.s || '')}</small></span>
  <span class="bk-r">${pill(ev.st)}<small>${esc(by)}</small></span>
  <span class="bk-t${t.late ? ' late' : ''}"><b>${t.closed ? 'Closed' : 'Day ' + t.n}</b>${t.closed ? 'in ' + t.n + ' working days' : 'Target ' + t.tgt + ' working days'}</span></button>`;
}

/* =====================================================================
   Step 1: login and documents
   ===================================================================== */
function chip(src, tip) {
  const M = { ver: ['verified', 'Verified'], doc: ['extracted', 'Doc'], dec: ['', 'Declared'], edit: ['edited', 'Edited'], miss: ['missing', 'Missing'], cal: ['cal', 'Worked out'], ven: ['cal', 'Report'] };
  const m = M[src]; return m ? `<span class="src ${m[0]}"${tip ? ` title="${esc(tip)}"` : ''}>${m[1]}</span>` : '';
}
const hasDoc = (c, id) => { const d = c.docs.find(x => x.id === id); return !!(d && d.up); };
function loginLeft() {
  const c = C(), ds = c.docs, need = ds.filter(d => d.need === 'login'), done = need.filter(d => d.up).length, ro = S.role !== 'cm' || c.w.step !== 'login';
  return `<div class="up-h"><div><h2>Documents</h2><p>${done} of ${need.length} needed to start verification are in</p></div>${!ro && done < need.length ? `<div class="up-act"><button class="btn btn-s btn-sm" data-act="loadall">${ic('upload')}Upload documents</button></div>` : ''}</div>
  <div class="up-bar"><i style="width:${need.length ? done / need.length * 100 : 0}%"></i></div>
  <p class="muted ro">${ro ? (c.w.step === 'login' ? 'The credit manager uploads the documents. They show here as they come in.' : 'Login is complete. Documents due later show when they are needed.') : 'Upload a document and the system reads it and fills in the application on the right.'}</p>
  <div class="cats">${DCAT.map(cat => { const it = ds.filter(d => d.cat === cat); if (!it.length) return ''; const n = it.filter(d => d.up).length; return `<section class="dcat"><header><b>${cat}</b><span>${n} of ${it.length}</span></header>${it.map(d => docRow(c, d, ro)).join('')}</section>`; }).join('')}</div>`;
}
function docRow(c, d, ro) {
  const rd = S.reading === c.id + ':' + d.id;
  const tag = d.need === 'cp' ? '<span class="ntag">Before disbursement</span>' : d.need === 'opt' ? '<span class="ntag">Optional</span>' : '';
  const right = rd ? '<span class="rd-ing"><span class="spin"></span>Reading</span>'
    : d.up ? `<span class="okmark" title="${esc(d.up.f + ', ' + fdt(d.up.at))}">${ic('check')}${d.up.by === 'System' ? 'Fetched' : 'In'}</span>`
      : d.need === 'cp' ? '<span class="muted" style="font-size:12px">At sanction</span>'
        : ro ? '<span class="muted" style="font-size:12px">Not in yet</span>' : `<button class="btn btn-s btn-sm" data-act="docup" data-v="${d.id}">${ic('upload')}Upload</button>`;
  return `<div class="dr${d.up ? ' done' : ''}">${ic('file')}<span class="dr-t">${esc(d.t)}${tag}</span>${right}</div>`;
}
function loginRight() {
  const c = C(), kyc = tIn(c, 'kyc'), p = c.prop;
  const fld = (l, v, src, tip, h) => `<div class="fd"><div class="fd-l">${l}${h ? `<small>${esc(h)}</small>` : ''}</div><div class="fd-v">${v == null ? '<em class="awt">Not in yet</em>' : esc(v)}${chip(src, tip)}</div></div>`;
  const incDocs = a => ['sal_' + a.id, 'itr_' + a.id, 'f16_' + a.id].some(id => hasDoc(c, id)) || (a.id === 'a1' && hasDoc(c, 'biz'));
  const apps = c.apps.map(a => {
    const panDoc = hasDoc(c, 'pan_' + a.id) || hasDoc(c, 'f60_' + a.id), adh = hasDoc(c, 'adh_' + a.id);
    return `<section class="panel"><div class="ph"><h3>${esc(a.name)}</h3><span class="note">${esc(a.role)}${a.rel ? ', ' + esc(lc1(a.rel)) : ''}</span></div><div class="pb"><div class="fgrid one">
    ${fld('Name', a.name, panDoc && kyc ? 'ver' : 'dec', panDoc && kyc ? 'Matches the Income Tax database' : 'From the application')}
    ${fld(a.pan.indexOf('Form') >= 0 ? 'PAN or Form 60' : 'PAN', panDoc ? a.pan : null, panDoc ? (kyc ? 'ver' : 'doc') : 'miss', kyc ? 'Checked with the Income Tax database' : '')}
    ${fld('Aadhaar', adh ? a.aadhaar : null, adh ? (kyc ? 'ver' : 'doc') : 'miss', 'Offline e-KYC. Stored with the first 8 digits masked')}
    ${fld('Address', a.addr, adh && kyc ? 'ver' : 'dec', adh && kyc ? 'From Aadhaar e-KYC' : 'From the application')}
    ${fld('Work', a.occ + (a.org && a.org !== a.occ ? ', ' + a.org : ''), incDocs(a) ? 'doc' : 'dec', '', a.yrs ? a.yrs + ' years' : '')}
    ${fld('Income declared', a.incDecl ? inr(a.incDecl) + ' a month' : 'None', 'dec', 'From the application')}
    ${fld('Mobile', a.mobile, 'ver', 'Checked by OTP at login')}</div></div></section>`;
  }).join('');
  const titleDoc = ['afs', 'ats', 'patta', 'btsan', 'deeds'].some(id => hasDoc(c, id)), valDoc = ['afs', 'ats', 'est', 'btsan'].some(id => hasDoc(c, id));
  const cost = p.agreement ? inr(p.agreement) + (c.variant === 'plotcon' ? ' plot' : '') : p.est ? inr(p.est) + ' construction estimate' : c.bt ? inr(c.bt.out) + ' outstanding with ' + c.bt.lender : null;
  const consD = c.docs.find(d => d.id === 'cons');
  const LK = c.lead && c.lead.consent, cw = consD && consD.up ? fdt(consD.up.at) + ', ' + lc1(consD.up.by.replace('Customer, ', '')) : '', lw = LK ? fdt(LK.at) + ', ' + LK.ch + ' at the lead stage' : '';
  const cons = consD && consD.up ? [['Credit bureau check', 'Given', cw], ['Bank data through the Account Aggregator or a statement', 'Given', cw], ['Privacy notice, version 3.2' + (c.lang === 'hi' ? ', shown in Hindi' : ''), 'Acknowledged', cw], ['Calls and messages about this application', 'Given', cw]]
    : LK ? [['Credit report pull, shows as an enquiry', 'Given', lw], ['12 months of bank data, Account Aggregator', 'Given', lw], ['Privacy notice, version 3.2', 'Acknowledged', lw]] : [];
  if (LK && LK.wa) cons.push(['Updates on WhatsApp, can be stopped any time', 'Opted in', lw]);
  return `<div class="pf-h"><div><h2>Application</h2><p>${S.role === 'cm' && c.w.step === 'login' ? 'Fills in as documents are read. Every value shows where it came from.' : 'As captured at login.'}</p></div></div>
  <div class="stack">${apps}
  <section class="panel"><div class="ph"><h3>Property</h3><span class="note">${esc(VAR[c.variant])}</span></div><div class="pb"><div class="fgrid one">
    ${fld('Address', p.addr, titleDoc ? 'doc' : 'dec')}${fld('Owners', listAnd(p.owners.map(id => c.apps.find(a => a.id === id).name)), titleDoc ? 'doc' : 'dec')}
    ${fld(c.bt ? 'Loan to transfer' : 'Cost', cost, valDoc ? 'doc' : 'dec')}${fld('Area', p.area, titleDoc ? 'doc' : 'dec')}</div></div></section>
  <section class="panel"><div class="ph"><h3>Loan asked for</h3></div><div class="pb"><div class="fgrid one">${fld('Amount', lakh(c.v.applied.loan), 'dec')}${fld('Tenure', yrsTxt(c.v.applied.tenure), 'dec')}${fld('Purpose', c.v.purpose, 'dec')}</div></div></section>
  <section class="panel"><div class="ph"><h3>KYC and dedupe</h3><span class="note">${kyc ? 'Checked ' + fdt(task(c, 'kyc').acc) : 'Runs when the KYC documents are in'}</span></div><div class="pb">${kyc ? `<table class="tbl"><tbody>${c.apps.map(a => `<tr><td><b>${esc(a.name)}</b></td><td>PAN ${a.pan.indexOf('Form') >= 0 ? 'not held: Form 60' : 'verified'}. Aadhaar e-KYC done. CKYC: ${esc(lc1(a.ckyc))}.</td></tr>`).join('')}<tr><td><b>Dedupe</b></td><td>No match in customer records, the negative list or the wilful defaulter list.</td></tr></tbody></table>` : '<p class="muted" style="margin:4px 0">Not run yet.</p>'}</div></section>
  <section class="panel"><div class="ph"><h3>Consent record</h3><span class="note">Needed under the DPDP Act and RBI digital lending rules</span></div><div class="pb">${cons.length ? `<table class="tbl"><thead><tr><th>Purpose</th><th>Status</th><th>When and how</th></tr></thead><tbody>${cons.map(([t, s, w]) => `<tr><td>${esc(t)}</td><td><span class="st pass">${s}</span></td><td class="muted">${esc(w)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted" style="margin:4px 0">No consent recorded yet.</p>'}</div></section></div>`;
}
function loginFoot() {
  const c = C(), need = c.docs.filter(d => d.need === 'login'), miss = need.filter(d => !d.up);
  if (c.w.step !== 'login') return `<div class="gate"><b>Login complete</b><span>All ${need.length} documents needed to start verification are in.</span></div><button class="btn btn-s" data-act="tab" data-v="verify">See verification</button>`;
  const txt = miss.length ? `<b>${need.length - miss.length} of ${need.length} documents needed to start verification are in</b><span>Still needed: ${esc(listAnd(miss.map(d => lc1(d.t))))}.</span>` : `<b>Everything needed to start verification is in.</b><span>Starting assigns the legal, valuation and field checks to the panel vendors.</span>`;
  return `<div class="gate">${txt}</div>${S.role === 'cm' ? `<button class="btn btn-p btn-lg" data-act="startverify"${miss.length ? ' disabled' : ''}>Start verification</button>` : '<span class="muted">The credit manager starts verification.</span>'}`;
}

/* =====================================================================
   Step 2: verification, two tracks that meet at the decision
   ===================================================================== */
function tState(t) { if (t.st === 'assigned' && t.due && wdLate(t.due) > 0) return 'late'; return t.st; }
const TST = { todo: 'Not started', assigned: 'With the vendor', late: 'Late', received: 'Report in', accepted: 'Accepted', query: 'Query raised' };
function tChip(t) { const s = tState(t); return `<span class="tst ${s}">${s === 'late' ? plural(wdLate(t.due), 'working day') + ' late' : s === 'assigned' && t.kind === 'int' ? 'In progress' : TST[s]}</span>`; }
function trackHead(title, sub, T) {
  const dot = t => { const s = tState(t); return `<i class="tdot ${{ accepted: 'd', received: 'r', assigned: 'w', late: 'l', query: 'q' }[s] || ''}" title="${esc(t.t + ': ' + (TST[s] || ''))}"></i>`; };
  return `<div class="trk"><div><h2>${title}</h2><p>${sub}</p></div><div class="tps" aria-label="${T.filter(t => t.st === 'accepted').length} of ${T.length} checks accepted">${T.map(dot).join('')}</div></div>`;
}
function taskCard(c, t, title, body, extraFoot) {
  if (!t) return '';
  const ro = S.role !== 'cm', s = tState(t), inRep = t.st === 'received' || t.st === 'accepted' || t.st === 'query';
  let foot = '';
  if (t.st === 'accepted') foot = `<span class="sla2">${t.kind === 'sys' ? 'Done automatically, ' + fdt(t.acc) : 'Accepted by ' + AUTH.L1.name + ', ' + fdt(t.acc)}</span>`;
  else if (t.st === 'received') foot = `<span class="sla2">Report in ${fdt(t.recv)}${t.due ? ', due ' + fdt(t.due) : ''}</span>${ro ? '' : `<button class="btn btn-s btn-sm" data-act="tkquery" data-v="${t.id}">Raise a query</button><button class="btn btn-ok btn-sm" data-act="tkacc" data-v="${t.id}">${ic('check')}Accept the report</button>`}`;
  else if (t.st === 'query') foot = `<span class="sla2">Query raised ${t.q ? fdt(t.q.at) : ''}</span><span class="sla2">Waiting for the vendor’s answer</span>`;
  else if (t.st === 'assigned') foot = `<span class="sla2${s === 'late' ? ' late' : ''}">Assigned ${fdt(t.assigned)}. <b>Due ${fdt(t.due)}${s === 'late' ? ', ' + plural(wdLate(t.due), 'working day') + ' late' : ''}</b>${t.rem ? '. Reminder sent ' + fds(t.rem) : ''}</span>${ro ? '' : `${t.kind === 'ven' ? `<button class="btn btn-s btn-sm" data-act="tkrem" data-v="${t.id}">${ic('bell')}Send a reminder</button><button class="btn btn-s btn-sm" data-act="tkreas" data-v="${t.id}">${ic('swap')}Reassign</button>` : ''}${t.id === 'pd' ? '<button class="btn btn-s btn-sm" data-act="tkrecv" data-v="pd">Record the personal discussion</button>' : ''}`}`;
  else foot = c.w.step === 'login' ? '<span class="sla2">Not started yet</span>' : t.id === 'pd' && !ro ? `<span class="sla2">The credit officer visits the shop and the home</span><button class="btn btn-s btn-sm" data-act="tkrecv" data-v="pd">Record the personal discussion</button>` : '<span class="sla2">Not started</span>';
  const who = t.kind === 'sys' ? t.vendor : t.kind === 'int' ? t.vendor : 'Vendor: ' + t.vendor;
  return `<section class="tk" id="tk-${t.id}"><div class="tk-h"><h3>${esc(title || t.t)}</h3><span class="wh">${esc(who)}</span>${tChip(t)}</div><div class="tk-b">${inRep ? body : `<div class="tk-wait">${ic('clock')}<span>${t.st === 'todo' ? 'Not started yet.' : 'Waiting for the report. Nothing here is used in the decision until it is in and accepted.'}</span></div>`}${extraFoot || ''}</div><div class="tk-f">${foot}</div></section>`;
}
function verifyLeft() {
  const c = C(), T = c.tasks.filter(t => t.track === 'inc');
  return trackHead('Income and identity', 'Who the applicants are, what they earn and what they already owe.', T)
    + taskCard(c, task(c, 'kyc'), 'KYC and dedupe', `<p class="muted" style="margin:0">${esc(sysTaskDet(c, task(c, 'kyc')))} No match in dedupe or negative lists.</p>`)
    + bureauCard(c) + incomeCard(c) + bankCard(c)
    + (task(c, 'fi') ? taskCard(c, task(c, 'fi'), 'Residence and office visit', `<div class="okline">${ic('check')}<div>Residence and place of work confirmed. Neighbour and employer references checked.</div></div>`) : '')
    + taskCard(c, task(c, 'fcu'), 'Fraud control sampling', `<div class="okline">${ic('check')}<div>${esc(c.prop.fcu.t)}.</div></div>`);
}

function bureauCard(c) {
  const t = task(c, 'bureau'), ed = S.role === 'cm' && ['login', 'verify', 'decide'].includes(c.w.step) && !c.w.dec && !(c.w.req && c.w.req.k === 'pending');
  const body = `${c.apps.map(a => `<div class="acc"><div class="acc-t"><b>${esc(a.name)}</b><span>${a.cibil ? 'CIBIL ' + a.cibil : 'No credit history'}${a.cibil ? ', ' + a.accts + ' accounts, ' + a.enq6 + ' enquiries in 6 months' : ''}</span></div>${dpdStrip(a.dpd)}</div>`).join('')}
  <div class="legend"><span><i style="background:var(--ok-fill);opacity:.55"></i>On time</span><span><i style="background:var(--warn-fill);opacity:.6"></i>1 to 29 days late</span><span><i style="background:var(--warn-fill)"></i>30+ days late</span></div>
  <h4 style="margin:14px 0 2px;font-size:13px;font-weight:800">Loans that count in FOIR</h4>
  ${c.oblig.map(o => `<label class="obl${o.count ? '' : ' off'}"><input type="checkbox" data-act="oblig" data-v="${o.id}"${o.count ? ' checked' : ''}${ed ? '' : ' disabled'}><span><b>${esc(o.t)}</b><small>${esc(o.lender)}, ${inr(o.out)} outstanding${o.left ? ', ' + o.left + ' months left' : ''}${o.why ? '. ' + esc(o.why) : ''}</small></span><span class="amt">${o.emi ? inr(o.emi) : 'No EMI'}</span></label>`).join('')}
  <p class="hint">${ed ? 'Untick a loan to leave it out of FOIR. The change and its reason go into the audit trail.' : 'Read only.'}</p>`;
  return taskCard(c, t, 'Credit bureau', body);
}
function incomeCard(c) {
  if (c.prog === 'aip') return pdCard(c);
  const t = task(c, 'aa');
  const body = `<table class="tbl"><thead><tr><th>Applicant</th><th>Employer or business</th><th class="r">Monthly income</th><th></th></tr></thead><tbody>${c.apps.map(a => `<tr><td><b>${esc(a.name.split(' ')[0])}</b><br><span class="muted">${esc(a.emp)}${a.yrs ? ', ' + a.yrs + ' years' : ''}</span></td><td>${esc(a.org || DASH)}${a.orgCat ? `<br><span class="muted">Employer category ${a.orgCat}</span>` : ''}</td><td class="r"><b>${a.earning ? inr(a.inc) : 'Not counted'}</b></td><td class="r">${a.earning ? chip(a.emp === 'Salaried' ? 'ver' : 'doc', a.incSrc) : ''}</td></tr>`).join('')}<tr><td colspan="2"><b>Eligible household income</b></td><td class="r"><b>${inr(sum(c.apps.filter(a => a.earning), a => a.inc))}</b></td><td></td></tr></tbody></table>
  <p class="calc">Salary matched to bank credits for every month. Variable pay and reimbursements are left out.</p>`;
  return taskCard(c, t, 'Income', body);
}
function pdPhoto(k) {
  const sky = 'var(--brand-soft)', b = 'var(--brand)', l = 'var(--brand-line)', g = 'var(--surface-3)';
  const P = {
    shop: `<rect width="160" height="110" fill="${sky}"/><rect x="18" y="38" width="124" height="62" fill="var(--surface)"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${18 + i * 15.5}" y="26" width="15.5" height="16" fill="${i % 2 ? 'var(--surface)' : b}"/>`).join('')}<rect x="30" y="56" width="100" height="44" fill="${g}"/><rect x="36" y="62" width="20" height="10" fill="${l}"/><rect x="62" y="62" width="20" height="10" fill="${l}"/><rect x="88" y="62" width="20" height="10" fill="${l}"/><rect x="36" y="78" width="88" height="22" fill="${l}"/>`,
    stock: `<rect width="160" height="110" fill="${g}"/>${[22, 50, 78].map(y => `<rect x="14" y="${y}" width="132" height="4" fill="${b}"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${18 + i * 21}" y="${y - 16}" width="16" height="16" rx="2" fill="${i % 2 ? l : 'var(--surface)'}"/>`).join('')).join('')}<rect x="14" y="98" width="132" height="4" fill="${b}"/>`,
    home: `<rect width="160" height="110" fill="${sky}"/><path d="M40 52 80 24l40 28v48H40z" fill="var(--surface)"/><path d="M34 54 80 20l46 34" fill="none" stroke="${b}" stroke-width="5"/><rect x="72" y="70" width="16" height="30" fill="${b}"/><rect x="48" y="62" width="14" height="12" fill="${l}"/><rect x="98" y="62" width="14" height="12" fill="${l}"/><rect y="100" width="160" height="10" fill="${g}"/>`,
    plot: `<rect width="160" height="110" fill="${sky}"/><rect y="62" width="160" height="48" fill="${g}"/><rect x="40" y="70" width="80" height="30" fill="none" stroke="${b}" stroke-width="2.5" stroke-dasharray="6 4"/><path d="M40 66v8M120 66v8M40 96v8M120 96v8" stroke="${b}" stroke-width="3"/><rect x="128" y="40" width="3" height="30" fill="${b}"/><path d="M131 41h16l-4 5 4 5h-16z" fill="${b}"/>`
  };
  return `<svg viewBox="0 0 160 110" role="img" aria-label="${k}">${P[k]}</svg>`;
}
function pdCard(c) {
  const t = task(c, 'pd'), pd = c.pd;
  const body = `<div class="ltv-top"><div><div class="ins-k">Declared</div><div class="big"><b style="color:var(--ink-3);text-decoration:line-through;text-decoration-thickness:2px">${inr(pd.decl)}</b><span>a month</span></div></div><div><div class="ins-k">Assessed and used</div><div class="big"><b>${inr(pd.assessed)}</b><span>a month <span class="var">${Math.round((pd.decl - pd.assessed) / pd.decl * 100)}% lower</span></span></div></div></div>
  <table class="tbl ws"><thead><tr><th>Item</th><th class="r">Declared</th><th class="r">Assessed</th></tr></thead><tbody>
  <tr class="sub"><td colspan="3">Shop sales: ${inr(pd.sales.daily)} a day, ${inr(pd.sales.monthly)} a month. ${esc(pd.sales.ev)}.</td></tr>
  ${pd.rows.map(r => `<tr${r.sub ? ' class="tot"' : ''}><td${r.sub ? '' : ' class="h"'}>${esc(r.t)}${r.s ? `<br><span class="muted">${esc(r.s)}</span>` : ''}</td><td class="r">${r.decl != null ? inr(r.decl) : r.sub ? inr(pd.declShop) : ''}</td><td class="r">${r.asd < 0 ? MINUS + inr(-r.asd) : inr(r.asd)}</td></tr>`).join('')}
  <tr class="tot"><td>Household income</td><td class="r">${inr(pd.decl)}</td><td class="r">${inr(pd.assessed)}</td></tr></tbody></table>
  <div class="two" style="margin-top:12px"><div class="fr"><span>Household</span><b>${pd.hh.members} people</b></div><div class="fr"><span>Living costs</span><b>${inr(pd.hh.exp)} a month</b></div><div class="fr"><span>Left before any EMI</span><b>${inr(pd.assessed - pd.hh.exp)}</b></div><div class="fr"><span>Sales banked</span><b>About half</b></div></div>
  <h4 style="margin:14px 0 4px;font-size:13px;font-weight:800">Notes from the visit</h4><ul style="margin:0;padding-left:18px;color:var(--ink-2);font-size:12.5px">${pd.notes.map(n => `<li style="margin:3px 0">${esc(n)}</li>`).join('')}</ul>
  <div class="pgal">${pd.photos.map(ph => `<div class="pgi">${pdPhoto(ph.k)}<div><b>${esc(ph.t)}</b>${t.recv ? fds(t.recv) + ', ' : ''}${ph.at}<br>${esc(pd.geo)}</div></div>`).join('')}</div>`;
  return taskCard(c, t, 'Income: personal discussion', body);
}
function bankChart(b) {
  const W = 600, H = 200, L = 56, R = 10, T = 12, B = 28, n = b.months.length, mx = Math.max(...b.credits, ...b.debits, ...b.bal) * 1.1;
  const step = mx > 300000 ? 100000 : mx > 150000 ? 50000 : mx > 60000 ? 25000 : 10000, top = Math.ceil(mx / step) * step;
  const y = v => T + (H - T - B) * (1 - v / top), cw = (W - L - R) / n, bw = Math.min(16, cw / 4);
  let g = ''; for (let v = 0; v <= top; v += step) g += `<line class="bc-g" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="bc-t" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v ? lakhS(v).replace(RS, '') : '0'}</text>`;
  let bars = '', pl = '', dots = '';
  b.months.forEach((mo, i) => { const cx = L + cw * i + cw / 2; bars += `<rect class="bc-cr" x="${cx - bw - 1.5}" y="${y(b.credits[i])}" width="${bw}" height="${y(0) - y(b.credits[i])}" rx="2"><title>${mo}: credits ${inr(b.credits[i])}</title></rect><rect class="bc-db" x="${cx + 1.5}" y="${y(b.debits[i])}" width="${bw}" height="${y(0) - y(b.debits[i])}" rx="2"><title>${mo}: debits ${inr(b.debits[i])}</title></rect><text class="bc-t" x="${cx}" y="${H - 8}" text-anchor="middle">${mo}</text>`; pl += `${cx},${y(b.bal[i])} `; dots += `<circle class="bc-dot" cx="${cx}" cy="${y(b.bal[i])}" r="3.5"><title>${mo}: average balance ${inr(b.bal[i])}</title></circle>`; });
  return `<svg class="bchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Monthly credits, debits and average balance">${g}${bars}<polyline class="bc-bal" points="${pl.trim()}"/>${dots}</svg>`;
}
function bankCard(c) {
  const t = task(c, 'aa'), b = c.bank;
  const body = `<p class="muted" style="margin:0 0 6px;font-size:12px">${esc(b.acct)}. ${esc(b.via)}.</p>${bankChart(b)}<div class="legend"><span><i style="background:var(--brand)"></i>Credits</span><span><i style="background:var(--ink-4)"></i>Debits</span><span><i style="background:var(--ok-fill)"></i>Average balance</span></div>
  <div class="fgrid one" style="margin-top:8px"><div class="fr"><span>Pattern</span><b>${esc(b.salary)}</b></div><div class="fr"><span>Average balance, 6 months</span><b>${inr(sum(b.bal) / b.bal.length)}</b></div><div class="fr"><span>Bounces, 6 months</span><b>${b.bounces}</b></div></div>`;
  return taskCard(c, t, 'Bank statement', body);
}
function verifyRight() {
  const c = C(), T = c.tasks.filter(t => t.track === 'prop'), ev = E;
  return trackHead('Property', 'Whether the title is good, what the property is worth, and whether anything stands in the way.', T)
    + propCard(c) + (c.prop.apf ? apfCard(c) : '') + legalCard(c)
    + c.tasks.filter(t => t.id === 'tech' || t.id === 'tech2').map(t => valCard(c, t)).join('')
    + valueUsedCard(c, ev) + checksCard(c) + (c.colend ? colendCard(c) : '');
}
function propCard(c) {
  const p = c.prop, own = p.owners.map(id => c.apps.find(a => a.id === id).name);
  return `<section class="panel" style="margin-bottom:12px"><div class="ph"><h3>${esc(p.kind)}</h3><span class="note">${esc(VAR[c.variant])}, ${esc(lc1(CATS[c.cat]))}</span></div><div class="pb"><p style="margin:0 0 8px;font-weight:700">${ic('pin')} ${esc(p.addr)}</p><div class="fgrid">
  <div class="fr"><span>Area</span><b>${esc(p.area)}</b></div><div class="fr"><span>Owners</span><b>${esc(listAnd(own))}</b></div>
  ${p.builder ? `<div class="fr"><span>Builder and project</span><b>${esc(p.builder)}, ${esc(p.project)}</b></div>` : ''}${p.agreement ? `<div class="fr"><span>${c.variant === 'plotcon' ? 'Plot price' : 'Agreement value'}</span><b>${inr(p.agreement)}</b></div>` : ''}
  ${p.est ? `<div class="fr"><span>Construction estimate</span><b>${inr(p.est)}</b></div>` : ''}<div class="fr"><span>Stage</span><b>${esc(p.stageText)}</b></div></div>
  <div class="okline" style="margin-top:8px">${ic('check')}<div>Every owner is on the loan as an applicant.</div></div></div></section>`;
}
function apfCard(c) {
  const a = c.prop.apf, t = task(c, 'apf'), used = a.used / a.limit * 100;
  const body = `<div class="fgrid"><div class="fr"><span>Approval</span><b>${esc(a.id)}, valid to ${esc(a.valid)}</b></div><div class="fr"><span>Units financed</span><b>${a.financed} of ${a.units}</b></div><div class="fr"><span>Project legal</span><b>${esc(a.legal)}</b></div><div class="fr"><span>Project technical</span><b>${esc(a.tech)}</b></div></div>
  <div class="wi-row" style="grid-template-columns:150px minmax(0,1fr) 140px;margin-top:6px"><span class="wi-l">Project exposure</span><div class="lbar" style="margin:0"><i style="width:${used}%"></i></div><span class="wi-v" style="font-size:12.5px">${lakhS(a.used)} of ${lakhS(a.limit)}</span></div>
  <div class="okline" style="margin-top:6px">${ic('check')}<div>Unit B-1204 has not been financed before. Only unit-level checks are needed.</div></div>`;
  return taskCard(c, t, 'Approved project', body);
}
function legalCard(c) {
  const t = task(c, 'legal'), L = c.prop.legal;
  const op = { clear: ['ok', 'Clear'], cond: ['warn', 'Clear with conditions'], notclear: ['err', 'Not clear'] }[L.op];
  const body = `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px"><span class="dpill ${op[0]}">${op[1]}</span><span class="muted" style="font-size:12.5px">${esc(L.note)}</span></div>
  <div class="ins-k" style="margin-top:10px">Chain of title</div>
  <div class="cot">${L.chain.map(x => `<div class="cot-n ${x.cls || ''}"><i></i><b>${esc(x.y)}</b><span>${esc(x.t)}</span><small>${esc(x.p)}${x.n ? '. ' + esc(x.n) : ''}</small></div>`).join('')}</div>
  ${L.conds.length ? `<div class="ins-k" style="margin-top:8px">Conditions set by the advocate</div>${L.conds.map(x => `<div class="cgi">${ic('flag')}<div><b>${esc(x)}</b><small>Before the first disbursement</small></div><span class="when cp">Before disbursement</span></div>`).join('')}` : ''}
  ${L.lod.length ? `<div class="ins-k" style="margin-top:10px">Original documents to collect</div><ul style="margin:4px 0 0;padding-left:18px;font-size:12.5px;color:var(--ink-2)">${L.lod.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
  ${L.queries.length ? `<div class="ins-k" style="margin-top:10px">Queries</div>${L.queries.map(q => `<div class="qt"><b>${esc(fdt(q.at))}:</b> ${esc(q.t)}${q.ans ? `<br><span class="muted">Answer: ${esc(q.ans)}</span>` : ''}</div>`).join('')}` : ''}`;
  return taskCard(c, t, 'Legal opinion', body);
}
function valCard(c, t) {
  const v = c.prop.vals.find(x => x.id === t.id), p = c.prop;
  const body = `<div class="fgrid"><div class="fr"><span>${v.land ? 'Total value' : 'Market value'}</span><b>${inr(v.v)}</b></div>${v.land ? `<div class="fr"><span>Land</span><b>${inr(v.land)}</b></div><div class="fr"><span>Construction</span><b>${inr(v.constr)}</b></div>` : ''}<div class="fr"><span>Guideline value</span><b>${inr(p.guideline)}</b></div>
  <div class="fr"><span>Stage of construction</span><b>${p.stage}%</b></div>${p.planDev != null ? `<div class="fr"><span>Deviation from the approved plan</span><b>${p.planDev}%</b></div>` : ''}<div class="fr"><span>Building life left</span><b>${p.resid} years</b></div><div class="fr"><span>Negative area</span><b>${p.neg === 'none' ? 'No' : p.neg === 'barred' ? 'Barred: ' + esc(p.negNote) : 'Caution'}</b></div></div><p class="hint">${esc(v.note)}.</p>`;
  return taskCard(c, t, t.id === 'tech2' ? 'Valuation 2' : (task(c, 'tech2') ? 'Valuation 1' : 'Valuation'), body);
}
function valueUsedCard(c, ev) {
  const f = ev.f, p = c.prop, m = ev.m;
  if (!f.valUsed) return '';
  let rows = [];
  const accepted = p.vals.filter(x => tIn(c, x.id));
  if (c.variant === 'selfcon' || c.variant === 'plotcon') {
    const v = accepted[0], landUse = p.agreement ? Math.min(p.agreement, v.land) : v.land, conUse = Math.min(p.est || Infinity, v.constr);
    rows = [{ l: 'Land', s: p.agreement ? 'Lower of price and valuation' : 'Valuer', v: landUse, use: true }, { l: 'Construction', s: 'Engineer\u2019s estimate', v: p.est, use: p.est === conUse }, { l: 'Construction', s: 'Valuer\u2019s estimate', v: v.constr, use: v.constr === conUse && p.est !== conUse }];
  } else {
    if (p.agreement) rows.push({ l: c.variant === 'resale' ? 'Agreement to sell' : 'Agreement value', s: 'What the customer pays', v: p.agreement });
    accepted.forEach((v, i) => rows.push({ l: accepted.length > 1 ? 'Valuation ' + (i + 1) : 'Valuation', s: v.by, v: v.v }));
    const mn = Math.min(...rows.map(r => r.v)); let marked = false; rows.forEach(r => { if (!marked && r.v === mn) { r.use = true; marked = true; } });
  }
  rows.push({ l: 'Guideline value', s: 'For stamp duty only', v: p.guideline, ref: true });
  const mx = Math.max(...rows.map(r => r.v || 0));
  const capP = m.capPol, capR = m.capReg, ltv = m.ltv, over = ltv > Math.min(capP, capR) + 1e-9;
  const ticks = capP === capR ? [{ x: capR, t: 'RBI and policy cap ' + capR + '%', reg: true }] : [{ x: capP, t: 'Policy ' + capP + '%' }, { x: capR, t: 'RBI ' + capR + '%', reg: true }];
  const scale = x => clamp(x, 0, 100);
  return `<section class="panel" style="margin-bottom:12px"><div class="ph"><h3>Value used for LTV</h3><span class="note">${esc(cap1(f.basis))}</span></div><div class="pb">
  <div class="vb">${rows.map(r => `<div class="vb-r${r.use ? ' use' : ''}${r.ref ? ' ref' : ''}"><span>${esc(r.l)}${r.use ? '<span class="usetag">Used</span>' : ''}<small>${esc(r.s)}</small></span><div class="vb-t"><i style="width:${(r.v || 0) / mx * 100}%"></i></div><b>${lakh(r.v)}</b></div>`).join('')}</div>
  <div class="fr" style="margin-top:8px;font-size:13px"><span>Value used</span><b style="color:var(--brand-ink)">${inr(f.valUsed)}</b></div>
  <div class="ruler-w"><div class="ins-k">Loan as a share of that value</div>
  <div class="ruler"><span class="ok" style="width:${scale(Math.min(capP, capR))}%"></span><span class="fill${over ? ' over' : ''}" style="width:${scale(ltv)}%"></span>${ticks.map(t => `<span class="tk2${t.reg ? ' reg' : ''}" style="left:calc(${scale(t.x)}% - 1px)"><b>${t.t}</b></span>`).join('')}<span class="pin${over ? ' over' : ''}" style="left:${scale(ltv)}%">Loan ${pctf(ltv)}</span><span class="z" style="left:0">0%</span><span class="z" style="right:0">100%</span></div>
  <div class="fr"><span>Most the caps allow on this value</span><b>${lakh(m.maxL)}</b></div><div class="fr"><span>Loan asked for</span><b${over ? ' style="color:var(--err)"' : ''}>${lakh(f.loan)}</b></div></div></div></section>`;
}
function checksCard(c) {
  const p = c.prop, rows = [];
  const tc = task(c, 'cersai'); rows.push(['CERSAI search', tc.st === 'accepted' ? p.cersai.t : 'Not run yet', tc.st === 'accepted' ? (p.cersai.st === 'charge' ? 'fail' : 'pass') : 'needs']);
  if (task(c, 'rera')) rows.push(['RERA registration', tIn(c, 'rera') ? p.rera.no + ', valid to ' + p.rera.valid : 'Not checked yet', tIn(c, 'rera') ? 'pass' : 'needs']);
  if (['resale', 'ready', 'bt'].includes(c.variant)) rows.push(['Occupancy certificate', p.oc ? 'On file' : 'Not on file', p.oc ? 'pass' : 'fail']);
  if (c.prop.pmayArea != null) rows.push(['PMAY-U 2.0 area', c.prop.pmayArea ? 'Inside a notified planning area' : 'Not confirmed', c.prop.pmayArea ? 'pass' : 'needs']);
  return `<section class="panel" style="margin-bottom:12px"><div class="ph"><h3>Other property checks</h3></div><div class="pb">${rows.map(([n, v, s]) => `<div class="ck"><span></span><div class="ck-n">${esc(n)}<small>${esc(v)}</small></div><span></span><span class="st ${s}">${s === 'pass' ? 'Met' : s === 'fail' ? 'Not met' : 'Waiting'}</span></div>`).join('')}</div></section>`;
}
function colendCard(c) {
  const t = task(c, 'colend'), cl = c.colend;
  const body = `<div class="fgrid"><div class="fr"><span>Partner</span><b>${esc(cl.partner)}</b></div><div class="fr"><span>Partner\u2019s share</span><b>${cl.share}% at ${cl.prate.toFixed(2)}%</b></div><div class="fr"><span>Our share</span><b>${100 - cl.share}% at ${cl.orate.toFixed(2)}%</b></div><div class="fr"><span>Reference</span><b>${esc(cl.ref)}</b></div></div><p class="hint">The partner ran its own rules on the same data. Its approval is needed before sanction.</p>`;
  return taskCard(c, t, 'Partner bank check', body);
}
function verifyFoot() {
  const c = C(), inc = c.tasks.filter(t => t.track === 'inc'), pr = c.tasks.filter(t => t.track === 'prop');
  const a = T => T.filter(t => t.st === 'accepted').length, open = c.tasks.filter(t => t.st !== 'accepted');
  if (ORDER.indexOf(c.w.step) > 1) return `<div class="gate"><b>Verification complete</b><span>Income track ${a(inc)} of ${inc.length}. Property track ${a(pr)} of ${pr.length}.</span></div><button class="btn btn-s" data-act="tab" data-v="decide">See the decision</button>`;
  if (c.w.step === 'login') return `<div class="gate"><b>Verification has not started</b><span>It starts when the login documents are in.</span></div>`;
  const late = open.find(t => tState(t) === 'late');
  const txt = open.length ? `<b>Income track ${a(inc)} of ${inc.length}. Property track ${a(pr)} of ${pr.length}.</b><span>${late ? esc(late.t) + ' from ' + esc(late.vendor) + ' is ' + plural(wdLate(late.due), 'working day') + ' late. ' : ''}Still open: ${esc(listAnd(open.map(t => lc1(t.t))))}.</span>` : `<b>Both tracks are complete.</b><span>The decision runs on accepted reports only.</span>`;
  return `<div class="gate">${txt}</div>${S.role === 'cm' ? `<button class="btn btn-p btn-lg" data-act="godecide"${open.length ? ' disabled' : ''}>Proceed to decision</button>` : '<span class="muted">The credit manager moves the case to decision.</span>'}`;
}

/* =====================================================================
   Step 3: decision
   ===================================================================== */
function blended(c) { return c.colend.share / 100 * c.colend.prate + (100 - c.colend.share) / 100 * c.colend.orate; }

function editRow(c, key, label, val, src, hint, input) {
  if (S.edit === key) return `<div class="fd editing"><div class="fd-l">${esc(label)}${hint ? `<small>${esc(hint)}</small>` : ''}</div><div class="fd-v">${input}<button class="btn btn-p btn-sm" data-act="fsave">Save</button><button class="btn btn-g btn-sm" data-act="fcancel">Cancel</button></div></div>`;
  return `<div class="fd"><div class="fd-l">${esc(label)}${hint ? `<small>${esc(hint)}</small>` : ''}</div><div class="fd-v">${esc(val)}${chip(src)}${canEdit(c) ? `<button class="fe" data-act="fedit" data-v="${key}" title="Change ${esc(lc1(label))}" aria-label="Change ${esc(lc1(label))}">${ic('pen')}</button>` : ''}</div></div>`;
}
function decideLeft() {
  const c = C(), f = E.f, m = E.m, v = c.v, ed = c.w.edited || {};
  const inp = (val, step) => `<input class="fin sm" id="fin" type="number" step="${step}" value="${val}" data-autofocus>`;
  const asked = v.loan !== v.applied.loan || v.tenure !== v.applied.tenure ? `<p class="hint">Asked for ${lakh(v.applied.loan)} over ${yrsTxt(v.applied.tenure)}.</p>` : '';
  const loanP = `<section class="panel"><div class="ph"><h3>Loan terms</h3><span class="note">EMI ${inr(m.emi)}</span></div><div class="pb"><div class="fgrid one">
   ${editRow(c, 'loan', 'Loan amount', lakh(v.loan), ed.loan ? 'edit' : 'dec', inr(v.loan), inp(v.loan, 10000))}
   ${editRow(c, 'tenure', 'Tenure', yrsTxt(v.tenure), ed.tenure ? 'edit' : 'dec', v.tenure + ' EMIs', inp(v.tenure / 12, 1))}
   ${editRow(c, 'roi', 'Interest rate', v.roi.toFixed(2) + '%', ed.roi ? 'edit' : 'dec', c.colend ? 'Blended across the two lenders' : 'Floating, linked to the Housing Reference Rate', inp(v.roi, 0.05))}
   <div class="fd"><div class="fd-l">EMI</div><div class="fd-v">${inr(m.emi)}${chip('cal')}</div></div></div>${asked}</div></section>`;
  const incP = `<section class="panel"><div class="ph"><h3>Eligible income</h3><span class="note">${f.incKnown ? inr(f.incElig) + ' a month' : 'Waiting for ' + esc(f.incWait)}</span></div><div class="pb"><div class="fgrid one">
   ${c.apps.map(a => a.earning ? editRow(c, 'inc:' + a.id, a.name, inr(a.inc) + ' a month', ed['inc:' + a.id] ? 'edit' : c.prog === 'aip' ? 'ven' : 'ver', a.incSrc, inp(a.inc, 100)) : `<div class="fd"><div class="fd-l">${esc(a.name)}<small>No income considered</small></div><div class="fd-v">${DASH}</div></div>`).join('')}</div></div></section>`;
  const obP = `<section class="panel"><div class="ph"><h3>Loans that count in FOIR</h3><span class="note">${inr(f.oblig)} a month</span></div><div class="pb">${c.oblig.map(o => `<label class="obl${o.count ? '' : ' off'}"><input type="checkbox" data-act="oblig" data-v="${o.id}"${o.count ? ' checked' : ''}${canEdit(c) ? '' : ' disabled'}><span><b>${esc(o.t)}</b><small>${esc(o.lender)}${o.left ? ', ' + o.left + ' months left' : ''}${o.why ? '. ' + esc(o.why) : ''}</small></span><span class="amt">${o.emi ? inr(o.emi) : 'No EMI'}</span></label>`).join('')}</div></section>`;
  const lg = { clear: 'Clear', cond: 'Clear with conditions', notclear: 'Not clear' };
  const prP = `<section class="panel"><div class="ph"><h3>Property</h3><button class="lnk act" data-act="tab" data-v="verify">See the reports</button></div><div class="pb"><div class="fgrid one">
   <div class="fd"><div class="fd-l">Value used for LTV<small>${esc(cap1(f.basis || 'Waiting for the valuation'))}</small></div><div class="fd-v">${f.valUsed ? inr(f.valUsed) : DASH}${chip(f.valUsed ? 'ven' : 'miss')}</div></div>
   <div class="fd"><div class="fd-l">Legal opinion<small>${esc(c.prop.legal.by)}</small></div><div class="fd-v">${f.legalIn ? lg[f.legal] : 'Waiting'}${chip(f.legalIn ? 'ven' : 'miss')}</div></div>
   <div class="fd"><div class="fd-l">LTV caps for this loan<small>Loans ${esc(lc1(SLABS[m.sI]))}, ${esc(lc1(CATS[c.cat]))}</small></div><div class="fd-v">RBI ${m.capReg}%, policy ${m.capPol}%</div></div></div></div></section>`;
  const clP = c.colend ? `<section class="panel"><div class="ph"><h3>Co-lending</h3><span class="note">${esc(c.colend.partner)}</span></div><div class="pb"><table class="tbl"><thead><tr><th>Lender</th><th class="r">Share</th><th class="r">Rate</th></tr></thead><tbody><tr><td>${esc(c.colend.partner)}</td><td class="r">${c.colend.share}%</td><td class="r">${c.colend.prate.toFixed(2)}%</td></tr><tr><td>${esc(LENDER.short)}</td><td class="r">${100 - c.colend.share}%</td><td class="r">${c.colend.orate.toFixed(2)}%</td></tr><tr><td><b>Blended rate to the customer</b></td><td></td><td class="r"><b>${blended(c).toFixed(2)}%</b></td></tr></tbody></table></div></section>` : '';
  const ro = S.role === 'cm' ? 'Read only while the case is ' + lc1(stLabel(E.st)) + '.' : 'Read only.';
  return `<div class="pf-h"><div><h2>Case facts</h2><p>${canEdit(c) ? 'Change a value and the decision on the right updates as you go.' : esc(ro)}</p></div></div><div class="stack">${loanP}${incP}${obP}${prP}${clP}</div>`;
}
function decideRight() {
  return `<div class="dws"><section id="d-hero">${heroHTML()}</section><section id="d-mets">${metsHTML()}</section>${actHTML()}${findHTML()}${eligHTML()}${mlHTML()}${rulesHTML()}</div>`;
}
function verbOf(st) { return { incomplete: 'Data missing', approve: 'Approve', approved: 'Approved', refer: 'Refer to ' + st.lvl, pending: 'With ' + st.lvl, returned: 'Sent back', counter: 'Counter-offer', decline: 'Decline', declined: 'Declined' }[st.k]; }
function itemTxt(r) {
  const cap = String(r.lim).split('%')[0];
  switch (r.id) {
    case 'r_legal': return 'the legal opinion, ' + lc1(r.v);
    case 'r_valvar': return 'valuations ' + r.v;
    case 'r_foir': return 'FOIR at ' + r.v + ' against a cap of ' + cap + '%';
    case 'r_ltv_reg': return 'LTV at ' + r.v + ' against the RBI cap of ' + cap + '%';
    case 'r_ltv_pol': return 'LTV at ' + r.v + ' against the policy cap of ' + cap + '%';
    case 'r_score': return 'a bureau score of ' + r.v;
    case 'r_age': return 'age at maturity (' + r.v + ')';
  }
  return lc1(r.name) + ' (' + r.v + ')';
}
function whyOf() {
  const c = C(), st = E.st, f = E.f, so = E.sys, it = l => listAnd((l || []).map(itemTxt));
  switch (st.k) {
    case 'incomplete': return 'The decision waits for ' + esc(listAnd(needsTxt(E))) + '. Nothing is decided on reports that are not in.';
    case 'approve': return 'Every rule of the home loan policy (version ' + POL.ver + ') that applies is met, and ' + lakh(f.loan) + ' is within your ' + lakh(POL.auth.L1) + ' sanction authority.';
    case 'approved': {
      if (st.by === 'SYS') { const ad = so.approvedDevs || []; return esc((ad.length ? 'The rules engine found ' + it(ad) + '. The deviation model approved it: predicted risk ' + pct(E.ml.p) + ', under its ' + POL.model.approve + '% limit. ' : 'Every rule that applies is met. ') + lakh(f.loan) + ' is within the system\u2019s ' + lakh(POL.sysAuth) + ' sanction limit, so no one else needs to sign.'); }
      const d = c.w.dec; return esc('Approved by ' + byName(d.by) + ' (' + d.by + ') on ' + fdt(d.at) + (d.counter ? ', at ' + lakh(d.counter.to.loan) + ' instead of ' + lakh(d.counter.from.loan) : '') + (d.conds && d.conds.length ? ', with ' + plural(d.conds.length, 'extra condition') : '') + '.');
    }
    case 'refer': {
      const items = E.devs.concat(E.refs);
      if (st.by === 'SYS') {
        const ad = so.approvedDevs || [];
        const pre = ad.length ? 'The deviation model approved ' + it(ad) + '. ' : so.ml === 'refer' ? 'The deviation model puts the risk at ' + pct(E.ml.p) + ', between its ' + POL.model.approve + '% and ' + POL.model.reject + '% limits, so a person decides. ' : so.ml === 'off' ? 'The deviation model is switched off. ' : '';
        if (so.above) return esc(pre + 'Every rule is met, but ' + lakh(f.loan) + ' is above the system\u2019s ' + lakh(POL.sysAuth) + ' limit, so ' + st.lvl + ' (' + AUTH[st.lvl].title + ') signs.');
        return esc(pre + 'A person must decide on ' + it(so.remain) + '. That needs ' + st.lvl + ': ' + AUTH[st.lvl].title + '.');
      }
      if (!items.length) return esc('Every rule is met. ' + lakh(f.loan) + ' is above your ' + lakh(POL.auth.L1) + ' sanction authority, so ' + st.lvl + ' (' + AUTH[st.lvl].title + ') approves.' + (c.w.ovr ? ' You overrode the system\u2019s decision.' : ''));
      return esc(plural(items.length, 'item') + ' need' + (items.length === 1 ? 's' : '') + ' approval: ' + it(items) + '. The highest needs ' + st.lvl + ': ' + AUTH[st.lvl].title + '.' + (E.bumped ? ' Three or more items move the case up a level.' : ''));
    }
    case 'pending': { const r = c.w.req; return esc((r.ovr ? 'You overrode the system. ' : '') + 'Sent to ' + AUTH[r.lvl].name + ' (' + r.lvl + ') on ' + fdt(r.at) + '. Target: ' + lc1(AUTH[r.lvl].sla) + '.'); }
    case 'returned': return esc(byName(st.by) + ' sent it back: \u201C' + (c.w.dec.note || '') + '\u201D. Change what is needed, then send it again.');
    case 'counter': return esc(cap1(it(E.hard)) + '. ' + (E.hard.some(r => r.reg) ? 'No one can approve an LTV above the RBI cap. ' : '') + 'The system can approve ' + lakh(st.cure.apply.loan) + ' instead: the customer pays ' + inr(f.loan - st.cure.apply.loan) + ' more from own funds.');
    case 'decline': {
      if (st.by === 'SYS' && st.model) return esc('The deviation model puts the risk at ' + pct(E.ml.p) + ', above its ' + POL.model.reject + '% limit. A credit manager can override with a reason.');
      return esc('Hard stops: ' + it(E.hard) + '.' + (E.hard.some(r => r.reg) ? ' The RBI cap cannot be approved by anyone.' : ' No level of authority can approve these.') + (E.ways.some(w => w.cure) ? ' Changing the terms would clear it: see below.' : ''));
    }
    case 'declined': { const d = c.w.dec; return esc('Declined by ' + byName(d.by) + ' on ' + fdt(d.at) + '. Main reasons: ' + listAnd((d.reasons || []).map(k => lc1(REJ[k].t))) + '.' + (c.w.letter ? ' The letter went out ' + fdt(c.w.letter.sent) + '.' : ' The letter is ready to send.')); }
  }
  return '';
}
function heroActs() {
  const c = C(), st = E.st, rules = `<button class="btn btn-g" data-act="scrollto" data-v="rules">See all ${E.R.filter(r => r.st !== 'na').length} rules</button>`;
  if (S.role === 'ap') {
    if (st.k === 'pending') return RANK[S.lvl] >= RANK[st.lvl] ? `<button class="btn btn-p" data-act="scrollto" data-v="act">Review the request</button>${rules}` : `<span class="hnote">Needs ${st.lvl}: above your authority (${S.lvl})</span>${rules}`;
    return rules;
  }
  if (S.role !== 'cm') return rules;
  const cure = E.ways.find(w => w.cure);
  const offer = cure ? `<button class="btn btn-p" data-act="apply" data-v='${esc(JSON.stringify(cure.apply))}'>Offer ${lakh(cure.apply.loan)}</button>` : '';
  const ovr = `<button class="btn btn-s" data-act="ovr">${ic('pen')}Override</button>`;
  switch (st.k) {
    case 'incomplete': return `<button class="btn btn-p" data-act="tab" data-v="verify">Go to verification</button>${rules}`;
    case 'approve': return `<button class="btn btn-ok" data-act="cmapprove">${ic('check')}Approve case</button><button class="btn btn-s" data-act="godecl">Decline</button>${rules}`;
    case 'refer': case 'returned': return `<button class="btn btn-p" data-act="scrollto" data-v="act">Send to ${st.lvl} for approval</button><button class="btn btn-s" data-act="godecl">Decline</button>${rules}`;
    case 'counter': return `${offer}<button class="btn btn-s" data-act="godecl">Decline</button>${rules}`;
    case 'decline': return `${offer}<button class="btn ${offer ? 'btn-s' : 'btn-x'}" data-act="godecl">Decline the application</button>${st.by === 'SYS' && st.model ? ovr : ''}${rules}`;
    case 'approved': return `<button class="btn btn-p" data-act="tab" data-v="sanction">Go to sanction</button>${st.by === 'SYS' && !c.w.san.sent ? ovr : ''}${rules}`;
    case 'pending': return `<button class="btn btn-s" data-act="withdraw">Withdraw the request</button>${rules}`;
    case 'declined': return `<button class="btn btn-s" data-act="tab" data-v="sanction">See the letter</button>${rules}`;
  }
  return rules;
}
function sysByHTML() {
  const c = C(), so = E.sys, ch = [];
  if (S.auto) { ch.push(`<span class="chip2">${ic('cpu')}Rules engine, policy v${POL.ver}</span>`); if (E.ml && so.ml && so.ml !== 'off') ch.push(`<span class="chip2">${ic('cpu')}${MODEL.id} ${POL.model.ver}</span>`); }
  else ch.push(`<span class="chip2">${ic('cpu')}Policy v${POL.ver} checks only</span>`);
  if (c.w.dec && AUTH[c.w.dec.by]) ch.push(`<span class="chip2 p">${ic('user')}${esc(AUTH[c.w.dec.by].name)}, ${c.w.dec.by}</span>`);
  else if (c.w.req && c.w.req.k === 'pending') ch.push(`<span class="chip2 p">${ic('user')}${esc(AUTH[c.w.req.lvl].name)}, ${c.w.req.lvl}</span>`);
  const when = S.auto && c.w.sysAt && !c.w.dec ? 'Checked ' + fdt(c.w.sysAt) : !S.auto ? 'Decisions by people' : '';
  return `<div class="sysby">${ch.join('')}${when ? `<span>${esc(when)}</span>` : ''}</div>`;
}
function ladderHTML() {
  const st = E.st, nodes = (S.auto ? ['SYS'] : []).concat(LEVELS), n = nodes.length;
  let req = null, mode = '', cap;
  switch (st.k) {
    case 'approved': req = st.by === 'SYS' ? 'SYS' : st.by; cap = st.by === 'SYS' ? 'Within the system\u2019s ' + lakh(POL.sysAuth) + ' limit' : 'Approved at ' + st.by + ': ' + AUTH[st.by].title; break;
    case 'approve': req = 'L1'; cap = 'Within normal sanction authority'; break;
    case 'refer': case 'pending': case 'returned': req = st.lvl; cap = (st.k === 'pending' ? 'Waiting for ' : 'Needs ') + st.lvl + ': ' + AUTH[st.lvl].title; break;
    case 'counter': req = 'SYS'; cap = 'The system can approve the counter-offer'; break;
    case 'decline': case 'declined': mode = 'x'; cap = st.k === 'declined' ? 'Declined' : st.model ? 'The model rejects; an override goes to a person' : E.hard.some(r => r.reg) ? 'No level can approve over an RBI limit' : 'No level can approve a hard stop'; break;
    default: mode = 'dim'; cap = 'Set once the data is in';
  }
  const ri = req ? nodes.indexOf(req) : -1;
  const node = (l, i) => { const sys = l === 'SYS'; return `<div class="ldn${i < ri ? ' lit' : ''}${i === ri ? ' req' : ''}${sys ? ' sys' : ''}"><i>${mode === 'x' ? ic('x') : i <= ri ? ic('check') : ''}</i><b>${sys ? 'System' : l}</b><small>${sys ? 'Rules and model' : AUTH[l].title}</small>${i === ri ? `<em>${esc(sys ? 'Automatic' : AUTH[l].name)}</em>` : ''}</div>`; };
  return `<div class="ladder" aria-label="Approval authority"><p class="ld-cap">${esc(cap)}</p><div class="ld ${mode}" style="--n:${n}"><span class="ld-fill" style="width:${Math.max(0, ri) * 100 / n}%"></span>${nodes.map(node).join('')}</div></div>`;
}
function stagesHTML() {
  const c = C(), at = ORDER.indexOf(c.w.step), st = E.st;
  const L = [['Login', at > 0], ['Verification', at > 1], ['Decision', null], [st.k === 'declined' ? 'Letter' : 'Sanction', !!(c.w.san && c.w.san.handoff)]];
  return `<div class="stages">${L.map(([t, done], i) => { const cls = i === 2 ? (['decline', 'declined'].includes(st.k) ? 'bad' : st.k === 'approved' ? 'done' : 'cur') : done ? 'done' : i === 3 && st.k === 'approved' ? 'cur' : 'skip'; return `${i ? '<span class="stg-l"></span>' : ''}<span class="stg ${cls}"><i>${cls === 'done' ? ic('check') : cls === 'bad' ? ic('x') : ''}</i>${t}${i === 2 ? `&nbsp;<small>${esc(stLabel(st))}</small>` : ''}</span>`; }).join('')}</div>`;
}
function heroHTML() {
  const st = E.st;
  return `<div class="hero ${TONE[st.k]}"><div><h2 class="hero-verb">${esc(verbOf(st))}</h2><p class="hero-why">${whyOf()}</p><div class="hero-act">${heroActs()}</div>${sysByHTML()}</div>${ladderHTML()}${stagesHTML()}</div>`;
}
function metsHTML() {
  const f = E.f, m = E.m;
  const fr0 = E.R.find(r => r.id === 'r_foir'), lr = E.R.find(r => r.id === 'r_ltv_reg'), lp = E.R.find(r => r.id === 'r_ltv_pol');
  const fBad = fr0 && fr0.st === 'fail' ? fr0.kind : null, lBad = lr && lr.st === 'fail' ? 'hard' : lp && lp.st === 'fail' ? 'dev' : null;
  const bar = (val, cap, bad) => val == null ? '' : `<div class="lbar${bad === 'hard' ? ' bad' : bad ? ' dev' : ''}"><i style="width:${clamp(val, 0, 100)}%"></i><u style="left:calc(${clamp(cap, 0, 100)}% - 1px)"></u></div>`;
  const met = (l, v, s, b) => `<div class="met"><div class="met-l">${l}</div><div class="met-v">${v}</div>${b || ''}<div class="met-s">${s}</div></div>`;
  return `<div class="mets">${met('FOIR', m.foir != null ? pctf(m.foir) : DASH, 'Cap ' + m.foirCap + '%', bar(m.foir, m.foirCap, fBad))}${met('LTV', m.ltv != null ? pctf(m.ltv) : DASH, 'RBI ' + m.capReg + '%, policy ' + m.capPol + '%', bar(m.ltv, Math.min(m.capReg, m.capPol), lBad))}${met('Most that can be lent', m.elig != null ? lakhS(m.elig) : DASH, 'Lower of income and property')}${met('EMI', inr(m.emi), yrsTxt(f.tenure) + ' at ' + f.roi.toFixed(2) + '%')}${met('Lowest bureau score', f.minScore || 'None', f.minScore ? 'Policy minimum ' + POL.dev.scoreMin : 'No credit history')}</div>`;
}
function arRow(r, extra) {
  const cls = r.st === 'needs' ? 'nd' : r.kind === 'hard' ? 'nx' : r.kind === 'ref' ? 'nd' : 'dv';
  const chipL = r.st === 'needs' ? '<span class="lvl l1">Waiting</span>' : r.kind === 'hard' ? `<span class="lvl nx">${r.reg ? 'RBI limit' : 'Hard stop'}</span>` : `<span class="lvl dv">Needs ${r.lvl}</span>`;
  const lim = String(r.lim || '').split(',')[0];
  return `<div class="ar ${cls}"><span class="ar-m"></span><div class="ar-t">${esc(r.name)}</div><div class="ar-v" title="${esc(r.lim)}">${esc(r.v)}${lim ? `<small>Limit ${esc(lim)}</small>` : ''}</div>${r.why ? `<div class="ar-x">${esc(r.why)}</div>` : ''}<div class="ar-meta">${chipL}${extra || ''}<span class="cite">${esc(r.cite)}</span></div></div>`;
}
function actHTML() {
  const c = C(), st = E.st;
  if (S.role === 'ap') return apReviewHTML(c, st);
  if (S.role !== 'cm') return '';
  if (S.form.decl === c.id || (st.k === 'decline' && !E.ways.some(w => w.cure) && !(st.by === 'SYS' && st.model))) return declFormHTML(c);
  if (st.k === 'refer' || st.k === 'returned') return reqFormHTML(c, st);
  if (st.k === 'pending') return pendingHTML(c);
  return '';
}
function mitsFor(c, ev) {
  const f = ev.f, m = ev.m, L = [];
  if (f.coEarning) L.push('coinc');
  if (f.minScore >= 750 && !f.d30) L.push('bureau');
  if (f.apf) L.push('apf');
  if (m.ltv != null && m.ltv <= m.capReg - 10) L.push('ltvlow');
  if (f.yrs >= 5) L.push('tenure');
  if (c.oblig.some(o => o.count && o.emi && o.left && o.left <= 36)) L.push('oblend');
  if (c.prog === 'aip' && tIn(c, 'pd')) L.push('pd');
  return L;
}
function draftNote(c, ev) {
  const items = ev.devs.concat(ev.refs), m = ev.m, f = ev.f, P = [];
  if (items.length) P.push(items.map(r => r.id === 'r_legal' ? 'The legal opinion is clear with conditions; they become conditions before disbursement' : r.name + ' is ' + r.v + ' against ' + String(r.lim).split(',')[0]).join('. ') + '.');
  else P.push('Every rule is met; the amount needs ' + ev.st.lvl + '.');
  const ob = c.oblig.find(o => o.count && o.left && o.left <= 36 && o.emi);
  if (ob && m.foir != null) P.push('The ' + lc1(ob.t) + ' ends in ' + ob.left + ' months, and FOIR then falls to ' + pctf((f.oblig - ob.emi + m.emi) / f.incElig * 100) + '.');
  if (f.coEarning) P.push('Two earning applicants.');
  if (f.apf) P.push('Approved project.');
  if (ev.ml) P.push('Model risk ' + pct(ev.ml.p) + ' against a typical ' + pct(ev.ml.pt) + '.');
  return P.join(' ');
}
function reqFormHTML(c, st) {
  const items = E.devs.concat(E.refs), lvl = st.lvl, a = AUTH[lvl], sug = mitsFor(c, E);
  S.form.mits = S.form.mits || {}; if (!S.form.mits[c.id]) { S.form.mits[c.id] = {}; sug.forEach(k => { S.form.mits[c.id][k] = true; }); }
  const sel = S.form.mits[c.id];
  if (S.form.note == null || S.form.noteFor !== c.id) { S.form.note = draftNote(c, E); S.form.noteFor = c.id; }
  const keys = Object.keys(MITS).filter(k => sug.includes(k) || sel[k]);
  return `<section class="panel" id="act"><div class="ph"><h3>Send to ${lvl} for approval</h3><span class="note">${items.length ? plural(items.length, 'item') + ' for approval' : 'Sanction authority for the amount'}</span></div><div class="pb">
  ${items.length ? items.map(r => arRow(r)).join('') : `<div class="okline">${ic('check')}<div>Every rule is met. ${lakh(c.v.loan)} is above your ${lakh(POL.auth.L1)} authority.</div></div>`}
  <div class="dev-grid" style="padding:14px 0 0;margin-top:8px"><div><div class="ins-k">Mitigants</div>${keys.map(k => `<label class="mit"><input type="checkbox" data-act="mit" data-v="${k}"${sel[k] ? ' checked' : ''}><b>${esc(MITS[k].t)}</b><small>${esc(MITS[k].d)}</small></label>`).join('') || '<p class="muted">None found in the data.</p>'}</div>
  <div><div class="ins-k">Note to ${esc(a.name)}</div><textarea class="ta" id="reqNote" aria-label="Note to the approver">${esc(S.form.note)}</textarea></div></div>
  <div class="route">${ic('route')}<div><b>Goes to ${esc(a.name)}, ${lvl} ${esc(a.title)}</b><br><span class="muted">Target: ${esc(lc1(a.sla))}. You can withdraw it until they decide.</span></div><button class="btn btn-p" data-act="reqsend" style="margin-left:auto">Send the request</button></div></div></section>`;
}
function pendingHTML(c) {
  const r = c.w.req, a = AUTH[r.lvl];
  return `<section class="panel" id="act"><div class="ph"><h3>With ${esc(a.name)}, ${r.lvl}</h3><span class="note">Sent ${fdt(r.at)}</span><button class="btn btn-s btn-sm act" data-act="withdraw">Withdraw</button></div><div class="pb">${r.items && r.items.length ? `<ul class="mlist">${r.items.map(x => `<li><span>${esc(x)}</span></li>`).join('')}</ul>` : ''}${r.note ? `<p class="qt">${esc(r.note)}</p>` : ''}</div></section>`;
}
function defaultRej() { const out = []; E.hard.forEach(r => { if (REJ[r.id]) out.push(r.id); }); if (!out.length) out.push('other'); return out; }
function rejBoxes() { const d = defaultRej(); return Object.keys(REJ).map(k => `<label class="mit"><input type="checkbox" data-r="${k}"${d.includes(k) ? ' checked' : ''}><b>${esc(REJ[k].t)}</b><small>${esc(REJ[k].en)}</small></label>`).join(''); }
function declFormHTML(c) {
  return `<section class="panel" id="act"><div class="ph"><h3>Decline the application</h3><span class="note">The customer gets the main reasons in writing</span>${S.form.decl === c.id ? '<button class="btn btn-g btn-sm act" data-act="decx">Cancel</button>' : ''}</div><div class="pb"><div class="ins-k">Main reasons, as the customer will read them</div>${rejBoxes()}<div class="frm" style="margin-top:10px"><label>Note for the file<textarea class="ta" id="declNote" aria-label="Note for the file"></textarea></label></div><div class="act-row"><button class="btn btn-x" data-act="decl">Decline and prepare the letter</button></div></div></section>`;
}
function apPrevHTML(c, L, T) {
  const f = Object.assign({}, E.f, { loan: L, tenure: T }), ev = evalFacts(f, POL);
  return esc('With ' + lakh(L) + ' over ' + yrsTxt(T) + ': EMI ' + inr(ev.m.emi) + ', FOIR ' + pctf(ev.m.foir) + ', LTV ' + pctf(ev.m.ltv) + '. ' + (ev.hard.length ? 'Still breaks ' + listAnd(ev.hard.map(r => lc1(r.name))) + '.' : ev.devs.length + ev.refs.length ? plural(ev.devs.length + ev.refs.length, 'item') + ' left: ' + listAnd(ev.devs.concat(ev.refs).map(r => lc1(r.name))) + '.' : 'Every rule is met.'));
}
function apReviewHTML(c, st) {
  if (st.k !== 'pending') return '';
  const r = c.w.req;
  if (RANK[S.lvl] < RANK[r.lvl]) return `<section class="panel" id="act"><div class="ph"><h3>Request for ${r.lvl}</h3></div><div class="pb"><p class="muted" style="margin:4px 0">This needs ${r.lvl}: ${esc(AUTH[r.lvl].title)}. Your authority is ${S.lvl}. Switch the level in the top bar to act on it.</p></div></section>`;
  const sel = S.form.ap || '', btn = (k, l) => `<button class="btn ${sel === k ? 'btn-p' : 'btn-s'}" data-act="apsel" data-v="${k}">${l}</button>`;
  const cure = E.ways.find(w => w.k === 'loan'), L0 = cure ? cure.apply.loan : c.v.loan, T0 = c.v.tenure;
  let sub = '';
  if (sel === 'approve') sub = `<div class="apf-sub"><p style="margin:0 0 10px">Approve ${lakh(c.v.loan)} over ${yrsTxt(c.v.tenure)} as it stands.</p><button class="btn btn-ok" data-act="apgo" data-v="approve">${ic('check')}Approve</button></div>`;
  if (sel === 'cond') sub = `<div class="apf-sub"><div class="frm"><label>Conditions, one per line<textarea class="ta" id="apCond" data-autofocus placeholder="For example: closure letter for the car loan before the second disbursement"></textarea></label></div><div class="act-row"><button class="btn btn-ok" data-act="apgo" data-v="cond">${ic('check')}Approve with these conditions</button></div></div>`;
  if (sel === 'counter') sub = `<div class="apf-sub"><div class="frm"><div class="frm-row"><label>Loan amount (\u20B9)<input class="inp2" id="apLoan" type="number" step="10000" value="${L0}" data-autofocus></label><label>Tenure (years)<input class="inp2" id="apTen" type="number" step="1" value="${T0 / 12}"></label></div></div><p id="apPrev" class="calc">${apPrevHTML(c, L0, T0)}</p><div class="act-row"><button class="btn btn-p" data-act="apgo" data-v="counter">Approve the counter-offer</button></div></div>`;
  if (sel === 'back') sub = `<div class="apf-sub"><div class="frm"><label>What should the credit manager change?<textarea class="ta" id="apNote" data-autofocus></textarea></label></div><div class="act-row"><button class="btn btn-s" data-act="apgo" data-v="back">Send back</button></div></div>`;
  if (sel === 'reject') sub = `<div class="apf-sub"><div class="ins-k">Main reasons, as the customer will read them</div>${rejBoxes()}<div class="frm" style="margin-top:10px"><label>Note for the file<textarea class="ta" id="apNote"></textarea></label></div><div class="act-row"><button class="btn btn-x" data-act="apgo" data-v="reject">Reject</button></div></div>`;
  const items = E.devs.concat(E.refs);
  return `<section class="panel" id="act"><div class="ph"><h3>Request from ${esc(AUTH[r.by].name)}</h3><span class="note">Sent ${fdt(r.at)}${r.ovr ? ', after overriding the system' : ''}</span></div><div class="pb">
  ${items.length ? items.map(x => arRow(x)).join('') : `<div class="okline">${ic('check')}<div>Every rule is met. The amount, ${lakh(c.v.loan)}, needs ${r.lvl}.</div></div>`}
  ${r.mits && r.mits.length ? `<div class="ins-k" style="margin-top:10px">Mitigants given</div><ul class="mlist">${r.mits.map(k => `<li><span>${esc(MITS[k].t)}</span><small>${esc(MITS[k].d)}</small></li>`).join('')}</ul>` : ''}
  ${r.note ? `<p class="qt">${esc(r.note)}</p>` : ''}${E.ml ? `<p class="hint">Deviation model: risk ${pct(E.ml.p)} against a typical ${pct(E.ml.pt)}. The model panel below shows why.</p>` : ''}
  <div class="apb">${btn('approve', 'Approve')}${btn('cond', 'Approve with conditions')}${btn('counter', 'Counter-offer')}${btn('back', 'Send back')}${btn('reject', 'Reject')}</div>${sub}</div></section>`;
}
function findHTML() {
  const c = C(), so = E.sys, items = E.hard.concat(E.devs, E.refs, E.needs);
  const mlAp = S.auto && so.approvedDevs ? so.approvedDevs : [];
  const why = items.length ? items.map(r => arRow(r, mlAp.includes(r) ? `<span class="st pass">Approved by the model</span>` : '')).join('') : `<div class="okline">${ic('check')}<div>Every rule that applies is met.${E.amtLvl !== 'L1' && !(S.auto && c.v.loan <= POL.sysAuth) ? ' The amount needs ' + E.amtLvl + ' to sign.' : ''}</div></div>`;
  const cs = condsOf(c, E), cnt = k => cs.filter(x => x.w === k).length, G = { now: 'Before sanction', cp: 'Before the first disbursement', pdd: 'After disbursement' };
  const conds = ['now', 'cp', 'pdd'].map(k => cs.filter(x => x.w === k).map(x => `<div class="cgi">${ic(k === 'now' ? 'alert' : k === 'cp' ? 'flag' : 'clock')}<div><b>${esc(x.t)}</b><small>${esc(x.d || '')}</small></div><span class="when ${k}">${G[k]}</span></div>`).join('')).join('');
  const ways = E.ways.map(w => `<div class="opp"><div><b>${esc(w.t)}</b><span>${esc(w.d)}</span></div>${w.apply && canEdit(c) ? `<button class="btn ${w.key ? 'btn-p' : 'btn-s'} btn-sm" data-act="apply" data-v='${esc(JSON.stringify(w.apply))}'>Apply</button>` : ''}</div>`).join('');
  const str = strengthsOf(c, E), obs = obsOf(c, E);
  return `<section class="panel fnd" id="fnd"><div class="ph"><h3>Findings</h3><span class="note">What the checks found, what to clear, and what would change the outcome</span></div>
  <div class="fs" style="border-top:0"><h4>What the checks found</h4>${why}</div>
  ${ways ? `<div class="fs"><h4>What would change the outcome</h4>${ways}</div>` : ''}
  <div class="fs"><h4>Conditions to clear<span class="note">${cnt('now')} before sanction, ${cnt('cp')} before the first disbursement, ${cnt('pdd')} after</span></h4>${conds}</div>
  ${str.length ? `<div class="fs"><h4>Strengths</h4>${str.map(s => `<div class="str">${ic('check')}<span>${esc(s)}</span></div>`).join('')}</div>` : ''}
  <div class="fs"><h4>Observations</h4>${obs.map(s => `<div class="obs">${ic('info')}<span>${esc(s)}</span></div>`).join('')}</div></section>`;
}
function eligHTML() {
  const f = E.f, m = E.m;
  if (m.maxF == null && m.maxL == null) return '';
  const mx = Math.max(...[m.maxF, m.maxL, f.loan].filter(x => x != null)) * 1.06;
  const bindF = m.maxF != null && (m.maxL == null || m.maxF <= m.maxL);
  const row = (l, s, v, cls) => `<div class="el-r ${cls}"><span>${l}<small>${s}</small></span><div class="el-t"><i style="width:${v / mx * 100}%"></i></div><b>${lakh(v)}</b></div>`;
  return `<section class="panel"><div class="ph"><h3>How much can be lent</h3><span class="note">The lower of the two limits applies</span></div><div class="pb"><div class="el">
  ${m.maxF != null ? row('By income', 'FOIR cap ' + m.foirCap + '%', m.maxF, bindF ? 'bind' : '') : ''}
  ${m.maxL != null ? row('By property', 'LTV caps on ' + lakh(f.valUsed), m.maxL, bindF ? '' : 'bind') : ''}
  ${row('Asked for', yrsTxt(f.tenure) + ' at ' + f.roi.toFixed(2) + '%', f.loan, 'ask' + (m.elig != null && f.loan > m.elig ? ' over' : ''))}</div>
  ${m.foir != null ? `<p class="calc">FOIR: (existing EMIs ${inr(f.oblig)} + new EMI ${inr(m.emi)}) \u00F7 eligible income ${inr(f.incElig)} = <b>${pctf(m.foir)}</b></p>` : ''}
  ${m.ltv != null ? `<p class="calc">LTV: loan ${inr(f.loan)} \u00F7 value used ${inr(f.valUsed)} = <b>${pctf(m.ltv)}</b>. Stamp duty and registration are not part of the value.</p>` : ''}</div></section>`;
}

function rulesHTML() {
  const R = E.R.filter(r => r.st !== 'na'), q = S.rq.trim().toLowerCase();
  const nf = R.filter(r => r.st === 'fail').length, nn = R.filter(r => r.st === 'needs').length;
  let list = R.filter(r => S.rf === 'all' ? true : S.rf === 'fail' ? r.st === 'fail' : r.st === 'needs');
  if (q) list = list.filter(r => (r.name + ' ' + r.cite + ' ' + r.sec).toLowerCase().includes(q));
  const stt = r => r.st === 'pass' ? '<span class="st pass">Met</span>' : r.st === 'needs' ? '<span class="st needs">Waiting</span>' : r.kind === 'hard' ? `<span class="st fail">${r.reg ? 'RBI limit' : 'Hard stop'}</span>` : `<span class="st cond">Needs ${r.lvl}</span>`;
  return `<section class="panel" id="rules"><div class="pt-top">${[['fail', 'Not met', nf], ['needs', 'Waiting', nn], ['all', 'All', R.length]].map(([k, l, n]) => `<button class="flt${S.rf === k ? ' on' : ''}" data-act="rf" data-v="${k}">${l} ${n}</button>`).join('')}<input class="srch" id="rq" type="search" placeholder="Search rules" value="${esc(S.rq)}" aria-label="Search rules"></div>
  <div class="pr hd"><span>Clause</span><span>Rule</span><span>This case</span><span class="pr-l">Limit</span><span class="pr-r">Result</span></div>
  ${list.length ? list.map(r => `<div class="pr${r.st === 'fail' ? (r.kind === 'hard' ? ' fail' : ' cond') : r.st === 'needs' ? ' needs' : ''}"><span class="muted">${esc(r.cite)}</span><span class="pr-n"><b>${esc(r.name)}</b><small>${esc(r.sec)}</small></span><span class="pr-v">${esc(r.v)}</span><span class="pr-l">${esc(r.lim)}</span><span class="pr-r">${stt(r)}</span></div>`).join('') : `<div class="okline" style="padding:14px 16px">${ic('check')}<div>${S.rf === 'fail' ? 'Every rule that applies is met.' : 'Nothing matches.'}</div></div>`}
  <p class="foot" style="padding:0 16px 14px">Home loan policy, version ${POL.ver}, live since ${fdate(POL.at)}. They are changed on the Admin page.</p></section>`;
}

/* =====================================================================
   Documents: memo, sanction pack, letters, KFS, handoff
   ===================================================================== */
function fr(l, v, s) { return `<div class="fr"><span>${l}${s ? `<small style="display:block;color:var(--ink-4);font-size:11px;font-weight:500">${s}</small>` : ''}</span><b>${v}</b></div>`; }
function sanDate(c) { return (c.w.dec && c.w.dec.at) || c.w.sysAt || S8(CLK); }
function lmark() { return LENDER.name.split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); }

function approverTxt(c, hi) {
  const d = c.w.dec;
  if (d && AUTH[d.by]) return esc(AUTH[d.by].name + ', ' + AUTH[d.by].title);
  return hi ? 'स्वचालित स्वीकृति: नीति संस्करण ' + POL.ver : 'Approved automatically under policy version ' + POL.ver;
}
const PURP_HI = { uc: 'निर्माणाधीन फ्लैट की खरीद', resale: 'पुराने (रीसेल) मकान की खरीद', selfcon: 'अपने प्लॉट पर मकान का निर्माण', plotcon: 'प्लॉट की खरीद और मकान का निर्माण', bt: 'गृह ऋण का बैलेंस ट्रांसफर और मरम्मत के लिए टॉप-अप' };
const STAGE_HI = { 'Plinth': 'प्लिंथ', 'Lintel': 'लिंटल', 'Roof slab': 'छत की स्लैब', 'Finishing': 'फिनिशिंग', 'First disbursement': 'पहला वितरण', 'Slabs 8 to 14': 'स्लैब 8 से 14', 'Walls and plaster': 'दीवारें और प्लास्टर', 'Possession': 'कब्ज़ा', 'Balance transfer': 'बैलेंस ट्रांसफर', 'Top-up': 'टॉप-अप', 'Single disbursement': 'एक बार में पूरा वितरण' };
const CHI = {
  'Mortgage created on the property': 'संपत्ति पर बंधक (मॉर्गेज) बनाना',
  'Property insurance with our interest noted': 'संपत्ति का बीमा, जिसमें हमारा हित दर्ज हो',
  'NACH mandate registered for the EMI': 'EMI के लिए NACH मैंडेट का पंजीकरण',
  'Deposit the original documents': 'मूल संपत्ति दस्तावेज़ जमा करना',
  'Building permission and a house plan approved by the gram panchayat': 'ग्राम पंचायत से स्वीकृत भवन अनुमति और मकान का नक्शा',
  'Building permission from Gram Panchayat Sanwariya for the planned house': 'प्रस्तावित मकान के लिए ग्राम पंचायत सांवरिया से निर्माण की अनुमति',
  'No-objection affidavits from Ramesh\u2019s two brothers, the other heirs of Bhanwar Lal Kumawat': 'रमेश के दोनों भाइयों (भंवर लाल कुमावत के अन्य वारिसों) से अनापत्ति शपथ-पत्र',
  'Register our charge with CERSAI within 30 days of the mortgage': 'बंधक बनने के 30 दिनों के भीतर CERSAI पर हमारा चार्ज दर्ज करना',
  'Site photos and a stage report before each tranche': 'हर चरण के वितरण से पहले साइट की तस्वीरें और निर्माण-चरण की रिपोर्ट',
  'File the PMAY-U 2.0 interest subsidy claim': 'PMAY-U 2.0 ब्याज सब्सिडी का दावा दाखिल करना'
};
const hiOf = t => CHI[t] || t;

/* ---------- credit appraisal memo ---------- */
function summaryTxt(c, ev) {
  const f = ev.f, m = ev.m, p = c.prop, loc = c.v.branch.split(' ')[0];
  const what = { uc: 'buy an under-construction flat in ' + (p.project || 'a builder project') + (p.apf ? ', an approved project in ' + loc : ''), resale: 'buy a resale ' + lc1(p.kind) + ' in ' + loc, selfcon: 'build a house on their own plot near ' + loc, plotcon: 'buy a plot in ' + loc + ' and build a house on it', bt: 'move their home loan from ' + (c.bt ? c.bt.lender : 'another lender') + ' and borrow ' + (c.topup ? lakh(c.topup.amt) : '') + ' more for renovation' }[c.variant];
  return caseName(c) + ' ask' + (c.apps.length > 1 ? '' : 's') + ' for ' + lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure) + ' to ' + what + '. ' + (f.incKnown ? 'Eligible household income of ' + inr(f.incElig) + ' a month supports an EMI of ' + inr(m.emi) + '; FOIR is ' + pctf(m.foir) + ' against a cap of ' + m.foirCap + '%. ' : '') + (f.valUsed ? 'LTV is ' + pctf(m.ltv) + ' on a value of ' + lakh(f.valUsed) + ', against the RBI cap of ' + m.capReg + '%.' : '');
}

function memoHTML() {
  const c = C(), ev = E, f = ev.f, m = ev.m, p = c.prop, k = kfsOf(c, ev), items = ev.hard.concat(ev.devs, ev.refs);
  const tr = (a, b) => `<tr><th>${a}</th><td>${b}</td></tr>`, op = { clear: 'clear', cond: 'clear with conditions', notclear: 'not clear' }[p.legal.op];
  const vals = p.vals.filter(x => tIn(c, x.id)), cs = condsOf(c, ev), req = c.w.req;
  return `<div class="dtabs"><div><h2 style="margin:0;font-size:17px;font-weight:800">Credit appraisal memo</h2><p class="muted" style="margin:2px 0 0;font-size:12.5px">Written from the case. Every figure comes from a report, a data pull or a recorded decision.</p></div><div class="act"><button class="btn btn-s btn-sm" data-act="print">${ic('print')}Print</button></div></div>
  <article class="cam" id="pdoc" style="margin:0 auto"><header class="cam-h"><div><h2>Credit appraisal memo</h2><p>${esc(c.v.appNo)}, ${esc(c.v.branch)} branch, ${esc(LENDER.name)}</p></div>${pill(ev.st)}</header>
  <h3>Summary</h3><p>${esc(summaryTxt(c, ev))}</p>
  <h3>Applicants and income</h3><table class="tbl"><thead><tr><th>Applicant</th><th>Work</th><th class="r">Eligible income</th><th class="r">Bureau</th></tr></thead><tbody>${c.apps.map(a => `<tr><td><b>${esc(a.name)}</b><br><span class="muted">${esc(a.role)}, ${a.age}</span></td><td>${esc(a.occ)}${a.org && a.org !== a.occ ? ', ' + esc(a.org) : ''}${a.yrs ? `<br><span class="muted">${a.yrs} years</span>` : ''}</td><td class="r">${a.earning ? inr(a.inc) : DASH}</td><td class="r">${a.cibil || 'No history'}</td></tr>`).join('')}</tbody></table>
  ${c.pd && tIn(c, 'pd') ? `<p style="margin-top:8px">Personal discussion by ${esc(c.pd.by)}: declared income ${inr(c.pd.decl)} a month, assessed ${inr(c.pd.assessed)}. The assessed figure is used. Household of ${c.pd.hh.members}, living costs ${inr(c.pd.hh.exp)} a month.</p>` : ''}
  <h3>Obligations</h3><table class="tbl"><thead><tr><th>Loan</th><th class="r">EMI</th><th>In FOIR</th></tr></thead><tbody>${c.oblig.map(o => `<tr><td>${esc(o.t)}<br><span class="muted">${esc(o.lender)}, ${inr(o.out)} outstanding</span></td><td class="r">${o.emi ? inr(o.emi) : DASH}</td><td>${o.count ? 'Counted' : 'Left out: ' + esc(lc1(o.why))}</td></tr>`).join('')}</tbody></table>
  <h3>Property</h3><table class="tbl"><tbody>${tr('Property', esc(p.kind + ', ' + p.addr))}${tr('Type', esc(VAR[c.variant] + ', ' + lc1(CATS[c.cat])))}${tr('Area', esc(p.area))}${p.apf ? tr('Approved project', esc(p.apf.id + ', valid to ' + p.apf.valid)) : ''}${tr('Value used for LTV', f.valUsed ? inr(f.valUsed) + ', ' + esc(f.basis) : 'Waiting')}</tbody></table>
  <h3>Legal</h3><p>${tIn(c, 'legal') ? `Opinion by ${esc(p.legal.by)}: ${op}. ${esc(p.legal.note)} Chain of title: ${esc(p.legal.chain.map(x => x.y + ' ' + lc1(x.t) + ', ' + x.p).join('; '))}.` : 'The legal report is not in yet.'}</p>
  <h3>Technical</h3><p>${vals.length ? esc(vals.map(x => x.by + ' valued it at ' + lakh(x.v)).join('; ') + '. Stage of construction ' + p.stage + '%. ' + (p.planDev != null ? 'Deviation from the approved plan ' + p.planDev + '%. ' : '') + 'Building life left ' + p.resid + ' years. ' + (p.neg === 'none' ? 'Not in a negative area.' : p.neg === 'barred' ? 'In a barred area: ' + p.negNote + '.' : 'In a caution area.')) : 'The valuation is not in yet.'}</p>
  <h3>Eligibility and structure</h3><table class="tbl"><tbody>${tr('Loan', lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure) + (c.v.loan !== c.v.applied.loan ? ' (asked ' + lakh(c.v.applied.loan) + ')' : ''))}${tr('Rate', c.v.roi.toFixed(2) + '%, floating' + (c.colend ? ', blended with ' + esc(c.colend.partner) : ''))}${tr('EMI', inr(m.emi))}${tr('FOIR', m.foir != null ? pctf(m.foir) + ' against a cap of ' + m.foirCap + '%' : 'Waiting')}${tr('LTV', m.ltv != null ? pctf(m.ltv) + ' against RBI ' + m.capReg + '% and policy ' + m.capPol + '%' : 'Waiting')}${tr('Most that can be lent', m.elig != null ? lakh(m.elig) : DASH)}${tr('APR', pct(k.apr, 2))}</tbody></table>
  <h3>Deviations and mitigants</h3>${items.length ? `<table class="tbl"><thead><tr><th>Item</th><th>This case</th><th>Limit</th><th>Who decides</th></tr></thead><tbody>${items.map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.v)}</td><td>${esc(r.lim)}</td><td>${r.kind === 'hard' ? (r.reg ? 'No one: RBI limit' : 'No one: hard stop') : r.lvl + (r.ml && S.auto && POL.model.on ? ', or the model' : '')}</td></tr>`).join('')}</tbody></table>` : '<p>None.</p>'}${req && req.mits && req.mits.length ? `<p style="margin-top:8px">Mitigants given: ${esc(listAnd(req.mits.map(x => lc1(MITS[x].t))))}.</p>` : ''}
  <h3>System findings</h3><p>${esc('Rules engine on policy version ' + POL.ver + ': ' + plural(ev.R.filter(r => r.st === 'pass').length, 'rule') + ' met, ' + plural(items.length, 'item') + ' not met, ' + plural(ev.needs.length, 'item') + ' waiting.' + (ev.ml ? ' Deviation model ' + MODEL.id + ' ' + POL.model.ver + ': predicted risk ' + pct(ev.ml.p) + ' against a typical ' + pct(ev.ml.pt) + '.' : ''))}</p>
  <h3>Decision</h3><p>${esc(decisionTxt(c, ev))}</p>
  <h3>Conditions</h3><ul>${cs.map(x => `<li>${esc(x.t)} <span class="muted">(${x.w === 'now' ? 'before sanction' : x.w === 'cp' ? 'before the first disbursement' : 'after disbursement'})</span></li>`).join('')}</ul>
  <footer>Written ${fdt(S8(CLK))} from the case record. Home loan policy version ${POL.ver}.</footer></article>`;
}

/* ---------- sanction pack (left) ---------- */
function sanLeft() {
  const c = C(), ev = E, st = ev.st;
  if (st.k === 'declined') return rejLeft(c);
  if (st.k !== 'approved') return `<div class="pf-h"><div><h2>Sanction</h2><p>Opens once the case is approved.</p></div></div>`;
  const k = kfsOf(c, ev), tr = tranchesOf(c), v = c.v, cs = condsOf(c, ev), san = c.w.san, ro = S.role !== 'cm';
  const terms = `<section class="panel"><div class="ph"><h3>Sanctioned terms</h3><span class="note">Valid for ${LENDER.validity} days, to ${fdate(addDays(sanDate(c), LENDER.validity))}</span></div><div class="pb"><div class="fgrid one">
   ${fr('Loan amount', lakh(v.loan) + (v.loan !== v.applied.loan ? ` <span class="muted" style="font-weight:600">(asked ${lakh(v.applied.loan)})</span>` : ''))}${fr('Purpose', esc(v.purpose))}${fr('Tenure', yrsTxt(v.tenure) + ', ' + v.tenure + ' EMIs')}
   ${fr('Interest rate', v.roi.toFixed(2) + '% a year, floating' + (c.colend ? ', blended' : ''))}
   ${c.colend ? '' : fr('Benchmark and spread', 'Housing Reference Rate ' + LENDER.hrr.toFixed(2) + '% minus ' + (LENDER.hrr - v.roi).toFixed(2) + '%')}
   ${fr('Reset', 'Every 3 months, on 1 Jan, Apr, Jul and Oct', 'Fields the draft RBI interest rate directions would require')}
   ${fr('EMI', inr(k.emi), c.variant === 'uc' || c.variant === 'selfcon' ? 'Interest only on the amount out, until the full loan is disbursed' : '')}
   ${fr('APR', pct(k.apr, 2), 'All-in yearly cost, including fees')}
   ${fr('Prepayment charges', 'Nil', 'Floating rate, individual borrower, sanctioned after 1 Jan 2026')}
   ${fr('Original documents', 'Kept at the ' + esc(v.branch) + ' branch', 'Returned within 30 days of closure')}</div></div></section>`;
  const cl = c.colend ? `<section class="panel"><div class="ph"><h3>Co-lending</h3><span class="note">RBI Co-Lending Directions, 2025</span></div><div class="pb"><table class="tbl"><thead><tr><th>Lender</th><th class="r">Share</th><th class="r">Amount</th><th class="r">Rate</th></tr></thead><tbody><tr><td>${esc(c.colend.partner)}</td><td class="r">${c.colend.share}%</td><td class="r">${lakh(v.loan * c.colend.share / 100)}</td><td class="r">${c.colend.prate.toFixed(2)}%</td></tr><tr><td>${esc(LENDER.short)}</td><td class="r">${100 - c.colend.share}%</td><td class="r">${lakh(v.loan * (100 - c.colend.share) / 100)}</td><td class="r">${c.colend.orate.toFixed(2)}%</td></tr><tr><td colspan="3"><b>Blended rate in the KFS</b></td><td class="r"><b>${blended(c).toFixed(2)}%</b></td></tr></tbody></table><p class="hint">The partner books its share within 15 days of each disbursement. The KFS names both lenders.</p></div></section>` : '';
  const ch = `<section class="panel"><div class="ph"><h3>Charges</h3><span class="note">Taken from the first disbursement</span></div><div class="pb"><div class="fgrid one">${fr('Processing fee, with GST', inr(k.pf))}${fr('Legal and technical fees, with GST', inr(k.lt))}${fr('CERSAI registration', inr(k.cer))}${fr('<b>Total</b>', inr(k.fees))}${fr('Penal charge for a late EMI', inr(LENDER.penal), 'A fixed charge, never added to the interest rate')}${fr('Bounce charge, with GST', inr(LENDER.bounce))}${fr('Switch to a fixed rate', LENDER.switchFee.toFixed(2) + '% of the principal outstanding')}</div></div></section>`;
  const pm = c.pmay ? pmayOf(c, ev) : null;
  const pmP = pm ? `<section class="panel"><div class="ph"><h3>PMAY-U 2.0 interest subsidy</h3><span class="note">${pm.ok ? 'Eligible, ' + pm.cat : 'Not eligible'}</span></div><div class="pb">${pm.rows.map(r => `<div class="ck"><span></span><div class="ck-n">${esc(r.t)}<small>${esc(r.v)}</small></div><span></span><span class="st ${r.ok ? 'pass' : 'fail'}">${r.ok ? 'Met' : 'Not met'}</span></div>`).join('')}${pm.ok ? `<p class="calc">4% a year on the first ${RS}8 lakh, for up to 12 years. Up to ${RS}1.80 lakh, paid in 5 yearly instalments of ${RS}36,000 into the loan account. We claim it after the first disbursement; it stops if the loan turns bad.</p>` : ''}</div></section>` : `<section class="panel"><div class="ph"><h3>PMAY-U 2.0</h3><span class="note">Not applicable</span></div><div class="pb"><p class="muted" style="margin:2px 0">Household income of ${inr(ev.f.incElig * 12)} a year is above the scheme\u2019s ${RS}9 lakh limit${v.loan > 2500000 ? ', and the loan is above ' + RS + '25 lakh' : ''}.</p></div></section>`;
  const G = { now: 'Before sanction', cp: 'Before the first disbursement', pdd: 'After disbursement' };
  const cp = `<section class="panel"><div class="ph"><h3>Conditions</h3><span class="note">${plural(cs.filter(x => x.w === 'cp').length, 'condition')} before the first disbursement</span></div><div class="pb">${cs.map(x => `<div class="cgi">${ic(x.w === 'pdd' ? 'clock' : 'flag')}<div><b>${esc(x.t)}</b><small>${esc(x.d || '')}</small></div><span class="when ${x.w}">${G[x.w]}</span></div>`).join('')}</div></section>`;
  const dp = `<section class="panel"><div class="ph"><h3>Disbursement plan</h3><span class="note">${plural(tr.rows.length, 'payment')}</span></div><div class="pb" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Stage</th><th class="r">Amount</th><th>When</th><th>Paid to</th></tr></thead><tbody>${tr.rows.map(r => `<tr><td><b>${esc(r.t)}</b>${r.s ? `<br><span class="muted">${esc(r.s)}</span>` : ''}</td><td class="r">${inr(Math.round(r.amt))}</td><td class="muted">${esc(r.when)}</td><td>${esc(r.pay)}</td></tr>`).join('')}</tbody></table>${tr.note ? `<p class="hint">${esc(tr.note)}${c.colend ? ' Each payment is split ' + c.colend.share + ':' + (100 - c.colend.share) + ' with ' + esc(c.colend.partner) + '.' : ''}</p>` : ''}</div></section>`;
  const step = (done, t, s, btn) => `<div class="cgi">${ic(done ? 'check' : 'clock')}<div><b>${t}</b><small>${s}</small></div>${btn || (done ? '<span class="when done">Done</span>' : '<span class="when">To do</span>')}</div>`;
  const sp = `<section class="panel" id="sanSteps"><div class="ph"><h3>Sanction steps</h3></div><div class="pb">
   ${step(true, 'Approved', esc(st.by === 'SYS' ? 'By the system, ' + fdt(sanDate(c)) : 'By ' + byName(st.by) + ', ' + fdt(c.w.dec.at)))}
   ${step(!!san.sent, 'Sanction letter and KFS sent', san.sent ? 'Email and SMS, ' + fdt(san.sent) + '. KFS valid 3 working days' : 'To the registered email and mobile', !san.sent && !ro ? `<button class="btn btn-p btn-sm" data-act="sansend">${ic('send')}Send</button>` : '')}
   ${step(!!san.accepted, 'Customer accepted', san.accepted ? 'OTP on the registered mobile, ' + fdt(san.accepted) : 'By OTP or a signed copy', accBtn(c, ro))}
   ${step(!!san.handoff, 'Handed off to operations', san.handoff ? fdt(san.handoff) : 'For the conditions check and the first disbursement', san.accepted && !san.handoff && !ro ? `<button class="btn btn-ok btn-sm" data-act="handoff">${ic('handoff')}Hand off</button>` : '')}</div></section>`;
  return `<div class="pf-h"><div><h2>Sanction pack</h2><p>Built from the decision. The letter, the KFS and the handoff note on the right use these figures.</p></div></div><div class="stack">${sp}${terms}${cl}${ch}${pmP}${cp}${dp}</div>`;
}
function rejLeft(c) {
  const d = c.w.dec;
  return `<div class="pf-h"><div><h2>Rejection</h2><p>The customer gets the main reasons in writing, in the language they chose.</p></div></div><div class="stack">
  <section class="panel"><div class="ph"><h3>Decision</h3></div><div class="pb"><div class="fgrid one">${fr('Declined by', esc(d.by === 'SYS' ? 'The system, at pre-screen' : byName(d.by) + ', ' + d.by))}${fr('When', fdt(d.at))}${fr('Language', c.lang === 'hi' ? 'Hindi, with an English copy' : 'English')}</div>${d.note ? `<p class="qt">${esc(d.note)}</p>` : ''}</div></section>
  <section class="panel"><div class="ph"><h3>Reasons in the letter</h3></div><div class="pb">${(d.reasons || []).map(k => `<div class="cgi">${ic('x')}<div><b>${esc(REJ[k].t)}</b><small>${esc(REJ[k].en)}</small></div><span></span></div>`).join('')}</div></section>
  <section class="panel"><div class="ph"><h3>Letter</h3></div><div class="pb">${c.w.letter ? `<div class="okline">${ic('check')}<div>Sent ${fdt(c.w.letter.sent)} by ${esc(lc1(c.w.letter.ch))}.</div></div>` : S.role === 'cm' ? `<button class="btn btn-p" data-act="letter">${ic('send')}Send the letter</button>` : '<p class="muted">Not sent yet.</p>'}</div></section></div>`;
}

/* ---------- documents (right) ---------- */
function langBtns(lang) { return `<button class="${lang !== 'hi' ? 'on' : ''}" data-act="lang" data-v="en">English</button><button class="${lang === 'hi' ? 'on' : ''}" data-act="lang" data-v="hi" lang="hi">हिन्दी</button>`; }
function sanRight() {
  const c = C(), st = E.st, lang = S.lang || c.lang, hi = lang === 'hi';
  if (st.k === 'declined') return `<div class="dtabs"><div class="seg2"><button class="on">Rejection letter</button></div><div class="seg2" role="group" aria-label="Language">${langBtns(lang)}</div><div class="act"><button class="btn btn-s btn-sm" data-act="print">${ic('print')}Print</button></div></div>${rejLetter(c, hi)}`;
  if (st.k !== 'approved') return `<div class="tk-wait">${ic('lock')}<span>The sanction letter, the KFS and the handoff note appear here once the case is approved.</span></div>`;
  const t = S.dtab;
  return `<div class="dtabs"><div class="seg2" role="group" aria-label="Document">${[['letter', 'Sanction letter'], ['kfs', 'Key Fact Statement'], ['handoff', 'Handoff note']].map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="dtab" data-v="${k}">${l}</button>`).join('')}</div>${t !== 'handoff' ? `<div class="seg2" role="group" aria-label="Language">${langBtns(lang)}</div>` : ''}<div class="act"><button class="btn btn-s btn-sm" data-act="print">${ic('print')}Print</button></div></div>${t === 'letter' ? sanLetter(c, hi) : t === 'kfs' ? kfsDoc(c, hi) : handoffDoc(c)}`;
}
function sanLetter(c, hi) {
  const ev = E, k = kfsOf(c, ev), v = c.v, tr = tranchesOf(c), cs = condsOf(c, ev), date = sanDate(c), valid = addDays(date, LENDER.validity), san = c.w.san;
  const names = caseName(c), first = listAnd(c.apps.map(a => a.name.split(' ')[0])), pm = c.pmay ? pmayOf(c, ev) : null;
  const T = (a, b) => `<tr><th>${a}</th><td>${b}</td></tr>`;
  const cpL = cs.filter(x => x.w === 'cp' || x.w === 'now'), pdL = cs.filter(x => x.w === 'pdd');
  if (hi) {
    return `<div class="paper" id="pdoc" lang="hi">${lhHTML('संदर्भ: SAN/' + v.appNo, fdate(date))}<p><b>${esc(names)}</b><br>${esc(c.apps[0].addr)}</p><h2>गृह ऋण की स्वीकृति</h2>
    <p>प्रिय ${esc(first)},</p><p>गृह ऋण के लिए आवेदन (आवेदन क्रमांक ${esc(v.appNo)}, दिनांक ${fdate(v.login)}) करने के लिए धन्यवाद। हमें यह बताते हुए प्रसन्नता है कि नीचे दी गई शर्तों पर आपका ऋण स्वीकृत किया गया है। मुख्य तथ्य विवरण (KFS) संलग्न है; ऋण अनुबंध पर हस्ताक्षर करने से पहले कृपया इसे ध्यान से पढ़ें।</p>
    <table class="ptbl"><tbody>${T('स्वीकृत ऋण राशि', inr(v.loan))}${T('ऋण का उद्देश्य', PURP_HI[c.variant])}${T('संपत्ति', esc(c.prop.addr))}${T('अवधि', v.tenure + ' महीने (' + trimz((v.tenure / 12).toFixed(1)) + ' वर्ष)')}${T('ब्याज दर', v.roi.toFixed(2) + '% प्रति वर्ष, परिवर्तनशील (फ्लोटिंग)')}${c.colend ? T('सह-ऋणदाता', esc(c.colend.partner) + ' (' + c.colend.share + '%) और ' + esc(LENDER.short) + ' (' + (100 - c.colend.share) + '%); मिश्रित दर ' + blended(c).toFixed(2) + '%') : T('बेंचमार्क', 'हाउसिंग रेफरेंस रेट ' + LENDER.hrr.toFixed(2) + '% घटा ' + (LENDER.hrr - v.roi).toFixed(2) + '%; हर 3 महीने में समीक्षा')}${T('मासिक किस्त (EMI)', inr(k.emi))}${T('वार्षिक प्रतिशत दर (APR)', pct(k.apr, 2))}${T('प्रोसेसिंग शुल्क (GST सहित)', inr(k.pf))}${T('समय-पूर्व भुगतान शुल्क', 'शून्य')}${T('देर से किस्त पर दंड शुल्क', inr(LENDER.penal) + ' प्रति किस्त (ब्याज दर में नहीं जोड़ा जाएगा)')}${T('स्वीकृति की वैधता', fdate(valid) + ' तक')}</tbody></table>
    <h3>ऋण का वितरण</h3><p>${tr.rows.length > 1 ? 'ऋण ' + tr.rows.length + ' चरणों में दिया जाएगा।' + (c.variant === 'selfcon' ? ' हर चरण से पहले हमारी तकनीकी टीम साइट पर आकर निर्माण की प्रगति देखेगी।' : '') : 'ऋण एक बार में दिया जाएगा।'}</p><table class="ptbl"><thead><tr><th>चरण</th><th class="r">राशि</th></tr></thead><tbody>${tr.rows.map(r => `<tr><td>${esc(STAGE_HI[r.t] || r.t)}</td><td class="r">${inr(Math.round(r.amt))}</td></tr>`).join('')}</tbody></table>
    <h3>पहले वितरण से पहले की शर्तें</h3><ol>${cpL.map(x => `<li>${esc(hiOf(x.t))}</li>`).join('')}</ol>
    ${pdL.length ? `<h3>वितरण के बाद</h3><ul>${pdL.map(x => `<li>${esc(hiOf(x.t))}</li>`).join('')}</ul>` : ''}
    ${pm && pm.ok ? `<h3>प्रधानमंत्री आवास योजना – शहरी 2.0 ब्याज सब्सिडी</h3><p>आप इस योजना की ब्याज सब्सिडी के पात्र हैं (${pm.cat} श्रेणी)। पहले ${RS}8 लाख के ऋण पर 4% की सब्सिडी मिलती है, अधिकतम ${RS}1.80 लाख, जो 5 वार्षिक किस्तों में सीधे आपके ऋण खाते में जमा होगी। पहले वितरण के बाद हम आपकी ओर से दावा दाखिल करेंगे।</p>` : ''}
    <h3>आपके मूल संपत्ति दस्तावेज़</h3><p>ये दस्तावेज़ हमारी ${esc(v.branch)} शाखा में सुरक्षित रखे जाएंगे। पूरा ऋण चुकाने के 30 दिनों के भीतर इन्हें इसी शाखा से, या आपकी चुनी हुई किसी अन्य शाखा से, लौटा दिया जाएगा। हमारी ओर से देरी होने पर हम हर दिन की देरी के लिए ${RS}5,000 का मुआवज़ा देंगे।</p>
    <h3>ब्याज दर बदलने पर</h3><p>आपकी ब्याज दर हमारी हाउसिंग रेफरेंस रेट से जुड़ी है। इसमें बदलाव होने पर हम आपको बताएंगे कि आपकी EMI या अवधि पर क्या असर होगा। आप चाहें तो EMI बढ़ा सकते हैं, अवधि बढ़ा सकते हैं (आयु सीमा के भीतर), या बकाया मूलधन के ${LENDER.switchFee.toFixed(2)}% के एकमुश्त शुल्क पर फिक्स्ड दर चुन सकते हैं।</p>
    <div class="sig"><div>${esc(LENDER.name)} की ओर से<br>अधिकृत हस्ताक्षरकर्ता<br><span class="muted">${approverTxt(c, true)}</span></div><div>स्वीकार है<br>${esc(names)}</div></div>
    <p class="pnote">आपके पंजीकृत ईमेल और मोबाइल पर भेजा गया${san.sent ? ': ' + fdt(san.sent) : ' (क्रेडिट मैनेजर द्वारा भेजे जाने पर)'}। यह पत्र आपकी चुनी हुई भाषा में है; इसकी अंग्रेज़ी प्रति भी साथ भेजी जाती है।</p></div>`;
  }
  return `<div class="paper" id="pdoc">${lhHTML('Ref. SAN/' + v.appNo, fdate(date))}<p><b>${esc(names)}</b><br>${esc(c.apps[0].addr)}</p><h2>Sanction of your home loan</h2>
  <p>Dear ${esc(first)},</p><p>Thank you for applying for a home loan (application ${esc(v.appNo)}, ${fdate(v.login)}). We are pleased to sanction your loan on the terms below. The Key Fact Statement (KFS) is attached; please read it before you sign the loan agreement.</p>
  <table class="ptbl"><tbody>${T('Loan amount sanctioned', inr(v.loan) + (v.loan !== v.applied.loan ? `<small>You asked for ${inr(v.applied.loan)}</small>` : ''))}${T('Purpose', esc(v.purpose))}${T('Property', esc(c.prop.addr))}${T('Tenure', v.tenure + ' months (' + yrsTxt(v.tenure) + ')')}${T('Interest rate', v.roi.toFixed(2) + '% a year, floating')}${c.colend ? T('Lenders', esc(c.colend.partner) + ' (' + c.colend.share + '% at ' + c.colend.prate.toFixed(2) + '%) and ' + esc(LENDER.short) + ' (' + (100 - c.colend.share) + '% at ' + c.colend.orate.toFixed(2) + '%). Blended rate ' + blended(c).toFixed(2) + '%') : T('Benchmark, spread and reset', 'Housing Reference Rate ' + LENDER.hrr.toFixed(2) + '% minus ' + (LENDER.hrr - v.roi).toFixed(2) + '%. Reviewed every 3 months')}${T('EMI', inr(k.emi) + (c.variant === 'uc' || c.variant === 'selfcon' ? '<small>Interest only on the amount disbursed until the full loan is out</small>' : ''))}${T('Annual Percentage Rate (APR)', pct(k.apr, 2))}${T('Processing fee, with GST', inr(k.pf))}${T('Prepayment charges', 'Nil')}${T('Penal charge for a late EMI', inr(LENDER.penal) + ' per EMI. It is never added to the interest rate')}${T('Sanction valid until', fdate(valid))}</tbody></table>
  <h3>Disbursement</h3><table class="ptbl"><thead><tr><th>Stage</th><th class="r">Amount</th><th>When</th></tr></thead><tbody>${tr.rows.map(r => `<tr><td>${esc(r.t)}</td><td class="r">${inr(Math.round(r.amt))}</td><td>${esc(r.when)}</td></tr>`).join('')}</tbody></table>
  <h3>Before the first disbursement</h3><ol>${cpL.map(x => `<li>${esc(x.t)}</li>`).join('')}</ol>
  ${pdL.length ? `<h3>After disbursement</h3><ul>${pdL.map(x => `<li>${esc(x.t)}</li>`).join('')}</ul>` : ''}
  ${pm && pm.ok ? `<h3>PMAY-U 2.0 interest subsidy</h3><p>You are eligible (${pm.cat}). The subsidy is 4% a year on the first ${RS}8 lakh of the loan, up to ${RS}1.80 lakh, paid into your loan account in 5 yearly instalments. We file the claim after the first disbursement.</p>` : ''}
  <h3>Your original property documents</h3><p>We will keep them at our ${esc(v.branch)} branch. We will return them at that branch, or another branch you choose, within 30 days of full repayment. If we are late for reasons on our side, we will pay you ${RS}5,000 for each day of delay.</p>
  <h3>If the interest rate changes</h3><p>Your rate is linked to our Housing Reference Rate. When it changes, we will tell you how your EMI or tenure changes. You can choose a higher EMI, a longer tenure within the age limit, or a fixed rate for a one-time charge of ${LENDER.switchFee.toFixed(2)}% of the principal outstanding.</p>
  <div class="sig"><div>For ${esc(LENDER.name)}<br>Authorised signatory<br><span class="muted">${approverTxt(c, false)}</span></div><div>Accepted<br>${esc(names)}</div></div>
  <p class="pnote">${san.sent ? 'Sent by email and SMS to your registered contacts on ' + fdt(san.sent) + '.' : 'Not sent yet. The credit manager sends it from the sanction steps.'} ${san.accepted ? '<span class="stamp">' + ic('check') + 'Accepted ' + fdt(san.accepted) + '</span>' : ''}</p></div>`;
}
function kfsDoc(c, hi) {
  const ev = E, k = kfsOf(c, ev), v = c.v, tr = tranchesOf(c), L = (en, h) => hi ? h : en, date = sanDate(c), valid = addWD(date, 3);
  const pre = c.variant === 'uc' || c.variant === 'selfcon';
  const P1 = [
    [L('Loan amount', 'ऋण राशि'), inr(k.L)],
    [L('Disbursement', 'वितरण'), tr.rows.length > 1 ? L('In ' + tr.rows.length + ' stages, as in the sanction letter', tr.rows.length + ' चरणों में, स्वीकृति पत्र के अनुसार') : L('In one go', 'एक बार में')],
    [L('Loan term', 'ऋण अवधि'), v.tenure + L(' months', ' महीने')],
    [L('Instalments', 'किस्तें'), hi ? v.tenure + ' मासिक किस्तें (EMI), प्रत्येक ' + inr(k.emi) + (pre ? '। पूरा ऋण मिलने तक केवल ब्याज' : '') : v.tenure + ' monthly EMIs of ' + inr(k.emi) + (pre ? '. Interest only until the full loan is out' : '')],
    [L('Interest rate and type', 'ब्याज दर और प्रकार'), v.roi.toFixed(2) + '% ' + L('a year, floating', 'प्रति वर्ष, परिवर्तनशील')],
    [L('Benchmark, spread and reset', 'बेंचमार्क, स्प्रेड और रीसेट'), c.colend ? L('Blended rate of the two lenders: ', 'दोनों ऋणदाताओं की मिश्रित दर: ') + blended(c).toFixed(2) + '%' : (hi ? 'हाउसिंग रेफरेंस रेट ' + LENDER.hrr.toFixed(2) + '% घटा ' + (LENDER.hrr - v.roi).toFixed(2) + '%; हर 3 महीने में रीसेट' : 'Housing Reference Rate ' + LENDER.hrr.toFixed(2) + '% minus ' + (LENDER.hrr - v.roi).toFixed(2) + '%. Reset every 3 months')],
    [L('Fees payable to us', 'हमें देय शुल्क'), L('Processing fee, with GST: ', 'प्रोसेसिंग शुल्क, GST सहित: ') + inr(k.pf)],
    [L('Fees paid to others through us', 'हमारे माध्यम से अन्य पक्षों को देय शुल्क'), L('Legal and technical: ', 'कानूनी और तकनीकी: ') + inr(k.lt) + L('; CERSAI: ', '; CERSAI: ') + inr(k.cer)],
    [L('Annual Percentage Rate (APR)', 'वार्षिक प्रतिशत दर (APR)'), '<b>' + pct(k.apr, 2) + '</b>'],
    [L('Penal charge for a late EMI', 'देर से किस्त पर दंड शुल्क'), inr(LENDER.penal) + L(' per EMI, not added to the interest rate', ' प्रति किस्त, ब्याज दर में नहीं जोड़ा जाएगा')],
    [L('Bounce charge', 'बाउंस शुल्क'), inr(LENDER.bounce) + L(', with GST', ', GST सहित')],
    [L('Prepayment or foreclosure', 'समय-पूर्व भुगतान या फोरक्लोज़र'), L('Nil', 'शून्य')],
    [L('Switch to a fixed rate', 'फिक्स्ड दर पर बदलना'), LENDER.switchFee.toFixed(2) + '% ' + L('of the principal outstanding, once', 'बकाया मूलधन का, एक बार')]
  ];
  const P2 = [
    [L('Recovery agents', 'वसूली एजेंट'), L('Only agents listed on our website, carrying our identity card.', 'केवल हमारी वेबसाइट पर सूचीबद्ध एजेंट, जिनके पास हमारा पहचान-पत्र हो।')],
    [L('Grievance redressal', 'शिकायत निवारण'), esc(LENDER.nodal) + '. ' + L('Phone ', 'फ़ोन ') + esc(LENDER.phone)],
    [L('Transfer of the loan', 'ऋण का हस्तांतरण'), L('The loan may be transferred or securitised under RBI rules. We will tell you if it is.', 'RBI के नियमों के तहत ऋण हस्तांतरित किया जा सकता है। ऐसा होने पर हम आपको बताएंगे।')]
  ];
  if (c.colend) P2.push([L('Co-lending', 'सह-ऋण'), hi ? esc(c.colend.partner) + ' ' + c.colend.share + '% (' + c.colend.prate.toFixed(2) + '%) और ' + esc(LENDER.short) + ' ' + (100 - c.colend.share) + '% (' + c.colend.orate.toFixed(2) + '%); मिश्रित दर ' + blended(c).toFixed(2) + '%' : esc(c.colend.partner) + ' lends ' + c.colend.share + '% at ' + c.colend.prate.toFixed(2) + '% and ' + esc(LENDER.short) + ' lends ' + (100 - c.colend.share) + '% at ' + c.colend.orate.toFixed(2) + '%. Blended rate ' + blended(c).toFixed(2) + '%']);
  P2.push([L('Validity of this KFS', 'इस KFS की वैधता'), L('3 working days, until ', '3 कार्य दिवस, ') + fdate(valid) + (hi ? ' तक' : '')]);
  const tb = rows => `<table class="ptbl"><tbody>${rows.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join('')}</tbody></table>`;
  return `<div class="paper" id="pdoc"${hi ? ' lang="hi"' : ''}>${lhHTML('KFS/' + v.appNo, fdate(date))}<h2>${L('Key Fact Statement', 'मुख्य तथ्य विवरण (KFS)')}</h2><p class="muted">${esc(caseName(c))}. ${L('Home loan', 'गृह ऋण')}, ${esc(v.appNo)}</p>
  <div class="kh"><h3>${L('Part 1: interest rate and fees', 'भाग 1: ब्याज दर और शुल्क')}</h3></div>${tb(P1)}
  <div class="kh"><h3>${L('Part 2: other information', 'भाग 2: अन्य जानकारी')}</h3></div>${tb(P2)}
  <div class="kh"><h3>${L('How the APR is worked out', 'APR की गणना')}</h3></div><table class="ptbl"><tbody>
  <tr><th>${L('Loan amount', 'ऋण राशि')}</th><td class="r">${inr(k.L)}</td></tr><tr><th>${L('Less fees taken at disbursement', 'वितरण पर काटे गए शुल्क')}</th><td class="r">${MINUS}${inr(k.fees)}</td></tr><tr><th>${L('Net amount you receive', 'आपको मिलने वाली शुद्ध राशि')}</th><td class="r">${inr(k.net)}</td></tr><tr><th>${L('You repay', 'आप चुकाएंगे')}</th><td class="r">${v.tenure} \u00D7 ${inr(k.emi)} = ${inr(Math.round(k.emi * v.tenure))}</td></tr><tr><th>${L('APR: the yearly rate that makes the two equal', 'APR: वह वार्षिक दर जिस पर दोनों बराबर होते हैं')}</th><td class="r"><b>${pct(k.apr, 2)}</b></td></tr></tbody></table>
  <p class="muted" style="font-size:11.5px">${L('For illustration the whole loan is treated as paid out on day one. With staged payments, the interest before the full loan is out is lower.', 'उदाहरण के लिए पूरा ऋण पहले दिन दिया गया माना है। चरणों में वितरण होने पर, पूरा ऋण मिलने से पहले का ब्याज कम होगा।')}</p>
  <div class="kh"><h3>${L('Repayment schedule: first and last EMIs', 'पुनर्भुगतान अनुसूची: पहली और आख़िरी किस्तें')}</h3></div><table class="ptbl"><thead><tr><th>${L('EMI', 'किस्त')}</th><th class="r">${L('Amount', 'राशि')}</th><th class="r">${L('Interest', 'ब्याज')}</th><th class="r">${L('Principal', 'मूलधन')}</th><th class="r">${L('Balance', 'शेष')}</th></tr></thead><tbody>${k.rows.map(r => `<tr><td>${r.k}</td><td class="r">${inr(Math.round(r.emi))}</td><td class="r">${inr(Math.round(r.it))}</td><td class="r">${inr(Math.round(r.pr))}</td><td class="r">${inr(Math.round(r.bal))}</td></tr>`).join('')}</tbody></table>
  <p class="pnote">${L('Given before you sign the loan agreement, as RBI requires. Charges not listed here cannot be taken without your consent.', 'RBI के नियम के अनुसार ऋण अनुबंध पर हस्ताक्षर से पहले दिया गया। यहाँ न लिखे गए शुल्क आपकी सहमति के बिना नहीं लिए जा सकते।')}</p></div>`;
}
function handoffDoc(c) {
  const ev = E, k = kfsOf(c, ev), v = c.v, tr = tranchesOf(c), cs = condsOf(c, ev), san = c.w.san, first = tr.rows[0];
  const cpDocs = c.docs.filter(d => d.need === 'cp');
  return `<div class="paper" id="pdoc">${lhHTML('OPS/' + v.appNo, fdate(san.handoff || S8(CLK)))}<h2>Handoff to operations</h2><p class="muted">${esc(caseName(c))}. ${san.handoff ? 'Handed off ' + fdt(san.handoff) : 'Draft: hands off once the customer accepts'}.</p>
  <table class="ptbl"><tbody><tr><th>Sanctioned</th><td>${lakh(v.loan)} over ${yrsTxt(v.tenure)} at ${v.roi.toFixed(2)}%, EMI ${inr(k.emi)}</td></tr><tr><th>Approved by</th><td>${approverTxt(c, false)}</td></tr><tr><th>Customer acceptance</th><td>${san.accepted ? 'OTP, ' + fdt(san.accepted) : 'Pending'}</td></tr><tr><th>First payment</th><td>${inr(Math.round(first.amt))} to ${esc(first.pay)}</td></tr><tr><th>Fees to deduct</th><td>${inr(k.fees)}</td></tr></tbody></table>
  <h3>Check before the first disbursement</h3><table class="ptbl"><thead><tr><th>Condition</th><th>Status</th></tr></thead><tbody>${cs.filter(x => x.w !== 'pdd').map(x => `<tr><td>${esc(x.t)}<small>${esc(x.d || '')}</small></td><td>${cpDocs.some(d => d.up && x.t.toLowerCase().indexOf(d.t.toLowerCase().split(' ')[0]) >= 0) ? 'Received' : 'Pending'}</td></tr>`).join('')}</tbody></table>
  <h3>Disbursement plan</h3><table class="ptbl"><thead><tr><th>Stage</th><th class="r">Amount</th><th>Paid to</th></tr></thead><tbody>${tr.rows.map(r => `<tr><td>${esc(r.t)}</td><td class="r">${inr(Math.round(r.amt))}</td><td>${esc(r.pay)}</td></tr>`).join('')}</tbody></table>
  <h3>After disbursement</h3><ul>${cs.filter(x => x.w === 'pdd').map(x => `<li>${esc(x.t)}</li>`).join('')}</ul>
  ${c.colend ? `<h3>Co-lending</h3><p>Book ${esc(c.colend.partner)}\u2019s ${c.colend.share}% share of each payment within 15 days. Partner reference ${esc(c.colend.ref)}.</p>` : ''}
  ${c.pmay && pmayOf(c, ev).ok ? '<h3>PMAY-U 2.0</h3><p>File the interest subsidy claim after the first disbursement. Family Aadhaar details and the undertakings are in the case file.</p>' : ''}</div>`;
}
function rejLetter(c, hi) {
  const d = c.w.dec, v = c.v, names = caseName(c), first = listAnd(c.apps.map(a => a.name.split(' ')[0])), date = d.at, court = (d.reasons || []).includes('r_legal');
  if (hi) return `<div class="paper" id="pdoc" lang="hi">${lhHTML('संदर्भ: REJ/' + v.appNo, fdate(date))}<p><b>${esc(names)}</b><br>${esc(c.apps[0].addr)}</p><h2>गृह ऋण के लिए आपका आवेदन</h2><p>प्रिय ${esc(first)},</p><p>गृह ऋण के लिए आवेदन (आवेदन क्रमांक ${esc(v.appNo)}, दिनांक ${fdate(v.login)}) करने के लिए धन्यवाद। हमने आपके आवेदन को ध्यान से देखा है, और हमें खेद है कि हम इसे स्वीकृत नहीं कर सकते।</p><h3>मुख्य कारण</h3><ol>${(d.reasons || []).map(k => `<li>${esc(REJ[k].hi)}</li>`).join('')}</ol><p>यदि आपको लगता है कि हमसे कोई चूक हुई है, या परिस्थितियाँ बदलती हैं${court ? ' (जैसे प्लॉट से जुड़ा अदालती मामला सुलझ जाता है)' : ''}, तो कृपया अपनी शाखा से बात करें। आप हमारे शिकायत निवारण अधिकारी को भी लिख सकते हैं: ${esc(LENDER.nodal)}। 30 दिनों में संतोषजनक उत्तर न मिलने पर आप हमारी वेबसाइट ${esc(LENDER.web)} पर दी गई शिकायत नीति के अनुसार मामला आगे बढ़ा सकते हैं।</p><div class="sig"><div>भवदीय,<br>${esc(LENDER.name)} की ओर से<br>अधिकृत हस्ताक्षरकर्ता</div></div><p class="pnote">${c.w.letter ? 'भेजा गया: ' + fdt(c.w.letter.sent) + '।' : 'अभी भेजा नहीं गया।'} इसकी अंग्रेज़ी प्रति भी साथ भेजी जाती है।</p></div>`;
  return `<div class="paper" id="pdoc">${lhHTML('Ref. REJ/' + v.appNo, fdate(date))}<p><b>${esc(names)}</b><br>${esc(c.apps[0].addr)}</p><h2>Your application for a home loan</h2><p>Dear ${esc(first)},</p><p>Thank you for applying to us for a home loan (application ${esc(v.appNo)}, ${fdate(v.login)}). We have looked at it carefully, and we are sorry that we cannot approve it.</p><h3>The main reasons</h3><ol>${(d.reasons || []).map(k => `<li>${esc(REJ[k].en)}</li>`).join('')}</ol><p>If you think we have got something wrong, or if things change${court ? ' (for example, once the court case about the plot is settled)' : ''}, please talk to your branch. You can also write to our grievance officer: ${esc(LENDER.nodal)}. If you are not satisfied with the reply within 30 days, you can take it further as set out in the grievance policy on ${esc(LENDER.web)}.</p><div class="sig"><div>Yours sincerely,<br>For ${esc(LENDER.name)}<br>Authorised signatory</div></div><p class="pnote">${c.w.letter ? 'Sent ' + fdt(c.w.letter.sent) + ' by ' + esc(lc1(c.w.letter.ch)) + '.' : 'Not sent yet.'}</p></div>`;
}

/* =====================================================================
   Policy studio
   ===================================================================== */
function getP(o, path) { return path.split('.').reduce((x, k) => x == null ? x : x[k], o); }
function setP(o, path, v) { const ks = path.split('.'); let x = o; for (let i = 0; i < ks.length - 1; i++) x = x[ks[i]]; x[ks[ks.length - 1]] = v; }
function allPaths() {
  const P = [];
  ['salaried', 'selfdoc', 'aip'].forEach(g => [0, 1, 2, 3].forEach(i => P.push(['foir.' + g + '.' + i, 'FOIR, ' + lc1(PROG[g]) + ', income ' + lc1(BANDS[i])])));
  Object.keys(CATS).forEach(k => [0, 1, 2].forEach(i => P.push(['ltv.' + k + '.' + i, 'LTV, ' + lc1(CATS[k]) + ', loans ' + lc1(SLABS[i])])));
  [['dev.foirL1', 'FOIR points over the cap the credit manager can approve'], ['dev.foirL2', 'FOIR points over the cap that L2 can approve'], ['dev.foirL3', 'FOIR points over the cap that L3 can approve'], ['dev.ltvL2', 'LTV points over the policy cap that L2 can approve'], ['dev.scoreMin', 'Minimum bureau score'], ['dev.scoreL2', 'Lowest score L2 can approve'], ['dev.scoreL3', 'Lowest score L3 can approve'], ['dev.ageL2', 'Years over the age limit that L2 can approve'], ['dev.planTol', 'Plan deviation within tolerance'], ['dev.planMax', 'Plan deviation L2 can approve'], ['auth.L1', 'L1 sanction limit'], ['auth.L2', 'L2 sanction limit'], ['auth.L3', 'L3 sanction limit'], ['sysAuth', 'System sanction limit'], ['bump', 'Items that move a case up a level'], ['model.approve', 'Model approves at or below'], ['model.reject', 'Model rejects at or above']].forEach(x => P.push(x));
  return P;
}
function pathLabel(p) { const x = allPaths().find(y => y[0] === p); return x ? x[1] : p; }
function fmtP(p, v) { return /^auth|^sysAuth/.test(p) ? lakh(v) : /^foir|^ltv|planTol|planMax|^model/.test(p) ? v + '%' : String(v); }
function diffPol(a, b) { return allPaths().filter(([p]) => getP(a, p) !== getP(b, p)).map(([p, l]) => ({ p, l, from: getP(a, p), to: getP(b, p) })); }
function gin(path, D, ro, w) {
  const v = getP(D, path), live = getP(POL, path), chg = !!S.pdraft && v !== live;
  return `<input class="gin${w ? ' w' : ''}${chg ? ' chg' : ''}" data-g="${path}" type="number" value="${v}"${ro || S.ppend ? ' readonly' : ''} aria-label="${esc(pathLabel(path))}">${chg ? `<span class="was">${esc(fmtP(path, live))}</span>` : ''}`;
}
function policyHTML() {
  const ro = S.role !== 'pol', D = S.pdraft || POL, diffs = S.pdraft ? diffPol(POL, S.pdraft) : [];
  let bar;
  if (S.ppend) bar = `<div class="draft pend">${ic('user')}<div><b>Waiting for ${esc(PEOPLE.checker.name)}, ${esc(PEOPLE.checker.title)}</b><br><span>${plural(S.ppend.changes.length, 'change')} sent ${fdt(S.ppend.at)}. Nothing changes for live cases until it is approved.</span></div><div class="act">${S.role === 'pol' ? `<button class="btn btn-s btn-sm" data-act="pwithdraw">Withdraw</button>` : ''}</div></div>`;
  if (S.ppend && S.role === 'hcp') bar = `<div class="draft pend">${ic('user')}<div><b>${esc(PEOPLE.maker.name)} sent ${plural(S.ppend.changes.length, 'change')} for your approval</b><br><span>${esc(S.ppend.changes.slice(0, 3).map(d => d.l + ': ' + fmtP(d.p, d.from) + ' to ' + fmtP(d.p, d.to)).join('; '))}${S.ppend.changes.length > 3 ? '; and ' + (S.ppend.changes.length - 3) + ' more' : ''}. Sent ${fdt(S.ppend.at)}${S.psim ? ', tested on ' + S.psim.live.n + ' past applications' : ''}.</span></div><div class="act"><button class="btn btn-s btn-sm" data-act="pback">Send back</button><button class="btn btn-ok btn-sm" data-act="pchk">${ic('check')}Approve and make live</button></div></div>`;
  else if (S.pdraft) bar = `<div class="draft">${ic('pen')}<div><b>Draft: ${plural(diffs.length, 'change')}</b>${S.pback ? `<small class="pback">Sent back by ${esc(PEOPLE.checker.name)}, ${fdt(S.pback)}</small>` : ''}<br><span>${diffs.length ? esc(diffs.slice(0, 3).map(d => d.l + ': ' + fmtP(d.p, d.from) + ' to ' + fmtP(d.p, d.to)).join('; ')) + (diffs.length > 3 ? '; and ' + (diffs.length - 3) + ' more' : '') : 'No differences from the live version yet.'}</span></div><div class="act"><button class="btn btn-s btn-sm" data-act="psim"${diffs.length ? '' : ' disabled'}>Test on past cases</button><button class="btn btn-p btn-sm" data-act="psubmit"${diffs.length && S.psim ? '' : ' disabled'} title="${S.psim ? 'Send to the checker' : 'Test the change first'}">Send for approval</button><button class="btn btn-g btn-sm" data-act="pdiscard">Discard</button></div></div>`;
  else if (S.pmsg) bar = `<div class="draft ok">${ic('check')}<div><b>${esc(S.pmsg)}</b></div></div>`;
  else bar = `<div class="draft calm">${ic('lock')}<div><b>Live: version ${POL.ver}</b><br><span>${POL.checker ? 'Made by ' + esc(POL.maker) + ', approved by ' + esc(POL.checker) : 'Changed by ' + esc(POL.maker) + ' on the Admin page, with no second approval'}, ${fdt(POL.at)}. ${S.role === 'hcp' ? 'Changes the credit policy team proposes come to you for approval.' : ro ? 'Only the credit policy team can propose a change.' : 'Change any value below to start a draft.'}</span></div></div>`;
  if (S.pdraft && !S.ppend && S.role !== 'pol') bar = `<div class="draft calm">${ic('pen')}<div><b>${esc(PEOPLE.maker.name)} is working on a draft: ${plural(diffs.length, 'change')}</b><br><span>Live cases use version ${POL.ver} until a draft is approved.${S.role === 'hcp' ? ' It comes to you once it is sent for approval.' : ''}</span></div></div>`;
  const tabs = [['foir', 'FOIR'], ['ltv', 'LTV'], ['dev', 'Deviations and authority'], ['model', 'Deviation model'], ['ver', 'Versions'], ['lender', 'Lender settings']];
  const T = { foir: foirTab, ltv: ltvTab, dev: devTab, model: modelTab, ver: verTab, lender: lenderTab }[S.ptab];
  return `<div class="bk-h"><div><h2>Policy studio</h2><p>Home loan credit policy. Changes made here are tested on past cases, approved by a second person, and can be rolled back.</p></div></div>${bar}
  <div class="dtabs"><div class="seg2" role="tablist" aria-label="Policy sections">${tabs.map(([k, l]) => `<button class="${S.ptab === k ? 'on' : ''}" data-act="ptab" data-v="${k}" role="tab" aria-selected="${S.ptab === k}">${l}</button>`).join('')}</div></div>
  ${S.psim && S.pdraft ? simHTML() : ''}${T(D, ro)}`;
}
function foirTab(D, ro) {
  return `<section class="panel"><div class="ph"><h3>FOIR caps</h3><span class="note">All EMIs, including the new one, as a share of eligible monthly income</span></div><div class="pb" style="overflow-x:auto"><table class="gt"><thead><tr><th>Income programme</th>${BANDS.map(b => `<th class="r">${b}</th>`).join('')}</tr></thead><tbody>${['salaried', 'selfdoc', 'aip'].map(g => `<tr><td><b>${PROG[g]}</b></td>${[0, 1, 2, 3].map(i => `<td class="r">${gin('foir.' + g + '.' + i, D, ro)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="hint">Over the cap is a deviation: up to ${D.dev.foirL2} points needs L2, up to ${D.dev.foirL3} needs L3. More is a hard stop.</p></div></section>`;
}
function ltvTab(D, ro) {
  return `<section class="panel"><div class="ph"><h3>LTV caps</h3><span class="note">Loan as a share of the value used, by property type and loan size</span></div><div class="pb" style="overflow-x:auto"><table class="gt"><thead><tr><th>Property</th>${SLABS.map(s => `<th class="r">${s}</th>`).join('')}</tr></thead><tbody>
  <tr class="lock"><td>RBI cap <span class="locked">${ic('lock')}Set by RBI</span><small>HFC Directions, 2025, para 58</small></td>${[0, 1, 2].map(i => `<td class="r">${D.ltv.reg[i]}%</td>`).join('')}</tr>
  ${Object.keys(CATS).map(k => `<tr><td><b>${CATS[k]}</b></td>${[0, 1, 2].map(i => `<td class="r">${gin('ltv.' + k + '.' + i, D, ro)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="hint">A policy cap above the RBI cap has no effect: the RBI cap always applies, and no level of authority can approve above it.</p></div></section>`;
}
function devTab(D, ro) {
  const rows = [['dev.foirL1', 'FOIR over the cap that L1, the credit manager, can approve', 'points'], ['dev.foirL2', 'FOIR over the cap that L2 can approve', 'points'], ['dev.foirL3', 'FOIR over the cap that L3 can approve', 'points'], ['dev.ltvL2', 'LTV over the policy cap that L2 can approve; L3 above, never over the RBI cap', 'points'], ['dev.scoreMin', 'Minimum bureau score', ''], ['dev.scoreL2', 'Lowest score L2 can approve', ''], ['dev.scoreL3', 'Lowest score L3 can approve; below it is a hard stop', ''], ['dev.ageL2', 'Years over the age limit L2 can approve', 'years'], ['dev.planTol', 'Plan deviation within tolerance', '%'], ['dev.planMax', 'Plan deviation L2 can approve; above it is a hard stop', '%']];
  const au = [['auth.L1', 'L1, Credit Manager, sanctions up to'], ['auth.L2', 'L2, Regional Credit Manager, up to'], ['auth.L3', 'L3, Zonal Credit Manager, up to'], ['sysAuth', 'The system sanctions up to, in automatic mode'], ['bump', 'This many items for approval move a case up one level']];
  return `<div class="g2e"><section class="panel"><div class="ph"><h3>Deviation limits</h3></div><div class="pb"><table class="gt"><tbody>${rows.map(([p, l, u]) => `<tr><td>${esc(l)}</td><td class="r">${gin(p, D, ro)}<small>${u}</small></td></tr>`).join('')}</tbody></table></div></section>
  <section class="panel"><div class="ph"><h3>Sanction authority</h3><span class="note">In rupees</span></div><div class="pb"><table class="gt"><tbody>${au.map(([p, l]) => `<tr><td>${esc(l)}<small>${p === 'bump' ? '' : esc(lakh(getP(D, p)))}</small></td><td class="r">${gin(p, D, ro, p !== 'bump')}</td></tr>`).join('')}<tr class="lock"><td>L4, National Credit Head</td><td class="r">Above L3</td></tr></tbody></table></div></section></div>`;
}
function modelTab(D, ro) {
  const on = POL.model.on, M = MONITOR;
  return `<div class="kill${on ? '' : ' off'}">${ic('power')}<div><b>${on ? 'The model is on' : 'The model is off'}</b><span>${on ? 'It scores every deviation and recommends. The credit manager decides.' : 'Every deviation goes to a person until it is switched back on.'}</span></div>${ro ? '' : `<button class="btn ${on ? 'btn-x' : 'btn-ok'} btn-sm" data-act="kill" style="margin-left:auto">${on ? 'Switch the model off' : 'Switch it back on'}</button>`}</div><p class="hint">The switch works at once and is logged. It needs no second person, so it can be used in an emergency.</p>
  <div class="g2e" style="margin-top:14px"><section class="panel"><div class="ph"><h3>Decision limits</h3><span class="note">Changes need a second person</span></div><div class="pb"><table class="gt"><tbody><tr><td>Recommends approval when the risk is at or below</td><td class="r">${gin('model.approve', D, ro)}</td></tr><tr><td>Recommends rejection at or above</td><td class="r">${gin('model.reject', D, ro)}</td></tr></tbody></table><p class="hint">In between, a person decides with the model\u2019s figure in front of them.</p></div></section>
  <section class="panel"><div class="ph"><h3>Last 30 days</h3></div><div class="pb"><div class="fgrid one">${fr('Deviation cases scored', M.decided)}${fr('Recommended for approval', M.approved)}${fr('Recommended for rejection', M.rejected)}${fr('Left to judgement', M.referred)}${fr('Decided against the model', M.overrides + ' (' + pct(M.overrides / (M.approved + M.rejected) * 100) + ')')}${fr('Late payments, predicted and seen', pct(M.pred) + ' and ' + pct(M.obs))}${fr('Population stability', MODEL.psi + ', stable')}</div></div></section></div>
  <section class="panel" style="margin-top:14px"><div class="ph"><h3>Model card</h3><span class="note">${MODEL.name}, ${MODEL.id} ${POL.model.ver}</span></div><div class="pb"><div class="mc"><div class="fgrid one">${fr('Predicts', esc(MODEL.target))}${fr('Trained on', esc(MODEL.data))}${fr('Validated', esc(MODEL.validated))}${fr('Approved by', esc(MODEL.approved))}${fr('Gini', MODEL.gini)}${fr('Next review', MODEL.review)}</div><div><div class="ins-k">Scores and recommends on</div><div class="scope">${MODEL.inScope.map(x => `<div class="in">${ic('check')}<span>${esc(x)}</span></div>`).join('')}</div><div class="ins-k" style="margin-top:10px">Never scores</div><div class="scope">${MODEL.outScope.map(x => `<div class="out">${ic('x')}<span>${esc(x)}</span></div>`).join('')}</div></div></div><p class="hint">Built for RBI\u2019s draft guidance on model risk (June 2026): a model inventory, a reason for every decision, human override and a kill switch.</p></div></section>`;
}
function cmpHTML(p) {
  const d = diffPol(p, POL);
  return `<div style="grid-column:1/-1;padding:4px 0 12px 72px">${d.length ? `<table class="gt"><thead><tr><th>Setting</th><th class="r">v${p.ver}</th><th class="r">Live v${POL.ver}</th></tr></thead><tbody>${d.map(x => `<tr><td>${esc(x.l)}</td><td class="r">${esc(fmtP(x.p, x.from))}</td><td class="r">${esc(fmtP(x.p, x.to))}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Same as the live version.</p>'}</div>`;
}
function verTab(D, ro) {
  return `<section class="panel"><div class="ph"><h3>Versions</h3><span class="note">Newest first</span></div><div class="pb">${VERS.map(p => `<div class="ver"><span class="v">v${p.ver}</span><p>${esc(p.note)}</p><small>${fdt(p.at)}. ${p.checker ? 'Made by ' + esc(p.maker) + ', approved by ' + esc(p.checker) : 'Changed by ' + esc(p.maker) + ' on the Admin page, with no second approval'}.</small><div class="act">${p.ver === POL.ver ? '<span class="pill2 ok">Live</span>' : `<button class="btn btn-s btn-sm" data-act="pcmp" data-v="${p.ver}">${S.pcmp === p.ver ? 'Hide differences' : 'Compare with live'}</button>${!ro && !S.ppend ? `<button class="btn btn-s btn-sm" data-act="proll" data-v="${p.ver}">${ic('reset')}Roll back to this</button>` : ''}`}</div></div>${S.pcmp === p.ver ? cmpHTML(p) : ''}`).join('')}</div></section>`;
}
function lenderTab(D, ro) {
  const F = [['name', 'Lender name', 'text'], ['hrr', 'Housing Reference Rate (%)', 'number'], ['pfPrime', 'Processing fee, prime (%)', 'number'], ['pfAff', 'Processing fee, affordable (%)', 'number'], ['ltPrime', 'Legal and technical fees, prime (\u20B9)', 'number'], ['ltAff', 'Legal and technical fees, affordable (\u20B9)', 'number'], ['penal', 'Penal charge per late EMI (\u20B9)', 'number'], ['bounce', 'Bounce charge (\u20B9)', 'number'], ['switchFee', 'Switch to a fixed rate (%)', 'number'], ['validity', 'Sanction validity (days)', 'number']];
  return `<section class="panel"><div class="ph"><h3>Lender settings</h3><span class="note">Used on letters and the Key Facts Statement. Changes apply at once.</span></div><div class="pb"><table class="gt"><tbody>${F.map(([k, l, t]) => `<tr><td>${esc(l)}</td><td class="r"><input class="gin w" style="${t === 'text' ? 'width:260px;text-align:left' : ''}" data-l="${k}" type="${t}" value="${esc(LENDER[k])}"${ro ? ' readonly' : ''} aria-label="${esc(l)}"></td></tr>`).join('')}</tbody></table></div></section>`;
}
function simHTML() {
  const a = S.psim.live, b = S.psim.draft;
  const row = (l, x, y, fmt, upBad) => { const d = y - x, cls = Math.abs(d) < 1e-9 ? 'nu' : (d > 0) === upBad ? 'up' : 'dn'; return `<tr><td>${l}</td><td class="r">${fmt(x)}</td><td class="r">${fmt(y)}</td><td class="r"><span class="dlt ${cls}">${Math.abs(d) < 1e-9 ? 'No change' : (d > 0 ? '+' : MINUS) + fmt(Math.abs(d))}</span></td></tr>`; };
  const n = v => String(v), p2 = v => pct(v, 2);
  const changed = Object.keys(a.out).filter(id => a.out[id].o !== b.out[id].o);
  return `<section class="panel" style="margin-bottom:14px"><div class="ph"><h3>Tested on ${a.n} past applications</h3><span class="note">August to October 2026</span></div><div class="pb simg"><div><table class="gt"><thead><tr><th></th><th class="r">Live v${POL.ver}</th><th class="r">Draft</th><th class="r">Change</th></tr></thead><tbody>
  ${row('Within policy', a.within, b.within, n, false)}${row('Need a deviation', a.dev, b.dev, n, true)}${row('Hard stops', a.hard, b.hard, n, true)}${row('Sanctioned by the system', a.sysApproved, b.sysApproved, n, false)}${row('Late payments expected, approved book', a.bad, b.bad, p2, true)}</tbody></table></div>
  <div><div class="ins-k">${plural(changed.length, 'application')} change outcome</div>${changed.slice(0, 8).map(id => { const ea = a.out[id].ev; return `<div class="fr"><span>${id}, ${ea.f.seg}, FOIR ${pctf(ea.m.foir)}, LTV ${pctf(ea.m.ltv)}</span><b>${esc(a.out[id].o)} to ${esc(lc1(b.out[id].o))}</b></div>`; }).join('') || '<p class="muted">None.</p>'}</div></div></section>`;
}

/* =====================================================================
   Audit trail
   ===================================================================== */

function auditHTML() {
  const c = C(), F = [['all', 'All'], ['dec', 'Decisions'], ['sys', 'System'], ['ppl', 'People'], ['data', 'Documents and data']];
  const fl = { all: () => true, dec: e => e.cat === 'decision', sys: e => e.w.t === 'sys', ppl: e => e.w.t === 'ppl', data: e => e.cat === 'doc' || e.cat === 'data' }[S.af];
  const L = c.w.log.concat(sysEvents(c, E)).filter(fl).sort((a, b) => a.at < b.at ? 1 : a.at > b.at ? -1 : 0);
  return `<div class="bk-h"><div><h2>Audit trail</h2><p>Every step on this case: who took it, when and why. System decisions name the policy version and the model that made them.</p></div><div class="act"><button class="btn btn-s btn-sm" data-act="print">${ic('print')}Print</button></div></div>
  <div class="bk" id="pdoc"><div class="bk-top">${F.map(([k, l]) => `<button class="flt${S.af === k ? ' on' : ''}" data-act="af" data-v="${k}">${l}</button>`).join('')}<span class="muted" style="margin-left:auto;font-size:12px">${plural(L.length, 'event')}, newest first</span></div>
  ${L.map(e => `<div class="au${e.cat === 'decision' ? ' dec' : ''}"><time>${fdate(e.at)}<br>${ftime(e.at)}</time><span class="ac ${e.w.t}"><i></i><span>${esc(e.w.n)}<small>${esc(e.w.s || '')}</small></span></span><div class="au-t"><b>${esc(e.txt)}</b>${e.det ? `<p>${esc(e.det)}</p>` : ''}${e.rsn ? `<span class="rsn">Reason: ${esc(e.rsn)}</span>` : ''}${e.reasons ? `<span class="rsn">Reasons: ${esc(listAnd(e.reasons.map(k => lc1(REJ[k].t))))}</span>` : ''}</div></div>`).join('') || '<div class="bk-empty">Nothing here for this filter.</div>'}</div>`;
}

/* =====================================================================
   Dialogs
   ===================================================================== */


/* =====================================================================
   Actions
   ===================================================================== */
const pw = l => who('ppl', AUTH[l].name, l + ', ' + AUTH[l].title);
const ACT = {
  go(v) { S.view = v === 'policy' ? 'policy' : 'basket'; S.sheet = null; S.edit = null; render(); },
  open(v) { S.i = +v; S.view = 'case'; const c = C(); S.tab = c.w.step === 'closed' ? 'sanction' : c.w.step; S.edit = null; S.form = {}; S.lang = null; S.dtab = 'letter'; S.rf = 'fail'; S.rq = ''; S.af = 'all'; render(); },
  tab(v) { S.tab = v; S.edit = null; render(); },
  mode(v) { const a = v === 'auto'; if (S.auto === a) return; S.auto = a; S.form = {}; render(); toast(a ? 'Automatic: the rules engine and the deviation model decide what they can' : 'Manual: credit managers decide every case'); },
  role(v) { S.role = v; S.form = {}; S.edit = null; if (v === 'pol') S.view = 'policy'; else if (S.view === 'policy') S.view = 'basket'; render(); },
  theme() { S.theme = { auto: 'light', light: 'dark', dark: 'auto' }[S.theme]; applyTheme(); render(); },
  resetall() { initCases(); POL = deep(POL12); VERS = deep(VERS0); LENDER = deep(LENDER0); S.pdraft = S.psim = S.ppend = S.pmsg = null; S.form = {}; S.edit = null; S.view = S.role === 'pol' ? 'policy' : 'basket'; S.bf = 'all'; S.bq = ''; render(); toast('The demo is back at its starting point'); },
  resetcase() { CASES[S.i] = fresh(SEED[S.i]); S.form = {}; S.edit = null; const c = C(); S.tab = c.w.step === 'closed' ? 'sanction' : c.w.step; render(); toast('This case is back at its starting point'); },
  bf(v) { S.bf = v; render(); },
  docup(v) {
    const c = C(), d = c.docs.find(x => x.id === v); if (!d || d.up || S.reading) return;
    S.reading = c.id + ':' + v; render();
    setTimeout(() => { d.up = { f: d.sample, at: tick(1), by: AUTH.L1.name }; S.reading = null; log(c, L1W(), 'doc', 'Uploaded ' + lc1(d.t), d.sample); render(); toast('Read: ' + lc1(d.t)); }, 900);
  },
  loadall() { const c = C(), m = c.docs.filter(d => d.need === 'login' && !d.up); m.forEach(d => { d.up = { f: d.sample, at: tick(1), by: AUTH.L1.name }; }); if (m.length) log(c, L1W(), 'doc', 'Uploaded ' + plural(m.length, 'document'), listAnd(m.map(d => lc1(d.t))) + '.'); render(); toast(plural(m.length, 'document') + ' read'); },
  startverify() {
    const c = C(); if (c.docs.some(d => d.need === 'login' && !d.up)) return;
    c.w.step = 'verify'; let n = 0;
    c.tasks.forEach(t => { if (t.st !== 'todo') return; if (t.kind === 'sys') { t.st = 'accepted'; t.recv = t.acc = tick(1); log(c, who('sys', 'System', t.vendor), 'data', sysTaskText(c, t), sysTaskDet(c, t)); } else { t.st = 'assigned'; t.assigned = tick(1); t.due = addWD(t.assigned, t.slaD); n++; log(c, L1W(), 'vendor', t.t + ' assigned to ' + t.vendor, 'Due ' + fdt(t.due) + '.'); } });
    S.tab = 'verify'; render(); toast('Verification started: ' + plural(n, 'check') + ' assigned');
  },
  tkrecv(v) { const c = C(), t = task(c, v); t.st = 'received'; t.recv = tick(5); const parts = t.vendor.split(', '); log(c, t.kind === 'ven' ? who('ven', t.vendor, 'Empanelled vendor') : who('ppl', parts[0], parts[1] ? cap1(parts[1]) : 'Internal team'), 'vendor', t.t + ': report received', taskOutcome(c, t)); render(); toast(t.t + ': report in'); },
  tkacc(v) { const c = C(), t = task(c, v); t.st = 'accepted'; t.acc = tick(2); log(c, L1W(), 'vendor', t.t + ': report accepted', ''); render(); toast(v === 'legal' && c.prop.legal.conds.length ? 'Accepted. The advocate\u2019s ' + plural(c.prop.legal.conds.length, 'condition') + ' are now conditions before disbursement' : t.t + ' accepted'); },
  tkrem(v) { const c = C(), t = task(c, v); t.rem = tick(1); log(c, L1W(), 'vendor', 'Reminder sent to ' + t.vendor, 'The report was due ' + fdt(t.due) + '.'); render(); toast('Reminder sent to ' + t.vendor); },
  tkreas(v) { S.sheet = { k: 'reas', id: v }; render(); },
  tkquery(v) { S.sheet = { k: 'query', id: v }; render(); },
  tkans(v) { const c = C(), t = task(c, v); t.st = 'received'; if (v === 'legal') { const q = c.prop.legal.queries.slice(-1)[0]; if (q) q.ans = 'Confirmed by the advocate; the report is updated.'; } log(c, who('ven', t.vendor, 'Empanelled vendor'), 'vendor', 'Query answered', ''); render(); toast('Answer received'); },
  oblig(v) {
    const c = C(), o = c.oblig.find(x => x.id === v); if (!o) return;
    const ok = S.role === 'cm' && ['login', 'verify', 'decide'].includes(c.w.step) && !c.w.dec && !(c.w.req && c.w.req.k === 'pending');
    if (!ok) { render(); return; }
    o.count = !o.count; if (!o.count && !o.why) o.why = 'Left out by ' + AUTH.L1.name; if (o.count && o.why.indexOf('Left out by') === 0) o.why = '';
    log(c, L1W(), 'data', (o.count ? 'Counted in FOIR: ' : 'Left out of FOIR: ') + lc1(o.t), o.emi ? inr(o.emi) + ' a month.' : ''); if (c.w.sysAt) c.w.sysAt = tick(1); render();
  },
  godecide() { const c = C(); if (c.tasks.some(t => t.st !== 'accepted')) return; c.w.step = 'decide'; log(c, L1W(), 'decision', 'Moved to decision', 'Both tracks complete.'); c.w.sysAt = tick(1); S.tab = 'decide'; render(); },
  fedit(v) { S.edit = v; render(); },
  fcancel() { S.edit = null; render(); },
  fsave() {
    const c = C(), k = S.edit, el = $('#fin'); if (!k || !el) return; const n = parseFloat(el.value); if (isNaN(n)) { toast('Enter a number'); return; }
    const lab = { loan: 'Loan amount', tenure: 'Tenure', roi: 'Interest rate' }; let from, to;
    if (k === 'loan') { const v = Math.round(clamp(n, 100000, 50000000) / 1000) * 1000; from = lakh(c.v.loan); to = lakh(v); c.v.loan = v; }
    else if (k === 'tenure') { const v = Math.round(clamp(n, 1, 30)) * 12; from = yrsTxt(c.v.tenure); to = yrsTxt(v); c.v.tenure = v; }
    else if (k === 'roi') { const v = Math.round(clamp(n, 5, 20) * 100) / 100; from = c.v.roi.toFixed(2) + '%'; to = v.toFixed(2) + '%'; c.v.roi = v; }
    else { const a = c.apps.find(x => x.id === k.slice(4)), v = Math.round(clamp(n, 0, 10000000)); from = inr(a.inc); to = inr(v); a.inc = v; lab[k] = 'Eligible income, ' + a.name.split(' ')[0]; }
    c.w.edited = c.w.edited || {}; c.w.edited[k] = true; S.edit = null;
    log(c, L1W(), 'data', lab[k] + ' changed', from + ' to ' + to + '.'); if (c.w.sysAt) c.w.sysAt = tick(1);
    render(); toast(lab[k] + ' changed. The decision is re-checked');
  },
  apply(v) {
    const c = C(), o = typeof v === 'string' ? JSON.parse(v) : v, prev = E.st.k, parts = [];
    c.w.edited = c.w.edited || {};
    if (o.loan) { parts.push('Loan ' + lakh(c.v.loan) + ' to ' + lakh(o.loan)); c.v.loan = o.loan; c.w.edited.loan = true; }
    if (o.tenure) { parts.push('Tenure ' + yrsTxt(c.v.tenure) + ' to ' + yrsTxt(o.tenure)); c.v.tenure = o.tenure; c.w.edited.tenure = true; }
    if (o.close) { const ob = c.oblig.find(x => x.id === o.close); ob.count = false; ob.why = 'To be closed before the first disbursement'; c.w.extra.push({ w: 'cp', t: 'Closure letter for the ' + lc1(ob.t), d: 'Left out of FOIR on that basis' }); parts.push(ob.t + ' to be closed before disbursement'); }
    log(c, meW(), 'decision', prev === 'counter' ? 'Counter-offer accepted by the credit manager' : 'Terms changed', parts.join('. ') + '.');
    if (c.w.sysAt) c.w.sysAt = tick(1);
    render(); toast(prev === 'counter' ? 'Counter-offer made. The system re-checks the case' : 'Terms changed. The decision is re-checked');
  },
  mit(v) { const c = C(); S.form.mits = S.form.mits || {}; const m = S.form.mits[c.id] = S.form.mits[c.id] || {}; m[v] = !m[v]; render(); },
  reqsend() {
    const c = C(), st = E.st; if (!['refer', 'returned'].includes(st.k)) return;
    const note = ($('#reqNote') || {}).value || S.form.note || '', sel = (S.form.mits || {})[c.id] || {}, mits = Object.keys(sel).filter(k => sel[k]);
    c.w.req = { k: 'pending', lvl: st.lvl, at: tick(2), by: 'L1', note, mits, items: E.devs.concat(E.refs).map(r => r.name + ': ' + r.v), ovr: !!c.w.ovr };
    if (c.w.dec && c.w.dec.k === 'returned') c.w.dec = null;
    log(c, L1W(), 'decision', 'Sent to ' + st.lvl + ' for approval', note);
    S.form.note = null; render(); toast('Sent to ' + AUTH[st.lvl].name + ', ' + st.lvl);
  },
  withdraw() { const c = C(); if (!c.w.req) return; log(c, L1W(), 'decision', 'Request withdrawn', ''); c.w.req = null; c.w.ovr = null; render(); toast('Request withdrawn'); },
  cmapprove() { const c = C(); if (E.st.k !== 'approve') return; c.w.dec = { k: 'approved', by: 'L1', at: tick(2) }; c.w.step = 'sanction'; log(c, L1W(), 'decision', 'Approved', 'Within policy and sanction authority.'); render(); toast('Approved. The sanction pack is ready'); },
  godecl() { S.form.decl = C().id; render(); setTimeout(() => ACT.scrollto('act'), 40); },
  decx() { S.form.decl = null; render(); },
  decl() {
    const c = C(), box = $('#act'), rs = box ? [...box.querySelectorAll('input[data-r]:checked')].map(x => x.dataset.r) : [];
    if (!rs.length) { toast('Choose at least one reason'); return; }
    const note = ($('#declNote') || {}).value || '';
    c.w.dec = { k: 'declined', by: 'L1', at: tick(2), reasons: rs, note }; c.w.req = null; c.w.step = 'sanction'; S.form.decl = null;
    log(c, L1W(), 'decision', 'Application declined', note, { reasons: rs });
    S.tab = 'sanction'; render(); toast('Declined. The letter with the reasons is ready to send');
  },
  ovr() { S.sheet = { k: 'ovr' }; render(); },
  ovrsend() {
    const c = C(), r = ($('#ovrR') || {}).value, n = ($('#ovrN') || {}).value || '';
    let lvl = E.lvl; if (RANK[lvl] < 2) lvl = 'L2';
    c.w.ovr = { by: 'L1', at: tick(2), reason: r, note: n };
    log(c, L1W(), 'decision', 'System decision overridden', n, { rsn: r });
    c.w.req = { k: 'pending', lvl, at: tick(1), by: 'L1', note: (r ? r + '. ' : '') + n, mits: [], items: E.devs.concat(E.refs).map(x => x.name + ': ' + x.v), ovr: true };
    log(c, L1W(), 'decision', 'Sent to ' + lvl + ' for approval', 'After the override.');
    S.sheet = null; render(); toast('Overridden. Sent to ' + AUTH[lvl].name + ' (' + lvl + ') with your reason');
  },
  apsel(v) { S.form.ap = S.form.ap === v ? null : v; render(); },
  apgo(v) {
    const c = C(), r = c.w.req; if (!r || RANK[S.lvl] < RANK[r.lvl]) return;
    const me = S.lvl, W = pw(me);
    if (v === 'approve' || v === 'cond') {
      const conds = v === 'cond' ? (($('#apCond') || {}).value || '').split('\n').map(s => s.trim()).filter(Boolean) : [];
      if (v === 'cond' && !conds.length) { toast('Add at least one condition'); return; }
      c.w.dec = { k: 'approved', by: me, at: tick(3), conds }; r.k = 'done'; c.w.step = 'sanction';
      log(c, W, 'decision', conds.length ? 'Approved with conditions' : 'Approved', conds.join('. ')); toast('Approved by ' + AUTH[me].name);
    } else if (v === 'counter') {
      const L = Math.round((+($('#apLoan') || {}).value || 0) / 1000) * 1000, T = Math.round(+($('#apTen') || {}).value || 0) * 12;
      if (!L || !T) { toast('Enter an amount and a tenure'); return; }
      const ev2 = evalFacts(Object.assign({}, E.f, { loan: L, tenure: T }), POL);
      if (ev2.hard.length) { toast('Still breaks ' + lc1(ev2.hard[0].name) + '. Change the terms'); return; }
      const from = { loan: c.v.loan, tenure: c.v.tenure }; c.v.loan = L; c.v.tenure = T;
      c.w.dec = { k: 'approved', by: me, at: tick(3), counter: { from, to: { loan: L, tenure: T } } }; r.k = 'done'; c.w.step = 'sanction';
      log(c, W, 'decision', 'Approved with a counter-offer', lakh(from.loan) + ' over ' + yrsTxt(from.tenure) + ' changed to ' + lakh(L) + ' over ' + yrsTxt(T) + '.'); toast('Counter-offer approved: ' + lakh(L));
    } else if (v === 'back') {
      const n = ($('#apNote') || {}).value || ''; if (!n.trim()) { toast('Say what should change'); return; }
      c.w.dec = { k: 'returned', by: me, at: tick(3), note: n }; c.w.req = null;
      log(c, W, 'decision', 'Sent back to the credit manager', n); toast('Sent back to ' + AUTH.L1.name);
    } else if (v === 'reject') {
      const box = $('#act'), rs = [...box.querySelectorAll('input[data-r]:checked')].map(x => x.dataset.r); if (!rs.length) { toast('Choose at least one reason'); return; }
      const n = ($('#apNote') || {}).value || '';
      c.w.dec = { k: 'declined', by: me, at: tick(3), reasons: rs, note: n }; c.w.req = null; c.w.step = 'sanction';
      log(c, W, 'decision', 'Application declined', n, { reasons: rs }); toast('Declined. The credit manager sends the letter');
    }
    S.form.ap = null; render();
  },
  rf(v) { S.rf = v; render(); },
  scrollto(v) { const el = document.getElementById(v); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } },
  lang(v) { S.lang = v; render(); },
  dtab(v) { S.dtab = v; render(); },
  print() { window.print(); },
  sansend() { const c = C(); c.w.san.sent = tick(2); log(c, L1W(), 'comms', 'Sanction letter and KFS sent to the customer', 'Email and SMS to the registered contacts' + (c.lang === 'hi' ? ', in Hindi with an English copy' : '') + '. The KFS is valid for 3 working days.'); render(); toast('Sent to the customer'); },
  sanacc() { const c = C(); c.w.san.accepted = tick(30); log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Sanction and KFS accepted', 'OTP on the registered mobile.'); render(); toast('Customer accepted'); },
  handoff() { const c = C(); c.w.san.handoff = tick(5); c.w.step = 'closed'; log(c, L1W(), 'comms', 'Handed off to operations', 'For the conditions check and the first disbursement.'); render(); toast('Handed off to operations'); },
  letter() { const c = C(); c.w.letter = { sent: tick(2), ch: 'Registered post, email and SMS' }; c.w.step = 'closed'; log(c, L1W(), 'comms', 'Rejection letter sent' + (c.lang === 'hi' ? ' in Hindi and English' : ''), 'With the main reasons.'); render(); toast('Letter sent'); },
  af(v) { S.af = v; render(); },
  ptab(v) { S.ptab = v; render(); },
  psim() { if (!S.pdraft) return; S.psim = { live: simRun(POL), draft: simRun(S.pdraft) }; render(); toast('Tested on ' + S.psim.live.n + ' past applications'); },
  psubmit() { if (!S.pdraft || !S.psim) return; S.ppend = { at: tick(2), changes: diffPol(POL, S.pdraft) }; render(); toast('Sent to ' + PEOPLE.checker.name + ' for approval'); },
  pchk() {
    if (!S.ppend) return; const d = diffPol(POL, S.pdraft), p = deep(S.pdraft);
    p.ver = POL.ver + 1; p.at = tick(5); p.maker = PEOPLE.maker.name; p.checker = PEOPLE.checker.name; p.note = d.map(x => x.l + ': ' + fmtP(x.p, x.from) + ' to ' + fmtP(x.p, x.to)).join('. ') + '.'; p.model.on = POL.model.on;
    POL = p; VERS.unshift(deep(p)); S.pdraft = S.psim = S.ppend = null; S.pmsg = 'Version ' + p.ver + ' is live. Every open case is now checked against it.'; render(); toast('Version ' + p.ver + ' is live');
  },
  pdiscard() { S.pdraft = S.psim = null; render(); toast('Draft discarded'); },
  pwithdraw() { S.ppend = null; render(); toast('Withdrawn. The draft is still here'); },
  proll(v) { const p = VERS.find(x => x.ver === +v); if (!p) return; S.pdraft = deep(p); S.pdraft.ver = POL.ver; S.pdraft.model.on = POL.model.on; S.psim = null; S.pmsg = null; S.ptab = 'foir'; render(); toast('Version ' + v + ' loaded as a draft. Test it, then send it for approval'); },
  pcmp(v) { S.pcmp = S.pcmp === +v ? null : +v; render(); },
  kill() { if (S.role !== 'pol') return; POL.model.on = !POL.model.on; if (S.pdraft) S.pdraft.model.on = POL.model.on; render(); toast(POL.model.on ? 'The model is back on' : 'The model is off. Every deviation now goes to a person'); },
  shclose() { S.sheet = null; render(); },
  qsend() { const c = C(), t = task(c, S.sheet.id), q = ($('#qT') || {}).value || ''; if (!q.trim()) { toast('Write the query'); return; } t.st = 'query'; t.q = { at: tick(2), t: q }; if (t.id === 'legal') c.prop.legal.queries.push({ at: t.q.at, by: AUTH.L1.name, t: q }); log(c, L1W(), 'vendor', 'Query raised with ' + t.vendor, q); S.sheet = null; render(); toast('Query sent to ' + t.vendor); },
  reasgo() { const c = C(), t = task(c, S.sheet.id), nv = ($('#reasV') || {}).value; if (!nv) return; const old = t.vendor; t.vendor = nv; t.assigned = tick(2); t.due = addWD(t.assigned, t.slaD); t.rem = null; log(c, L1W(), 'vendor', t.t + ' reassigned to ' + nv, 'From ' + old + '. Due ' + fdt(t.due) + '.'); S.sheet = null; render(); toast('Reassigned to ' + nv); }
};

/* =====================================================================
   Events and start-up
   ===================================================================== */
const render0 = render;
render = function () { render0(); if (S.focusId) { const el = document.getElementById(S.focusId); if (el) { el.focus(); const n = el.value.length; try { el.setSelectionRange(n, n); } catch (e) { /* not a text field */ } } S.focusId = null; } };





/* start-up runs at the end of the AI layer */

/* =====================================================================
   AI-native layer: leads, checks and case adapters
   ===================================================================== */
const Z24 = '000000000000000000000000';
const SALES = { ini: 'AJ', name: 'Amit Joshi', sub: 'Relationship manager, Pune' };
const LEADS = [
/* ---------- N1: the live demo lead, clean all the way to an automatic sanction ---------- */
{
  id: 'N1', hint: 'New lead: salaried professional buying a resale flat in Pune', seg: 'prime', prog: 'salaried', cat: 'resale', variant: 'resale', lang: 'en',
  v: { appNo: 'LD-2611-0418', branch: 'Pune Kothrud', src: 'Branch walk-in', srcBy: 'Amit Joshi', login: '2026-11-16 10:40', loan: 5500000, tenure: 240, roi: 9.3, purpose: 'Purchase of a resale flat', applied: { loan: 5500000, tenure: 240 } },
  lead: { by: 'Amit Joshi', created: '2026-11-16 10:40', price: 7800000, city: 'Pune', hidden: true, consent: null, pre: null, in: false },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Sameer Joshi', ini: 'SJ', age: 36, sex: 'M', emp: 'Salaried', occ: 'Product manager', org: 'Bluewave Logistics Tech Pvt Ltd', orgCat: 'A', yrs: 8, inc: 124000, incDecl: 125000, incSrc: 'Salary slips and salary credits through the Account Aggregator', earning: true, cibil: 788, dpd: Z24, enq6: 1, accts: 3, pan: 'BQJPJ6612C', aadhaar: 'XXXX XXXX 6612', ckyc: 'Found and downloaded', addr: 'B-12, Mayur Colony, Kothrud, Pune 411038', mobile: '98XXXXX612', email: 'sameer.j@example.com' },
  ],
  oblig: [{ id: 'o1', who: 'a1', t: 'Credit card', lender: 'A private bank', emi: 600, out: 12000, left: null, count: true, why: '5% of the \u20B912,000 balance' }],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 6612', consent: 'Consent given by OTP for 12 months of data', months: M6, credits: [127600, 126100, 131800, 125400, 138900, 129700], debits: [98400, 104900, 96800, 108300, 116100, 102700], bal: [213800, 235000, 270000, 287100, 309900, 336900], salary: 'Salary credited on the 1st, every month for 12 months', bounces: 0 },
  pd: null,
  prop: {
    kind: 'Flat', addr: 'Flat 6, Shreeyash Apartments, Karve Road, Kothrud, Pune 411038', carpet: 79, area: '79 m\u00B2 (850 sq ft) carpet, 2 bedrooms, built 2014', owners: ['a1'],
    agreement: 7800000, guideline: 6920000, builder: null, project: null, rera: null, apf: null,
    stage: 100, stageText: 'Complete, occupied since 2014', built: 2014, resid: 48, oc: true, planDev: 2, neg: 'none',
    cersai: { st: 'clear', t: 'No charge registered on this flat' }, fcu: { st: 'pos', t: 'Salary slips and sale deed sampled: positive' },
    legal: { by: 'Patwardhan & Co., Advocates', op: 'clear', note: 'Title is clear and marketable. The seller has no loan on the flat.',
      chain: [{ y: '2014', t: 'Sale deed', p: 'Builder to Mohan Kulkarni', n: 'Registered, Haveli 9' }, { y: '2014', t: 'Share certificate', p: 'Shreeyash CHS', n: 'In Mohan Kulkarni\u2019s name' }, { y: '2026', t: 'Agreement to sell', p: 'Mohan Kulkarni to Sameer Joshi', n: 'Signed 12 Nov 2026', cls: 'now' }],
      conds: [], lod: ['Sale deed 2014 (original)', 'Share certificate and society NOC', 'Occupancy certificate', 'Encumbrance certificate 2014 to 2026'], queries: [] },
    vals: [{ id: 'tech', by: 'Deshmukh & Associates', v: 7650000, note: 'Market value. Building age 12 years' }, { id: 'tech2', by: 'Sahyadri Valuers', v: 7780000, note: 'Market value. Building life left 48 years' }]
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('pan_a1', 'PAN, Sameer', DCAT[1], 'pre', 'PAN_Sameer.jpg'), dk('adh_a1', 'Aadhaar (masked), Sameer', DCAT[1], 'pre', 'Aadhaar_Sameer.pdf'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026, Sameer', DCAT[2], 'pre', 'Payslips_Sameer.pdf'),
    dk('app', 'Application form, e-signed', DCAT[0], 'login', 'Application_e-signed.pdf'), dk('f16_a1', 'Form 16, two years, Sameer', DCAT[2], 'login', 'Form16_Sameer.pdf'),
    dk('ats', 'Agreement to sell', DCAT[4], 'login', 'ATS_Shreeyash_6.pdf'), dk('deeds', 'Sale deed, 2014 (copy)', DCAT[4], 'login', 'Sale_deed_2014.pdf'), dk('ec', 'Encumbrance certificate, 2014 to 2026', DCAT[4], 'login', 'EC_2014_2026.pdf'),
    dk('oc', 'Occupancy certificate', DCAT[4], 'login', 'OC_Shreeyash.pdf'), dk('share', 'Society share certificate and NOC', DCAT[4], 'login', 'Shreeyash_share_NOC.pdf'), dk('ins', 'Property insurance with our interest noted', DCAT[4], 'cp', 'Insurance.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'todo'), tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'todo'), tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'todo'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Trust Field Services', 3, 'todo'), tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Pune', 2, 'todo'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Patwardhan & Co., Advocates', 5, 'todo'), tk('tech', 'Valuation 1', 'prop', 'ven', 'Deshmukh & Associates', 3, 'todo'), tk('tech2', 'Valuation 2', 'prop', 'ven', 'Sahyadri Valuers', 3, 'todo'), tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'todo')
  ],
  w: { step: 'login' }
},
/* ---------- N2: eligible with changes ---------- */
{
  id: 'N2', hint: 'Lead from a DSA: repayments too high for the amount asked', seg: 'prime', prog: 'salaried', cat: 'resale', variant: 'resale', lang: 'en',
  v: { appNo: 'LD-2611-0407', branch: 'Gurugram Sector 14', src: 'DSA, Capital Homes Advisory', srcBy: 'Capital Homes Advisory', login: '2026-11-14 15:10', loan: 4500000, tenure: 216, roi: 9.4, purpose: 'Purchase of a resale flat', applied: { loan: 4500000, tenure: 216 } },
  lead: { by: 'Capital Homes Advisory (DSA)', created: '2026-11-14 15:10', price: 6200000, city: 'Gurugram', consent: { at: '2026-11-14 15:31', ch: 'OTP', wa: 1 }, pre: null, in: false },
  apps: [
    { id: 'a1', role: 'Applicant', name: 'Vikas Sharma', ini: 'VS', age: 41, sex: 'M', emp: 'Salaried', occ: 'Senior accountant', org: 'Orbit Retail Pvt Ltd', orgCat: 'B', yrs: 10, inc: 78000, incDecl: 80000, incSrc: 'Salary slips and salary credits through the Account Aggregator', earning: true, cibil: 742, dpd: Z24, enq6: 2, accts: 3, pan: 'AVSPS2741D', aadhaar: 'XXXX XXXX 2741', ckyc: 'Found and downloaded', addr: 'H-404, Green Meadows, Sector 49, Gurugram 122018', mobile: '99XXXXX741', email: 'vikas.s@example.com' },
    { id: 'a2', role: 'Co-applicant', rel: 'Spouse', name: 'Anita Sharma', ini: 'AS', age: 38, sex: 'F', emp: 'Homemaker', occ: 'Homemaker', org: '', orgCat: null, yrs: 0, inc: 0, incDecl: 0, incSrc: 'No income considered', earning: false, cibil: 734, dpd: Z24, enq6: 0, accts: 1, pan: 'BASPS9902Q', aadhaar: 'XXXX XXXX 9902', ckyc: 'Found and downloaded', addr: 'H-404, Green Meadows, Sector 49, Gurugram 122018', mobile: '99XXXXX902', email: '' }
  ],
  oblig: [{ id: 'o1', who: 'a1', t: 'Personal loan', lender: 'An NBFC', emi: 6200, out: 58000, left: 10, count: true, why: '' }],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 2741', consent: 'Consent given by OTP for 12 months of data', months: M6, credits: [81200, 79800, 80400, 78900, 83100, 80600], debits: [72400, 75100, 73900, 74800, 79200, 76300], bal: [46000, 48200, 51300, 50800, 53900, 55100], salary: 'Orbit Retail credits \u20B978,000 on the 1st, every month for 12 months', bounces: 0 },
  pd: null,
  prop: {
    kind: 'Flat', addr: 'Flat 1203, Tower B, Palm Grove, Sector 54, Gurugram 122011', carpet: 102.2, area: '102 m\u00B2 (1,100 sq ft) carpet, 3 bedrooms, built 2016', owners: ['a1', 'a2'],
    agreement: 6200000, guideline: 5480000, builder: null, project: null, rera: null, apf: null,
    stage: 100, stageText: 'Complete, occupied since 2016', built: 2016, resid: 50, oc: true, planDev: 3, neg: 'none',
    cersai: { st: 'clear', t: 'No charge registered on this flat' }, fcu: { st: 'pos', t: 'Salary slips and sale deed sampled: positive' },
    legal: { by: 'Bajwa & Co., Advocates', op: 'clear', note: 'Title is clear and marketable.', chain: [{ y: '2016', t: 'Conveyance deed', p: 'Developer to Rakesh Bhatia', n: 'Registered, Gurugram' }, { y: '2026', t: 'Agreement to sell', p: 'Rakesh Bhatia to Vikas and Anita Sharma', n: 'Signed 10 Nov 2026', cls: 'now' }], conds: [], lod: ['Conveyance deed 2016 (original)', 'Occupancy certificate', 'Encumbrance certificate 2016 to 2026'], queries: [] },
    vals: [{ id: 'tech', by: 'Northern Valuation Services', v: 6100000, note: 'Market value. Building age 10 years' }]
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('pan_a1', 'PAN, Vikas', DCAT[1], 'pre', 'PAN_Vikas.jpg', '2026-11-14 15:18', 'Capital Homes Advisory'), dk('adh_a1', 'Aadhaar (masked), Vikas', DCAT[1], 'pre', 'Aadhaar_Vikas.pdf', '2026-11-14 15:18', 'Capital Homes Advisory'),
    dk('pan_a2', 'PAN, Anita', DCAT[1], 'pre', 'PAN_Anita.jpg', '2026-11-14 15:19', 'Capital Homes Advisory'), dk('adh_a2', 'Aadhaar (masked), Anita', DCAT[1], 'pre', 'Aadhaar_Anita.pdf', '2026-11-14 15:19', 'Capital Homes Advisory'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026, Vikas', DCAT[2], 'pre', 'Payslips_Vikas.pdf', '2026-11-14 15:20', 'Capital Homes Advisory'),
    dk('app', 'Application form, e-signed', DCAT[0], 'login', 'Application_e-signed.pdf'), dk('f16_a1', 'Form 16, two years, Vikas', DCAT[2], 'login', 'Form16_Vikas.pdf'),
    dk('ats', 'Agreement to sell', DCAT[4], 'login', 'ATS_PalmGrove_1203.pdf'), dk('deeds', 'Conveyance deed, 2016 (copy)', DCAT[4], 'login', 'Conveyance_2016.pdf'), dk('ec', 'Encumbrance certificate, 2016 to 2026', DCAT[4], 'login', 'EC_2016_2026.pdf'), dk('oc', 'Occupancy certificate', DCAT[4], 'login', 'OC_PalmGrove.pdf'), dk('ins', 'Property insurance with our interest noted', DCAT[4], 'cp', 'Insurance.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-14 15:32', '2026-11-14 15:32'), tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-14 15:32', '2026-11-14 15:32'), tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-11-14 15:33', '2026-11-14 15:33'),
    tk('fi', 'Residence and office visit', 'inc', 'ven', 'Delhi NCR Field Checks', 3, 'todo'), tk('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Delhi', 2, 'todo'),
    tk('legal', 'Legal opinion', 'prop', 'ven', 'Bajwa & Co., Advocates', 5, 'todo'), tk('tech', 'Valuation and site visit', 'prop', 'ven', 'Northern Valuation Services', 3, 'todo'), tk('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, 'todo')
  ],
  w: { step: 'login' }
},
/* ---------- N3: not eligible at pre-screen ---------- */
{
  id: 'N3', hint: 'Lead from a DSA: a payment 90+ days late in the last two years', seg: 'prime', prog: 'salaried', cat: 'resale', variant: 'resale', lang: 'en',
  v: { appNo: 'LD-2611-0399', branch: 'Kochi Edappally', src: 'DSA, Malabar Loan Point', srcBy: 'Malabar Loan Point', login: '2026-11-13 11:20', loan: 3500000, tenure: 240, roi: 9.6, purpose: 'Purchase of a resale flat', applied: { loan: 3500000, tenure: 240 } },
  lead: { by: 'Malabar Loan Point (DSA)', created: '2026-11-13 11:20', price: 4800000, city: 'Kochi', consent: { at: '2026-11-13 11:39', ch: 'OTP', wa: 1 }, pre: null, in: false },
  apps: [{ id: 'a1', role: 'Applicant', name: 'Rajiv Nair', ini: 'RN', age: 39, sex: 'M', emp: 'Salaried', occ: 'Sales manager', org: 'Coastline Motors Pvt Ltd', orgCat: 'C', yrs: 4, inc: 68000, incDecl: 70000, incSrc: 'Salary slips and salary credits through the Account Aggregator', earning: true, cibil: 612, dpd: '000000000000099900000000', enq6: 5, accts: 6, pan: 'ARNPN4471M', aadhaar: 'XXXX XXXX 4471', ckyc: 'Found and downloaded', addr: '22/1104, Marine Heights, Edappally, Kochi 682024', mobile: '94XXXXX471', email: 'rajiv.n@example.com' }],
  oblig: [{ id: 'o1', who: 'a1', t: 'Credit card', lender: 'A private bank', emi: 2400, out: 48000, left: null, count: true, why: '5% of the \u20B948,000 balance' }, { id: 'o2', who: 'a1', t: 'Two-wheeler loan', lender: 'An NBFC', emi: 3100, out: 41000, left: 14, count: true, why: '' }],
  bank: { via: 'Account Aggregator', acct: 'Salary account ending 4471', consent: 'Consent given by OTP for 12 months of data', months: M6, credits: [70400, 69800, 71200, 68900, 72300, 70100], debits: [69100, 70200, 70800, 69400, 71900, 69800], bal: [9800, 8400, 10100, 7900, 9300, 8800], salary: 'Coastline Motors credits \u20B968,000 on the 5th, every month for 12 months', bounces: 2 },
  pd: null,
  prop: {
    kind: 'Flat', addr: 'Flat 7C, Periyar Residency, Edappally, Kochi 682024', carpet: 84, area: '84 m\u00B2 (900 sq ft) carpet', owners: ['a1'], agreement: 4800000, guideline: 4100000, builder: null, project: null, rera: null, apf: null,
    stage: 100, stageText: 'Complete', built: 2012, resid: 46, oc: true, planDev: 2, neg: 'none', cersai: { st: 'clear', t: 'Not searched' }, fcu: { st: 'pos', t: 'Not sampled' },
    legal: { by: '', op: 'clear', note: '', chain: [], conds: [], lod: [], queries: [] }, vals: []
  },
  colend: null, pmay: null, clp: null,
  docs: [
    dk('pan_a1', 'PAN, Rajiv', DCAT[1], 'pre', 'PAN_Rajiv.jpg', '2026-11-13 11:31', 'Malabar Loan Point'), dk('adh_a1', 'Aadhaar (masked), Rajiv', DCAT[1], 'pre', 'Aadhaar_Rajiv.pdf', '2026-11-13 11:31', 'Malabar Loan Point'),
    dk('sal_a1', 'Salary slips, Aug to Oct 2026', DCAT[2], 'pre', 'Payslips_Rajiv.pdf', '2026-11-13 11:33', 'Malabar Loan Point'),
    dk('app', 'Application form, e-signed', DCAT[0], 'login', 'Application_e-signed.pdf'), dk('ats', 'Agreement to sell', DCAT[4], 'login', 'ATS_Periyar_7C.pdf')
  ],
  tasks: [
    tk('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, 'accepted', null, '2026-11-13 11:40', '2026-11-13 11:40'), tk('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, 'accepted', null, '2026-11-13 11:40', '2026-11-13 11:40'), tk('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, 'accepted', null, '2026-11-13 11:41', '2026-11-13 11:41')
  ],
  w: { step: 'login' }
}
];

/* ---------- what the system asks a person to check, with the evidence ---------- */
const CHECKS = {
  A: [
    { id: 'a-inc2', sev: 'med', fld: 'a2.inc', t: 'Neha\u2019s salary is not in the bank data', f: 'Her salary goes to another bank. The Account Aggregator consent covered Aditya\u2019s account only. Her payslips and Form 16 agree with each other to the rupee.', sug: 'Accept the payslips, or ask for consent on her salary account.', ask: 'Account Aggregator consent for Neha\u2019s salary account',
      ev: { kind: 'Payslip', title: 'Payslip, October 2026', org: 'Sharada Public School', rows: [['Employee', 'Neha Deshpande'], ['Basic pay', '\u20B924,500'], ['Allowances', '\u20B913,700'], ['Deductions', '\u20B94,200'], ['Net pay', '\u20B934,000']], hi: 4, read: '\u20B934,000', conf: 97 } },
    { id: 'a-addr', sev: 'low', fld: 'a1.addr', t: 'Address differs between Aadhaar and the application', f: 'Aadhaar shows the rented flat in Aundh. The application gives the new flat in Baner as the current address, but it is still being built.', sug: 'Use the Aundh address for letters until possession.', ask: 'A rent agreement or utility bill for the Aundh flat',
      ev: { kind: 'Aadhaar', title: 'Aadhaar (masked), Aditya', org: 'Read by offline e-KYC', rows: [['Name', 'Aditya Deshpande'], ['Year of birth', '1992'], ['Aadhaar', 'XXXX XXXX 4417'], ['Address', 'Flat 4, Shree Apartments, Aundh, Pune 411007']], hi: 3, read: 'Aundh, Pune 411007', conf: 99 } }
  ],
  B: [
    { id: 'b-inc', sev: 'med', fld: 'a1.inc', after: 'pd', t: 'Declared income is 51% above what was assessed', f: 'The personal discussion assessed \u20B929,100 a month against \u20B944,000 declared. Bank credits support about half of the shop\u2019s sales; the rest is cash.', sug: 'Use the assessed \u20B929,100. FOIR is worked out on it already.', ask: 'Purchase bills for the last 3 months',
      ev: { kind: 'Worksheet', title: 'Personal discussion worksheet', org: 'Pooja Sharma, credit officer', rows: [['Sales seen, a month', '\u20B92,40,000'], ['Margin', '12%'], ['Net income from the shop', '\u20B921,600'], ['Room rent and tailoring', '\u20B97,500'], ['Assessed household income', '\u20B929,100']], hi: 4, read: '\u20B929,100', conf: 100 } },
    { id: 'b-bnc', sev: 'low', fld: 'bank.bounce', after: 'aa', t: 'A cheque bounced in August 2026', f: 'One inward cheque of \u20B918,000 to a supplier was returned for lack of funds. It was paid again two days later. No other bounce in 12 months.', sug: 'A one-off. Accept it.', ask: 'A note from the customer on the August bounce',
      ev: { kind: 'Bank statement', title: 'Amber Sahakari Bank, account ending 0418', org: 'Read from PDF', rows: [['16 Aug 2026', 'UPI settlement +\u20B94,320'], ['18 Aug 2026', 'Cheque 004512 returned: funds insufficient \u2212\u20B918,000'], ['20 Aug 2026', 'Cheque 004512 paid \u2212\u20B918,000'], ['21 Aug 2026', 'UPI settlement +\u20B93,980']], hi: 1, read: 'Returned, \u20B918,000', conf: 96 } },
    { id: 'b-leg', sev: 'high', fld: 'prop.title', after: 'legal', t: 'Legal opinion: clear with two conditions', f: 'The advocate wants building permission from the gram panchayat and no-objection affidavits from Ramesh\u2019s two brothers, because the 2014 gift deed came from family land.', sug: 'Accept both as conditions before the first disbursement.', ask: 'The brothers\u2019 affidavits now, before sanction',
      ev: { kind: 'Legal opinion', title: 'Legal opinion, Adv. Rakesh Saini', org: 'Received 18 Nov 2026', rows: [['Title', 'Good and marketable, subject to conditions'], ['Chain', 'Patta 2009, gift deed 2014, record 2015'], ['Condition 1', 'Building permission from the gram panchayat'], ['Condition 2', 'No-objection affidavits from both brothers']], hi: 3, read: '2 conditions', conf: 98 } }
  ],
  C: [
    { id: 'c-seller', sev: 'med', fld: 'prop.title', t: 'The seller\u2019s flat is mortgaged', f: 'The encumbrance certificate shows a 2016 mortgage to Lakshmi Housing Finance. CERSAI shows the same charge.', sug: 'Pay the seller\u2019s lender directly from the loan and collect the release deed before registration.', ask: 'The seller\u2019s loan statement and closure letter',
      ev: { kind: 'Encumbrance certificate', title: 'Encumbrance certificate, 2009 to 2026', org: 'Sub-Registrar, Bengaluru South', rows: [['2009', 'Sale deed: builder to Suresh Babu'], ['2016', 'Sale deed: Suresh Babu to Arvind Rao'], ['2016', 'Mortgage: Arvind Rao to Lakshmi Housing Finance'], ['2026', 'No other entry']], hi: 2, read: 'Mortgage, 2016', conf: 95 } }
  ],
  E: [
    { id: 'e-area', sev: 'low', fld: 'prop.area', after: 'legal', t: 'Plot size differs slightly between deed and site', f: 'The sale deed says 150 sq yd. The valuer measured 147 sq yd, 2% less, within the 5% tolerance.', sug: 'Use the measured 147 sq yd in the memo.', ask: 'A demarcation report from the municipal surveyor',
      ev: { kind: 'Valuation report', title: 'Valuation report, Punjab Valuers & Surveyors', org: 'Site visit 9 Nov 2026', rows: [['Plot area, deed', '150 sq yd'], ['Plot area, measured', '147 sq yd'], ['Built-up area', '1,180 sq ft'], ['Market value', '\u20B937,20,000']], hi: 1, read: '147 sq yd', conf: 96 } }
  ]
};

/* ---------- adapters: place the existing cases on the new path ---------- */
const PRICE = { A: 10200000, B: 1780000, C: 5800000, D: 11500000, E: 3650000, F: 3200000 };
const LEADBY = { A: ['Amit Joshi', '2026-11-09 09:55'], B: ['Ganesh Saini', '2026-11-12 10:55'], C: ['HomeKey Advisors (DSA)', '2026-11-06 14:40'], D: ['Farida Khan', '2026-11-04 11:55'], E: ['Punjab Home Loans Point (DSA)', '2026-11-05 10:50'], F: ['Hadoti Finserv (DSA)', '2026-10-26 12:35'] };
function adaptSeed(s0) {
  const s = deep(s0), by = LEADBY[s.id];
  if (by) s.lead = { by: by[0], created: by[1], price: PRICE[s.id], city: s.v.branch.split(' ')[0], consent: { at: addMin(by[1], 9), ch: 'OTP', wa: 1 }, pre: null, in: true };
  if (s.id === 'B') {
    s.docs.forEach(d => { if (!d.up && d.need === 'login') d.up = { f: d.sample, at: '2026-11-12 12:05', by: 'Ganesh Saini' }; });
    const T = id => s.tasks.find(t => t.id === id);
    Object.assign(T('aa'), { st: 'accepted', recv: '2026-11-12 12:10', acc: '2026-11-12 12:10' });
    Object.assign(T('cersai'), { st: 'accepted', recv: '2026-11-13 09:40', acc: '2026-11-13 09:40' });
    Object.assign(T('pd'), { st: 'accepted', assigned: '2026-11-12 12:20', due: addWD('2026-11-12 12:20', 2), recv: '2026-11-14 15:40', acc: '2026-11-14 15:45' });
    Object.assign(T('fcu'), { st: 'accepted', assigned: '2026-11-12 12:22', due: addWD('2026-11-12 12:22', 2), recv: '2026-11-13 16:00', acc: '2026-11-13 16:05' });
    Object.assign(T('legal'), { st: 'assigned', assigned: '2026-11-13 10:00', due: addWD('2026-11-13 10:00', 5) });
    Object.assign(T('tech'), { st: 'assigned', assigned: '2026-11-13 10:05', due: addWD('2026-11-13 10:05', 3) });
    s.w = { step: 'verify' };
  }
  return s;
}
function addMin(s, n) { return S8(new Date(P(s).getTime() + n * 60000)); }
const SEED2 = LEADS.concat(SEED.map(adaptSeed));

/* =====================================================================
   AI-native core (overrides earlier engine pieces by redeclaration)
   ===================================================================== */
/* the system recommends on deviations; it sanctions only clean cases */
function sysOutcome(ev, pol) {
  if (ev.needs.length) return { k: 'incomplete' };
  if (ev.hard.length) { const cure = ev.ways.find(w => w.cure), ok = ev.hard.every(r => r.id === 'r_ltv_reg' || r.id === 'r_foir'); return cure && ok ? { k: 'counter', cure } : { k: 'decline' }; }
  const items = ev.devs.concat(ev.refs), inS = ev.devs.filter(r => r.ml);
  const ml = inS.length && ev.ml ? (!pol.model.on ? 'off' : ev.ml.p <= pol.model.approve ? 'approve' : ev.ml.p >= pol.model.reject ? 'reject' : 'refer') : null;
  if (!items.length) return ev.f.loan <= pol.sysAuth ? { k: 'approved', ml: null, approvedDevs: [], remain: [] } : { k: 'refer', lvl: ev.amtLvl, above: true, approvedDevs: [], remain: [] };
  return { k: 'refer', lvl: ev.lvl, remain: items, ml, approvedDevs: [], inS };
}
function visChecks(c) { return (CHECKS[c.id] || []).filter(k => !k.after || tIn(c, k.after)); }
function chkSt(c, k) { return (c.w.chk || {})[k.id] || { st: 'open' }; }
function openChecks(c) { return visChecks(c).filter(k => ['open', 'asked'].includes(chkSt(c, k).st)); }
function loginMissing(c) { return c.docs.filter(d => d.need === 'login' && !d.up); }
function statusOf(c, ev) {
  const w = c.w, L = c.lead;
  if (w.dec && w.dec.k === 'declined') return { k: 'declined', by: w.dec.by };
  if (L && !L.in) return L.pre ? { k: 'prescreen', res: L.pre.res } : { k: 'lead' };
  if (w.dec && w.dec.k === 'approved') return { k: 'approved', by: w.dec.by };
  if (loginMissing(c).length) return { k: 'docs' };
  if (ev.needs.length) return { k: 'provisional' };
  if (w.req && w.req.k === 'pending') return { k: 'pending', lvl: w.req.lvl };
  const rec = recOf(c, ev);
  if (w.dec && w.dec.k === 'returned') return { k: 'returned', by: w.dec.by, lvl: rec.lvl };
  return { k: 'review', lvl: rec.lvl };
}

function recVerb(rec, c) {
  return { prov: { approve: 'Likely sanction', refer: 'Likely referral', decline: 'Likely decline' }[rec.p], approve: 'Sanction ' + lakh(c.v.loan), cond: 'Sanction ' + lakh(c.v.loan) + ' with conditions', counter: 'Counter-offer ' + lakh(rec.loan), decline: 'Decline' }[rec.k];
}
Object.assign(TONE, { lead: 'info', prescreen: 'info', docs: 'info', provisional: 'info', review: 'warn' });
function stLabel(st) {
  switch (st.k) {
    case 'lead': return 'Collecting documents';
    case 'prescreen': return { yes: 'Pre-screen: eligible', change: 'Pre-screen: eligible with changes', no: 'Pre-screen: not eligible' }[st.res];
    case 'docs': return 'Documents due';
    case 'provisional': return 'Underwriting';
    case 'review': return 'With the credit manager';
    case 'pending': return 'With ' + st.lvl;
    case 'returned': return 'Sent back by ' + byName(st.by);
    case 'approved': return st.by === 'SYS' ? 'Sanctioned by the system' : 'Sanctioned by ' + byName(st.by);
    case 'declined': return st.by === 'SYS' ? 'Not eligible' : 'Rejected';
  }
  return '';
}
function pill(st) { const t = st.k === 'prescreen' ? { yes: 'ok', change: 'warn', no: 'err' }[st.res] : TONE[st.k]; return `<span class="dpill ${t}">${esc(stLabel(st))}</span>`; }
function canEdit(c) { return S.role === 'cm' && ['review', 'returned'].includes(E.st.k); }
function decisionTxt(c, ev) {
  const st = ev.st, d = c.w.dec, rec = recOf(c, ev);
  switch (st.k) {
    case 'approved': return st.by === 'SYS' ? 'Sanctioned by the system: every rule met, no checks raised, and within its ' + lakh(POL.sysAuth) + ' limit.' : 'Sanctioned by ' + byName(d.by) + ' (' + d.by + ') on ' + fdt(d.at) + (d.counter ? ', as a counter-offer of ' + lakh(d.counter.to.loan) : '') + '.';
    case 'pending': return 'Recommended by ' + AUTH.L1.name + ' and with ' + AUTH[st.lvl].name + ' (' + st.lvl + ') since ' + fdt(c.w.req.at) + '.';
    case 'review': case 'returned': return 'The system recommends: ' + lc1(recVerb(rec, c)) + '. ' + (RANK[rec.lvl] <= 1 ? 'Within the credit manager\u2019s authority.' : 'Needs ' + rec.lvl + ' (' + AUTH[rec.lvl].title + ').');
    case 'declined': return (d.by === 'SYS' ? 'Not eligible at pre-screen: ' : 'Rejected by ' + byName(d.by) + ' on ' + fdt(d.at) + ': ') + listAnd((d.reasons || []).map(k => lc1(REJ[k].t))) + '.';
    case 'provisional': return 'Provisional: ' + lc1(recVerb(rec, c)) + ', waiting for ' + listAnd(ev.needs.map(r => r.v.replace('Waiting for ', ''))) + '.';
  }
  return 'Not decided yet.';
}

/* ---------- pre-screen: identity, income, bureau and the stated price ---------- */
const PRE_RULES = ['r_minc', 'r_foir', 'r_age', 'r_ten', 'r_score', 'r_dpd', 'r_ntc', 'r_ltv_reg', 'r_ltv_pol'];
function prescreenOf(c) {
  const f = Object.assign(factsOf(c), { valUsed: c.lead.price, basis: 'the price the customer stated', incKnown: true, kycIn: true, bureauIn: true, legalIn: true, legal: 'clear', techIn: true, nVals: 2, valVar: 0, neg: 'none', planDev: null, needOC: false, resid: 60, cersaiIn: true, cersai: 'clear', fcuIn: true, fcu: 'pos', uc: false, colend: null });
  const ev = evalFacts(f, POL), R = ev.R.filter(r => PRE_RULES.includes(r.id) && r.st !== 'na');
  const hard = R.filter(r => r.st === 'fail' && r.kind === 'hard'), devs = R.filter(r => r.st === 'fail' && r.kind !== 'hard'), cure = ev.ways.find(w => w.cure);
  const curable = hard.every(r => r.id === 'r_foir' || r.id === 'r_ltv_reg');
  const res = hard.length && !(curable && cure) ? 'no' : hard.length || devs.length ? 'change' : 'yes';
  return { res, ev, R, hard, devs, cure, max: ev.m.elig };
}
function preReasons(p) { const k = []; p.hard.forEach(r => { const m = { r_dpd: 'r_score', r_score: 'r_score', r_foir: 'r_foir', r_ltv_reg: 'r_ltv_reg' }[r.id] || 'other'; if (!k.includes(m)) k.push(m); }); return k.length ? k : ['other']; }

/* ---------- the case file the system builds ---------- */
const DOCF = { pan: 3, adh: 4, sal: 3, f16: 2, itr: 3, biz: 2, f60: 2, ats: 4, afs: 4, deeds: 3, ec: 2, oc: 1, share: 2, allot: 2, bnoc: 2, own: 1, patta: 3, gift: 3, gpnd: 2, est: 2, btsan: 3, btsoa: 3, lod: 2, reno: 1, tax: 1, khata: 2, sloan: 2, app: 6, cons: 0, plan: 1 };
function hsh(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function cfData(c) {
  const up = id => { const d = c.docs.find(x => x.id === id); return d && d.up ? d : null; };
  const kyc = tIn(c, 'kyc'), bur = tIn(c, 'bureau'), aa = tIn(c, 'aa'), lo = id => ['patta', 'gift', 'gpnd'].includes(id);
  const flagged = {}; openChecks(c).forEach(k => { if (k.fld) flagged[k.fld] = k; });
  const out = [];
  const fld = (sec, key, l, v, docs, verify, declared, srcName) => {
    const d = docs.map(up).find(Boolean), id = d ? d.id.split('_')[0] : '';
    let st, src = '', conf = null;
    if (verify) { st = 'ver'; src = verify; }
    else if (d) { st = 'doc'; src = d.t; conf = lo(id) ? 86 + hsh(key) % 6 : 94 + hsh(key) % 6; }
    else if (declared) { st = 'dec'; src = srcName || 'Declared at the lead'; }
    else st = 'wait';
    out.push({ sec, key, l, v, st, src, conf, flag: flagged[key] || null, fresh: (S.fresh || []).includes(key) });
  };
  c.apps.forEach(a => {
    const sec = (a.role === 'Applicant' ? 'Applicant: ' : 'Co-applicant: ') + a.name, P = 'pan_' + a.id, A = 'adh_' + a.id;
    fld(sec, a.id + '.name', 'Name', a.name, [P], up(P) && kyc ? 'Income Tax database' : '', true);
    fld(sec, a.id + '.pan', a.pan.indexOf('Form') >= 0 ? 'PAN or Form 60' : 'PAN', a.pan, [P, 'f60_' + a.id], up(P) && kyc ? 'Income Tax database' : '', false);
    fld(sec, a.id + '.aadhaar', 'Aadhaar', a.aadhaar, [A], up(A) && kyc ? 'Aadhaar offline e-KYC' : '', false);
    fld(sec, a.id + '.age', 'Age', a.age + ' years', [A], '', false);
    fld(sec, a.id + '.addr', 'Address', a.addr, [A], up(A) && kyc && !flagged[a.id + '.addr'] ? 'Aadhaar offline e-KYC' : '', true);
    fld(sec, a.id + '.mob', 'Mobile', a.mobile, [], 'OTP at the lead', true);
    fld(sec, a.id + '.work', 'Work', a.occ + (a.org && a.org !== a.occ ? ', ' + a.org : ''), ['sal_' + a.id, 'itr_' + a.id, a.id === 'a1' ? 'biz' : 'x', 'f16_' + a.id], '', true);
    if (a.earning) fld(sec, a.id + '.inc', 'Monthly income', inr(a.inc), ['sal_' + a.id, 'itr_' + a.id], c.prog === 'aip' && tIn(c, 'pd') ? 'Personal discussion' : (aa && a.emp === 'Salaried' && c.bank.acct.indexOf(a.aadhaar.slice(-4)) >= 0 && !flagged[a.id + '.inc'] ? 'Account Aggregator salary credits' : ''), true);
    fld(sec, a.id + '.cibil', 'Bureau score', a.cibil ? String(a.cibil) : 'No credit history', [], bur ? 'CIBIL' : '', false);
  });
  const v = c.v, p = c.prop, L = c.lead;
  fld('Loan asked for', 'loan.amt', 'Amount', lakh(v.applied.loan), [], '', true, L ? 'Declared at the lead' : 'Application form');
  fld('Loan asked for', 'loan.ten', 'Tenure', yrsTxt(v.applied.tenure), [], '', true, L ? 'Declared at the lead' : 'Application form');
  fld('Loan asked for', 'loan.pur', 'Purpose', v.purpose, ['app'], '', true);
  fld('Property', 'prop.addr', 'Address', p.addr, ['ats', 'afs', 'patta', 'btsan', 'allot'], '', true);
  fld('Property', 'prop.val', p.agreement ? 'Price' : 'Cost', p.agreement ? inr(p.agreement) : p.est ? inr(p.est) : c.bt ? inr(c.bt.out) + ' to transfer' : DASH, ['ats', 'afs', 'est', 'btsan'], '', !!(L && L.price), 'Declared at the lead');
  fld('Property', 'prop.area', 'Area', p.area, ['ats', 'afs', 'oc', 'patta'], '', false);
  fld('Property', 'prop.title', 'Title', p.legal.chain.length ? p.legal.chain.map(x => x.y + ' ' + lc1(x.t)).join(', ') : DASH, ['deeds', 'patta', 'gift', 'afs', 'lod'], '', false);
  if (['resale', 'bt'].includes(c.variant)) fld('Property', 'prop.oc', 'Occupancy certificate', p.oc ? 'On file' : 'Not on file', ['oc', 'share'], '', false);
  fld('Banking', 'bank.acct', 'Account', c.bank.acct, ['bank_a1'], aa && c.bank.via.indexOf('PDF') !== 0 ? 'Account Aggregator' : '', false);
  fld('Banking', 'bank.pat', 'Pattern', c.bank.salary, ['bank_a1'], aa && c.bank.via.indexOf('PDF') !== 0 ? 'Account Aggregator' : '', false);
  fld('Banking', 'bank.bounce', 'Bounces, 12 months', String(c.bank.bounces), ['bank_a1'], aa && c.bank.via.indexOf('PDF') !== 0 && !flagged['bank.bounce'] ? 'Account Aggregator' : '', false);
  c.oblig.forEach(o => fld('Loans already running', 'ob.' + o.id, o.t, (o.emi ? inr(o.emi) + ' a month' : 'No EMI') + (o.count ? '' : ', left out of FOIR'), [], bur ? 'CIBIL' : '', false));
  applyExt(c, out);
  return out;
}
const EXT_ROWS = { name: ['name', 'Name'], pan: ['pan', 'PAN'], aadhaarLast4: ['aadhaar', 'Aadhaar'], address: ['addr', 'Address'], employer: ['work', 'Work'] };
const EXT_NEW = { dob: 'Date of birth', fatherName: 'Father\u2019s name', gender: 'Gender', relationLine: 'Relation line on Aadhaar', grossPay: 'Gross pay', netPay: 'Net pay' };
function applyExt(c, out) {
  const ext = c.ext && c.ext.fields; if (!ext) return;
  const secOf = a => (a.role === 'Applicant' ? 'Applicant: ' : 'Co-applicant: ') + a.name;
  c.apps.forEach(a => {
    Object.keys(ext).filter(k => k.startsWith(a.id + '.')).forEach(k => {
      const f = ext[k], key = f.key; if (!f.value) return;
      const src = f.source === 'manual' ? 'Typed by the user' : f.source === 'lead' ? 'Declared at the lead' : f.source && f.source.label ? f.source.label : 'Documents';
      const conf = typeof f.confidence === 'number' ? Math.round(f.confidence * 100) : null;
      const flag = f.status === 'needs-check' || f.status === 'conflict' ? { t: f.note || 'Check this value' } : null;
      const val = key === 'aadhaarLast4' ? 'XXXX XXXX ' + f.value : f.value;
      const map = EXT_ROWS[key];
      if (map) {
        const row = out.find(x => x.key === a.id + '.' + map[0]);
        if (row) { Object.assign(row, { v: val, st: f.source === 'manual' || f.source === 'lead' ? 'dec' : 'doc', src, conf, flag: flag || row.flag }); return; }
      }
      out.push({ sec: secOf(a), key: a.id + '.x.' + key, l: EXT_NEW[key] || key, v: val, st: f.source === 'manual' || f.source === 'lead' ? 'dec' : 'doc', src, conf, flag, fresh: false });
    });
  });
}
function cfCount(c) { const F = cfData(c); return { n: F.length, done: F.filter(x => x.st !== 'wait').length, flag: F.filter(x => x.flag).length }; }

/* ---------- what the system did, as a trail ---------- */
function preTxt(c) { const p = c.lead.pre; return p.res === 'yes' ? 'Pre-screen: eligible up to ' + lakh(p.max) : p.res === 'change' ? 'Pre-screen: eligible with changes' : 'Pre-screen: not eligible'; }
function aiEvents(c) {
  const out = [], rd = who('sys', 'Document reader', 'Reads and fills the case file'), g = {};
  c.docs.filter(d => d.up && d.up.by !== 'System').forEach(d => { const k = d.up.at.slice(0, 13) + d.up.by; if (!g[k]) g[k] = { at: d.up.at, n: 0, f: 0 }; g[k].n++; g[k].f += DOCF[d.id.split('_')[0]] || 2; if (d.up.at > g[k].at) g[k].at = d.up.at; });
  Object.values(g).forEach(x => out.push({ at: addMin(x.at, 1), w: rd, cat: 'data', txt: 'Read ' + plural(x.n, 'document') + ' and filled ' + x.f + ' fields', det: '', ai: 'doc' }));
  if (c.lead && c.lead.pre) { const p = c.lead.pre; out.push({ at: p.at, w: who('sys', 'Pre-screen', 'Policy v' + POL.ver), cat: 'decision', txt: preTxt(c), det: p.res === 'no' ? 'Main reason: ' + lc1(REJ[preReasons(prescreenOf(c))[0]].t) + '.' : 'Indicative only. Uses the price the customer stated.', ai: 'pre' }); }
  if (c.w.sysAt) {
    const ev = fullEval(c), items = ev.devs.concat(ev.refs), nk = visChecks(c).length, at = c.w.sysAt;
    out.push({ at, w: who('sys', 'Rules engine', 'Policy v' + POL.ver), cat: 'decision', txt: 'Ran ' + plural(ev.R.filter(r => r.st !== 'na').length, 'rule'), det: ev.hard.length ? 'Hard stops: ' + listAnd(ev.hard.map(itemTxt)) + '.' : items.length ? 'For a person: ' + listAnd(items.map(itemTxt)) + '.' : 'Every rule met.', ai: 'rules' });
    if (ev.ml) out.push({ at, w: who('sys', 'Deviation model', MODEL.id + ' ' + POL.model.ver), cat: 'decision', txt: 'Scored the deviation: ' + pct(ev.ml.p) + ' risk', det: 'A typical deviation case is ' + pct(ev.ml.pt) + '. The model recommends; a person decides.', ai: 'model' });
    out.push({ at: addMin(at, 1), w: who('sys', 'Memo writer', 'Drafts the credit memo'), cat: 'data', txt: 'Wrote the credit memo', det: '12 sections, each figure linked to its source.', ai: 'memo' });
    if (nk) out.push({ at: addMin(at, 1), w: who('sys', 'System', 'Checks for a person'), cat: 'decision', txt: 'Raised ' + plural(nk, 'check') + ' for the credit manager', det: listAnd(visChecks(c).map(k => lc1(k.t))) + '.', ai: 'checks' });
  }
  return out;
}
function sysEvents(c) { return aiEvents(c); }

/* ---------- the system sanctions a clean case the moment it is complete ---------- */
function settle(c, when) {
  if (c.w.dec || c.w.req || (c.lead && !c.lead.in) || loginMissing(c).length) return false;
  const ev = fullEval(c); if (ev.needs.length) return false;
  if (!c.w.sysAt) c.w.sysAt = when || tick(1);
  if (ev.sys.k === 'approved' && !openChecks(c).length && !c.w.touched) {
    c.w.dec = { k: 'approved', by: 'SYS', at: addMin(c.w.sysAt, 1) };
    c.w.log.push({ at: c.w.dec.at, w: who('sys', 'System', 'Automatic sanction'), cat: 'decision', txt: 'Sanctioned by the system', det: 'Every rule met, no checks raised, and ' + lakh(c.v.loan) + ' is within the system\u2019s ' + lakh(POL.sysAuth) + ' limit.' });
    return true;
  }
  return false;
}
function mk(seed) {
  const c = fresh(seed);
  if (c.lead) {
    const e = c.w.log.find(x => x.txt === 'Application logged in');
    if (e && !c.lead.in) { e.at = c.lead.created; e.txt = 'Lead created'; e.det = 'Asked for ' + lakh(c.v.applied.loan) + ' over ' + yrsTxt(c.v.applied.tenure) + '. Property price ' + lakh(c.lead.price) + ', as stated.'; e.w = who('ppl', c.lead.by, 'Sourcing'); }
    else if (c.lead.in) c.w.log.push({ at: c.lead.created, w: who('ppl', c.lead.by, 'Sourcing'), cat: 'doc', txt: 'Lead created', det: 'Price stated: ' + lakh(c.lead.price) + '.' });
    if (c.lead.consent) c.w.log.push({ at: c.lead.consent.at, w: who('cus', c.apps[0].name, 'Customer'), cat: 'comms', txt: 'Consent given by OTP', det: 'Credit bureau and bank data' + (c.lead.consent.wa ? '. Opted in to updates on WhatsApp' : '') + '. Privacy notice version 3.2.' });
    if (c.lead.consent && tIn(c, 'bureau')) { const p = prescreenOf(c); c.lead.pre = { at: addMin(c.lead.consent.at, 3), res: p.res, max: p.max }; }
    c.w.log.sort((a, b) => a.at < b.at ? -1 : a.at > b.at ? 1 : 0);
  }
  if (c.id === 'D') { c.w.san = { sent: '2026-11-10 13:05', accepted: '2026-11-11 18:20' }; }
  settle(c, c.w.sysAt);
  if (c.id === 'D') { c.w.log.push({ at: '2026-11-10 13:05', w: L1W(), cat: 'comms', txt: 'Sanction letter and KFS sent to the customer', det: 'Email and SMS to the registered contacts.' }, { at: '2026-11-11 18:20', w: who('cus', c.apps[0].name, 'Customer'), cat: 'comms', txt: 'Sanction and KFS accepted', det: 'OTP on the registered mobile.' }); }
  return c;
}


/* =====================================================================
   AI-native views
   ===================================================================== */

const inits = n => String(n).split(/[\s(]+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');



/* ---------- pipeline board ---------- */
const COLS = [['lead', 'Leads'], ['prescreen', 'Pre-screen'], ['docs', 'Login and documents'], ['provisional', 'Underwriting'], ['decision', 'Decision'], ['sanctioned', 'Sanctioned'], ['closed', 'Closed']];
function colOf(st) { return { lead: 'lead', prescreen: 'prescreen', docs: 'docs', provisional: 'provisional', review: 'decision', returned: 'decision', pending: 'decision', approved: 'sanctioned', declined: 'closed' }[st.k]; }

function ownerOf(c, ev) {
  const st = ev.st, d = c.w.dec;
  if (['lead', 'prescreen', 'docs'].includes(st.k)) return c.lead ? c.lead.by.split(' (')[0] : c.v.srcBy;
  if (st.k === 'pending') return AUTH[st.lvl].name;
  if (st.k === 'approved' || st.k === 'declined') return d.by === 'SYS' ? 'System' : byName(d.by);
  return AUTH.L1.name;
}
function cardNote(c, ev) {
  const st = ev.st, rec = recOf(c, ev);
  switch (st.k) {
    case 'lead': { const pre = c.docs.filter(d => d.need === 'pre'); return pre.filter(d => d.up).length + ' of ' + pre.length + ' documents. ' + (c.lead.consent ? 'Consent given.' : 'Consent pending.'); }
    case 'prescreen': { const p = c.lead.pre; if (p.res === 'yes') return 'Eligible up to ' + lakh(p.max) + '. Ready to log in.'; if (p.res === 'change') { const cu = prescreenOf(c).cure; return 'Works at ' + (cu ? lakh(cu.apply.loan) : 'a lower amount') + ', or with an earning co-applicant.'; } return 'Not eligible: ' + lc1(REJ[preReasons(prescreenOf(c))[0]].t) + '.'; }
    case 'docs': return plural(loginMissing(c).length, 'document') + ' still due.';
    case 'provisional': { const late = c.tasks.find(t => tState(t) === 'late'); return recVerb(rec, c) + '. ' + (late ? late.t + ' ' + plural(wdLate(late.due), 'day') + ' late.' : 'Waiting for ' + plural(c.tasks.filter(t => t.st !== 'accepted').length, 'report') + '.'); }
    case 'review': case 'returned': { const oc = openChecks(c).length; return recVerb(rec, c) + '. ' + (oc ? plural(oc, 'check') + ' open.' : 'No open checks.'); }
    case 'pending': return 'Referred by ' + AUTH.L1.name + ' with a recommendation.';
    case 'approved': return c.w.san.handoff ? 'With operations.' : c.w.san.accepted ? 'Customer accepted.' : c.w.san.sent ? 'Sent to the customer.' : 'Pack ready to send.';
    case 'declined': return (c.w.dec.reasons || []).map(k => REJ[k].t).join('. ') + '.';
  }
  return '';
}
function boardHTML() {
  const rows = CASES.map((c, i) => ({ c, i, ev: fullEval(c) })).filter(r => !(r.c.lead && r.c.lead.hidden));
  rows.forEach(r => { r.me = needsMe2(r.c, r.ev); r.col = colOf(r.ev.st); });
  const sanc = rows.filter(r => r.ev.st.k === 'approved'), sys = sanc.filter(r => r.ev.st.by === 'SYS').length;
  const vend = rows.filter(r => r.c.tasks.some(t => t.st === 'assigned')), late = rows.filter(r => r.c.tasks.some(t => tState(t) === 'late')).length;
  const days = rows.filter(r => r.c.w.dec && r.c.lead && r.c.lead.in && r.c.w.dec.k === 'approved').map(r => wdLate(r.c.v.login, r.c.w.dec.at) + 1).sort((a, b) => a - b);
  const med = days.length ? (days.length % 2 ? days[(days.length - 1) / 2] : (days[days.length / 2 - 1] + days[days.length / 2]) / 2) : null;
  const met = (l, v, s) => `<div class="met"><div class="met-l">${l}</div><div class="met-v">${v}</div><div class="met-s">${s}</div></div>`;
  const title = S.role === 'ap' ? 'Approvals for ' + AUTH[S.lvl].name : 'CRM';
  const sub = S.role === 'sales' ? 'Leads and files you sourced, from first documents to sanction. The system reads, checks and builds each file as you go.' : S.role === 'cm' ? 'Files the system has worked. Cards marked for you need a check or a decision.' : S.role === 'ap' ? 'Files referred to you, with the credit manager\u2019s recommendation.' : 'Read only for credit policy. Policy changes are made in the policy studio.';
  const card = r => { const c = r.c, ev = r.ev, ow = ownerOf(c, ev); return `<button class="kc${r.me ? ' me' : ''}" data-act="open" data-v="${r.i}"><b>${esc(caseName(c))}</b><small>${esc(lakh(c.v.loan))}, ${esc(lc1(VAR[c.variant]))}, ${esc(c.v.branch)}</small>${pill(ev.st)}<p>${esc(cardNote(c, ev))}</p><span class="kc-f"><span class="mini-av">${esc(ow === 'System' ? 'S' : inits(ow))}</span>${esc(ow)}${r.me ? '<span class="me-t">Needs you</span>' : ''}</span></button>`; };
  return `<div class="bk-h"><div><h2>${esc(title)}</h2><p>${esc(sub)}</p></div><div class="act">${['sales', 'cm'].includes(S.role) ? `<button class="btn btn-p btn-sm" data-act="newlead">${ic('plus')}New lead</button>` : ''}</div></div>
  <div class="kpis">${met('Open files', rows.filter(r => !['approved', 'declined'].includes(r.ev.st.k)).length, rows.filter(r => r.me).length + ' need you')}${met('Waiting on outside reports', vend.length, late ? plural(late, 'report') + ' late' : 'None late')}${met('Sanctioned', sanc.length, sys + ' by the system on its own')}${met('Login to sanction', med != null ? trimz(med.toFixed(1)) + ' <small class="of">days</small>' : DASH, 'Median, working days')}${met('Closed at pre-screen', rows.filter(r => r.ev.st.k === 'declined' && r.c.w.dec.by === 'SYS').length, 'Reasons sent in writing')}</div>
  <div class="board">${COLS.map(([k, l]) => { const L = rows.filter(r => r.col === k).sort((a, b) => b.me - a.me); return `<section class="col" aria-label="${l}"><div class="col-h"><b>${l}</b><span>${L.length}</span></div><div class="col-b">${L.map(card).join('') || '<div class="col-e">None</div>'}</div></section>`; }).join('')}</div>`;
}

/* ---------- case header and tabs ---------- */


function tabsOf(c, st) {
  const cf = cfCount(c), din = c.docs.filter(d => d.up).length, dall = c.docs.filter(d => d.need !== 'cp' && d.need !== 'opt').length;
  const lead = ['lead', 'prescreen'].includes(st.k) || (st.k === 'declined' && c.lead && !c.lead.in);
  const T = [['overview', 'Overview'], ['casefile', 'Case file', cf.done + '/' + cf.n, cf.flag > 0], ['docs', 'Documents', din + '/' + dall], ['income', 'Income and credit']];
  if (!lead) { const nf = E.R.filter(r => r.st === 'fail').length; T.push(['property', 'Property'], ['rules', 'Checks and rules', nf || null, nf > 0], ['memo', 'Credit memo']); }
  if (['approved', 'declined'].includes(st.k)) T.push(['sanction', st.k === 'declined' ? 'Letter' : 'Sanction']);
  T.push(['audit', 'Audit trail']);
  return T;
}


/* ---------- lead workspace: documents, consent, pre-screen, case file ---------- */
function docRow2(c, d, ro, roTxt) {
  const rd = S.reading === c.id + ':' + d.id, nf = DOCF[d.id.split('_')[0]];
  const right = rd ? '<span class="rd-ing"><span class="spin"></span>Reading</span>'
    : d.up ? `<span class="okmark" title="${esc(d.up.f + ', ' + fdt(d.up.at))}">${ic('check')}${d.up.by === 'System' ? 'Fetched' : nf ? 'Read, ' + nf + ' fields' : 'In'}</span>`
      : d.need === 'cp' ? '<span class="muted" style="font-size:12px">Before disbursement</span>'
        : ro ? `<span class="muted" style="font-size:12px">${esc(roTxt || 'Not in yet')}</span>` : `<button class="btn btn-s btn-sm" data-act="up2" data-v="${d.id}">${ic('upload')}Upload</button>`;
  return `<div class="dr${d.up ? ' done' : ''}">${ic('file')}<span class="dr-t">${esc(d.t)}</span>${right}</div>`;
}
function consentTable(c) {
  const k = c.lead.consent;
  return `<table class="tbl"><thead><tr><th>Purpose</th><th>Status</th><th>When</th></tr></thead><tbody>${[['Credit report pull, shows as an enquiry', 'Given'], ['12 months of bank data, Account Aggregator', 'Given'], ['Privacy notice, version 3.2', 'Acknowledged']].concat(k.wa ? [['Updates on WhatsApp, can be stopped any time', 'Opted in']] : []).map(([t, s]) => `<tr><td>${esc(t)}</td><td><span class="st pass">${s}</span></td><td class="muted">${fdt(k.at)}, ${esc(k.ch)}</td></tr>`).join('')}</tbody></table>`;
}
function leadLeft() {
  const c = C(), L = c.lead, pre = c.docs.filter(d => d.need === 'pre'), n = pre.filter(d => d.up).length, ro = !['sales', 'cm'].includes(S.role) || !!L.pre;
  const cats = [...new Set(pre.map(d => d.cat))], cons = L.consent;
  const cbox = cons ? consentTable(c) : S.otp === c.id ? `<p class="muted" style="margin:0">The customer has an SMS with the privacy notice and an OTP.</p><div class="otp"><span class="spin"></span>Waiting for ${esc(c.apps[0].name.split(' ')[0])} to approve it with the OTP</div>` : `<p style="margin:0 0 10px;color:var(--ink-2);font-size:12.8px">The customer gets an SMS with the privacy notice. Approving it lets us pull the credit report, which records an enquiry on it, and fetch 12 months of bank data through the Account Aggregator. It also asks if they want updates on WhatsApp. That part is optional: without it, updates go by SMS.</p>${ro ? '' : `<button class="btn btn-p btn-sm" data-act="consent">${ic('send')}Send the consent request</button>`}`;
  return `<div id="docx-root" data-case="${esc(c.id)}" data-ro="${ro ? 1 : 0}"></div>
  <section class="panel" style="margin-top:14px"><div class="ph"><h3>Consent for the credit report and bank data</h3><span class="note">${cons ? 'Given by OTP' : 'Needed before the pre-screen'}</span></div><div class="pb">${cbox}</div></section>
  <section class="panel" style="margin-top:14px"><div class="ph"><h3>Lead details</h3><span class="note">As declared</span></div><div class="pb"><div class="fgrid one">${L.ltype ? fr('Type of loan', esc(L.ltype)) : ''}${L.atype ? fr('Type of applicant', esc(L.atype)) : ''}${fr('Loan asked for', lakh(c.v.applied.loan) + ' over ' + yrsTxt(c.v.applied.tenure))}${L.ptype ? fr('Property type', esc(L.ptype)) : ''}${fr('Property value, as stated', lakh(L.price))}${fr('Branch city', esc(L.city))}${fr('Sourced by', esc(L.by))}${fr('Created', fdt(L.created))}</div></div></section>`;
}
function preLine(r) {
  const cap = String(r.lim).split('%')[0], t = { r_foir: 'FOIR ' + r.v + ' against a cap of ' + cap + '%', r_ltv_reg: 'LTV ' + r.v + ' on the stated price, against the RBI cap of ' + cap + '%', r_ltv_pol: 'LTV ' + r.v + ' against the policy cap of ' + cap + '%', r_score: 'Lowest bureau score ' + r.v, r_dpd: r.v, r_age: 'Age at maturity: ' + r.v, r_minc: 'Eligible income ' + r.v, r_ten: 'Tenure ' + r.v, r_ntc: r.v }[r.id] || r.name;
  return { cls: r.st === 'pass' ? 'ok' : r.kind === 'hard' ? 'nx' : 'dv', t: cap1(t) };
}
function preCardHTML(c) {
  const L = c.lead, can = ['sales', 'cm'].includes(S.role);
  if (S.pre && S.pre.id === c.id) { const steps = ['Checking PAN and Aadhaar', 'Pulling the credit reports', 'Reading 12 months of bank data', 'Checking the policy']; return `<section class="panel" style="margin-bottom:14px"><div class="ph"><h3>Pre-screen running</h3><span class="note">About a minute in real life</span></div><div class="pb"><div class="prs">${steps.map((t, i) => `<div class="${i < S.pre.step ? 'done' : i === S.pre.step ? 'cur' : ''}">${i < S.pre.step ? ic('check') : i === S.pre.step ? '<span class="spin"></span>' : ic('clock')}${t}</div>`).join('')}</div></div></section>`; }
  if (!L.pre) {
    const miss = c.docs.filter(d => d.need === 'pre' && !d.up).length;
    return `<section class="panel" style="margin-bottom:14px"><div class="ph"><h3>Pre-screen</h3><span class="note">Runs by itself when these are in</span></div><div class="pb"><div class="prs"><div class="${miss ? '' : 'done'}">${miss ? ic('clock') : ic('check')}Identity and income documents${miss ? ': ' + miss + ' to come' : ''}</div><div class="${L.consent ? 'done' : ''}">${L.consent ? ic('check') : ic('clock')}Consent for the credit report and bank data</div></div></div></section>`;
  }
  const p = prescreenOf(c), m = p.ev.m, f = p.ev.f, res = L.pre.res, tone = { yes: 'ok', change: 'warn', no: 'err' }[res];
  const verb = res === 'yes' ? 'Eligible up to ' + lakh(L.pre.max) : res === 'change' ? 'Eligible with changes' : 'Not eligible';
  const key = ['r_foir', 'r_ltv_reg', 'r_score', 'r_dpd', 'r_age'], lines = p.R.filter(r => key.includes(r.id) || r.st === 'fail').map(preLine);
  let acts = '';
  if (res === 'yes' && can) acts = `<button class="btn btn-p" data-act="login">Log in the file</button>`;
  if (res === 'change') { const ways = p.ev.ways.filter(w => w.k === 'loan' || w.k === 'income' || w.k === 'tenure'); acts = `<div class="ins-k" style="margin-top:6px">What would work</div>${ways.map(w => `<div class="opp"><div><b>${esc(w.t)}</b><span>${esc(w.d)}</span></div>${w.k === 'loan' && can ? `<button class="btn btn-p btn-sm" data-act="login" data-v="${w.apply.loan}">Log in at ${lakh(w.apply.loan)}</button>` : w.k === 'income' && can ? `<button class="btn btn-s btn-sm" data-act="hold">Hold for a co-applicant</button>` : ''}</div>`).join('')}`; }
  if (res === 'no' && can) acts = `<button class="btn btn-x" data-act="closelead">Close and send the reasons</button>`;
  return `<div class="hero one ${tone}" style="margin-bottom:14px"><div><span class="rec-b">${ic('cpu')}Pre-screen, indicative</span><h2 class="hero-verb">${esc(verb)}</h2><p class="hero-why">Asked: ${lakh(f.loan)} over ${yrsTxt(f.tenure)}. EMI about ${inr(m.emi)} at ${f.roi.toFixed(2)}%.</p><ul class="why">${lines.map(w => `<li class="${w.cls}">${ic(w.cls === 'ok' ? 'check' : w.cls === 'nx' ? 'x' : 'alert')}<span>${esc(w.t)}</span></li>`).join('')}</ul><div class="hero-act">${acts}</div><p class="hnote" style="margin-top:10px">${res === 'no' ? 'The customer gets the main reasons in writing.' : 'Indicative only. It uses the price the customer stated; the final terms follow the legal and valuation checks.'}</p></div></div>`;
}
function stChip(x) { if (x.flag) return `<span class="src edited" title="${esc(x.flag.t)}">Check</span>`; return x.st === 'ver' ? chip('ver', x.src) : x.st === 'doc' ? `<span class="src extracted" title="${esc(x.src)}">${x.conf}%</span>` : x.st === 'dec' ? chip('dec', x.src) : ''; }
function cfBuildHTML(c) {
  const F = cfData(c), done = F.filter(x => x.st !== 'wait').length, secs = [...new Set(F.map(x => x.sec))];
  return `<section class="panel"><div class="ph"><h3>Case file</h3><span class="note">Built by the system as documents are read</span><button class="lnk act" data-act="tab" data-v="casefile">Open in full</button></div><div class="pb"><div class="cfb"><div class="up-bar"><i style="width:${done / F.length * 100}%"></i></div><b style="font-size:12.5px;white-space:nowrap">${done} of ${F.length} fields</b></div>
  ${secs.map(s => `<div class="ins-k" style="margin-top:10px">${esc(s)}</div>${F.filter(x => x.sec === s).map(x => `<div class="fd${x.fresh ? ' fresh' : ''}${x.st === 'wait' ? ' empty' : ''}"><div class="fd-l">${esc(x.l)}</div><div class="fd-v">${x.st === 'wait' ? '<em class="awt">Not in yet</em>' : esc(x.v)}${stChip(x)}</div></div>`).join('')}`).join('')}</div></section>`;
}
function leadRight() { const c = C(); return preCardHTML(c) + cfBuildHTML(c); }
function leadFoot() {
  const c = C(), L = c.lead, miss = c.docs.filter(d => d.need === 'pre' && !d.up).length, can = ['sales', 'cm'].includes(S.role);
  if (!L.pre) return `<div class="gate"><b>${miss || !L.consent ? 'Still needed: ' + listAnd([miss ? plural(miss, 'document') : '', L.consent ? '' : 'the consent']) : 'Ready'}</b><span>The pre-screen runs by itself as soon as everything is in.</span></div>`;
  const r = L.pre.res, cu = r === 'change' ? prescreenOf(c).cure : null;
  return `<div class="gate"><b>${r === 'yes' ? 'Eligible up to ' + lakh(L.pre.max) : r === 'change' ? 'Eligible with changes' : 'Not eligible'}</b><span>${r === 'no' ? 'Close the lead; the reasons go to the customer in writing.' : 'Logging in creates the application number and asks the customer for the rest of the documents.'}</span></div>${!can ? '' : r === 'yes' ? '<button class="btn btn-p btn-lg" data-act="login">Log in the file</button>' : r === 'change' && cu ? `<button class="btn btn-p btn-lg" data-act="login" data-v="${cu.apply.loan}">Log in at ${lakh(cu.apply.loan)}</button>` : r === 'no' ? '<button class="btn btn-x btn-lg" data-act="closelead">Close and send the reasons</button>' : ''}`;
}

/* ---------- case overview: recommendation, checks, decision ---------- */
function liOf(r) {
  const tail = r.kind === 'hard' ? (r.reg ? ': no one can approve this' : ': a hard stop') : r.ml && E.ml ? ': the model puts the risk at ' + pct(E.ml.p) + (E.ml.p <= POL.model.approve ? ', low' : E.ml.p >= POL.model.reject ? ', high' : ', a judgement call') : (r.lvl === 'L1' ? ': within your authority' : ': needs ' + r.lvl);
  return { cls: r.kind === 'hard' ? 'nx' : r.kind === 'ref' ? 'nd' : 'dv', t: cap1(itemTxt(r)) + tail };
}
function recHTML() {
  const c = C(), st = E.st, rec = recOf(c, E), m = E.m, d = c.w.dec, items = E.hard.concat(E.devs, E.refs), passN = E.R.filter(r => r.st === 'pass').length;
  const terms = lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure) + ' at ' + c.v.roi.toFixed(2) + '%, EMI ' + inr(m.emi) + '.' + (E.ml ? ' Model risk ' + pct(E.ml.p) + '.' : '');
  let tone = 'info', badge = '', bic = 'cpu', verb = '', sub = '', why = [], auth = '';
  switch (st.k) {
    case 'docs': { const ms = loginMissing(c); badge = 'Logged in'; verb = 'Documents due'; sub = plural(ms.length, 'document') + ' still to come: ' + listAnd(ms.map(x => lc1(x.t))) + '. The system orders the legal, valuation and field checks the moment they are in.'; break; }
    case 'provisional': badge = 'Provisional recommendation'; verb = recVerb(rec, c) + ' ' + lakh(c.v.loan); sub = 'Waiting for ' + listAnd(needsTxt(E)) + '. The final recommendation follows when the reports are in.'; why = items.map(liOf).concat([{ cls: 'ok', t: plural(passN, 'rule') + ' met so far' }]); break;
    case 'review': case 'returned': { tone = rec.k === 'decline' ? 'err' : rec.k === 'counter' ? 'warn' : 'ok'; badge = 'Final recommendation'; verb = recVerb(rec, c); sub = st.k === 'returned' ? 'Sent back by ' + byName(st.by) + ': \u201C' + (d.note || '') + '\u201D' : terms; why = items.map(liOf).concat([{ cls: 'ok', t: plural(passN, 'other rule') + ' met' }]); const oc = openChecks(c).length; if (oc) why.push({ cls: 'dv', t: plural(oc, 'check') + ' for you below' }); auth = RANK[rec.lvl] <= 1 ? 'Within your authority' : 'Needs ' + rec.lvl + ', ' + AUTH[rec.lvl].title + (E.f.loan > POL.auth.L1 ? ': ' + lakh(E.f.loan) + ' is above your ' + lakh(POL.auth.L1) + ' limit' : ''); break; }
    case 'pending': tone = 'warn'; badge = 'Referred'; verb = 'With ' + st.lvl; sub = 'Sent to ' + AUTH[st.lvl].name + ' on ' + fdt(c.w.req.at) + ' with the credit manager\u2019s recommendation to sanction.'; why = items.map(liOf); break;
    case 'approved': tone = 'ok'; badge = st.by === 'SYS' ? 'Sanctioned by the system' : 'Sanctioned'; bic = st.by === 'SYS' ? 'cpu' : 'user'; verb = 'Sanctioned ' + lakh(c.v.loan); sub = terms + ' ' + (st.by === 'SYS' ? 'Every rule met and no checks raised, so no one needed to sign.' : 'By ' + byName(st.by) + ', ' + fdt(d.at) + '.'); break;
    case 'declined': tone = 'err'; badge = 'Closed'; verb = st.by === 'SYS' ? 'Not eligible' : 'Rejected'; sub = (st.by === 'SYS' ? 'At pre-screen.' : 'By ' + byName(st.by) + ', ' + fdt(d.at) + '.') + ' ' + (c.w.letter ? 'Reasons sent ' + fdt(c.w.letter.sent) + '.' : 'The letter with the reasons is ready to send.'); why = (d.reasons || []).map(k => ({ cls: 'nx', t: REJ[k].en })); break;
  }
  return `<div class="hero one ${tone}"><div><span class="rec-b">${ic(bic)}${esc(badge)}</span><h2 class="hero-verb">${esc(verb)}</h2>${sub ? `<p class="hero-why">${esc(sub)}</p>` : ''}${why.length ? `<ul class="why">${why.map(w => `<li class="${w.cls}">${ic(w.cls === 'ok' ? 'check' : w.cls === 'nx' ? 'x' : w.cls === 'nd' ? 'info' : 'alert')}<span>${esc(w.t)}</span></li>`).join('')}</ul>` : ''}${auth ? `<div class="authl">${ic('user')}${esc(auth)}</div>` : ''}</div></div>`;
}
function evDoc(e) { return `<div class="evd"><div class="evd-h"><i></i><b>${esc(e.title)}</b><small>${esc(e.org || '')}</small></div><div class="evd-b">${e.rows.map(([k, v], i) => `<div class="evr${i === e.hi ? ' hi' : ''}"><span>${esc(k)}</span><b>${esc(v)}</b>${i === e.hi ? `<em>Read by the system: ${esc(e.read)}, ${e.conf}% sure</em>` : ''}</div>`).join('')}</div></div>`; }

function checksHTML() {
  const c = C(), L = visChecks(c), st = E.st;
  if (!L.length) return ['review', 'returned'].includes(st.k) ? `<section class="panel" id="checks"><div class="ph"><h3>Check before you decide</h3></div><div class="pb"><div class="okline">${ic('check')}<div>The system found nothing that needs a person to check.</div></div></div></section>` : '';
  const open = openChecks(c).length, ro = S.role !== 'cm' || !['review', 'returned', 'provisional'].includes(st.k);
  return `<section class="panel" id="checks"><div class="ph"><h3>Check before you decide</h3><span class="note">${open ? open + ' of ' + L.length + ' open' : 'All ' + L.length + ' resolved'}</span></div><div class="pb">${L.map(k => chkRow(c, k, ro)).join('')}</div></section>`;
}
function decHTML() {
  const c = C(), st = E.st;
  if (S.role === 'ap') return st.k === 'pending' ? apReviewHTML(c, st) : '';
  if (S.role !== 'cm' || !['review', 'returned'].includes(st.k)) return '';
  const rec = recOf(c, E), open = openChecks(c).length, within = RANK[rec.lvl] <= 1, sel = S.form.dec || '', dis = open ? ' disabled' : '';
  const b = (k, l, cls, d) => `<button class="btn ${sel === k ? 'btn-p' : cls}" data-act="cmsel" data-v="${k}"${d || ''}>${l}</button>`;
  const ask = b('ask', 'Ask the RM for more', 'btn-s');
  let btns;
  if (rec.k === 'counter') btns = `<button class="btn btn-p" data-act="apply" data-v='${esc(JSON.stringify({ loan: rec.loan }))}'${dis}>Offer ${lakh(rec.loan)}</button>${b('reject', 'Reject', 'btn-s')}${ask}`;
  else if (rec.k === 'decline') btns = `${b('reject', 'Reject with reasons', 'btn-x')}${b('refer', 'Refer to L2 instead', 'btn-s', dis)}${ask}`;
  else if (within) btns = `${b('sanction', 'Sanction', 'btn-ok', dis)}${b('cond', 'Sanction with conditions', 'btn-s', dis)}${b('counter', 'Counter-offer', 'btn-s')}${b('reject', 'Reject', 'btn-s')}${ask}`;
  else btns = `${b('refer', 'Refer to ' + rec.lvl, 'btn-p', dis)}${b('counter', 'Counter-offer', 'btn-s')}${b('reject', 'Reject', 'btn-s')}${ask}`;
  let sub = '';
  if (sel === 'sanction') sub = `<div class="apf-sub"><p style="margin:0 0 10px">Sanction ${lakh(c.v.loan)} over ${yrsTxt(c.v.tenure)} at ${c.v.roi.toFixed(2)}%. The letter and KFS are ready at once.</p><button class="btn btn-ok" data-act="cmgo" data-v="sanction">${ic('check')}Sanction</button></div>`;
  if (sel === 'cond') sub = `<div class="apf-sub"><div class="frm"><label>Extra conditions, one per line<textarea class="ta" id="cmCond" data-autofocus placeholder="For example: closure letter for the car loan before the second disbursement"></textarea></label></div><div class="act-row"><button class="btn btn-ok" data-act="cmgo" data-v="cond">${ic('check')}Sanction with these conditions</button></div></div>`;
  if (sel === 'counter') { const cu = E.ways.find(w => w.k === 'loan'), L0 = cu ? cu.apply.loan : c.v.loan; sub = `<div class="apf-sub"><div class="frm"><div class="frm-row"><label>Loan amount (\u20B9)<input class="inp2" id="apLoan" type="number" step="10000" value="${L0}" data-autofocus></label><label>Tenure (years)<input class="inp2" id="apTen" type="number" step="1" value="${c.v.tenure / 12}"></label></div></div><p id="apPrev" class="calc">${apPrevHTML(c, L0, c.v.tenure)}</p><div class="act-row"><button class="btn btn-p" data-act="cmgo" data-v="counter">Make the counter-offer</button></div></div>`; }
  if (sel === 'refer') {
    const sug = mitsFor(c, E); S.form.mits = S.form.mits || {}; if (!S.form.mits[c.id]) { S.form.mits[c.id] = {}; sug.forEach(k => { S.form.mits[c.id][k] = true; }); }
    const ms = S.form.mits[c.id], lv = RANK[rec.lvl] >= 2 ? rec.lvl : 'L2';
    if (S.form.note == null || S.form.noteFor !== c.id) { S.form.note = draftNote(c, E); S.form.noteFor = c.id; }
    sub = `<div class="apf-sub"><div class="dev-grid" style="padding:0;border:0"><div><div class="ins-k">Mitigants</div>${Object.keys(MITS).filter(k => sug.includes(k) || ms[k]).map(k => `<label class="mit"><input type="checkbox" data-act="mit" data-v="${k}"${ms[k] ? ' checked' : ''}><b>${esc(MITS[k].t)}</b><small>${esc(MITS[k].d)}</small></label>`).join('') || '<p class="muted">None found in the data.</p>'}</div><div><div class="ins-k">Note to ${esc(AUTH[lv].name)}</div><textarea class="ta" id="reqNote" aria-label="Note to the approver">${esc(S.form.note)}</textarea></div></div><div class="act-row"><button class="btn btn-p" data-act="cmgo" data-v="refer">${ic('send')}Refer to ${lv}</button></div></div>`;
  }
  if (sel === 'reject') sub = `<div class="apf-sub"><div class="ins-k">Main reasons, as the customer will read them</div>${rejBoxes()}<div class="frm" style="margin-top:10px"><label>Note for the file<textarea class="ta" id="declNote"></textarea></label></div><div class="act-row"><button class="btn btn-x" data-act="cmgo" data-v="reject">Reject</button></div></div>`;
  if (sel === 'ask') sub = `<div class="apf-sub"><div class="frm"><label>What should the RM collect?<textarea class="ta" id="askNote" data-autofocus></textarea></label></div><div class="act-row"><button class="btn btn-s" data-act="cmgo" data-v="ask">${ic('send')}Send to the RM</button></div></div>`;
  return `<section class="panel" id="act"><div class="ph"><h3>Your decision</h3><span class="note">${esc(within ? 'Within your authority' : 'Needs ' + rec.lvl + ', ' + AUTH[rec.lvl].title)}</span></div><div class="pb"><p style="margin:0;color:var(--ink-2)">The system recommends: <b>${esc(lc1(recVerb(rec, c)))}</b>.</p>${open ? `<div class="gate2">${ic('alert')}Resolve ${plural(open, 'open check')} before you sanction or refer.</div>` : ''}${c.w.ask ? `<div class="ask">${ic('send')}<div>Asked the RM, ${fdt(c.w.ask.at)}: ${esc(c.w.ask.note)}</div></div>` : ''}<div class="decb">${btns}</div>${sub}</div></section>`;
}
function nextHTML() {
  const c = C(), st = E.st, can = ['sales', 'cm'].includes(S.role);
  if (st.k === 'declined') return `<section class="panel"><div class="ph"><h3>Letter</h3><button class="lnk act" data-act="tab" data-v="sanction">Open the letter</button></div><div class="pb">${c.w.letter ? `<div class="okline">${ic('check')}<div>Sent ${fdt(c.w.letter.sent)} by ${esc(lc1(c.w.letter.ch))}.</div></div>` : can ? `<button class="btn btn-p btn-sm" data-act="letter">${ic('send')}Send the letter</button>` : '<p class="muted">Not sent yet.</p>'}</div></section>`;
  if (st.k !== 'approved') return '';
  const san = c.w.san, row = (done, t, s, btn) => `<div class="cgi">${ic(done ? 'check' : 'clock')}<div><b>${t}</b><small>${s}</small></div>${btn || (done ? '<span class="when done">Done</span>' : '<span class="when">To do</span>')}</div>`;
  return `<section class="panel"><div class="ph"><h3>Next steps</h3><button class="lnk act" data-act="tab" data-v="sanction">Open the sanction pack</button></div><div class="pb">${row(!!san.sent, 'Send the sanction letter and KFS', san.sent ? 'Sent ' + fdt(san.sent) : 'Email and SMS to the registered contacts', !san.sent && can ? `<button class="btn btn-p btn-sm" data-act="sansend">${ic('send')}Send</button>` : '')}${row(!!san.accepted, 'Customer accepts', san.accepted ? 'OTP, ' + fdt(san.accepted) : 'By OTP while the KFS is valid', accBtn(c, !can))}${row(!!san.handoff, 'Hand off to operations', san.handoff ? fdt(san.handoff) : 'Conditions check and the first disbursement', san.accepted && !san.handoff && can ? `<button class="btn btn-ok btn-sm" data-act="handoff">${ic('handoff')}Hand off</button>` : '')}</div></section>`;
}
function waitHTML() {
  const c = C(), st = E.st; if (!['docs', 'provisional'].includes(st.k)) return '';
  const open = c.tasks.filter(t => t.st !== 'accepted' && t.kind !== 'sys'), miss = loginMissing(c), can = ['sales', 'cm'].includes(S.role), late = open.find(t => tState(t) === 'late');
  let h = '';
  if (miss.length) h += `<div class="ins-k">Documents</div>${miss.map(d => `<div class="cgi">${ic('file')}<div><b>${esc(d.t)}</b><small>Upload link sent to the customer</small></div><span class="when">Due</span></div>`).join('')}${can ? `<div class="act-row"><button class="btn btn-s btn-sm" data-act="loadlogin">${ic('upload')}Upload documents</button></div>` : ''}`;
  if (open.length) h += `<div class="ins-k"${miss.length ? ' style="margin-top:12px"' : ''}>Outside reports</div>${open.map(t => { const lt = tState(t) === 'late'; return `<div class="cgi">${ic('clock')}<div><b>${esc(t.t)}</b><small>${esc(t.vendor)}${t.due ? ', due ' + fds(t.due) : ''}</small></div><span class="when${lt ? ' now' : ''}">${lt ? plural(wdLate(t.due), 'day') + ' late' : t.st === 'todo' ? 'After the documents' : 'Ordered'}</span></div>`; }).join('')}${can && !miss.length && S.role === 'cm' && late && late.st === 'assigned' ? `<div class="act-row"><button class="btn btn-g btn-sm" data-act="tkrem" data-v="${late.id}">${ic('bell')}Remind ${esc(late.vendor.split(',')[0])}</button></div>` : ''}`;
  const chk = can && !miss.length && open.some(t => t.st === 'assigned') ? `<button class="btn btn-s btn-sm act" data-act="chkrep"${S.chk8 === c.id ? ' disabled' : ''}>${S.chk8 === c.id ? '<span class="spin"></span>Checking with the vendors' : ic('reset') + 'Check for reports'}</button>` : '';
  return `<section class="panel"><div class="ph"><h3>Waiting for</h3>${chk}</div><div class="pb">${h}</div></section>`;
}
function activityHTML() {
  const c = C(), L = c.w.log.filter(e => e.w.t === 'sys' || e.w.t === 'ven').concat(aiEvents(c)).sort((a, b) => a.at < b.at ? 1 : a.at > b.at ? -1 : 0).slice(0, 12);
  return `<section class="panel"><div class="ph"><h3>What the system did</h3><button class="lnk act" data-act="tab" data-v="audit">Full trail</button></div><div class="pb"><ul class="al">${L.map(e => `<li class="${e.w.t}">${ic(e.w.t === 'ven' ? 'building' : e.ai === 'doc' ? 'file' : e.ai === 'memo' ? 'memo' : 'cpu')}<span><b>${esc(e.txt)}</b><small>${esc(fds(e.at) + ', ' + ftime(e.at) + ', ' + e.w.n)}</small></span></li>`).join('')}</ul></div></section>`;
}
function overviewHTML() {
  const st = E.st, showM = !['docs'].includes(st.k);
  return `<div class="ov"><div class="ov-m">${recHTML()}${showM ? `<section id="d-mets">${metsHTML()}</section>` : ''}${checksHTML()}${decHTML()}${nextHTML()}</div><aside class="ov-r">${waitHTML()}${activityHTML()}</aside></div>`;
}

/* ---------- case file and documents tabs ---------- */
const CFF = { all: () => true, chk: x => !!x.flag || (x.conf && x.conf < 90), doc: x => x.st === 'doc', ver: x => x.st === 'ver', dec: x => x.st === 'dec', wait: x => x.st === 'wait' };
function cfTab() {
  const c = C(), F = cfData(c), fl = S.cff || 'all', L = F.filter(CFF[fl]), secs = [...new Set(L.map(x => x.sec))];
  return `<div class="bk-h"><div><h2>Case file</h2><p>The application the system builds from documents, data pulls and what was declared. Every field shows where it came from and how sure the system is.</p></div></div>
  <div class="bk"><div class="bk-top">${[['all', 'All'], ['chk', 'To check'], ['doc', 'Read from documents'], ['ver', 'Verified at source'], ['dec', 'Declared'], ['wait', 'Not in yet']].map(([k, l]) => `<button class="flt${fl === k ? ' on' : ''}" data-act="cff" data-v="${k}">${l} ${F.filter(CFF[k]).length}</button>`).join('')}</div>
  <div class="cfr hd"><span>Field</span><span>Value</span><span>Source</span><span>Sure</span></div>
  ${secs.map(s => `<div class="cf-sec">${esc(s)}</div>${L.filter(x => x.sec === s).map(x => `<div class="cfr${x.fresh ? ' fresh' : ''}${x.st === 'wait' ? ' wait' : ''}"><span>${esc(x.l)}</span><b>${x.st === 'wait' ? 'Not in yet' : esc(x.v)}${x.flag ? ' <span class="src edited">Check</span>' : ''}</b><span class="srcl">${x.st === 'ver' ? chip('ver') : x.st === 'doc' ? chip('doc') : x.st === 'dec' ? chip('dec') : ''}${esc(x.src)}</span><span>${x.conf ? `<span class="conf${x.conf < 90 ? ' lo' : ''}"><i><u style="width:${x.conf}%"></u></i>${x.conf}%</span>` : x.st === 'ver' ? '<span class="conf"><i><u style="width:100%"></u></i>Exact</span>' : ''}</span></div>`).join('')}`).join('') || '<div class="bk-empty">Nothing here.</div>'}</div>`;
}
function docsTab() {
  const c = C(), k = E.st.k, can = ['sales', 'cm'].includes(S.role), hasPre = c.docs.some(d => d.need === 'pre');
  const G = hasPre ? [['pre', 'For the pre-screen'], ['login', 'After login'], ['opt', 'Optional'], ['cp', 'Before disbursement']] : [['login', 'Documents'], ['opt', 'Optional'], ['cp', 'Before disbursement']];
  const roOf = d => !can || (d.need === 'pre' && k !== 'lead') || (d.need === 'login' && k !== 'docs') || d.need === 'cp';
  const roTxt = d => d.need === 'login' && ['lead', 'prescreen'].includes(k) ? 'After login' : 'Not in yet';
  return `<div class="bk-h"><div><h2>Documents</h2><p>Each upload is read at once. The count shows how many case-file fields it filled.</p></div></div>${G.map(([g, l]) => { const D = c.docs.filter(d => d.need === g); if (!D.length) return ''; const cats = [...new Set(D.map(d => d.cat))]; return `<div class="sect-h"><h3>${l}</h3><span class="note">${D.filter(d => d.up).length} of ${D.length} in</span></div><div class="cats">${cats.map(cat => { const it = D.filter(d => d.cat === cat); return `<section class="dcat"><header><b>${cat}</b><span>${it.filter(d => d.up).length} of ${it.length}</span></header>${it.map(d => docRow2(c, d, roOf(d), roTxt(d))).join('')}</section>`; }).join('')}</div>`; }).join('')}`;
}
function mlHTML() {
  const ml = E.ml; if (!ml) return '';
  const pm = POL.model, inS = E.devs.filter(r => r.ml), outS = E.devs.filter(r => !r.ml).concat(E.refs, E.hard), AX = 12, at = x => clamp(x / AX * 100, 0, 100);
  const rec = !inS.length ? null : ml.p <= pm.approve ? ['ok', 'check', 'Recommends approval'] : ml.p >= pm.reject ? ['err', 'x', 'Recommends rejection'] : ['warn', 'user', 'Leaves it to judgement: between ' + pm.approve + '% and ' + pm.reject + '%'];
  return `<section class="ins" id="ml"><div class="ph"><h3>Deviation model</h3><span class="note">${MODEL.id} ${pm.ver}. ${pm.on ? 'Scores every deviation and recommends. The credit manager decides.' : 'Switched off.'}</span></div><div class="ins-b">
  <div><div class="ins-k">Predicted risk</div><div class="mlb"><b>${pct(ml.p)}</b><span>chance of a payment 30+ days late in the first 12 months. A typical deviation case is ${pct(ml.pt)}.</span></div>
  <div class="mlw"><div class="mlr"><span class="a" style="width:${at(pm.approve)}%"></span><span class="m" style="width:${at(pm.reject) - at(pm.approve)}%"></span><span class="x" style="flex:1"></span></div><u style="left:calc(${at(ml.p)}% - 1.5px)"></u></div>
  <div class="mll"><span style="width:${at(pm.approve)}%">Approve</span><span style="width:${at(pm.reject) - at(pm.approve)}%">Judgement</span><span style="flex:1;text-align:right">Reject</span></div>
  ${rec ? `<span class="mlrec ${rec[0]}">${ic(rec[1])}${esc(rec[2])}</span>` : ''}</div>
  <div><div class="ins-k">What moved the figure</div><div class="drvs">${ml.up.map(x => `<span class="drv dn" title="Multiplies the odds by ${x.mult.toFixed(2)}"><i>+</i>${esc(x.l)}: ${esc(x.s)}</span>`).join('')}${ml.dn.map(x => `<span class="drv up" title="Multiplies the odds by ${x.mult.toFixed(2)}"><i>${MINUS}</i>${esc(x.l)}: ${esc(x.s)}</span>`).join('')}</div></div>
  <div><div class="ins-k">Scope on this case</div><div class="scope">${inS.map(r => `<div class="in">${ic('check')}<span>${esc(r.name)}: scored by the model</span></div>`).join('')}${outS.map(r => `<div class="out">${ic('x')}<span>${esc(r.name)}: outside its scope</span></div>`).join('')}</div>
  <p class="foot">The model reads the case\u2019s figures, never names, gender or religion. It recommends; a person decides, and every decision is logged.</p></div></div></section>`;
}
function sheetHTML() {
  const k = S.sheet.k, c = S.view === 'case' ? C() : null;
  const wrap = (t, s, body, foot) => `<div class="scrim" data-act="shclose"></div><aside class="as open" role="dialog" aria-modal="true" aria-label="${esc(t)}"><div class="as-h"><div><b>${esc(t)}</b><small>${esc(s)}</small></div><button class="nic" data-act="shclose" aria-label="Close">${ic('x')}</button></div><div class="as-b">${body}</div><div class="as-f">${foot}</div></aside>`;
  const f = (l, v) => `<label>${l}<input class="inp2" value="${esc(v)}"></label>`;
  if (k === 'lead') return wrap('New lead', 'Sample details for the demo', `<div class="frm"><div class="frm-row">${f('Applicant', 'Sameer Joshi')}${f('Co-applicant', 'Pooja Joshi')}</div><div class="frm-row">${f('Mobile', '98XXXXX612')}${f('City', 'Pune')}</div><div class="frm-row">${f('Loan asked for (\u20B9)', '55,00,000')}${f('Tenure (years)', '20')}</div><div class="frm-row">${f('Property price, as stated (\u20B9)', '78,00,000')}${f('Property', 'Resale flat, Kothrud')}</div><p class="hint">Creating the lead sends the customer a link to share documents. You can also upload them yourself.</p></div>`, `<button class="btn btn-s" data-act="shclose">Cancel</button><button class="btn btn-p" data-act="mklead">Create the lead</button>`);
  if (k === 'query') { const t = task(c, S.sheet.id); return wrap('Raise a query', t.t + ', ' + t.vendor, `<div class="frm"><label>Query<textarea class="ta" id="qT" data-autofocus placeholder="For example: confirm the gift deed covers the whole plot"></textarea></label><p class="hint">The report stays on hold until the vendor answers.</p></div>`, `<button class="btn btn-s" data-act="shclose">Cancel</button><button class="btn btn-p" data-act="qsend">Send the query</button>`); }
  if (k === 'reas') { const t = task(c, S.sheet.id), alt = (t.id === 'legal' ? ['Adv. R. K. Malhotra', 'Adv. Simran Gill', 'Bajwa & Co., Advocates'] : ['Northern Valuation Services', 'Crest Valuers', 'Apex Valuers']).filter(x => x !== t.vendor); return wrap('Reassign', t.t + ', now with ' + t.vendor, `<div class="frm"><label>Empanelled vendor<select class="sel" id="reasV">${alt.map(x => `<option>${esc(x)}</option>`).join('')}</select></label><p class="hint">The new vendor gets ${t.slaD} working days.</p></div>`, `<button class="btn btn-s" data-act="shclose">Cancel</button><button class="btn btn-p" data-act="reasgo">Reassign</button>`); }
  if (k === 'pull') return wrap('Pull back for review', 'The case comes back to you for a decision', `<div class="frm"><label>Reason<select class="sel" id="ovrR">${OVR_REASONS.map(r => `<option>${esc(r)}</option>`).join('')}</select></label><label>What does the system not know?<textarea class="ta" id="ovrN" data-autofocus placeholder="For example: the employer has announced job cuts in the applicant's team"></textarea></label><p class="hint">The system's sanction and its reasons stay on record. You then sanction, refer or reject as usual.</p></div>`, `<button class="btn btn-s" data-act="shclose">Cancel</button><button class="btn btn-p" data-act="pullgo">Pull back</button>`);
  return '';
}

/* =====================================================================
   AI-native actions and start-up
   ===================================================================== */
S = { view: 'board', i: 0, tab: 'overview', role: 'sales', lvl: 'L2', auto: true, theme: 'auto', open: {}, form: {}, sheet: null, edit: null, reading: null, rf: 'fail', rq: '', lang: null, dtab: 'letter', af: 'all', ptab: 'foir', lw: 46, pdraft: null, psim: null, ppend: null, pmsg: null, cff: 'all', otp: null, pre: null, fresh: [] };
const filled = c => new Set(cfData(c).filter(x => x.st !== 'wait').map(x => x.key));
const markFresh = (c, before) => { S.fresh = cfData(c).filter(x => x.st !== 'wait' && !before.has(x.key)).map(x => x.key); setTimeout(() => { S.fresh = []; }, 1800); return S.fresh.length; };
function runPre(c) {
  if (S.pre) return; S.pre = { id: c.id, step: 0 }; render();
  const nx = () => { S.pre.step++; if (S.pre.step < 4) { render(); setTimeout(nx, 600); } else { const b = filled(c); finishPre(c); S.pre = null; markFresh(c, b); render(); const r = c.lead.pre.res; toast(r === 'yes' ? 'Pre-screen: eligible up to ' + lakh(c.lead.pre.max) : r === 'change' ? 'Pre-screen: eligible with changes' : 'Pre-screen: not eligible'); } };
  setTimeout(nx, 600);
}
function finishPre(c) {
  ['kyc', 'bureau', 'aa'].forEach(id => { const t = task(c, id); if (t && t.st !== 'accepted') { t.st = 'accepted'; t.recv = t.acc = tick(1); log(c, who('sys', 'System', t.vendor), 'data', sysTaskText(c, t), sysTaskDet(c, t)); } });
  const p = prescreenOf(c); c.lead.pre = { at: tick(1), res: p.res, max: p.max };
}
function afterDocs(c) {
  if (c.lead && !c.lead.in) { const held = d => d.need === 'pre' && !d.up && !(d.later && !BLOCK_PRESCREEN_ON_PENDING_IDENTITY); if (c.lead.consent && !c.lead.pre && c.docs.some(d => d.need === 'pre' && d.up) && !c.docs.some(held)) runPre(c); return; }
  if (!loginMissing(c).length && c.tasks.some(t => t.st === 'todo')) {
    let n = 0;
    c.tasks.forEach(t => { if (t.st !== 'todo') return; if (t.kind === 'sys') { t.st = 'accepted'; t.recv = t.acc = tick(1); log(c, who('sys', 'System', t.vendor), 'data', sysTaskText(c, t), sysTaskDet(c, t)); } else { t.st = 'assigned'; t.assigned = tick(1); t.due = addWD(t.assigned, t.slaD); n++; log(c, who('sys', 'System', 'Vendor orders'), 'vendor', t.t + ' ordered from ' + t.vendor, 'Due ' + fdt(t.due) + '.'); } });
    toast('All documents in. The system ordered ' + plural(n, 'check') + ' from the panel vendors');
  }
}
function readReport(c, t) {
  if (!t.assigned) { t.assigned = tick(1); t.due = addWD(t.assigned, t.slaD); }
  t.st = 'accepted'; t.recv = tick(3); t.acc = addMin(t.recv, 1); CLK = P(t.acc);
  const parts = t.vendor.split(', ');
  log(c, t.kind === 'ven' ? who('ven', t.vendor, 'Empanelled vendor') : who('ppl', parts[0], parts[1] ? cap1(parts[1]) : 'Internal team'), 'vendor', t.t + ': report received', taskOutcome(c, t));
  log(c, who('sys', 'Report reader', 'Reads vendor reports'), 'data', 'Read the ' + lc1(t.t) + ' report', taskOutcome(c, t));
}
function afterReports(c, before) {
  const auto = settle(c); markFresh(c, before); render();
  const oc = openChecks(c).length, ev = fullEval(c);
  toast(auto ? 'Reports read. Every rule met, so the system sanctioned it' : ev.needs.length ? 'Report read. Still waiting for ' + plural(ev.needs.length, 'item') : 'Reports read. The final recommendation is ready' + (oc ? ', with ' + plural(oc, 'check') + ' for the credit manager' : ''));
}
const apply0 = ACT.apply;
Object.assign(ACT, {
  go(v) { S.view = v === 'policy' ? 'policy' : 'board'; S.sheet = null; S.edit = null; render(); },
  open(v) { S.i = +v; S.view = 'case'; S.tab = 'overview'; S.form = {}; S.edit = null; S.lang = null; S.dtab = 'letter'; S.rf = 'fail'; S.rq = ''; S.af = 'all'; S.cff = 'all'; S.open = {}; render(); },
  role(v) { S.role = v; S.form = {}; S.edit = null; if (v === 'pol') S.view = 'policy'; else if (S.view === 'policy') S.view = 'board'; render(); },
  resetall() { docxResetAll(); initCases(); POL = deep(POL12); VERS = deep(VERS0); LENDER = deep(LENDER0); S.pdraft = S.psim = S.ppend = S.pmsg = null; S.form = {}; S.open = {}; S.otp = S.pre = null; S.view = S.role === 'pol' ? 'policy' : 'board'; render(); toast('The demo is back at its starting point'); },
  resetcase() { docxResetCase(CASES[S.i].id); const c = mk(SEED2[S.i]); if (c.lead && c.lead.hidden) c.lead.hidden = false; CASES[S.i] = c; S.form = {}; S.open = {}; S.otp = S.pre = null; S.tab = 'overview'; render(); toast('This case is back at its starting point'); },
  newlead() { const i = CASES.findIndex(x => x.id === 'N1'); if (CASES[i].lead.hidden) { S.sheet = { k: 'lead' }; render(); } else { ACT.open(i); toast('This demo has one sample lead to create. Reset the demo to run it again'); } },
  mklead() { const i = CASES.findIndex(x => x.id === 'N1'), c = CASES[i]; c.lead.hidden = false; c.lead.created = c.v.login = tick(1); c.w.log.forEach(e => { if (e.txt === 'Lead created') { e.at = c.lead.created; e.w = who('ppl', SALES.name, SALES.sub); } }); S.sheet = null; ACT.open(i); toast('Lead created. Upload the documents, or wait for the customer\u2019s link'); },
  up2(v) {
    const c = C(), d = c.docs.find(x => x.id === v); if (!d || d.up || S.reading) return;
    S.reading = c.id + ':' + v; render();
    setTimeout(() => { const b = filled(c); d.up = { f: d.sample, at: tick(1), by: meWho().name }; S.reading = null; log(c, meW(), 'doc', 'Uploaded ' + lc1(d.t), d.sample); const n = markFresh(c, b); render(); toast('Read ' + lc1(d.t) + ': ' + plural(n, 'field') + ' filled'); afterDocs(c); }, 850);
  },
  loadpre() { const c = C(), b = filled(c), m = c.docs.filter(d => d.need === 'pre' && !d.up); m.forEach(d => { d.up = { f: d.sample, at: tick(1), by: meWho().name }; }); if (m.length) log(c, meW(), 'doc', 'Uploaded ' + plural(m.length, 'document'), listAnd(m.map(d => lc1(d.t))) + '.'); const n = markFresh(c, b); render(); toast(plural(m.length, 'document') + ' read, ' + plural(n, 'field') + ' filled'); afterDocs(c); },
  consent() { const c = C(); S.otp = c.id; log(c, meW(), 'comms', 'Consent request sent by SMS', 'Privacy notice version 3.2, with an OTP. It also asks about updates on WhatsApp.'); render(); },
  otp() { const c = C(); c.lead.consent = { at: tick(2), ch: 'OTP', wa: 1 }; S.otp = null; log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Consent given by OTP', 'Credit report and bank data. Opted in to updates on WhatsApp. Privacy notice version 3.2.'); render(); toast('Consent recorded'); afterDocs(c); },
  login(v) {
    const c = C(); if (!c.lead || c.lead.in) return;
    const amt = v ? +v : 0, n = 5131 + CASES.filter(x => x.lead && x.lead.in && x.id[0] === 'N').length;
    if (amt && amt !== c.v.loan) { log(c, meW(), 'decision', 'Amount changed at login', lakh(c.v.loan) + ' to ' + lakh(amt) + ', as the pre-screen suggested.'); c.v.loan = amt; }
    c.lead.in = true; c.v.appNo = 'HL-2611-0' + n; c.v.login = tick(2);
    log(c, meW(), 'doc', 'File logged in: ' + c.v.appNo, 'The customer gets a link to upload the remaining documents.');
    render(); toast('Logged in as ' + c.v.appNo + '. ' + plural(loginMissing(c).length, 'document') + ' still to come');
  },
  hold() { const c = C(); log(c, meW(), 'decision', 'Lead on hold', 'The customer will look for an earning co-applicant.'); render(); toast('On hold until the customer adds an earning co-applicant'); },
  closelead() { const c = C(), rs = preReasons(prescreenOf(c)); c.w.dec = { k: 'declined', by: 'SYS', at: tick(2), reasons: rs, note: 'Not eligible at pre-screen.' }; c.w.letter = { sent: tick(1), ch: 'Email and SMS' }; log(c, meW(), 'decision', 'Lead closed: not eligible', 'The main reasons went to the customer in writing.', { reasons: rs }); S.tab = 'sanction'; render(); toast('Closed. The reasons went to the customer in writing'); },
  loadlogin() { const c = C(), b = filled(c), m = loginMissing(c); m.forEach(d => { d.up = { f: d.sample, at: tick(1), by: meWho().name }; }); if (m.length) log(c, meW(), 'doc', 'Uploaded ' + plural(m.length, 'document'), listAnd(m.map(d => lc1(d.t))) + '.'); markFresh(c, b); render(); toast(plural(m.length, 'document') + ' read'); afterDocs(c); render(); },
  arrive() { const c = C(), b = filled(c), T = c.tasks.filter(t => t.st !== 'accepted' && t.kind !== 'sys'); if (!T.length) return; T.forEach(t => readReport(c, t)); afterReports(c, b); },
  tkrecv(v) { const c = C(), t = task(c, v); if (!t) return; const b = filled(c); readReport(c, t); afterReports(c, b); },
  apply(v) { C().w.touched = true; apply0(v); },
  chkx(v) { const c = C(), k = (CHECKS[c.id] || []).find(x => x.id === v), s = chkSt(c, k), def = s.st === 'open' && openChecks(c)[0] === k, cur = S.open['chk:' + v] != null ? S.open['chk:' + v] : def; S.open['chk:' + v] = !cur; render(); },
  chkdo(v) {
    const [id, act] = v.split('|'), c = C(), k = (CHECKS[c.id] || []).find(x => x.id === id); if (!k) return;
    c.w.chk = c.w.chk || {};
    if (act === 'correct' || act === 'waive') { S.form.chk = { id, mode: act }; render(); return; }
    if (act === 'cancel') { S.form.chk = null; render(); return; }
    const val = ($('#chkIn') || {}).value || '';
    if ((act === 'corrected' || act === 'waived') && !val.trim()) { toast(act === 'waived' ? 'Give a reason' : 'Enter the correct value'); return; }
    const at = tick(2), by = AUTH.L1.name;
    if (act === 'asked') { c.w.chk[id] = { st: 'asked', at, by }; log(c, L1W(), 'comms', 'Asked the customer', cap1(k.ask) + '. Sent by SMS with an upload link.'); }
    else if (act === 'reply') { c.w.chk[id] = { st: 'confirmed', at, by: 'the system', note: 'the customer sent ' + lc1(k.ask) + ', and it matches' }; log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Sent ' + lc1(k.ask), 'Read by the system: it matches.'); }
    else { c.w.chk[id] = { st: act, at, by, note: val }; log(c, L1W(), 'decision', { confirmed: 'Check confirmed', corrected: 'Check corrected', waived: 'Check waived' }[act] + ': ' + lc1(k.t), val ? (act === 'waived' ? '' : 'Corrected to: ') + val : k.sug, act === 'waived' ? { rsn: val } : null); }
    S.form.chk = null; S.open['chk:' + id] = false;
    const left = openChecks(c).length; render(); toast(left ? plural(left, 'check') + ' left' : 'All checks resolved. You can decide now');
  },
  cmsel(v) { S.form.dec = S.form.dec === v ? null : v; render(); },
  cmgo(v) {
    const c = C(), rec = recOf(c, E), W = L1W();
    if (v === 'sanction' || v === 'cond') {
      if (openChecks(c).length) { toast('Resolve the open checks first'); return; }
      if (RANK[rec.lvl] > 1) { toast('This needs ' + rec.lvl + '. Refer it'); return; }
      const conds = v === 'cond' ? (($('#cmCond') || {}).value || '').split('\n').map(s => s.trim()).filter(Boolean) : [];
      if (v === 'cond' && !conds.length) { toast('Add at least one condition'); return; }
      c.w.dec = { k: 'approved', by: 'L1', at: tick(2), conds };
      log(c, W, 'decision', conds.length ? 'Sanctioned with conditions' : 'Sanctioned', conds.join('. ') || 'Within the credit manager\u2019s authority, on the system\u2019s recommendation.');
      S.form = {}; render(); toast('Sanctioned. The letter and KFS are ready to send'); return;
    }
    if (v === 'counter') {
      const L = Math.round((+($('#apLoan') || {}).value || 0) / 1000) * 1000, T = Math.round(+($('#apTen') || {}).value || 0) * 12;
      if (!L || !T) { toast('Enter an amount and a tenure'); return; }
      const ev2 = evalFacts(Object.assign({}, E.f, { loan: L, tenure: T }), POL);
      if (ev2.hard.length) { toast('Still breaks ' + lc1(ev2.hard[0].name) + '. Change the terms'); return; }
      const from = lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure); c.v.loan = L; c.v.tenure = T; c.w.touched = true; c.w.edited = Object.assign(c.w.edited || {}, { loan: true, tenure: true });
      log(c, W, 'decision', 'Counter-offer made', from + ' changed to ' + lakh(L) + ' over ' + yrsTxt(T) + '.');
      S.form = {}; render(); toast('Counter-offer made. Decide on the new terms'); return;
    }
    if (v === 'refer') {
      if (openChecks(c).length) { toast('Resolve the open checks first'); return; }
      const lv = RANK[rec.lvl] >= 2 ? rec.lvl : 'L2', note = ($('#reqNote') || {}).value || S.form.note || '', sel = (S.form.mits || {})[c.id] || {}, mits = Object.keys(sel).filter(k => sel[k]);
      c.w.req = { k: 'pending', lvl: lv, at: tick(2), by: 'L1', note, mits, items: E.devs.concat(E.refs).map(r => r.name + ': ' + r.v) };
      if (c.w.dec && c.w.dec.k === 'returned') c.w.dec = null;
      log(c, W, 'decision', 'Referred to ' + lv + ' with a recommendation to sanction', note);
      S.form = {}; render(); toast('Referred to ' + AUTH[lv].name + ', ' + lv); return;
    }
    if (v === 'reject') {
      const box = $('#act'), rs = box ? [...box.querySelectorAll('input[data-r]:checked')].map(x => x.dataset.r) : [];
      if (!rs.length) { toast('Choose at least one reason'); return; }
      const note = ($('#declNote') || {}).value || '';
      c.w.dec = { k: 'declined', by: 'L1', at: tick(2), reasons: rs, note }; c.w.req = null;
      log(c, W, 'decision', 'Application rejected', note, { reasons: rs });
      S.form = {}; S.tab = 'sanction'; render(); toast('Rejected. The letter with the reasons is ready to send'); return;
    }
    if (v === 'ask') { const n = ($('#askNote') || {}).value || ''; if (!n.trim()) { toast('Say what is needed'); return; } c.w.ask = { at: tick(2), note: n }; log(c, W, 'comms', 'Asked the RM for more', n); S.form = {}; render(); toast('Sent to the RM'); }
  },
  cff(v) { S.cff = v; render(); }
});
/* start-up runs at the end of the v3 layer */

/* =====================================================================
   Richer views (v3): pipeline table, review workspace with what-if,
   approval ladder, property snapshot, turnaround, conditions, and a
   pull-back override for automatic sanctions
   ===================================================================== */
const STG6 = ['Lead', 'Pre-screen', 'Login', 'Underwriting', 'Decision', 'Sanction'];
const TGT = { prime: 7, affordable: 10 };
function stIdx(c, st) { return { lead: 0, prescreen: 1, docs: 2, provisional: 3, review: 4, returned: 4, pending: 4, approved: 5, declined: c.lead && !c.lead.in ? 1 : 4 }[st.k]; }
function bk2(c, st) { return { lead: 'lead', prescreen: 'prescreen', docs: 'login', provisional: 'uw', review: 'dec', returned: 'dec', pending: 'dec', approved: 'san', declined: 'closed' }[st.k]; }
function tatOf(c, ev) {
  const st = ev.st, L = c.lead, pre = !!(L && !L.in), start = pre ? L.created : c.v.login;
  const closed = ['approved', 'declined'].includes(st.k), end = closed && c.w.dec ? c.w.dec.at : S8(CLK);
  const n = Math.max(1, wdLate(start, end) + 1), tgt = pre ? 1 : TGT[c.seg] || 7;
  return { n, tgt, pre, closed, over: !pre && n > tgt, late: !pre && !closed && n > tgt };
}
function dpdStrip(s) {
  if (!s) return '<span class="muted">No credit history</span>';
  const M = { '0': ['d0', '', 'on time'], '1': ['d1', '1', '1 to 29 days late'], '3': ['d30', '30', '30 to 59 days late'], '6': ['d30', '60', '60 to 89 days late'], '9': ['d90', '90', '90 or more days late'], '-': ['dna', '', 'no data'] };
  return `<div class="dpd" aria-label="24 months of payments">${s.split('').map((ch, i) => { const m = M[ch] || M['-']; return `<i class="${m[0]}" title="${24 - i} months ago: ${m[2]}">${m[1]}</i>`; }).join('')}</div>`;
}
const DPDLEG = `<div class="legend"><span><i style="background:var(--ok-fill);opacity:.55"></i>On time</span><span><i style="background:var(--warn-fill);opacity:.6"></i>1 to 29 days late</span><span><i style="background:var(--warn-fill)"></i>30 to 89 days late</span><span><i style="background:var(--err-fill)"></i>90+ days late</span></div>`;

/* ---------------- pipeline table ---------------- */
const BT = [['all', 'All'], ['me', 'Needs you'], ['lead', 'Leads'], ['prescreen', 'Pre-screen'], ['login', 'Login'], ['uw', 'Underwriting'], ['dec', 'Decision'], ['san', 'Sanctioned'], ['closed', 'Closed']];
const BORD = { lead: 0, prescreen: 1, login: 2, uw: 3, dec: 4, san: 5, closed: 6 };
function recShort(rec, c) { return { prov: { approve: 'Likely sanction', refer: 'Likely referral', decline: 'Likely decline' }[rec.p], approve: 'Sanction', cond: 'Sanction with conditions', counter: 'Counter-offer ' + lakh(rec.loan), decline: 'Decline' }[rec.k]; }

const tp = (tone, t) => `<span class="tp ${tone}" title="${esc(t)}">${esc(t)}</span>`;
function recCell(c, ev) {
  const st = ev.st, L = c.lead, d = c.w.dec;
  if (st.k === 'lead') return { p: '<span class="muted">After the documents</span>', s: '' };
  if (st.k === 'prescreen') { const r = L.pre.res; return { p: tp({ yes: 'ok', change: 'warn', no: 'err' }[r], { yes: 'Eligible', change: 'Eligible with changes', no: 'Not eligible' }[r]), s: 'Pre-screen, indicative' }; }
  if (st.k === 'docs') return { p: '<span class="muted">After the reports</span>', s: L && L.pre ? { yes: 'Pre-screen: eligible', change: 'Pre-screen: with changes', no: '' }[L.pre.res] : '' };
  if (st.k === 'declined') return { p: tp('err', st.by === 'SYS' ? 'Not eligible' : 'Rejected'), s: st.by === 'SYS' ? 'At pre-screen' : 'By ' + byName(st.by) };
  if (st.k === 'approved') return { p: tp('ok', 'Sanctioned'), s: (st.by === 'SYS' ? 'By the system' : 'By ' + byName(st.by)) + (d && d.counter ? ', as a counter-offer' : d && d.conds && d.conds.length ? ', with conditions' : '') };
  const rec = recOf(c, ev), tone = rec.k === 'prov' ? 'info' : rec.k === 'decline' ? 'err' : rec.k === 'counter' ? 'warn' : 'ok';
  return { p: tp(tone, recShort(rec, c)), s: st.k === 'pending' ? 'Referred to ' + st.lvl : rec.k === 'prov' ? 'Provisional' : RANK[rec.lvl] >= 2 ? 'Needs ' + rec.lvl : 'Credit manager can decide' };
}
const VARS = { uc: 'Under construction', resale: 'Resale', selfcon: 'Self-build', plotcon: 'Plot and build', bt: 'Balance transfer', ready: 'Ready flat' };

function stripHTML(c, st) {
  const k = stIdx(c, st), dec = st.k === 'declined', fin = st.k === 'approved' && c.w.san.handoff;
  return `<span class="mst" aria-hidden="true">${STG6.map((t, i) => `<i class="${i < k ? 'd' : i === k ? (dec ? 'x' : fin ? 'd' : 'c') : ''}" title="${t}"></i>`).join('')}</span>`;
}
function plRow(r) {
  const c = r.c, ev = r.ev, st = ev.st, w = waitOn(c, ev), rc = recCell(c, ev), h = holder(c, ev), t = r.t;
  const no = (c.lead && !c.lead.in ? 'Lead ' : '') + c.v.appNo, stage = st.k === 'declined' ? 'Closed' : st.k === 'approved' ? (c.w.san.handoff ? 'Handed off' : 'Sanctioned') : STG6[stIdx(c, st)];
  const tt = st.k === 'approved' ? ['Day ' + t.n, 'Login to sanction'] : st.k === 'declined' ? ['Closed', 'On day ' + t.n] : t.pre ? ['Day ' + t.n, 'Since the lead'] : ['Day ' + t.n, 'Target ' + t.tgt + ' days'];
  return `<button class="pl-row${r.me ? ' mine' : ''}" data-act="open" data-v="${r.i}">
  <span class="pl-a"><b title="${esc(caseName(c))}">${esc(caseName(c))}</b><small title="${esc(no + ', ' + c.v.branch)}">${esc(no)}, ${esc(c.v.branch)}</small></span>
  <span class="pl-l"><b>${esc(lakh(c.v.loan))}</b><small title="${esc(VAR[c.variant] + ', ' + c.seg)}">${esc(VARS[c.variant])}, ${c.seg}</small></span>
  <span class="pl-s"><b>${esc(stage)}</b>${stripHTML(c, st)}</span>
  <span class="pl-w${w.late ? ' late' : ''}"><b title="${esc(w.t)}">${esc(w.t)}</b><small title="${esc(w.s)}">${esc(w.s)}</small></span>
  <span class="pl-r">${rc.p}${rc.s ? `<small title="${esc(rc.s)}">${esc(rc.s)}</small>` : ''}</span>
  <span class="pl-h"><span class="mini-av">${esc(inits(h.n) || '·')}</span><span><b title="${esc(h.n)}">${esc(h.n)}</b><small title="${esc(h.r)}">${esc(h.r)}</small></span></span>
  <span class="pl-t${t.late ? ' late' : ''}"><b>${tt[0]}</b><small>${tt[1]}</small></span></button>`;
}
function boardHTML2() {
  const rows = CASES.map((c, i) => ({ c, i, ev: fullEval(c) })).filter(r => !(r.c.lead && r.c.lead.hidden));
  rows.forEach(r => { r.me = needsMe2(r.c, r.ev); r.b = bk2(r.c, r.ev.st); r.t = tatOf(r.c, r.ev); });
  const f = BT.some(x => x[0] === S.bf) ? S.bf : 'all', q = (S.bq || '').trim().toLowerCase();
  let list = rows.filter(r => f === 'all' ? true : f === 'me' ? r.me : r.b === f);
  if (q) list = list.filter(r => [caseName(r.c), r.c.v.appNo, r.c.v.branch, r.c.lead ? r.c.lead.by : ''].join(' ').toLowerCase().includes(q));
  list.sort((a, b) => (b.me - a.me) || (BORD[a.b] - BORD[b.b]) || (b.t.late - a.t.late));
  const logged = rows.filter(r => !(r.c.lead && !r.c.lead.in)), open = rows.filter(r => !['approved', 'declined'].includes(r.ev.st.k)), past = open.filter(r => r.t.late).length;
  const repOut = rows.filter(r => r.c.tasks.some(t => t.st === 'assigned' || t.st === 'query')).length, repLate = rows.filter(r => r.c.tasks.some(t => tState(t) === 'late')).length;
  const chkN = sum(logged, r => ['approved', 'declined'].includes(r.ev.st.k) ? 0 : openChecks(r.c).length), chkF = logged.filter(r => !['approved', 'declined'].includes(r.ev.st.k) && openChecks(r.c).length).length;
  const sanc = rows.filter(r => r.ev.st.k === 'approved'), sys = sanc.filter(r => r.ev.st.by === 'SYS').length;
  const days = sanc.filter(r => r.c.w.dec).map(r => wdLate(r.c.v.login, r.c.w.dec.at) + 1).sort((a, b) => a - b);
  const med = days.length ? (days.length % 2 ? days[(days.length - 1) / 2] : (days[days.length / 2 - 1] + days[days.length / 2]) / 2) : null;
  const meN = rows.filter(r => r.me).length, cnt = k => k === 'all' ? rows.length : k === 'me' ? meN : rows.filter(r => r.b === k).length;
  const met = (l, v, s) => `<div class="met"><div class="met-l">${l}</div><div class="met-v">${v}</div><div class="met-s">${s}</div></div>`;
  const title = S.role === 'ap' ? 'Approvals for ' + AUTH[S.lvl].name : 'CRM';
  const sub = S.role === 'sales' ? 'Every file you sourced, from the first documents to sanction. The system reads, checks and builds each file as you go.' : S.role === 'cm' ? 'Files the system has worked. Rows marked for you need a check, a chase or a decision.' : S.role === 'ap' ? 'Files referred to you, with the credit manager’s recommendation.' : 'Read only for credit policy. Policy changes are made in the policy studio.';
  const meSub = { sales: 'Leads, logins and letters', cm: 'Decisions, checks and late reports', ap: 'Referred at or below ' + S.lvl, pol: 'Nothing to act on here' }[S.role];
  return `<div class="bk-h"><div><h2>${esc(title)}</h2><p>${esc(sub)}</p></div><div class="act">${['sales', 'cm'].includes(S.role) ? `<button class="btn btn-p btn-sm" data-act="newlead">${ic('plus')}New lead</button>` : ''}</div></div>
  <div class="kpis k6">${met('Needs you', meN, meSub)}${met('Open files', open.length, past ? plural(past, 'file') + ' past the target' : 'All within target')}${met('Waiting on outside reports', repOut, repLate ? plural(repLate, 'report') + ' late' : 'None late')}${met('Open checks', chkN, chkN ? 'On ' + plural(chkF, 'file') : 'Nothing to check')}${met('Sanctioned', sanc.length, sys + ' by the system on its own')}${met('Login to sanction', med != null ? trimz(med.toFixed(1)) + ' <small class="of">days</small>' : DASH, 'Median, working days')}</div>
  <div class="bk pl"><div class="pl-top"><nav class="tabs2" aria-label="Filter by stage">${BT.map(([k, l]) => { const n = cnt(k); return `<button class="tab2${f === k ? ' on' : ''}" data-act="bf" data-v="${k}"${f === k ? ' aria-current="true"' : ''}>${l}<span class="cnt${k === 'me' && n ? ' w' : ''}">${n}</span></button>`; }).join('')}</nav><input class="srch" id="bq" type="search" placeholder="Search name, number, branch or DSA" value="${esc(S.bq || '')}" aria-label="Search files"></div>
  <div class="pl-row hd" role="presentation"><span>Applicant</span><span>Loan</span><span>Stage</span><span>Waiting on</span><span>Recommendation</span><span>With</span><span>Turnaround</span></div>
  ${list.length ? list.map(plRow).join('') : `<div class="bk-empty">No files here. <button class="lnk" data-act="bf" data-v="all">Show all files</button></div>`}</div>`;
}

/* ---------------- case header and tab router ---------------- */
function cbHTML() {
  const c = C(), v = c.v, L = c.lead, steps = stepsOf(c), t = tatOf(c, E);
  const tx = t.pre ? '' : `<span class="tatx${t.late ? ' late' : ''}" title="Working days from login to decision, against the ${t.tgt}-day target for ${c.seg} loans">${ic('clock')}${t.closed ? 'Decided on day ' + t.n : 'Day ' + t.n + ' of ' + t.tgt}</span>`;
  return `<button class="back" data-act="go" data-v="board" title="Back to the CRM" aria-label="Back to the CRM">${ic('back')}</button>
  <div class="cb-id"><h1>${esc(caseName(c))}</h1><p>${esc((L && !L.in ? 'Lead ' : '') + v.appNo)}, ${esc(v.branch)}, ${esc(lc1(VAR[c.variant]))}. ${esc(lakh(v.loan))} over ${yrsTxt(v.tenure)}${tx}</p></div>
  <ol class="stepper" aria-label="Stages">${steps.map((s, i) => `${i ? '<li class="sep" aria-hidden="true"></li>' : ''}<li class="${s.cls}"><button data-act="tab" data-v="${s.tab}"${s.dis ? ' disabled' : ''}><i>${s.cls === 'done' ? ic('check') : s.cls.indexOf('bad') >= 0 ? ic('x') : i + 1}</i>${s.t}<small>${esc(s.sub)}</small></button></li>`).join('')}</ol>
  ${pill(E.st)}<div class="cb-x"><button class="cbtn" data-act="resetcase" title="Reset this case to its starting point" aria-label="Reset this case">${ic('reset')}</button></div>`;
}


/* ---------------- lead stage: what the pre-screen saw ---------------- */
function preSawHTML(c) {
  const L = c.lead; if (!L || !L.pre || (S.pre && S.pre.id === c.id)) return '';
  const b = c.bank, ob = c.oblig.filter(o => o.count);
  return `<section class="panel" style="margin-bottom:14px"><div class="ph"><h3>What the pre-screen saw</h3><span class="note">Identity, credit reports and bank data, ${fdt(L.pre.at)}</span><button class="lnk act" data-act="tab" data-v="income">Full detail</button></div><div class="pb">
  <div class="ins-k">Identity and dedupe</div><table class="tbl"><tbody>${c.apps.map(a => `<tr><td><b>${esc(a.name)}</b></td><td>${a.pan.indexOf('Form') >= 0 ? 'No PAN: Form 60' : 'PAN verified'}. Aadhaar e-KYC done, stored masked. CKYC: ${esc(lc1(a.ckyc))}.</td></tr>`).join('')}<tr><td><b>Dedupe</b></td><td>No match in customer records, the negative list or the wilful defaulter list.</td></tr></tbody></table>
  <div class="ins-k" style="margin-top:12px">Credit reports, 24 months</div>${c.apps.map(a => `<div class="acc"><div class="acc-t"><b>${esc(a.name)}</b><span>${a.cibil ? 'CIBIL ' + a.cibil + ', ' + a.accts + ' accounts, ' + plural(a.enq6, 'enquiry', 'enquiries') + ' in 6 months' : 'No credit history'}</span></div>${dpdStrip(a.dpd)}</div>`).join('')}${DPDLEG}
  <div class="ins-k" style="margin-top:12px">Bank data: ${esc(b.via.indexOf('PDF') === 0 ? 'statement read from PDF' : b.via)}</div>
  <div class="fgrid one">${fr('Pattern', esc(b.salary))}${fr('Average balance, last 6 months', inr(sum(b.bal) / b.bal.length))}${fr('Bounces, last 12 months', String(b.bounces))}${fr('EMIs already running', ob.length ? inr(sum(ob, o => o.emi)) + ' a month, ' + plural(ob.length, 'loan') : 'None')}</div></div></section>`;
}
function leadRight2() { const c = C(); return preCardHTML(c) + preSawHTML(c) + cfBuildHTML(c); }
function preDeclHTML() { const c = C(); return `<div class="ov"><div class="ov-m">${recHTML2()}${preSawHTML(c)}${nextHTML2()}</div><aside class="ov-r">${tatHTML()}${activityHTML()}</aside></div>`; }

/* ---------------- review workspace: left, the case ---------------- */
function ovLeft() {
  const c = C(), f = E.f, m = E.m, v = c.v, ed = c.w.edited || {}, can = canEdit(c), st = E.st;
  const inp = (val, step) => `<input class="fin sm" id="fin" type="number" step="${step}" value="${val}" data-autofocus>`;
  const ro = S.role === 'cm' ? ({ docs: 'Editable once the system has a recommendation.', provisional: 'Editable once the final recommendation is in.', pending: 'Locked while ' + (st.lvl ? AUTH[st.lvl].name : 'the approver') + ' decides. Withdraw the request to change it.', approved: 'Locked: the case is sanctioned.', declined: 'Locked: the case is closed.' }[st.k] || 'Read only.') : S.role === 'ap' ? 'Read only. Change the terms with a counter-offer in your decision.' : 'Read only. The credit manager can change these.';
  const asked = v.loan !== v.applied.loan || v.tenure !== v.applied.tenure ? `<p class="hint">Asked for ${lakh(v.applied.loan)} over ${yrsTxt(v.applied.tenure)}.</p>` : '';
  const loanP = `<section class="panel"><div class="ph"><h3>Loan terms</h3><span class="note">EMI ${inr(m.emi)}</span></div><div class="pb"><div class="fgrid one">
   ${editRow(c, 'loan', 'Loan amount', lakh(v.loan), ed.loan ? 'edit' : 'dec', inr(v.loan), inp(v.loan, 10000))}
   ${editRow(c, 'tenure', 'Tenure', yrsTxt(v.tenure), ed.tenure ? 'edit' : 'dec', v.tenure + ' EMIs. Longest allowed: ' + yrsTxt(maxTenureOf(f, POL)), inp(v.tenure / 12, 1))}
   ${editRow(c, 'roi', 'Interest rate', v.roi.toFixed(2) + '%', ed.roi ? 'edit' : 'dec', c.colend ? 'Blended across the two lenders' : 'Floating, linked to the Housing Reference Rate', inp(v.roi, 0.05))}
   <div class="fd"><div class="fd-l">EMI<small>Worked out from the three above</small></div><div class="fd-v">${inr(m.emi)}${chip('cal')}</div></div></div>${asked}</div></section>`;
  const incP = `<section class="panel"><div class="ph"><h3>Eligible income</h3><span class="note">${f.incKnown ? inr(f.incElig) + ' a month' : 'Waiting for ' + esc(f.incWait)}</span></div><div class="pb"><div class="fgrid one">
   ${c.apps.map(a => a.earning ? editRow(c, 'inc:' + a.id, a.name, inr(a.inc) + ' a month', ed['inc:' + a.id] ? 'edit' : c.prog === 'aip' ? 'ven' : 'ver', a.incSrc, inp(a.inc, 100)) : `<div class="fd"><div class="fd-l">${esc(a.name)}<small>No income considered</small></div><div class="fd-v">${DASH}</div></div>`).join('')}</div>${c.prog === 'aip' && c.pd ? `<p class="hint">Declared ${inr(c.pd.decl)} a month; the personal discussion assessed ${inr(c.pd.assessed)}, and that figure is used.</p>` : ''}</div></section>`;
  const obP = `<section class="panel"><div class="ph"><h3>Loans that count in FOIR</h3><span class="note">${inr(f.oblig)} a month</span></div><div class="pb">${c.oblig.map(o => `<label class="obl${o.count ? '' : ' off'}"><input type="checkbox" data-act="oblig" data-v="${o.id}"${o.count ? ' checked' : ''}${can ? '' : ' disabled'}><span><b>${esc(o.t)}</b><small>${esc(o.lender)}${o.left ? ', ' + o.left + ' months left' : ''}${o.why ? '. ' + esc(o.why) : ''}</small></span><span class="amt">${o.emi ? inr(o.emi) : 'No EMI'}</span></label>`).join('')}${can ? '<p class="hint">Untick a loan to leave it out of FOIR, for example one that closes before disbursement.</p>' : ''}</div></section>`;
  const clP = c.colend ? `<section class="panel"><div class="ph"><h3>Co-lending</h3><span class="note">${esc(c.colend.partner)}: ${tIn(c, 'colend') ? 'approved, ' + esc(c.colend.ref) : 'approval pending'}</span></div><div class="pb"><table class="tbl"><thead><tr><th>Lender</th><th class="r">Share</th><th class="r">Rate</th></tr></thead><tbody><tr><td>${esc(c.colend.partner)}</td><td class="r">${c.colend.share}%</td><td class="r">${c.colend.prate.toFixed(2)}%</td></tr><tr><td>${esc(LENDER.short)}</td><td class="r">${100 - c.colend.share}%</td><td class="r">${c.colend.orate.toFixed(2)}%</td></tr><tr><td><b>Blended rate to the customer</b></td><td></td><td class="r"><b>${blended(c).toFixed(2)}%</b></td></tr></tbody></table></div></section>` : '';
  const head = `<div class="pf-h"><div><h2>Case facts</h2><p>${can ? 'What-if: change a value and the recommendation on the right updates at once. Every change is logged.' : esc(ro)}</p></div>${can && c.w.orig ? `<button class="btn btn-s btn-sm" data-act="wireset" style="margin-left:auto">${ic('reset')}Undo my changes</button>` : ''}</div>`;
  return head + `<div class="stack ovl">${loanP}${incP}${obP}${clP}${propSnapHTML()}${tatHTML()}${activityHTML()}</div>`;
}
function propSnapHTML() {
  const c = C(), f = E.f, two = !!task(c, 'tech2');
  const val = f.valUsed ? valueUsedCard(c, E) : `<section class="panel"><div class="ph"><h3>Value used for LTV</h3><span class="note">Lowest of the price and the valuations</span></div><div class="pb"><div class="tk-wait">${ic('clock')}<span>Comes from ${two ? 'the two valuations' : 'the valuation'}${task(c, 'tech') && task(c, 'tech').st === 'todo' ? ', ordered as soon as the documents are in' : ''}. ${c.lead && c.lead.price ? 'The pre-screen used the stated price of ' + lakh(c.lead.price) + '.' : ''}</span></div></div></section>`;
  return val + propChecksHTML();
}
function propChecksHTML() {
  const c = C(), p = c.prop, R = [], lgIn = tIn(c, 'legal'), tech = tIn(c, 'tech');
  const add = (n, v, s) => R.push(`<div class="ck"><span></span><div class="ck-n">${esc(n)}<small>${esc(v)}</small></div><span></span><span class="st ${s}">${{ pass: 'Met', fail: 'Not met', needs: 'Waiting', warn: 'Conditions', na: 'Not eligible' }[s]}</span></div>`);
  const lt = task(c, 'legal');
  if (lt) add('Legal opinion', lgIn ? { clear: 'Clear', cond: 'Clear with ' + plural(p.legal.conds.length, 'condition'), notclear: 'Not clear' }[p.legal.op] + '. ' + p.legal.by + (p.legal.chain.length ? '. Title chain: ' + p.legal.chain.map(x => x.y).join(', ') : '') + (p.legal.lod.length ? '. ' + plural(p.legal.lod.length, 'original document') + ' to collect' : '') : lt.st === 'todo' ? 'Ordered as soon as the documents are in' : 'With ' + lt.vendor + (lt.due ? ', due ' + fds(lt.due) : ''), lgIn ? (p.legal.op === 'clear' ? 'pass' : p.legal.op === 'cond' ? 'warn' : 'fail') : 'needs');
  if (p.apf) add('Approved project', p.apf.id + ', valid to ' + p.apf.valid + '. ' + p.apf.financed + ' of ' + p.apf.units + ' units financed, not this one', tIn(c, 'apf') ? 'pass' : 'needs');
  if (task(c, 'rera')) add('RERA registration', tIn(c, 'rera') ? p.rera.no + ', valid to ' + p.rera.valid : 'Not checked yet', tIn(c, 'rera') ? 'pass' : 'needs');
  if (task(c, 'cersai')) add('CERSAI search', tIn(c, 'cersai') ? p.cersai.t : 'Run when the documents are in', tIn(c, 'cersai') ? (p.cersai.st === 'charge' ? 'fail' : 'pass') : 'needs');
  if (['resale', 'bt'].includes(c.variant)) add('Occupancy certificate', p.oc ? 'On file' : 'Not on file', p.oc ? 'pass' : 'fail');
  if (task(c, 'tech')) {
    add('Negative area', tech ? (p.neg === 'none' ? 'Not on any list' : p.neg === 'barred' ? 'Barred: ' + p.negNote : 'Caution area') : 'From the site visit', tech ? (p.neg === 'none' ? 'pass' : 'fail') : 'needs');
    if (p.planDev != null) add('Built as per the approved plan', tech ? p.planDev + '% deviation; tolerance ' + POL.dev.planTol + '%' : 'From the site visit', tech ? (p.planDev <= POL.dev.planTol ? 'pass' : 'warn') : 'needs');
    add('Building life', tech ? p.resid + ' years left; the loan runs ' + yrsTxt(c.v.tenure) : 'From the site visit', tech ? (p.resid >= c.v.tenure / 12 ? 'pass' : 'fail') : 'needs');
    if (c.variant === 'uc' || c.variant === 'selfcon') add('Construction stage', tech ? p.stage + '%: ' + lc1(p.stageText) : 'From the site visit', tech ? 'pass' : 'needs');
  }
  if (c.pmay) { const pm = pmayOf(c, E); add('PMAY-U 2.0 interest subsidy', pm.ok ? 'Eligible, ' + pm.cat + ': up to ₹1.80 lakh' : 'Not eligible', pm.ok ? 'pass' : 'na'); }
  return `<section class="panel"><div class="ph"><h3>Property checks</h3><span class="note">${esc(p.kind)}, ${esc(lc1(CATS[c.cat]))}</span><button class="lnk act" data-act="tab" data-v="property">See the reports</button></div><div class="pb"><p class="ps-a">${ic('pin')}<span>${esc(p.addr)}</span></p>${R.join('')}</div></section>`;
}
function durTxt(a, b) {
  const ms = P(b) - P(a); if (ms <= 0) return '';
  const mins = Math.round(ms / 60000);
  if (mins < 60) return '+' + mins + ' min';
  if (P(a).toDateString() === P(b).toDateString()) return '+' + trimz((mins / 60).toFixed(1)) + ' h';
  return '+' + plural(Math.max(1, wdLate(a, b)), 'working day');
}
function tatHTML() {
  const c = C(), t = tatOf(c, E), L = c.lead, M = [];
  const add = (at, l, d) => { if (at) M.push({ at, l, d: d || '' }); };
  if (L) { add(L.created, 'Lead created', L.by.replace(' (DSA)', ', DSA')); if (L.consent) add(L.consent.at, 'Consent given by OTP', L.consent.wa ? 'With WhatsApp updates' : ''); if (L.pre) add(L.pre.at, 'Pre-screen', { yes: 'Eligible', change: 'Eligible with changes', no: 'Not eligible' }[L.pre.res]); }
  if (!L || L.in) {
    add(c.v.login, 'Logged in', c.v.appNo);
    const ld = c.docs.filter(d => d.need === 'login'); if (ld.length && ld.every(d => d.up)) add(ld.map(d => d.up.at).sort().pop(), 'Documents complete', plural(ld.length, 'document'));
    const vt = c.tasks.filter(x => x.kind !== 'sys'); if (vt.length && vt.every(x => x.st === 'accepted')) add(vt.map(x => x.acc).sort().pop(), 'Outside reports in', plural(vt.length, 'report'));
    add(c.w.sysAt, 'System recommendation', 'Rules engine, model and memo');
  }
  if (c.w.req) add(c.w.req.at, 'Referred to ' + c.w.req.lvl, AUTH[c.w.req.lvl].name);
  if (c.w.dec && c.w.dec.k !== 'returned') add(c.w.dec.at, c.w.dec.k === 'approved' ? 'Sanctioned' : 'Closed', c.w.dec.by === 'SYS' ? 'By the system' : 'By ' + byName(c.w.dec.by));
  if (c.w.letter) add(c.w.letter.sent, 'Letter with the reasons sent');
  if (c.w.san) { add(c.w.san.sent, 'Sanction letter and KFS sent'); add(c.w.san.accepted, 'Customer accepted', 'By OTP'); add(c.w.san.handoff, 'Handed off', 'Operations'); }
  M.sort((a, b) => a.at < b.at ? -1 : a.at > b.at ? 1 : 0);
  const clk = t.pre ? `<div class="clk"><b>Day ${t.n}</b><span>since the lead. The pre-screen runs the moment the documents and consent are in.</span></div>`
    : `<div class="clk${t.late ? ' late' : ''}"><b>Day ${t.n}</b><span>${t.closed ? 'Decided on day ' + t.n + ' against a ' + t.tgt + '-day target' : 'of ' + t.tgt + ' working days from login to decision, for ' + c.seg + ' loans'}</span></div><div class="clkbar${t.over ? ' late' : ''}"><i style="width:${clamp(t.n / t.tgt * 100, 4, 100)}%"></i></div>`;
  const reps = c.tasks.filter(x => x.kind !== 'sys').map(x => {
    let v, cls = '';
    if (x.recv) { const late = x.due && wdLate(x.due, x.recv) > 0, took = wdLate(x.assigned || x.recv, x.recv); v = late ? plural(wdLate(x.due, x.recv), 'day') + ' late' : (took ? plural(took, 'day') : 'Same day') + ' of ' + x.slaD; cls = late ? 'late' : 'ok'; }
    else if (x.due) { const lt = tState(x) === 'late'; v = lt ? plural(wdLate(x.due), 'day') + ' late' : 'Due ' + fds(x.due); cls = lt ? 'late' : ''; }
    else v = 'Not ordered yet';
    return `<div class="rc"><span><b>${esc(x.t)}</b><small>${esc(x.vendor)}</small></span><span class="rc-v ${cls}">${esc(v)}</span></div>`;
  }).join('');
  return `<section class="panel"><div class="ph"><h3>Turnaround</h3><span class="note">Working days</span></div><div class="pb">${clk}<ol class="tml">${M.map((x, i) => `<li${i === M.length - 1 ? ' class="now"' : ''}><i></i><div><b>${esc(x.l)}</b><small>${esc(fds(x.at) + ', ' + ftime(x.at) + (x.d ? '. ' + x.d : ''))}</small></div><span class="tml-d">${i ? esc(durTxt(M[i - 1].at, x.at)) : ''}</span></li>`).join('')}</ol>${reps ? `<div class="ins-k" style="margin:6px 0 2px">Outside reports against their deadlines</div>${reps}` : ''}</div></section>`;
}

/* ---------------- review workspace: right, the decision ---------------- */
function itemShort(r) {
  switch (r.id) {
    case 'r_foir': return 'FOIR ' + pts(r.ex || 0) + ' over the cap';
    case 'r_ltv_reg': return 'LTV of ' + r.v + ', over the RBI cap';
    case 'r_ltv_pol': return 'LTV of ' + r.v + ', over the policy cap';
    case 'r_legal': return 'legal opinion ' + lc1(r.v);
    case 'r_score': return 'bureau score of ' + r.v;
    case 'r_age': return 'age at maturity';
    case 'r_valvar': return 'valuations ' + r.v;
    case 'r_dpd': return 'repayment record';
    case 'r_ntc': return 'an applicant new to credit';
    case 'r_oc': return 'no occupancy certificate';
    case 'r_plan': return 'plan deviation of ' + r.v;
    case 'r_neg': return 'negative area';
  }
  return lc1(r.name);
}
function authWhy() {
  const c = C(), st = E.st, rec = recOf(c, E); if (!['review', 'returned', 'pending', 'provisional'].includes(st.k)) return '';
  const P2 = [], items = E.devs.concat(E.refs);
  if (E.hard.length) P2.push(cap1(listAnd(E.hard.map(itemShort))) + ': no one can approve ' + lakh(c.v.loan));
  if (rec.k === 'counter') P2.push('At the counter-offer of ' + lakh(rec.loan) + ': ' + rec.lvl);
  else { P2.push('Amount ' + lakh(c.v.loan) + ': ' + E.amtLvl); items.forEach(r => P2.push(cap1(itemShort(r)) + ': ' + r.lvl)); if (E.bumped) P2.push('Three or more items move it up a level'); }
  return `<p class="ld-why">${esc(P2.join('. ') + '.' + (rec.k !== 'counter' && !E.hard.length && items.length ? ' The highest level applies.' : ''))}</p>`;
}
function ladder2() {
  const c = C(), st = E.st, rec = recOf(c, E), nodes = ['SYS'].concat(LEVELS), n = nodes.length;
  let req, mode = '', cap;
  switch (st.k) {
    case 'approved': req = st.by; cap = st.by === 'SYS' ? 'Sanctioned by the system: clean, and within its ' + lakh(POL.sysAuth) + ' limit' : 'Sanctioned at ' + st.by + ' by ' + AUTH[st.by].name; break;
    case 'review': case 'returned': req = rec.k === 'decline' ? 'L1' : rec.lvl; cap = rec.k === 'decline' ? 'The credit manager can reject' : RANK[req] <= 1 ? 'The credit manager can decide' : 'Needs ' + req + ': ' + AUTH[req].title; break;
    case 'pending': req = st.lvl; cap = 'Waiting for ' + AUTH[st.lvl].name + ', ' + st.lvl; break;
    case 'provisional': req = rec.lvl || 'L1'; mode = 'dim'; cap = 'Provisionally ' + req + '; settled when the reports are in'; break;
    case 'declined': req = st.by === 'SYS' ? 'SYS' : st.by; mode = 'x'; cap = st.by === 'SYS' ? 'Closed by the system at pre-screen' : 'Rejected by ' + byName(st.by); break;
    default: return '';
  }
  const ri = Math.max(0, nodes.indexOf(req));
  const node = (l, i) => { const sys = l === 'SYS', tag = i === ri ? (sys ? (st.k === 'approved' ? 'Sanctioned' : st.k === 'declined' ? 'Closed' : 'Automatic') : AUTH[l].name) : sys && i < ri ? 'Recommended' : ''; return `<div class="ldn${i < ri ? ' lit' : ''}${i === ri ? ' req' : ''}${sys ? ' sys' : ''}"><i>${mode === 'x' && i === ri ? ic('x') : i <= ri && mode !== 'dim' ? ic('check') : ''}</i><b>${sys ? 'System' : l}</b><small>${sys ? 'Rules and model' : AUTH[l].title}</small>${tag ? `<em>${esc(tag)}</em>` : ''}</div>`; };
  return `<div class="ladder" aria-label="Approval authority"><p class="ld-cap">${esc(cap)}</p><div class="ld ${mode}" style="--n:${n}"><span class="ld-fill" style="width:${ri * 100 / n}%"></span>${nodes.map(node).join('')}</div>${authWhy()}</div>`;
}
function basedOn(c) {
  const cf = cfCount(c), docs = c.docs.filter(d => d.up).length, rep = c.tasks.filter(t => t.st === 'accepted').length, rules = E.R.filter(r => r.st !== 'na').length;
  return `<p class="based">${ic('cpu')}<span>Rests on ${cf.done} of ${cf.n} case-file fields, ${plural(docs, 'document')}, ${rep} of ${c.tasks.length} checks and reports, and ${rules} rules of policy v${POL.ver}${E.ml ? ', with deviation model ' + MODEL.id + ' ' + POL.model.ver : ''}.</span></p>`;
}
function recHTML2() {
  const c = C(), st = E.st, rec = recOf(c, E), m = E.m, d = c.w.dec, items = E.hard.concat(E.devs, E.refs), passN = E.R.filter(r => r.st === 'pass').length;
  const terms = lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure) + ' at ' + c.v.roi.toFixed(2) + '%, EMI ' + inr(m.emi) + '.' + (E.ml ? ' Model risk ' + pct(E.ml.p) + '.' : '');
  let tone = 'info', badge = '', bic = 'cpu', verb = '', sub = '', why = [];
  switch (st.k) {
    case 'docs': { const ms = loginMissing(c); badge = 'Logged in'; verb = 'Documents due'; sub = plural(ms.length, 'document') + ' still to come: ' + listAnd(ms.map(x => lc1(x.t))) + '. The system orders the legal, valuation and field checks the moment they are in.'; break; }
    case 'provisional': badge = 'Provisional recommendation'; verb = recVerb(rec, c) + ' ' + lakh(c.v.loan); sub = 'Waiting for ' + listAnd(needsTxt(E)) + '. The final recommendation follows when the reports are in.'; why = items.map(liOf).concat([{ cls: 'ok', t: plural(passN, 'rule') + ' met so far' }]); break;
    case 'review': case 'returned': {
      tone = rec.k === 'decline' ? 'err' : rec.k === 'counter' ? 'warn' : 'ok'; badge = c.w.ovr ? 'Pulled back from automatic sanction' : 'Final recommendation'; verb = recVerb(rec, c);
      sub = st.k === 'returned' ? 'Sent back by ' + byName(st.by) + ': “' + (d.note || '') + '”' : terms;
      why = items.map(liOf).concat([{ cls: 'ok', t: plural(passN, items.length ? 'other rule' : 'rule') + ' met' }]);
      const oc = openChecks(c).length; if (oc) why.push({ cls: 'dv', t: plural(oc, 'check') + ' for you below' });
      if (c.w.ovr) why.push({ cls: 'nd', t: 'Pulled back by ' + byName(c.w.ovr.by) + ': ' + lc1(c.w.ovr.reason) + (c.w.ovr.note ? '. ' + c.w.ovr.note : '') });
      break;
    }
    case 'pending': tone = 'warn'; badge = 'Referred'; verb = 'With ' + st.lvl; sub = 'Sent to ' + AUTH[st.lvl].name + ' on ' + fdt(c.w.req.at) + '. The system recommends: ' + lc1(recVerb(rec, c)) + '.'; why = items.map(liOf); break;
    case 'approved': tone = 'ok'; badge = st.by === 'SYS' ? 'Sanctioned by the system' : 'Sanctioned'; bic = st.by === 'SYS' ? 'cpu' : 'user'; verb = 'Sanctioned ' + lakh(c.v.loan); sub = terms + ' ' + (st.by === 'SYS' ? 'Every rule met and no checks raised, so no one needed to sign.' : 'By ' + byName(st.by) + ', ' + fdt(d.at) + '.'); if (d && d.counter) why.push({ cls: 'nd', t: 'Counter-offer: ' + lakh(d.counter.from.loan) + ' asked, ' + lakh(d.counter.to.loan) + ' sanctioned' }); if (d && d.conds) d.conds.forEach(x => why.push({ cls: 'nd', t: 'Extra condition: ' + x })); break;
    case 'declined': tone = 'err'; badge = 'Closed'; verb = st.by === 'SYS' ? 'Not eligible' : 'Rejected'; sub = (st.by === 'SYS' ? 'At pre-screen.' : 'By ' + byName(st.by) + ', ' + fdt(d.at) + '.') + ' ' + (c.w.letter ? 'Reasons sent ' + fdt(c.w.letter.sent) + '.' : 'The letter with the reasons is ready to send.'); why = (d.reasons || []).map(k => ({ cls: 'nx', t: REJ[k].en })); break;
  }
  const based = ['provisional', 'review', 'returned', 'pending'].includes(st.k) || (st.k === 'approved' && st.by === 'SYS') ? basedOn(c) : '';
  return `<div class="hero one ${tone}"><div><span class="rec-b">${ic(bic)}${esc(badge)}</span><h2 class="hero-verb">${esc(verb)}</h2>${sub ? `<p class="hero-why">${esc(sub)}</p>` : ''}${why.length ? `<ul class="why">${why.map(w => `<li class="${w.cls}">${ic(w.cls === 'ok' ? 'check' : w.cls === 'nx' ? 'x' : w.cls === 'nd' ? 'info' : 'alert')}<span>${esc(w.t)}</span></li>`).join('')}</ul>` : ''}${based}</div>${ladder2()}</div>`;
}
function decHTML2() { const c = C(); return S.role === 'cm' && E.st.k === 'pending' ? pendingHTML(c) : decHTML(); }
function nextHTML2() {
  const c = C(), st = E.st; let h = nextHTML();
  if (st.k === 'approved' && st.by === 'SYS' && !c.w.san.accepted && S.role === 'cm') h += `<section class="panel"><div class="ph"><h3>Automatic sanction</h3><span class="note">A person can stop it until the customer accepts</span></div><div class="pb"><p style="margin:0 0 10px;color:var(--ink-2);font-size:12.8px">The system sanctioned this because every rule was met and nothing needed checking. If you know something it does not, pull it back and decide it yourself. Your reason is logged and reviewed with the model every month. The customer is told the offer is on hold.</p><button class="btn btn-s btn-sm" data-act="pullback">${ic('pen')}Pull back for review</button></div></section>`;
  return h;
}
function waysHTML() {
  const c = C(), st = E.st; if (!['review', 'returned', 'provisional'].includes(st.k)) return '';
  const rec = recOf(c, E), W = E.ways.filter(w => !(rec.k === 'counter' && w.cure)), can = canEdit(c);
  if (!W.length) return '';
  return `<section class="panel"><div class="ph"><h3>What would change the outcome</h3><span class="note">Worked out by the system${can ? '. Apply one to try it, and undo it from the case facts' : ''}</span></div><div class="pb">${W.map(w => `<div class="opp"><div><b>${esc(w.t)}</b><span>${esc(w.d)}</span></div>${w.apply && can ? `<button class="btn ${w.key ? 'btn-p' : 'btn-s'} btn-sm" data-act="apply" data-v='${esc(JSON.stringify(w.apply))}'>Apply</button>` : ''}</div>`).join('')}</div></section>`;
}
function findCompactHTML() {
  const c = C(), cs = condsOf(c, E), str = strengthsOf(c, E), obs = obsOf(c, E);
  const G = [['now', 'Before sanction'], ['cp', 'Before the first disbursement'], ['pdd', 'After disbursement']].map(([k, l]) => [l, cs.filter(x => x.w === k)]).filter(g => g[1].length);
  const grp = ([l, L]) => `<div><div class="ins-k">${l}<span class="fc-n">${L.length}</span></div><ul class="fc-l">${L.map(x => `<li>${esc(x.t)}${x.d ? `<small>${esc(x.d)}</small>` : ''}</li>`).join('')}</ul></div>`;
  const cp = G.find(g => g[0] === 'Before the first disbursement'), rest = G.filter(g => g !== cp);
  return `<section class="panel"><div class="ph"><h3>Conditions</h3><span class="note">${plural(cs.length, 'condition')}, set before and after the money goes out</span><button class="lnk act" data-act="tab" data-v="rules">All findings</button></div><div class="pb two">${cp ? grp(cp) : '<div></div>'}<div>${rest.map(grp).join('')}</div></div></section>
  ${str.length || obs.length ? `<section class="panel"><div class="ph"><h3>Strengths and observations</h3><span class="note">For the credit memo</span></div><div class="pb two"><div><div class="ins-k">Strengths</div>${str.map(s => `<div class="str">${ic('check')}<span>${esc(s)}</span></div>`).join('') || '<p class="muted">None noted.</p>'}</div><div><div class="ins-k">Observations</div>${obs.map(s => `<div class="obs">${ic('info')}<span>${esc(s)}</span></div>`).join('')}</div></div></section>` : ''}`;
}
function ovRight() {
  const st = E.st, showM = st.k !== 'docs';
  return `<div class="dws ovr">${recHTML2()}${showM ? `<section id="d-mets">${metsHTML()}</section>` : ''}${['docs', 'provisional'].includes(st.k) ? waitHTML() : ''}${checksHTML()}${decHTML2()}${nextHTML2()}${waysHTML()}${showM ? eligHTML() : ''}${showM && E.ml ? mlHTML() : ''}${showM ? findCompactHTML() : ''}</div>`;
}

/* ---------------- actions ---------------- */
function snapOrig(c) { if (c.w.orig) return; c.w.orig = { loan: c.v.loan, tenure: c.v.tenure, roi: c.v.roi, inc: c.apps.map(a => a.inc), ob: c.oblig.map(o => [o.count, o.why]), extra: (c.w.extra || []).length, edited: deep(c.w.edited || {}) }; }
const _fsave = ACT.fsave, _oblig = ACT.oblig, _apply = ACT.apply, _cmgo = ACT.cmgo;
Object.assign(ACT, {
  fsave() { const c = C(); if (S.edit) { snapOrig(c); c.w.touched = true; } _fsave(); },
  oblig(v) { const c = C(), ok = S.role === 'cm' && ['login', 'verify', 'decide'].includes(c.w.step) && !c.w.dec && !(c.w.req && c.w.req.k === 'pending'); if (ok) { snapOrig(c); c.w.touched = true; } _oblig(v); },
  apply(v) { snapOrig(C()); _apply(v); },
  cmgo(v) { if (v === 'counter') snapOrig(C()); _cmgo(v); },
  wireset() {
    const c = C(), o = c.w.orig; if (!o) return;
    c.v.loan = o.loan; c.v.tenure = o.tenure; c.v.roi = o.roi; c.apps.forEach((a, i) => { a.inc = o.inc[i]; }); c.oblig.forEach((x, i) => { x.count = o.ob[i][0]; x.why = o.ob[i][1]; });
    c.w.extra.length = o.extra; c.w.edited = o.edited; c.w.orig = null; S.edit = null;
    log(c, L1W(), 'data', 'What-if changes undone', 'Back to ' + lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure) + ' at ' + c.v.roi.toFixed(2) + '%.');
    if (c.w.sysAt) c.w.sysAt = tick(1);
    render(); toast('Back to the values the system used');
  },
  pullback() { S.sheet = { k: 'pull' }; render(); },
  pullgo() {
    const c = C(), r = ($('#ovrR') || {}).value || OVR_REASONS[0], n = (($('#ovrN') || {}).value || '').trim();
    if (!n) { toast('Say what the system does not know'); return; }
    c.w.dec = null; c.w.touched = true; c.w.ovr = { by: 'L1', at: tick(2), reason: r, note: n };
    log(c, L1W(), 'decision', 'Automatic sanction pulled back for review', n, { rsn: r });
    S.sheet = null; S.form = {}; render(); toast('Pulled back. The case is with you for a decision');
  }
});
function recOf(c, ev) {
  const so = ev.sys;
  if (ev.needs.length) return { k: 'prov', p: ev.hard.length ? 'decline' : RANK[ev.lvl] >= 2 ? 'refer' : 'approve', lvl: ev.lvl };
  if (so.k === 'counter') { const L = so.cure.apply.loan; return { k: 'counter', loan: L, lvl: lvlAmt(L, POL) }; }
  if (so.k === 'decline') return { k: 'decline', lvl: 'L1' };
  if (so.ml === 'reject') return { k: 'decline', lvl: 'L1', model: true };
  return { k: ev.refs.length ? 'cond' : 'approve', lvl: ev.lvl, ml: so.ml };
}
/* start-up runs at the end of the v4 shell (16_shell.js) */

/* =====================================================================
   v4: lead management. Fit x intent x callability, the RM's day,
   the sales manager's view, lead drawer, call and WhatsApp flows
   ===================================================================== */
const SMGR = { ini: 'NB', name: 'Nikhil Bhatia', sub: 'Head of retail sales' };
ICO.phone = '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>';
const TEAM = {
  amit: { n: 'Amit Joshi', r: 'RM', w: 'Pune Kothrud', cap: 20, conn: 6, lang: 'Marathi, Hindi, English' },
  shweta: { n: 'Shweta Patil', r: 'RM', w: 'Pune Baner', cap: 20, open: 14, conn: 14, lang: 'Marathi, English' },
  rahul: { n: 'Rahul Bansal', r: 'RM', w: 'Gurugram', cap: 20, open: 19, conn: 6, lang: 'Hindi, English' },
  farida: { n: 'Farida Khan', r: 'RM', w: 'Mumbai Kandivali', cap: 20, open: 9, conn: 11, lang: 'Hindi, Marathi, English' },
  anoop: { n: 'Anoop Varghese', r: 'RM', w: 'Kochi', cap: 20, open: 12, conn: 8, lang: 'Malayalam, English' },
  divya: { n: 'Divya Nair', r: 'Tele-sales', w: 'Malayalam and English queue', cap: 60, open: 54, conn: 41, lang: 'Malayalam, English' },
  sunita: { n: 'Sunita Rawat', r: 'Tele-sales', w: 'Hindi and English queue', cap: 60, open: 61, conn: 37, lang: 'Hindi, English' }
};
const RULES = {
  r1: 'Rule 1: existing customer, to their servicing RM',
  r2: 'Rule 2: DSA or connector lead, to the RM mapped to that partner',
  r3: 'Rule 3: builder lead, to the RM mapped to the project',
  r4: 'Rule 4: walk-in or referral, to the branch RM',
  r5: 'Rule 5: website or property-portal lead in a branch’s pin codes, to that branch’s RM',
  r6: 'Rule 6: aggregator leads, and digital leads outside branch pin codes, to tele-sales by language'
};
const DIGI = ['Website', 'Aggregator', 'Property portal'];
const LVAR = { uc: 'Under construction', resale: 'Resale', selfcon: 'Self-build', plotcon: 'Plot and build', bt: 'Balance transfer', topup: 'Top-up', ready: 'Ready flat' };
const DAYN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const sameDay = (a, b) => P(a).toDateString() === P(b).toDateString();
function dur(m) { m = Math.round(Math.abs(m)); if (m < 60) return m + ' min'; if (m < 1440) { const h = Math.floor(m / 60), r = m % 60; return h + ' h' + (r ? ' ' + r + ' min' : ''); } return plural(Math.round(m / 1440), 'day'); }
function agoTxt(at) { const m = (CLK - P(at)) / 60000; if (m < 1) return 'just now'; if (m < 1440 && sameDay(at, CLK)) return dur(m) + ' ago'; return fds(at) + ', ' + ftime(at); }

/* ---------------- sample leads (fictional people and partners) ---------------- */
const LIGHT = [
{ id: 'L01', no: 'LD-2611-0431', name: 'Anjali Bhosale', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'resale', ask: 4000000, ten: 240, emp: 'Salaried', inc: 95000, obl: 0, prop: 'identified', propTxt: 'Resale flat shortlisted in Kothrud',
  src: { t: 'Website', n: 'Website form' }, owner: 'amit', rule: 'r5', created: '2026-11-16 10:56', stage: 'new',
  ev: [{ at: '2026-11-16 10:49', t: 'Used the EMI calculator three times', p: 8 }, { at: '2026-11-16 10:56', t: 'Filled the website form', p: 30 }, { at: '2026-11-16 10:56', t: 'Asked for a call back on the form', p: 25 }],
  att: [], con: { inq: '2026-11-16 10:56', via: 'the website form', wa: true },
  call: { sum: 'Interested. Has shortlisted a 2-bedroom resale flat in Kothrud for about ₹62 lakh. Salaried at ₹95,000 a month with no other loans. Wants to finalise by January and can share documents today.', next: 'consent' } },
{ id: 'L02', no: 'LD-2611-0427', name: 'Farhan Shaikh', city: 'Pune', lang: 'Hindi', seg: 'prime', variant: 'uc', ask: 5500000, ten: 300, emp: 'Salaried', inc: 135000, obl: 8000, prop: 'searching', propTxt: 'Looking at new projects in Wakad',
  src: { t: 'Website', n: 'Google Ads lead form' }, owner: 'amit', rule: 'r5', created: '2026-11-16 08:12', stage: 'new',
  ev: [{ at: '2026-11-16 08:12', t: 'Filled a Google Ads lead form', p: 30 }, { at: '2026-11-16 08:14', t: 'Replied to the instant WhatsApp acknowledgement', p: 20 }],
  att: [], con: { inq: '2026-11-16 08:12', via: 'a Google Ads lead form', wa: true }, wa: 'ack',
  call: { sum: 'Interested. Looking at new projects in Wakad; no flat booked yet. Salary ₹1.35 lakh a month and a car loan EMI of ₹8,000. Wants a rough eligibility figure before visiting projects.', next: 'consent' } },
{ id: 'L03', no: 'LD-2611-0422', name: 'Rohan Deshmukh', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'uc', ask: 6800000, ten: 300, emp: 'Salaried', inc: 160000, obl: 0, prop: 'apf', propTxt: 'Flat C-904 booked in Godavari Heights, an approved project',
  src: { t: 'Builder', n: 'Sankalp Developers, Godavari Heights' }, owner: 'amit', rule: 'r3', created: '2026-11-14 16:20', stage: 'consent',
  ev: [{ at: '2026-11-14 16:20', t: 'Met our desk at the project site', p: 30 }, { at: '2026-11-14 16:20', t: 'Booking amount paid for flat C-904', p: 20 }, { at: '2026-11-14 16:45', t: 'On the call: wants the loan before the builder’s 10 Dec demand', p: 20 }, { at: '2026-11-16 09:40', t: 'Consent link sent', p: 0 }, { at: '2026-11-16 09:52', t: 'Opened the consent link but stopped at the bank-data step', p: 10 }],
  att: [{ at: '2026-11-14 16:45', o: 'Connected' }], con: { inq: '2026-11-14 16:20', via: 'a signed form at the project site', wa: true, link: '2026-11-16 09:40' },
  call: { sum: 'Opened the consent link but stopped at the bank-data step: unsure about sharing statements. Explained how the Account Aggregator consent works. He will finish it today.', next: 'consent' } },
{ id: 'L04', no: 'LD-2611-0398', name: 'Shalini Pawar', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'resale', ask: 3500000, ten: 240, emp: 'Self-employed, ITR', inc: 85000, obl: 0, prop: 'searching', propTxt: 'Shortlisting flats in Karve Nagar',
  src: { t: 'DSA', n: 'Sahyadri Home Loans', code: 'DSA-0617' }, owner: 'amit', rule: 'r2', created: '2026-11-12 13:10', stage: 'contacted',
  ev: [{ at: '2026-11-12 13:10', t: 'Registered by Sahyadri Home Loans', p: 15 }, { at: '2026-11-13 12:30', t: 'On the call: buying within 90 days', p: 20 }, { at: '2026-11-13 12:31', t: 'Asked for a call on Monday at 11:30', p: 25 }],
  att: [{ at: '2026-11-13 12:30', o: 'Connected' }], next: { at: '2026-11-16 11:30', t: 'Callback she asked for', pref: true }, con: { inq: '2026-11-12 13:10', via: 'a DSA form she signed', wa: true },
  call: { sum: 'Has shortlisted two flats in Karve Nagar, both about ₹52 lakh. Runs a boutique; ITR income about ₹10 lakh a year. Wants to know her eligibility before she negotiates.', next: 'consent' } },
{ id: 'L05', no: 'LD-2611-0425', name: 'Kiran Jadhav', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'resale', ask: 3000000, ten: 240, emp: 'Salaried', inc: 70000, obl: 0, prop: 'identified', propTxt: 'Resale 1-bedroom flat in Warje',
  src: { t: 'Referral', n: 'Aditya Deshpande, an existing customer' }, owner: 'amit', rule: 'r4', created: '2026-11-15 19:40', stage: 'new',
  ev: [{ at: '2026-11-15 19:40', t: 'Referred by Aditya Deshpande, an existing customer', p: 20 }, { at: '2026-11-16 09:15', t: 'Replied on WhatsApp: “Yes, please call after 10”', p: 20 }],
  att: [], con: { inq: '2026-11-16 09:15', via: 'a WhatsApp reply', wa: true },
  call: { sum: 'Referred by Aditya Deshpande. Buying a resale 1-bedroom flat in Warje for about ₹38 lakh. Salaried at ₹70,000 a month. Wants to come to the branch on Wednesday.', next: 'visit' } },
{ id: 'L06', no: 'LD-2611-0405', name: 'Vaishali More', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'resale', ask: 3200000, ten: 240, emp: 'Salaried', inc: 55000, obl: 0, prop: 'searching', propTxt: 'Still looking for a flat',
  src: { t: 'Website', n: 'Website form' }, owner: 'amit', rule: 'r5', created: '2026-11-13 14:10', stage: 'new',
  ev: [{ at: '2026-11-13 14:10', t: 'Filled the website form', p: 30 }],
  att: [{ at: '2026-11-13 14:20', o: 'No answer' }, { at: '2026-11-13 18:10', o: 'No answer' }, { at: '2026-11-14 10:40', o: 'No answer' }, { at: '2026-11-14 17:30', o: 'No answer' }],
  next: { at: '2026-11-16 17:30', t: 'Attempt 5 of 6, in the evening' }, con: { inq: '2026-11-13 14:10', via: 'the website form', wa: true }, wa: 'follow',
  call: { sum: 'Was busy at work for the earlier calls. Still looking for a flat; wants a call next week.', next: 'callback' } },
{ id: 'L07', no: 'LD-2611-0371', name: 'Nikhil Gaikwad', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'topup', ask: 800000, ten: 120, emp: 'Salaried', inc: 145000, obl: 0, prop: 'identified', propTxt: 'Existing home loan HL-2311-02214',
  src: { t: 'Existing customer', n: 'Top-up campaign' }, owner: 'amit', rule: 'r1', created: '2026-11-01 09:00', stage: 'nurture', book: { emis: 36, loan: 'HL-2311-02214', out: 2650000, topup: 800000 },
  ev: [{ at: '2026-11-10 20:15', t: 'Looked at the top-up banner in the app', p: 8 }],
  att: [], con: { rel: true, dca: true, dcaAt: '2023-10-12 11:00', wa: true }, trig: { k: 'topup', t: 'Top-up eligible: 36 EMIs paid on time' }, wa: 'topup', waReply: 'Yes, call me in the evening',
  call: { sum: 'Interested in a top-up of about ₹6 lakh for a kitchen renovation. Asked for the rate and the documents.', next: 'consent' } },
{ id: 'L08', no: 'LD-2611-0411', name: 'Sunil Kamble', city: 'Pimpri', lang: 'Marathi', seg: 'affordable', variant: 'selfcon', ask: 1500000, ten: 240, emp: 'Self-employed, informal', inc: 45000, obl: 0, prop: 'plot', propTxt: 'Owns a 1,000 sq ft plot in Chikhali',
  src: { t: 'Walk-in', n: 'Pune Kothrud branch' }, owner: 'amit', rule: 'r4', created: '2026-11-14 12:30', stage: 'contacted',
  ev: [{ at: '2026-11-14 12:30', t: 'Walked into the branch', p: 30 }, { at: '2026-11-14 12:45', t: 'Agreed to a personal discussion on Monday', p: 15 }],
  att: [], visit: { at: '2026-11-16 15:00', t: 'Personal discussion at his auto-parts shop in Pimpri' }, con: { inq: '2026-11-14 12:30', via: 'a signed form at the branch', wa: false },
  call: { sum: 'Confirmed the visit at 15:00. Will keep his sales register and bank passbook ready.', next: 'none' } },
{ id: 'L09', no: 'LD-2611-0379', name: 'Pradnya Shinde', city: 'Chakan', lang: 'Marathi', seg: 'affordable', variant: 'resale', ask: 1800000, ten: 240, emp: 'Salaried', inc: 42000, obl: 2000, prop: 'identified', propTxt: 'Row house in Chakan',
  src: { t: 'Connector', n: 'Santosh Wagh (Mitra)', code: 'CN-1182' }, owner: 'amit', rule: 'r2', created: '2026-11-09 11:00', stage: 'docs', docs: { in: 2, of: 5, miss: 'salary slips, Form 16 and the sale agreement' },
  ev: [{ at: '2026-11-09 11:00', t: 'Registered by connector Santosh Wagh', p: 15 }, { at: '2026-11-10 10:20', t: 'Gave consent for the credit report and bank data', p: 25 }, { at: '2026-11-10 10:35', t: 'Uploaded PAN and Aadhaar', p: 25 }, { at: '2026-11-11 10:00', t: 'Reminder sent: 3 documents pending', p: 0 }, { at: '2026-11-13 10:00', t: 'Reminder sent: 3 documents pending', p: 0 }],
  att: [{ at: '2026-11-09 12:00', o: 'Connected' }], con: { inq: '2026-11-09 11:00', via: 'the connector app', wa: true, bureau: '2026-11-10 10:20', aa: '2026-11-10 10:20', link: '2026-11-10 10:05' }, wa: 'docs',
  call: { sum: 'Her salary slips are with the employer’s HR; she will upload them by Thursday. The sale agreement is with the seller.', next: 'callback' } },
{ id: 'L10', no: 'LD-2611-0352', name: 'Ashwini Patil', city: 'Pune', lang: 'English', seg: 'prime', variant: 'resale', ask: 5000000, ten: 300, emp: 'Salaried', inc: 130000, obl: 0, prop: 'identified', propTxt: 'Flat in Bavdhan; negotiating the price',
  src: { t: 'Property portal', n: 'NestFinder' }, owner: 'amit', rule: 'r5', created: '2026-11-03 18:30', stage: 'nurture',
  ev: [{ at: '2026-11-03 18:30', t: 'Enquired on NestFinder', p: 30 }, { at: '2026-11-04 11:00', t: 'On the call: “just checking rates”', p: -10 }, { at: '2026-11-04 11:05', t: 'Rate sheet sent on WhatsApp', p: 0 }],
  att: [{ at: '2026-11-04 11:00', o: 'Connected' }], con: { inq: '2026-11-03 18:30', via: 'NestFinder', wa: true }, trig: { k: 'rate', t: 'Our rates fell 0.25% on 15 Nov' }, wa: 'rate', waReply: 'Yes, please call me' },
{ id: 'L11', no: 'LD-2610-0318', name: 'Tejas Kale', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'resale', ask: 2500000, ten: 240, emp: 'Salaried', inc: 60000, obl: 0, prop: 'searching', propTxt: 'Still looking for a flat',
  src: { t: 'Website', n: 'Website form' }, owner: 'amit', rule: 'r5', created: '2026-10-28 10:00', stage: 'optout',
  ev: [{ at: '2026-10-28 10:00', t: 'Filled the website form', p: 30 }, { at: '2026-11-02 12:15', t: 'Asked not to be called again', p: -30 }],
  att: [{ at: '2026-10-28 10:20', o: 'Connected' }, { at: '2026-11-02 12:15', o: 'Connected' }], con: { inq: '2026-10-28 10:00', via: 'the website form', wa: false, optout: '2026-11-02 12:15' } },
{ id: 'L12', no: 'LD-2610-0287', name: 'Mangesh Tawde', city: 'Pune', lang: 'Marathi', seg: 'prime', variant: 'resale', ask: 4500000, ten: 240, emp: 'Salaried', inc: 120000, obl: 0, prop: 'identified', propTxt: 'Flat in Erandwane',
  src: { t: 'DSA', n: 'Sahyadri Home Loans', code: 'DSA-0617' }, owner: 'amit', rule: 'r2', created: '2026-10-20 12:00', stage: 'lost',
  ev: [{ at: '2026-10-20 12:00', t: 'Registered by Sahyadri Home Loans', p: 15 }, { at: '2026-11-06 16:00', t: 'Took a sanction from another lender at 8.9%', p: -20 }],
  att: [{ at: '2026-10-20 15:00', o: 'Connected' }], con: { inq: '2026-10-20 12:00', via: 'a DSA form he signed', wa: true }, lost: { r: 'Chose another lender', at: '2026-11-06 16:00', recheck: '2027-05-06 10:00' } },
{ id: 'L13', no: 'LD-2610-0301', name: 'Siddharth Joglekar', city: 'Pune', lang: 'English', seg: 'prime', variant: 'resale', ask: 6000000, ten: 300, emp: 'Salaried', inc: 125000, obl: 0, prop: 'identified', propTxt: 'Flat in Baner: site visit booked on NestFinder',
  src: { t: 'Property portal', n: 'NestFinder' }, owner: 'amit', rule: 'r5', created: '2026-10-22 19:10', stage: 'nurture',
  ev: [{ at: '2026-10-22 19:10', t: 'Enquired on NestFinder', p: 30 }, { at: '2026-10-23 11:30', t: 'On the call: property not finalised', p: 5 }, { at: '2026-11-15 18:40', t: 'Booked a site visit for a Baner flat on NestFinder', p: 15 }],
  att: [{ at: '2026-10-23 11:30', o: 'Connected' }], con: { inq: '2026-10-22 19:10', via: 'NestFinder', wa: true, dca: true, dcaAt: '2026-10-23 11:32' }, trig: { k: 'prop', t: 'Booked a site visit for a Baner flat' }, wa: 'prop', waReply: 'Yes, send me the link',
  call: { sum: 'Visiting the Baner flat on Saturday. Asked for an eligibility check before the visit.', next: 'consent' } },
{ id: 'L14', no: 'LD-2611-0429', name: 'Ancy Thomas', city: 'Kochi', lang: 'Malayalam', seg: 'prime', variant: 'resale', ask: 3800000, ten: 240, emp: 'Salaried', inc: 88000, obl: 0, prop: 'identified', propTxt: 'Flat in Kakkanad',
  src: { t: 'Aggregator', n: 'Loanify' }, owner: 'divya', rule: 'r6', created: '2026-11-16 10:41', stage: 'new',
  ev: [{ at: '2026-11-16 10:41', t: 'Applied on Loanify', p: 30 }, { at: '2026-11-16 10:43', t: 'Opened the instant WhatsApp acknowledgement', p: 8 }],
  att: [], con: { inq: '2026-11-16 10:41', via: 'Loanify', wa: true } },
{ id: 'L15', no: 'LD-2611-0409', name: 'Joseph Mathew', city: 'Kochi', lang: 'Malayalam', seg: 'prime', variant: 'resale', ask: 6000000, ten: 300, emp: 'Salaried', inc: 150000, obl: 10000, prop: 'identified', propTxt: 'Villa in Kakkanad, price agreed',
  src: { t: 'Aggregator', n: 'Loanify' }, owner: 'divya', rule: 'r6', created: '2026-11-14 11:20', stage: 'contacted',
  ev: [{ at: '2026-11-14 11:20', t: 'Applied on Loanify', p: 30 }, { at: '2026-11-14 11:40', t: 'On the call: buying within 60 days', p: 20 }, { at: '2026-11-14 11:42', t: 'Agreed to meet a branch RM', p: 15 }, { at: '2026-11-15 18:00', t: 'Replied on WhatsApp with the property address', p: 20 }],
  att: [{ at: '2026-11-14 11:40', o: 'Connected' }], ho: { to: 'anoop', at: '2026-11-16 08:50' }, con: { inq: '2026-11-14 11:20', via: 'Loanify', wa: true } },
{ id: 'L16', no: 'LD-2611-0420', name: 'Manoj Verma', city: 'Jaipur', lang: 'Hindi', seg: 'prime', variant: 'resale', ask: 4500000, ten: 240, emp: 'Salaried', inc: 48000, obl: 6000, prop: 'identified', propTxt: 'Flat in Mansarovar',
  src: { t: 'Aggregator', n: 'Loanify' }, owner: 'sunita', rule: 'r6', created: '2026-11-14 12:10', stage: 'contacted',
  ev: [{ at: '2026-11-14 12:10', t: 'Applied on Loanify', p: 30 }, { at: '2026-11-14 12:30', t: 'On the call: buying within 90 days', p: 20 }, { at: '2026-11-14 12:31', t: 'Asked for a call on Monday at 12:00', p: 25 }, { at: '2026-11-16 09:05', t: 'Opened the eligibility guide on WhatsApp', p: 10 }],
  att: [{ at: '2026-11-14 12:30', o: 'Connected' }], next: { at: '2026-11-16 12:00', t: 'Callback he asked for', pref: true }, con: { inq: '2026-11-14 12:10', via: 'Loanify', wa: true }, wa: 'elig' },
{ id: 'L17', no: 'LD-2611-0401', name: 'Pooja Agarwal', city: 'Lucknow', lang: 'Hindi', seg: 'prime', variant: 'uc', ask: 5200000, ten: 300, emp: 'Salaried', inc: 105000, obl: 5000, prop: 'identified', propTxt: 'Booked a flat in a new project',
  src: { t: 'Website', n: 'Website form' }, owner: 'sunita', rule: 'r6', created: '2026-11-13 16:00', stage: 'contacted',
  ev: [{ at: '2026-11-13 16:00', t: 'Filled the website form', p: 30 }, { at: '2026-11-13 16:20', t: 'On the call: booked a flat, needs the loan by January', p: 20 }],
  att: [{ at: '2026-11-13 16:20', o: 'Connected' }], next: { at: '2026-11-14 17:00', t: 'Follow-up promised' }, con: { inq: '2026-11-13 16:00', via: 'the website form', wa: true } },
{ id: 'L18', no: 'LD-2611-0344', name: 'Ravi Choudhary', city: 'Indore', lang: 'Hindi', seg: 'prime', variant: 'resale', ask: 2800000, ten: 240, emp: 'Salaried', inc: 62000, obl: 0, prop: 'searching', propTxt: 'Still looking for a flat',
  src: { t: 'Website', n: 'Website form' }, owner: 'sunita', rule: 'r6', created: '2026-11-05 10:00', stage: 'nurture',
  ev: [{ at: '2026-11-05 10:00', t: 'Filled the website form', p: 30 }, { at: '2026-11-15 21:10', t: 'Back on the EMI calculator', p: 8 }],
  att: ['2026-11-05 10:20', '2026-11-05 17:40', '2026-11-06 12:10', '2026-11-07 18:20', '2026-11-09 11:00', '2026-11-10 16:30'].map(at => ({ at, o: 'No answer' })), con: { inq: '2026-11-05 10:00', via: 'the website form', wa: true }, trig: { k: 'web', t: 'Back on the EMI calculator last night' }, wa: 'web' },
{ id: 'L19', no: 'LD-2611-0386', name: 'Deepak Yadav', city: 'Gurugram', lang: 'Hindi', seg: 'prime', variant: 'resale', ask: 7000000, ten: 300, emp: 'Salaried', inc: 180000, obl: 12000, prop: 'identified', propTxt: 'Flat in Sector 57',
  src: { t: 'DSA', n: 'Capital Homes Advisory', code: 'DSA-0412' }, owner: 'rahul', rule: 'r2', created: '2026-11-12 10:00', stage: 'contacted',
  ev: [{ at: '2026-11-12 10:00', t: 'Registered by Capital Homes Advisory', p: 15 }, { at: '2026-11-12 11:00', t: 'On the call: comparing two lenders', p: 5 }, { at: '2026-11-14 15:30', t: 'Registered again by NCR Loan Desk', p: 10 }],
  att: [{ at: '2026-11-12 11:00', o: 'Connected' }], next: { at: '2026-11-13 16:00', t: 'Follow-up promised' }, conflict: { other: 'NCR Loan Desk', code: 'DSA-0533', at: '2026-11-14 15:30' }, con: { inq: '2026-11-12 10:00', via: 'a DSA form he signed', wa: true } },
{ id: 'L20', no: 'LD-2611-0428', name: 'Ritika Malhotra', city: 'Chandigarh', lang: 'Hindi', seg: 'prime', variant: 'resale', ask: 4200000, ten: 240, emp: 'Salaried', inc: 115000, obl: 0, prop: 'identified', propTxt: 'Flat in Sector 44',
  src: { t: 'Website', n: 'Website form' }, owner: null, rule: 'r6', unas: 'Sunita Rawat’s Hindi queue is over capacity, and no other Hindi agent is free', created: '2026-11-16 10:30', stage: 'new',
  ev: [{ at: '2026-11-16 10:30', t: 'Filled the website form', p: 30 }], att: [], con: { inq: '2026-11-16 10:30', via: 'the website form', wa: true } },
{ id: 'L21', no: 'LD-2611-0424', name: 'Arvind Reddy', city: 'Hyderabad', lang: 'Telugu', seg: 'prime', variant: 'uc', ask: 6500000, ten: 300, emp: 'Salaried', inc: 170000, obl: 0, prop: 'identified', propTxt: 'Flat in Gachibowli',
  src: { t: 'Aggregator', n: 'Loanify' }, owner: null, rule: 'r6', unas: 'No Telugu-speaking agent is on shift', created: '2026-11-16 09:58', stage: 'new',
  ev: [{ at: '2026-11-16 09:58', t: 'Applied on Loanify', p: 30 }, { at: '2026-11-16 09:59', t: 'Replied to the instant WhatsApp acknowledgement', p: 20 }], att: [], con: { inq: '2026-11-16 09:58', via: 'Loanify', wa: true } },
{ id: 'L22', no: 'LD-2611-0419', name: 'Lakshmi Narayanan', city: 'Chennai', lang: 'Tamil', seg: 'prime', variant: 'uc', ask: 5800000, ten: 300, emp: 'Salaried', inc: 140000, obl: 0, prop: 'identified', propTxt: 'Flat booked in Aarambh Greens',
  src: { t: 'Builder', n: 'Aarambh Developers, Aarambh Greens' }, owner: null, rule: 'r3', unas: 'Aarambh Greens is not mapped to an RM yet', created: '2026-11-15 17:00', stage: 'new',
  ev: [{ at: '2026-11-15 17:00', t: 'Met our desk at the project site', p: 30 }, { at: '2026-11-15 17:00', t: 'Booking amount paid', p: 20 }], att: [], con: { inq: '2026-11-15 17:00', via: 'a signed form at the project site', wa: true } }
];
let LL = [];
const LEADOWN = { N1: 'amit', N2: 'rahul', N3: 'anoop' };
const LEADSRC = { N1: { t: 'Walk-in', n: 'Pune Kothrud branch' }, N2: { t: 'DSA', n: 'Capital Homes Advisory', code: 'DSA-0412' }, N3: { t: 'DSA', n: 'Malabar Loan Point', code: 'DSA-0288' } };
const LEADRULE = { N1: 'r4', N2: 'r2', N3: 'r2' };
const XEV = { N2: [{ at: '2026-11-15 18:20', t: 'Opened the pre-screen result on WhatsApp', p: 15 }], N3: [{ at: '2026-11-14 10:10', t: 'Asked on WhatsApp why the offer is delayed', p: 10 }] };

/* ---------------- monthly figures for the manager's view (illustrative) ---------------- */
const MSRC = [
  { n: 'DSAs', leads: 640, sla: 91, elig: 301, login: 214, sanc: 151, cpl: 13400 },
  { n: 'Connectors', leads: 410, sla: 89, elig: 168, login: 109, sanc: 74, cpl: 8200 },
  { n: 'Builders', leads: 285, sla: 95, elig: 176, login: 132, sanc: 104, cpl: 3100 },
  { n: 'Website and ads', leads: 1920, sla: 84, elig: 312, login: 118, sanc: 71, cpl: 11400 },
  { n: 'Aggregators', leads: 1240, sla: 79, elig: 236, login: 84, sanc: 49, cpl: 14800 },
  { n: 'Walk-ins', leads: 205, sla: 100, elig: 118, login: 81, sanc: 58, cpl: null },
  { n: 'Referrals', leads: 96, sla: 97, elig: 61, login: 44, sanc: 35, cpl: 2200 },
  { n: 'Existing customers', leads: 180, sla: 96, elig: 133, login: 71, sanc: 63, cpl: 600 }
];
const MDSA = [
  { n: 'Sahyadri Home Loans', w: 'Pune', leads: 64, elig: 62, login: 27, ls: 81, conf: 2 },
  { n: 'HomeKey Advisors', w: 'Bengaluru', leads: 71, elig: 59, login: 29, ls: 79, conf: 3 },
  { n: 'Capital Homes Advisory', w: 'Gurugram', leads: 58, elig: 55, login: 22, ls: 77, conf: 9 },
  { n: 'Punjab Home Loans Point', w: 'Ludhiana', leads: 33, elig: 48, login: 11, ls: 73, conf: 4 },
  { n: 'Hadoti Finserv', w: 'Kota', leads: 27, elig: 37, login: 6, ls: 50, conf: 3 },
  { n: 'Malabar Loan Point', w: 'Kochi', leads: 41, elig: 31, login: 7, ls: 57, conf: 6 }
];
const MTEAM = { amit: [46, 89, 41, 9], shweta: [52, 94, 49, 13], rahul: [61, 71, 50, 8], farida: [38, 92, 36, 10], anoop: [29, 83, 27, 6], divya: [412, 88, 361, 31], sunita: [466, 79, 389, 29] };
const MLOST = [['Lower rate elsewhere', 31], ['Not eligible', 24], ['Property not finalised', 18], ['Unreachable after 6 attempts', 15], ['Stopped responding', 12]];
const MAGE = [['0 to 2 days', 46], ['3 to 7 days', 28], ['8 to 30 days', 19], ['Over 30 days', 7]];

/* ---------------- calling window, first-call targets ---------------- */
function inWin(t) { const d = P(t), h = d.getHours() + d.getMinutes() / 60; return d.getDay() !== 0 && h >= 9.5 && h < 19; }
function nextOpen(t) {
  const d = new Date(P(t).getTime());
  for (let k = 0; k < 9; k++) {
    const h = d.getHours() + d.getMinutes() / 60;
    if (d.getDay() !== 0 && h < 9.5) { d.setHours(9, 30, 0, 0); return d; }
    if (d.getDay() !== 0 && h < 19) return d;
    d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0);
  }
  return d;
}
function firstDue(x) {
  if (x.src.t === 'Existing customer') return null;
  const o = nextOpen(x.created);
  if (DIGI.includes(x.src.t)) return new Date(o.getTime() + 5 * 60000);
  const e = new Date(o.getTime()); e.setHours(19, 0, 0, 0); return e;
}

/* ---------------- fit, intent, callability ---------------- */
function fitDeclared(seg, ask, ten, inc, obl, prop, propTxt, emp) {
  const parts = [], rate = seg === 'prime' ? 9.4 : 11.5, emi = emiCalc(ask, rate, ten), fo = (emi + (obl || 0)) / inc * 100, it = inr(inc) + ' a month';
  if (fo <= 45) parts.push({ t: 'Declared income of ' + it + ' covers the EMI: FOIR about ' + Math.round(fo) + '%', p: 20 });
  else if (fo <= 55) parts.push({ t: 'Declared income of ' + it + ' is tight: FOIR about ' + Math.round(fo) + '%', p: 10 });
  else if (fo <= 65) parts.push({ t: 'FOIR of about ' + Math.round(fo) + '% is over the cap', p: -8 });
  else parts.push({ t: 'The amount asked needs FOIR of about ' + Math.round(fo) + '%, far over the cap', p: -22 });
  const PR = { apf: 12, identified: 6, plot: 6, searching: -6 }[prop];
  parts.push({ t: propTxt, p: PR });
  const EM = { 'Salaried': ['Salaried, with documented income', 6], 'Self-employed, ITR': ['Self-employed, files ITRs', 2], 'Self-employed, informal': ['Informal income: needs a personal discussion', -2] }[emp] || ['Salaried, with documented income', 6];
  parts.push({ t: EM[0], p: EM[1] });
  return { v: clamp(50 + sum(parts, y => y.p), 5, 95), parts, basis: 'declared', emi, fo, est: Math.max(0, floor10k(loanFor(0.5 * inc - (obl || 0), rate, ten))) };
}
function fitL(x) {
  if (x.book) { const parts = [{ t: x.book.emis + ' EMIs paid on time on loan ' + x.book.loan, p: 30 }, { t: 'A top-up of up to ' + lakh(x.book.topup) + ' fits within the LTV cap', p: 12 }]; return { v: clamp(50 + 42, 5, 95), parts, basis: 'book', est: x.book.topup }; }
  return fitDeclared(x.seg, x.ask, x.ten, x.inc, x.obl, x.prop, x.propTxt, x.emp);
}
function intentOf(ev, att) {
  let s = 0; const items = [];
  ev.forEach(e => { const d = Math.max(0, (CLK - P(e.at)) / 86400000), v = e.p * Math.pow(0.9, d); s += v; items.push(Object.assign({ v }, e)); });
  (att || []).filter(a => a.o === 'No answer').forEach(a => { const d = Math.max(0, (CLK - P(a.at)) / 86400000), v = -3 * Math.pow(0.9, d); s += v; items.push({ at: a.at, t: 'Call not answered', p: -3, v }); });
  items.sort((a, b) => P(b.at) - P(a.at));
  return { v: clamp(Math.round(s), 0, 100), items };
}
function cellOf(f, i) { return (f >= 70 ? 'H' : f >= 45 ? 'M' : 'L') + (i >= 55 ? 'H' : i >= 25 ? 'M' : 'L'); }
const CELL = { HH: ['Hot', 'Call now', 'hot'], MH: ['Hot', 'Re\u00ADstructure', 'hot'], HM: ['Warm', 'Convert', 'warm'], MM: ['Warm', 'Qualify', 'warm'], HL: ['Cold', 'Re-engage', 'cold'], ML: ['Cold', 'Nurture', 'cold'], LH: ['Not eligible yet', 'Counsel', 'low'], LM: ['Low fit', 'Park', 'low'], LL: ['Low fit', 'Archive', 'low'] };
function cellLbl(k) { const c = CELL[k]; return c[2] === 'low' ? c[1] : c[0] + ': ' + lc1(c[1]); }
function tempTxt(v) { return v.call.st === 'no' ? 'Do not contact' : cellLbl(v.cell); }
function tchip(v) { const k = v.call.st === 'no' ? 'low' : CELL[v.cell][2]; return `<span class="tc ${k}" title="${esc('Fit ' + v.fit.v + ', intent ' + v.intent.v)}">${esc(tempTxt(v))}</span>`; }
function callOf(x) {
  const c = x.con || {}, now = CLK, checks = [];
  const applicant = !!(c.bureau || c.aa) || x.stage === 'docs' || x.stage === 'prescreened';
  const purpose = applicant ? 'service' : 'offer';
  let basis;
  if (applicant) basis = { ok: true, t: 'Has applied: calls about the application are service calls', s: 'applicant' };
  else if (c.dca) basis = { ok: true, t: (c.rel ? 'Existing customer. ' : '') + 'Consent to calls on record' + (c.dcaAt ? ' since ' + fdate(c.dcaAt) : ''), s: 'consent on record' };
  else if (c.inq && (now - P(c.inq)) <= 7 * 86400000) basis = { ok: true, t: 'Inquiry through ' + c.via + ', ' + fdt(c.inq) + '. Valid until ' + fds(addDays(c.inq, 7)), s: 'inquiry ' + (sameDay(c.inq, now) ? 'today' : agoDays(c.inq)) };
  else basis = { ok: false, t: c.inq ? 'The inquiry of ' + fds(c.inq) + ' is over 7 days old, and there is no consent to calls on record' : 'No inquiry or consent to calls on record' };
  checks.push({ ok: basis.ok, t: 'A basis to call', s: basis.t });
  const opt = !c.optout; checks.push({ ok: opt, t: 'Not opted out', s: opt ? 'No opt-out on record' : 'Opted out ' + fdt(c.optout) });
  const win = inWin(now); checks.push({ ok: win, t: 'Inside the calling hours', s: 'The lender calls 9:30 to 19:00, Monday to Saturday' });
  const pref = !!(x.next && x.next.pref && !x.next.done && P(x.next.at) > now); checks.push({ ok: !pref, t: 'The customer\u2019s preferred time', s: pref ? 'Asked for a call at ' + ftime(x.next.at) : 'None requested' });
  const today = (x.att || []).filter(a => sameDay(a.at, now)).length; checks.push({ ok: today < 3, t: 'Fewer than 3 attempts today', s: today + ' of 3 today' });
  const cli = purpose === 'service' ? { n: '1600 12 3456', k: '1600 series, for calls about an application' } : { n: '140 00 12345', k: '140 series, for offers' };
  let st, t, why;
  if (!opt) { st = 'no'; t = 'Do not contact'; why = 'Opted out ' + fds(c.optout); }
  else if (!basis.ok) { if (c.wa) { st = 'msg'; t = 'WhatsApp only'; why = basis.t; } else { st = 'no'; t = 'Do not contact'; why = basis.t; } }
  else if (!win) { st = 'later'; t = 'Call from 9:30'; why = 'Outside the calling hours'; }
  else if (pref) { st = 'later'; t = 'Call at ' + ftime(x.next.at); why = 'The customer asked for ' + ftime(x.next.at); }
  else if (today >= 3) { st = 'later'; t = 'Call tomorrow'; why = 'Three attempts already today'; }
  else { st = 'now'; t = 'Callable'; why = basis.t; }
  return { st, t, why, short: st === 'now' ? 'Callable: ' + basis.s : t, bs: basis.ok ? basis.s : (c.inq ? 'Inquiry over 7 days old' : 'No inquiry or consent'), checks, cli, purpose };
}
function agoDays(at) { const n = Math.max(1, Math.round((CLK - P(at)) / 86400000)); return plural(n, 'day') + ' ago'; }
function cbadge(cl) { return `<span class="cbg ${cl.st}" title="${esc(cl.why)}">${esc(cl.short)}</span>`; }

/* ---------------- one view of every lead: sample leads and live lead files ---------------- */
function lvL(x) {
  const fit = fitL(x), intent = intentOf(x.ev, x.att), call = callOf(x);
  const v = { kind: 'light', id: x.id, x, name: x.name, no: x.no, city: x.city, lang: x.lang, seg: x.seg, variant: x.variant, ask: x.ask, src: x.src, owner: x.owner, rule: x.rule, unas: x.unas, created: x.created, stage: x.stage, fit, intent, cell: cellOf(fit.v, intent.v), call, att: x.att || [], next: x.next, book: x.book, visit: x.visit, trig: x.trig, ho: x.ho, conflict: x.conflict, lost: x.lost, con: x.con, docs: x.docs };
  v.open = !['lost'].includes(x.stage); v.sla = slaOf(v); v.nba = nbaOf(v); v.exc = excOf(v);
  return v;
}
function lvC(c, i) {
  const L = c.lead, id = c.id, pre = L.pre, preDocs = c.docs.filter(d => d.need === 'pre'), up = preDocs.filter(d => d.up);
  const ev = [{ at: L.created, t: LEADSRC[id] && LEADSRC[id].t === 'DSA' ? 'Registered by ' + LEADSRC[id].n : 'Walked into the branch', p: LEADSRC[id] && LEADSRC[id].t === 'DSA' ? 15 : 30 }];
  if (up.length) ev.push({ at: up.map(d => d.up.at).sort()[0], t: 'Shared ' + plural(up.length, 'document'), p: 25 });
  if (L.consent) ev.push({ at: L.consent.at, t: 'Gave consent for the credit report and bank data', p: 25 });
  (XEV[id] || []).forEach(e => ev.push(e));
  let fit;
  if (pre) { const p = { yes: 38, change: 10, no: -32 }[pre.res], t = { yes: 'Pre-screen: eligible up to ' + lakh(pre.max), change: 'Pre-screen: eligible with changes', no: 'Pre-screen: not eligible' }[pre.res]; fit = { v: 50 + p, parts: [{ t, p }], basis: 'pre-screen', est: pre.max }; }
  else { const inc = sum(c.apps.filter(a => a.earning), a => a.incDecl || 0); fit = fitDeclared(c.seg, c.v.applied.loan, c.v.applied.tenure, inc || 1, 0, 'identified', 'Property identified: ' + lc1(c.prop.kind) + ' in ' + L.city, c.apps[0].emp === 'Salaried' ? 'Salaried' : 'Self-employed, ITR'); }
  const intent = intentOf(ev, []);
  const stage = pre ? 'prescreened' : (L.consent || up.length ? 'consent' : 'new');
  const x = { con: { inq: L.created, via: 'the lead form', wa: true, bureau: L.consent ? L.consent.at : null, aa: L.consent ? L.consent.at : null }, stage, att: [], next: null };
  const call = callOf(x);
  const v = { kind: 'case', i, c, id, name: caseName(c), no: c.v.appNo, city: L.city, lang: c.lang === 'hi' ? 'Hindi' : 'English', seg: c.seg, variant: c.variant, ask: c.v.loan, src: LEADSRC[id] || { t: 'DSA', n: L.by }, owner: L.owner, rule: LEADRULE[id] || 'r2', created: L.created, stage, fit, intent, cell: cellOf(fit.v, intent.v), call, att: [], next: null, con: x.con, ev };
  v.open = true; v.sla = slaOf(v); v.nba = nbaOf(v); v.exc = excOf(v);
  return v;
}
function allLeads() {
  const out = LL.map(lvL);
  CASES.forEach((c, i) => { if (c.lead && !c.lead.in && !c.lead.hidden && !(c.w.dec && c.w.dec.k === 'declined')) out.push(lvC(c, i)); });
  return out;
}
function slaOf(v) {
  if (['lost', 'optout'].includes(v.stage)) return { t: v.stage === 'lost' ? 'Closed' : 'Opted out', s: v.stage === 'lost' ? fds(v.lost.at) : fds(v.con.optout), k: '' };
  if (v.kind === 'light' && v.stage === 'new' && !v.att.length) {
    const d = firstDue(v);
    if (!d) return { t: 'Day ' + (wdLate(v.created, S8(CLK)) + 1), s: 'Campaign lead', k: '' };
    const m = Math.round((d - CLK) / 60000);
    const tg = DIGI.includes(v.src.t) ? '5-minute target' : 'Same-day target';
    return m >= 0 ? { t: m < 1 ? 'Due now' : m <= 120 ? 'Call in ' + dur(m) : 'Call by ' + ftime(S8(d)), s: tg, k: m <= 10 ? 'due' : '' } : { t: dur(m) + ' late', s: tg, k: 'late' };
  }
  if (v.next && !v.next.done) { const d = P(v.next.at), m = Math.round((d - CLK) / 60000); return m >= 0 ? { t: 'Due ' + (sameDay(d, CLK) ? ftime(v.next.at) : fds(v.next.at)), s: v.next.t, k: m <= 30 ? 'due' : '' } : { t: 'Overdue', s: 'Since ' + (sameDay(d, CLK) ? ftime(v.next.at) : fds(v.next.at) + ', ' + ftime(v.next.at)), k: 'late' }; }
  if (v.visit && !v.visit.done && sameDay(v.visit.at, CLK)) return { t: 'Visit ' + ftime(v.visit.at), s: 'Today', k: '' };
  return { t: 'Day ' + (wdLate(v.created, S8(CLK)) + 1), s: 'Since the lead', k: '' };
}
function excOf(v) {
  const E2 = [];
  if (!v.open || v.stage === 'optout') return v.call && v.call.st === 'no' ? ['blocked'] : [];
  if (!v.owner) E2.push('unassigned');
  if (v.owner && v.kind === 'light' && v.stage === 'new' && !v.att.length) { const d = firstDue(v); if (d && d < CLK) E2.push('sla'); }
  if (v.next && !v.next.done && P(v.next.at) < CLK) E2.push('overdue');
  if (v.ho && !v.ho.acc && (CLK - P(v.ho.at)) > 2 * 3600000) E2.push('handoff');
  if (v.conflict && !v.conflict.res) E2.push('conflict');
  if (v.call && ['msg', 'no'].includes(v.call.st)) E2.push('blocked');
  return E2;
}
function nbaOf(v) {
  const cl = v.call, own = v.owner && TEAM[v.owner];
  if (v.stage === 'lost') return { t: 'Closed: ' + lc1(v.lost.r), s: v.lost.recheck ? 'Balance-transfer check on ' + fdate(v.lost.recheck) : '' };
  if (v.stage === 'optout' || cl.st === 'no') return { t: 'Do not contact', s: cl.why };
  if (!v.owner) return { t: 'Assign an owner', s: v.unas || 'No routing rule matched' };
  if (v.ho && !v.ho.acc) return { t: 'Hand-off to ' + TEAM[v.ho.to].n + ' not accepted', s: 'Sent ' + agoTxt(v.ho.at) };
  if (v.kind === 'case') {
    const L = v.c.lead;
    if (L.pre) return L.pre.res === 'yes' ? { t: 'Log in the file', s: 'Pre-screen: eligible up to ' + lakh(L.pre.max) } : L.pre.res === 'change' ? { t: 'Call with the fix', s: 'Works at ' + lakh((prescreenOf(v.c).cure || { apply: { loan: v.ask } }).apply.loan) + ', or with an earning co-applicant' } : { t: 'Close and send the reasons', s: 'Pre-screen: not eligible' };
    return { t: 'Collect documents and consent', s: 'The pre-screen runs as soon as both are in' };
  }
  if (v.stage === 'new' && !v.att.length) return { t: cl.st === 'msg' ? 'Send a WhatsApp' : 'Make the first call', s: v.sla.k === 'late' ? 'First-call target missed' : 'Within the first-call target' };
  if (v.visit && !v.visit.done && sameDay(v.visit.at, CLK)) return { t: 'Visit at ' + ftime(v.visit.at), s: v.visit.t };
  if (v.next && !v.next.done && P(v.next.at) < CLK) return { t: 'Follow up: overdue', s: v.next.t + ', ' + fds(v.next.at) + ' ' + ftime(v.next.at) };
  if (v.stage === 'consent') return { t: 'Help finish the consent', s: 'Link sent ' + agoTxt(v.con.link) };
  if (v.stage === 'docs') return { t: 'Chase the documents', s: (v.docs ? v.docs.in + ' of ' + v.docs.of + ' in; still needed: ' + v.docs.miss : 'Documents pending') };
  if (v.next && !v.next.done && cl.st === 'later') return { t: 'Call at ' + ftime(v.next.at), s: v.next.t };
  const e = v.fit.est;
  switch (v.cell) {
    case 'HH': return { t: 'Call now, then send the consent link', s: 'Lendable and keen' };
    case 'MH': return { t: 'Call with a fix', s: 'Works at about ' + lakh(e) + ', or with an earning co-applicant' };
    case 'HM': return { t: 'Call with the eligibility estimate', s: 'About ' + lakh(Math.min(e, Math.max(e, v.ask))) + ' looks possible on the declared income' };
    case 'MM': return { t: 'Qualify: income and property details', s: 'Fit firms up after the pre-screen' };
    case 'HL': return v.trig && !v.trig.done ? { t: 'Re-engage: ' + lc1(v.trig.t), s: cl.st === 'msg' ? 'WhatsApp only' : 'Call or WhatsApp' } : { t: 'Re-engage: monthly check-in', s: 'Lendable, gone quiet' };
    case 'ML': return { t: v.att.length >= 4 && v.att.length < 6 ? 'Try again: attempt ' + (v.att.length + 1) + ' of 6' : 'Nurture: monthly message', s: v.att.length >= 6 ? '6 attempts without an answer' : 'Low intent' };
    case 'LH': return { t: 'Counsel: explain what would work', s: 'About ' + lakh(e) + ' on this income, or add a co-applicant' };
    case 'LM': return { t: 'Park: send the eligibility guide', s: 'Low fit' };
  }
  return { t: 'Archive after 30 days without activity', s: 'Low fit and low intent' };
}
function prio(v) {
  let p = 0;
  if (v.sla.k === 'late' && v.stage === 'new' && !v.att.length) p += 1200; else if (v.sla.k === 'due') p += 900;
  if (v.next && !v.next.done && P(v.next.at) <= CLK) p += 800;
  p += { HH: 500, MH: 460, HM: 300, MM: 200, LH: 150, HL: 120, ML: 60, LM: 20, LL: 0 }[v.cell];
  if (v.stage === 'new' && !v.att.length) p += 100;
  if (v.stage === 'docs') p += 40;
  return p + v.fit.v * 0.3 + v.intent.v * 0.3;
}
const mine = v => S.role === 'sales' ? v.owner === 'amit' : true;
function needL(v) {
  if (!v.open) return false;
  if (S.role === 'sales') {
    if (v.owner !== 'amit' || v.call.st === 'no') return false;
    if (v.kind === 'case') return true;
    if (v.sla.k === 'late' || v.sla.k === 'due') return true;
    if (v.next && !v.next.done && sameDay(v.next.at, CLK)) return true;
    if (v.visit && !v.visit.done && sameDay(v.visit.at, CLK)) return true;
    return v.call.st === 'now' && ['HH', 'MH', 'HM'].includes(v.cell);
  }
  if (S.role === 'sm') return v.exc.some(e => e !== 'blocked');
  return false;
}
function callNow(L) { return L.filter(v => v.open && mine(v) && v.call.st === 'now' && (['HH', 'MH', 'HM', 'MM', 'LH'].includes(v.cell) || (v.stage === 'new' && !v.att.length) || (v.next && !v.next.done && P(v.next.at) <= CLK) || ['consent', 'docs'].includes(v.stage))).sort((a, b) => prio(b) - prio(a)); }

/* ---------------- dashboards ---------------- */
const LF = {
  cell: (v, k) => v.open && mine(v) && v.call.st !== 'no' && v.cell === k,
  callnow: v => callNow([v]).length > 0,
  held: v => v.open && mine(v) && ['later', 'msg', 'no'].includes(v.call.st),
  fu: v => v.open && mine(v) && v.next && !v.next.done && sameDay(v.next.at, CLK) || (v.open && mine(v) && v.next && !v.next.done && P(v.next.at) < CLK),
  first: v => v.open && mine(v) && v.kind === 'light' && v.stage === 'new' && !v.att.length && !!firstDue(v),
  cust: v => v.open && mine(v) && ['consent', 'docs'].includes(v.stage),
  visit: v => v.open && mine(v) && v.visit && !v.visit.done && sameDay(v.visit.at, CLK),
  trig: v => v.open && mine(v) && v.trig && !v.trig.done && ['HL', 'ML'].includes(v.cell),
  exc: (v, k) => v.exc.includes(k),
  mine: v => mine(v) && v.open
};
function lfMatch(v) { const f = S.lf; return f ? LF[f.k](v, f.v) : true; }
function dayLine() { const d = CLK; return DAYN[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()] + ', ' + ftime(S8(d)); }
function cnRow(v) {
  const act = v.kind === 'case' ? `<button class="btn btn-s btn-sm" data-act="open" data-v="${v.i}">Open</button>` : `<button class="btn btn-p btn-sm" data-act="lcall" data-v="${v.id}">${ic('phone')}Call</button>`;
  const why = [v.nba.t + (v.nba.s ? ': ' + lc1(v.nba.s) : '')];
  return `<div class="cn-r"><div class="cn-m"><div class="cn-t">${tchip(v)}<button class="cn-n" data-act="${v.kind === 'case' ? 'open' : 'lopen'}" data-v="${v.kind === 'case' ? v.i : v.id}">${esc(v.name)}</button><span class="cn-amt">${esc(lakhS(v.ask))}</span></div>
  <p class="cn-why">${esc(why[0])}</p><div class="cn-meta">${cbadge(v.call)}${v.sla.k ? `<span class="slat ${v.sla.k}">${esc(v.sla.t)}</span>` : ''}<span>${esc(v.lang)}</span></div></div>
  <div class="cn-a">${act}${v.kind === 'light' && v.con && v.con.wa ? `<button class="ibtn" data-act="lwa" data-v="${v.id}" title="WhatsApp ${esc(v.name.split(' ')[0])}" aria-label="WhatsApp ${esc(v.name.split(' ')[0])}">${ic('chat')}</button>` : ''}</div></div>`;
}
function tGrid(L, scopeTxt, extra) {
  const F = ['H', 'M', 'L'], FL = { H: 'High', M: 'Medium', L: 'Low' }, cnt = k => L.filter(v => LF.cell(v, k)).length, tot = sum(F.map(f => sum(F.map(i => cnt(f + i)))));
  const head = '<span></span>' + F.map(i => `<span class="tg-x">${FL[i]} intent</span>`).join('');
  const rows = F.map(f => `<span class="tg-y">${FL[f]}<br>fit</span>` + F.map(i => { const k = f + i, n = cnt(k), c = CELL[k], on = !!(S.lf && S.lf.k === 'cell' && S.lf.v === k); return `<button class="tg-c ${c[2]}${n ? '' : ' z'}${on ? ' on' : ''}" data-act="lf" data-v="cell|${k}|${esc(cellLbl(k))}" aria-pressed="${on}" aria-label="${esc(FL[f] + ' fit and ' + FL[i].toLowerCase() + ' intent: ' + plural(n, 'lead') + ', ' + lc1(c[1]))}"><b>${n}</b><span>${esc(c[1])}</span></button>`; }).join('')).join('');
  const dnc = L.filter(v => v.open && mine(v) && v.call.st === 'no').length;
  return `<section class="panel"><div class="ph"><h3>Where ${scopeTxt} sit</h3><span class="note">${plural(tot, 'open lead')}</span></div><div class="pb"><div class="tgrid">${head}${rows}</div><p class="hint">Fit: can we lend, from the pre-screen or the declared details. Intent: are they trying to borrow now, from what they did and how recently.${dnc ? ' Not shown: ' + plural(dnc, 'lead') + ' who opted out.' : ''}</p>${extra || ''}</div></section>`;
}
function rmDash(L) {
  const my = L.filter(v => mine(v)), list = callNow(L), top = list.slice(0, 5), held = my.filter(LF.held);
  const hc = { later: 0, msg: 0, no: 0 }; held.forEach(v => hc[v.call.st]++);
  const fu = my.filter(LF.fu), fuLate = fu.filter(v => P(v.next.at) < CLK).length, first = my.filter(LF.first), firstLate = first.filter(v => v.sla.k === 'late').length, cust = my.filter(LF.cust), vis = my.filter(LF.visit), trig = my.filter(LF.trig);
  const nC = cust.filter(v => v.stage === 'consent').length, nD = cust.filter(v => v.stage === 'docs').length;
  const tile = (k, n, l, s, tone) => { const on = !!(S.lf && S.lf.k === k); return `<button class="tl2${tone ? ' ' + tone : ''}${on ? ' on' : ''}" data-act="lf" data-v="${k}||${esc(l)}" aria-pressed="${on}"><b>${n}</b><span>${esc(l)}</span><small>${esc(s)}</small></button>`; };
  const M = [['Leads', 46], ['Contacted', 41], ['Pre-screen', 19], ['Logged in', 9]];
  const funnel = `<div class="ins-k fs-k">This month, 1 to 16 Nov<span>Login target: 12</span></div><div class="fstrip">${M.map(([l, n], i) => `<div><b>${n}</b><span>${l}</span>${i ? `<small>${Math.round(n / M[i - 1][1] * 100)}%</small>` : ''}</div>`).join('')}</div><p class="hint">Each percentage is of the step before.</p>`;
  const rg = v => `<div class="rg"><span class="rg-i">${ic({ rate: 'scale', topup: 'home', prop: 'pin', web: 'eye' }[v.trig.k] || 'bell')}</span><button class="rg-t" data-act="lopen" data-v="${v.id}"><b>${esc(v.trig.t)}</b><small>${esc(v.name + (v.call.st === 'msg' ? ', WhatsApp only' : ''))}</small></button><button class="btn btn-s btn-sm" data-act="${v.call.st === 'now' ? 'lcall' : 'lwa'}" data-v="${v.id}">${v.call.st === 'now' ? 'Call' : 'WhatsApp'}</button></div>`;
  return `<div class="ldash">
  <section class="panel"><div class="ph"><h3>Call now</h3><span class="note">${plural(list.length, 'callable lead')}, by priority</span>${list.length > 5 ? `<button class="lnk act" data-act="lf" data-v="callnow||Call now">All ${list.length}</button>` : ''}</div><div class="pb cn">${top.map(cnRow).join('') || '<p class="muted">Nothing to call right now.</p>'}</div>${held.length ? `<button class="heldb" data-act="lf" data-v="held||Held back">${ic('lock')}<span>Held back: ${esc(listAnd([hc.later ? hc.later + ' for later' : '', hc.msg ? hc.msg + ' WhatsApp only' : '', hc.no ? hc.no + ' opted out' : '']))}</span>${ic('chev', 'chev')}</button>` : ''}</section>
  ${tGrid(L, 'your leads', funnel)}
  <section class="panel"><div class="ph"><h3>Today</h3></div><div class="pb"><div class="tl2s">${tile('fu', fu.length, 'Follow-ups', fuLate ? fuLate + ' overdue' : fu.length ? 'Next at ' + ftime(fu.map(v => v.next.at).sort()[0]) : 'None due', fuLate ? 'late' : '')}${tile('first', first.length, 'First calls', firstLate ? firstLate + ' past the target' : first.length ? 'All within target' : 'None waiting', firstLate ? 'late' : '')}${tile('cust', cust.length, 'With the customer', listAnd([nC ? plural(nC, 'consent link') : '', nD ? plural(nD, 'document request') : '']) || 'Nothing pending')}${tile('visit', vis.length, 'Visits', vis.length ? ftime(vis[0].visit.at) + ', ' + vis[0].name.split(' ')[0] : 'None today')}</div>
  <div class="ins-k" style="margin:16px 0 2px">Cold but lendable, with a fresh reason</div>${trig.map(rg).join('') || '<p class="muted" style="margin:4px 0">None today.</p>'}</div></section></div>`;
}
const EXC = [['unassigned', 'Unassigned', 'No routing rule matched'], ['sla', 'First call missed', 'Past the first-call target'], ['overdue', 'Follow-ups overdue', 'Promised and not done'], ['handoff', 'Hand-offs waiting', 'Not accepted within 2 hours'], ['conflict', 'DSA ownership conflicts', 'Two partners, one customer'], ['blocked', 'Can’t be called', 'No basis, or opted out']];
function excSub(L, k) {
  const X = L.filter(v => v.exc.includes(k)); if (!X.length) return '';
  if (k === 'sla') return 'Worst: ' + dur(Math.max(...X.map(v => (CLK - firstDue(v)) / 60000))) + ' late';
  if (k === 'overdue') return 'Oldest since ' + fds(X.map(v => v.next.at).sort()[0]);
  if (k === 'unassigned') return listAnd([...new Set(X.map(v => v.lang))]) + ' speakers';
  if (k === 'handoff') return 'Waiting ' + dur(Math.max(...X.map(v => (CLK - P(v.ho.at)) / 60000)));
  if (k === 'conflict') return listAnd(X.map(v => v.name));
  if (k === 'blocked') { const m = X.filter(v => v.call.st === 'msg').length; return listAnd([m ? m + ' WhatsApp only' : '', X.length - m ? (X.length - m) + ' opted out' : '']); }
  return '';
}


/* ---------------- table rows for leads ---------------- */
const STAGEL = { new: 'New', contacted: 'Contacted', consent: 'Consent link sent', docs: 'Documents pending', nurture: 'Nurture', optout: 'Opted out', lost: 'Lost', prescreened: 'Pre-screened' };
function callLine(v) { const c = v.call; if (v.stage === 'lost') return 'Closed ' + fds(v.lost.at); if (c.st === 'now') return c.short; if (c.st === 'later') return c.why; return c.t + ': ' + lc1(c.why); }
function plRowL(v, me) {
  const ow = v.owner ? TEAM[v.owner] : null, cs = v.kind === 'case';
  let stg, sub;
  if (cs) { const L = v.c.lead; stg = L.pre ? 'Pre-screen' : 'Lead'; sub = L.pre ? { yes: 'Eligible up to ' + lakh(L.pre.max), change: 'Eligible with changes', no: 'Not eligible' }[L.pre.res] : L.consent ? 'Consent given' : 'Documents and consent'; }
  else { stg = v.stage === 'lost' ? 'Closed' : 'Lead'; sub = v.stage === 'new' && v.att.length ? 'Not reached: ' + plural(v.att.length, 'attempt') : STAGEL[v.stage]; }
  const partner = ['DSA', 'Connector'].includes(v.src.t);
  const own = ow ? { n: ow.n, r: v.ho && !v.ho.acc ? 'Handing off to ' + TEAM[v.ho.to].n : partner ? 'Via ' + v.src.n : ow.r + ', ' + ow.w } : { n: 'Unassigned', r: v.unas || 'No rule matched' };
  const act = cs ? `data-act="open" data-v="${v.i}"` : `data-act="lopen" data-v="${v.id}"`;
  const srcl = v.src.t === 'Existing customer' ? 'Existing customer' : v.src.t + ': ' + v.src.n, cl = callLine(v);
  return `<button class="pl-row${me ? ' mine' : ''}" ${act}>
  <span class="pl-a"><b title="${esc(v.name)}">${esc(v.name)}</b><small title="${esc(srcl + ', ' + v.city)}">${esc(srcl)}, ${esc(v.city)}</small></span>
  <span class="pl-l"><b>${esc(lakh(v.ask))}</b><small title="${esc((LVAR[v.variant] || VARS[v.variant]) + ', ' + v.seg)}">${esc(LVAR[v.variant] || VARS[v.variant])}, ${v.seg}</small></span>
  <span class="pl-s"><b>${stg}</b><small title="${esc(sub)}">${esc(sub)}</small></span>
  <span class="pl-w${v.sla.k === 'late' ? ' late' : ''}"><b title="${esc(v.nba.t)}">${esc(v.nba.t)}</b><small title="${esc(cl)}">${esc(cl)}</small></span>
  <span class="pl-r">${tchip(v)}<small>Fit ${v.fit.v}, intent ${v.intent.v}</small></span>
  <span class="pl-h"><span class="mini-av${ow ? '' : ' un'}">${esc(ow ? inits(ow.n) : '?')}</span><span><b title="${esc(own.n)}">${esc(own.n)}</b><small title="${esc(own.r)}">${esc(own.r)}</small></span></span>
  <span class="pl-t${v.sla.k === 'late' ? ' late' : v.sla.k === 'due' ? ' due' : ''}"><b>${esc(v.sla.t)}</b><small title="${esc(v.sla.s)}">${esc(v.sla.s)}</small></span></button>`;
}

/* ---------------- pipeline page: dashboard on top, table below ---------------- */
function creditKpis(rows) {
  const logged = rows.filter(r => !(r.c.lead && !r.c.lead.in)), open = rows.filter(r => !['approved', 'declined'].includes(r.ev.st.k)), past = open.filter(r => r.t.late).length;
  const repOut = rows.filter(r => r.c.tasks.some(t => t.st === 'assigned' || t.st === 'query')).length, repLate = rows.filter(r => r.c.tasks.some(t => tState(t) === 'late')).length;
  const chkN = sum(logged, r => ['approved', 'declined'].includes(r.ev.st.k) ? 0 : openChecks(r.c).length), chkF = logged.filter(r => !['approved', 'declined'].includes(r.ev.st.k) && openChecks(r.c).length).length;
  const sanc = rows.filter(r => r.ev.st.k === 'approved'), sys = sanc.filter(r => r.ev.st.by === 'SYS').length;
  const days = sanc.filter(r => r.c.w.dec).map(r => wdLate(r.c.v.login, r.c.w.dec.at) + 1).sort((a, b) => a - b);
  const med = days.length ? (days.length % 2 ? days[(days.length - 1) / 2] : (days[days.length / 2 - 1] + days[days.length / 2]) / 2) : null;
  const meN = rows.filter(r => r.me).length, met = (l, v, s) => `<div class="met"><div class="met-l">${l}</div><div class="met-v">${v}</div><div class="met-s">${s}</div></div>`;
  const meSub = { cm: 'Decisions, checks and late reports', ap: 'Referred at or below ' + S.lvl, pol: 'Nothing to act on here', adm: 'Read only for the admin' }[S.role];
  return `<div class="kpis k6">${met('Needs you', meN, meSub)}${met('Open files', open.length, past ? plural(past, 'file') + ' past the target' : 'All within target')}${met('Waiting on outside reports', repOut, repLate ? plural(repLate, 'report') + ' late' : 'None late')}${met('Open checks', chkN, chkN ? 'On ' + plural(chkF, 'file') : 'Nothing to check')}${met('Sanctioned', sanc.length, sys + ' by the system on its own')}${met('Login to sanction', med != null ? trimz(med.toFixed(1)) + ' <small class="of">days</small>' : DASH, 'Median, working days')}</div>`;
}
function boardHTML3() {
  const sales = ['sales', 'sm'].includes(S.role);
  const cases = CASES.map((c, i) => ({ c, i, ev: fullEval(c) })).filter(r => !(r.c.lead && r.c.lead.hidden));
  cases.forEach(r => { r.me = needsMe2(r.c, r.ev); r.b = bk2(r.c, r.ev.st); r.t = tatOf(r.c, r.ev); });
  const leads = sales ? allLeads() : [], byCase = {};
  leads.forEach(v => { if (v.kind === 'case') byCase[v.id] = v; });
  const rows = cases.map(r => { const lv = sales ? byCase[r.c.id] : null; return { kind: 'case', r, lv, me: lv ? needL(lv) : r.me, b: r.b, o: BORD[r.b], p: lv ? prio(lv) : 0, key: [caseName(r.c), r.c.v.appNo, r.c.v.branch, r.c.lead ? r.c.lead.by : '', lv && lv.owner ? TEAM[lv.owner].n : ''].join(' ') }; });
  if (sales) leads.filter(v => v.kind === 'light' && (S.role === 'sm' || v.owner === 'amit')).forEach(v => rows.push({ kind: 'lead', v, me: needL(v), b: v.stage === 'lost' ? 'closed' : 'lead', o: v.stage === 'lost' ? BORD.closed : BORD.lead, p: prio(v), key: [v.name, v.no, v.city, v.src.n, v.owner ? TEAM[v.owner].n : 'unassigned'].join(' ') }));
  const f = BT.some(x => x[0] === S.bf) ? S.bf : 'all', q = (S.bq || '').trim().toLowerCase();
  const cnt = k => k === 'all' ? rows.length : k === 'me' ? rows.filter(x => x.me).length : rows.filter(x => x.b === k).length;
  let list = S.lf && sales ? rows.filter(x => { const v = x.kind === 'lead' ? x.v : x.lv; return v ? lfMatch(v) : false; }) : rows.filter(x => f === 'all' ? true : f === 'me' ? x.me : x.b === f);
  if (q) list = list.filter(x => x.key.toLowerCase().includes(q));
  list.sort((a, b) => (b.me - a.me) || (a.me ? (b.p - a.p) || (a.o - b.o) : (a.o - b.o) || (b.p - a.p)));
  const per = 10, pages = Math.max(1, Math.ceil(list.length / per)); S.pg = clamp(S.pg || 0, 0, pages - 1);
  const shown = list.slice(S.pg * per, S.pg * per + per);
  const head = S.role === 'sales' ? ['My day', 'Amit Joshi, relationship manager, Pune Kothrud. ' + dayLine() + '. Calling hours 9:30 to 19:00, Monday to Saturday.']
    : S.role === 'sm' ? ['Sales team', 'Nikhil Bhatia, head of retail sales. ' + dayLine() + '. Today so far: 214 new leads, 81% of digital leads called within 5 minutes, median first call 7 minutes.']
    : S.role === 'ap' ? ['Approvals for ' + AUTH[S.lvl].name, 'Files referred to you, with the credit manager’s recommendation.']
    : ['CRM', S.role === 'cm' ? 'Files the system has worked. Rows marked for you need a check, a chase or a decision.' : S.role === 'adm' ? 'Read only for the admin. Workflow, policy rules and vendors are set on the Admin page.' : 'Read only for credit policy. Policy changes are made in the policy studio.'];
  const dash = S.role === 'sales' ? rmDash(leads) : S.role === 'sm' ? mgrDash(leads) : creditKpis(cases);
  const chip = S.lf && sales ? `<span class="fchip">${ic('sliders')}<span>${esc(S.lf.l)}</span><button data-act="lfclear" aria-label="Clear the filter">${ic('x')}</button></span>` : '';
  const pg = `<div class="pgr"><span>${list.length ? (S.pg * per + 1) + ' to ' + Math.min(list.length, S.pg * per + per) + ' of ' + list.length : 'None'}</span>${pages > 1 ? `<button class="ibtn" data-act="pg" data-v="${S.pg - 1}"${S.pg ? '' : ' disabled'} aria-label="Previous page">${ic('back')}</button>${Array.from({ length: pages }, (_, k) => `<button class="pgn${k === S.pg ? ' on' : ''}" data-act="pg" data-v="${k}"${k === S.pg ? ' aria-current="page"' : ''} aria-label="Page ${k + 1}">${k + 1}</button>`).join('')}<button class="ibtn" data-act="pg" data-v="${S.pg + 1}"${S.pg < pages - 1 ? '' : ' disabled'} aria-label="Next page">${ic('fwd')}</button>` : ''}</div>`;
  const hd = sales ? ['Applicant', 'Loan', 'Stage', 'Next step', 'Outlook', 'With', 'Timing'] : ['Applicant', 'Loan', 'Stage', 'Waiting on', 'Recommendation', 'With', 'Turnaround'];
  const rowH = x => x.kind === 'lead' ? plRowL(x.v, x.me) : x.lv ? plRowL(x.lv, x.me) : plRow(Object.assign({}, x.r, { me: x.me }));
  return `${dash}
  ${sales ? `<div class="sect-h2" id="lt"><h3>Leads and files</h3><span class="note">${S.role === 'sales' ? 'Your leads, then every file in the CRM' : 'Every lead and file across the team'}</span></div>` : ''}
  <div class="bk pl${sales ? ' lv' : ''}"><div class="pl-top"><nav class="tabs2" aria-label="Filter by stage">${BT.map(([k, l]) => { const n = cnt(k), on = !S.lf && f === k; return `<button class="tab2${on ? ' on' : ''}" data-act="bf" data-v="${k}"${on ? ' aria-current="true"' : ''}>${k === 'me' && S.role === 'sm' ? 'Needs attention' : l}<span class="cnt${k === 'me' && n ? ' w' : ''}">${n}</span></button>`; }).join('')}</nav>${chip}<input class="srch" id="bq" type="search" placeholder="Search name, number, branch or partner" value="${esc(S.bq || '')}" aria-label="Search leads and files"></div>
  <div class="pl-row hd" role="presentation">${hd.map(h => `<span>${h}</span>`).join('')}</div>
  ${shown.length ? shown.map(rowH).join('') : `<div class="bk-empty">Nothing here. <button class="lnk" data-act="lfclear">Show everything</button></div>`}${pg}</div>
`;
}

/* ---------------- lead drawer, call and WhatsApp ---------------- */
function lget(id) { return LL.find(x => x.id === id); }
function lvById(id) { const x = lget(id); return x ? lvL(x) : null; }
function waDraft(v) {
  const x = v.x, first = v.name.split(' ')[0], own = v.owner ? TEAM[v.owner].n.split(' ')[0] : 'Our team';
  const k = x.wa || (v.call.st === 'msg' ? 'follow' : 'ack');
  const rate = (v.seg === 'prime' ? 9.4 : 11.5);
  const T = {
    rate: ['HL-RATE-02', `Hi ${first}, our home loan rates fell by 0.25% from 15 November. On ${lakh(v.ask)} over ${yrsTxt(x.ten)}, your EMI would be about ${inr(emiCalc(v.ask, rate - 0.25, x.ten))}. Reply YES for an updated offer, or STOP to opt out.`],
    topup: ['HL-TOPUP-01', `Hi ${first}, you have paid ${x.book ? x.book.emis : 36} EMIs on time on your home loan. You can now get a top-up of up to ${lakh(x.book ? x.book.topup : 800000)} at your current rate. Reply YES for a call back, or STOP to opt out.`],
    prop: ['HL-PROP-01', `Hi ${first}, all the best for your site visit. We can check how much you can borrow before Saturday: it takes 2 minutes with a consent link. Reply YES to get the link, or STOP to opt out.`],
    docs: ['HL-DOCS-03', `Hi ${first}, ${x.docs ? (x.docs.of - x.docs.in) : 3} documents are still pending for your home loan: ${x.docs ? x.docs.miss : 'your income documents'}. Upload them here: uncia.link/d/${x.id.toLowerCase()}`],
    elig: ['HL-ELIG-02', `Hi ${first}, on an income of ${inr(x.inc)} a month you could borrow about ${lakh(v.fit.est)}. Adding an earning co-applicant could raise this. Reply CALL and we'll explain the options.`],
    web: ['HL-NUDGE-01', `Hi ${first}, still planning your home? See how much you can borrow in 2 minutes: uncia.link/e/${x.id.toLowerCase()}. Reply STOP to opt out.`],
    ack: ['HL-ACK-01', `Hi ${first}, thanks for your home loan enquiry. ${v.owner ? own : 'Someone'} from our home loan team will call you from ${v.call.cli.n}. Reply with a better time, or STOP to opt out.`],
    follow: ['HL-FOLLOW-01', `Hi ${first}, following up on your home loan enquiry. When is a good time to call? Reply with a time, or STOP to opt out.`]
  };
  return T[k] || T.follow;
}
function chips(v) {
  const c = v.con || {}, ch = (ok, t, s) => `<span class="cch ${ok ? 'ok' : ok === null ? 'na' : 'no'}"><b>${esc(t)}</b><small>${esc(s)}</small></span>`;
  return `<div class="cchs">${ch(!c.optout && v.call.checks[0].ok, 'Calls', c.optout ? 'Opted out' : cap1(v.call.bs))}${ch(!!c.wa, 'WhatsApp', c.wa ? 'Opted in' : 'Not opted in')}${ch(c.bureau ? true : null, 'Credit report', c.bureau ? 'Consent ' + fds(c.bureau) : 'Not yet')}${ch(c.aa ? true : null, 'Bank data', c.aa ? 'Consent ' + fds(c.aa) : 'Not yet')}${ch(c.bureau || c.link ? true : null, 'Privacy notice', c.link ? 'Shown with the consent link' : c.bureau ? 'Version 3.2 shown' : 'Shown at the first consent')}${ch(!c.optout, 'Opt-out', c.optout ? fdt(c.optout) : 'None')}</div>`;
}
function leadDrawer(v) {
  const x = v.x, ow = v.owner ? TEAM[v.owner] : null, cl = v.call, c3 = CELL[v.cell], role = S.role, sales = ['sales', 'sm', 'cm'].includes(role);
  const F = ['H', 'M', 'L'], mini = `<div class="mg">${F.map(f => F.map(i => `<i class="${CELL[f + i][2]}${f + i === v.cell ? ' on' : ''}"></i>`).join('')).join('')}</div>`;
  const pts = (L, base) => `<ul class="pts">${base ? '<li class="b"><span>Starting point</span><b>50</b></li>' : ''}${L.map(y => `<li><span>${esc(y.t)}${y.at ? `<small>${esc(agoTxt(y.at))}${y.p && Math.abs(y.v - y.p) >= 0.5 ? ', worth ' + (y.v >= 0 ? '+' : MINUS) + Math.abs(y.v).toFixed(0) + ' now' : ''}</small>` : ''}</span><b class="${y.p > 0 ? 'up' : y.p < 0 ? 'dn' : ''}">${y.p > 0 ? '+' : y.p < 0 ? MINUS : ''}${Math.abs(y.p)}</b></li>`).join('')}</ul>`;
  const nbaBtns = [];
  if (cl.st === 'now') nbaBtns.push(`<button class="btn ${role === 'sm' ? 'btn-s' : 'btn-p'} btn-sm" data-act="lcall" data-v="${v.id}">${ic('phone')}Call</button>`);
  if (v.con && v.con.wa && cl.st !== 'no') nbaBtns.push(`<button class="btn btn-s btn-sm" data-act="lwa" data-v="${v.id}">${ic('chat')}WhatsApp</button>`);
  if (cl.st !== 'no' && !v.con.bureau && !['lost', 'optout'].includes(v.stage)) nbaBtns.push(`<button class="btn btn-s btn-sm" data-act="lconsent" data-v="${v.id}">${ic('lock')}${v.con.link ? 'Resend' : 'Send'} the consent link</button>`);
  if (x.waSent && x.waReply && !x.replied) nbaBtns.push(`<span class="wait-r"><span class="spin"></span>Waiting for a reply on WhatsApp</span>`);
  const smB = [];
  if (role === 'sm' && !v.owner) smB.push(`<button class="btn btn-p btn-sm" data-act="lassign" data-v="${v.id}">${ic('user')}Assign</button>`);
  if (role === 'sm' && v.conflict && !v.conflict.res) smB.push(`<button class="btn btn-p btn-sm" data-act="lkeep" data-v="${v.id}">Keep with ${esc(v.src.n)}</button>`);
  if (role === 'sm' && v.ho && !v.ho.acc) smB.push(`<button class="btn btn-p btn-sm" data-act="lremind" data-v="${v.id}">${ic('bell')}Remind ${esc(TEAM[v.ho.to].n.split(' ')[0])}</button>`);
  const part = ['DSA', 'Connector'].includes(v.src.t) ? `<p class="dl">Registered by ${esc(v.src.n)} (${esc(v.src.code)}) on ${fdate(v.created)}. It stays theirs until ${fdate(addDays(v.created, 30))} while the lead is active; the payout is fixed at login.</p>` : '';
  const conf = v.conflict ? `<div class="warnbox">${ic('alert')}<div><b>Ownership conflict${v.conflict.res ? ': resolved' : ''}</b><p>Also registered by ${esc(v.conflict.other)} (${esc(v.conflict.code)}) on ${fdt(v.conflict.at)}. First to register wins: ${esc(v.src.n)}.${v.conflict.res ? ' Kept with ' + esc(v.src.n) + ' by ' + esc(SMGR.name) + '.' : ''}</p></div></div>` : '';
  const ho = v.ho ? `<div class="warnbox">${ic('handoff')}<div><b>Hand-off ${v.ho.acc ? 'accepted' : 'waiting'}</b><p>Qualified by ${esc(ow.n)} and handed to ${esc(TEAM[v.ho.to].n)}, ${esc(TEAM[v.ho.to].w)} RM, at ${ftime(v.ho.at)}.${v.ho.acc ? '' : ' Not accepted for ' + dur((CLK - P(v.ho.at)) / 60000) + '; the target is 2 hours.'}${v.ho.rem ? ' Reminder sent ' + ftime(v.ho.rem) + '.' : ''}</p></div></div>` : '';
  const hist = (x.log || []).map(e => ({ at: e.at, t: e.t, who: e.who })).concat(v.intent.items.map(e => ({ at: e.at, t: e.t, p: e.p }))).concat(v.att.filter(a => a.o !== 'No answer').map(a => ({ at: a.at, t: 'Call: ' + lc1(a.o), who: ow ? ow.n : '' }))).sort((a, b) => P(b.at) - P(a.at));
  const strip = `<ol class="ldst" aria-label="Lead to sanction">${STG6.map((t, i) => `<li class="${i ? '' : ['lost', 'optout'].includes(v.stage) ? 'cur bad' : 'cur'}"${i ? '' : ' aria-current="step"'}><i></i>${t}</li>`).join('')}</ol><p class="hint ldst-h">A case file opens when the customer gives consent and the pre-screen runs.</p>`;
  const body = `${strip}<div class="nba"><span class="rec-b">${ic('cpu')}Next best action</span><b>${esc(v.nba.t)}</b>${v.nba.s ? `<p>${esc(v.nba.s)}</p>` : ''}${nbaBtns.length || smB.length ? `<div class="act-row">${smB.join('')}${nbaBtns.join('')}</div>` : ''}</div>
  <div class="ld-sec"><div class="ld-h">${mini}<div><b>${esc(tempTxt(v))}</b><small>Fit ${v.fit.v} and intent ${v.intent.v}: ${esc(lc1(c3[1]))}</small></div></div>
  <div class="fi2"><div><div class="ins-k">Fit ${v.fit.v}<small>${v.fit.basis === 'book' ? 'From our loan book' : v.fit.basis === 'pre-screen' ? 'From the pre-screen' : 'From declared details; the pre-screen firms it up'}</small></div><span class="sbar"><i style="width:${v.fit.v}%"></i></span>${pts(v.fit.parts, true)}</div>
  <div><div class="ins-k">Intent ${v.intent.v}<small>Points lose about 10% a day without new activity</small></div><span class="sbar in"><i style="width:${v.intent.v}%"></i></span>${pts(v.intent.items.slice(0, 6), false)}</div></div></div>
  <div class="ld-sec"><div class="ins-k">Can we call? ${cbadge(cl)}</div><ul class="cks">${cl.checks.map(k => `<li class="${k.ok ? 'ok' : 'no'}">${ic(k.ok ? 'check' : 'x')}<span><b>${esc(k.t)}</b><small>${esc(k.s)}</small></span></li>`).join('')}</ul><p class="hint">Calls go out from ${esc(cl.cli.n)}: the ${esc(cl.cli.k)}. Every call is recorded.</p></div>
  <div class="ld-sec"><div class="ins-k">Consent record</div>${chips(v)}</div>
  <div class="ld-sec"><div class="ins-k">Ownership</div><p class="dl"><b>${esc(ow ? ow.n + ', ' + ow.r + ', ' + ow.w : 'Unassigned')}</b>${ow ? '' : ': ' + esc(v.unas || '')}</p><p class="dl muted">${esc(RULES[v.rule] || '')}. Speaks ${esc(v.lang)}.</p>${part}${conf}${ho}</div>
  <div class="ld-sec"><div class="ins-k">History</div><ul class="hist">${hist.map(h => `<li><time>${esc(fds(h.at) + ', ' + ftime(h.at))}</time><span>${esc(h.t)}${h.who ? `<small>${esc(h.who)}</small>` : ''}</span></li>`).join('')}</ul></div>`;
  const foot = `${role === 'sm' && v.owner ? `<button class="btn btn-s" data-act="lassign" data-v="${v.id}">Reassign</button>` : ''}${sales && v.open && v.stage !== 'optout' ? `<button class="btn btn-g" data-act="llost" data-v="${v.id}">Close as lost</button>` : ''}<span style="flex:1"></span><button class="btn btn-s" data-act="shclose">Done</button>`;
  return [v.name, (v.no + ', ' + (v.src.t === 'Existing customer' ? 'existing customer' : v.src.t + ': ' + v.src.n) + ', ' + v.city), body, foot];
}
const OUTC = [['conn', 'Connected'], ['cb', 'Asked to call back'], ['na', 'No answer'], ['ni', 'Not interested'], ['opt', 'Asked not to be called'], ['wrong', 'Wrong number']];
function callDialog(v) {
  const sh = S.sheet, o = sh.o, x = v.x, cl = v.call, first = v.name.split(' ')[0], n = v.att.length;
  let sub = '';
  if (o === 'conn') { const sumT = (x.call && x.call.sum) || 'Interested. Wants to know the rate and the documents needed.', nx = sh.nx || (x.call && x.call.next) || 'consent'; sub = `<div class="ai-sum"><span class="rec-b">${ic('cpu')}Call summary, drafted by the system</span><textarea class="ta" id="callSum" aria-label="Call summary">${esc(sumT)}</textarea><p class="hint">Drafted from the call recording. Check and edit before you save.</p></div><div class="ins-k" style="margin-top:10px">Next step</div><div class="seg2" role="group" aria-label="Next step">${[['consent', 'Send the consent link'], ['visit', 'Book a visit'], ['callback', 'Call back'], ['none', 'Nothing yet']].filter(([k]) => !(k === 'consent' && v.con.bureau)).map(([k, l]) => `<button class="${nx === k ? 'on' : ''}" data-act="cnx" data-v="${k}">${l}</button>`).join('')}</div>`; }
  if (o === 'cb' || (o === 'conn' && (sh.nx || (x.call && x.call.next)) === 'callback')) sub += `<div class="frm" style="margin-top:10px"><label>Call back at<select class="sel" id="cbAt">${['2026-11-16 13:00', '2026-11-16 15:30', '2026-11-16 17:30', '2026-11-17 10:30', '2026-11-19 11:00'].filter(t => P(t) > CLK).map(t => `<option value="${t}">${sameDay(t, CLK) ? 'Today ' + ftime(t) : DAYN[P(t).getDay()] + ' ' + fds(t) + ', ' + ftime(t)}</option>`).join('')}</select></label></div>`;
  if (o === 'na') sub = `<p class="calc">This is attempt ${n + 1} of 6. ${n + 1 >= 6 ? 'After this one the lead moves to nurture: the lender\u2019s limit is 6 attempts.' : 'The system schedules the next attempt at a different time of day.'}</p>`;
  if (o === 'ni') sub = `<div class="frm" style="margin-top:10px"><label>Reason<select class="sel" id="niR">${['Got a lower rate elsewhere', 'Property not finalised', 'Just exploring', 'Chose another lender', 'Not eligible'].map(r => `<option>${r}</option>`).join('')}</select></label></div><p class="hint">Rates, property and exploring go to nurture. The others close the lead.</p>`;
  if (o === 'opt') sub = `<div class="warnbox">${ic('lock')}<div><b>${esc(first)} will be removed from all calls and messages</b><p>The opt-out is recorded with the time and applies at once, including to DSAs and connectors.</p></div></div>`;
  const body = `<p class="calc">Calling ${esc(v.name)} from ${esc(cl.cli.n)}, the ${esc(cl.cli.k)}. The call is recorded.</p><div class="ins-k" style="margin-top:12px">How did it go?</div><div class="outc">${OUTC.map(([k, l]) => `<button class="${o === k ? 'on' : ''}" data-act="cout" data-v="${k}">${l}</button>`).join('')}</div>${sub}`;
  return ['Call ' + v.name, 'Attempt ' + (n + 1) + (v.nba ? '. ' + v.nba.t : ''), body, `<button class="btn btn-s" data-act="lopen" data-v="${v.id}">Back</button><button class="btn btn-p" data-act="csave"${o ? '' : ' disabled'}>Save the outcome</button>`];
}
function waDialog(v) {
  const [tid, txt] = waDraft(v);
  const body = `<div class="ai-sum"><span class="rec-b">${ic('cpu')}Drafted from an approved template</span><div class="tpl">Template ${esc(tid)}, approved by compliance. ${v.lang !== 'English' ? 'Also approved in ' + esc(v.lang) + '.' : ''}</div><textarea class="ta" id="waTxt" rows="6" aria-label="WhatsApp message">${esc(txt)}</textarea><p class="hint">Edit before sending. Messages go only to customers who opted in to WhatsApp, and every message keeps the opt-out line.</p></div>`;
  return ['WhatsApp ' + v.name, 'From ' + LENDER.short + '’s verified business number', body, `<button class="btn btn-s" data-act="lopen" data-v="${v.id}">Back</button><button class="btn btn-p" data-act="wasend" data-v="${v.id}">${ic('send')}Send</button>`];
}
function assignDialog(v) {
  const opts = Object.keys(TEAM).map(k => { const t = TEAM[k], langOk = t.lang.indexOf(v.lang) >= 0, open = k === 'amit' ? allLeads().filter(y => y.owner === 'amit' && y.open).length : t.open; return { k, t, langOk, load: open / t.cap }; }).sort((a, b) => (b.langOk - a.langOk) || (a.load - b.load));
  const best = opts[0];
  const body = `<p class="calc">${esc(v.unas ? 'Why it is unassigned: ' + v.unas + '.' : 'Now with ' + TEAM[v.owner].n + '.')} Speaks ${esc(v.lang)}.</p><div class="frm"><label>Assign to<select class="sel" id="asTo">${opts.map(o => `<option value="${o.k}"${o === best ? ' selected' : ''}>${esc(o.t.n + ', ' + o.t.r + ' (' + Math.round(o.load * 100) + '% loaded' + (o.langOk ? ', speaks ' + v.lang : '') + ')')}</option>`).join('')}</select></label></div><p class="hint">Suggested: ${esc(best.t.n)}${best.langOk ? ', who speaks ' + esc(v.lang) : ''}, with the lightest load. ${best.langOk ? '' : 'No one free speaks ' + esc(v.lang) + '; the lead gets an interpreter line.'}</p>`;
  return [v.owner ? 'Reassign ' + v.name : 'Assign ' + v.name, v.no, body, `<button class="btn btn-s" data-act="lopen" data-v="${v.id}">Back</button><button class="btn btn-p" data-act="asgo" data-v="${v.id}">Assign</button>`];
}
function lostDialog(v) {
  return ['Close ' + v.name + ' as lost', v.no, `<div class="frm"><label>Reason<select class="sel" id="lostR">${['Chose another lender', 'Got a lower rate elsewhere', 'Not eligible', 'Property not finalised', 'Unreachable after 6 attempts', 'Duplicate lead'].map(r => `<option>${r}</option>`).join('')}</select></label></div><p class="hint">A closed lead keeps its history. Chose another lender schedules a balance-transfer check in 6 months.</p>`, `<button class="btn btn-s" data-act="lopen" data-v="${v.id}">Back</button><button class="btn btn-x" data-act="lostgo" data-v="${v.id}">Close as lost</button>`];
}
function leadSheet() {
  const sh = S.sheet; if (!sh || !['ld', 'call', 'wa', 'assign', 'lost'].includes(sh.k)) return '';
  const v = lvById(sh.id); if (!v) return '';
  const [t, s, body, foot] = { ld: leadDrawer, call: callDialog, wa: waDialog, assign: assignDialog, lost: lostDialog }[sh.k](v);
  return `<div class="scrim" data-act="shclose"></div><aside class="as open wide" role="dialog" aria-modal="true" aria-label="${esc(t)}"><div class="as-h"><div><b>${esc(t)}</b><small>${esc(s)}</small></div>${sh.k === 'ld' ? tchip(v) : ''}<button class="nic" data-act="shclose" aria-label="Close">${ic('x')}</button></div><div class="as-b">${body}</div><div class="as-f">${foot}</div></aside>`;
}

/* ---------------- lead actions ---------------- */
function llog(x, t) { (x.log = x.log || []).push({ at: S8(CLK), t, who: meWho().name }); }
function nextTry(n) { const d = new Date(CLK.getTime()); const h = d.getHours(); if (h < 16) { d.setHours(17, 30, 0, 0); } else { d.setDate(d.getDate() + 1); if (d.getDay() === 0) d.setDate(d.getDate() + 1); d.setHours(10, 30, 0, 0); } return S8(d); }
Object.assign(ACT, {
  lopen(v) { S.sheet = { k: 'ld', id: v }; render(); },
  lcall(v) { const lv = lvById(v); if (!lv) return; if (lv.call.st !== 'now') { S.sheet = { k: 'ld', id: v }; render(); toast('Not callable now: ' + lc1(lv.call.why)); return; } S.sheet = { k: 'call', id: v, o: null }; render(); },
  lwa(v) { const lv = lvById(v); if (!lv) return; if (!lv.con.wa || lv.call.st === 'no') { toast('No WhatsApp opt-in for ' + lv.name.split(' ')[0]); return; } S.sheet = { k: 'wa', id: v }; render(); },
  cout(v) { S.sheet.o = v; S.sheet.nx = null; render(); },
  cnx(v) { S.sheet.nx = v; render(); },
  csave() {
    const sh = S.sheet, x = lget(sh.id); if (!x) return;
    const v0 = lvL(x), o = sh.o, at = tick(4), first = x.name.split(' ')[0];
    x.att = x.att || [];
    if (x.next && !x.next.done && P(x.next.at) <= P(at)) x.next.done = true;
    if (o === 'na') {
      x.att.push({ at, o: 'No answer' });
      if (x.att.filter(a => a.o === 'No answer').length >= 6) { x.stage = 'nurture'; x.next = null; llog(x, 'Six attempts without an answer: moved to nurture'); toast('Six attempts without an answer: moved to nurture'); }
      else { x.next = { at: nextTry(), t: 'Attempt ' + (x.att.length + 1) + ' of 6, at a different time' }; llog(x, 'No answer. Next attempt ' + (sameDay(x.next.at, CLK) ? 'today ' : fds(x.next.at) + ' ') + ftime(x.next.at)); toast('No answer. Next attempt ' + (sameDay(x.next.at, CLK) ? 'today at ' : 'on ' + fds(x.next.at) + ' at ') + ftime(x.next.at)); }
    } else if (o === 'conn' || o === 'cb') {
      x.att.push({ at, o: 'Connected' }); S.conn = (S.conn || 0) + (x.owner === 'amit' ? 1 : 0);
      const sumT = ($('#callSum') || {}).value; const nx = o === 'cb' ? 'callback' : (sh.nx || (x.call && x.call.next) || 'consent');
      if (o === 'conn') { x.ev.push({ at, t: 'On the call: ' + (sumT || 'interested').split('. ')[0].replace(/\.$/, ''), p: 20 }); llog(x, 'Call summary saved: ' + (sumT || '')); }
      if (['new', 'nurture'].includes(x.stage)) x.stage = 'contacted';
      if (x.trig) x.trig.done = true;
      if (nx === 'consent') { x.con.link = at; x.stage = 'consent'; x.ev.push({ at, t: 'Consent link sent by SMS and WhatsApp', p: 0 }); toast('Saved. The consent link went to ' + first + ' by SMS and WhatsApp'); }
      else if (nx === 'visit') { x.visit = { at: '2026-11-18 11:00', t: 'Branch visit booked' }; x.ev.push({ at, t: 'Booked a branch visit for Wednesday 11:00', p: 15 }); toast('Saved. Visit booked for Wednesday at 11:00'); }
      else if (nx === 'callback') { const t = ($('#cbAt') || {}).value || nextTry(); x.next = { at: t, t: 'Callback ' + first + ' asked for', pref: true }; x.ev.push({ at, t: 'Asked for a call back', p: 25 }); toast('Saved. Callback at ' + (sameDay(t, CLK) ? ftime(t) : fds(t) + ', ' + ftime(t))); }
      else toast('Saved');
    } else if (o === 'ni') {
      const r = ($('#niR') || {}).value || 'Just exploring'; x.att.push({ at, o: 'Connected' }); x.ev.push({ at, t: 'On the call: not interested (' + lc1(r) + ')', p: -10 });
      if (['Got a lower rate elsewhere', 'Property not finalised', 'Just exploring'].includes(r)) { x.stage = 'nurture'; x.next = null; llog(x, 'Not interested: ' + lc1(r) + '. Moved to nurture'); toast('Moved to nurture: ' + lc1(r)); }
      else { x.stage = 'lost'; x.lost = { r, at, recheck: r === 'Chose another lender' ? addDays(at, 180) : null }; llog(x, 'Closed as lost: ' + lc1(r)); toast('Closed as lost'); }
    } else if (o === 'opt') { x.att.push({ at, o: 'Connected' }); x.con.optout = at; x.stage = 'optout'; x.next = null; x.ev.push({ at, t: 'Asked not to be called again', p: -30 }); llog(x, 'Opted out. Removed from all calls and messages'); toast(first + ' opted out: removed from all calls and messages'); }
    else if (o === 'wrong') { x.att.push({ at, o: 'Wrong number' }); x.stage = 'lost'; x.lost = { r: 'Wrong number', at }; llog(x, 'Wrong number: closed'); toast('Closed: wrong number'); }
    S.sheet = { k: 'ld', id: x.id }; render();
    const v1 = lvL(x); if (CELL[v1.cell][0] !== CELL[v0.cell][0] && v1.call.st !== 'no') setTimeout(() => toast(first + ' is now ' + lc1(tempTxt(v1))), 1500);
  },
  wasend(id) { const x = lget(id), v = lvL(x), [tid] = waDraft(v), at = tick(1), txt = ($('#waTxt') || {}).value || ''; x.waSent = at; x.ev.push({ at, t: 'WhatsApp sent: template ' + tid, p: 0 }); llog(x, 'WhatsApp sent: ' + txt); if (x.trig && v.call.st === 'msg') x.trig.sent = true; S.sheet = { k: 'ld', id }; render(); toast('Sent on WhatsApp from template ' + tid); },
  lreply(id) { const x = lget(id), at = tick(25), first = x.name.split(' ')[0], v0 = lvL(x); x.replied = true; x.ev.push({ at, t: 'Replied on WhatsApp: “' + x.waReply + '”', p: 25 }); x.con.inq = at; x.con.via = 'a WhatsApp reply'; if (x.trig) x.trig.done = true; if (x.stage === 'nurture') x.stage = 'contacted'; S.sheet = { k: 'ld', id }; render(); const v1 = lvL(x); toast(first + ' replied. ' + (v0.call.st !== 'now' && v1.call.st === 'now' ? 'The reply is a new written inquiry, so ' + first + ' can be called now' : 'Now ' + lc1(tempTxt(v1)))); },
  lconsent(id) { const x = lget(id), at = tick(1); x.con.link = at; if (['new', 'contacted', 'nurture'].includes(x.stage)) x.stage = 'consent'; x.ev.push({ at, t: 'Consent link sent by SMS and WhatsApp', p: 0 }); llog(x, 'Consent link sent'); render(); toast('Consent link sent. The pre-screen runs when ' + x.name.split(' ')[0] + ' approves it'); },
  lassign(id) { S.sheet = { k: 'assign', id }; render(); },
  asgo(id) { const x = lget(id), to = ($('#asTo') || {}).value; if (!to) return; const was = x.owner; x.owner = to; x.unas = null; if (x.ho && !x.ho.acc) x.ho = null; tick(1); llog(x, (was ? 'Reassigned from ' + TEAM[was].n + ' to ' : 'Assigned to ') + TEAM[to].n); S.sheet = { k: 'ld', id }; render(); toast((was ? 'Reassigned to ' : 'Assigned to ') + TEAM[to].n); },
  lkeep(id) { const x = lget(id); x.conflict.res = 'kept'; tick(1); llog(x, 'Conflict resolved: kept with ' + x.src.n + ', the first to register'); render(); toast('Kept with ' + x.src.n + '. NCR Loan Desk has been told'); },
  lremind(id) { const x = lget(id); x.ho.rem = tick(1); llog(x, 'Reminded ' + TEAM[x.ho.to].n + ' to accept the hand-off'); render(); toast('Reminder sent to ' + TEAM[x.ho.to].n); },
  llost(id) { S.sheet = { k: 'lost', id }; render(); },
  lostgo(id) { const x = lget(id), r = ($('#lostR') || {}).value, at = tick(1); x.stage = 'lost'; x.lost = { r, at, recheck: r === 'Chose another lender' ? addDays(at, 180) : null }; x.next = null; llog(x, 'Closed as lost: ' + lc1(r)); S.sheet = null; render(); toast('Closed as lost: ' + lc1(r)); },
  lf(v) { const [k, val, l] = v.split('|'); if (S.lf && S.lf.k === k && (S.lf.v || '') === (val || '')) S.lf = null; else S.lf = { k, v: val || '', l: l || '' }; S.pg = 0; render(); const t = document.querySelector('.sect-h2') || document.querySelector('.pl'); if (t && S.lf) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  lfclear() { S.lf = null; S.bf = 'all'; S.pg = 0; render(); },
  mf(v) { S.mf = v; render(); },
  pg(v) { S.pg = +v; render(); }
});

/* =====================================================================
   v4 shell: inside a case, the top bar carries the lead-to-sanction
   steps and the status; the case sections sit in a collapsible menu
   on the left; personas and theme move to an avatar menu
   ===================================================================== */
const SNICO = { overview: 'grid', casefile: 'layers', docs: 'file', income: 'bank', property: 'home', rules: 'shield', memo: 'memo', sanction: 'pen', audit: 'history' };
const PERS = [
  { v: 'sales', g: 'team', ini: () => SALES.ini, n: () => SALES.name, r: () => SALES.sub },
  { v: 'sm', g: 'team', ini: () => SMGR.ini, n: () => SMGR.name, r: () => 'Head of retail sales' },
  { v: 'cm', g: 'team', ini: () => AUTH.L1.ini, n: () => AUTH.L1.name, r: () => 'Credit manager, L1' },
  { v: 'ap|L2', g: 'team', ini: () => AUTH.L2.ini, n: () => AUTH.L2.name, r: () => 'Regional credit manager, L2' },
  { v: 'ap|L3', g: 'team', ini: () => AUTH.L3.ini, n: () => AUTH.L3.name, r: () => 'Zonal credit manager, L3' },
  { v: 'ap|L4', g: 'team', ini: () => AUTH.L4.ini, n: () => AUTH.L4.name, r: () => 'National credit head, L4' },
  { v: 'adm', g: 'team', ini: () => ADMIN.ini, n: () => ADMIN.name, r: () => 'LOS administrator' },
  { v: 'cust|N1', g: 'cust', ini: () => CASES.find(c => c.id === 'N1').apps[0].ini, n: () => CASES.find(c => c.id === 'N1').apps[0].name, r: () => cusOk('N1') ? 'Application ' + CASES.find(c => c.id === 'N1').v.appNo : 'Can sign in once the file is logged in', dis: () => !cusOk('N1') },
  { v: 'cust|G', g: 'cust', ini: () => CASES.find(c => c.id === 'G').apps[0].ini, n: () => CASES.find(c => c.id === 'G').apps[0].name, r: () => 'Application ' + CASES.find(c => c.id === 'G').v.appNo }
];
const curAcct = () => S.role === 'ap' ? 'ap|' + S.lvl : S.role === 'cust' ? 'cust|' + (S.cust || 'G') : S.role;
/* owners travel with the seeds, so a reset case keeps its owner */
SEED2.forEach(s => { if (s.lead && LEADOWN[s.id]) s.lead.owner = LEADOWN[s.id]; });
function initCases() { CLK = new Date(NOW); CASES = SEED2.map(mk); LL = deep(LIGHT); }
function ownKey(c) {
  if (c.lead && c.lead.owner) return c.lead.owner;
  const by = String(c.v.srcBy || '').split(',')[0].trim();
  return Object.keys(TEAM).find(k => TEAM[k].n === by) || null;
}
function meWho() {
  if (S.role === 'sales') return Object.assign({ lv: 'SALES' }, SALES);
  if (S.role === 'sm') return Object.assign({ lv: 'SM' }, SMGR);
  if (S.role === 'adm') return Object.assign({ lv: 'ADM' }, ADMIN);
  if (S.role === 'cust') { const c = cusCase() || CASES[0], a = c.apps[0]; return cusSigned(c.id) ? { ini: a.ini, name: a.name, sub: 'Customer, ' + a.mobile, lv: 'CUS' } : { ini: '', name: 'Not signed in', sub: 'Home loans', lv: 'CUS' }; }
  if (S.role === 'hcp') return { ini: PEOPLE.checker.ini, name: PEOPLE.checker.name, sub: PEOPLE.checker.title, lv: 'HCP' };
  if (S.role === 'pol') return { ini: PEOPLE.maker.ini, name: PEOPLE.maker.name, sub: PEOPLE.maker.title, lv: 'POL' };
  const l = S.role === 'cm' ? 'L1' : S.lvl; return { ini: AUTH[l].ini, name: AUTH[l].name, sub: l + ', ' + AUTH[l].title, lv: l };
}



/* ---------------- top bar ---------------- */
const RSUB = { approve: 'Recommends sanction', cond: 'Sanction, with conditions', counter: 'Counter-offer', decline: 'Recommends decline', prov: 'Not yet' };
function stepsOf(c) {
  const st = E.st, k = st.k, L = c.lead, rec = recOf(c, E);
  const idx = { lead: 0, prescreen: 1, docs: 2, provisional: 3, review: 4, returned: 4, pending: 4, approved: 5, declined: L && !L.in ? 1 : 4 }[k];
  const done = c.tasks.filter(t => t.st === 'accepted').length;
  const subs = [
    'Created ' + fds(L ? L.created : c.v.login),
    L && L.pre ? { yes: 'Eligible', change: 'With changes', no: 'Not eligible' }[L.pre.res] : 'After the documents',
    L && !L.in ? 'After the pre-screen' : c.v.appNo,
    k === 'docs' ? 'After the documents' : idx < 3 ? 'After login' : done + ' of ' + c.tasks.length + ' reports in',
    k === 'returned' ? 'Sent back' : k === 'review' ? RSUB[rec.k] : k === 'pending' ? 'With ' + st.lvl : k === 'approved' ? (st.by === 'SYS' ? 'By the system' : 'By ' + byName(st.by)) : k === 'declined' && idx === 4 ? 'Rejected' : 'Not yet',
    k === 'approved' ? (c.w.san.handoff ? 'With operations' : c.w.san.sent ? 'Sent' : 'Ready to send') : 'After the decision'];
  const tabs = ['overview', 'overview', 'docs', 'property', 'overview', 'sanction'];
  return STG6.map((t, i) => ({ t, sub: subs[i], tab: tabs[i], cls: i < idx ? 'done' : i === idx ? (k === 'declined' ? 'cur bad' : k === 'approved' && i === 5 ? 'done' : 'cur') : 'todo', dis: i > idx }));
}
function whoBtn(withName) {
  const m = meWho();
  return `<button class="wbtn${S.menu ? ' on' : ''}" id="whoBtn" data-act="menu" aria-haspopup="dialog" aria-expanded="${!!S.menu}" aria-controls="pop" aria-label="${esc('Account: ' + m.name + ', ' + m.sub)}" title="Account"><span class="av">${m.ini ? esc(m.ini) : ic('user')}</span>${withName ? `<span class="who-t">${esc(m.name)}<small>${esc(m.sub)}</small></span>` : ''}${ic('chev', 'wchev')}</button>`;
}
function navHTML() {
  if (S.view === 'case') return caseTopHTML();
  if (S.view === 'cust') return cusNavHTML();
  const on = k => S.view === k;
  const t = (k, l, i) => `<button class="ntab${on(k) ? ' on' : ''}" data-act="go" data-v="${k}"${on(k) ? ' aria-current="page"' : ''} aria-label="${l}">${ic(i)}<span class="ntl">${l}</span></button>`;
  return `<span class="brand"><img src="${logoUrl}" alt="Uncia, dare to go beyond"></span><span class="nav-div"></span>
  <nav class="ntabs" aria-label="Sections">${t('los', 'LOS', 'layers')}${t('board', 'CRM', 'inbox')}</nav><span class="nav-sp"></span>
  ${S.view === 'board' && ['sales', 'cm'].includes(S.role) ? `<button class="btn btn-sm nnew" data-act="newlead">${ic('plus')}<span>New lead</span></button>` : ''}${whoBtn(true)}`;
}
function caseTopHTML() {
  const c = C(), steps = stepsOf(c);
  const st = `<ol class="stepper nst" aria-label="Lead to sanction">${steps.map((s, i) => { const cur = s.cls.indexOf('cur') >= 0; return `${i ? '<li class="sep" aria-hidden="true"></li>' : ''}<li class="${s.cls}"><button data-act="tab" data-v="${s.tab}"${s.dis ? ' disabled' : ''}${cur ? ' aria-current="step"' : ''} title="${esc(s.t + ': ' + s.sub)}"><i>${s.cls === 'done' ? ic('check') : s.cls.indexOf('bad') >= 0 ? ic('x') : i + 1}</i><span class="stx"><span class="sl">${s.t}</span><small>${esc(s.sub)}</small></span></button></li>`; }).join('')}</ol>`;
  return `<span class="brand bm" title="Uncia">${LOGO}</span><button class="nback" data-act="go" data-v="${S.from8 === 'los' ? 'los' : 'board'}" title="Back to the ${S.from8 === 'los' ? 'LOS' : 'CRM'}" aria-label="Back to the ${S.from8 === 'los' ? 'LOS' : 'CRM'}">${ic('back')}<span>${S.from8 === 'los' ? 'LOS' : 'CRM'}</span></button>${st}<span class="nav-sp"></span><span class="nstat">${pill(E.st)}</span>${whoBtn(false)}`;
}

/* ---------------- case menu on the left ---------------- */
function sideNavHTML(c, T) {
  const v = c.v, L = c.lead, t = tatOf(c, E), h = holder(c, E), lead = !!(L && !L.in), nm = caseName(c);
  const kv = (k, val) => `<div><dt>${k}</dt><dd>${val}</dd></div>`;
  const tat = t.pre ? 'Since ' + fds(L.created) : t.closed ? 'Decided on day ' + t.n : `<span class="${t.late ? 'late' : ''}">Day ${t.n} of ${t.tgt}</span>`;
  const items = T.map(([k, l, n, w]) => { const on = S.tab === k; return `<button class="sn-i${on ? ' on' : ''}" data-act="tab" data-v="${k}"${on ? ' aria-current="page"' : ''} title="${esc(l + (n != null ? ': ' + n : ''))}">${ic(SNICO[k] || 'file')}<span class="sn-tx">${esc(l)}</span>${n != null ? `<span class="cnt${w ? ' w' : ''}">${esc(String(n))}</span>` : ''}</button>`; }).join('');
  return `<aside class="snav" aria-label="Case">
  <div class="sn-case" title="${esc(nm)}"><span class="sn-av" aria-hidden="true">${esc(c.apps[0].ini || inits(nm))}</span><div class="sn-id"><b>${esc(nm)}</b><small>${esc((lead ? 'Lead ' : '') + v.appNo)}</small></div><span class="sn-pill">${pill(E.st)}</span></div>
  <dl class="sn-kv">${kv('Loan', esc(lakh(v.loan)) + ', ' + yrsTxt(v.tenure))}${kv('Type', esc(VARS[c.variant] + ', ' + c.seg))}${kv('Branch', esc(v.branch))}${kv('With', esc(h.n))}${kv(t.pre ? 'Lead' : 'Turnaround', tat)}</dl>
  <nav class="sn-l" aria-label="Case sections">${items}</nav>
  <div class="sn-f"><button class="sn-i" data-act="sncol" aria-expanded="${!S.snc}" title="${S.snc ? 'Expand the menu' : 'Collapse the menu'}">${ic('chev', 'sn-chev')}<span class="sn-tx">Collapse the menu</span></button></div>
  </aside>`;
}
function mainHTML() {
  if (S.view === 'board') return full(boardHTML3());
  if (S.view === 'los') return full(losHTML());
  if (S.view === 'admin') return full(adminHTML());
  if (S.view === 'cust') return `<div class="full site-full" id="full">${cusHTML()}</div>`;
  const c = C(), st = E.st, lead = ['lead', 'prescreen'].includes(st.k), preDecl = st.k === 'declined' && c.lead && !c.lead.in, T = tabsOf(c, st);
  if (!T.some(t => t[0] === S.tab)) S.tab = 'overview';
  let body = '';
  switch (S.tab) {
    case 'overview': body = lead ? split(leadLeft(), leadRight2(), leadFoot()) : preDecl ? full(preDeclHTML()) : st.k === 'docs' ? split(loginDocsHTML(), ovLeft(), '') : split(ovLeft(), ovRight(), ''); break;
    case 'casefile': body = full(cfTab()); break;
    case 'docs': body = full(docsTab()); break;
    case 'income': body = full(`<div class="tabw">${verifyLeft()}</div>`); break;
    case 'property': body = full(`<div class="tabw">${verifyRight()}</div>`); break;
    case 'rules': body = full(`<div class="dws tabw">${findHTML()}${eligHTML()}${mlHTML()}${rulesHTML()}</div>`); break;
    case 'memo': body = full(memoHTML()); break;
    case 'sanction': body = split(sanLeft(), sanRight(), ''); break;
    case 'audit': body = full(auditHTML()); break;
  }
  return `<div class="cshell${S.snc ? ' col' : ''}">${sideNavHTML(c, T)}<div class="cshell-m">${body}</div></div>`;
}

/* ---------------- avatar menu: personas, theme, resets ---------------- */
const POP = document.getElementById('pop') || Object.assign(document.createElement('div'), { id: 'pop' }); if (!POP.parentNode) document.body.appendChild(POP);
function popHTML() {
  if (!S.menu) return '';
  const m = meWho(), cur = curAcct(), site = S.view === 'cust', signed = site && cusSigned((cusCase() || {}).id);
  const item = p => { const on = p.v === cur, dis = p.dis && p.dis(); return `<button class="pm-i${on ? ' on' : ''}${dis ? ' dis' : ''}" data-act="persona" data-v="${p.v}" aria-pressed="${on}"${dis ? ' disabled' : ''}><span class="mini-av">${esc(p.ini())}</span><span><b>${esc(p.n())}</b><small>${esc(p.r())}</small></span>${on ? ic('check') : '<span></span>'}</button>`; };
  return `<div class="pop-scrim" data-act="menu"></div><div class="pop-m" role="dialog" aria-label="Account">
  <div class="pm-h"><span class="av">${m.ini ? esc(m.ini) : ic('user')}</span><div><b>${esc(m.name)}</b><small>${esc(m.sub)}</small></div></div>
  ${signed ? `<button class="pm-a" data-act="csignout">${ic('logout')}Sign out</button>` : ''}
  <div class="pm-k">Switch account</div>${PERS.filter(p => p.g === 'team').map(item).join('')}
  <div class="pm-k">Customers</div>${PERS.filter(p => p.g === 'cust').map(item).join('')}
  <div class="pm-k">Appearance</div><div class="pm-th"><div class="seg2" role="group" aria-label="Appearance">${[['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => `<button class="${S.theme === k ? 'on' : ''}" data-act="themeset" data-v="${k}" aria-pressed="${S.theme === k}">${l}</button>`).join('')}</div></div></div>`;
}

/* ---------------- render ---------------- */
function render() {
  const keep = { k: S.view + S.tab + S.i + S.role + (S.view === 'admin' && ADM ? ADM.mode + ADM.sec : ''), f: $('#full') ? $('#full').scrollTop : 0, lp: $('#lp') ? $('#lp').scrollTop : 0, rp: $('#rps') ? $('#rps').scrollTop : 0, ks: {} };
  document.querySelectorAll('[data-keep]').forEach(e => { keep.ks[e.dataset.keep] = e.scrollTop; });
  const inCase = S.view === 'case', inWf = false;
  if (inCase) { E = fullEval(C()); C().w.step = { lead: 'login', prescreen: 'login', docs: 'login', provisional: 'verify', review: 'decide', returned: 'decide', pending: 'decide', approved: 'sanction', declined: 'sanction' }[E.st.k]; }
  const site = S.view === 'cust';
  document.title = site ? 'My home loan' : 'Uncia: home loans, lead to sanction';
  document.body.classList.toggle('on-site', site);
  // React owns #app, #nav, #cb, #main and #sheet: hand it the markup and the class names.
  paint({ cls: 'app' + (inCase || inWf ? ' incase2' : '') + (site ? ' site' : ''), navCls: 'nav' + (inCase || inWf ? ' ncase' : '') + (site ? ' snav2' : ''), inCase: false, nav: navHTML(), cb: '', main: mainHTML(), sheet: S.sheet ? (leadSheet() || nlSheet() || cusSheet() || sheetHTML()) : '' });
  POP.innerHTML = popHTML();
  if (render.lastKey === keep.k) { if ($('#full')) $('#full').scrollTop = keep.f; if ($('#lp')) $('#lp').scrollTop = keep.lp; if ($('#rps')) $('#rps').scrollTop = keep.rp; document.querySelectorAll('[data-keep]').forEach(e => { if (keep.ks[e.dataset.keep] != null) e.scrollTop = keep.ks[e.dataset.keep]; }); }
  render.lastKey = keep.k;
  afterRender();
  const fi = document.querySelector('[data-autofocus]'); if (fi) fi.focus();
}

/* ---------------- actions ---------------- */
const _resetall4 = ACT.resetall, _resetcase4 = ACT.resetcase;
Object.assign(ACT, {
  menu() { S.menu = !S.menu; render(); const el = S.menu ? (document.querySelector('#pop .pm-i.on') || document.querySelector('#pop .pm-i')) : $('#whoBtn'); if (el) el.focus(); },
  persona(v) {
    const [r, l] = String(v).split('|'); S.role = r; if (l && r === 'ap') S.lvl = l; if (l && r === 'cust') S.cust = l;
    S.menu = false; S.sheet = null; S.form = {}; S.edit = null; S.lf = null; S.pg = 0; S.bf = 'all'; S.bq = '';
    if (typeof IKP !== 'undefined') IKP.stop();
    if (r === 'adm') S.view = 'admin'; else if (r === 'cust') S.view = 'cust'; else if (S.view !== 'case') S.view = ['cm', 'ap'].includes(r) ? 'los' : 'board';
    render(); const f = $('#main'); if (f) f.scrollTop = 0; const fl = $('#full'); if (fl) fl.scrollTop = 0;
  },
  role(v) { ACT.persona(v); },
  themeset(v) { S.theme = v; applyTheme(); render(); },
  sncol() { S.snc = !S.snc; try { localStorage.setItem('uncia.snc', S.snc ? '1' : '0'); } catch (e) { /* storage unavailable: the choice lasts for this visit */ } render(); },
  bf(v) { S.bf = v; S.lf = null; S.pg = 0; render(); },
  resetall() { S.lf = null; S.pg = 0; S.conn = 0; S.mf = 'src'; S.menu = false; S.sheet = null; S.bf = 'all'; S.bq = ''; S.nl = null; S.cchat = []; S.cq = ''; S.creading = null; initAdmin(); _resetall4(); const v = { adm: 'admin', cust: 'cust' }[S.role]; if (v && S.view !== v) { S.view = v; render(); } },
  resetcase() { S.menu = false; _resetcase4(); }
});



/* ---------------- start-up ---------------- */
S.bf = 'all'; S.bq = ''; S.lw = 42; S.mf = 'src'; S.pg = 0; S.lf = null; S.conn = 0; S.menu = false;
S.snc = (() => { try { const v = localStorage.getItem('uncia.snc'); if (v != null) return v === '1'; } catch (e) { /* storage unavailable */ } return window.innerWidth < 1180; })();
/* start-up runs at the end of the last layer (20_v6.js) */

/* =====================================================================
   v6: data for the Admin page. Sample sources, the workflow they
   describe, the credit policy's rules, and the API vendors.
   All people, documents, vendors and numbers are fictional.
   ===================================================================== */
const ADMIN = { ini: 'TS', name: 'Tanvi Saxena', sub: 'LOS administrator' };
Object.assign(ICO, {
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 14.5h18M9 4v16"/>',
  lanes: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.33h18M3 14.67h18M8 4v16"/>',
  stages: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
  branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9c0 5-7 4-11 8"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  text: '<path d="M5 7V5h14v2M12 5v14M9 19h6"/>',
  wand: '<path d="M4 20L14 10M15 3v2M15 9v2M12 6h-2M20 6h-2M18 3.5l-1 1M18 8.5l-1-1"/>'
});

/* the lender's role master (imported from HRMS) */
const WROLE = {
  rm: { n: 'Sales RM', emp: 1 }, tsl: { n: 'Tele-sales', emp: 1 }, smgr: { n: 'Sales manager', emp: 1 },
  dsa: { n: 'DSA or connector', emp: 0 },
  bops: { n: 'Branch operations', emp: 1 }, cops: { n: 'Central operations', emp: 1 },
  cm: { n: 'Credit manager, L1', emp: 1 }, rcm: { n: 'Regional credit manager, L2', emp: 1 }, zcm: { n: 'Zonal credit manager, L3', emp: 1 }, nch: { n: 'National credit head, L4', emp: 1 },
  appr: { n: 'Sanctioning authority, from the matrix', emp: 1 },
  fcu: { n: 'FCU manager', emp: 1 }, fcuh: { n: 'FCU head', emp: 1 },
  lgl: { n: 'Legal manager', emp: 1 }, tech: { n: 'Technical manager', emp: 1 },
  fi: { n: 'FI agency', emp: 0 }, val: { n: 'Empanelled valuer', emp: 0 }, adv: { n: 'Empanelled advocate', emp: 0 },
  sys: { n: 'System', emp: 1, auto: 1 }
};
const RSYN = [[/regional credit manager|\brcm\b/, 'rcm'], [/zonal credit manager|\bzcm\b/, 'zcm'], [/national credit head|credit head/, 'nch'], [/fcu head/, 'fcuh'], [/\bfcu\b|fraud control/, 'fcu'], [/credit manager|\bcm\b/, 'cm'], [/branch operations|branch ops/, 'bops'], [/central operations|central ops/, 'cops'], [/legal manager/, 'lgl'], [/technical manager|valuer/, 'tech'], [/fi agency|field investigation/, 'fi'], [/tele-?sales/, 'tsl'], [/sales manager/, 'smgr'], [/\bdsa\b|connector/, 'dsa'], [/sales rm|relationship manager|\brm\b/, 'rm'], [/the system|system /, 'sys']];

/* ---------------- sample sources for Home loan origination, prime ---------------- */
const WSRC = {
  S1: { k: 'doc', ic: 'file', short: 'SOP', n: 'HL Credit and Operations SOP v4.2.pdf', kind: 'SOP', meta: '38 pages, scanned. Read with OCR at 97% average confidence', note: 'Approved by the Board Risk Committee in March 2025', hash: 'c41f9a07e2' },
  S2: { k: 'aud', ic: 'mic', short: 'Recording', n: 'Walkthrough, credit and operations, Pune.m4a', kind: 'Recording', meta: '42:18, Hindi and English mixed, 3 speakers', note: 'Consent recorded at 00:00 to 00:21', dur: 2538, hash: '7be2d410a9' },
  S3: { k: 'xls', ic: 'grid', short: 'Matrix', n: 'DoA_Retail_Mortgage_FY27.xlsx', kind: 'Approval matrix', meta: 'Sheet “HL Sanction Matrix”: 5 amount bands by 3 deviation classes', note: 'Approved by the Board Credit Committee on 30 Oct 2026', hash: '0d93e5bc41' },
  S4: { k: 'txt', ic: 'text', short: 'Ops note', n: 'Note from Rajesh Pillai, head of operations', kind: 'Text', meta: 'Pasted text, 4 points', note: 'Dated 14 Nov 2026', hash: '5a6c21fe83' }
};
const SOP = {
  4: { h: '3. Lead management', p: ['3.1 Every enquiry is registered as a lead in the LOS on the day it is received, whatever the source.', '3.2 The Sales RM shall capture the lead on the day of first contact, along with the applicant’s consent for the credit report.', '3.3 Leads from DSAs and connectors are mapped to the RM assigned to that partner.'], other: { 1: 'LEAD-ROUTE', 3: 'LEAD-ROUTE' } },
  5: { h: '3.4 Pre-screen', p: ['The system runs an indicative eligibility check using the credit policy in force. The result is indicative and is not a sanction.', 'Applicants below the bureau cut-off in the credit policy are not logged in.'], pol: { 2: 1 } },
  6: { h: '4. Login', p: ['4.1 Branch operations logs in the file with the application form, login fee and KYC within 4 working hours of receiving a complete set.', '4.2 The credit manager checks every login before it moves to credit. The person who logs in a file cannot check it.', '4.3 The system runs the internal dedupe and the CKYC search at login.'] },
  8: { h: '5. Credit bureau', p: ['5.1 Bureau reports are pulled for the applicant and every co-applicant at login.', '5.2 Prime applicants with a bureau score below 700 are referred as a deviation.'], pol: { 2: 1 } },
  9: { h: '6. Income documents', p: ['6.1 Salaried applicants submit salary slips for the last 3 months and Form 16 for the last 2 years. The credit manager verifies them within 1 working day.', '6.2 Self-employed applicants submit income tax returns for 2 years with computation, 12 months of bank statements and proof of business such as GST or Udyam registration.'] },
  10: { h: '6.3 Eligibility', p: ['Eligibility is calculated by the system using the FOIR and LTV limits of the credit policy in force.'] },
  11: { h: '7. Field investigation', p: ['7.1 Residence and office verification is done by the empanelled FI agency within 2 working days of initiation.'] },
  12: { h: '7.2 Fraud control', p: ['The FCU samples 100% of KYC documents, salary slips and bank statements, and reports within 2 working days.'] },
  13: { h: '7.3 Order of checks', p: ['Sanction is given only after the legal and technical reports are cleared.'] },
  14: { h: '8. Legal', p: ['8.1 The legal manager obtains a title search report and legal opinion from an empanelled advocate within 2 working days for the soft copy and 5 working days for the hard copy.', '8.2 For approved projects, a unit-level check of the allotment is enough. For resale, the advocate searches the chain of title for 13 years, or 30 years where records allow.', '8.3 A breach of the legal or technical turnaround is escalated to the regional credit manager after 1 working day and to the zonal credit manager after 3 working days.'] },
  15: { h: '9. Technical valuation', p: ['9.1 The technical manager appoints an empanelled valuer. The report is due within 3 working days of the site visit.', '9.2 Two independent technical reports are required for loan amounts above ₹50 lakh; the lower value is considered.'] },
  17: { h: '10. Personal discussion', p: ['10.1 The credit manager holds a personal discussion with every applicant within 1 working day of the verification reports.', '10.2 The credit manager records the discussion in the PD template and uploads photographs of the residence.'] },
  18: { h: '11. Credit memo', p: ['11.1 The credit manager prepares the credit memo within 1 working day. Deviations are flagged by the system from the credit policy.', '11.2 Underwriting is completed within 1 working day.', '11.3 Files with minor deviations get a second review by the regional credit manager within 1 working day.'] },
  19: { h: '12. Sanction authority', p: ['12.1 Files are routed to the sanctioning authority by loan amount and deviation.', '12.2 The regional credit manager may sanction up to ₹1 crore where there is no deviation.'] },
  21: { h: '13. Sanction letter', p: ['13.1 Branch operations issues the sanction letter with the key fact statement within 1 working day of sanction. The sanction is valid for 90 days.', '13.2 The RM communicates the sanction to the customer along with the key fact statement.'] },
  23: { h: '14. Before disbursement', p: ['14.1 Central operations collects the original title documents and lists OTC and PDD items within 2 working days.', '14.2 Central operations prepares the disbursement memo within 1 working day.', '14.3 The credit manager authorises the disbursement memo within 4 working hours. The person who prepares a memo cannot authorise it.'] },
  24: { h: '14.4 Hand-off', p: ['The system moves authorised files to the disbursement queue.'] }
};
const SPK = { 1: 'Tanvi Saxena', 2: 'Vikram Rao', 3: 'Swati Gokhale' };
const SPKR = { 1: 'LOS administrator', 2: 'Zonal credit manager, Pune', 3: 'Operations lead, Pune' };
const REC = [
  { id: 'r00', t: 0, sp: 1, o: 'Before we start: this call is recorded to map our home loan process. It stays within the company, and the audio is deleted once it is transcribed. Is that okay with both of you?', e: '' },
  { id: 'r01', t: 14, sp: 2, o: 'Haan, fine.', e: 'Yes, fine.' },
  { id: 'r02', t: 17, sp: 3, o: 'Yes, okay.', e: '' },
  { id: 'r03', t: 130, sp: 2, o: 'Lead toh RM hi daalta hai system mein, usi din, consent ke saath.', e: 'The RM enters the lead in the system the same day, with consent.' },
  { id: 'r04', t: 185, sp: 2, o: 'Phir system pre-screen chala deta hai, woh indicative hota hai bas.', e: 'Then the system runs the pre-screen; it is only indicative.' },
  { id: 'r05', t: 320, sp: 3, o: 'Login pe bureau sab applicants ka pull hota hai, co-applicants ka bhi.', e: 'At login the bureau is pulled for all applicants, co-applicants too.' },
  { id: 'r06', t: 465, sp: 2, o: 'SENP mein do saal ka ITR chahiye, with CA-certified P&L, aur twelve months ka bank statement.', e: 'For the self-employed we need 2 years of ITR with a CA-certified P&L, and 12 months of bank statements.' },
  { id: 'r07', t: 690, sp: 3, o: 'FI agency do din mein report de deti hai, mostly.', e: 'The FI agency usually reports within 2 days.' },
  { id: 'r08', t: 905, sp: 2, o: '75 lakh ke upar PD joint hoti hai, credit manager aur RCM dono.', e: 'Above ₹75 lakh the PD is joint: the credit manager and the RCM together.' },
  { id: 'r09', t: 1122, sp: 2, o: 'FCU negative aaya toh file hold, aur FCU head ko refer karte hain.', e: 'If the FCU report is negative, the file goes on hold and we refer it to the FCU head.' },
  { id: 'r10', t: 1290, sp: 2, o: 'APF project mein sirf unit-level check, resale mein poora chain of title.', e: 'For approved projects only a unit-level check; for resale the full chain of title.' },
  { id: 'r11', t: 1452, sp: 2, o: 'Policy mein 50 likha hai, but practically 75 lakh ke upar hi do valuation karte hain.', e: 'The policy says 50, but in practice we do two valuations only above ₹75 lakh.' },
  { id: 'r12', t: 1600, sp: 3, o: '[customer name] wala case yaad hai? Legal mein 6 din lag gaye the, RCM ko escalate karna pada.', e: 'Remember [customer name]’s case? Legal took 6 days and we had to escalate it to the RCM.', pii: 1 },
  { id: 'r13', t: 1790, sp: 2, o: 'APF cases mein hum pehle sanction de dete hain, subject to legal-technical.', e: 'For approved projects we give the sanction first, subject to legal and technical clearance.' },
  { id: 'r14', t: 1875, sp: 3, o: 'Sanction ke baad DSA partner customer ko amount confirm kar deta hai.', e: 'After the sanction, the DSA partner confirms the amount to the customer.' },
  { id: 'r15', t: 2020, sp: 3, o: 'Disbursement se pehle original title documents central ops collect karta hai, OTC list ke saath.', e: 'Before disbursement, central operations collects the original title documents, with the OTC list.' },
  { id: 'r16', t: 2165, sp: 3, o: 'DM banane mein ek din lagta hai, aur credit manager usko check karta hai.', e: 'Preparing the disbursement memo takes a day, and the credit manager checks it.' },
  { id: 'r17', t: 2450, sp: 1, o: 'Thank you both. I’ll share the draft map for your review.', e: '' }
];
const XLS = {
  1: { A: 'Sthira Home Finance: delegation of authority, retail mortgage, FY27' },
  2: { A: 'Sheet: HL Sanction Matrix. Approved by the Board Credit Committee on 30 Oct 2026. Effective 1 Jan 2027.' },
  4: { A: 'Amount band', B: 'From (₹ lakh)', C: 'To (₹ lakh)', D: 'No deviation', E: 'Minor deviation', F: 'Major deviation' },
  5: { A: 'Band 1', B: '0', C: '50', D: 'L1 Credit Manager', E: 'L2 Regional Credit Manager', F: 'L3 Zonal Credit Manager' },
  6: { A: 'Band 2', B: '50', C: '75', D: 'L2 Regional Credit Manager', E: 'L3 Zonal Credit Manager', F: 'L4 National Credit Head' },
  7: { A: 'Band 3', B: '75', C: '150', D: 'L3 Zonal Credit Manager', E: 'L4 National Credit Head', F: 'L4 and CRO, jointly' },
  8: { A: 'Band 4', B: '150', C: '500', D: 'L4 National Credit Head', E: 'L4 and CRO, jointly', F: 'Credit Committee' },
  9: { A: 'Band 5', B: '500', C: '', D: 'Credit Committee', E: 'Credit Committee', F: 'Credit Committee and MD' },
  11: { A: 'Notes' },
  12: { A: '1. Each band includes its upper limit.' },
  13: { A: '2. Joint personal discussion with the Regional Credit Manager for loans above ₹75 lakh.' },
  14: { A: '3. Minor deviation: one level up. Major deviation: two levels up.' }
};
const NOTE4 = ['From: Rajesh Pillai, head of operations. 14 Nov 2026.', '1. Branch operations collects the signed sanction letter within 2 working days of issue.', '2. Central operations checks the original title documents before the disbursement memo.', '3. OTC documents can be deferred for up to 30 days with approval from the regional credit manager.', '4. The credit manager re-pulls the bureau report if it is older than 30 days at sanction.'];
const NOTE4TXT = NOTE4.join('\n');

/* ---------------- stages, blocks and what the system extracts ---------------- */
const WSTG = [
  { id: 'g1', n: 'Lead and pre-screen', sla: { n: 0, u: 'sd' } },
  { id: 'g2', n: 'Login and KYC', sla: { n: 1, u: 'wd' } },
  { id: 'g3', n: 'Bureau and eligibility', sla: { n: 1, u: 'wd' } },
  { id: 'g4', n: 'Verification', sla: { n: 3, u: 'wd' } },
  { id: 'g5', n: 'Personal discussion', sla: { n: 2, u: 'wd' } },
  { id: 'g6', n: 'Underwriting and credit memo', sla: { n: 1, u: 'wd' }, src: [{ s: 'S1', p: 18, i: 2, q: 'Underwriting is completed within 1 working day' }] },
  { id: 'g7', n: 'Sanction', sla: { n: 1, u: 'wd' } },
  { id: 'g8', n: 'Sanction letter and acceptance', sla: { n: 5, u: 'wd' } },
  { id: 'g9', n: 'Before disbursement and hand-off', sla: { n: 4, u: 'wd' } }
];
const BLK = { par: { t: 'par', n: 'In parallel' }, app: { t: 'br', n: 'Depends on the applicant' }, apf: { t: 'br', n: 'Depends on the property' }, lsrc: { t: 'br', n: 'Depends on the lead source' } };
const R1 = (p, i, q) => ({ s: 'S1', p, i, q }), R2 = (t, q) => ({ s: 'S2', t, q }), R3 = (c, q) => ({ s: 'S3', c, q }), R4 = (l, q) => ({ s: 'S4', l, q });
const XT = [
  { id: 'T1', g: 'g1', n: 'Capture the lead with consent for the credit report', r: 'rm', sla: { n: 0, u: 'sd' }, src: [R1(4, 2, 'capture the lead on the day of first contact'), R2(130, 'usi din, consent ke saath')] },
  { id: 'T2', g: 'g1', n: 'Run the pre-screen: indicative eligibility from the credit policy', r: 'sys', sla: { n: 0, u: 'auto' }, src: [R1(5, 1, 'runs an indicative eligibility check'), R2(185, 'system pre-screen chala deta hai')] },
  { id: 'T3', g: 'g2', n: 'Log in the file: application form, login fee and KYC', r: 'bops', sla: { n: 4, u: 'wh' }, mk: 'm', pk: 'login', src: [R1(6, 1, 'logs in the file with the application form, login fee and KYC within 4 working hours')] },
  { id: 'T4', g: 'g2', n: 'Check the login', r: 'cm', sla: { n: 4, u: 'wh' }, mk: 'c', pk: 'login', src: [R1(6, 2, 'checks every login before it moves to credit')] },
  { id: 'T5', g: 'g2', n: 'Run the internal dedupe and the CKYC search', r: 'sys', sla: { n: 0, u: 'auto' }, integ: 1, src: [R1(6, 3, 'runs the internal dedupe and the CKYC search')] },
  { id: 'T6', g: 'g3', n: 'Pull bureau reports for the applicant and co-applicants', r: 'sys', sla: { n: 0, u: 'auto' }, integ: 1, src: [R1(8, 1, 'pulled for the applicant and every co-applicant'), R2(320, 'co-applicants ka bhi')] },
  { id: 'T7a', g: 'g3', blk: 'app', arm: 'Salaried', n: 'Verify salary slips for 3 months and Form 16 for 2 years', r: 'cm', sla: { n: 1, u: 'wd' }, src: [R1(9, 1, 'salary slips for the last 3 months and Form 16 for the last 2 years')] },
  { id: 'T7b', g: 'g3', blk: 'app', arm: 'Self-employed', n: 'Verify 2 years of ITR with computation and 12 months of bank statements', r: 'cm', sla: { n: 1, u: 'wd' }, src: [R1(9, 2, 'income tax returns for 2 years with computation'), R2(465, 'do saal ka ITR chahiye, with CA-certified P&L')], via: { S2: { n: 'Verify 2 years of ITR with a CA-certified P&L, and 12 months of bank statements' } } },
  { id: 'T8', g: 'g3', n: 'Calculate eligibility from the FOIR and LTV limits of the credit policy', r: 'sys', sla: { n: 0, u: 'auto' }, src: [R1(10, 1, 'calculated by the system using the FOIR and LTV limits')] },
  { id: 'T9', g: 'g4', blk: 'par', n: 'Field investigation of residence and office', r: 'fi', sla: { n: 2, u: 'wd' }, src: [R1(11, 1, 'within 2 working days of initiation'), R2(690, 'do din mein report de deti hai')] },
  { id: 'T10', g: 'g4', blk: 'par', n: 'FCU sampling: 100% of KYC, salary slips and bank statements', r: 'fcu', sla: { n: 2, u: 'wd' }, src: [R1(12, 1, 'samples 100% of KYC documents, salary slips and bank statements')] },
  { id: 'T11', g: 'g4', blk: 'par', n: 'Title search and legal opinion from an empanelled advocate', r: 'lgl', sla: { n: 2, u: 'wd' }, note: 'Approved projects: a unit-level check is enough. Resale: chain of title for 13 years, or 30 where records allow.', src: [R1(14, 1, 'title search report and legal opinion from an empanelled advocate'), R1(14, 2, 'chain of title for 13 years'), R2(1290, 'resale mein poora chain of title')] },
  { id: 'T12', g: 'g4', blk: 'par', n: 'Technical valuation; two reports above ₹50 lakh', r: 'tech', sla: { n: 3, u: 'wd' }, src: [R1(15, 1, 'report is due within 3 working days of the site visit'), R1(15, 2, 'Two independent technical reports are required for loan amounts above ₹50 lakh'), R2(1452, '75 lakh ke upar hi do valuation karte hain')] },
  { id: 'T13e', g: 'g4', exc: 1, n: 'Escalate a late legal or technical report: to the RCM after 1 working day, the ZCM after 3', r: 'sys', sla: { n: 0, u: 'auto' }, src: [R1(14, 3, 'escalated to the regional credit manager after 1 working day'), R2(1600, 'RCM ko escalate karna pada')] },
  { id: 'T13', g: 'g4', exc: 1, n: 'Negative FCU report: hold the file and refer it to the FCU head', r: 'fcuh', sla: { n: 1, u: 'wd' }, src: [R2(1122, 'file hold, aur FCU head ko refer karte hain')] },
  { id: 'T14', g: 'g4', exc: 1, inf: 1, n: 'Valuation more than 10% below the agreed price: refer to the zonal credit manager', r: 'zcm', sla: { n: 1, u: 'wd' }, src: [], why: 'Added from the exception checklist. None of the sources says what happens when a valuation comes in short.' },
  { id: 'T15', g: 'g5', n: 'Personal discussion with the applicant', r: 'cm', sla: { n: 1, u: 'wd' }, src: [R1(17, 1, 'holds a personal discussion with every applicant within 1 working day')] },
  { id: 'T16', g: 'g5', cond: 'Loan above ₹75 lakh', n: 'Joint personal discussion with the regional credit manager', r: 'rcm', sla: null, src: [R3('A13', 'Joint personal discussion with the Regional Credit Manager for loans above ₹75 lakh'), R2(905, '75 lakh ke upar PD joint hoti hai')] },
  { id: 'T17', g: 'g6', n: 'Prepare the credit memo; the system flags deviations', r: 'cm', sla: { n: 1, u: 'wd' }, src: [R1(18, 1, 'prepares the credit memo within 1 working day')] },
  { id: 'T18', g: 'g6', inf: 1, integ: 1, n: 'Re-pull the bureau report if it is older than 30 days at sanction', r: 'sys', sla: { n: 0, u: 'auto' }, src: [R4(4, 're-pulls the bureau report if it is older than 30 days')], why: 'Common practice, but none of the SOP, the recording or the matrix says it.' },
  { id: 'T19', g: 'g6', cond: 'Minor deviations', n: 'Second review of the memo by the regional credit manager', r: 'rcm', sla: { n: 1, u: 'wd' }, src: [R1(18, 3, 'second review by the regional credit manager within 1 working day')] },
  { id: 'T20', g: 'g7', n: 'Route the file to the sanctioning authority by amount and deviation', r: 'sys', sla: { n: 0, u: 'auto' }, src: [R1(19, 1, 'routed to the sanctioning authority by loan amount and deviation'), R3('D4', 'No deviation')] },
  { id: 'T21', g: 'g7', sanc: 1, cond: 'After legal and technical clearance', n: 'Sanction or decline within the authority’s limit', r: 'appr', sla: { n: 1, u: 'wd' }, src: [R1(13, 1, 'only after the legal and technical reports are cleared'), R1(19, 2, 'may sanction up to ₹1 crore'), R3('D6', 'L2 Regional Credit Manager')] },
  { id: 'T21b', g: 'g7', opt: 1, sanc: 1, blk: 'apf', arm: 'Approved project (APF)', cond: 'Subject to legal and technical clearance', n: 'Give a conditional sanction', r: 'appr', sla: { n: 1, u: 'wd' }, src: [R2(1790, 'pehle sanction de dete hain, subject to legal-technical')] },
  { id: 'T22', g: 'g8', n: 'Issue the sanction letter and key fact statement, valid for 90 days', r: 'bops', sla: { n: 1, u: 'wd' }, src: [R1(21, 1, 'issues the sanction letter with the key fact statement within 1 working day')] },
  { id: 'T23', g: 'g8', comm: 1, n: 'Tell the customer about the sanction, with the key fact statement', r: 'rm', sla: { n: 0, u: 'sd' }, src: [R1(21, 2, 'The RM communicates the sanction to the customer'), R2(1875, 'DSA partner customer ko amount confirm kar deta hai')] },
  { id: 'T24', g: 'g8', inf: 1, n: 'Follow up on the customer’s acceptance', r: '', sla: null, src: [R4(1, 'collects the signed sanction letter within 2 working days of issue')], why: 'The SOP says a sanction is valid for 90 days, but no step follows up the customer’s acceptance.', via: { S4: { n: 'Collect the signed sanction letter', r: 'bops', sla: { n: 2, u: 'wd' } } } },
  { id: 'T25', g: 'g9', n: 'Collect the original title documents and list OTC and PDD items', r: 'cops', sla: { n: 2, u: 'wd' }, src: [R1(23, 1, 'collects the original title documents and lists OTC and PDD items'), R2(2020, 'original title documents central ops collect karta hai'), R4(2, 'checks the original title documents before the disbursement memo')] },
  { id: 'T26', g: 'g9', exc: 1, cond: 'OTC documents', n: 'Defer OTC documents for up to 30 days with the regional credit manager’s approval', r: 'rcm', sla: { n: 1, u: 'wd' }, src: [R4(3, 'deferred for up to 30 days with approval from the regional credit manager')] },
  { id: 'T27', g: 'g9', mk: 'm', pk: 'dm', n: 'Prepare the disbursement memo', r: 'cops', sla: { n: 1, u: 'wd' }, src: [R1(23, 2, 'prepares the disbursement memo within 1 working day'), R2(2165, 'DM banane mein ek din lagta hai')] },
  { id: 'T28', g: 'g9', mk: 'c', pk: 'dm', n: 'Authorise the disbursement memo', r: 'cm', sla: { n: 4, u: 'wh' }, src: [R1(23, 3, 'authorises the disbursement memo within 4 working hours'), R2(2165, 'credit manager usko check karta hai')] },
  { id: 'T29', g: 'g9', n: 'Hand off to the disbursement queue', r: 'sys', sla: { n: 0, u: 'auto' }, src: [R1(24, 1, 'moves authorised files to the disbursement queue')] }
];

/* ---------------- the workflow as a flowchart: stages, steps, decisions, parallel work ---------------- */
/* flowchart wording for steps that sit on a branch */
const FLN = { T13: 'Hold the file and refer it to the FCU head', T14: 'Refer the file to the zonal credit manager', T21: 'Sanction or decline after legal and technical clearance', T21b: 'Conditional sanction, subject to legal and technical clearance', T26: 'Defer them for up to 30 days with the RCM’s approval' };
const FLOWDEF = [
  { g: 'g1', items: ['T1', 'T2'] },
  { g: 'g2', items: ['T3', 'T4', 'T5'] },
  { g: 'g3', items: ['T6', { dec: 'D3', q: 'Salaried or self-employed?', arms: [['Salaried', ['T7a']], ['Self-employed', ['T7b']]] }, 'T8'] },
  { g: 'g4', items: [{ par: 'P4', lanes: ['T9', 'T10', 'T11', 'T12'], noteOf: 'T13e', note: 'A late legal or technical report is escalated to the regional credit manager after 1 working day, and to the zonal credit manager after 3.' }, { dec: 'D4a', q: 'FCU report negative?', arms: [['Yes', ['T13']], ['No', []]] }, { dec: 'D4b', q: 'Valuation more than 10% below the price?', inf: 1, arms: [['Yes', ['T14']], ['No', []]] }] },
  { g: 'g5', items: ['T15', { dec: 'D5', q: 'Loan above ₹75 lakh?', arms: [['Yes', ['T16']], ['No', []]] }] },
  { g: 'g6', items: ['T17', 'T18', { dec: 'D6', q: 'Any minor deviations?', arms: [['Yes', ['T19']], ['No', []]] }] },
  { g: 'g7', items: ['T20', { dec: 'D7', q: 'Approved project?', arms: [['Yes', ['T21b']], ['No', ['T21']]] }] },
  { g: 'g8', items: ['T22', 'T23', 'T24'] },
  { g: 'g9', items: ['T25', { dec: 'D9', q: 'Any OTC documents pending?', arms: [['Yes', ['T26']], ['No', []]] }, 'T27', 'T28', 'T29'] }
];
/* questions the system raises while building the flowchart in onboarding */
const FFLAG = {
  T12: { need: ['S1', 'S2'], k: 'conf', l: 'Sources disagree', title: 'Two valuations above ₹50 lakh or ₹75 lakh?', text: 'The SOP and the recording give different thresholds.', sides: [R1(15, 2, 'Two independent technical reports are required for loan amounts above ₹50 lakh'), R2(1452, 'Policy mein 50 likha hai, but practically 75 lakh ke upar hi do valuation karte hain')],
    opts: [['a', 'Use the SOP: above ₹50 lakh', 'Technical valuation; two reports above ₹50 lakh'], ['b', 'Use the recording: above ₹75 lakh', 'Technical valuation; two reports above ₹75 lakh']], sug: 'a', sugWhy: 'The SOP is board-approved; the recording describes what one zone does in practice.' },
  T23: { need: ['S1', 'S2'], k: 'pol', l: 'Policy check', title: 'Who tells the customer about the sanction?', text: 'The SOP says the RM; the recording says the DSA partner does it.', sides: [R1(21, 2, 'The RM communicates the sanction to the customer'), R2(1875, 'Sanction ke baad DSA partner customer ko amount confirm kar deta hai')],
    opts: [['a', 'Keep the SOP: the RM tells the customer'], ['b', 'Let the DSA tell the customer', '', 'Not allowed. The sanction and its communication stay with an employee under the RBI’s outsourcing directions.']], sug: 'a', sugWhy: 'An employee must communicate the sanction. The DSA can be told afterwards.' },
  D4b: { k: 'inf', l: 'Not in any source', title: 'Keep this check?', text: 'Added from Uncia’s exception library. None of your sources says what happens when a valuation comes in short of the price.', opts: [['keep', 'Keep it'], ['drop', 'Remove it']], sug: 'keep', sugWhy: 'Most lenders refer a big shortfall up a level.' },
  T24: { noSrc: 'S4', k: 'own', l: 'No owner', title: 'Who follows up the customer’s acceptance?', text: 'The SOP says a sanction is valid for 90 days, but no step follows up the signed acceptance. Pick an owner.', opts: [['bops', 'Branch operations'], ['rm', 'Sales RM'], ['cm', 'Credit manager, L1']], sug: 'bops', sugWhy: 'Branch operations issues the letter, so it can collect the signed copy.' }
};

/* ---------------- the credit policy, read into rules and limits ---------------- */
const PDOC = { n: 'Home Loan Credit Policy v12.pdf', pages: 42, meta: '42 pages. Approved by the Board Credit Committee on 30 Oct 2026', hash: '9f21c4d07a' };
const PCAT = [['elig', 'Who can borrow', '3'], ['bur', 'Credit bureau', '5'], ['foir', 'Repayment capacity (FOIR)', '6'], ['ltv', 'Loan to value (LTV)', '7'], ['prop', 'Property and valuation', '8'], ['auth', 'Sanction authority', '10'], ['dev', 'Deviations', '11'], ['model', 'Deviation model', '12']];
const PRULES = [
  { id: 'agemin', c: 'elig', n: 'Minimum age when applying', u: 'yr', v: 21, src: [6, '3.1', 'Applicants and co-applicants must be at least 21 years old on the date of application.'] },
  { id: 'agesal', c: 'elig', n: 'Maximum age when the loan ends, salaried', u: 'yr', p: 'age.salaried', src: [6, '3.2', 'The loan must be fully repaid by the age of 60 for salaried applicants.'] },
  { id: 'agese', c: 'elig', n: 'Maximum age when the loan ends, self-employed', u: 'yr', p: 'age.selfemp', src: [6, '3.2', 'Self-employed applicants must repay the loan by the age of 65.'] },
  { id: 'incp', c: 'elig', n: 'Minimum eligible monthly income, prime', u: 'inr', p: 'minInc.prime', src: [7, '3.4', 'Eligible household income of at least ₹25,000 a month for prime loans.'] },
  { id: 'inca', c: 'elig', n: 'Minimum eligible monthly income, affordable', u: 'inr', p: 'minInc.affordable', src: [7, '3.4', 'Eligible household income of at least ₹12,000 a month for affordable loans.'] },
  { id: 'tenp', c: 'elig', n: 'Longest tenure, prime', u: 'mo', p: 'tenure.prime', src: [7, '3.5', 'Tenure of up to 360 months for prime loans.'] },
  { id: 'tena', c: 'elig', n: 'Longest tenure, affordable', u: 'mo', p: 'tenure.affordable', src: [7, '3.5', 'Tenure of up to 240 months for affordable loans.'] },
  { id: 'exps', c: 'elig', n: 'Minimum work experience, salaried', u: 'yr', v: 2, src: [8, '3.6', 'Salaried applicants need at least 2 years of total work experience.'] },
  { id: 'vinb', c: 'elig', n: 'Minimum business vintage, self-employed', u: 'yr', v: 3, src: [8, '3.6', 'Self-employed applicants need at least 3 years in the same business.'] },
  { id: 'resi', c: 'elig', n: 'Resident Indians only', u: 'bool', v: true, src: [8, '3.7', 'Loans are offered to resident Indians only.'] },
  { id: 'scmin', c: 'bur', n: 'Minimum bureau score', u: 'n', p: 'dev.scoreMin', src: [11, '5.2', 'Prime applicants with a bureau score below 700 are referred as a deviation.'] },
  { id: 'scl2', c: 'bur', n: 'Lowest score the L2 approver can accept', u: 'n', p: 'dev.scoreL2', src: [11, '5.3', 'The L2 approver may accept scores down to 650.'] },
  { id: 'scl3', c: 'bur', n: 'Lowest score the L3 approver can accept; below it is a hard stop', u: 'n', p: 'dev.scoreL3', src: [11, '5.3', 'The L3 approver may accept scores down to 600. Below 600 the file is declined.'] },
  { id: 'enq', c: 'bur', n: 'Credit enquiries in the last 6 months before a referral', u: 'n', v: null, onbV: null, liveV: 6, ask: 'The policy says “too many recent enquiries” without a number. Set one.', src: [11, '5.4', 'Applicants with too many recent enquiries are referred to the credit manager.'] },
  { id: 'foir', c: 'foir', n: 'FOIR caps by income programme and monthly income', u: 'grid', grid: 'foir', src: [13, '6.2', 'FOIR shall not exceed the caps in table 6.2, by income programme and eligible monthly income.'] },
  { id: 'ltvrbi', c: 'ltv', n: 'RBI caps, by loan size', u: 'rbi', src: [15, '7.1', 'LTV shall not exceed 90% up to ₹30 lakh, 80% from ₹30 lakh to ₹75 lakh, and 75% above ₹75 lakh, as set by the RBI.'] },
  { id: 'ltv', c: 'ltv', n: 'LTV caps by property type and loan size', u: 'grid', grid: 'ltv', src: [15, '7.2', 'Within the RBI caps, LTV shall not exceed the caps in table 7.2, by property type and loan size.'] },
  { id: 'dual', c: 'prop', n: 'Two valuations for loans above', u: 'lakh', p: 'dualAbove', src: [18, '8.2', 'Two independent technical reports are required for loan amounts above ₹50 lakh.'] },
  { id: 'valvar', c: 'prop', n: 'Two valuations may differ by up to', u: 'pct', p: 'valVar', src: [18, '8.3', 'Where the two valuations differ by more than 10%, a third valuation is ordered.'] },
  { id: 'pltol', c: 'prop', n: 'Deviation from the approved plan within tolerance', u: 'pct', p: 'dev.planTol', src: [19, '8.5', 'Deviations from the approved plan of up to 10% are within tolerance.'] },
  { id: 'plmax', c: 'prop', n: 'Plan deviation the L2 approver can accept', u: 'pct', p: 'dev.planMax', src: [19, '8.5', 'The L2 approver may accept plan deviations of up to 20%.'] },
  { id: 'blife', c: 'prop', n: 'Building life left must cover the loan tenure', u: 'bool', v: true, src: [19, '8.6', 'The residual life of the building shall be at least the tenure of the loan.'] },
  { id: 'ocrs', c: 'prop', n: 'Occupancy certificate needed for resale flats', u: 'bool', v: true, src: [19, '8.7', 'Resale flats must have an occupancy certificate on file.'] },
  { id: 'sysa', c: 'auth', n: 'The system sanctions clean files up to', u: 'lakh', p: 'sysAuth', src: [24, '10.1', 'Files that meet every rule, with no deviation or check, may be sanctioned by the system up to ₹75 lakh.'] },
  { id: 'l1', c: 'auth', n: 'L1, credit manager, sanctions up to', u: 'lakh', p: 'auth.L1', src: [24, '10.2', 'L1, the credit manager, sanctions up to ₹50 lakh.'] },
  { id: 'l2', c: 'auth', n: 'L2, regional credit manager, sanctions up to', u: 'lakh', p: 'auth.L2', src: [24, '10.2', 'L2, the regional credit manager, sanctions up to ₹75 lakh.'] },
  { id: 'l3', c: 'auth', n: 'L3, zonal credit manager, sanctions up to', u: 'lakh', p: 'auth.L3', src: [24, '10.2', 'L3, the zonal credit manager, sanctions up to ₹1.5 crore; L4 above that.'] },
  { id: 'bump', c: 'auth', n: 'Items needing approval that move a file up one level', u: 'n', p: 'bump', src: [24, '10.3', 'Three or more items needing approval move the file one level up.'] },
  { id: 'dfl1', c: 'dev', n: 'FOIR over the cap the L1 credit manager can approve', u: 'pts', p: 'dev.foirL1', src: [26, '11.1', 'FOIR up to 3 points over the cap may be approved by L1.'] },
  { id: 'dfl2', c: 'dev', n: 'FOIR over the cap the L2 approver can approve', u: 'pts', p: 'dev.foirL2', src: [26, '11.1', 'FOIR up to 5 points over the cap may be approved by L2.'] },
  { id: 'dfl3', c: 'dev', n: 'FOIR over the cap the L3 approver can approve', u: 'pts', p: 'dev.foirL3', src: [26, '11.1', 'FOIR up to 10 points over the cap may be approved by L3. More is a hard stop.'] },
  { id: 'dltv', c: 'dev', n: 'LTV over the policy cap the L2 approver can approve', u: 'pts', p: 'dev.ltvL2', src: [26, '11.2', 'LTV up to 5 points over the policy cap may be approved by L2; above that L3, never over the RBI cap.'] },
  { id: 'dage', c: 'dev', n: 'Years over the age limit the L2 approver can approve', u: 'yr', p: 'dev.ageL2', src: [27, '11.3', 'Up to 5 years over the age limit, where the income continues, may be approved by L2.'] },
  { id: 'mon', c: 'model', n: 'Deviation model switched on', u: 'bool', p: 'model.on', src: [29, '12.1', 'Deviations within the model’s scope are scored by model HL-DEV before a person decides.'] },
  { id: 'mapp', c: 'model', n: 'Recommends approval when the predicted risk is at or below', u: 'pct', p: 'model.approve', src: [29, '12.2', 'The model recommends approval at a predicted risk of 3.0% or less.'] },
  { id: 'mrej', c: 'model', n: 'Recommends rejection when the predicted risk is at or above', u: 'pct', p: 'model.reject', src: [29, '12.2', 'The model recommends rejection at 8.0% or more. In between, a person decides.'] }
];

/* ---------------- API calls and the vendors that serve them ---------------- */
const APIV = {
  cibil: 'TransUnion CIBIL', exp: 'Experian', eqf: 'Equifax', crif: 'CRIF High Mark',
  itd: 'Income Tax Department', uidai: 'UIDAI', cersai: 'CERSAI', gstn: 'GSTN',
  satya: 'Satya ID', pehchaan: 'Pehchaan Vision', sangam: 'Sangam AA', pravah: 'Pravah AA', ganit: 'Ganit Analytics', ledger: 'Ledgerwise', kavach: 'Kavach Risk', sentinel: 'Sentinel Fraud Check', mohar: 'Mohar eSign', akshar: 'Akshar eSign', dhara: 'Dhara Payments'
};
const APIG = ['Identity and KYC', 'Credit', 'Income and banking', 'Fraud and property', 'Signing and payments'];
const APIC = [
  { id: 'pan', g: 0, n: 'PAN verification', use: 'Pre-screen and login', v: ['itd', 'satya'], pri: 'itd', bak: 'satya', on: 1 },
  { id: 'aadhaar', g: 0, n: 'Aadhaar e-KYC', use: 'Pre-screen', v: ['uidai', 'satya'], pri: 'uidai', bak: '', on: 1 },
  { id: 'ckyc', g: 0, n: 'CKYC search and download', use: 'Login', v: ['cersai', 'satya'], pri: 'cersai', bak: 'satya', on: 1 },
  { id: 'face', g: 0, n: 'Face match and liveness', use: 'Video KYC', v: ['pehchaan', 'satya'], pri: 'pehchaan', bak: 'satya', on: 0 },
  { id: 'bureau', g: 1, n: 'Credit bureau report', use: 'Pre-screen and before sanction', v: ['cibil', 'exp', 'eqf', 'crif'], pri: 'cibil', bak: 'exp', on: 1 },
  { id: 'aa', g: 2, n: 'Account Aggregator: bank data', use: 'Pre-screen', v: ['sangam', 'pravah'], pri: 'sangam', bak: 'pravah', on: 1 },
  { id: 'bsa', g: 2, n: 'Bank statement analysis', use: 'Pre-screen and underwriting', v: ['ganit', 'ledger'], pri: 'ganit', bak: 'ledger', on: 1 },
  { id: 'itr', g: 2, n: 'ITR and Form 26AS', use: 'Underwriting, self-employed', v: ['satya', 'ganit'], pri: 'satya', bak: 'ganit', on: 1 },
  { id: 'gst', g: 2, n: 'GST returns', use: 'Underwriting, self-employed', v: ['gstn', 'satya'], pri: 'gstn', bak: 'satya', on: 1 },
  { id: 'epfo', g: 2, n: 'Employment check (EPFO)', use: 'Underwriting, salaried', v: ['satya', 'ledger'], pri: 'satya', bak: '', on: 1 },
  { id: 'fraud', g: 3, n: 'Fraud and dedupe check', use: 'Login', v: ['kavach', 'sentinel'], pri: 'kavach', bak: 'sentinel', on: 1 },
  { id: 'cersai', g: 3, n: 'CERSAI charge search', use: 'Underwriting', v: ['cersai'], pri: 'cersai', bak: '', on: 1 },
  { id: 'esign', g: 4, n: 'e-Sign', use: 'Application form and sanction letter', v: ['mohar', 'akshar'], pri: 'mohar', bak: 'akshar', on: 1 },
  { id: 'enach', g: 4, n: 'e-NACH mandate', use: 'Before disbursement', v: ['dhara'], pri: 'dhara', bak: '', on: 1 }
];

/* ---------------- samples for changing the live setup ---------------- */
const VNOTE = { n: 'Voice note from Meera Nair, head of credit', meta: '1:12. Hindi and English. Fri 13 Nov 2026, 17:40', who: 'Meera Nair', dur: 72,
  segs: [{ t: 0, o: 'Tanvi, credit committee se teen changes hain.', e: 'Tanvi, three changes from the credit committee.' },
    { t: 6, o: 'One: salaried customers jinki income ek lakh se upar hai, unka FOIR cap wapas 55 percent kar do.', e: 'One: for salaried customers earning above one lakh a month, take the FOIR cap back to 55 percent.' },
    { t: 24, o: 'Two: any file above 75 lakh needs a site visit by the credit manager before sanction.', e: '' },
    { t: 41, o: 'Three: bank statement analysis ke liye Ledgerwise ko primary bana do. Ganit is timing out a lot.', e: 'Three: make Ledgerwise the primary vendor for bank statement analysis. Ganit is timing out a lot.' },
    { t: 63, o: 'Monday se, please.', e: 'From Monday, please.' }] };
const CIRC = { n: 'Credit circular CC-2026-14.pdf', meta: '2 pages. Issued 12 Nov 2026 by the credit policy team', who: 'Credit circular CC-2026-14',
  lines: ['1. The minimum bureau score for prime applicants is raised from 700 to 720.', '2. Two technical valuations are required for loans above ₹75 lakh, in place of ₹50 lakh.', '3. LTV for self-construction loans from ₹30 lakh to ₹75 lakh is reduced from 75% to 70%.', '4. These changes apply to files logged in from 1 December 2026.'] };
const TXTSUG = ['Set the minimum bureau score to 720', 'Make Experian the primary credit bureau', 'Change the legal opinion turnaround to 3 working days', 'Add a site visit by the credit manager for loans above 75 lakh'];

/* =====================================================================
   v6: the Admin page. Three jobs, two views.
   1. Workflow: audio, text and documents become an editable flowchart.
   2. Policy rules: the credit policy becomes a list of editable rules.
   3. Vendors and APIs: which vendor serves each call, and the backup.
   Onboarding starts from nothing; Live setup changes what is running.
   Every change is logged in one hash-chained audit trail.
   ===================================================================== */
Object.assign(ICO, {
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', dn: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', dia: '<path d="M12 3l9 9-9 9-9-9z"/>'
});
let ADM = null;
const AREA = { wf: 'Workflow', pol: 'Policy rules', api: 'Vendors and APIs', setup: 'Setup' };
const mmss = t => String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(Math.floor(t % 60)).padStart(2, '0');
function slaTxt(s) { if (!s) return 'No turnaround'; if (s.u === 'auto') return 'Automatic'; if (s.u === 'sd') return 'Same day'; if (s.u === 'min') return plural(s.n, 'minute'); return plural(s.n, s.u === 'wh' ? 'working hour' : 'working day'); }
const rn = k => k ? (WROLE[k] ? WROLE[k].n : k) : 'No owner';
const short = (s, n) => s.length > (n || 46) ? s.slice(0, (n || 46) - 1).replace(/[\s,;:]+\S*$/, '') + '…' : s;
const SRCIC = { S1: 'file', S2: 'mic', S3: 'grid', S4: 'text', T: 'text' };
function refLbl(r) { return r.s === 'S1' ? 'SOP, page ' + r.p : r.s === 'S2' ? 'Recording, ' + mmss(r.t) : r.s === 'S3' ? 'Matrix, cell ' + r.c : r.s === 'S4' ? 'Operations note, line ' + r.l : 'Your text, line ' + r.l; }

/* ---------------- audit trail with a hash chain ---------------- */
function h32(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
const audKey = e => [e.prev, e.at, e.who, e.view, e.area, e.what, e.b || '', e.a || '', e.why || '', e.src || ''].join('|');
function alog2(e) { e = Object.assign({ who: ADMIN.name, role: 'LOS administrator', view: ADM.mode }, e); if (!e.at) e.at = tick(1); e.prev = ADM.aud.length ? ADM.aud[ADM.aud.length - 1].h : '00000000'; e.h = h32(audKey(e)); ADM.aud.push(e); return e; }
function verifyAud() { let prev = '00000000'; for (const e of ADM.aud) { if (e.prev !== prev || h32(audKey(e)) !== e.h) return false; prev = e.h; } return true; }
function seedAud() {
  [['2026-04-01 00:00', 'System', 'Scheduler', 'wf', 'Workflow version 2.3 went live', '', '', 'Approved by the process owners on 26 Mar 2026'],
   ['2026-09-18 15:10', ADMIN.name, 'LOS administrator', 'api', 'Credit bureau report: if it fails, use', 'None', 'Experian', 'A second bureau for when CIBIL is down'],
   ['2026-10-06 11:30', ADMIN.name, 'LOS administrator', 'wf', 'Turnaround of “Field investigation of residence and office”', '3 working days', '2 working days', 'New FI agency contract from October'],
   ['2026-11-03 18:00', 'Arjun Menon', 'Head of Credit Policy', 'pol', 'FOIR, salaried, income above ₹1,00,000', '55%', '60%', 'Policy version 12, made by Ananya Rao'],
   ['2026-11-12 16:40', ADMIN.name, 'LOS administrator', 'api', 'Face match and liveness', 'In use', 'Not in use', 'Video KYC paused while the vendor is re-certified']
  ].forEach(([at, who, role, area, what, b, a, why]) => alog2({ at, who, role, view: 'live', area, what, b, a, why }));
}

/* ---------------- state ---------------- */
function initAdmin() {
  if (typeof S === 'undefined') return;
  ADM = { mode: 'onb', sec: 'wf', nid: 0, sel: null, aud: [], af: 'all', av: 'all', pf: 'all', pq: null, ps: '', why: '', src: '', needWhy: 0, showCh: 0,
    onb: { src: {}, txt: '', phase: 'pick', step: 0, wf: null, polOn: 0, polPhase: 'pick', polStep: 0, pol: null, loc: null, api: deep(APIC), apiOk: 0, live: 0 },
    live: { wf: null, wfW: null, ver: '2.3', api: deep(APIC) },
    loc: {}, pe: {}, le: {}, ae: {},
    ik: { k: null, phase: 'pick', step: 0, props: [], miss: [], txt: '', pt: 0, play: 0, added: '' } };
  PRULES.forEach(r => { if (!r.p && r.u !== 'grid' && r.u !== 'rbi') ADM.loc[r.id] = r.liveV !== undefined ? r.liveV : r.v; });
  ADM.live.wf = buildFlow(['S1', 'S2', 'S3', 'S4'], '', true); ADM.live.wf.flags = {}; ADM.live.wfW = deep(ADM.live.wf);
  seedAud();
}
const ONB = () => ADM.mode === 'onb';
const GOLIVE = 'Tuesday 1 December 2026, at 8:00';
const curFlow = () => ONB() ? ADM.onb.wf : ADM.live.wfW;

/* ---------------- text parsing (shared with the old studio) ---------------- */
const STGK = [[/lead|pre-?screen|enquir/, 'g1'], [/login|log in|kyc|dedupe|application form/, 'g2'], [/bureau|eligib|salary|itr|income|form 16/, 'g3'], [/field investigation|\bfi\b|fcu|fraud|legal|title search|technical|valuation|valuer|site visit/, 'g4'], [/personal discussion|\bpd\b/, 'g5'], [/credit memo|\bcam\b|underwrit|deviation/, 'g6'], [/sanction letter|key fact|\bkfs\b|acceptance/, 'g8'], [/disburs|otc|pdd|title documents/, 'g9'], [/sanction/, 'g7']];
const NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 };
function findRole(s) { s = ' ' + s.toLowerCase() + ' '; for (const [re, k] of RSYN) if (re.test(s)) return k; return ''; }
function findSla(s) { const l = s.toLowerCase(); if (/same day/.test(l)) return { n: 0, u: 'sd' }; const m = l.match(/(?:within|to|in)\s+(\d+|one|two|three|four|five|six|seven)\s+(working\s+)?(hours?|days?|minutes?)/); if (!m) return null; const n = +m[1] || NUMW[m[1]]; return { n, u: /hour/.test(m[3]) ? 'wh' : /minute/.test(m[3]) ? 'min' : 'wd' }; }
function findStage(s) { const l = s.toLowerCase(); for (const [re, g] of STGK) if (re.test(l)) return g; return ''; }
const vbase = f => f.replace(/ies$/, 'y').replace(/(ch|sh|x)es$/, '$1').replace(/s$/, '');
const VERBS = /^(upload|send|check|record|collect|issue|prepare|update|inform|tell|verif|review|approve|sign|share|call|escalate|refer|hold|run|log|move|pull|raise|get|take|make|notif|confirm|attach|scan|store|forward|mark|enter|assign|close|book|schedul|request|follow)/i;
function imper(s) { const w = s.split(' '), f = w[0]; if (/^(does)$/i.test(f)) w[0] = 'do'; else if (/^has$/i.test(f)) w[0] = 'have'; else if (/[^s]s$/.test(f) && !/(ss|us|is)$/.test(f)) w[0] = vbase(f);
  for (let i = 1; i < w.length - 1; i++) if (w[i] === 'and' && /[^s]s$/.test(w[i + 1]) && VERBS.test(w[i + 1])) w[i + 1] = vbase(w[i + 1]);
  return cap1(w.join(' ')); }
function parseLine(line, g0) {
  const raw = line.replace(/^\s*(\d+(\.\d+)*[.)]?\s+|[-*•]\s*)/, '').trim(); if (raw.length < 12) return null;
  const r = findRole(raw), sla = findSla(raw), g = findStage(raw) || g0; if (!r && !sla && !g) return null;
  let n = raw.replace(/\.$/, '');
  n = n.replace(/^(the )?(sales rm|rm|relationship manager|branch operations|branch ops|central operations|central ops|credit manager|regional credit manager|zonal credit manager|national credit head|fcu head|fcu|legal manager|technical manager|fi agency|tele-?sales|sales manager|system|the system)\s+/i, '');
  n = n.replace(/\s*(within (\d+|one|two|three|four|five|six|seven) (working )?(hours?|days?|minutes?)( of [^,.;]+)?|on the same day|the same day)/i, '');
  n = imper(n.trim());
  return { n: n.length > 3 ? n : cap1(raw), r, sla, g: g || 'g9' };
}

/* ---------------- building the flowchart from the sources ---------------- */
function stepOf(x, att) {
  const has = s => att.includes(s), src = (x.src || []).filter(r => has(r.s));
  if (!src.length && !x.inf) return null;
  if (x.id === 'T18' && !has('S4')) return null;
  const t = { t: 'step', id: x.id, n: FLN[x.id] || x.n, r: x.r, sla: x.sla ? deep(x.sla) : null, src: deep(src) };
  if (x.via) Object.keys(x.via).forEach(s => { if (has(s)) Object.assign(t, deep(x.via[s])); });
  return t;
}
function buildFlow(att, text, resolve) {
  const X = id => XT.find(x => x.id === id);
  const stages = FLOWDEF.map(def => {
    const g = WSTG.find(s => s.id === def.g), items = [];
    def.items.forEach(it => {
      if (typeof it === 'string') { const s = stepOf(X(it), att); if (s) items.push(s); return; }
      if (it.par) { const lanes = it.lanes.map(id => stepOf(X(id), att)).filter(Boolean); if (!lanes.length) return; const nx = X(it.noteOf), ns = nx ? nx.src.filter(r => att.includes(r.s)) : []; items.push({ t: 'par', id: it.par, lanes, note: ns.length ? it.note : '', src: ns }); return; }
      const arms = it.arms.map(([l, ids]) => ({ l, items: ids.map(id => stepOf(X(id), att)).filter(Boolean), had: ids.length }));
      const full = arms.filter(a => a.items.length), had = arms.filter(a => a.had);
      if (!full.length) return;
      if (full.length < had.length) { full.forEach(a => items.push(...a.items)); return; }
      const src = []; arms.forEach(a => a.items.forEach(s => s.src.forEach(r => { if (src.length < 3 && !src.some(x => x.s === r.s)) src.push(r); })));
      items.push({ t: 'dec', id: it.dec, q: it.q, arms: arms.map(a => ({ l: a.l, items: a.items })), src: it.inf ? [] : src });
    });
    return { id: g.id, n: g.n, sla: deep(g.sla), items };
  });
  const F = { stages, flags: {}, skipped: [] };
  if (text) text.split(/\n+/).forEach((line, i) => { if (!line.trim()) return; const x = parseLine(line, ''); if (!x) { F.skipped.push(line.trim()); return; } const g = F.stages.find(s => s.id === x.g) || F.stages[F.stages.length - 1], st = { t: 'step', id: 'X' + (i + 1), n: x.n, r: x.r, sla: x.sla, src: [{ s: 'T', l: i + 1, q: line.trim().slice(0, 90) }], add: 1 }, k = g.items.findIndex(it => !(it.src || []).length && !it.add); if (k >= 0) g.items.splice(k, 0, st); else g.items.push(st); });
  Object.keys(FFLAG).forEach(id => { const f = FFLAG[id]; if (f.need && !f.need.every(s => att.includes(s))) return; if (f.noSrc && att.includes(f.noSrc)) return; if (findNode(F, id)) F.flags[id] = 1; });
  if (resolve) Object.keys(F.flags).forEach(id => resolveFlag(F, id, FFLAG[id].sug, true));
  return F;
}
function findIn(arr, id, g, parent) {
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    if (it.id === id) return { node: it, arr, idx: i, g, parent };
    if (it.t === 'dec') for (let a = 0; a < it.arms.length; a++) { const r = findIn(it.arms[a].items, id, g, { dec: it, arm: a }); if (r) return r; }
    if (it.t === 'par') { const r = findIn(it.lanes, id, g, { par: it }); if (r) return r; }
  }
  return null;
}
function findNode(F, id) { if (!F) return null; for (const g of F.stages) { if (g.id === id) return { node: g, stage: 1, g }; const r = findIn(g.items, id, g); if (r) return r; } return null; }
function eachStep(F, fn) { F.stages.forEach(g => { const w = arr => arr.forEach(it => { if (it.t === 'step') fn(it, g); if (it.t === 'dec') it.arms.forEach(a => w(a.items)); if (it.t === 'par') w(it.lanes); }); w(g.items); }); }
function flowStats(F) { let n = 0, d = 0; eachStep(F, () => n++); F.stages.forEach(g => g.items.forEach(it => { if (it.t === 'dec') d++; })); return { steps: n, decs: d, stages: F.stages.length, flags: Object.keys(F.flags || {}).length }; }
function resolveFlag(F, id, o, silent) {
  const f = FFLAG[id], hit = findNode(F, id); if (!f || !hit) return;
  const n = hit.node, opt = f.opts.find(x => x[0] === o); if (!opt || opt[3]) return;
  if (f.k === 'conf') n.n = opt[2];
  if (f.k === 'pol') n.r = 'rm';
  if (f.k === 'inf' && o === 'drop') hit.arr.splice(hit.idx, 1);
  if (f.k === 'own') { n.r = o; n.n = 'Collect the signed sanction letter'; n.sla = n.sla || { n: 2, u: 'wd' }; }
  delete F.flags[id];
  if (!silent) alog2({ area: 'wf', what: f.title, a: opt[1], why: 'Answered while building the workflow' });
}

/* ---------------- workflow differences (live: draft against what is running) ---------------- */
function flatNodes(F) {
  const out = {}, ord = {};
  F.stages.forEach(g => { out[g.id] = { k: 'stage', n: g.n, sla: slaTxt(g.sla) }; const ids = [];
    const w = arr => arr.forEach(it => { ids.push(it.id); if (it.t === 'step') out[it.id] = { k: 'step', n: it.n, r: it.r, sla: slaTxt(it.sla), g: g.n }; if (it.t === 'dec') { out[it.id] = { k: 'decision', n: it.q, arms: it.arms.map(a => a.l).join(' / '), g: g.n }; it.arms.forEach(a => w(a.items)); } if (it.t === 'par') { out[it.id] = { k: 'parallel block', n: 'In parallel', note: it.note || '', g: g.n }; w(it.lanes); } });
    w(g.items); ord[g.id] = ids; });
  return { out, ord };
}
function flowDiff(A, B) {
  if (!A || !B) return [];
  const a = flatNodes(A), b = flatNodes(B), D = [];
  Object.keys(b.out).forEach(id => {
    const x = a.out[id], y = b.out[id];
    if (!x) { D.push({ id, k: 'add', t: 'Added a ' + y.k + ': ' + y.n + (y.g ? ', in “' + y.g + '”' : '') }); return; }
    if (x.n !== y.n) D.push({ id, k: 'chg', t: (y.k === 'stage' ? 'Renamed a stage' : y.k === 'decision' ? 'Changed a question' : 'Renamed a step'), b: x.n, a: y.n });
    if (x.r !== y.r) D.push({ id, k: 'chg', t: 'Owner of “' + short(y.n, 50) + '”', b: rn(x.r), a: rn(y.r) });
    if (x.sla !== y.sla) D.push({ id, k: 'chg', t: 'Turnaround of “' + short(y.n, 50) + '”', b: x.sla, a: y.sla });
    if (x.arms !== y.arms) D.push({ id, k: 'chg', t: 'Branches of “' + short(y.n, 50) + '”', b: x.arms, a: y.arms });
    if (x.note !== y.note) D.push({ id, k: 'chg', t: 'Note on the parallel block', b: x.note || 'None', a: y.note || 'None' });
  });
  Object.keys(a.out).forEach(id => { if (!b.out[id]) D.push({ id, k: 'del', t: 'Removed a ' + a.out[id].k + ': ' + a.out[id].n }); });
  Object.keys(b.ord).forEach(g => { const x = (a.ord[g] || []).filter(id => b.ord[g].includes(id)), y = b.ord[g].filter(id => x.includes(id)); if (x.join() !== y.join()) D.push({ id: g, k: 'chg', t: 'Changed the order of steps in “' + b.out[g].n + '”' }); });
  return D;
}

/* ---------------- policy values: live (shared with the decision engine) or the onboarding sandbox ---------------- */
const PU = { yr: 'years', mo: 'months', inr: '₹ a month', lakh: '₹ lakh', pct: '%', rpct: '% a year', pts: 'points', n: '' };
function pval(r) {
  if (ONB()) return r.p ? getP(ADM.onb.pol, r.p) : ADM.onb.loc[r.id];
  if (r.p) return r.p in ADM.pe ? ADM.pe[r.p] : getP(POL, r.p);
  return r.id in ADM.le ? ADM.le[r.id] : ADM.loc[r.id];
}
const pcur = p => ONB() ? getP(ADM.onb.pol, p) : p in ADM.pe ? ADM.pe[p] : getP(POL, p);
function pfmt(r, v) { if (v == null || v === '') return 'Not set'; if (r.u === 'bool') return v ? 'Yes' : 'No'; if (r.u === 'lakh') return lakh(v); if (r.u === 'inr') return inr(v) + ' a month'; if (r.u === 'pct') return v + '%'; if (r.u === 'rpct') return Number(v).toFixed(2) + '%'; if (r.u === 'pts') return plural(v, 'point'); if (r.u === 'yr') return plural(v, 'year'); if (r.u === 'mo') return plural(v, 'month'); return String(v); }
function pFmtPath(p, v) { const r = PRULES.find(x => x.p === p); return r ? pfmt(r, v) : /^foir|^ltv/.test(p) ? v + '%' : String(v); }
function pLabel(p) { const r = PRULES.find(x => x.p === p); return r ? r.n : pathLabel(p); }
function polDiffs() {
  const D = Object.keys(ADM.pe).filter(p => ADM.pe[p] !== getP(POL, p)).map(p => ({ p, l: pLabel(p), fb: pFmtPath(p, getP(POL, p)), fa: pFmtPath(p, ADM.pe[p]), to: ADM.pe[p] }));
  Object.keys(ADM.le).filter(id => ADM.le[id] !== ADM.loc[id]).forEach(id => { const r = PRULES.find(x => x.id === id); D.push({ id, l: r.n, fb: pfmt(r, ADM.loc[id]), fa: pfmt(r, ADM.le[id]), to: ADM.le[id] }); });
  return D;
}
function apiDiffs() {
  const D = [];
  Object.keys(ADM.ae).forEach(id => { const a = ADM.live.api.find(x => x.id === id), b = ADM.ae[id];
    if (b.on !== a.on) D.push({ id, f: 'on', t: a.n, b: a.on ? 'In use' : 'Not in use', a: b.on ? 'In use' : 'Not in use' });
    if (b.pri !== a.pri) D.push({ id, f: 'pri', t: a.n + ': first choice', b: APIV[a.pri] || 'None', a: APIV[b.pri] || 'None' });
    if (b.bak !== a.bak) D.push({ id, f: 'bak', t: a.n + ': if it fails, use', b: APIV[a.bak] || 'None', a: APIV[b.bak] || 'None' }); });
  return D;
}
const apiList = () => ONB() ? ADM.onb.api : ADM.live.api.map(a => ADM.ae[a.id] ? Object.assign({}, a, ADM.ae[a.id]) : a);
function staged() { if (!ADM || ONB()) return { pol: [], api: [], wf: [], n: 0 }; const pol = polDiffs(), api = apiDiffs(), wf = flowDiff(ADM.live.wf, ADM.live.wfW); return { pol, api, wf, n: pol.length + api.length + wf.length }; }

/* =====================================================================
   The page
   ===================================================================== */
function adminHTML() {
  if (!ADM) initAdmin();
  const onb = ONB(), st = staged();
  const head = `<div class="adm-h adm-h9">
  <div class="adm-mode" role="tablist" aria-label="View">${[['onb', 'New setup', 'Build it from your documents'], ['live', 'Live setup', 'Change what is running']].map(([k, l, s]) => `<button class="${ADM.mode === k ? 'on' : ''}" data-act="amode" data-v="${k}" role="tab" aria-selected="${ADM.mode === k}"><b>${l}</b><small>${s}</small></button>`).join('')}</div></div>`;
  const O = ADM.onb, F = onb ? O.wf : ADM.live.wfW, fs = F ? flowStats(F) : null, rulesN = PRULES.length, apiOn = apiList().filter(a => a.on).length;
  const askN = onb && O.pol ? PRULES.filter(r => r.ask && (O.loc[r.id] == null || O.loc[r.id] === '')).length : 0;
  const tabs = [
    ['wf', onb ? '1. Workflow' : 'Workflow', onb ? (F ? plural(fs.steps, 'step') + (fs.flags ? ', ' + fs.flags + ' to check' : '') : 'Not built yet') : 'Version ' + ADM.live.ver + ', ' + plural(fs.steps, 'step'), onb ? F && !fs.flags : 0, st.wf.length],
    ['pol', onb ? '2. Policy rules' : 'Policy rules', onb ? (O.pol ? plural(rulesN, 'rule') + (askN ? ', ' + askN + ' to set' : '') : 'Not read yet') : 'Version ' + POL.ver + ', ' + plural(rulesN, 'rule'), onb ? O.pol && !askN : 0, st.pol.length],
    ['api', onb ? '3. Vendors and APIs' : 'Vendors and APIs', plural(apiOn, 'call') + ' in use', onb ? O.apiOk : 0, st.api.length],
    ['aud', 'Audit trail', plural(ADM.aud.filter(e => e.view === ADM.mode).length, 'entry', 'entries'), 0, 0]];
  const tabH = `<nav class="adm-t" role="tablist" aria-label="Sections">${tabs.map(([k, l, s, ok, ch]) => `<button class="${ADM.sec === k ? 'on' : ''}" data-act="asec" data-v="${k}" role="tab" aria-selected="${ADM.sec === k}"><b>${ok ? ic('check') : ''}${esc(l)}</b><small>${esc(s)}</small>${ch ? `<span class="adm-ch">${ch} unsaved</span>` : ''}</button>`).join('')}</nav>`;
  const ready = onb && F && !fs.flags && O.pol && !askN && O.apiOk;
  const banner = ready ? `<div class="adm-ready">${ic('check')}<div><b>${O.live ? 'Go-live scheduled' : 'Ready to go live'}</b><span>${O.live ? 'This setup goes live on ' + GOLIVE + '. Until then, files run on the current live setup.' : 'The workflow, the policy rules and the vendors are set, and every question is answered.'}</span></div>${O.live ? '' : `<button class="btn btn-p btn-sm" data-act="ogolive">${ic('clock')}Schedule go-live</button>`}</div>` : '';
  const body = { wf: wfSecHTML, pol: polSecHTML, api: apiSecHTML, aud: audSecHTML }[ADM.sec]();
  return `<div class="adm${st.n ? ' has-bar' : ''}">${head}${onb ? '' : ikHTML()}${banner}${tabH}<div class="adm-b">${body}</div>${st.n ? saveBarHTML(st) : ''}</div>`;
}

/* ---------------- 1. workflow ---------------- */
function wfSecHTML() {
  const O = ADM.onb;
  if (ONB() && O.phase === 'pick') return capHTML();
  if (ONB() && O.phase === 'run') return runHTML(capSteps(), O.step, 'Building the workflow');
  const F = curFlow(), fs = flowStats(F), D = ONB() ? [] : flowDiff(ADM.live.wf, F), dm = {};
  D.forEach(d => { if (!dm[d.id] || d.k === 'add') dm[d.id] = d.k; });
  const fl = Object.keys(F.flags || {});
  const bar = `<div class="fe-bar"><span class="fe-st">${ONB() ? `Built from ${plural(capAtt().length + (O.txt.trim() && O.txt.trim() !== NOTE4TXT ? 1 : 0), 'source')}` : 'Home loan origination, version ' + ADM.live.ver + (D.length ? ', with a draft' : ', live since 1 Apr 2026')}: <b>${plural(fs.steps, 'step')}</b>, ${plural(fs.decs, 'decision')}, ${plural(fs.stages, 'stage')}</span>${fl.length ? `<button class="fe-flag" data-act="fnext">${ic('alert')}${plural(fl.length, 'question')} to answer</button>` : ''}<span class="nav-sp"></span>${ONB() ? `<button class="btn btn-g btn-sm" data-act="orebuild">${ic('reset')}Change the sources</button>` : ''}</div>`;
  return `<div class="fe6">${bar}<div class="fe-body"><div class="fe-c" id="fec" data-keep="fec">${flowHTML(F, { sel: ADM.sel, dm, flags: F.flags || {} })}</div><aside class="fe-p${ADM.sel && findNode(F, ADM.sel) ? ' picked' : ''}" aria-label="Edit the workflow">${panelHTML(F)}</aside></div></div>`;
}
function capAtt() { const O = ADM.onb, a = Object.keys(O.src).filter(k => O.src[k]); if (O.txt.trim() === NOTE4TXT) a.push('S4'); return a; }
function capSteps() { const a = capAtt(), O = ADM.onb, L = []; if (a.includes('S1')) L.push('Reading the SOP: 38 pages, with OCR'); if (a.includes('S3')) L.push('Reading the approval matrix'); if (a.includes('S2')) L.push('Transcribing the walkthrough: Hindi and English, 3 speakers'); if (O.txt.trim()) L.push(a.includes('S4') ? 'Reading the operations note' : 'Reading your text'); return L.concat(['Finding steps, owners, turnarounds and decisions', 'Drawing the flowchart']); }
function runHTML(steps, k, title) { return `<section class="panel run6"><div class="pb"><h3>${esc(title)}</h3><div class="prs">${steps.map((t, i) => `<div class="${i < k ? 'done' : i === k ? 'cur' : ''}">${i < k ? ic('check') : i === k ? '<span class="spin"></span>' : ic('clock')}${esc(t)}</div>`).join('')}</div></div></section>`; }
function capHTML() {
  const O = ADM.onb, n = capAtt().length + (O.txt.trim() && O.txt.trim() !== NOTE4TXT ? 1 : 0);
  const pick = k => { const on = !!O.src[k], s = WSRC[k]; return `<button class="sp6${on ? ' on' : ''}" data-act="osrc" data-v="${k}" aria-pressed="${on}">${ic(on ? 'check' : 'plus')}<span><b>${esc(s.n)}</b><small>${esc(s.meta)}</small></span></button>`; };
  return `<div class="cap6-h"><h3>Tell Uncia how your team works</h3><p>Add documents, a recording or a few lines of text, in any mix. Uncia reads them, draws the workflow as a flowchart and shows where every step came from. You can change anything after.</p></div>
  <div class="cap6"><section class="cap-c"><header>${ic('file')}<div><b>Documents</b><small>SOPs, process notes, approval matrices</small></div></header>${pick('S1')}${pick('S3')}<p class="cap-n">From your document library. PDF, Word, Excel and scans all work.</p></section>
  <section class="cap-c"><header>${ic('mic')}<div><b>Audio</b><small>A recorded walkthrough or a voice note</small></div></header>${pick('S2')}<p class="cap-n">${ic('lock')}The speakers’ consent is recorded at the start. Customer names are removed from the transcript.</p></section>
  <section class="cap-c"><header>${ic('text')}<div><b>Text</b><small>Type or paste how the work is done, one step a line</small></div></header><textarea class="ta cap-ta" id="ocap" rows="6" placeholder="For example: The credit manager checks every login within 4 working hours.">${esc(O.txt)}</textarea><button class="lnk" data-act="opaste">${O.txt.trim() === NOTE4TXT ? 'Clear the text' : 'Paste from the clipboard'}</button></section></div>
  <div class="cap6-go">${O.wf ? '<span class="cap-warn">Building again replaces the current flowchart and your edits to it.</span>' : ''}<span id="ocapN">${plural(n, 'source')} added</span><button class="btn btn-p" data-act="obuild" id="ocapGo"${n ? '' : ' disabled'}>${ic('wand')}Build the workflow</button></div>`;
}

/* the flowchart */
function fcStep(t, M) {
  const sys = t.r === 'sys', fl = M.flags[t.id] ? FFLAG[t.id] : null, d = M.dm[t.id], kinds = [...new Set((t.src || []).map(r => r.s))];
  return `<button class="wf-n${sys ? ' sys' : ''}${M.sel === t.id ? ' on' : ''}${fl ? ' fl' : ''}${d ? ' d-' + d : ''}" data-act="fsel" data-v="${t.id}">${fl ? `<span class="wf-flag">${ic('alert')}${esc(fl.l)}</span>` : d ? `<span class="wf-tag ${d}">${d === 'add' ? 'New' : 'Changed'}</span>` : ''}
  <b class="wf-t">${esc(t.n)}</b><span class="wf-m"><span class="wf-o${t.r ? '' : ' none'}">${sys ? ic('cpu') + 'Automatic' : esc(rn(t.r))}</span>${sys ? '' : `<span class="wf-s${t.sla ? '' : ' none'}">${ic('clock')}${esc(slaTxt(t.sla))}</span>`}<span class="wf-src" title="${esc(kinds.length ? 'From: ' + listAnd(kinds.map(k => (WSRC[k] || { short: 'your text' }).short)) : 'Added by hand')}">${kinds.map(k => ic(SRCIC[k])).join('')}</span></span></button>`;
}
const fcA = c => `<i class="wf-a${c ? ' ' + c : ''}" aria-hidden="true"></i>`;
function fcItem(it, M) {
  if (it.t === 'step') return fcStep(it, M);
  if (it.t === 'par') return `<div class="wf-pw${M.sel === it.id ? ' on' : ''}${M.dm[it.id] ? ' d-' + M.dm[it.id] : ''}"><button class="wf-pb" data-act="fsel" data-v="${it.id}">${ic('lanes')}In parallel</button><div class="wf-pl">${it.lanes.map(t => fcStep(t, M)).join('')}</div>${it.note ? `<p class="wf-pn">${ic('clock')}${esc(it.note)}</p>` : ''}</div>`;
  const fl = M.flags[it.id] ? FFLAG[it.id] : null, d = M.dm[it.id];
  return `<div class="wf-dw"><button class="wf-d${M.sel === it.id ? ' on' : ''}${fl ? ' fl' : ''}${d ? ' d-' + d : ''}" data-act="fsel" data-v="${it.id}">${fl ? `<span class="wf-flag">${ic('alert')}${esc(fl.l)}</span>` : d ? `<span class="wf-tag ${d}">${d === 'add' ? 'New' : 'Changed'}</span>` : ''}<span class="wf-dq">${esc(it.q)}</span></button><i class="wf-l" aria-hidden="true"></i>
  <div class="wf-br" style="--n:${it.arms.length}">${it.arms.map(a => `<div class="wf-arm"><i class="wf-jt" aria-hidden="true"></i><span class="wf-al">${esc(a.l)}</span>${a.items.map(t => fcA() + fcStep(t, M)).join('')}<i class="wf-fill" aria-hidden="true"></i><i class="wf-jb" aria-hidden="true"></i></div>`).join('')}</div></div>`;
}
function flowHTML(F, M) {
  return `<div class="wf"><span class="wf-end">${ic('flag')}A lead comes in</span>${F.stages.map((g, i) => `${fcA()}<section class="wf-g${M.sel === g.id ? ' on' : ''}${M.dm[g.id] ? ' d-' + M.dm[g.id] : ''}"><button class="wf-gh" data-act="fsel" data-v="${g.id}"><span class="wf-gi">${i + 1}</span><b>${esc(g.n)}</b><small>${esc(slaTxt(g.sla))}</small></button><div class="wf-gb">${g.items.length ? g.items.map((it, j) => (j ? fcA() : '') + fcItem(it, M)).join('') : '<span class="wf-skip">No steps yet</span>'}</div></section>`).join('')}${fcA()}<span class="wf-end">${ic('check')}Handed to disbursement</span></div>`;
}

/* the edit panel */
function slaEd(o, key) {
  const u = o.sla ? o.sla.u : '';
  return `<div class="fp-sla"><input class="inp2" type="number" min="0" data-fe="${key}sn|${o.id}" value="${o.sla && !['auto', 'sd'].includes(u) ? o.sla.n : ''}"${['auto', 'sd', ''].includes(u) ? ' disabled' : ''} aria-label="Turnaround number"><select class="sel" data-fe="${key}su|${o.id}" aria-label="Turnaround unit">${[['', 'No turnaround'], ['auto', 'Automatic'], ['sd', 'Same day'], ['min', 'Minutes'], ['wh', 'Working hours'], ['wd', 'Working days']].map(([k, l]) => `<option value="${k}"${u === k ? ' selected' : ''}>${l}</option>`).join('')}</select></div>`;
}
const fpX = id => `<button class="ibtn fp-x" data-act="fsel" data-v="${id}" aria-label="Close" title="Close">${ic('x')}</button>`;
function panelHTML(F) {
  const hit = ADM.sel ? findNode(F, ADM.sel) : null;
  if (!hit) {
    const srcs = ONB() ? capAtt() : ['S1', 'S2', 'S3', 'S4'];
    return `<div class="fp-h"><b>Edit the workflow</b><small>Click any box in the flowchart to change it, add a step or a decision after it, or move it.</small></div>
    <div class="fp-k">Key</div><ul class="fp-leg"><li><span class="lg-n"></span>A step, with its owner and turnaround</li><li><span class="lg-n sys"></span>A step the system does by itself</li><li><span class="lg-d"></span>A decision; each branch is labelled</li><li><span class="lg-p"></span>Steps that run at the same time</li><li>${ic('alert')}A question for you</li></ul>
    <div class="fp-k">${ONB() ? 'Built from' : 'Version ' + ADM.live.ver + ' was built from'}</div><ul class="fp-src">${srcs.map(k => `<li>${ic(SRCIC[k])}<span><b>${esc(WSRC[k].n)}</b><small>${esc(WSRC[k].meta)}</small></span></li>`).join('')}${ONB() && ADM.onb.txt.trim() && ADM.onb.txt.trim() !== NOTE4TXT ? `<li>${ic('text')}<span><b>Your text</b><small>${plural(ADM.onb.txt.trim().split(/\n+/).filter(l => l.trim()).length, 'line')}${F.skipped && F.skipped.length ? ', ' + F.skipped.length + ' not understood: \u201C' + esc(short(F.skipped[0].replace(/[.;,]+$/, ''), 60)) + '\u201D' + (F.skipped.length > 1 ? ' and ' + (F.skipped.length - 1) + ' more' : '') + '. Add it as a step by hand.' : ''}</small></span></li>` : ''}</ul>
    ${ONB() ? '' : '<p class="fp-n">Edits stay in a draft until you save them with a reason, at the bottom of the page.</p>'}`;
  }
  const n = hit.node, fl = F.flags && F.flags[n.id] ? FFLAG[n.id] : null, inArm = hit.parent && (hit.parent.dec || hit.parent.par);
  const flagBox = fl ? `<div class="fp-q"><b>${ic('alert')}${esc(fl.title)}</b><p>${esc(fl.text)}</p>${(fl.sides || []).map(r => `<blockquote>${ic(SRCIC[r.s])}<span>“${esc(r.q)}”<small>${esc(refLbl(r))}</small></span></blockquote>`).join('')}<div class="fp-qo">${fl.opts.map(([k, l, , dis]) => `<button class="btn ${k === fl.sug ? 'btn-p' : 'btn-s'} btn-sm" data-act="fflag" data-v="${n.id}|${k}"${dis ? ` disabled title="${esc(dis)}"` : ''}>${esc(l)}</button>${dis ? `<small class="fp-dis">${ic('lock')}${esc(dis)}</small>` : ''}`).join('')}</div><small class="fp-sug">Suggested: ${esc(fl.sugWhy)}</small></div>` : '';
  const srcL = (n.src || []).length ? `<div class="fp-k">Where it came from</div>${n.src.map(r => `<blockquote class="fp-sr">${ic(SRCIC[r.s])}<span>“${esc(r.q)}”<small>${esc(refLbl(r))}</small></span></blockquote>`).join('')}` : `<p class="fp-n">${n.add ? 'Added by hand.' : n.t === 'dec' && FFLAG[n.id] && FFLAG[n.id].k === 'inf' ? 'Not in any of your sources.' : ''}</p>`;
  const mv = hit.arr ? `<button class="btn btn-s btn-sm" data-act="fmove" data-v="${n.id}|-1"${hit.idx ? '' : ' disabled'} aria-label="Move up">${ic('up')}</button><button class="btn btn-s btn-sm" data-act="fmove" data-v="${n.id}|1"${hit.idx < hit.arr.length - 1 ? '' : ' disabled'} aria-label="Move down">${ic('dn')}</button>` : '';
  if (hit.stage) {
    const g = n, gi = F.stages.indexOf(g);
    return `<div class="fp-h"><span class="fp-ty">Stage ${gi + 1}</span><b>${esc(g.n)}</b>${fpX(g.id)}</div>
    <label class="fp-f">Name<input class="inp2" data-fe="gn|${g.id}" value="${esc(g.n)}"></label><label class="fp-f">Turnaround for the whole stage${slaEd(g, 'g')}</label>
    <div class="fp-a"><button class="btn btn-s btn-sm" data-act="fadd" data-v="stepEnd|${g.id}">${ic('plus')}Add a step</button><button class="btn btn-s btn-sm" data-act="fadd" data-v="decEnd|${g.id}">${ic('dia')}Add a decision</button><button class="btn btn-s btn-sm" data-act="fadd" data-v="stage|${g.id}">${ic('plus')}Add a stage after</button>${g.items.length ? '' : `<button class="btn btn-g btn-sm" data-act="fdel" data-v="${g.id}">${ic('trash')}Delete the stage</button>`}</div>`;
  }
  if (n.t === 'dec') return `<div class="fp-h"><span class="fp-ty">Decision</span><b>${esc(n.q)}</b>${fpX(n.id)}</div>${flagBox}
    <label class="fp-f">Question<input class="inp2" data-fe="q|${n.id}" value="${esc(n.q)}"></label><div class="fp-two">${n.arms.map((a, i) => `<label class="fp-f">Branch ${i + 1}<input class="inp2" data-fe="l${i}|${n.id}" value="${esc(a.l)}"></label>`).join('')}</div>
    <div class="fp-a">${n.arms.map((a, i) => `<button class="btn btn-s btn-sm" data-act="fadd" data-v="arm|${n.id}|${i}">${ic('plus')}Add a step to “${esc(short(a.l, 16))}”</button>`).join('')}<button class="btn btn-s btn-sm" data-act="fadd" data-v="step|${n.id}">${ic('plus')}Add a step after</button>${mv}<button class="btn btn-g btn-sm" data-act="fdel" data-v="${n.id}">${ic('trash')}Delete</button></div>${srcL}`;
  if (n.t === 'par') return `<div class="fp-h"><span class="fp-ty">Parallel block</span><b>${plural(n.lanes.length, 'step')} at the same time</b>${fpX(n.id)}</div>
    <label class="fp-f">Note under the block<textarea class="ta" rows="3" data-fe="note|${n.id}">${esc(n.note || '')}</textarea></label>
    <div class="fp-a"><button class="btn btn-s btn-sm" data-act="fadd" data-v="lane|${n.id}">${ic('plus')}Add a parallel step</button><button class="btn btn-s btn-sm" data-act="fadd" data-v="step|${n.id}">${ic('plus')}Add a step after</button>${mv}</div>${srcL}`;
  const hasNext = !inArm;
  return `<div class="fp-h"><span class="fp-ty">${n.r === 'sys' ? 'Automatic step' : 'Step'}${inArm && hit.parent.dec ? ', on the “' + esc(hit.parent.dec.arms[hit.parent.arm].l) + '” branch' : inArm ? ', in parallel' : ''}</span><b>${esc(short(n.n, 60))}</b>${fpX(n.id)}</div>${flagBox}
    <label class="fp-f">Name<textarea class="ta" rows="2" data-fe="n|${n.id}"${ADM.focusNew === n.id ? ' data-autofocus="1"' : ''}>${esc(n.n)}</textarea></label>
    <label class="fp-f">Owner<select class="sel" data-fe="r|${n.id}"><option value=""${n.r ? '' : ' selected'}>No owner yet</option>${Object.entries(WROLE).map(([k, r]) => `<option value="${k}"${n.r === k ? ' selected' : ''}>${esc(r.auto ? 'System (automatic)' : r.n)}</option>`).join('')}</select></label>
    ${n.r === 'sys' ? '' : `<label class="fp-f">Turnaround${slaEd(n, '')}</label>`}
    <div class="fp-a"><button class="btn btn-s btn-sm" data-act="fadd" data-v="step|${n.id}">${ic('plus')}Add a step after</button>${hasNext ? `<button class="btn btn-s btn-sm" data-act="fadd" data-v="dec|${n.id}">${ic('dia')}Add a decision after</button>` : ''}${mv}<button class="btn btn-g btn-sm" data-act="fdel" data-v="${n.id}">${ic('trash')}Delete</button></div>${srcL}`;
}

/* ---------------- 2. policy rules ---------------- */
function polSecHTML() {
  const O = ADM.onb;
  if (ONB() && O.polPhase === 'pick') return `<div class="cap6-h"><h3>Read the credit policy</h3><p>Upload the lender’s credit policy. Uncia lists every rule and limit in it, shows the page each one came from, and marks which ones the system applies by itself.</p></div>
    <section class="panel cap-p"><div class="pb"><button class="sp6${O.polOn ? ' on' : ''}" data-act="opsrc" aria-pressed="${!!O.polOn}">${ic(O.polOn ? 'check' : 'plus')}<span><b>${esc(PDOC.n)}</b><small>${esc(PDOC.meta)}</small></span></button><p class="cap-n">From your document library. PDF and Word both work, including scans.</p><div class="cap6-go in"><button class="btn btn-p" data-act="opread"${O.polOn ? '' : ' disabled'}>${ic('wand')}Read the policy</button></div></div></section>`;
  if (ONB() && O.polPhase === 'run') return runHTML(['Reading 42 pages', 'Finding rules, limits and tables', 'Matching them to the rules the system can apply', 'Listing what needs your input'], O.polStep, 'Reading the policy');
  const L = PRULES, q = (ADM.ps || '').toLowerCase().trim();
  const chg = r => ONB() ? false : r.p ? r.p in ADM.pe && ADM.pe[r.p] !== getP(POL, r.p) : r.u === 'grid' ? Object.keys(ADM.pe).some(p => p.indexOf(r.grid + '.') === 0 && ADM.pe[p] !== getP(POL, p)) : r.id in ADM.le && ADM.le[r.id] !== ADM.loc[r.id];
  const sys = r => !!r.p || r.u === 'grid' || r.u === 'rbi', ask = r => r.ask && ONB() && (pval(r) == null || pval(r) === '');
  const F = { all: () => true, sys: r => sys(r), ppl: r => !sys(r), chg: r => chg(r), ask: r => ask(r) }, pf = F[ADM.pf] ? ADM.pf : 'all';
  const show = L.filter(F[pf]).filter(r => !q || (r.n + ' ' + r.src[2]).toLowerCase().includes(q));
  const cnt = k => L.filter(F[k]).length;
  const top = `<div class="pr-top"><div class="pr-doc">${ic('file')}<div><b>${ONB() ? esc(PDOC.n) : 'Credit policy, version ' + POL.ver}</b><small>${ONB() ? 'Read: ' + plural(L.length, 'rule') + ' with ' + polLimits() + ' limits, on ' + PDOC.pages + ' pages' : 'Live since ' + fdt(POL.at) + '. ' + (POL.checker ? 'Made by ' + esc(POL.maker) + ', approved by ' + esc(POL.checker) : 'Changed by ' + esc(POL.maker) + ' on this page') + '. The decision engine uses these values now.'}</small></div></div>
  <div class="pr-f"><input class="inp2 pr-s" id="prs" placeholder="Search the rules" value="${esc(ADM.ps || '')}" aria-label="Search the rules">${[['all', 'All'], ['sys', 'Applied by the system'], ['ppl', 'Checked by people']].concat(ONB() ? [['ask', 'To set']] : [['chg', 'Changed']]).map(([k, l]) => `<button class="flt${pf === k ? ' on' : ''}" data-act="apf" data-v="${k}">${l} ${cnt(k)}</button>`).join('')}</div></div>`;
  const cats = PCAT.filter(([c]) => show.some(r => r.c === c));
  return top + (cats.map(([c, nm, sec]) => `<section class="panel pr-c"><div class="ph"><h3>${esc(nm)}</h3><span class="note">Policy section ${sec}</span></div><div class="pb">${show.filter(r => r.c === c).map(r => ruleRow(r, chg(r), ask(r), sys(r))).join('')}</div></section>`).join('') || '<p class="muted" style="padding:20px 4px">No rule matches.</p>');
}
function polLimits() { return PRULES.reduce((n, r) => n + (r.u === 'grid' ? (r.grid === 'foir' ? 12 : 21) : r.u === 'rbi' ? 3 : 1), 0); }
function ruleRow(r, chg, ask, sys) {
  const v = pval(r), open = ADM.pq === r.id, live = !ONB();
  let ctl = '';
  if (r.u === 'bool') ctl = `<label class="tgl6"><input type="checkbox" data-pv="${r.id}"${v ? ' checked' : ''} aria-label="${esc(r.n)}"><span></span></label><span class="pu">${v ? 'Yes' : 'No'}</span>`;
  else if (r.u === 'grid') ctl = '';
  else if (r.u === 'rbi') ctl = `<span class="pr-lock">${ic('lock')}Set by the RBI</span>`;
  else { const dv = r.u === 'lakh' ? (v == null ? '' : trimz((v / 1e5).toFixed(2))) : v == null ? '' : v; ctl = `<input class="pin6" type="number" step="${['pct', 'lakh'].includes(r.u) ? '0.5' : r.u === 'rpct' ? '0.05' : '1'}" data-pv="${r.id}" value="${dv}" placeholder="Set" aria-label="${esc(r.n)}"><span class="pu">${esc(PU[r.u] || '')}</span>`; }
  const was = chg && r.u !== 'grid' ? `<span class="was6">was ${esc(r.p ? pFmtPath(r.p, getP(POL, r.p)) : pfmt(r, ADM.loc[r.id]))}</span>` : '';
  const grid = r.u === 'grid' ? gridHTML(r.grid) : r.u === 'rbi' ? `<div class="pg-w"><table class="pg"><thead><tr>${SLABS.map(s => `<th>${esc(s)}</th>`).join('')}</tr></thead><tbody><tr>${POL.ltv.reg.map(x => `<td class="lk">${x}%</td>`).join('')}</tr></tbody></table></div>` : '';
  const docV = r.src[2];
  return `<div class="pr-r${chg ? ' chg' : ''}${ask ? ' need' : ''}${r.u === 'grid' || r.u === 'rbi' ? ' wide' : ''}"><div class="pr-n"><b>${esc(r.n)}</b><span class="pr-tags"><span class="pr-t ${sys ? 'sys' : 'ppl'}">${ic(sys ? 'cpu' : 'user')}${sys ? 'Applied by the system' : 'Checked by people'}</span><button class="pr-src${open ? ' on' : ''}" data-act="apq" data-v="${r.id}" aria-expanded="${open}">${ic('file')}Page ${r.src[0]}, ${r.src[1]}</button></span>${ask ? `<small class="pr-ask">${ic('alert')}${esc(r.ask)}</small>` : ''}</div><div class="pr-v">${ctl}${was}</div>${grid ? `<div class="pr-g">${grid}</div>` : ''}${open ? `<blockquote class="pr-q">“${esc(docV)}”<small>${esc(PDOC.n)}, page ${r.src[0]}, section ${r.src[1]}${live && chg ? '. Your draft changes this.' : ''}</small></blockquote>` : ''}</div>`;
}
function gridHTML(k) {
  const rows = k === 'foir' ? ['salaried', 'selfdoc', 'aip'].map(g => [g, PROG[g], [0, 1, 2, 3]]) : Object.keys(CATS).map(g => [g, CATS[g], [0, 1, 2]]), cols = k === 'foir' ? BANDS : SLABS;
  return `<div class="pg-w"><table class="pg"><thead><tr><th>${k === 'foir' ? 'Income programme' : 'Property'}</th>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(([g, l, ix]) => `<tr><td>${esc(l)}</td>${ix.map(i => { const p = k + '.' + g + '.' + i, v = pcur(p), ch = !ONB() && p in ADM.pe && ADM.pe[p] !== getP(POL, p); return `<td><span class="pgc${ch ? ' chg' : ''}"><input class="pin6 sm" type="number" data-pg="${p}" value="${v}" aria-label="${esc(pathLabel(p))}">%</span>${ch ? `<small class="was6">was ${getP(POL, p)}%</small>` : ''}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* ---------------- 3. vendors and APIs ---------------- */
function apiSecHTML() {
  const L = apiList(), onb = ONB(), base = onb ? null : ADM.live.api;
  const top = `<div class="api-top"><p>${onb ? 'A recommended setup to start from. For each call, pick the first-choice vendor and the one to switch to if it fails.' : 'For each call, the first-choice vendor and the one the system switches to if it fails or times out.'}</p>${onb ? `<button class="btn ${ADM.onb.apiOk ? 'btn-s' : 'btn-p'} btn-sm" data-act="oapiok">${ic('check')}${ADM.onb.apiOk ? 'Confirmed' : 'Confirm the vendors'}</button>` : ''}</div>`;
  return top + APIG.map((g, gi) => { const it = L.filter(a => a.g === gi); return `<section class="panel"><div class="ph"><h3>${esc(g)}</h3><span class="note">${plural(it.filter(a => a.on).length, 'call')} in use</span></div><div class="pb"><div class="api-w"><table class="api-t"><thead><tr><th>API call</th><th>In use</th><th>First choice</th><th>If it fails, use</th></tr></thead><tbody>${it.map(a => { const o = base ? base.find(x => x.id === a.id) : a, c = f => base && a[f] !== o[f];
    return `<tr class="${a.on ? '' : 'off'}"><td><b>${esc(a.n)}</b><small>Used at ${esc(lc1(a.use))}</small></td><td><label class="tgl6${c('on') ? ' chg' : ''}"><input type="checkbox" data-api="on|${a.id}"${a.on ? ' checked' : ''} aria-label="${esc(a.n)} in use"><span></span></label></td>
    <td><select class="sel${c('pri') ? ' chg' : ''}" data-api="pri|${a.id}"${a.on ? '' : ' disabled'} aria-label="${esc(a.n)}: first choice">${a.v.map(v => `<option value="${v}"${a.pri === v ? ' selected' : ''}>${esc(APIV[v])}</option>`).join('')}</select>${c('pri') ? `<small class="was6">was ${esc(APIV[o.pri])}</small>` : ''}</td>
    <td><select class="sel${c('bak') ? ' chg' : ''}" data-api="bak|${a.id}"${a.on && a.v.length > 1 ? '' : ' disabled'} aria-label="${esc(a.n)}: backup"><option value=""${a.bak ? '' : ' selected'}>None</option>${a.v.filter(v => v !== a.pri).map(v => `<option value="${v}"${a.bak === v ? ' selected' : ''}>${esc(APIV[v])}</option>`).join('')}</select>${c('bak') ? `<small class="was6">was ${esc(APIV[o.bak] || 'None')}</small>` : ''}</td></tr>`; }).join('')}</tbody></table></div></div></section>`; }).join('');
}

/* ---------------- audit trail ---------------- */
function audSecHTML() {
  const F = [['all', 'All'], ['wf', 'Workflow'], ['pol', 'Policy rules'], ['api', 'Vendors and APIs']], ok = verifyAud();
  const L = ADM.aud.filter(e => e.view === ADM.mode && (ADM.af === 'all' || e.area === ADM.af)).slice().reverse();
  return `<div class="aud-top"><div class="aud-f">${F.map(([k, l]) => `<button class="flt${ADM.af === k ? ' on' : ''}" data-act="aaf" data-v="${k}">${l}</button>`).join('')}</div><span class="nav-sp"></span><button class="btn btn-s btn-sm" data-act="averify">${ic('shield')}Check the trail</button><button class="btn btn-s btn-sm" data-act="aexport">${ic('down')}Export as CSV</button></div>
  <div class="chain6 ${ok ? 'ok' : 'bad'}">${ic(ok ? 'link' : 'alert')}<span>${ok ? 'Intact: ' + plural(ADM.aud.length, 'entry', 'entries') + ' across both views, each carrying the hash of the one before it.' : 'Broken: an entry was changed.'} Entries cannot be edited or deleted, including by administrators.</span></div>
  <section class="panel"><div class="pb aud-w"><table class="aud6"><thead><tr><th>When</th><th>Who</th><th>Area</th><th>What changed</th><th>Reason or source</th></tr></thead><tbody>${L.map(e => `<tr><td class="nw">${esc(fds(e.at))}<small>${esc(ftime(e.at))}</small></td><td><b>${esc(e.who)}</b><small>${esc(e.role)}</small></td><td><span class="ar6 ${e.area}">${esc(AREA[e.area])}</span></td><td><b>${esc(e.what)}</b>${e.b || e.a ? `<small>${e.b ? `<s>${esc(e.b)}</s> ${ic('fwd')} ` : ''}${esc(e.a || '')}</small>` : ''}</td><td>${esc(e.why || '')}${e.src ? `<small>${ic(SRCIC[e.srcK] || 'file')}${esc(e.src)}</small>` : ''}</td></tr>`).join('') || `<tr><td colspan="5" class="muted">Nothing logged ${ONB() ? 'in the new setup' : ''} yet.</td></tr>`}</tbody></table></div></section>`;
}

/* ---------------- save bar (live) ---------------- */
function saveBarHTML(st) {
  const parts = [['wf', st.wf.length], ['pol', st.pol.length], ['api', st.api.length]].filter(x => x[1]).map(([k, n]) => AREA[k] + ' ' + n).join(', ');
  const list = st.wf.map(d => ['wf', d.t, d.b, d.a]).concat(st.pol.map(d => ['pol', d.l, d.fb, d.fa]), st.api.map(d => ['api', d.t, d.b, d.a]));
  return `<div class="sbar6">${ADM.showCh ? `<ul class="sb-l">${list.map(([k, t, b, a]) => `<li><span class="ar6 ${k}">${AREA[k]}</span><span>${esc(t)}${b || a ? `: ${b ? `<s>${esc(b)}</s> ${ic('fwd')} ` : ''}<b>${esc(a || '')}</b>` : ''}</span></li>`).join('')}</ul>` : ''}
  <div class="sb-r"><button class="sb-n" data-act="ashow" aria-expanded="${!!ADM.showCh}"><b>${plural(st.n, 'unsaved change')}</b><small>${esc(parts)}. ${ADM.showCh ? 'Hide' : 'See'} them</small></button><input class="inp2${ADM.needWhy ? ' bad' : ''}" id="admWhy" placeholder="Reason, for the audit trail (required)" value="${esc(ADM.why)}" aria-label="Reason for the change"><button class="btn btn-s" data-act="adiscard">Discard</button><button class="btn btn-p" data-act="asave">${ic('check')}Save and apply</button></div></div>`;
}

/* ---------------- live: change by voice note, document or text ---------------- */
function ikHTML() {
  const I = ADM.ik, opt = (k, ico, l, s) => `<button class="ik-o${I.k === k ? ' on' : ''}" data-act="ikpick" data-v="${k}" aria-pressed="${I.k === k}">${ic(ico)}<span><b>${l}</b><small>${esc(s)}</small></span></button>`;
  let body = '';
  if (I.phase === 'run') body = runHTML(I.k === 'voice' ? ['Transcribing the voice note: Hindi and English', 'Finding the changes', 'Matching them to the live setup'] : I.k === 'doc' ? ['Reading the circular: 2 pages', 'Finding the changes', 'Matching them to the live setup'] : ['Reading your text', 'Matching it to the live setup'], I.step, 'Reading it');
  else if (I.phase === 'review') {
    const n = I.props.filter(p => p.on).length;
    body = `<div class="ik-rv"><p class="ik-rh"><b>${plural(I.props.length, 'change')} found</b> in ${esc(ikSrcName())}. Untick anything you don’t want. Nothing goes live until you save the draft.</p>${I.props.map((p, i) => `<label class="ik-p${p.on ? '' : ' off'}"><input type="checkbox" data-ik="${i}"${p.on ? ' checked' : ''}><span class="ar6 ${p.area}">${AREA[p.area]}</span><span class="ik-pt"><b>${esc(p.t)}</b><span class="ik-ba">${p.b ? `<s>${esc(p.b)}</s> ${ic('fwd')} ` : ''}<b>${esc(p.a)}</b></span><q>${esc(p.q)}</q></span></label>`).join('')}
    ${I.miss.length ? `<details class="ik-miss"><summary>${plural(I.miss.length, 'line')} did not match a setting</summary><ul>${I.miss.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${I.k === 'text' ? `<p>Try: ${TXTSUG.map(x => `<button class="lnk" data-act="iksug" data-v="${esc(x)}">${esc(x)}</button>`).join(', ')}</p>` : ''}</details>` : ''}
    <div class="ik-f"><button class="btn btn-p" data-act="ikadd"${n ? '' : ' disabled'}>${ic('plus')}Add ${plural(n, 'change')} to the draft</button><button class="btn btn-g" data-act="ikreset">Start again</button></div></div>`;
  } else {
    const prev = I.k === 'voice' ? `<div class="ik-src"><div class="ik-ap"><button class="ibtn" id="ikB" data-act="ikplay" aria-label="${I.play ? 'Pause' : 'Play'}">${ic(I.play ? 'pause' : 'play')}</button><div class="ik-bar"><i id="ikP" style="width:${I.pt / VNOTE.dur * 100}%"></i></div><span id="ikT">${mmss(I.pt)} / ${mmss(VNOTE.dur)}</span></div><ol class="ik-tr">${VNOTE.segs.map((s, i) => `<li id="iks${i}" class="${I.pt >= s.t && (!VNOTE.segs[i + 1] || I.pt < VNOTE.segs[i + 1].t) && I.pt > 0 ? 'on' : ''}"><time>${mmss(s.t)}</time><span>${esc(s.o)}${s.e ? `<small>${esc(s.e)}</small>` : ''}</span></li>`).join('')}</ol></div>`
      : I.k === 'doc' ? `<div class="ik-src"><div class="ik-doc"><b>${esc(CIRC.n)}</b><small>${esc(CIRC.meta)}</small>${CIRC.lines.map(l => `<p>${esc(l)}</p>`).join('')}</div></div>`
        : I.k === 'text' ? `<div class="ik-src"><textarea class="ta" id="iktxt" rows="4" placeholder="For example: Set the minimum bureau score to 720. Make Experian the primary credit bureau.">${esc(I.txt)}</textarea><p class="ik-try">Try: ${TXTSUG.map(x => `<button class="lnk" data-act="iksug" data-v="${esc(x)}">${esc(x)}</button>`).join(', ')}</p></div>` : '';
    body = `<div class="ik-os">${opt('voice', 'mic', 'Voice note', VNOTE.n + ', ' + VNOTE.meta.split('.')[0])}${opt('doc', 'file', 'Document', CIRC.n)}${opt('text', 'text', 'Type it', 'A few lines, in plain words')}</div>${prev}${I.k ? `<div class="ik-f"><button class="btn btn-p" data-act="ikgo" id="ikGo"${I.k === 'text' && !I.txt.trim() ? ' disabled' : ''}>${ic('wand')}Find the changes</button></div>` : ''}${I.added ? `<p class="ik-ok">${ic('check')}${esc(I.added)}</p>` : ''}`;
  }
  return `<section class="panel ik"><div class="ph"><h3>${ic('wand')}Change something</h3><span class="note">Send a voice note, a document or a few lines. The system finds the changes across the workflow, the rules and the vendors.</span></div><div class="pb">${body}</div></section>`;
}
const ikSrcName = () => ({ voice: VNOTE.who + '\u2019s voice note', doc: 'credit circular CC-2026-14', text: 'your text' }[ADM.ik.k] || '');
const ikSrcLbl = () => ({ voice: 'Voice note from ' + VNOTE.who + ', 13 Nov', doc: CIRC.who, text: 'Typed on the Admin page' }[ADM.ik.k] || '');

/* the change parser: one sentence at a time, against the live setup */
function numsOf(s, re) { return [...s.matchAll(re)].map(m => +String(m[1]).replace(/,/g, '')); }
function pctLast(s) { const a = numsOf(s, /(\d{1,3}(?:\.\d+)?)\s*(?:%|percent|per cent)/g); return a.length ? a[a.length - 1] : null; }
function amtAfter(s, w) { const m = s.match(new RegExp(w + '\\s*(?:rs\\.?|₹|inr)?\\s*(\\d+(?:\\.\\d+)?|one|two|three|four|five)\\s*(lakh|crore)')); if (!m) return null; const n = +m[1] || NUMW[m[1]]; return Math.round(n * (m[2] === 'crore' ? 1e7 : 1e5)); }
const LTVK = [[/self[- ]?construct/, 'selfcon'], [/plot/, 'plotcon'], [/resale/, 'resale'], [/balance transfer|\bbt\b/, 'bt'], [/approved project|\bapf\b/, 'apf'], [/builder|under construction/, 'builder'], [/patta|non-?standard/, 'nonstd']];
const APIA = { cibil: ['cibil', 'transunion'], exp: ['experian'], eqf: ['equifax'], crif: ['crif', 'high mark'], satya: ['satya'], pehchaan: ['pehchaan'], sangam: ['sangam'], pravah: ['pravah'], ganit: ['ganit'], ledger: ['ledgerwise'], kavach: ['kavach'], sentinel: ['sentinel'], mohar: ['mohar'], akshar: ['akshar'], dhara: ['dhara'], uidai: ['uidai'], gstn: ['gstn'], itd: ['income tax department'] };
const APIK = [[/bank statement|statement analysis/, 'bsa'], [/bureau|credit report/, 'bureau'], [/account aggregator|\baa\b/, 'aa'], [/\bpan\b/, 'pan'], [/aadhaar|e-?kyc/, 'aadhaar'], [/ckyc/, 'ckyc'], [/face|liveness/, 'face'], [/\bitr\b|26as/, 'itr'], [/\bgst\b/, 'gst'], [/epfo|employment/, 'epfo'], [/fraud|dedupe/, 'fraud'], [/cersai/, 'cersai'], [/e-?sign/, 'esign'], [/nach|mandate/, 'enach']];
const WFK = [[/legal|title search/, 'T11'], [/valuation|valuer|technical report/, 'T12'], [/field investigation|\bfi\b|residence|office visit/, 'T9'], [/\bfcu\b|fraud control/, 'T10'], [/personal discussion|\bpd\b/, 'T15'], [/credit memo|\bcam\b/, 'T17'], [/sanction letter|\bkfs\b/, 'T22'], [/acceptance/, 'T24'], [/disbursement memo/, 'T27'], [/log ?in/, 'T3']];
function pcPol(s0, s, p, v, t) { const b = pcur(p); if (b === v) return null; return { area: 'pol', t: t || pLabel(p), b: pFmtPath(p, b), a: pFmtPath(p, v), q: s0, ch: [{ k: 'pol', p, v }] }; }
const PC = [
  (s0, s) => { if (!/\bfoir\b/.test(s)) return null; const v = pctLast(s); if (v == null) return null;
    const g = /self[- ]?employ|business/.test(s) ? 'selfdoc' : /assessed|informal/.test(s) ? 'aip' : 'salaried';
    let B = [0, 1, 2, 3]; if (/(above|over|more than)\s*(rs\.?|₹)?\s*(1|one)\s*lakh|above\s*(rs\.?|₹)?\s*1,00,000/.test(s)) B = [3]; else if (/50,?000\s*(to|and)\s*(rs\.?|₹)?\s*(1|one)\s*lakh/.test(s)) B = [2]; else if (/25,?000\s*(to|and)\s*(rs\.?|₹)?\s*50,?000/.test(s)) B = [1]; else if (/(up to|below|under)\s*(rs\.?|₹)?\s*25,?000/.test(s)) B = [0];
    const ch = B.map(i => ({ k: 'pol', p: 'foir.' + g + '.' + i, v })).filter(c => pcur(c.p) !== v); if (!ch.length) return null;
    return { area: 'pol', t: 'FOIR cap, ' + lc1(PROG[g]) + (B.length === 1 ? ', income ' + lc1(BANDS[B[0]]) : ', every income band'), b: [...new Set(ch.map(c => pcur(c.p) + '%'))].join(', '), a: v + '%', q: s0, ch }; },
  (s0, s) => { if (!/\bltv\b|loan to value/.test(s)) return null; const v = pctLast(s), k = (LTVK.find(([re]) => re.test(s)) || [])[1]; if (v == null || !k) return null;
    let I = [0, 1, 2]; if (/30 lakh\s*(to|and)\s*(rs\.?|₹)?\s*75 lakh|30 to 75 lakh/.test(s)) I = [1]; else if (/(up to|below|under)\s*(rs\.?|₹)?\s*30 lakh/.test(s)) I = [0]; else if (/(above|over)\s*(rs\.?|₹)?\s*75 lakh/.test(s)) I = [2];
    const ch = I.map(i => ({ k: 'pol', p: 'ltv.' + k + '.' + i, v })).filter(c => pcur(c.p) !== v); if (!ch.length) return null;
    return { area: 'pol', t: 'LTV cap, ' + lc1(CATS[k]) + (I.length === 1 ? ', loans ' + lc1(SLABS[I[0]]) : ', every loan size'), b: [...new Set(ch.map(c => pcur(c.p) + '%'))].join(', '), a: v + '%', q: s0, ch }; },
  (s0, s) => { if (!/\bscore\b/.test(s)) return null; const n = numsOf(s, /\b(\d{3})\b/g).filter(x => x >= 300 && x <= 900); if (!n.length) return null; return pcPol(s0, s, /\bl3\b|zonal/.test(s) ? 'dev.scoreL3' : /\bl2\b|regional/.test(s) ? 'dev.scoreL2' : 'dev.scoreMin', n[n.length - 1]); },
  (s0, s) => { if (!/(two|2|second)\s+(independent\s+)?(technical\s+)?(valuations?|reports?)/.test(s)) return null; const a = amtAfter(s, 'above'); if (!a) return null;
    const out = [pcPol(s0, s, 'dualAbove', a, 'Two valuations for loans above')].filter(Boolean), t = findNode(ADM.live.wfW, 'T12'), nm = 'Technical valuation; two reports above ' + lakh(a);
    if (t && t.node.n !== nm) out.push({ area: 'wf', t: 'Step: technical valuation', b: t.node.n, a: nm, q: s0, ch: [{ k: 'wfset', id: 'T12', f: 'n', v: nm }] });
    return out.length ? out : null; },
  (s0, s) => { const a = amtAfter(s, 'up to') || amtAfter(s, 'to'); if (!a || !/sanction|limit/.test(s)) return null;
    const p = /\bsystem\b/.test(s) ? 'sysAuth' : /\bl2\b|regional credit manager/.test(s) ? 'auth.L2' : /\bl3\b|zonal credit manager/.test(s) ? 'auth.L3' : /\bl1\b|credit manager/.test(s) ? 'auth.L1' : null; return p ? pcPol(s0, s, p, a) : null; },
  (s0, s) => { if (!/\bage\b/.test(s) || !/(max|limit|maturity|ends?)/.test(s)) return null; const n = numsOf(s, /\b(\d{2})\b/g).filter(x => x >= 50 && x <= 80); if (!n.length) return null; return pcPol(s0, s, /self[- ]?employ/.test(s) ? 'age.selfemp' : 'age.salaried', n[n.length - 1]); },
  (s0, s) => { if (!/primary|first choice|switch|move|make|use|backup|fallback/.test(s)) return null;
    const vid = Object.keys(APIA).find(k => APIA[k].some(w => s.includes(w))); if (!vid) return null;
    let C = apiList().filter(a => a.v.includes(vid)); if (C.length > 1) { const h = APIK.find(([re]) => re.test(s)); if (h) C = C.filter(a => a.id === h[1]); } if (C.length !== 1) return null;
    const a = C[0];
    if (/backup|fallback|second choice|if (it|.+) fails/.test(s)) return a.bak === vid ? null : { area: 'api', t: a.n + ': if it fails, use', b: APIV[a.bak] || 'None', a: APIV[vid], q: s0, ch: [{ k: 'api', id: a.id, f: 'bak', v: vid }] };
    if (a.pri === vid) return null;
    return { area: 'api', t: a.n + ': first choice', b: APIV[a.pri], a: APIV[vid] + ', with ' + APIV[a.pri] + ' as the backup', q: s0, ch: [{ k: 'api', id: a.id, f: 'pri', v: vid }, { k: 'api', id: a.id, f: 'bak', v: a.pri }] }; },
  (s0, s) => { const m = s.match(/(?:needs?|add|include|requires?)\s+(?:an?\s+)?(?:new\s+)?(?:step\s*:?\s*)?([a-z][a-z -]{2,40}?)\s+by\s+(?:the\s+)?([a-z ]+?)(?=\s+(?:before|for|after|within|on|in|at)\b|[.,;]|$)/); if (!m) return null;
    const role = findRole(m[2]); if (!role) return null; const nm = cap1(m[1].trim()) + ' by the ' + lc1(rn(role)).replace(/, l\d$/i, ''), a = amtAfter(s, 'above'), d5 = findNode(ADM.live.wfW, 'D5');
    const step = { t: 'step', n: nm, r: role, sla: findSla(s) || { n: 1, u: 'wd' }, src: [] };
    let where, wl; if (a === 7500000 && d5) { where = { dec: 'D5', arm: 0 }; wl = 'On the “Loan above ₹75 lakh?” Yes branch'; } else { const g = findStage(s) || 'g6', st = ADM.live.wfW.stages.find(x => x.id === g); where = { g }; wl = 'At the end of “' + (st ? st.n : g) + '”'; }
    return { area: 'wf', t: 'New step: ' + nm, b: '', a: wl + ', ' + rn(role) + ', ' + lc1(slaTxt(step.sla)), q: s0, ch: [{ k: 'wfadd', where, step }] }; },
  (s0, s) => { if (!/(turnaround|within|working (day|hour)|\bdays?\b|\bhours?\b)/.test(s)) return null; const m = s.match(/(\d+|one|two|three|four|five)\s+(working\s+)?(days?|hours?)/); if (!m) return null;
    const sla = { n: +m[1] || NUMW[m[1]], u: /hour/.test(m[3]) ? 'wh' : 'wd' }, h = WFK.find(([re]) => re.test(s)); if (!h) return null; const n = findNode(ADM.live.wfW, h[1]); if (!n || slaTxt(n.node.sla) === slaTxt(sla)) return null;
    return { area: 'wf', t: 'Turnaround of “' + short(n.node.n, 50) + '”', b: slaTxt(n.node.sla), a: slaTxt(sla), q: s0, ch: [{ k: 'wfset', id: h[1], f: 'sla', v: sla }] }; },
  (s0, s) => { const m = s.match(/(?:make|let|have)\s+(.+?)\s+(?:the\s+)?owner of\s+(.+)/); if (!m) return null; const role = findRole(m[1]), h = WFK.find(([re]) => re.test(m[2])); if (!role || !h) return null; const n = findNode(ADM.live.wfW, h[1]); if (!n || n.node.r === role) return null;
    return { area: 'wf', t: 'Owner of “' + short(n.node.n, 50) + '”', b: rn(n.node.r), a: rn(role), q: s0, ch: [{ k: 'wfset', id: h[1], f: 'r', v: role }] }; }
];
function parseChanges(txt) {
  const props = [], miss = [];
  txt.split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9₹])/).map(x => x.trim()).filter(x => x.length > 3).forEach(s0 => {
    const clean = s0.replace(/^\s*(\d+[.)]|[-*•]|one:|two:|three:|four:)\s*/i, ''), s = clean.toLowerCase();
    let got = null; for (const f of PC) { got = f(clean, s); if (got) break; }
    if (got) [].concat(got).forEach(p => { p.on = 1; props.push(p); }); else miss.push(clean);
  });
  return { props, miss };
}
function applyOps(p) {
  p.ch.forEach(c => {
    if (c.k === 'pol') ADM.pe[c.p] = c.v;
    if (c.k === 'api') { const cur = apiList().find(a => a.id === c.id); ADM.ae[c.id] = Object.assign({ on: cur.on, pri: cur.pri, bak: cur.bak }, ADM.ae[c.id] || {}, { [c.f]: c.v }); if (ADM.ae[c.id].bak === ADM.ae[c.id].pri) ADM.ae[c.id].bak = ''; }
    if (c.k === 'wfset') { const h = findNode(ADM.live.wfW, c.id); if (h) h.node[c.f] = deep(c.v); }
    if (c.k === 'wfadd') { const st = Object.assign(deep(c.step), { id: 'N' + (++ADM.nid), add: 1 }), w = c.where; if (w.dec) { const h = findNode(ADM.live.wfW, w.dec); if (h) h.node.arms[w.arm].items.push(st); } else { const g = ADM.live.wfW.stages.find(x => x.id === w.g); if (g) g.items.push(st); } }
  });
}

/* ---------------- flowchart edits ---------------- */
function newStep(n) { return { t: 'step', id: 'N' + (++ADM.nid), n: n || 'New step', r: '', sla: { n: 1, u: 'wd' }, src: [], add: 1 }; }
function wlog(what, b, a) { if (ONB()) alog2({ area: 'wf', what, b, a, why: 'Edited in the new setup' }); }
function fedit(key, el) {
  const [k, id] = key.split('|'), F = curFlow(), hit = findNode(F, id); if (!hit) return;
  const o = hit.node, v = el.value;
  if (k === 'n' || k === 'q' || k === 'gn') { const f = k === 'q' ? 'q' : 'n', was = o[f], nv = v.replace(/\s+/g, ' ').trim(); if (!nv || nv === was) return; o[f] = nv; wlog(k === 'q' ? 'Changed a question' : k === 'gn' ? 'Renamed a stage' : 'Renamed a step', was, nv); }
  else if (/^l\d$/.test(k)) { const i = +k[1], was = o.arms[i].l, nv = v.trim(); if (!nv || nv === was) return; o.arms[i].l = nv; wlog('Renamed a branch of “' + o.q + '”', was, nv); }
  else if (k === 'note') { const was = o.note || ''; o.note = v.trim(); wlog('Note on the parallel block', was || 'None', o.note || 'None'); }
  else if (k === 'r') { const was = rn(o.r); o.r = v; if (v === 'sys') o.sla = { n: 0, u: 'auto' }; else if (o.sla && o.sla.u === 'auto') o.sla = { n: 1, u: 'wd' }; wlog('Owner of “' + short(o.n, 50) + '”', was, rn(v)); }
  else if (k === 'su' || k === 'gsu') { const was = slaTxt(o.sla); o.sla = !v ? null : ['auto', 'sd'].includes(v) ? { n: 0, u: v } : { n: o.sla && o.sla.n ? o.sla.n : 1, u: v }; wlog('Turnaround of “' + short(o.n, 50) + '”', was, slaTxt(o.sla)); }
  render();
}
function feditNum(key, el) { const [k, id] = key.split('|'), hit = findNode(curFlow(), id); if (!hit) return; const o = hit.node, was = slaTxt(o.sla), n = Math.max(0, Math.round(+el.value || 0)); o.sla = { n, u: o.sla && !['auto', 'sd'].includes(o.sla.u) ? o.sla.u : 'wd' }; wlog('Turnaround of “' + short(o.n, 50) + '”', was, slaTxt(o.sla)); render(); }

/* ---------------- actions ---------------- */
const _go6 = ACT.go;
Object.assign(ACT, {
  go(v) { if (v === 'admin') { if (!ADM) initAdmin(); S.view = 'admin'; S.sheet = null; render(); return; } _go6(v); },
  amode(v) { if (ADM.mode === v) return; ADM.mode = v; ADM.sel = null; ADM.pq = null; IKP.stop(); render(); },
  asec(v) { ADM.sec = v; ADM.sel = null; ADM.pq = null; render(); },
  osrc(v) { ADM.onb.src[v] = ADM.onb.src[v] ? 0 : 1; render(); },
  opaste() { ADM.onb.txt = ADM.onb.txt.trim() === NOTE4TXT ? '' : NOTE4TXT; render(); },
  obuild() {
    const O = ADM.onb, steps = capSteps(), att = capAtt(); if (!att.length && !O.txt.trim()) return;
    O.phase = 'run'; O.step = 0; render();
    const nx = () => { O.step++; if (O.step < steps.length) { render(); setTimeout(nx, 520); return; }
      const custom = O.txt.trim() && O.txt.trim() !== NOTE4TXT ? O.txt : '';
      O.wf = buildFlow(att, custom, false); O.phase = 'done'; ADM.sel = null; const fs = flowStats(O.wf);
      alog2({ area: 'wf', what: 'Built the workflow from ' + plural(att.length + (custom ? 1 : 0), 'source'), a: plural(fs.steps, 'step') + ', ' + plural(fs.decs, 'decision') + ', ' + plural(fs.stages, 'stage'), why: 'New setup', src: listAnd(att.map(k => WSRC[k].n).concat(custom ? ['typed text'] : [])) });
      render(); toast('Workflow built: ' + plural(fs.steps, 'step') + (fs.flags ? ', ' + plural(fs.flags, 'question') + ' for you' : '') + (O.wf.skipped.length ? '. ' + plural(O.wf.skipped.length, 'line') + ' of your text not understood' : '')); };
    setTimeout(nx, 520);
  },
  orebuild() { ADM.onb.phase = 'pick'; ADM.sel = null; render(); },
  fsel(v) { ADM.sel = ADM.sel === v ? null : v; ADM.focusNew = null; render(); },
  fnext() { const F = curFlow(), ids = Object.keys(F.flags || {}); if (!ids.length) return; const i = ids.indexOf(ADM.sel); ADM.sel = ids[(i + 1) % ids.length]; render(); const el = document.querySelector('.wf-n.on, .wf-d.on'); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); },
  fflag(v) { const [id, o] = v.split('|'), F = curFlow(), f = FFLAG[id]; resolveFlag(F, id, o, false); ADM.sel = f.k === 'inf' && o === 'drop' ? null : id; render(); toast('Answered. ' + (Object.keys(F.flags).length ? plural(Object.keys(F.flags).length, 'question') + ' left' : 'No questions left')); },
  fadd(v) {
    const [k, id, ai] = v.split('|'), F = curFlow(), hit = findNode(F, id); if (!hit) return; let n;
    if (k === 'stage') { const i = F.stages.indexOf(hit.node), g = { id: 'G' + (++ADM.nid), n: 'New stage', sla: { n: 1, u: 'wd' }, items: [] }; F.stages.splice(i + 1, 0, g); wlog('Added a stage', '', g.n); ADM.sel = g.id; render(); return; }
    if (k === 'stepEnd' || k === 'decEnd') { n = k === 'stepEnd' ? newStep() : { t: 'dec', id: 'N' + (++ADM.nid), q: 'New question?', arms: [{ l: 'Yes', items: [] }, { l: 'No', items: [] }], src: [] }; hit.node.items.push(n); }
    else if (k === 'arm') { n = newStep(); hit.node.arms[+ai].items.push(n); }
    else if (k === 'lane') { n = newStep(); hit.node.lanes.push(n); }
    else { n = k === 'dec' ? { t: 'dec', id: 'N' + (++ADM.nid), q: 'New question?', arms: [{ l: 'Yes', items: [] }, { l: 'No', items: [] }], src: [] } : newStep();
      if (k === 'dec' && hit.parent) { const top = findIn(hit.g.items, (hit.parent.dec || hit.parent.par).id, hit.g); top.arr.splice(top.idx + 1, 0, n); } else hit.arr.splice(hit.idx + 1, 0, n); }
    wlog(n.t === 'dec' ? 'Added a decision' : 'Added a step', '', n.t === 'dec' ? n.q : n.n); ADM.sel = n.id; ADM.focusNew = n.id; render(); toast(n.t === 'dec' ? 'Decision added. Write the question, then add steps to its branches' : 'Step added. Name it and pick an owner');
  },
  fdel(v) {
    const F = curFlow(), hit = findNode(F, v); if (!hit) return;
    if (hit.stage) { if (hit.node.items.length) return; F.stages.splice(F.stages.indexOf(hit.node), 1); wlog('Deleted a stage', hit.node.n, ''); }
    else { hit.arr.splice(hit.idx, 1); if (hit.parent && hit.parent.par && !hit.parent.par.lanes.length) { const top = findIn(hit.g.items, hit.parent.par.id, hit.g); top.arr.splice(top.idx, 1); } if (F.flags) delete F.flags[v]; wlog(hit.node.t === 'dec' ? 'Deleted a decision' : 'Deleted a step', hit.node.t === 'dec' ? hit.node.q : hit.node.n, ''); }
    ADM.sel = null; render(); toast('Deleted');
  },
  fmove(v) { const [id, d] = v.split('|'), hit = findNode(curFlow(), id); if (!hit || !hit.arr) return; const j = hit.idx + +d; if (j < 0 || j >= hit.arr.length) return; const [x] = hit.arr.splice(hit.idx, 1); hit.arr.splice(j, 0, x); wlog('Moved “' + short(x.n || x.q || 'In parallel', 50) + '” ' + (+d < 0 ? 'up' : 'down'), '', ''); render(); },
  opsrc() { ADM.onb.polOn = ADM.onb.polOn ? 0 : 1; render(); },
  opread() {
    const O = ADM.onb; O.polPhase = 'run'; O.polStep = 0; render();
    const nx = () => { O.polStep++; if (O.polStep < 4) { render(); setTimeout(nx, 560); return; }
      O.pol = deep(POL12); O.loc = {}; PRULES.forEach(r => { if (!r.p && r.u !== 'grid' && r.u !== 'rbi') O.loc[r.id] = r.v; }); O.polPhase = 'done';
      alog2({ area: 'pol', what: 'Read the credit policy', a: plural(PRULES.length, 'rule') + ' with ' + polLimits() + ' limits', why: 'New setup', src: PDOC.n }); render(); toast('Policy read: ' + plural(PRULES.length, 'rule') + ', 1 needs a number from you'); };
    setTimeout(nx, 560);
  },
  apf(v) { ADM.pf = v; render(); },
  apq(v) { ADM.pq = ADM.pq === v ? null : v; render(); },
  oapiok() { if (!ADM.onb.apiOk) { ADM.onb.apiOk = 1; alog2({ area: 'api', what: 'Confirmed the vendors', a: plural(ADM.onb.api.filter(a => a.on).length, 'call') + ' in use', why: 'New setup' }); } render(); toast('Vendors confirmed'); },
  ogolive() { ADM.onb.live = 1; alog2({ area: 'setup', what: 'Go-live scheduled', a: GOLIVE, why: 'New setup complete' }); render(); toast('Go-live scheduled for ' + GOLIVE); },
  aaf(v) { ADM.af = v; render(); },
  averify() { const ok = verifyAud(); render(); toast(ok ? 'Intact: every entry matches its hash' : 'Broken: an entry was changed'); },
  aexport() {
    const rows = [['When', 'Who', 'Role', 'View', 'Area', 'What changed', 'Before', 'After', 'Reason', 'Source', 'Hash', 'Previous hash']].concat(ADM.aud.map(e => [e.at, e.who, e.role, e.view === 'onb' ? 'New setup' : 'Live', AREA[e.area], e.what, e.b || '', e.a || '', e.why || '', e.src || '', e.h, e.prev]));
    const csv = rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'uncia-admin-audit-trail.csv'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { /* download blocked: nothing else to do */ }
    toast('Audit trail exported as CSV');
  },
  ashow() { ADM.showCh = ADM.showCh ? 0 : 1; render(); },
  adiscard() { ADM.pe = {}; ADM.le = {}; ADM.ae = {}; ADM.live.wfW = deep(ADM.live.wf); ADM.why = ''; ADM.src = ''; ADM.needWhy = 0; ADM.showCh = 0; ADM.ik.added = ''; render(); toast('Draft discarded. Nothing changed'); },
  asave() {
    const st = staged(), why = (ADM.why || '').trim(); if (!st.n) return;
    if (!why) { ADM.needWhy = 1; render(); const el = $('#admWhy'); if (el) el.focus(); toast('Add a reason first, for the audit trail'); return; }
    const at = tick(2), src = ADM.src || '', srcK = ADM.srcK || '';
    const pp = st.pol.filter(d => d.p);
    if (pp.length) { const p = deep(POL); pp.forEach(d => setP(p, d.p, d.to)); p.ver = POL.ver + 1; p.at = at; p.maker = ADMIN.name; p.checker = null; p.note = 'Changed on the Admin page: ' + pp.map(d => d.l + ', ' + d.fb + ' to ' + d.fa).join('; ') + '. Reason: ' + why; POL = p; VERS.unshift(deep(p)); }
    st.pol.forEach(d => { if (d.id) ADM.loc[d.id] = d.to; alog2({ at, area: 'pol', what: d.l, b: d.fb, a: d.fa, why, src, srcK }); });
    st.api.forEach(d => { const a = ADM.live.api.find(x => x.id === d.id); a[d.f] = ADM.ae[d.id][d.f]; alog2({ at, area: 'api', what: d.t, b: d.b, a: d.a, why, src, srcK }); });
    if (st.wf.length) { ADM.live.wf = deep(ADM.live.wfW); ADM.live.ver = (parseFloat(ADM.live.ver) + 0.1).toFixed(1); st.wf.forEach(d => alog2({ at, area: 'wf', what: d.t, b: d.b, a: d.a, why, src, srcK })); }
    ADM.pe = {}; ADM.le = {}; ADM.ae = {}; ADM.why = ''; ADM.src = ''; ADM.srcK = ''; ADM.needWhy = 0; ADM.showCh = 0; ADM.ik.added = '';
    render(); toast(plural(st.n, 'change') + ' applied and logged' + (pp.length ? '. Policy version ' + POL.ver + ' is live' : ''));
  },
  ikpick(v) { const I = ADM.ik; if (I.k !== v) { I.k = v; I.pt = 0; IKP.stop(); } I.added = ''; render(); },
  iksug(v) { const I = ADM.ik; I.k = 'text'; I.txt = (I.txt.trim() ? I.txt.trim() + '\n' : '') + v; I.phase = 'pick'; render(); },
  ikplay() { const I = ADM.ik; if (I.play) { IKP.stop(); ikSync(); return; } if (I.pt >= VNOTE.dur) I.pt = 0; I.play = 1; ikSync(); IKP.tm = setInterval(() => { I.pt = Math.min(VNOTE.dur, I.pt + 1); if (I.pt >= VNOTE.dur) IKP.stop(); ikSync(); }, 120); },
  ikgo() {
    const I = ADM.ik; if (!I.k) return; IKP.stop();
    const txt = I.k === 'voice' ? VNOTE.segs.map(s => s.e || s.o).join(' ') : I.k === 'doc' ? CIRC.lines.join('\n') : I.txt; if (!txt.trim()) return;
    I.phase = 'run'; I.step = 0; render(); const N = I.k === 'text' ? 2 : 3;
    const nx = () => { I.step++; if (I.step < N) { render(); setTimeout(nx, 520); return; } const r = parseChanges(txt); I.props = r.props; I.miss = I.k === 'voice' ? [] : r.miss; I.phase = r.props.length ? 'review' : 'pick'; render(); if (!r.props.length) toast('No change to a setting found. Try one of the examples'); };
    setTimeout(nx, 520);
  },
  ikadd() {
    const I = ADM.ik, P = I.props.filter(p => p.on); if (!P.length) return;
    P.forEach(applyOps); ADM.src = ikSrcLbl(); ADM.srcK = { voice: 'S2', doc: 'S1', text: 'T' }[I.k]; if (!ADM.why.trim()) ADM.why = I.k === 'text' ? '' : 'As asked in the ' + (I.k === 'voice' ? 'voice note from ' + VNOTE.who : 'credit circular CC-2026-14');
    I.added = plural(P.length, 'change') + ' added to the draft from ' + ikSrcName() + '. They are marked in each section; save them at the bottom of the page.';
    I.phase = 'pick'; I.k = null; I.props = []; I.miss = []; I.txt = ''; I.pt = 0;
    const first = P[0].area; ADM.sec = first; ADM.sel = null; render(); toast(plural(P.length, 'change') + ' added to the draft');
  },
  ikreset() { const I = ADM.ik; I.phase = 'pick'; I.props = []; I.miss = []; render(); }
});
const IKP = { tm: null, stop() { if (this.tm) clearInterval(this.tm); this.tm = null; if (ADM) ADM.ik.play = 0; } };
function ikSync() {
  const I = ADM.ik, p = $('#ikP'), t = $('#ikT'), b = $('#ikB'); if (p) p.style.width = (I.pt / VNOTE.dur * 100) + '%'; if (t) t.textContent = mmss(I.pt) + ' / ' + mmss(VNOTE.dur);
  if (b) { b.innerHTML = ic(I.play ? 'pause' : 'play'); b.setAttribute('aria-label', I.play ? 'Pause' : 'Play'); }
  VNOTE.segs.forEach((s, i) => { const el = $('#iks' + i); if (el) el.classList.toggle('on', I.pt > 0 && I.pt >= s.t && (!VNOTE.segs[i + 1] || I.pt < VNOTE.segs[i + 1].t)); });
}
/* policy studio approvals land in the same trail */
const _pchk6 = ACT.pchk;
ACT.pchk = function (...a) { const v0 = POL.ver; _pchk6(...a); if (ADM && POL.ver !== v0) diffPol(VERS[1], POL).forEach(d => alog2({ view: 'live', who: PEOPLE.checker.name, role: PEOPLE.checker.title, area: 'pol', what: d.l, b: fmtP(d.p, d.from), a: fmtP(d.p, d.to), why: 'Policy version ' + POL.ver + ', made by ' + PEOPLE.maker.name })); };

/* ---------------- inputs ---------------- */
function polSet(r, v) {
  if (ONB()) { const O = ADM.onb, was = r.p ? getP(O.pol, r.p) : O.loc[r.id]; if (was === v) return; if (r.p) setP(O.pol, r.p, v); else O.loc[r.id] = v; alog2({ area: 'pol', what: r.n, b: pfmt(r, was), a: pfmt(r, v), why: 'Edited in the new setup' }); }
  else if (r.p) ADM.pe[r.p] = v; else ADM.le[r.id] = v;
  render();
}




/* =====================================================================
   v6: the customer's own page. One normal page: where the application
   is, what is in and what is still needed, the loan in brief, who to
   talk to, and a chat that answers from the case itself.
   ===================================================================== */
const cusCase = () => CASES.find(c => c.id === (S.cust || 'N1'));
const cusReady = () => cusOk('N1') || cusOk('G');
const CUSDOC = {
  app: ['We’ve emailed you a link to sign it with an Aadhaar OTP.', 'It confirms the details you gave us and your consent to the loan terms.'],
  f16: ['Your employer’s HR or payroll team can give you this.', 'It confirms your salary and the tax deducted over two years.'],
  ats: ['The agreement you signed with the seller.', 'It shows the price and the flat you are buying.'],
  deeds: ['The seller has it.', 'It shows how the seller came to own the flat, for the legal check.'],
  ec: ['From the sub-registrar’s office, or your advocate can get it.', 'It shows whether the flat has any loan or charge on it.'],
  oc: ['The society or the seller has it.', 'It confirms the building was approved for people to live in.'],
  share: ['From the housing society.', 'It confirms the seller’s membership and that the society has no objection to the sale.'],
  ins: ['Needed before disbursement, not now.', 'It protects the flat, and our interest in it.']
};
const cdk = d => d.id.split('_')[0];
const CUSCHK = { fi: 'A visit to your home and office', legal: 'Legal check of the flat’s title', tech: 'Property valuation', tech2: 'Second property valuation' };

/* where the application stands, in the customer's words */
function cusState(c) {
  const ev = fullEval(c), k = ev.st.k, san = c.w.san || {}, miss = loginMissing(c).concat(san.accepted ? c.docs.filter(d => d.need === 'cp' && !d.up) : []), checks = c.tasks.filter(t => CUSCHK[t.id]), done = checks.filter(t => t.st === 'accepted').length;
  const s = { ev, k, miss, checks, done, bad: k === 'declined' };
  if (k === 'docs') Object.assign(s, { cur: 1, title: 'We need a few more documents', text: 'Upload the ' + plural(miss.length, 'document') + ' below. As soon as they are in, we start the property and legal checks.' });
  else if (k === 'provisional') Object.assign(s, { cur: 2, title: 'We are checking the flat and your documents', text: 'A valuer visits the flat, our advocate checks the title, and an agency visits your home and office. This usually takes 3 to 5 working days.' });
  else if (['review', 'returned', 'pending'].includes(k)) Object.assign(s, { cur: 3, title: 'Our credit team is reviewing your application', text: 'All the checks are back. You will hear from us within 2 working days.' });
  else if (k === 'approved') {
    if (san.handoff) Object.assign(s, { cur: 5, title: 'Your loan is being disbursed', text: 'Our operations team is checking the original property documents and arranging the payment to the seller.' });
    else if (san.accepted) Object.assign(s, { cur: 5, title: 'Thank you. You have accepted the offer', text: 'Next, our operations team checks the original property documents and arranges the payment to the seller.' });
    else if (san.sent) Object.assign(s, { cur: 4, title: 'Your sanction letter is ready', text: 'Read the letter and the Key Facts Statement, then accept the offer with an OTP. The offer is valid for ' + LENDER.validity + ' days.', act: 1 });
    else Object.assign(s, { cur: 4, title: 'Good news: your loan is approved', text: 'We are preparing your sanction letter and Key Facts Statement. You will get them by email and SMS, and here.' });
  } else if (k === 'declined') Object.assign(s, { cur: 3, title: 'We could not approve your loan this time', text: 'We have sent you a letter with the main reasons. You can reply to it, or talk to your relationship manager.' });
  else Object.assign(s, { cur: 0, title: 'Your application', text: '' });
  return s;
}
function cusSteps(c, s) {
  const san = c.w.san || {}, need = c.docs.filter(d => d.need === 'login'), nIn = need.filter(d => d.up).length;
  const L = [
    ['Application', 'Logged in ' + fds(c.v.login)],
    ['Documents', nIn < need.length ? nIn + ' of ' + need.length + ' in' : 'All in'],
    ['Checks', s.cur < 2 ? 'Property, title, visits' : s.done < s.checks.length ? s.done + ' of ' + s.checks.length + ' done' : 'Done'],
    ['Decision', s.bad ? 'Not approved' : s.k === 'approved' ? 'Approved ' + fds(c.w.dec.at) : 'Within 2 working days'],
    ['Sanction letter', san.accepted ? 'Accepted' : san.sent ? 'Ready for you' : 'After the decision'],
    ['Disbursement', san.handoff ? 'In progress' : san.accepted ? 'Being arranged' : 'After you accept']
  ];
  return L.map(([t, sub], i) => ({ t, sub, cls: i < s.cur || (i === 5 && san.handoff && false) ? 'done' : i === s.cur ? (s.bad ? 'cur bad' : 'cur') : 'todo' }));
}




/* ---------------- the assistant ---------------- */
function cusAnswer(q, c) {
  const s = q.toLowerCase(), st = cusState(c), k = st.k, nm = c.apps[0].name.split(' ')[0], san = c.w.san || {}, miss = st.miss;
  const pend = () => miss.length ? 'We still need ' + plural(miss.length, 'document') + ':\n' + miss.map(d => '\u2022 ' + d.t).join('\n') + '\nYou can upload them on this page.' : 'Nothing is pending from you right now. Thank you!';
  const status = () => ({ docs: 'Your application ' + c.v.appNo + ' was logged in on ' + fds(c.v.login) + '. ' + pend() + ' Once they are in, we start the property and legal checks.', provisional: 'All your documents are in. We are checking the flat: the valuation, the legal check of the title, and a visit to your home and office. ' + st.done + ' of ' + st.checks.length + ' are done.', review: 'All the checks are back and our credit team is reviewing your application. You will hear from us within 2 working days.', declined: 'We could not approve your application this time. We have sent you a letter with the main reasons.' }[['returned', 'pending'].includes(k) ? 'review' : k] || (k === 'approved' ? (san.handoff ? 'Your loan is with our operations team for disbursement.' : san.accepted ? 'You have accepted the offer. Our operations team is checking the original property documents before paying the seller.' : san.sent ? 'Your sanction letter and Key Facts Statement are ready on this page. Accept the offer to move to disbursement.' : 'Good news: your loan of ' + lakh(c.v.loan) + ' is approved. We are preparing your sanction letter.') : 'Your application is with us.'));
  if (/^(hi|hello|hey|namaste)\b/.test(s)) return 'Hello ' + nm + '! Ask me about your application, your documents, the EMI, fees or prepayment.';
  if (/complain|grievance|unhappy|not happy|escalat/.test(s)) return 'I’m sorry to hear that. I have passed it to our grievance team, who will reply here. I have also told ' + SALES.name + ', your relationship manager.';
  if (/prepa|foreclos|part.?pay|pay (it )?off early|close (the|my) loan/.test(s)) return 'Yes. Your loan has a floating rate, so you can prepay part or all of it at any time, with no prepayment charge.';
  const why = s.match(/why.*(form 16|salary|bank|agreement|sale deed|deed|encumbrance|occupancy|share|noc|application form|insurance)/);
  if (why) { const key = { 'form 16': 'f16', agreement: 'ats', 'sale deed': 'deeds', deed: 'deeds', encumbrance: 'ec', occupancy: 'oc', share: 'share', noc: 'share', 'application form': 'app', insurance: 'ins' }[why[1]]; return key ? CUSDOC[key][1] + ' ' + CUSDOC[key][0] : 'We use your salary slips and bank data to confirm your income. You shared them before the pre-screen, so nothing more is needed.'; }
  if (/pending|missing|which doc|what doc|document|upload|need from me/.test(s)) return pend();
  if (/emi|instal|monthly payment/.test(s)) return 'For ' + lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure) + ' at ' + c.v.roi.toFixed(2) + '% a year, your EMI is about ' + inr(st.ev.m.emi) + '. ' + (k === 'approved' ? 'That is the figure in your sanction letter.' : 'The final figure will be in your sanction letter.');
  if (/rate|interest/.test(s)) return 'Your rate is ' + c.v.roi.toFixed(2) + '% a year, floating. It is linked to our Housing Reference Rate, so it moves when that rate moves; we tell you before any change.';
  if (/fee|charge|cost/.test(s)) return 'Processing fee: ' + LENDER.pfPrime + '% of the loan, ' + inr(c.v.loan * LENDER.pfPrime / 100) + '. Legal and technical charges: ' + inr(LENDER.ltPrime) + '. There is no prepayment charge. Every charge is listed in the Key Facts Statement.';
  if (/accept|after i accept|letter|kfs|key fact|offer/.test(s)) return k === 'approved' && san.accepted ? 'You accepted the offer on ' + fds(san.accepted) + '. Next, our operations team checks the original property documents and pays the seller directly. That usually takes 3 to 5 working days.' + (miss.length ? ' Before that, we need ' + lc1(miss[0].t) + (miss.length > 1 ? ' and ' + plural(miss.length - 1, 'other document') : '') + '.' : '') : k === 'approved' && san.sent ? 'Read the sanction letter and the Key Facts Statement on this page, then accept with an OTP. After that, our operations team checks the original property documents and arranges the payment to the seller.' : 'Once your loan is approved, you get the sanction letter and a Key Facts Statement by email and SMS, and on this page. You accept with an OTP.';
  if (/disburs|release|money|seller|builder/.test(s)) return 'After you accept the offer, our operations team checks the original property documents, then pays the seller directly. That usually takes 3 to 5 working days, depending on the registration date.';
  if (/how long|when|time|decision|checks take/.test(s)) return k === 'docs' ? 'Once your documents are in, the checks usually take 3 to 5 working days, and the decision follows within 2 working days.' : k === 'provisional' ? 'The checks usually take 3 to 5 working days; ' + st.done + ' of ' + st.checks.length + ' are done. The decision follows within 2 working days of the last one.' : status();
  if (/\brm\b|relationship|talk|call|person|human|someone|agent/.test(s)) return 'Your relationship manager is ' + SALES.name + ', at the Pune Kothrud branch, 9:30 to 19:00, Monday to Saturday. Tap Request a call back, under Talk to us, and he will call you.';
  if (/status|where|update|progress|stage|application/.test(s)) return status();
  return null;
}
function cusSay(q) {
  const c = cusCase(); if (!c || !q.trim()) return;
  S.cchat = (S.cchat || []).concat([{ f: 'me', t: q.trim() }]); S.cq = ''; S.ctyping = true; render();
  setTimeout(() => {
    S.ctyping = false; let a = cusAnswer(q, c);
    if (!a) { a = 'I’m not sure about that one, so I have passed it to ' + SALES.name + ', your relationship manager. He usually replies within a working day.'; log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Question for the RM from the customer’s page', q.trim()); }
    S.cchat.push({ f: 'bot', t: a }); if (document.activeElement && document.activeElement.id === 'cq') S.focusId = 'cq'; render();
  }, 650);
}
/* orders the outside checks once the last login document is in (as the lender's side does) */
function cusOrder(c) {
  if (loginMissing(c).length || !c.tasks.some(t => t.st === 'todo')) return 0; let n = 0;
  c.tasks.forEach(t => { if (t.st !== 'todo') return; if (t.kind === 'sys') { t.st = 'accepted'; t.recv = t.acc = tick(1); log(c, who('sys', 'System', t.vendor), 'data', sysTaskText(c, t), sysTaskDet(c, t)); } else { t.st = 'assigned'; t.assigned = tick(1); t.due = addWD(t.assigned, t.slaD); n++; log(c, who('sys', 'System', 'Vendor orders'), 'vendor', t.t + ' ordered from ' + t.vendor, 'Due ' + fdt(t.due) + '.'); } });
  return n || 1;
}
Object.assign(ACT, {
  cup(v) {
    const c = cusCase(), d = c && c.docs.find(x => x.id === v); if (!d || d.up || S.creading) return;
    S.creading = v; render();
    setTimeout(() => { d.up = { f: d.sample, at: tick(1), by: c.apps[0].name }; S.creading = null; log(c, who('cus', c.apps[0].name, 'Customer'), 'doc', 'Uploaded ' + lc1(d.t) + ' from the customer’s page', d.sample); const o = cusOrder(c); render(); const left = cusState(c).miss.length; toast(o ? 'Thank you. We have everything we need and have started the checks' : left ? 'Uploaded. ' + plural(left, 'document') + ' to go' : 'Uploaded. Thank you'); }, 800);
  },
  call() { const c = cusCase(), m = loginMissing(c); if (!m.length) return; m.forEach(d => { d.up = { f: d.sample, at: tick(1), by: c.apps[0].name }; }); log(c, who('cus', c.apps[0].name, 'Customer'), 'doc', 'Uploaded ' + plural(m.length, 'document') + ' from the customer’s page', listAnd(m.map(d => lc1(d.t))) + '.'); cusOrder(c); render(); toast('Thank you. We have everything we need and have started the checks'); },
  cacc() { const c = cusCase(); if (!c.w.san || !c.w.san.sent || c.w.san.accepted) return; c.w.san.accepted = tick(3); log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Sanction and KFS accepted', 'OTP on the registered mobile, from the customer’s page.'); render(); toast('Offer accepted with an OTP'); },
  ckfs() { toast('The sanction letter and KFS open as a PDF in the real app'); },
  ccall(v) { toast(v === 'wa' ? 'WhatsApp opens with ' + SALES.name + ' (demo)' : 'Calling ' + SALES.name + ' (demo)'); },
  cask(v) { cusSay(v); },
  csend() { const el = $('#cq'), q = el ? el.value : S.cq || ''; if (!q.trim()) return; S.focusId = 'cq'; cusSay(q); }
});



/* =====================================================================
   v6: the New lead panel reads the pre-screen documents and fills the
   details; consent is taken in the panel; the login stage puts the
   documents on the left and the case facts on the right.
   ===================================================================== */

/* ---------------- New lead panel ---------------- */
const NLF = [
  ['Applicant', [['a1n', 'Name'], ['a1mob', 'Mobile'], ['a1pan', 'PAN'], ['a1dob', 'Date of birth'], ['a1emp', 'Employer'], ['a1inc', 'Net monthly pay (₹)']]],
  ['Co-applicant', [['a2n', 'Name'], ['a2rel', 'Relationship'], ['a2pan', 'PAN'], ['a2dob', 'Date of birth'], ['a2emp', 'Employer'], ['a2inc', 'Net monthly pay (₹)']]],
  ['Address', [['addr', 'Current address', 'wide'], ['city', 'City']]],
  ['Loan', [['loan', 'Loan asked for (₹)'], ['ten', 'Tenure (years)'], ['price', 'Property price, as stated (₹)'], ['prop', 'Property']]]
];
const NLV = {
  a1n: 'Sameer Joshi', a1mob: '98XXXXX612', a1pan: 'BQJPJ6612C', a1dob: '14 Mar 1990', a1emp: 'Bluewave Logistics Tech Pvt Ltd', a1inc: '1,24,000',
  a2n: 'Pooja Joshi', a2rel: 'Spouse', a2pan: 'CPJPJ3390K', a2dob: '2 Aug 1992', a2emp: 'Deccan College of Commerce', a2inc: '62,000',
  addr: 'B-12, Mayur Colony, Kothrud, Pune 411038', city: 'Pune', loan: '55,00,000', ten: '20', price: '78,00,000', prop: 'Resale flat, Kothrud'
};
/* the six pre-screen documents, what each one fills, and how sure the reader is */
const NLD = [
  { id: 'pan_a1', t: 'PAN, applicant', cat: 'Identity and KYC', f: ['a1n', 'a1pan'], src: 'PAN', conf: 99 },
  { id: 'adh_a1', t: 'Aadhaar (masked), applicant', cat: 'Identity and KYC', f: ['a1dob', 'addr', 'city'], src: 'Aadhaar', conf: 98 },
  { id: 'pan_a2', t: 'PAN, co-applicant', cat: 'Identity and KYC', f: ['a2n', 'a2pan'], src: 'PAN', conf: 99 },
  { id: 'adh_a2', t: 'Aadhaar (masked), co-applicant', cat: 'Identity and KYC', f: ['a2dob'], src: 'Aadhaar', conf: 98 },
  { id: 'sal_a1', t: 'Salary slips, last 3 months, applicant', cat: 'Income', f: ['a1emp', 'a1inc'], src: 'salary slips', conf: 97 },
  { id: 'sal_a2', t: 'Salary slips, last 3 months, co-applicant', cat: 'Income', f: ['a2emp', 'a2inc'], src: 'salary slips', conf: 96 }
];
const NLREQ = ['a1n', 'a1mob', 'loan', 'ten'];
const nlLabel = k => { for (const [, F] of NLF) for (const [id, l] of F) if (id === k) return l.replace(/ \(.*\)$/, ''); return k; };
function nlInit() { return { f: {}, docs: {}, cons: null, reading: null, bad: [], top: false }; }
const nlVal = k => ((S.nl.f[k] || {}).v || '').trim();
const nlNum = s => +String(s || '').replace(/[^0-9.]/g, '') || 0;
function nlCase() { return CASES.find(x => x.id === 'N1'); }
function nlReady() { const N = S.nl; return NLD.every(d => N.docs[d.id] && N.docs[d.id].done) && N.cons && N.cons.at; }


function nlRead(id, done) {
  const N = S.nl, d = NLD.find(x => x.id === id); if (!d || (N.docs[id] && N.docs[id].done)) { if (done) done(); return; }
  N.reading = id; render();
  setTimeout(() => {
    if (!S.nl) return;
    N.docs[id] = { done: 1, at: tick(1) }; N.reading = null;
    Object.values(N.f).forEach(x => { x.fresh = 0; });
    d.f.forEach(k => { const cur = N.f[k]; if (!cur || !cur.v || cur.src !== 'typed') N.f[k] = { v: NLV[k], src: d.src, conf: d.conf, fresh: 1 }; });
    render(); if (done) done(); else toast('Read the ' + d.src + ': ' + plural(d.f.length, 'detail') + ' filled in');
  }, 650);
}
const _newlead6 = ACT.newlead;
Object.assign(ACT, {
  newlead() { const c = nlCase(); if (c && c.lead.hidden) { if (!S.nl) S.nl = nlInit(); S.sheet = { k: 'lead' }; render(); } else _newlead6(); },
  nlup(v) { if (S.nl && !S.nl.reading) nlRead(v); },
  nlload() {
    const N = S.nl; if (!N || N.reading) return; const q = NLD.filter(d => !(N.docs[d.id] && N.docs[d.id].done)).map(d => d.id);
    const nx = () => { const id = q.shift(); if (!id) { const n = Object.values(N.f).filter(x => x.src && x.src !== 'typed' && x.v).length; N.top = true; render(); toast(plural(NLD.length, 'document') + ' read: ' + plural(n, 'detail') + ' filled in'); return; } nlRead(id, nx); };
    nx();
  },
  nlfill() { const N = S.nl; if (!N) return; NLF.forEach(([, F]) => F.forEach(([k]) => { if (!nlVal(k)) N.f[k] = { v: NLV[k], src: 'typed' }; })); N.bad = []; render(); },
  nlcons() { const N = S.nl; if (!nlVal('a1mob')) { N.bad = ['a1mob']; render(); toast('Add the mobile number first'); return; } N.cons = { sent: tick(1) }; render(); },
  nlotp() { const N = S.nl; if (!N.cons) return; N.cons.at = tick(2); render(); toast('Consent given by OTP'); },
  mklead() {
    const N = S.nl || nlInit(), miss = NLREQ.filter(k => !nlVal(k));
    if (miss.length) { N.bad = miss; S.nl = N; render(); toast('Add ' + listAnd(miss.map(k => lc1(nlLabel(k)))) + ', or upload the documents'); return; }
    const i = CASES.findIndex(x => x.id === 'N1'), c = CASES[i], at = tick(1);
    c.lead.hidden = false; c.lead.created = c.v.login = at;
    const loan = nlNum(nlVal('loan')), ten = nlNum(nlVal('ten')), price = nlNum(nlVal('price'));
    if (loan >= 100000) c.v.loan = c.v.applied.loan = Math.round(loan);
    if (ten >= 1 && ten <= 30) c.v.tenure = c.v.applied.tenure = Math.round(ten) * 12;
    if (price >= 100000) c.lead.price = Math.round(price);
    c.w.log.forEach(e => { if (e.txt === 'Lead created') { e.at = at; e.w = who('ppl', SALES.name, SALES.sub); } });
    const up = NLD.filter(d => N.docs[d.id] && N.docs[d.id].done);
    up.forEach(d => { const x = c.docs.find(y => y.id === d.id); if (x) x.up = { f: x.sample, at: N.docs[d.id].at, by: SALES.name }; });
    if (up.length) log(c, who('ppl', SALES.name, SALES.sub), 'doc', 'Uploaded ' + plural(up.length, 'document') + ' while creating the lead', listAnd(up.map(d => lc1(c.docs.find(y => y.id === d.id).t))) + '. Read at once; the details were filled in from them.', { at });
    if (N.cons && N.cons.at) { c.lead.consent = { at: N.cons.at, ch: 'OTP', wa: 1 }; log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Consent given by OTP', 'Credit report and bank data. Opted in to updates on WhatsApp. Privacy notice version 3.2.', { at: N.cons.at }); }
    const ready = !!c.lead.consent && !c.docs.some(d => d.need === 'pre' && !d.up);
    S.sheet = null; S.nl = null; ACT.open(i);
    if (ready) { toast('Lead created. The pre-screen is running'); runPre(c); }
    else toast(up.length ? 'Lead created. The pre-screen runs once ' + (c.lead.consent ? 'the rest of the documents are in' : 'the customer gives consent') : 'Lead created. Upload the documents, or wait for the customer’s link');
  }
});


/* ---------------- login stage: documents on the left, case facts on the right ---------------- */
function loginDocsHTML() {
  const c = C(), need = c.docs.filter(d => d.need === 'login'), n = need.filter(d => d.up).length, can = ['sales', 'cm'].includes(S.role);
  const pre = c.docs.filter(d => d.need === 'pre' && d.up), cats = [...new Set(need.map(d => d.cat))], open = c.tasks.filter(t => t.kind !== 'sys' && t.st === 'todo');
  const left = need.length - n;
  return `<div class="lg-badge"><span class="rec-b">${ic('check')}Logged in as ${esc(c.v.appNo)}</span></div>
  <div class="up-h"><div><h2>Documents due</h2><p>${left ? plural(left, 'document') + ' still to come. The customer has an upload link' + (can ? '; you can upload them here too.' : '.') : 'Everything needed to start the checks is in.'}</p></div>${can && left ? `<div class="up-act"><button class="btn btn-s btn-sm" data-act="loadlogin">${ic('upload')}Upload documents</button></div>` : ''}</div>
  <div class="up-bar"><i style="width:${need.length ? n / need.length * 100 : 0}%"></i></div>
  <div class="cats" style="margin-top:12px">${cats.map(cat => { const it = need.filter(d => d.cat === cat); return `<section class="dcat"><header><b>${cat}</b><span>${it.filter(d => d.up).length} of ${it.length}</span></header>${it.map(d => docRow2(c, d, !can, 'Link sent to the customer')).join('')}</section>`; }).join('')}</div>
  ${open.length ? `<section class="panel" style="margin-top:14px"><div class="ph"><h3>Ordered the moment they are in</h3><span class="note">The system assigns these to the panel vendors</span></div><div class="pb">${open.map(t => `<div class="cgi">${ic('clock')}<div><b>${esc(t.t)}</b><small>${esc(t.vendor)}, ${plural(t.slaD, 'working day')}</small></div><span class="when">After the documents</span></div>`).join('')}</div></section>` : ''}
  ${pre.length ? `<section class="panel" style="margin-top:14px"><div class="ph"><h3>Already in</h3><span class="note">${plural(pre.length, 'document')} from the pre-screen</span><button class="lnk act" data-act="tab" data-v="docs">All documents</button></div><div class="pb"><ul class="lg-in">${pre.map(d => `<li>${ic('check')}<span>${esc(d.t)}</span><small>${esc(fds(d.up.at))}</small></li>`).join('')}</ul></div></section>` : ''}`;
}

/* ---------------- after every render ---------------- */
function afterRender() {
  /* on small screens the page itself scrolls: start a new view at the top */
  if (afterRender.k !== render.lastKey) { if (afterRender.k !== undefined && window.scrollY) window.scrollTo(0, 0); afterRender.k = render.lastKey; }
  if (S.nl && S.nl.top) { const b = $('#nlb'); if (b) b.scrollTop = 0; S.nl.top = false; }
  const cm = $('#cmsgs'); if (cm) { const q = cm.querySelector('.qc:not(.done)'); cm.scrollTop = q ? Math.max(0, q.closest('.cm').offsetTop - 8) : cm.scrollHeight; }
  if (ADM && ADM.focusNew) { const el = document.querySelector('.fe-p [data-autofocus]'); if (el) { el.removeAttribute('data-autofocus'); el.focus(); if (el.select) el.select(); } ADM.focusNew = null; }
}

/* start-up: at the end of 21_r4.js */

/* =====================================================================
   v7 (round 4)
   - Pricing discretion as policy rules (also editable in Admin)
   - A second customer, Varun Kapoor, whom the system asks about his
     credit history in the chat before the credit manager decides
   - The first offer goes out the moment a file is sanctioned; the
     customer can accept or ask for changes in the chat, and the system
     agrees within its discretion or passes the request to the credit
     manager. System messages are mirrored on WhatsApp with a link.
   - The credit manager can change the terms after sanction
   - The sales manager's "Waiting on your team"
   ===================================================================== */

Object.assign(ICO, { help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.5M12 17h.01"/>', phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>' });

/* ---------------- pricing discretion: policy section 9 ---------------- */
const NEG0 = { rate: 0.10, score: 750, pf: 50, amt: 10, floor: 8.90 };
[POL12, POL11, POL10].forEach(p => { p.neg = deep(NEG0); });
POL = deep(POL12); VERS = deep(VERS0);
const _allPaths7 = allPaths, _fmtP7 = fmtP;
allPaths = function () { return _allPaths7().concat([['neg.floor', 'Lowest rate anyone can offer'], ['neg.rate', 'Rate cut the system can give on its own'], ['neg.score', 'Lowest bureau score for a system rate cut'], ['neg.pf', 'Share of the processing fee the system can waive'], ['neg.amt', 'Loan increase the system can give, as a share of the sanction']]); };
fmtP = function (p, v) { if (/^neg\.(rate|floor)$/.test(p)) return Number(v).toFixed(2) + '%'; if (/^neg\.(pf|amt)$/.test(p)) return v + '%'; return _fmtP7(p, v); };
PCAT.push(['neg', 'Pricing and negotiation', '9']);
PRULES.push(
  { id: 'nfloor', c: 'neg', n: 'Lowest rate anyone can offer', u: 'rpct', p: 'neg.floor', src: [38, '9.1', 'No offer may be made below 8.90% a year. A lower rate needs the pricing committee.'] },
  { id: 'nrate', c: 'neg', n: 'Rate cut the system can give on its own', u: 'rpct', p: 'neg.rate', src: [38, '9.2', 'At the customer’s request, the system may reduce the offered rate by up to 0.10% a year, once per application, where every applicant’s bureau score is 750 or more.'] },
  { id: 'nscore', c: 'neg', n: 'Lowest bureau score for a system rate cut', u: 'n', p: 'neg.score', src: [38, '9.2', '… where every applicant’s bureau score is 750 or more.'] },
  { id: 'npf', c: 'neg', n: 'Processing fee the system can waive', u: 'pct', p: 'neg.pf', src: [39, '9.3', 'The system may waive up to 50% of the processing fee at the customer’s request. A larger waiver needs the credit manager.'] },
  { id: 'namt', c: 'neg', n: 'Loan increase the system can give', u: 'pct', p: 'neg.amt', src: [39, '9.4', 'Where the customer asks for more, the system may raise the sanctioned amount by up to 10%, if every rule of this policy is still met and the approving authority does not change.'] }
);

/* ---------------- the second customer: Varun Kapoor ---------------- */
const QDEF = {
  'g-dpd': {
    q: 'Your credit report shows your credit card was paid 34 days late in June 2025 and 64 days late in July 2025. It has been paid on time every month since. Can you tell us what happened?',
    why: 'We ask about any late payment in the last two years. Your answer goes to the credit team with your application.',
    opts: ['A medical emergency', 'I lost my job or income for a while', 'A dispute with the card company', 'I missed it by mistake', 'Something else'],
    doc: { id: 'hosp', t: 'Hospital bill, June 2025', f: 'Hospital_bill_Jun2025.pdf', l: 'the hospital bill', cat: 2 },
    sample: 'My father had heart surgery in June 2025. I paid the hospital from my savings and my card, and cleared the card in full in August.',
    auto: false, read: 'The bill is dated 12 Jun 2025 for ₹3,86,000, for Suresh Kapoor, his father. The late months match the bill, and the card was cleared in August 2025.'
  },
  'g-gift': {
    q: 'Your bank statement shows ₹2,40,000 credited on 12 Sep 2026 from S. Kapoor. What was it?',
    why: 'We check large one-off credits so we know where the down payment comes from.',
    opts: ['A gift from family', 'A loan from someone', 'My own savings from another account', 'Something else'],
    doc: { id: 'giftl', t: 'Gift letter, Suresh Kapoor', f: 'Gift_letter_Suresh_Kapoor.pdf', l: 'the gift letter', cat: 3 },
    sample: 'It is a gift from my father, Suresh Kapoor, towards the down payment. He has signed a gift letter.',
    auto: true, read: 'The gift letter matches: ₹2,40,000 from Suresh Kapoor, his father, on 12 Sep 2026, with no repayment expected.'
  }
};
CHECKS.G = [
  { id: 'g-dpd', sev: 'med', fld: 'a1.cibil', after: 'bureau', t: 'Credit card paid 34 and 64 days late in June and July 2025', f: 'CIBIL shows the card was 34 days late in June 2025 and 64 days late in July 2025, then paid in full in August. Every payment since has been on time, and nothing else is late in 24 months. Under policy 4.2(c) a person decides, with the customer’s reason on file.', sug: 'Get his reason and any proof. Accept it if it was a one-off.', ask: 'his reason for the late payments, with any proof',
    ev: { kind: 'Credit report', title: 'CIBIL report, Varun Kapoor', org: 'Pulled 12 Nov 2026', rows: [['Score', '731'], ['Credit card, a private bank', 'Limit ₹1,50,000'], ['June 2025', '34 days late'], ['July 2025', '64 days late'], ['August 2025', 'Paid in full'], ['Since September 2025', 'On time, 14 months']], hi: 3, read: '64 days late, July 2025', conf: 99 } },
  { id: 'g-gift', sev: 'low', fld: 'bank.pat', after: 'aa', t: '₹2,40,000 credited on 12 Sep 2026 from S. Kapoor', f: 'The Account Aggregator data shows a one-off credit of ₹2,40,000 from S. Kapoor. It is not salary and it stayed in the account, so it is likely the down payment.', sug: 'If it is a gift from family, take a gift letter.', ask: 'what the ₹2,40,000 was, with a gift letter if it was a gift',
    ev: { kind: 'Bank statement', title: 'Salary account ending 2208', org: 'Account Aggregator', rows: [['1 Sep 2026', 'Salary +₹96,000'], ['12 Sep 2026', 'NEFT from S KAPOOR +₹2,40,000'], ['30 Sep 2026', 'Balance ₹5,95,400']], hi: 1, read: '₹2,40,000 from S KAPOOR', conf: 98 } }
];
(function () {
  const n1 = LEADS.find(x => x.id === 'N1'), g = deep(n1), a = g.apps[0];
  Object.assign(g, { id: 'G', hint: 'Logged in: a salaried buyer whose credit card was paid late last year; the system asked him why', seg: 'prime', prog: 'salaried', cat: 'resale', variant: 'resale', lang: 'en' });
  g.v = { appNo: 'HL-2611-04961', branch: 'Pune Baner', src: 'Branch walk-in', srcBy: 'Shweta Patil', login: '2026-11-12 15:20', loan: 3800000, tenure: 240, roi: 9.45, purpose: 'Purchase of a resale flat', applied: { loan: 3800000, tenure: 240 } };
  g.lead = { by: 'Shweta Patil', created: '2026-11-11 12:10', price: 5200000, city: 'Pune', consent: { at: '2026-11-11 12:31', ch: 'OTP', wa: 1 }, pre: null, in: true, owner: 'shweta' };
  Object.assign(a, { name: 'Varun Kapoor', ini: 'VK', age: 33, sex: 'M', emp: 'Salaried', occ: 'Area sales manager', org: 'Meridian Pharma Distributors Pvt Ltd', orgCat: 'B', yrs: 6, inc: 96000, incDecl: 96000, cibil: 731, dpd: '000000036000000000000000', enq6: 2, accts: 4, pan: 'BXKPK2208D', aadhaar: 'XXXX XXXX 2208', addr: 'Flat 302, Palash Residency, Wakad, Pune 411057', mobile: '99XXXXX208', email: 'varun.k@example.com' });
  g.apps = [a];
  g.oblig = [{ id: 'o1', who: 'a1', t: 'Car loan', lender: 'A private bank', emi: 8200, out: 214000, left: 28, count: true, why: '' }, { id: 'o2', who: 'a1', t: 'Credit card', lender: 'A private bank', emi: 900, out: 18000, left: null, count: true, why: '5% of the ₹18,000 balance' }];
  g.bank = Object.assign({}, n1.bank, { acct: 'Salary account ending 2208', consent: 'Consent given by OTP for 12 months of data', credits: [97800, 96400, 98100, 96900, 337200, 97500], debits: [71200, 74800, 69900, 77100, 73400, 70600], bal: [262000, 283600, 311800, 331600, 595400, 622300], salary: 'Salary credited on the 1st, every month for 12 months', bounces: 0 });
  Object.assign(g.prop, { addr: 'Flat 1104, Kohinoor Greens, Wakad, Pune 411057', carpet: 62, area: '62 m² (667 sq ft) carpet, 2 bedrooms, built 2018', owners: ['a1'], agreement: 5200000, guideline: 4610000, stageText: 'Complete, occupied since 2018', built: 2018, resid: 52, planDev: 1 });
  Object.assign(g.prop.legal, { note: 'Title is clear and marketable. The seller’s home loan is closed and the bank’s NOC is on file.', chain: [{ y: '2018', t: 'Sale deed', p: 'Builder to Nandini Gupte', n: 'Registered, Haveli 4' }, { y: '2018', t: 'Share certificate', p: 'Kohinoor Greens CHS', n: 'In Nandini Gupte’s name' }, { y: '2026', t: 'Agreement to sell', p: 'Nandini Gupte to Varun Kapoor', n: 'Signed 7 Nov 2026', cls: 'now' }], lod: ['Sale deed 2018 (original)', 'Share certificate and society NOC', 'Occupancy certificate', 'Encumbrance certificate 2018 to 2026'] });
  g.prop.vals = [{ id: 'tech', by: 'Deshmukh & Associates', v: 5100000, note: 'Market value. Building age 8 years' }];
  const D = (id, t, cat, need, f, at, by) => dk(id, t, DCAT[cat], need, f, at, by), R = 'Shweta Patil', V = 'Varun Kapoor';
  g.docs = [
    D('pan_a1', 'PAN, Varun', 1, 'pre', 'PAN_Varun.jpg', '2026-11-11 12:20', R), D('adh_a1', 'Aadhaar (masked), Varun', 1, 'pre', 'Aadhaar_Varun.pdf', '2026-11-11 12:20', R), D('sal_a1', 'Salary slips, Aug to Oct 2026, Varun', 2, 'pre', 'Payslips_Varun.pdf', '2026-11-11 12:20', R),
    D('app', 'Application form, e-signed', 0, 'login', 'Application_e-signed.pdf', '2026-11-12 15:05', R), D('f16_a1', 'Form 16, two years, Varun', 2, 'login', 'Form16_Varun.pdf', '2026-11-12 15:05', R),
    D('ats', 'Agreement to sell', 4, 'login', 'ATS_Kohinoor_1104.pdf', '2026-11-12 15:05', R), D('deeds', 'Sale deed, 2018 (copy)', 4, 'login', 'Sale_deed_2018.pdf', '2026-11-12 15:05', R), D('ec', 'Encumbrance certificate, 2018 to 2026', 4, 'login', 'EC_2018_2026.pdf', '2026-11-12 15:05', R),
    D('oc', 'Occupancy certificate', 4, 'login', 'OC_Kohinoor.pdf', '2026-11-12 15:05', R), D('share', 'Society share certificate and NOC', 4, 'login', 'Kohinoor_share_NOC.pdf', '2026-11-12 15:05', R),
    D('ins', 'Property insurance with our interest noted', 4, 'cp', 'Insurance.pdf')
  ];
  const T = (id, t, tr, kind, ven, sla, as, rc, ac) => tk(id, t, tr, kind, ven, sla, 'accepted', as, rc, ac);
  g.tasks = [
    T('kyc', 'KYC and dedupe', 'inc', 'sys', 'PAN, Aadhaar and CKYC', 0, null, '2026-11-12 15:24', '2026-11-12 15:24'), T('bureau', 'Credit bureau', 'inc', 'sys', 'CIBIL', 0, null, '2026-11-12 15:24', '2026-11-12 15:24'), T('aa', 'Bank statement analysis', 'inc', 'sys', 'Account Aggregator', 0, null, '2026-11-12 15:26', '2026-11-12 15:26'),
    T('fi', 'Residence and office visit', 'inc', 'ven', 'Trust Field Services', 3, '2026-11-12 15:30', '2026-11-14 11:10', '2026-11-14 11:30'), T('fcu', 'Fraud control sampling', 'inc', 'int', 'Fraud control unit, Pune', 2, '2026-11-12 15:31', '2026-11-13 17:00', '2026-11-13 17:10'),
    T('legal', 'Legal opinion', 'prop', 'ven', 'Patwardhan & Co., Advocates', 5, '2026-11-12 15:32', '2026-11-14 15:20', '2026-11-14 15:45'), T('tech', 'Valuation', 'prop', 'ven', 'Deshmukh & Associates', 3, '2026-11-12 15:33', '2026-11-14 12:00', '2026-11-14 12:20'),
    T('cersai', 'CERSAI search', 'prop', 'sys', 'CERSAI', 0, null, '2026-11-12 15:28', '2026-11-12 15:28')
  ];
  g.w = { step: 'decide', sysAt: '2026-11-14 16:05', nt: { login: 1, docs: 1 }, chk: { 'g-dpd': { st: 'asked', at: '2026-11-14 16:06', by: 'the system', sys: 1 }, 'g-gift': { st: 'asked', at: '2026-11-14 16:06', by: 'the system', sys: 1 } } };
  g.chat = [
    { f: 'bot', at: '2026-11-12 15:26', t: 'Hi Varun, your home loan application HL-2611-04961 is logged in. You can follow it here at any time. We send the same updates to your WhatsApp.', wa: 1 },
    { f: 'bot', at: '2026-11-14 16:06', t: 'All the checks on your flat and your documents are back. Before our credit team decides, we have 2 quick questions for you. It takes about 2 minutes.', wa: 1 },
    { f: 'bot', at: '2026-11-14 16:06', k: 'q', q: 'g-dpd' },
    { f: 'bot', at: '2026-11-14 16:06', k: 'q', q: 'g-gift' },
    { f: 'bot', at: '2026-11-16 10:00', t: 'A reminder: 2 questions about your home loan are waiting for you.', wa: 1 }
  ];
  SEED2.push(g);
})();
const _initCases7 = initCases;
initCases = function () {
  _initCases7();
  CASES.forEach(c => {
    if (c.id === 'G') {
      c.chat.forEach(m => { if (m.wa) c.w.log.push({ at: m.at, w: WAW(), cat: 'comms', txt: 'WhatsApp to Varun: ' + waShort(c, m), det: 'Approved template, with a link to his page: ' + portal(c) + '.' }); });
      c.w.log.push({ at: '2026-11-14 16:06', w: who('sys', 'System', 'Asks the customer'), cat: 'comms', txt: 'Asked the customer 2 questions', det: 'About the late card payments in 2025 and the ₹2,40,000 credit in September. In his page and on WhatsApp.' });
      c.w.log.sort((x, y) => x.at < y.at ? -1 : x.at > y.at ? 1 : 0);
    }
  });
};
LEADOWN.G = 'shweta';

/* ---------------- small helpers ---------------- */
const fn7 = c => c.apps[0].name.split(' ')[0];
const portal = c => LENDER.web.replace(/^www\./, '') + '/my/' + c.v.appNo;
const WAW = () => who('sys', 'System', 'WhatsApp, approved template');
const r2 = x => Math.round(x * 100) / 100;
const lastOffer = c => c.w.offers && c.w.offers.length ? c.w.offers[c.w.offers.length - 1] : null;
const openReqs = c => (c.w.neg || []).filter(r => r.st === 'open');
const sysAsked = c => openChecks(c).filter(k => chkSt(c, k).st === 'asked' && chkSt(c, k).sys);
const waitingCus = c => { const o = openChecks(c); return o.length > 0 && o.every(k => chkSt(c, k).st === 'asked' && chkSt(c, k).sys); };
const offerOpen = c => { const o = lastOffer(c); return !!(o && o.st === 'sent' && !(c.w.san && c.w.san.accepted)); };
function rmOf(c) { const k = ownKey(c), t = k && TEAM[k]; return t ? { n: t.n, ini: inits(t.n), w: t.w } : { n: SALES.name, ini: SALES.ini, w: 'Pune Kothrud' }; }
function waShort(c, m) { const t = m.k === 'offer' ? 'offer, version ' + m.ov : (m.t || '').split(/(?<=[.!?])\s/)[0]; return '“' + short(t, 70) + '”'; }
function waText(c, m, staff) { return 'On WhatsApp: “' + (m.k === 'offer' ? 'Your loan offer, version ' + m.ov + ', is ready.' : (m.t || '').split(/(?<=[.!?])\s/)[0]) + '” With a link to ' + (staff ? 'the customer’s page.' : 'this page.'); }
function say(c, m) {
  c.chat = c.chat || []; m.at = m.at || S8(CLK); c.chat.push(m);
  if (m.wa) c.w.log.push({ at: m.at, w: WAW(), cat: 'comms', txt: 'WhatsApp to ' + fn7(c) + ': ' + waShort(c, m), det: 'With a link to the customer’s page: ' + portal(c) + '.' });
  return m;
}
function offerNums(c, o) { const emi = emiCalc(o.loan, o.roi, o.tenure), pf0 = Math.round(o.loan * (c.seg === 'prime' ? LENDER.pfPrime : LENDER.pfAff) / 100 * 1.18), pf = Math.round(pf0 * (1 - (o.pfw || 0) / 100)); return { emi, pf0, pf }; }
function mkOffer(c, x) { return Object.assign({ at: S8(CLK), loan: c.v.loan, tenure: c.v.tenure, roi: c.v.roi, pfw: c.w.pfw || 0 }, x); }
function offerLine(c, o) { const n = offerNums(c, o); return lakh(o.loan) + ' over ' + yrsTxt(o.tenure) + ' at ' + o.roi.toFixed(2) + '%, EMI ' + inr(n.emi) + ', processing fee ' + inr(n.pf); }
function offerDiff(c, a, b) {
  const na = offerNums(c, a), nb = offerNums(c, b), D = [];
  if (a.loan !== b.loan) D.push(['Loan', lakh(a.loan), lakh(b.loan)]);
  if (a.tenure !== b.tenure) D.push(['Tenure', yrsTxt(a.tenure), yrsTxt(b.tenure)]);
  if (Math.abs(a.roi - b.roi) > 1e-9) D.push(['Interest rate', a.roi.toFixed(2) + '%', b.roi.toFixed(2) + '%']);
  if (Math.round(na.emi) !== Math.round(nb.emi)) D.push(['EMI', inr(na.emi), inr(nb.emi)]);
  if (na.pf !== nb.pf) D.push(['Processing fee', inr(na.pf), inr(nb.pf)]);
  return D;
}
/* processing fee waivers flow into the KFS and the letter */
const _kfs7 = kfsOf;
kfsOf = function (c, ev) { const k = _kfs7(c, ev), w = c.w.pfw || 0; if (!w) return k; const pf = Math.round(k.pf * (1 - w / 100)), fees = pf + k.lt + k.cer, net = k.L - fees; return Object.assign(k, { pf, fees, net, apr: irrMonthly(net, k.emi, k.n) * 1200, totPay: k.emi * k.n + fees }); };

/* ---------------- what the system does on its own, before each render ---------------- */
function sendFirstOffer(c) {
  const o = mkOffer(c, { v: 1, by: c.w.dec.by, st: 'sent' }); c.w.offers = [o]; c.w.san = c.w.san || {}; c.w.san.sent = o.at;
  c.w.log.push({ at: o.at, w: who('sys', 'System', 'Sends the offer on sanction'), cat: 'comms', txt: 'Offer sent to the customer, version 1', det: offerLine(c, o) + '. In the customer’s page and on WhatsApp, with the sanction letter and KFS.' });
  say(c, { f: 'bot', t: 'Good news, ' + fn7(c) + ': your home loan is sanctioned. Here is your offer. Accept it with an OTP, or tell me here if you would like a change.', wa: 1, at: o.at });
  say(c, { f: 'bot', k: 'offer', ov: 1, at: o.at });
}
function sweep7() {
  CASES.forEach(c => {
    if (c.lead && (c.lead.hidden || !c.lead.in)) return;
    const w = c.w, nt = w.nt = w.nt || {}; c.chat = c.chat || [];
    if (c.id === 'N1') {
      if (!nt.login) { nt.login = 1; const m = loginMissing(c).length; say(c, { f: 'bot', t: 'Hi ' + fn7(c) + ', your home loan application ' + c.v.appNo + ' is logged in. ' + (m ? 'We need ' + plural(m, 'more document') + ' from you. You can upload them on this page.' : 'We have everything we need for now.'), wa: 1 }); }
      if (!nt.docs && !loginMissing(c).length) { nt.docs = 1; say(c, { f: 'bot', t: 'Thank you, we have all your documents. The checks on your flat have started: a valuation, a legal check of the title, and a visit to your home and office.', wa: 1 }); }
    }
    if (w.dec && w.dec.k === 'approved' && !w.offers) {
      if (w.san && w.san.sent) { w.offers = [mkOffer(c, { v: 1, at: w.san.sent, by: w.dec.by, st: w.san.accepted ? 'accepted' : 'sent', accAt: w.san.accepted || null, ch: 'email' })]; return; }
      sendFirstOffer(c);
    }
  });
}
const _render7 = render;
render = function () { sweep7(); _render7(); };

/* ---------------- policy checks on new terms ---------------- */
function termsCheck(c, ch) {
  const ev = fullEval(c), base = c.w.offers ? c.w.offers[0] : { loan: c.v.loan, tenure: c.v.tenure, roi: c.v.roi };
  const f2 = Object.assign({}, ev.f, { loan: ch.loan != null ? ch.loan : c.v.loan, tenure: ch.tenure != null ? ch.tenure : c.v.tenure, roi: ch.roi != null ? ch.roi : c.v.roi });
  const e2 = evalFacts(f2, POL), e0 = evalFacts(Object.assign({}, ev.f, { loan: base.loan, tenure: base.tenure, roi: base.roi }), POL);
  const had = {}; e0.devs.concat(e0.refs).forEach(r => { had[r.id] = r.lvl; });
  const fails = e2.devs.concat(e2.refs).filter(r => !had[r.id] || RANK[r.lvl] > RANK[had[r.id]]);
  const by = c.w.dec ? c.w.dec.by : 'SYS', lim = by === 'SYS' ? POL.sysAuth : by === 'L1' ? POL.auth.L1 : by === 'L2' ? POL.auth.L2 : by === 'L3' ? POL.auth.L3 : Infinity;
  const authOk = f2.loan <= Math.max(lim, base.loan);
  return { e2, hard: e2.hard, fails, authOk, lim, by, clean: !e2.hard.length && !fails.length && authOk, m: e2.m };
}
function maxAmt(c, upTo) {
  let lo = Math.round(c.v.loan / 10000), hi = Math.round(upTo / 10000), best = null;
  while (lo <= hi) { const mid = (lo + hi) >> 1, k = termsCheck(c, { loan: mid * 10000 }); if (!k.hard.length) { best = mid * 10000; lo = mid + 1; } else hi = mid - 1; }
  return best;
}
const maxTen = c => maxTenureOf(fullEval(c).f, POL);
const hardWhy = (r, c) => ({ r_ltv_reg: 'the RBI caps a loan of that size at ' + String(r.lim).split('%')[0] + '% of the flat’s value', r_ltv_pol: 'it would go over our limit on the flat’s value', r_foir: 'the EMI would be more than our limit for your income', r_age: 'the loan would run past the age limit of ' + maxAgeOf(c.apps[0].emp, POL), r_ten: 'our longest tenure is ' + yrsTxt(POL.tenure[c.seg]) }[r.id] || lc1(r.name));
const ruleTxt = r => r.name + ': ' + r.v + (r.lim ? ' against ' + lc1(String(r.lim)) : '');

/* ---------------- the customer's requests ---------------- */
function negIntent(q) {
  const t = q.toLowerCase().replace(/,/g, '').replace(/₹|\brs\.?(?=\s*\d)/g, ' ');
  let m = t.match(/(\d+(?:\.\d+)?)\s*(lakh|lac|crore|cr\b)/);
  if (m) return { k: 'amt', v: Math.round(parseFloat(m[1]) * (/^c/.test(m[2]) ? 1e7 : 1e5)) };
  if (/(more|higher|bigger|increase|top.?up)\b.*\b(loan|amount)|\b(loan|amount)\b.*\b(more|higher|increase)/.test(t)) return { k: 'amt', v: null };
  m = t.match(/(\d{1,2})\s*(?:years|yrs|year)\b/);
  if (m && /tenure|year|longer|extend|make it|stretch/.test(t)) return { k: 'ten', v: +m[1] * 12 };
  if (/longer tenure|extend the tenure|more years|stretch the loan/.test(t)) return { k: 'ten', v: null };
  if (/\bemi\b/.test(t) && /lower|less|reduce|smaller|bring down|cheaper|cut/.test(t)) return { k: 'emi', v: null };
  if (/fee|charge/.test(t) && /waive|waiver|reduce|discount|lower|remove|free|less|cut|half|drop/.test(t)) { let v = 100; if (/half|50/.test(t)) v = 50; else { const p = t.match(/(\d{1,3})\s*%/); if (p) v = Math.min(100, +p[1]); } return { k: 'pf', v }; }
  m = t.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
  if (m && +m[1] >= 5 && +m[1] <= 15) return { k: 'rate', v: +m[1] };
  m = t.match(/\b(\d{1,2}\.\d{1,2})\b/);
  if (m && /rate|interest|roi|match|offer|bank/.test(t) && +m[1] >= 5 && +m[1] <= 15) return { k: 'rate', v: +m[1] };
  if (/\b(rate|interest|roi)\b/.test(t) && /lower|reduce|less|better|discount|cut|negotia|match|cheaper|bring down|best|any chance/.test(t)) return { k: 'rate', v: null };
  if (/better (offer|deal)|other bank|another bank|elsewhere|competitor/.test(t)) return { k: 'rate', v: null };
  return null;
}
const KLBL = { rate: 'the rate', pf: 'the processing fee', amt: 'the loan amount', ten: 'the tenure', emi: 'the EMI' };
function fmtK(k, v, c) { return k === 'rate' ? v.toFixed(2) + '%' : k === 'pf' ? (v >= 100 ? 'a full waiver of the processing fee' : v + '% off the processing fee') : k === 'amt' ? lakh(v) : k === 'ten' ? yrsTxt(v) : String(v); }
function negEval(c, rq) {
  const N = POL.neg, base = c.w.offers[0], ev = fullEval(c), score = ev.f.minScore, out = { k: rq.k, ask: rq.v };
  if (rq.k === 'rate') {
    const cur = c.v.roi, disc = score != null && score >= N.score ? N.rate : 0, sysMin = Math.max(N.floor, r2(base.roi - disc)), t = rq.v;
    out.sysMin = sysMin; out.disc = disc; out.score = score;
    if (t == null) return sysMin < cur - 1e-9 ? Object.assign(out, { ok: true, to: sysMin }) : Object.assign(out, { refer: true, to: null });
    if (t >= cur - 1e-9) return Object.assign(out, { same: true });
    if (t >= sysMin - 1e-9) return Object.assign(out, { ok: true, to: r2(t) });
    return Object.assign(out, { refer: true, part: sysMin < cur - 1e-9 ? sysMin : null, to: Math.max(r2(t), N.floor), floor: t < N.floor });
  }
  if (rq.k === 'pf') {
    const cur = c.w.pfw || 0, w = clamp(rq.v == null ? 100 : rq.v, 0, 100);
    if (w <= cur) return Object.assign(out, { same: true });
    if (w <= N.pf) return Object.assign(out, { ok: true, to: w });
    return Object.assign(out, { refer: true, part: N.pf > cur ? N.pf : null, to: w });
  }
  if (rq.k === 'amt') {
    if (rq.v == null) return Object.assign(out, { needNum: true });
    const L = Math.round(rq.v / 10000) * 10000, capUp = floor10k(base.loan * (1 + N.amt / 100));
    if (L === c.v.loan) return Object.assign(out, { same: true });
    const chk = termsCheck(c, { loan: L }); out.chk = chk;
    if (chk.hard.length) {
      const mx = L > c.v.loan ? maxAmt(c, L) : null, mk = mx && mx > c.v.loan ? termsCheck(c, { loan: mx }) : null;
      return Object.assign(out, { hard: chk.hard[0], max: mx && mx > c.v.loan ? mx : null, part: mk && mk.clean && mx <= capUp ? mx : null, to: mx && mx > c.v.loan ? mx : null, refer: !!(mk && !(mk.clean && mx <= capUp)) });
    }
    if (!chk.clean) return Object.assign(out, { refer: true, to: L });
    if (L > capUp) return Object.assign(out, { refer: true, part: capUp > c.v.loan ? capUp : null, to: L, cap: capUp });
    return Object.assign(out, { ok: true, to: L });
  }
  if (rq.k === 'ten' || rq.k === 'emi') {
    const mt = maxTen(c);
    if (rq.k === 'emi' || rq.v == null) return mt > c.v.tenure ? Object.assign(out, { k: 'ten', offerTen: mt, emiTo: emiCalc(c.v.loan, c.v.roi, mt) }) : Object.assign(out, { k: 'ten', maxed: true });
    if (rq.v === c.v.tenure) return Object.assign(out, { same: true });
    if (rq.v > mt) return Object.assign(out, { hard: { id: 'r_age' }, max: mt > c.v.tenure ? mt : null, part: mt > c.v.tenure && termsCheck(c, { tenure: mt }).clean ? mt : null });
    const chk = termsCheck(c, { tenure: rq.v });
    return chk.clean ? Object.assign(out, { ok: true, to: rq.v }) : Object.assign(out, { refer: true, to: rq.v, chk });
  }
  return out;
}
function sysNoteOf(c, k, to, r) {
  const N = POL.neg, base = c.w.offers[0], n = offerNums(c, lastOffer(c));
  if (k === 'rate') return 'Asked for ' + (to ? to.toFixed(2) + '%' : 'a lower rate') + ' against ' + c.v.roi.toFixed(2) + '% now. ' + (r && r.disc ? 'The system can go to ' + r.sysMin.toFixed(2) + '%, ' + N.rate.toFixed(2) + '% below the first offer of ' + base.roi.toFixed(2) + '%.' : 'The system cannot cut the rate: the lowest score is ' + (r ? r.score : '') + ', under ' + N.score + '.') + ' The floor is ' + N.floor.toFixed(2) + '%.' + (r && r.floor ? ' The customer asked for less than the floor.' : '');
  if (k === 'pf') return 'Asked for ' + fmtK('pf', to) + ' (' + inr(n.pf0 * to / 100) + '). The system can waive up to ' + N.pf + '%.';
  if (k === 'amt') { const t = termsCheck(c, { loan: to }); return 'Asked for ' + lakh(to) + ' against ' + lakh(c.v.loan) + ' now. ' + (t.hard.length ? 'Breaks: ' + listAnd(t.hard.map(x => lc1(x.name))) + '.' : t.fails.length ? 'New deviation: ' + listAnd(t.fails.map(x => lc1(x.name) + ' (' + x.lvl + ')')) + '.' : !t.authOk ? 'Above the sanctioning authority’s limit of ' + lakh(t.lim) + '.' : 'Every rule is still met, but it is more than the system’s ' + N.amt + '% limit (' + lakh(floor10k(base.loan * (1 + N.amt / 100))) + ').') + ' FOIR would be ' + pctf(t.m.foir) + ', LTV ' + pctf(t.m.ltv) + '.'; }
  if (k === 'ten') { const t = termsCheck(c, { tenure: to }); return 'Asked for ' + yrsTxt(to) + ' against ' + yrsTxt(c.v.tenure) + ' now. ' + (t.fails.length ? 'New deviation: ' + listAnd(t.fails.map(x => lc1(x.name) + ' (' + x.lvl + ')')) + '.' : 'Every rule is still met.'); }
  return '';
}
function applyNeg(c, k, v, txt, by, note) {
  const o = lastOffer(c), ch = k === 'rate' ? { roi: v } : k === 'pf' ? { pfw: v } : k === 'amt' ? { loan: v } : { tenure: v };
  const pol = { rate: '9.2', pf: '9.3', amt: '9.4', ten: '3.3' }[k];
  const before = offerNums(c, o), nx = newOffer(c, ch, by, (by === 'SYS' ? 'The customer asked in the chat: “' + txt + '”. Within the system’s discretion, policy ' + pol + '.' : txt), null);
  const after = offerNums(c, nx);
  const msg = note || ('Done. ' + (k === 'rate' ? 'I can offer ' + v.toFixed(2) + '% instead of ' + o.roi.toFixed(2) + '%. Your EMI comes down to ' + inr(after.emi) + '.' : k === 'pf' ? 'I have waived ' + v + '% of the processing fee: you pay ' + inr(after.pf) + ' instead of ' + inr(before.pf) + '.' : k === 'amt' ? 'Your loan can be ' + lakh(v) + '. Your EMI would be ' + inr(after.emi) + '.' : 'Your tenure is now ' + yrsTxt(v) + ', and your EMI comes down to ' + inr(after.emi) + '.') + ' Here is your revised offer.');
  say(c, { f: by === 'SYS' ? 'bot' : 'cm', by: by === 'SYS' ? '' : AUTH.L1.name, t: msg, wa: 1, at: nx.at });
  say(c, { f: 'bot', k: 'offer', ov: nx.v, at: nx.at });
  return nx;
}
function newOffer(c, ch, by, why) {
  const prev = lastOffer(c), at = tick(1);
  if (ch.loan != null) c.v.loan = ch.loan; if (ch.tenure != null) c.v.tenure = ch.tenure; if (ch.roi != null) c.v.roi = r2(ch.roi); if (ch.pfw != null) c.w.pfw = ch.pfw;
  prev.st = 'replaced';
  const o = mkOffer(c, { v: prev.v + 1, at, by, st: 'sent', why }); o.diff = offerDiff(c, prev, o);
  c.w.offers.push(o); c.w.san.sent = at;
  c.w.log.push({ at, w: by === 'SYS' ? who('sys', 'System', 'Pricing discretion, policy 9') : L1W(), cat: 'decision', txt: 'Revised offer, version ' + o.v + ', sent to the customer', det: o.diff.map(d => d[0] + ' ' + d[1] + ' to ' + d[2]).join('; ') + '. ' + (why || '') });
  return o;
}
function referNeg(c, k, to, txt, r) {
  c.w.neg = c.w.neg || []; const at = tick(1), id = 'R' + (c.w.neg.length + 1);
  const rq = { id, at, k, to, txt, st: 'open', note: sysNoteOf(c, k, to, r), part: r && r.part != null ? r.part : null };
  c.w.neg.push(rq);
  c.w.log.push({ at, w: who('sys', 'System', 'Negotiation'), cat: 'comms', txt: 'Customer’s request passed to the credit manager', det: '“' + txt + '” ' + rq.note });
  const acc = c.w.san && c.w.san.accepted, flo = k === 'rate' && r && r.floor;
  say(c, { f: 'bot', t: (acc ? 'You have accepted version ' + lastOffer(c).v + ', so a change now needs a fresh sanction. I have passed your request to ' + AUTH.L1.name + ', your credit manager.' : (flo ? 'Our lowest rate for any home loan is ' + POL.neg.floor.toFixed(2) + '%. ' : '') + 'I have asked ' + AUTH.L1.name + ', your credit manager, about ' + (to != null ? fmtK(k, to, c) : 'a lower rate') + '. You will hear back here and on WhatsApp, usually within a working day. Your current offer stays open meanwhile.'), at });
  return rq;
}
function negotiate(c, txt, rq) {
  const r = negEval(c, rq), o = lastOffer(c), nm = fn7(c), cm = AUTH.L1.name;
  if (r.same) return say(c, { f: 'bot', t: rq.k === 'rate' ? 'Your rate is already ' + c.v.roi.toFixed(2) + '%.' : rq.k === 'pf' ? 'That is already in your offer.' : 'Your offer already has that.' });
  if (r.needNum) return say(c, { f: 'bot', t: 'How much would you like? Tell me the amount, for example “' + lakh(floor10k(c.v.loan * 1.08)) + '”, and I will check it straight away.' });
  if (r.k === 'ten' && r.maxed) return say(c, { f: 'bot', t: 'Your tenure is already the longest we can offer, ' + yrsTxt(c.v.tenure) + '. A lower EMI would need a lower amount or a lower rate.' });
  if (r.k === 'ten' && r.offerTen) return say(c, { f: 'bot', k: 'choice', t: 'I can bring the EMI down by stretching the tenure to ' + yrsTxt(r.offerTen) + ': ' + inr(r.emiTo) + ' a month instead of ' + inr(offerNums(c, o).emi) + '. You pay more interest over the life of the loan, and you can always prepay without a charge. Shall I change it?', opts: [['Yes, make it ' + yrsTxt(r.offerTen), 'apply|ten|' + r.offerTen], ['No, keep ' + yrsTxt(c.v.tenure), 'keep']] });
  if (r.ok) return applyNeg(c, r.k, r.to, txt, 'SYS');
  if (r.hard) {
    const why = r.hard.id ? hardWhy(r.hard, c) : '';
    if (!r.max) return say(c, { f: 'bot', t: 'I can’t do ' + fmtK(r.k, rq.v, c) + ': ' + why + '. Your current offer stays as it is.' });
    const opts = r.part ? [['Make it ' + fmtK(r.k, r.max, c), 'apply|' + r.k + '|' + r.max]] : [['Ask the credit manager for ' + fmtK(r.k, r.max, c), 'refer|' + r.k + '|' + r.max]];
    opts.push(['No, keep my offer', 'keep']);
    return say(c, { f: 'bot', k: 'choice', t: 'I can’t do ' + fmtK(r.k, rq.v, c) + ': ' + why + '. The most we can offer is ' + fmtK(r.k, r.max, c) + '.' + (r.part ? ' I can change it to that straight away.' : ' That needs your credit manager.'), opts });
  }
  if (r.refer && r.part != null) {
    const what = r.k === 'rate' ? 'The best I can do straight away is ' + r.part.toFixed(2) + '%.' : r.k === 'pf' ? 'I can waive ' + r.part + '% of it straight away.' : r.k === 'amt' ? 'I can raise it to ' + lakh(r.part) + ' straight away.' : '';
    const ask = r.k === 'rate' ? (r.floor ? POL.neg.floor.toFixed(2) + '%, our lowest rate' : r.to.toFixed(2) + '%') : fmtK(r.k, r.to, c);
    return say(c, { f: 'bot', k: 'choice', t: 'I can’t agree to ' + fmtK(r.k, rq.v != null ? rq.v : r.to, c) + ' on my own. ' + what + ' Your credit manager, ' + cm + ', can look at ' + ask + '.', opts: [['Take ' + fmtK(r.k, r.part, c).replace(' off the processing fee', ' off') + ' now', 'apply|' + r.k + '|' + r.part], ['Ask ' + cm.split(' ')[0] + ' for ' + ask.replace(', our lowest rate', ''), 'refer|' + r.k + '|' + r.to]] });
  }
  if (r.refer) return referNeg(c, r.k, r.to, txt, r);
  return say(c, { f: 'bot', t: 'I’m not sure what to change there. You can ask about the rate, the processing fee, the amount or the tenure.' });
}

/* ---------------- the chat, for both customers ---------------- */
const cusOk = id => { const c = CASES.find(x => x.id === id); return !!(c && !(c.lead && (c.lead.hidden || !c.lead.in))); };

function cusSay7(q) {
  const c = cusCase(); if (!c || !q.trim()) return; const txt = q.trim();
  say(c, { f: 'me', t: txt }); S.cq = ''; S.ctyping = true; render();
  setTimeout(() => {
    S.ctyping = false; const s = txt.toLowerCase(), k = fullEval(c).st.k, rq = negIntent(txt), rm = rmOf(c), san = c.w.san || {};
    if (rq && k === 'approved' && offerOpen(c)) negotiate(c, txt, rq);
    else if (rq && k === 'approved' && san.accepted) referNeg(c, rq.k === 'emi' ? 'ten' : rq.k, rq.v, txt, null);
    else if (rq) say(c, { f: 'bot', t: 'Your loan is not sanctioned yet. Once it is, the offer comes here and on WhatsApp, and you can ask me for changes then.' });
    else if (/why.*(ask|question)|why do you need (this|to know)/.test(s)) say(c, { f: 'bot', t: 'We ask everyone about late payments in the last two years and about large one-off credits. It helps the credit team decide fairly and quickly. A short, honest answer is enough; proof helps if you have it.' });
    else if (/who (sees|reads|will see)|private|confidential|share (my|this)/.test(s)) say(c, { f: 'bot', t: 'Only our credit team sees your answers, and they are kept with your application. We never share them for marketing.' });
    else if (/\brm\b|relationship|talk|call|person|human|someone|agent/.test(s)) say(c, { f: 'bot', t: 'Your relationship manager is ' + rm.n + ', at ' + rm.w + ', 9:30 to 19:00, Monday to Saturday. Tap Request a call back, under Talk to us, and he will call you.' });
    else if (/complain|grievance|unhappy|not happy|escalat/.test(s)) { say(c, { f: 'bot', t: 'I’m sorry to hear that. I have passed it to our grievance team, who will reply here. I have also told ' + rm.n + ', your relationship manager.' }); c.w.log.push({ at: S8(CLK), w: who('cus', c.apps[0].name, 'Customer'), cat: 'comms', txt: 'Complaint from the customer’s page', det: txt + ' Passed to the grievance team and to ' + rm.n + '.' }); }
    else if (/what happens next|next step/.test(s) && san.accepted) say(c, { f: 'bot', t: 'Next, our operations team checks the original property documents and pays the seller directly. That usually takes 3 to 5 working days. We will keep you posted here and on WhatsApp.' });
    else {
      let a = cusAnswer(txt, c);
      if (a) a = a.split(SALES.name).join(rm.n);
      if (!a) { a = 'I’m not sure about that one, so I have passed it to ' + rm.n + ', your relationship manager, who usually replies within a working day.'; c.w.log.push({ at: S8(CLK), w: who('cus', c.apps[0].name, 'Customer'), cat: 'comms', txt: 'Question for the RM from the customer’s page', det: txt }); }
      say(c, { f: 'bot', t: a });
    }
    if (document.activeElement && document.activeElement.id === 'cq') S.focusId = 'cq';
    render();
  }, 650);
}
function msgTime(at) { return sameDay(at, CLK) ? ftime(at) : fds(at) + ', ' + ftime(at); }

function offerCard(c, ov) {
  const o = c.w.offers && c.w.offers[ov - 1]; if (!o) return '';
  const n = offerNums(c, o), last = o === lastOffer(c), acc = o.st === 'accepted', rep = o.st === 'replaced';
  const rows = [['Loan', lakh(o.loan)], ['Tenure', yrsTxt(o.tenure)], ['Interest rate', o.roi.toFixed(2) + '%, floating'], ['EMI', inr(n.emi)], ['Processing fee', inr(n.pf) + (o.pfw ? ', ' + o.pfw + '% waived' : '')], ['Valid until', fdate(addDays(sanDate(c), LENDER.validity))]];
  return `<div class="ofr${rep ? ' old' : ''}${acc ? ' acc' : ''}"><div class="ofr-h"><b>${o.v === 1 ? 'Your sanction offer' : 'Revised offer'}</b><span>Version ${o.v}</span></div>${o.diff && o.diff.length && !rep ? `<ul class="ofr-d">${o.diff.map(([l, a, b]) => `<li><span>${esc(l)}</span><s>${esc(a)}</s>${ic('fwd')}<b>${esc(b)}</b></li>`).join('')}</ul>` : ''}<dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  ${rep ? `<p class="ofr-n">Replaced by version ${o.v + 1}.</p>` : acc ? `<p class="ofr-n ok">${ic('check')}Accepted with an OTP, ${esc(fdt(o.accAt))}.</p>` : last && S.view === 'cust' ? `<div class="ofr-a"><button class="btn btn-p btn-sm" data-act="cacc">${ic('check')}Accept with an OTP</button><button class="btn btn-s btn-sm" data-act="cchg">Ask for a change</button><button class="btn btn-g btn-sm" data-act="ckfs">${ic('file')}Letter and KFS</button></div>` : last ? '<p class="ofr-n">Waiting for the customer.</p>' : ''}</div>`;
}
function msgHTML(c, m, i, staff) {
  const av = m.f === 'cm' ? `<span class="cm-av p">${esc(inits(m.by || AUTH.L1.name))}</span>` : m.f === 'bot' ? `<span class="cm-av ua">${LOGO}</span>` : '';
  const meta = `<span class="cm-t">${m.f === 'cm' ? esc(m.by) + ', credit manager · ' : ''}${esc(msgTime(m.at))}${m.wa ? `<span class="cm-wa" title="${esc(waText(c, m, staff))}">${ic('chat')}Also sent on WhatsApp</span>` : ''}</span>`;
  let body;
  if (m.k === 'q') body = staff ? `<div class="qc done"><div class="qc-h">${ic('help')}<span>Question from the system</span></div><p class="qc-q">${esc(QDEF[m.q].q)}</p><p class="qc-why">${esc({ asked: 'Not answered yet', answered: 'Answered', confirmed: 'Answered and settled' }[chkSt(c, { id: m.q }).st] || '')}</p></div>` : qCard(c, m);
  else if (m.k === 'offer') body = offerCard(c, m.ov);
  else if (m.k === 'choice') body = `<div class="cm-p"><p>${esc(m.t)}</p><div class="cm-ch">${m.opts.map(([l], j) => `<button class="btn ${j ? 'btn-s' : 'btn-p'} btn-sm" data-act="cneg" data-v="${i}|${j}"${m.done != null || staff ? ' disabled' : ''}>${esc(l)}</button>`).join('')}</div></div>`;
  else body = `<p>${esc(m.t)}${m.att ? `<span class="att">${ic('file')}${esc(m.att)}</span>` : ''}</p>`;
  return `<div class="cm ${m.f === 'me' ? 'me' : 'bot'}${m.k ? ' card' : ''}">${av}<div class="cm-b">${body}${meta}</div></div>`;
}

/* ---------------- the customer's page ---------------- */



/* ---------------- the credit manager's side ---------------- */
function chkRow(c, k, ro) {
  const s = chkSt(c, k), def = ['open', 'answered'].includes(s.st) && openChecks(c)[0] === k, isOpen = S.open['chk:' + k.id] != null ? S.open['chk:' + k.id] : def;
  const lab = { open: 'Open', asked: s.sys ? 'Waiting for the customer' : 'Asked the customer', answered: 'Customer answered', confirmed: 'Confirmed', corrected: 'Corrected', waived: 'Waived' }[s.st];
  let acts = '';
  const btns = `<div class="act-row"><button class="btn btn-ok btn-sm" data-act="chkdo" data-v="${k.id}|confirmed">${ic('check')}${s.st === 'answered' ? 'Accept the explanation' : 'Confirm'}</button>${s.st === 'answered' ? '' : `<button class="btn btn-s btn-sm" data-act="chkdo" data-v="${k.id}|correct">Correct</button><button class="btn btn-s btn-sm" data-act="chkdo" data-v="${k.id}|asked">${ic('send')}Ask the customer</button>`}<button class="btn btn-g btn-sm" data-act="chkdo" data-v="${k.id}|waive">Waive</button></div>`;
  if (!ro && ['open', 'answered'].includes(s.st)) {
    const mode = S.form.chk && S.form.chk.id === k.id ? S.form.chk.mode : null;
    acts = mode ? `<div class="frm"><label>${mode === 'correct' ? 'Correct value' : 'Why waive it?'}<input class="inp2" id="chkIn" data-autofocus placeholder="${mode === 'correct' ? 'What it should say' : 'The reason goes into the audit trail'}"></label></div><div class="act-row"><button class="btn btn-p btn-sm" data-act="chkdo" data-v="${k.id}|${mode === 'correct' ? 'corrected' : 'waived'}">${mode === 'correct' ? 'Save the correction' : 'Waive'}</button><button class="btn btn-g btn-sm" data-act="chkdo" data-v="${k.id}|cancel">Cancel</button></div>` : btns;
  }
  let extra = '';
  if (s.st === 'asked' && s.sys) extra = `<div class="ask">${ic('send')}<div>The system asked ${esc(fn7(c))} for ${esc(lc1(k.ask))}, ${fdt(s.at)}, in his page and on WhatsApp. A reminder went this morning. ${ro ? '' : 'Nothing to do until he answers.'}</div></div>`;
  else if (s.st === 'asked') acts = `<div class="ask">${ic('send')}<div>Asked for ${esc(lc1(k.ask))}, ${fdt(s.at)}.${ro ? '' : `<div class="wait-r" style="margin-top:8px"><span class="spin"></span>Waiting for ${esc(fn7(c))}’s reply</div>`}</div></div>`;
  if (s.st === 'answered') { const Q = QDEF[k.id]; extra = `<div class="cans"><div class="ins-k">${esc(fn7(c))}’s answer, ${fdt(s.at)}</div><p><b>${esc(s.opt)}.</b> ${esc(s.txt)}</p>${s.doc ? `<span class="att">${ic('file')}${esc(Q.doc.f)}</span><div class="ins-k">The system read the document</div><p>${esc(Q.read)}</p>` : '<p class="hint">No document attached.</p>'}</div>`; }
  if (!['open', 'asked', 'answered'].includes(s.st)) acts = `<p class="hint">${esc(lab)} by ${esc(s.by || AUTH.L1.name)}, ${fdt(s.at)}${s.note ? ': ' + esc(s.note) : '.'}</p>`;
  return `<div class="chk${isOpen ? ' open' : ''}${['confirmed', 'corrected', 'waived'].includes(s.st) ? ' done' : ''}"><button class="chk-h" data-act="chkx" data-v="${k.id}" aria-expanded="${isOpen}"><span class="sev ${k.sev}" title="${k.sev === 'high' ? 'Important' : k.sev === 'med' ? 'Worth a look' : 'Minor'}"></span><span><b>${esc(k.t)}</b><small>${esc(k.sug)}</small></span><span class="cst ${s.st}">${esc(lab)}</span>${ic('chev', 'chev')}</button>${isOpen ? `<div class="chk-b"><div>${evDoc(k.ev)}</div><div><div class="ins-k">What the system found</div><p>${esc(k.f)}</p>${extra}${s.st === 'answered' ? '' : `<div class="ins-k">Suggestion</div><p>${esc(k.sug)}</p>`}${acts}</div></div>` : ''}</div>`;
}
openChecks = function (c) { return visChecks(c).filter(k => ['open', 'asked', 'answered'].includes(chkSt(c, k).st)); };
function teInit(c, rq) {
  const o = lastOffer(c), t = { loan: o.loan / 1e5, ten: o.tenure / 12, roi: o.roi, pfw: o.pfw || 0, why: '', msg: '', rq: rq ? rq.id : null };
  if (rq) { if (rq.k === 'rate') t.roi = rq.part != null ? r2((rq.part + (rq.to || POL.neg.floor)) / 2) : rq.to || o.roi; if (rq.k === 'pf') t.pfw = 75; if (rq.k === 'amt') t.loan = (rq.to || o.loan) / 1e5; if (rq.k === 'ten') t.ten = (rq.to || o.tenure) / 12; t.why = 'Counter-offer to the customer’s request'; }
  return t;
}
function teEval(c) {
  const t = S.te, o = lastOffer(c), ch = { loan: Math.round(+t.loan * 1e5 / 1000) * 1000, tenure: Math.round(+t.ten) * 12, roi: r2(+t.roi), pfw: clamp(Math.round(+t.pfw), 0, 100) };
  const chk = termsCheck(c, ch), floorOk = ch.roi >= POL.neg.floor - 1e-9, nx = Object.assign({}, o, ch), diff = offerDiff(c, o, nx);
  const L = [];
  L.push(chk.hard.length ? ['err', 'Breaks ' + listAnd(chk.hard.map(r => lc1(r.name))), chk.hard.map(ruleTxt).join('. ')] : chk.fails.length ? ['err', 'Needs a fresh decision: ' + listAnd(chk.fails.map(r => lc1(r.name) + ' (' + r.lvl + ')')), 'Changes that raise a deviation go back through the decision.'] : ['ok', 'Every policy rule is still met', 'FOIR ' + pctf(chk.m.foir) + ', LTV ' + pctf(chk.m.ltv) + '.']);
  L.push(chk.authOk ? ['ok', 'Within the sanctioning authority', (chk.by === 'SYS' ? 'The system' : byName(chk.by)) + ' sanctioned this file, up to ' + lakh(Math.max(chk.lim, c.w.offers[0].loan)) + '.'] : ['err', 'Above the sanctioning authority', 'Up to ' + lakh(chk.lim) + '. A larger amount needs a fresh decision.']);
  L.push(floorOk ? ['ok', 'At or above the ' + POL.neg.floor.toFixed(2) + '% floor', 'Policy 9.1. Your pricing authority goes down to the floor.'] : ['err', 'Below the ' + POL.neg.floor.toFixed(2) + '% floor', 'Rates below the floor need the pricing committee.']);
  return { ch, chk, diff, L, ok: !chk.hard.length && !chk.fails.length && chk.authOk && floorOk && diff.length > 0, nums: offerNums(c, nx) };
}
function teMsg(c, diff) { return 'Hello ' + fn7(c) + ', this is ' + AUTH.L1.name + ', your credit manager. We have revised your offer: ' + diff.filter(d => d[0] !== 'EMI').map(d => lc1(d[0]) + ' ' + d[2] + ' (was ' + d[1] + ')').join(', ') + '. Please review it and accept it here when you are ready.'; }
function negPanels(c) {
  const ro = S.role !== 'cm', o = lastOffer(c); if (!o) return '';
  const R = c.w.neg || [], open = R.filter(r => r.st === 'open'), shut = R.filter(r => r.st !== 'open'), acc = !!c.w.san.accepted;
  const reqs = open.length ? `<section class="panel req7"><div class="ph"><h3>${ic('chat')}The customer asked for a change</h3><span class="note">The system could not agree on its own</span></div><div class="pb">${open.map(r => {
    const can = r.to != null && (r.k !== 'amt' && r.k !== 'ten' ? true : termsCheck(c, r.k === 'amt' ? { loan: r.to } : { tenure: r.to }).clean) && (r.k !== 'rate' || r.to >= POL.neg.floor - 1e-9), dm = S.rd === r.id;
    return `<div class="rq"><div class="rq-q"><q>${esc(r.txt)}</q><small>${esc(fn7(c))}, in his page, ${esc(fdt(r.at))}</small></div><div class="ins-k">The system’s check</div><p>${esc(r.note)}</p>${ro ? '' : acc && !dm ? `<p class="hint">${esc(fn7(c))} has accepted version ${o.v}. A change now needs a fresh sanction.</p><div class="act-row"><button class="btn btn-s btn-sm" data-act="rqdecl" data-v="${r.id}">${ic('chat')}Reply</button></div>` : dm ? `<label class="fp-f">Message to ${esc(fn7(c))}<textarea class="ta" id="rdMsg" rows="3">${esc('We can’t do ' + (r.to != null ? fmtK(r.k, r.to, c) : 'that') + ' on this loan. Your current offer, version ' + o.v + ', stands and is valid until ' + fdate(addDays(sanDate(c), LENDER.validity)) + '.')}</textarea></label><div class="act-row"><button class="btn btn-p btn-sm" data-act="rqdsend" data-v="${r.id}">${ic('send')}Send</button><button class="btn btn-g btn-sm" data-act="rqdecl" data-v="">Cancel</button></div>` : `<div class="act-row">${can ? `<button class="btn btn-ok btn-sm" data-act="rqagree" data-v="${r.id}">${ic('check')}Agree to ${esc(fmtK(r.k, r.to, c).replace(' of the processing fee', '').replace(' off the processing fee', ' off the fee'))}</button>` : ''}<button class="btn btn-s btn-sm" data-act="teopen" data-v="${r.id}">Counter-offer</button><button class="btn btn-g btn-sm" data-act="rqdecl" data-v="${r.id}">Decline</button></div>${can ? '' : '<p class="hint">Agreeing as asked is outside policy or your authority. Make a counter-offer, or decline.</p>'}`}</div>`; }).join('')}</div></section>` : '';
  const vers = c.w.offers.slice().reverse();
  const offer = `<section class="panel ofr7"><div class="ph"><h3>Offer to the customer</h3><span class="note">${acc ? 'Accepted ' + fdt(c.w.san.accepted) : 'Version ' + o.v + ' sent ' + fdt(o.at) + ', in his page and on WhatsApp'}</span>${!ro && !acc && !S.te ? `<button class="btn btn-s btn-sm act" data-act="teopen" data-v="">${ic('pen')}Change the terms</button>` : ''}</div><div class="pb">
  <ol class="ov7">${vers.map(x => { const n = offerNums(c, x); return `<li class="${x.st}"><span class="ov-v">v${x.v}</span><div><b>${esc(lakh(x.loan))}, ${esc(yrsTxt(x.tenure))}, ${x.roi.toFixed(2)}%</b><small>EMI ${esc(inr(n.emi))}. Processing fee ${esc(inr(n.pf))}${x.pfw ? ' (' + x.pfw + '% waived)' : ''}</small>${x.diff && x.diff.length ? `<small>${esc(x.diff.map(d => d[0] + ' ' + d[1] + ' to ' + d[2]).join('; '))}</small>` : ''}</div><span class="ov-s">${x.st === 'accepted' ? 'Accepted' : x.st === 'replaced' ? 'Replaced' : 'Waiting for the customer'}<small>${esc(x.by === 'SYS' ? 'By the system' : 'By ' + byName(x.by))}, ${esc(fdt(x.at))}</small></span></li>`; }).join('')}</ol>
  ${shut.length ? `<details class="rq-old"><summary>${plural(shut.length, 'earlier request')}</summary><ul>${shut.map(r => `<li><q>${esc(r.txt)}</q> <span>${esc({ agreed: 'Agreed', countered: 'Counter-offer made', declined: 'Declined', closed: 'Closed' }[r.st])}${r.res ? ': ' + esc(r.res) : ''}</span></li>`).join('')}</ul></details>` : ''}
  ${acc ? '<p class="hint">The customer accepted this version. A change now needs a fresh sanction.</p>' : ''}</div></section>`;
  let ed = '';
  if (S.te && !ro && !acc) {
    const v = teEval(c), t = S.te, rq = t.rq ? R.find(x => x.id === t.rq) : null;
    if (!t.msg && v.diff.length) t.msgAuto = teMsg(c, v.diff);
    ed = `<section class="panel te7" id="te7"><div class="ph"><h3>Change the terms</h3><span class="note">${rq ? 'Counter-offer to: “' + esc(short(rq.txt, 40)) + '”' : 'Sent to the customer as version ' + (o.v + 1)}</span></div><div class="pb">
    <div class="te-g"><label class="fp-f">Loan (₹ lakh)<input class="inp2" type="number" step="0.5" id="te-loan" data-te="loan" value="${esc(String(t.loan))}"></label><label class="fp-f">Tenure (years)<input class="inp2" type="number" step="1" id="te-ten" data-te="ten" value="${esc(String(t.ten))}"></label><label class="fp-f">Interest rate (%)<input class="inp2" type="number" step="0.05" id="te-roi" data-te="roi" value="${esc(String(t.roi))}"></label><label class="fp-f">Processing fee waived (%)<input class="inp2" type="number" step="5" min="0" max="100" id="te-pfw" data-te="pfw" value="${esc(String(t.pfw))}"></label></div>
    <div class="te-p"><div><span>EMI</span><b>${esc(inr(v.nums.emi))}</b><small>Now ${esc(inr(offerNums(c, o).emi))}</small></div><div><span>Processing fee</span><b>${esc(inr(v.nums.pf))}</b><small>Now ${esc(inr(offerNums(c, o).pf))}</small></div><div><span>Changes</span><b>${v.diff.length}</b><small>${esc(v.diff.length ? v.diff.map(d => d[0]).join(', ') : 'None yet')}</small></div></div>
    <ul class="te-c">${v.L.map(([k, a, b]) => `<li class="${k}">${ic(k === 'ok' ? 'check' : 'x')}<div><b>${esc(a)}</b><small>${esc(b)}</small></div></li>`).join('')}</ul>
    <label class="fp-f">Reason, for the audit trail<input class="inp2${S.teBad ? ' bad' : ''}" id="te-why" data-tw="why" value="${esc(t.why)}" placeholder="For example: matched a competing offer from the customer’s bank"></label>
    <label class="fp-f">Message to ${esc(fn7(c))}, in his page and on WhatsApp<textarea class="ta" id="te-msg" data-tw="msg" rows="3">${esc(t.msg || t.msgAuto || '')}</textarea></label>
    <div class="act-row"><button class="btn btn-p btn-sm" data-act="tesend"${v.ok ? '' : ' disabled'}>${ic('send')}Send version ${o.v + 1}</button><button class="btn btn-g btn-sm" data-act="tecancel">Cancel</button>${v.ok ? '' : `<span class="hint" style="margin:0">${v.diff.length ? 'Fix the items marked above first.' : 'Change at least one term.'}</span>`}</div></div></section>`;
  }
  const th = (c.chat || []), all = !!S.chall, show = all ? th : th.slice(-6);
  const thread = th.length ? `<section class="panel thr7"><div class="ph"><h3>Messages with the customer</h3><span class="note">${plural(th.filter(m => m.wa).length, 'message')} also on WhatsApp</span>${th.length > 6 ? `<button class="lnk act" data-act="chall">${all ? 'Show the latest' : 'Show all ' + th.length}</button>` : ''}</div><div class="pb"><div class="cm-l stf">${show.map(m => msgHTML(c, m, th.indexOf(m), true)).join('')}</div></div></section>` : '';
  return reqs + ed + offer + thread;
}
const _sanLeft7 = sanLeft;
sanLeft = function () {
  const c = C(), h = _sanLeft7(); if (E.st.k !== 'approved' || !c.w.offers) return h;
  const o = c.w.offers[0], viaPortal = o.ch !== 'email';
  return h.replace('<div class="stack">', '<div class="stack">' + negPanels(c)).replace('Email and SMS, ', viaPortal ? 'By the system, in the customer’s page and on WhatsApp, ' : 'Email and SMS, ');
};

/* ---------------- the CRM: what each file waits on, and who holds it ---------------- */
function waitOn(c, ev) {
  const st = ev.st, L = c.lead;
  switch (st.k) {
    case 'lead': { const pre = c.docs.filter(d => d.need === 'pre'), n = pre.filter(d => d.up).length; return { t: n < pre.length ? plural(pre.length - n, 'document') + ' for the pre-screen' : 'The customer’s consent', s: n + ' of ' + pre.length + ' in. ' + (L.consent ? 'Consent given' : 'Consent not given yet') }; }
    case 'prescreen': { const r = L.pre.res; if (r === 'yes') return { t: 'Sales to log in the file', s: 'Eligible up to ' + lakh(L.pre.max) }; if (r === 'change') { const cu = prescreenOf(c).cure; return { t: 'Sales to agree new terms', s: 'Works at ' + (cu ? lakh(cu.apply.loan) : 'a lower amount') + ', or with an earning co-applicant' }; } return { t: 'Sales to close the lead', s: 'The reasons go to the customer in writing' }; }
    case 'docs': { const m = loginMissing(c); return { t: 'Customer: ' + plural(m.length, 'document'), s: listAnd(m.slice(0, 2).map(d => lc1(d.t))) + (m.length > 2 ? ', and more' : '') }; }
    case 'provisional': { const open = c.tasks.filter(t => t.st !== 'accepted' && t.kind !== 'sys'), late = open.find(t => tState(t) === 'late'), oc = openChecks(c).length, tail = oc ? '. ' + plural(oc, 'check') + ' open' : ''; if (late) return { t: late.t + ', ' + late.vendor, s: plural(wdLate(late.due), 'working day') + ' late' + tail, late: true }; return { t: plural(open.length, 'outside report'), s: cap1(listAnd(open.slice(0, 2).map(t => lc1(t.t)))) + tail }; }
    case 'review': { const q = sysAsked(c), oc = openChecks(c).length; if (q.length && waitingCus(c)) return { t: 'Customer: ' + plural(q.length, 'answer'), s: 'Asked by the system ' + fds(chkSt(c, q[0]).at) + ', in his page and on WhatsApp' }; return { t: 'Credit manager’s decision', s: oc ? plural(oc, 'check') + ' to resolve first' : 'No open checks' }; }
    case 'returned': return { t: 'Credit manager, sent back', s: 'By ' + byName(st.by) };
    case 'pending': return { t: AUTH[st.lvl].name + ', ' + st.lvl, s: 'Referred ' + fds(c.w.req.at) + '. Target: ' + lc1(AUTH[st.lvl].sla) };
    case 'approved': { const san = c.w.san, o = lastOffer(c), rq = openReqs(c);
      if (san.handoff) return { t: 'Operations: first disbursement', s: 'Handed off ' + fds(san.handoff) };
      if (san.accepted) return { t: 'Hand-off to operations', s: 'Customer accepted ' + fds(san.accepted) };
      if (rq.length) return { t: 'Credit manager: the customer’s request', s: '“' + short(rq[0].txt, 40) + '”' };
      if (o) return { t: 'Customer: offer, version ' + o.v, s: 'Sent ' + fds(o.at) + '. Waiting for acceptance' };
      return { t: 'Offer to send', s: st.by === 'SYS' ? 'Sanctioned by the system' : 'Sanctioned by ' + byName(st.by) }; }
    case 'declined': return { t: 'Nothing: closed', s: c.w.letter ? 'Reasons sent ' + fds(c.w.letter.sent) : 'Letter still to send' };
  }
  return { t: '', s: '' };
}
function holder(c, ev) {
  const st = ev.st;
  if (['lead', 'prescreen'].includes(st.k) || (st.k === 'declined' && c.lead && !c.lead.in)) {
    const by = c.lead.by, dsa = by.indexOf('(DSA)') >= 0, o = ownKey(c);
    if (o && TEAM[o]) return { n: TEAM[o].n, r: st.k === 'declined' ? 'Closed' : dsa ? 'Via ' + by.replace(' (DSA)', '') : TEAM[o].r + ', ' + TEAM[o].w };
    return { n: by.replace(' (DSA)', ''), r: st.k === 'declined' ? 'Closed' : dsa ? 'DSA' : 'Sales' };
  }
  if (st.k === 'docs') return { n: 'Customer', r: 'Uploading documents' };
  if (st.k === 'provisional') return { n: AUTH.L1.name, r: 'Chasing reports' };
  if (['review', 'returned'].includes(st.k)) return waitingCus(c) ? { n: c.apps[0].name, r: 'Customer, answering questions' } : { n: AUTH.L1.name, r: 'Credit manager' };
  if (st.k === 'pending') return { n: AUTH[st.lvl].name, r: st.lvl + ', ' + AUTH[st.lvl].title };
  if (st.k === 'approved') { const san = c.w.san; if (san.handoff) return { n: 'Operations', r: 'Disbursement' }; if (openReqs(c).length) return { n: AUTH.L1.name, r: 'Customer’s request' }; if (san.accepted) return { n: AUTH.L1.name, r: 'Hand-off to operations' }; if (lastOffer(c)) return { n: c.apps[0].name, r: 'Customer, reviewing the offer' }; return { n: AUTH.L1.name, r: 'Sanction pack' }; }
  return { n: AUTH.L1.name, r: 'Closed' };
}
function needsMe2(c, ev) {
  const k = ev.st.k;
  if (S.role === 'sales') return ownKey(c) === 'amit' && ['lead', 'prescreen', 'docs'].includes(k);
  if (S.role === 'cm') return (k === 'approved' && openReqs(c).length > 0) || (['review', 'returned'].includes(k) && !waitingCus(c)) || (k === 'provisional' && (openChecks(c).length > 0 || c.tasks.some(t => tState(t) === 'late'))) || (k === 'declined' && !c.w.letter);
  if (S.role === 'ap') return k === 'pending' && RANK[S.lvl] >= RANK[ev.st.lvl];
  return false;
}

/* ---------------- the sales manager: waiting on your team ---------------- */
const SMQ = [
  { g: 'letter', name: 'Ritesh and Komal Agarwal', no: 'HL-2611-04722', rm: 'rahul', amt: 6200000, at: '2026-11-10 17:20', what: 'Offer sent 10 Nov. Not accepted or signed' },
  { g: 'letter', name: 'Prakash Pillai', no: 'HL-2611-04790', rm: 'anoop', amt: 3400000, at: '2026-11-12 11:05', what: 'Offer sent 12 Nov. Customer opened it twice' },
  { g: 'letter', name: 'Swati Bhide', no: 'HL-2611-04803', rm: 'shweta', amt: 4800000, at: '2026-11-13 16:40', what: 'Offer sent 13 Nov. Asked to speak to the RM' },
  { g: 'docs', name: 'Deepak and Ritu Malhotra', no: 'HL-2611-04745', rm: 'rahul', amt: 7100000, at: '2026-11-09 12:30', what: '3 documents: Form 16, sale deed, and 1 more' },
  { g: 'docs', name: 'Rupali Wagh', no: 'HL-2611-04811', rm: 'amit', amt: 2900000, at: '2026-11-11 15:10', what: '2 documents: occupancy certificate and society NOC' },
  { g: 'docs', name: 'Thomas Mathew', no: 'HL-2611-04826', rm: 'anoop', amt: 3600000, at: '2026-11-13 10:45', what: '1 document: encumbrance certificate' },
  { g: 'cp', name: 'Sunil Pawar', no: 'HL-2610-04580', rm: 'shweta', amt: 4100000, at: '2026-11-05 14:00', what: 'Original sale deed, and the NOC from the seller’s bank' },
  { g: 'cp', name: 'Meenal Gokhale', no: 'HL-2611-04699', rm: 'amit', amt: 5300000, at: '2026-11-09 11:30', what: 'Property insurance with our interest noted' }
];
const WOTG = [['letter', 'Signed sanction letter not back', 'Offer sent more than 2 days ago, not yet accepted or signed'], ['docs', 'Customer documents pending', 'Logged in, documents outstanding for more than 2 days'], ['cp', 'Pre-disbursement documents', 'Accepted, documents for the first disbursement not collected']];
function wotRows() {
  const days = at => (CLK - P(at)) / 86400000, R = SMQ.map(x => Object.assign({ id: 'q' + x.no, live: null }, x));
  CASES.forEach((c, i) => {
    if (c.lead && (c.lead.hidden || !c.lead.in)) return; const ev = fullEval(c), k = ev.st.k, san = c.w.san || {}, rm = ownKey(c), base = { id: 'c' + c.id, name: caseName(c), no: c.v.appNo, rm, amt: c.v.loan, live: i };
    if (k === 'approved' && san.sent && !san.accepted && days(san.sent) > 2) R.push(Object.assign({}, base, { g: 'letter', at: san.sent, what: 'Offer sent ' + fds(san.sent) + '. Not accepted yet' }));
    if (k === 'docs' && days(c.v.login) > 2) { const m = loginMissing(c); R.push(Object.assign({}, base, { g: 'docs', at: c.v.login, what: plural(m.length, 'document') + ': ' + listAnd(m.slice(0, 2).map(d => lc1(d.t))) + (m.length > 2 ? ', and more' : '') })); }
    if (k === 'approved' && san.accepted && !san.handoff) { const m = c.docs.filter(d => d.need === 'cp' && !d.up); if (m.length) R.push(Object.assign({}, base, { g: 'cp', at: san.accepted, what: cap1(listAnd(m.map(d => lc1(d.t)))) })); }
  });
  return R.map(x => Object.assign(x, { d: Math.max(0, Math.round(days(x.at))) })).sort((a, b) => b.d - a.d);
}
function wotHTML() {
  const R = wotRows(), N = S.nudged || {};
  const row = x => { const t = TEAM[x.rm] || { n: 'Unassigned', w: '' }, nd = N[x.id]; return `<div class="wot-r"><span class="mini-av" title="${esc(t.n)}">${esc(inits(t.n))}</span><div class="wot-n">${x.live != null ? `<button class="lnk" data-act="open" data-v="${x.live}">${esc(x.name)}</button>` : `<b>${esc(x.name)}</b>`}<small>${esc(x.what)}</small><small class="wot-m">${esc(t.n)}. ${esc(x.no)}, ${esc(lakh(x.amt))}</small></div><div class="wot-x"><span class="wot-d${x.d >= 5 ? ' late' : ''}">${plural(x.d, 'day')}</span>${nd ? `<span class="wot-ok">${ic('check')}Nudged ${esc(ftime(nd))}</span>` : `<button class="btn btn-s btn-sm" data-act="nudge" data-v="${esc(x.id)}">${ic('bell')}Nudge</button>`}</div></div>`; };
  return `<section class="panel wot"><div class="ph"><h3>Waiting on your team</h3><span class="note">After login: things only sales can move. Oldest first</span></div><div class="pb"><div class="wot-gs">${WOTG.map(([g, l, s]) => { const L = R.filter(x => x.g === g); return `<div class="wot-g"><div class="wot-h"><b>${esc(l)}</b><span class="cnt${L.length ? ' w' : ''}">${L.length}</span></div><small class="wot-s">${esc(s)}</small>${L.map(row).join('') || '<p class="muted">Nothing waiting.</p>'}</div>`; }).join('')}</div><p class="hint">A nudge reminds the RM in the app and on WhatsApp, and is logged on the file.</p></div></section>`;
}
function mgrDash(L) {
  const exc = EXC.map(([k, l, s]) => { const c = L.filter(v => v.exc.includes(k)).length, on = !!(S.lf && S.lf.k === 'exc' && S.lf.v === k); return `<button class="exc-t${c ? (k === 'blocked' ? ' amber' : ' red') : ''}${on ? ' on' : ''}" data-act="lf" data-v="exc|${k}|${esc(l)}" aria-pressed="${on}"><b>${c}</b><span>${esc(l)}</span><small>${esc(excSub(L, k) || s)}</small></button>`; }).join('');
  const mf = S.mf || 'src', seg = `<div class="seg2" role="group" aria-label="Group the funnel by">${[['src', 'Source'], ['dsa', 'DSA'], ['team', 'Team']].map(([k, l]) => `<button class="${mf === k ? 'on' : ''}" data-act="mf" data-v="${k}" aria-pressed="${mf === k}">${l}</button>`).join('')}</div>`;
  let ft;
  if (mf === 'src') { const T = MSRC.reduce((a, r) => ({ leads: a.leads + r.leads, elig: a.elig + r.elig, login: a.login + r.login }), { leads: 0, elig: 0, login: 0 }); ft = `<table class="ft"><thead><tr><th>Source</th><th class="r">Leads</th><th class="r" title="First call within the target">On time</th><th class="r">Eligible</th><th class="r">Logins</th><th class="r">Lead to login</th><th class="r">Cost per login</th></tr></thead><tbody>${MSRC.map(r => { const ll = r.login / r.leads * 100; return `<tr><td>${esc(r.n)}</td><td class="r">${r.leads.toLocaleString('en-IN')}</td><td class="r${r.sla < 85 ? ' bad' : ''}">${r.sla}%</td><td class="r">${r.elig.toLocaleString('en-IN')}</td><td class="r">${r.login}</td><td class="r">${pctf(ll)}</td><td class="r">${r.cpl ? inr(r.cpl) : '<span class="muted">None</span>'}</td></tr>`; }).join('')}<tr class="tot"><td>All channels</td><td class="r">${T.leads.toLocaleString('en-IN')}</td><td class="r">86%</td><td class="r">${T.elig.toLocaleString('en-IN')}</td><td class="r">${T.login}</td><td class="r">${pctf(T.login / T.leads * 100)}</td><td class="r"></td></tr></tbody></table><p class="hint">On time: first call within the target, 5 minutes for digital leads and the same day for others. Red: below the 85% floor.</p>`; }
  else if (mf === 'dsa') ft = `<table class="ft"><thead><tr><th>DSA</th><th class="r">Leads</th><th class="r">Eligible at pre-screen</th><th class="r">Logins</th><th class="r">Login to sanction</th><th class="r">Ownership conflicts</th></tr></thead><tbody>${MDSA.map(r => `<tr><td>${esc(r.n)}<small>${esc(r.w)}</small></td><td class="r">${r.leads}</td><td class="r${r.elig < 40 ? ' bad' : ''}">${r.elig}%</td><td class="r">${r.login}</td><td class="r${r.ls < 60 ? ' bad' : ''}">${r.ls}%</td><td class="r${r.conf > 5 ? ' warnc' : ''}">${r.conf}%</td></tr>`).join('')}</tbody></table><p class="hint">Red: below the lender’s floor for the partner review. Amber: conflicts above 5% of the partner’s leads.</p>`;
  else ft = `<table class="ft"><thead><tr><th>Person</th><th class="r">Leads</th><th class="r" title="First call within the target">On time</th><th class="r">Contacted</th><th class="r">Logins</th><th class="r">Lead to login</th></tr></thead><tbody>${Object.keys(MTEAM).map(k => { const r = MTEAM[k], t = TEAM[k]; return `<tr><td>${esc(t.n)}<small>${esc(t.r + ', ' + t.w)}</small></td><td class="r">${r[0]}</td><td class="r${r[1] < 80 ? ' bad' : ''}">${r[1]}%</td><td class="r">${r[2]}</td><td class="r">${r[3]}</td><td class="r">${pctf(r[3] / r[0] * 100)}</td></tr>`; }).join('')}</tbody></table><p class="hint">Tele-sales qualify digital leads and hand them to branch RMs, so their lead-to-login rate runs lower.</p>`;
  const bars = (A, tone) => A.map(([l, p]) => `<div class="hb"><span>${esc(l)}</span><b>${p}%</b><span class="hb-t" aria-hidden="true"><i class="${tone}" style="width:${Math.min(100, p * 2.4)}%"></i></span></div>`).join('');
  return `${wotHTML()}<div class="mdash two">
  <section class="panel"><div class="ph"><h3>Funnel this month</h3><span class="note">All channels, 1 to 16 Nov</span><span class="act">${seg}</span></div><div class="pb ftw">${ft}</div></section>
  <section class="panel"><div class="ph"><h3>Lost and ageing</h3><span class="note">This month</span></div><div class="pb"><div class="ins-k">Why leads were lost</div>${bars(MLOST, 'lo')}<div class="ins-k" style="margin-top:14px">Age of open leads</div>${bars(MAGE, 'ag')}<p class="hint">Leads with no activity for 30 days go back to the pool for re-routing.</p></div></section></div>`;
}

/* ---------------- actions ---------------- */
const _pullgo7 = ACT.pullgo, _cmgo7 = ACT.cmgo, _sanacc7 = ACT.sanacc, _sansend7 = ACT.sansend, _reset7 = ACT.resetall, _persona7 = ACT.persona;
Object.assign(ACT, {
  cpick(v) { if (!cusOk(v)) return; S.cust = v; S.cq = ''; S.ctyping = false; render(); },
  cgoto(v) { const el = v === 'q' ? document.querySelector('.qc:not(.done)') : v === 'offer' ? [...document.querySelectorAll('.ofr')].pop() : $('#cus-chat'); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); },
  qopt(v) { const [q, i] = v.split('|'); S.qd = S.qd || {}; S.qd[q] = Object.assign(S.qd[q] || {}, { o: +i }); S.focusId = 'qt-' + q; render(); },
  qsample(v) { S.qd = S.qd || {}; S.qd[v] = Object.assign(S.qd[v] || {}, { t: QDEF[v].sample }); render(); },
  qup(v) { S.qd = S.qd || {}; const d = S.qd[v] = Object.assign(S.qd[v] || {}, { reading: true }); render(); setTimeout(() => { d.reading = false; d.up = true; render(); }, 800); },
  qsend(v) {
    const c = cusCase(), d = (S.qd || {})[v]; if (!c || !d || d.o == null || !(d.t || '').trim()) return;
    const r = qAnswer(c, v, d); delete S.qd[v]; S.ctyping = true; render();
    setTimeout(() => {
      S.ctyping = false; const Q = QDEF[v];
      say(c, { f: 'bot', t: r.autoOk ? 'Thank you. ' + cap1(Q.doc.l) + ' matches the amount and the date, so that one is settled.' + (r.left ? ' One more question is waiting above.' : '') : 'Thank you, ' + fn7(c) + '. Your answer' + (d.up ? ' and ' + Q.doc.l : '') + ' are with ' + AUTH.L1.name + ', your credit manager.' + (r.left ? ' One more question is waiting above.' : ' You will hear from us within a working day, here and on WhatsApp.') });
      render(); toast(r.left ? 'Answer sent. ' + plural(r.left, 'question') + ' left' : 'Answers sent to the credit team');
    }, 650);
  },
  cchg() { S.focusId = 'cq'; render(); toast('Type what you would like to change, or tap a suggestion'); },
  cneg(v) {
    const c = cusCase(), [i, j] = v.split('|').map(Number), m = c.chat[i]; if (!m || m.done != null) return; const [l, a] = m.opts[j]; m.done = j;
    say(c, { f: 'me', t: l }); const [act, k, val] = a.split('|');
    if (act === 'keep') say(c, { f: 'bot', t: 'No problem. Your offer stays as it is.' });
    else if (!offerOpen(c)) say(c, { f: 'bot', t: 'That offer is no longer open.' });
    else if (act === 'apply') applyNeg(c, k, +val, 'Chose “' + l + '” in the chat', 'SYS');
    else referNeg(c, k, +val, (c.chat.slice(0, i).reverse().find(x => x.f === 'me') || { t: l }).t, negEval(c, { k, v: +val }));
    render();
  },
  cacc() {
    const c = cusCase(), o = lastOffer(c), san = c.w.san || {};
    if (!o) { if (san.sent && !san.accepted) { san.accepted = tick(3); render(); } return; }
    if (o.st !== 'sent' || san.accepted) return;
    const at = tick(2); o.st = 'accepted'; o.accAt = at; san.accepted = at;
    (c.w.neg || []).forEach(r => { if (r.st === 'open') { r.st = 'closed'; r.res = 'The customer accepted version ' + o.v; } });
    c.w.log.push({ at, w: who('cus', c.apps[0].name, 'Customer'), cat: 'comms', txt: 'Offer accepted, version ' + o.v, det: 'OTP on the registered mobile, from the customer’s page. ' + offerLine(c, o) + '.' });
    say(c, { f: 'bot', t: 'Thank you, ' + fn7(c) + '. You accepted version ' + o.v + ' with an OTP. Next, our operations team checks the original property documents and arranges the payment to the seller. We will keep you posted here and on WhatsApp.', wa: 1, at });
    render(); toast('Offer accepted with an OTP');
  },
  cask(v) { cusSay7(v); },
  csend() { const el = $('#cq'), q = el ? el.value : S.cq || ''; if (!q.trim()) return; S.focusId = 'cq'; cusSay7(q); },
  teopen(v) { const c = C(), rq = v ? (c.w.neg || []).find(r => r.id === v) : null; S.te = teInit(c, rq); S.teBad = 0; S.rd = null; render(); const el = $('#te7'); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); },
  tecancel() { S.te = null; S.teBad = 0; render(); },
  tesend() {
    const c = C(), t = S.te; if (!t) return; const v = teEval(c); if (!v.ok) return;
    if (!(t.why || '').trim()) { S.teBad = 1; render(); const el = $('#te-why'); if (el) el.focus(); toast('Add a reason first, for the audit trail'); return; }
    const msg = (t.msg || t.msgAuto || teMsg(c, v.diff)).trim(), rq = t.rq ? c.w.neg.find(r => r.id === t.rq) : null;
    const nx = newOffer(c, v.ch, 'L1', t.why.trim());
    say(c, { f: 'cm', by: AUTH.L1.name, t: msg, wa: 1, at: nx.at }); say(c, { f: 'bot', k: 'offer', ov: nx.v, at: nx.at });
    if (rq) { rq.st = 'countered'; rq.res = 'Version ' + nx.v + ': ' + nx.diff.map(d => lc1(d[0]) + ' ' + d[2]).join(', '); }
    S.te = null; S.teBad = 0; render(); toast('Version ' + nx.v + ' sent to the customer, in his page and on WhatsApp');
  },
  rqagree(v) {
    const c = C(), r = (c.w.neg || []).find(x => x.id === v); if (!r || r.st !== 'open') return;
    const why = 'Agreed to the customer’s request: “' + r.txt + '”';
    const nx = applyNeg(c, r.k, r.to, why, 'L1', 'Good news from ' + AUTH.L1.name + ', your credit manager: we can agree to ' + fmtK(r.k, r.to, c) + '. Here is your revised offer.');
    r.st = 'agreed'; r.res = 'Version ' + nx.v; render(); toast('Agreed. Version ' + nx.v + ' sent to the customer');
  },
  rqdecl(v) { S.rd = v || null; render(); const el = $('#rdMsg'); if (el) el.focus(); },
  rqdsend(v) {
    const c = C(), r = (c.w.neg || []).find(x => x.id === v), el = $('#rdMsg'); if (!r || !el || !el.value.trim()) return;
    const at = tick(2); r.st = c.w.san.accepted ? 'closed' : 'declined'; r.res = el.value.trim();
    c.w.log.push({ at, w: L1W(), cat: 'decision', txt: c.w.san.accepted ? 'Replied to the customer’s request' : 'Declined the customer’s request', det: '“' + r.txt + '”. Message: ' + r.res });
    say(c, { f: 'cm', by: AUTH.L1.name, t: r.res, wa: 1, at }); S.rd = null; render(); toast('Sent to the customer, in his page and on WhatsApp');
  },
  chall() { S.chall = S.chall ? 0 : 1; render(); },
  nudge(v) {
    S.nudged = S.nudged || {}; if (S.nudged[v]) return; const x = wotRows().find(r => r.id === v); if (!x) return;
    S.nudged[v] = tick(1); const t = TEAM[x.rm] || { n: 'the RM' };
    if (x.live != null) CASES[x.live].w.log.push({ at: S.nudged[v], w: who('ppl', SMGR.name, SMGR.sub), cat: 'comms', txt: 'Nudged ' + t.n, det: WOTG.find(g => g[0] === x.g)[1] + '. ' + x.what + '.' });
    render(); toast('Reminder sent to ' + t.n + ' in the app and on WhatsApp');
  },
  pullgo() {
    const c = C(), had = !!c.w.dec; _pullgo7(); if (!had || c.w.dec || !c.w.offers) return;
    const at = S8(CLK); c.w.offersOld = (c.w.offersOld || []).concat(c.w.offers.map(o => Object.assign(o, { st: 'withdrawn' }))); c.w.offers = null; c.w.san = {}; c.w.neg = (c.w.neg || []).map(r => r.st === 'open' ? Object.assign(r, { st: 'closed', res: 'Offer withdrawn for review' }) : r);
    say(c, { f: 'bot', t: 'An update on your home loan: we have put your offer on hold while our credit team takes another look. ' + AUTH.L1.name + ', your credit manager, will be in touch, usually within a working day.', wa: 1, at });
    c.w.log.push({ at, w: who('sys', 'System', 'Offers'), cat: 'comms', txt: 'Offer withdrawn and the customer told', det: 'In the customer\u2019s page and on WhatsApp.' }); render();
  },
  cmgo(v) { const c = C(), was = c.w.dec; _cmgo7(v); if (!was && c.w.dec && c.w.dec.k === 'approved') toast('Sanctioned. The system sent the offer to ' + fn7(c) + ', in his page and on WhatsApp'); },
  sanacc() { const c = C(), o = lastOffer(c); _sanacc7(); if (o && c.w.san.accepted && o.st === 'sent') { o.st = 'accepted'; o.accAt = c.w.san.accepted; (c.w.neg || []).forEach(r => { if (r.st === 'open') { r.st = 'closed'; r.res = 'The customer accepted version ' + o.v; } }); render(); } },
  sansend() { const c = C(); _sansend7(); if (c.w.san.sent && !c.w.offers) { c.w.offers = [mkOffer(c, { v: 1, at: c.w.san.sent, by: c.w.dec.by, st: 'sent' })]; render(); } },
  resetall() { S.nudged = {}; S.qd = {}; S.te = null; S.teBad = 0; S.rd = null; S.chall = 0; S.cust = null; S.ctyping = false; _reset7(); },
  persona(v) { if (v === 'cust' && !(S.cust && cusOk(S.cust))) S.cust = cusOk('N1') ? 'N1' : 'G'; S.te = null; S.rd = null; _persona7(v); }
});


/* ---------------- start-up ---------------- */
/* start-up runs at the end of the last layer (22_client.js) */

/* =====================================================================
   v8, client-ready: what each user actually sees.
   - The customer gets the lender's own website, with an OTP sign-in.
   - People and firms outside the lender (the customer, vendors) act on
     their own, a few seconds after the step that asks them.
   - A second person approves policy changes from their own account.
   ===================================================================== */
Object.assign(ICO, {
  logout: '<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
});

/* ---------------- the customer website: sign-in ---------------- */
function cusSigned(id) { return !!(S.csign && S.csign[id]); }
const mob91 = c => '+91 ' + c.apps[0].mobile;
const SLOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2 12 4.5l8.5 6.7"/><path d="M6.5 9.6V19.5h11V9.6"/><path d="M10.2 19.5v-5h3.6v5"/></svg>';
function otpBoxes(g, val, auto) {
  return `<div class="otp6" data-g="${g}" role="group" aria-label="One-time password">${[0, 1, 2, 3, 4, 5].map(i => `<input class="otp-b" inputmode="numeric" autocomplete="one-time-code" maxlength="1" data-otp="${i}" aria-label="Digit ${i + 1}"${i === 0 && auto ? ' data-autofocus' : ''} value="${esc((val || '')[i] || '')}">`).join('')}</div>`;
}
function siteFoot() {
  return `<footer class="site-f"><div class="site-fi">
  <div><b>Stay safe</b><p>We will never ask for your OTP, PIN or password on a call, an email or a message. Enter your OTP only on this page.</p></div>
  <div><b>Complaints</b><p>Tell us in Messages, or ask your relationship manager. If we don’t resolve your complaint within 30 days, you can go to the RBI Integrated Ombudsman.</p></div>
  <div><b>Your data</b><p>We use your data only for your loan, as our privacy notice, version 3.2, sets out. We never share it for marketing.</p></div>
  </div></footer>`;
}
function cusSignHTML(c) {
  const si = S.csi && S.csi.id === c.id ? S.csi : null, otp = si && si.step === 'otp', v = (S.otpv || {}).si || '';
  const card = otp
    ? `<h2>Enter the OTP</h2><p class="si-p">We sent a 6-digit code to <b>${esc(mob91(c))}</b>. It is valid for 10 minutes.</p>${otpBoxes('si', v, true)}
      <button class="btn btn-p si-go" data-act="csiverify" id="otpGo-si"${v.length === 6 ? '' : ' disabled'}>Verify and sign in</button>
      <div class="si-row"><span id="csiRs">${resendTxt()}</span><button class="lnk" data-act="csiback">Back</button></div>`
    : `<h2>Sign in</h2><p class="si-p">Welcome back, ${esc(fn7(c))}. We’ll send a one-time password to your registered mobile number.</p>
      <div class="si-num"><span>Registered mobile</span><b>${esc(mob91(c))}</b></div>
      <button class="btn btn-p si-go" data-act="csisend" data-autofocus>Send OTP</button>
      <p class="si-n">Changed your number? Your relationship manager can update it at the branch.</p>`;
  return `<div class="si"><section class="si-l"><div class="si-li"><span class="smk lg">${LOGO}</span><h1>Your home loan, in one place</h1><p>See where your application is, share documents, ask us anything and accept your offer, without visiting the branch.</p>
  <ul>${['Updates here and on WhatsApp', 'Upload documents from your phone or computer', 'Accept your offer with an OTP'].map(t => `<li>${ic('check')}<span>${esc(t)}</span></li>`).join('')}</ul></div></section>
  <section class="si-r"><div class="si-c">${card}<p class="si-sec">${ic('lock')}<span>We will never ask for your OTP on a call or a message.</span></p></div></section></div>${siteFoot()}`;
}
function resendTxt() {
  const left = S.csi && S.csi.sentAt ? 30 - Math.floor((Date.now() - S.csi.sentAt) / 1000) : 0;
  return left > 0 ? 'Resend the OTP in 0:' + String(left).padStart(2, '0') : '<button class="lnk" data-act="csisend">Resend the OTP</button>';
}
setInterval(() => { const el = $('#csiRs'); if (el && S.csi && S.csi.sentAt) { const h = resendTxt(); if (el.innerHTML !== h) el.innerHTML = h; } }, 1000);

/* ---------------- the customer website: header and page ---------------- */
function cusNavHTML() {
  const c = cusCase(), on = c && cusSigned(c.id);
  return `<span class="brand">${LOGO}<b>uncia</b><span class="sprod">Home loans</span></span>${on ? `<span class="nav-div"></span><nav class="ntabs slinks" aria-label="Sections">${[['top', 'My application', 'home'], ['docs', 'Documents', 'file'], ['chat', 'Messages', 'chat'], ['help', 'Help', 'help']].map(([k, l, i]) => `<button class="ntab" data-act="cgoto" data-v="${k}" aria-label="${l}">${ic(i)}<span class="ntl">${l}</span></button>`).join('')}</nav>` : ''}<span class="nav-sp"></span>${whoBtn(false)}`;
}
function cusHTML() {
  if (!S.cust || !cusOk(S.cust)) S.cust = cusOk('N1') ? 'N1' : 'G';
  const c = cusCase();
  if (!cusSigned(c.id)) return cusSignHTML(c);
  const s = cusState(c), steps = cusSteps(c, s), nm = fn7(c), san = c.w.san || {}, o = lastOffer(c), qn = sysAsked(c).length, rm = rmOf(c);
  const pend = c.docs.filter(d => (d.need === 'login' || (san.accepted && d.need === 'cp')) && !d.up), later = san.accepted ? [] : c.docs.filter(d => d.need === 'cp' && !d.up), got = c.docs.filter(d => d.up).sort((a, b) => a.up.at < b.up.at ? 1 : -1);
  let hero = { title: s.title, text: s.text, act: '' };
  if (qn) hero = { title: 'We have ' + plural(qn, 'question') + ' for you', text: 'Before our credit team decides, they need a little more from you. It takes about 2 minutes.', act: `<button class="btn btn-p" data-act="cgoto" data-v="q">${ic('help')}Answer the questions</button>` };
  else if (s.k === 'review' && (c.w.chk && Object.values(c.w.chk).some(x => x.st === 'answered'))) hero = { title: 'Thank you. Your answers are with our credit team', text: 'You will hear from us within a working day, here and on WhatsApp.', act: '' };
  else if (s.k === 'approved' && offerOpen(c)) hero = { title: o.v > 1 ? 'Your revised offer is ready' : 'Your loan is sanctioned', text: 'Version ' + o.v + ' of your offer: ' + lakh(o.loan) + ' at ' + o.roi.toFixed(2) + '%, EMI ' + inr(offerNums(c, o).emi) + '. Accept it with an OTP, or ask for a change in your messages.', act: `<button class="btn btn-p" data-act="cacc">${ic('check')}Accept with an OTP</button><button class="btn btn-s" data-act="ckfs">${ic('file')}Letter and KFS</button>` };
  else if (s.act) hero.act = `<button class="btn btn-p" data-act="cacc">${ic('check')}Accept the offer with an OTP</button><button class="btn btn-s" data-act="ckfs">${ic('file')}Read the letter and KFS</button>`;
  else if (pend.length && s.k === 'docs') hero.act = `<button class="btn btn-p" data-act="cgoto" data-v="docs">${ic('upload')}Upload documents</button>`;
  const heroH = `<section class="cus-hero ${s.bad ? 'bad' : s.k === 'approved' ? 'ok' : ''}"><div><p class="cus-hi">Hello, ${esc(nm)}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.text)}</p>${hero.act ? `<div class="cus-act">${hero.act}</div>` : ''}</div>
  <dl class="cus-id"><div><dt>Application</dt><dd>${esc(c.v.appNo)}</dd></div><div><dt>Loan</dt><dd>${esc(lakh(c.v.loan))}, ${yrsTxt(c.v.tenure)}</dd></div><div><dt>Flat</dt><dd>${esc(c.prop.addr.split(',').slice(0, 2).join(','))}</dd></div></dl></section>`;
  const track = `<section class="panel"><div class="ph"><h3>Where your application is</h3><span class="note">Updated ${esc(fdt(S8(CLK)))}</span></div><div class="pb"><ol class="cus-tr">${steps.map((x, i) => `<li class="${x.cls}"><i>${x.cls === 'done' ? ic('check') : x.cls.indexOf('bad') >= 0 ? ic('x') : i + 1}</i><b>${esc(x.t)}</b><small>${esc(x.sub)}</small></li>`).join('')}</ol>
  ${s.k === 'provisional' ? `<ul class="cus-ck">${s.checks.map(t => `<li class="${t.st === 'accepted' ? 'ok' : ''}">${ic(t.st === 'accepted' ? 'check' : 'clock')}<span>${esc(CUSCHK[t.id] || t.t)}</span><small>${t.st === 'accepted' ? 'Done ' + fds(t.acc) : t.due ? 'Expected by ' + fds(t.due) : 'Starting soon'}</small></li>`).join('')}</ul>` : ''}</div></section>`;
  const docRow = d => { const rd = S.creading === d.id || S.creading === '*', h = CUSDOC[cdk(d)]; return `<div class="cus-d${d.up ? ' ok' : ''}">${ic('file')}<div><b>${esc(d.t)}</b>${h ? `<small>${esc(h[0])}</small>` : ''}</div>${rd ? '<span class="rd-ing"><span class="spin"></span>Uploading</span>' : `<button class="btn btn-s btn-sm" data-act="cup" data-v="${d.id}"${S.creading ? ' disabled' : ''}>${ic('upload')}Upload</button>`}</div>`; };
  const docs = `<section class="panel" id="cus-docs"><div class="ph"><h3>Your documents</h3><span class="note">${pend.length ? pend.length + ' to upload' : 'Nothing to upload'}</span>${pend.length > 1 ? `<button class="btn btn-s btn-sm act" data-act="call"${S.creading ? ' disabled' : ''}>${ic('upload')}Upload all</button>` : ''}</div><div class="pb">
  ${pend.length ? `<div class="cus-k">Still needed</div>${pend.map(docRow).join('')}<p class="cus-n">PDF, JPG or PNG, up to 10 MB each. Photos taken on your phone work too.</p>` : `<p class="cus-done">${ic('check')}We have everything we need from you for now. Thank you.</p>`}
  ${later.length ? `<div class="cus-k">Later, before disbursement</div>${later.map(d => `<div class="cus-d later">${ic('clock')}<div><b>${esc(d.t)}</b><small>${esc((CUSDOC[cdk(d)] || [''])[0])}</small></div></div>`).join('')}` : ''}
  <details class="cus-got"><summary>Received: ${plural(got.length, 'document')}</summary><ul>${got.map(d => `<li>${ic('check')}<span>${esc(d.t)}</span><small>${esc(fds(d.up.at))}</small></li>`).join('')}</ul></details></div></section>`;
  const neg = s.k === 'approved' && offerOpen(c), acc = s.k === 'approved' && san.accepted;
  const sug = qn ? ['Why are you asking this?', 'Who sees my answers?', 'Talk to my relationship manager']
    : neg ? ['Can you do ' + (c.v.roi - 0.15).toFixed(2) + '%?', 'Can you waive the processing fee?', 'Can I get ' + lakh(Math.round(c.v.loan * 1.09 / 100000) * 100000) + '?', 'Can the EMI be lower?', 'What happens after I accept?']
      : acc ? ['What happens next?', 'When is the money released?', 'Talk to my relationship manager']
        : (s.k === 'docs' ? ['Which documents are pending?', 'Why do you need Form 16?'] : ['Where is my application?', 'How long will the checks take?']).concat(['What will my EMI be?', 'What fees will I pay?', 'Talk to my relationship manager']);
  const msgs = c.chat || [];
  const chat = `<section class="panel cus-chat" id="cus-chat"><div class="ph"><h3>Messages</h3><span class="note">From your home loan team. Updates also go to your WhatsApp, ${esc(mob91(c))}, as you chose.</span></div><div class="pb"><div class="cm-l" id="cmsgs">${msgs.length ? msgs.map((m, i) => msgHTML(c, m, i)).join('') : `<p class="muted">No messages yet.</p>`}${S.ctyping ? `<div class="cm bot"><span class="cm-av ua">${LOGO}</span><div class="cm-b"><p class="typing"><i></i><i></i><i></i></p></div></div>` : ''}</div>
  ${neg ? `<p class="cm-hint">${ic('info')}Ask for a change in your own words. We agree on the spot when our policy allows it, and ask your credit manager when it doesn’t.</p>` : ''}
  <div class="cm-sug">${sug.map(q => `<button class="chip" data-act="cask" data-v="${esc(q)}">${esc(q)}</button>`).join('')}</div>
  <div class="cm-in"><input class="inp2" id="cq" placeholder="${neg ? 'Ask a question, or ask for a change' : 'Type a question'}" value="${esc(S.cq || '')}" aria-label="Type a message"><button class="btn btn-p" data-act="csend" aria-label="Send">${ic('send')}</button></div></div></section>`;
  const n = o ? offerNums(c, o) : null;
  const loan = `<section class="panel"><div class="ph"><h3>Your loan</h3><span class="note">${o ? (o.st === 'accepted' ? 'As accepted, version ' : 'Offer, version ') + o.v : s.k === 'approved' ? 'As sanctioned' : 'Indicative until the sanction'}</span></div><div class="pb"><dl class="cus-l"><div><dt>Amount</dt><dd>${esc(lakh(c.v.loan))}</dd></div><div><dt>Tenure</dt><dd>${yrsTxt(c.v.tenure)}</dd></div><div><dt>Interest rate</dt><dd>${c.v.roi.toFixed(2)}%<small>Floating</small></dd></div><div><dt>EMI</dt><dd>${esc(inr(n ? n.emi : s.ev.m.emi))}<small>A month</small></dd></div><div><dt>Processing fee</dt><dd>${esc(inr(n ? n.pf : Math.round(c.v.loan * LENDER.pfPrime / 100 * 1.18)))}<small>${c.w.pfw ? c.w.pfw + '% waived' : 'With GST'}</small></dd></div><div><dt>Prepayment charge</dt><dd>None<small>Floating-rate loan</small></dd></div></dl>${o ? `<button class="btn btn-s btn-sm cus-kfs" data-act="ckfs">${ic('file')}Sanction letter and KFS</button>` : `<p class="cus-n">Every charge is in the Key Facts Statement you get with the sanction letter.</p>`}</div></section>`;
  const cb = c.w.cb;
  const help = `<section class="panel" id="cus-help"><div class="ph"><h3>Talk to us</h3></div><div class="pb"><div class="cus-rm"><span class="av2">${esc(rm.ini)}</span><div><b>${esc(rm.n)}</b><small>Your relationship manager, ${esc(rm.w)} branch. 9:30 to 19:00, Monday to Saturday</small></div></div>
  ${cb ? `<p class="cus-cb">${ic('check')}<span>Call back requested at ${esc(ftime(cb.at))}. ${esc(rm.n.split(' ')[0])} will call you on ${esc(mob91(c))}, usually within 2 working hours.</span></p>` : `<button class="btn btn-s btn-sm cus-cbb" data-act="ccb">${ic('phone')}Request a call back</button>`}
  <p class="cus-n">Not happy with something? Tell us in Messages, or ask ${esc(rm.n.split(' ')[0])} to call you. If we don’t resolve it within 30 days, you can go to the RBI Ombudsman.</p></div></section>`;
  const docsFirst = pend.length > 0 && !qn;
  return `<div class="site-w">${heroH}<div class="site-g"><div class="site-m">${track}${docsFirst ? docs : ''}${chat}</div><aside class="site-s">${loan}${docsFirst ? '' : docs}${help}</aside></div></div>${siteFoot()}`;
}

/* questions from the credit team: the explanation is optional unless the answer is "Something else" */
function qCard(c, m) {
  const Q = QDEF[m.q], s = chkSt(c, { id: m.q }), done = s.st !== 'asked', d = (S.qd || {})[m.q] || {}, needT = d.o === Q.opts.length - 1;
  let body;
  if (done) body = `<div class="qc-a">${ic('check')}<div><b>${s.st === 'confirmed' && s.by === 'the system' ? 'Answered, and settled' : 'Answered'}</b><small>${esc(s.st === 'confirmed' && s.by === 'the system' ? 'We checked your document and closed this question.' : 'Your answer is with the credit team.')}</small></div></div>`;
  else body = `<div class="qc-o" role="radiogroup" aria-label="Choose an answer">${Q.opts.map((o, i) => `<button class="chip${d.o === i ? ' on' : ''}" data-act="qopt" data-v="${m.q}|${i}" role="radio" aria-checked="${d.o === i}">${esc(o)}</button>`).join('')}</div>
    ${d.o != null ? `<label class="qc-l"><span>${needT ? 'Tell us what happened' : 'Anything you would like to add? <small class="opt">Optional</small>'}</span><textarea class="ta" id="qt-${m.q}" data-qt="${m.q}" rows="3" placeholder="In your own words">${esc(d.t || '')}</textarea></label>
    <div class="qc-up">${d.up ? `<span class="att">${ic('file')}${esc(Q.doc.f)}</span>` : d.reading ? `<span class="rd-ing"><span class="spin"></span>Uploading</span>` : `<button class="btn btn-s btn-sm" data-act="qup" data-v="${m.q}">${ic('upload')}Upload ${esc(Q.doc.l)}</button>`}<small>${d.up ? 'Attached' : 'Optional, but it helps'}</small></div>
    <div class="qc-go"><button class="btn btn-p btn-sm" data-act="qsend" data-v="${m.q}"${!needT || (d.t || '').trim() ? '' : ' disabled'} id="qs-${m.q}">${ic('send')}Send my answer</button></div>` : ''}`;
  return `<div class="qc${done ? ' done' : ''}" id="qc-${m.q}"><div class="qc-h">${ic('help')}<span>A question from the credit team</span></div><p class="qc-q">${esc(Q.q)}</p><p class="qc-why">${esc(Q.why)}</p>${body}</div>`;
}
function qAnswer(c, qid, d) {
  const Q = QDEF[qid], at = tick(2), name = c.apps[0].name, opt = Q.opts[d.o], t = (d.t || '').trim();
  if (d.up) { const x = Q.doc; c.docs.push(dk(x.id, x.t, DCAT[x.cat], 'ask', x.f, at, name)); }
  say(c, { f: 'me', t: opt + '.' + (t ? ' ' + t : ''), att: d.up ? Q.doc.f : null, at });
  c.w.log.push({ at, w: who('cus', name, 'Customer'), cat: 'comms', txt: 'Answered a question in the customer’s page', det: '“' + Q.q.split('. ')[0] + '”: ' + opt + '.' + (t ? ' ' + t : '') + (d.up ? ' Attached ' + Q.doc.f + '.' : '') });
  const autoOk = Q.auto && d.o === 0 && d.up;
  if (d.up) c.w.log.push({ at: addMin(at, 1), w: who('sys', 'Document reader', 'Reads and checks'), cat: 'data', txt: 'Read ' + lc1(Q.doc.t), det: Q.read });
  c.w.chk = c.w.chk || {};
  c.w.chk[qid] = autoOk ? { st: 'confirmed', at: addMin(at, 1), by: 'the system', note: Q.read } : { st: 'answered', at, by: name, opt, txt: t, doc: d.up ? Q.doc.id : null, sys: 1 };
  if (autoOk) c.w.log.push({ at: addMin(at, 1), w: who('sys', 'System', 'Checks for a person'), cat: 'decision', txt: 'Check closed by the system: ' + lc1(CHECKS[c.id].find(k => k.id === qid).t), det: Q.read });
  const left = Object.keys(QDEF).filter(k => CHECKS[c.id].some(x => x.id === k) && chkSt(c, { id: k }).st === 'asked').length;
  return { autoOk, left };
}

/* ---------------- the customer website: offer acceptance, letter and KFS ---------------- */
function cusSheet() {
  if (!S.sheet || !['cacc', 'ckfs'].includes(S.sheet.k)) return '';
  const c = cusCase(); if (!c) return '';
  const x = `<button class="nic cx" data-act="shclose" aria-label="Close">${ic('x')}</button>`;
  if (S.sheet.k === 'ckfs') {
    E = fullEval(c); const t = S.sheet.t || 'letter';
    return `<div class="scrim" data-act="shclose"></div><div class="cmod wide" role="dialog" aria-modal="true" aria-label="Sanction letter and Key Facts Statement"><div class="cmod-h"><div class="seg2" role="group" aria-label="Document">${[['letter', 'Sanction letter'], ['kfs', 'Key Facts Statement']].map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="ckfst" data-v="${k}" aria-pressed="${t === k}">${l}</button>`).join('')}</div><span class="nav-sp"></span>${S.sheet.back ? `<button class="btn btn-p btn-sm" data-act="cacc">${ic('check')}Back to accepting</button>` : ''}<button class="btn btn-s btn-sm" data-act="print">${ic('print')}Print or save as PDF</button>${x}</div><div class="cmod-b doc-b">${t === 'letter' ? sanLetter(c, false) : kfsDoc(c, false)}</div></div>`;
  }
  const o = lastOffer(c); if (!o) return '';
  const n = offerNums(c, o), v = (S.otpv || {}).acc || '', ok = v.length === 6 && S.sheet.k1;
  const rows = [['Loan', lakh(o.loan)], ['Tenure', yrsTxt(o.tenure)], ['Interest rate', o.roi.toFixed(2) + '% a year, floating'], ['EMI', inr(n.emi)], ['Processing fee', inr(n.pf) + (o.pfw ? ', ' + o.pfw + '% waived' : '')], ['Offer', 'Version ' + o.v + ', valid until ' + fdate(addDays(sanDate(c), LENDER.validity))]];
  return `<div class="scrim" data-act="shclose"></div><div class="cmod" role="dialog" aria-modal="true" aria-labelledby="caccT"><div class="cmod-h"><h2 id="caccT">Accept your offer</h2><span class="nav-sp"></span>${x}</div>
  <div class="cmod-b"><dl class="acc-d">${rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
  <p class="acc-r">${ic('file')}<button class="lnk" data-act="ckfs" data-v="back">Read the sanction letter and the Key Facts Statement</button></p>
  <label class="acc-k"><input type="checkbox" data-act="cacck"${S.sheet.k1 ? ' checked' : ''}><span>I have read the sanction letter and the Key Facts Statement, and I accept this offer.</span></label>
  <div class="acc-o"><span>Enter the OTP we sent to <b>${esc(mob91(c))}</b></span>${otpBoxes('acc', v, false)}</div></div>
  <div class="cmod-f"><button class="btn btn-s" data-act="shclose">Cancel</button><button class="btn btn-p" data-act="caccgo" id="otpGo-acc"${ok ? '' : ' disabled'}>${ic('check')}Accept the offer</button></div></div>`;
}

/* ---------------- customer actions ---------------- */
const _cacc8 = ACT.cacc, _qsend8 = ACT.qsend;
Object.assign(ACT, {
  csisend() { const c = cusCase(); S.csi = { id: c.id, step: 'otp', sentAt: Date.now() }; S.otpv = Object.assign(S.otpv || {}, { si: '' }); render(); },
  csiback() { S.csi = null; render(); },
  csiverify() { const c = cusCase(), v = (S.otpv || {}).si || ''; if (v.length !== 6) return; S.csign = S.csign || {}; S.csign[c.id] = 1; S.csi = null; S.otpv.si = ''; render(); const f = $('#full'); if (f) f.scrollTop = 0; },
  csignout() { const c = cusCase(); if (S.csign) S.csign[c.id] = 0; S.menu = false; S.csi = null; S.sheet = null; render(); },
  cgoto(v) {
    if (v === 'top') { const f = $('#full'); if (f && f.scrollHeight > f.clientHeight + 2) f.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = v === 'q' ? document.querySelector('.qc:not(.done)') : v === 'offer' ? [...document.querySelectorAll('.ofr')].pop() : $({ docs: '#cus-docs', chat: '#cus-chat', help: '#cus-help' }[v] || '#cus-chat');
    if (el) el.scrollIntoView({ block: v === 'q' || v === 'offer' ? 'center' : 'start', behavior: 'smooth' });
  },
  cacc() { const c = cusCase(), o = lastOffer(c); if (!o) { _cacc8(); return; } if (o.st !== 'sent' || (c.w.san && c.w.san.accepted)) return; const k1 = S.sheet && S.sheet.k1; S.sheet = { k: 'cacc', k1 }; S.otpv = Object.assign(S.otpv || {}, { acc: '' }); render(); const b = document.querySelector('.otp6[data-g="acc"] .otp-b'); if (b) b.focus(); },
  cacck() { if (!S.sheet) return; S.sheet.k1 = !S.sheet.k1; const b = $('#otpGo-acc'); if (b) b.disabled = !(S.sheet.k1 && ((S.otpv || {}).acc || '').length === 6); },
  caccgo() { if (!S.sheet || !S.sheet.k1 || ((S.otpv || {}).acc || '').length !== 6) return; S.sheet = null; S.otpv.acc = ''; _cacc8(); },
  ckfs(v) { S.sheet = { k: 'ckfs', t: 'letter', back: v === 'back' || (S.sheet && S.sheet.k === 'cacc') ? 1 : 0, k1: S.sheet && S.sheet.k1 }; render(); },
  ckfst(v) { if (S.sheet) { S.sheet.t = v; render(); } },
  ccb() { const c = cusCase(); if (c.w.cb) return; const at = tick(1), rm = rmOf(c); c.w.cb = { at }; c.w.log.push({ at, w: who('cus', c.apps[0].name, 'Customer'), cat: 'comms', txt: 'Asked for a call back, from the customer’s page', det: 'For ' + rm.n + ', on ' + c.apps[0].mobile + '.' }); render(); },
  qsend(v) {
    const c = cusCase(), d = (S.qd || {})[v], Q = QDEF[v]; if (!c || !d || d.o == null) return;
    if (d.o === Q.opts.length - 1 && !(d.t || '').trim()) return;
    const r = qAnswer(c, v, d); delete S.qd[v]; S.ctyping = true; render();
    setTimeout(() => {
      S.ctyping = false;
      say(c, { f: 'bot', t: r.autoOk ? 'Thank you. ' + cap1(Q.doc.l) + ' matches the amount and the date, so that one is settled.' + (r.left ? ' One more question is waiting above.' : '') : 'Thank you, ' + fn7(c) + '. Your answer' + (d.up ? ' and ' + Q.doc.l : '') + ' are with ' + AUTH.L1.name + ', your credit manager.' + (r.left ? ' One more question is waiting above.' : ' You will hear from us within a working day, here and on WhatsApp.') });
      render(); toast(r.left ? 'Answer sent. ' + plural(r.left, 'question') + ' left' : 'Answers sent to the credit team');
    }, 650);
  }
});
/* OTP boxes: one digit each, move along as you type, paste a whole code */
function otpSync(g) {
  const bx = [...document.querySelectorAll('.otp6[data-g="' + g + '"] .otp-b')], v = bx.map(b => b.value).join('');
  S.otpv = S.otpv || {}; S.otpv[g] = v;
  const go = $('#otpGo-' + g); if (go) go.disabled = !(v.length === 6 && (g !== 'acc' || (S.sheet && S.sheet.k1)));
  return bx;
}



/* ---------------- people and firms outside the lender act on their own ---------------- */
const SOON = { otp: 3500, reply: 6000, report: 2600, gap: 1900, remind: 6500, wa: 6000 };
/* someone typing in a field the screen doesn't keep: wait until they're done before redrawing */
const SAFE_IN = ['bq', 'rq', 'cq', 'prs', 'ocap', 'iktxt'];
function busyTyping() {
  const a = document.activeElement; if (!a || !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.type === 'checkbox') return false;
  if (SAFE_IN.includes(a.id) || a.classList.contains('otp-b')) return false;
  if (a.dataset && (a.dataset.nl || a.dataset.te || a.dataset.tw || a.dataset.qt)) return false;
  return true;
}
let BG = false;
function later(ms, fn) {
  const run = () => { if (busyTyping()) { setTimeout(run, 800); return; } BG = true; try { fn(); } catch (e) { console.error(e); } finally { BG = false; } };
  setTimeout(run, ms);
}
/* staff notices from things happening in the background never show on the customer's website */
const _toast8 = toast;
toast = function (t) { if (BG && S.view === 'cust') return; _toast8(t); };
const _persona8 = ACT.persona;
ACT.persona = function (v) { const te = $('#toast'); if (te) te.classList.remove('show'); _persona8(v); };
/* what a file waits for, once each */
function needsTxt(ev) { return [...new Set(ev.needs.map(r => r.v.replace('Waiting for ', '').replace('the valuation report', 'the valuation')))]; }
/* letters carry the lender's mark */
function lhHTML(ref, date) { return `<div class="lh"><span class="lh-mark">${SLOGO}</span><div><b>${esc(LENDER.name)}</b><small>${esc(LENDER.reg)}</small><small>${esc(LENDER.addr)}. ${esc(LENDER.web)}</small></div><div class="ref">${esc(ref)}<br>${esc(date)}</div></div>`; }
const portalCus = c => ['N1', 'G'].includes(c.id) && cusOk(c.id);
const first8 = c => c.apps[0].name.split(' ')[0];
const mask10 = m => m.slice(0, 2) + 'XXXXX' + m.slice(7);

/* consent: the customer approves the SMS with an OTP */
function consentGiven(c) {
  if (!c.lead || c.lead.consent) return;
  c.lead.consent = { at: tick(2), ch: 'OTP', wa: 1 }; if (S.otp === c.id) S.otp = null;
  log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Consent given by OTP', 'Credit report and bank data. Opted in to updates on WhatsApp. Privacy notice version 3.2.');
  render(); toast(first8(c) + ' gave consent by OTP'); afterDocs(c);
}
const _consent8 = ACT.consent, _nlcons8 = ACT.nlcons, _nlotp8 = ACT.nlotp;
ACT.consent = function () { const c = C(); _consent8(); later(SOON.otp, () => { if (S.otp === c.id) consentGiven(c); }); };
ACT.nlcons = function () {
  const N = S.nl; if (!N) return; const m = nlVal('a1mob').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  if (nlVal('a1mob') && !/^[6-9]\d{9}$/.test(m) && !/X/.test(nlVal('a1mob'))) { N.bad = ['a1mob']; render(); toast('Enter a 10-digit mobile number'); return; }
  _nlcons8(); if (N.cons && !N.cons.at) later(SOON.otp, () => { if (S.nl === N && N.cons && !N.cons.at) { _nlotp8(); } });
};
ACT.nlotp = function () { };

/* vendor reports: ordered when the documents are in, back a few seconds later */
const _initCases8 = initCases;
initCases = function () { _initCases8(); CASES.forEach(c => c.tasks.forEach(t => { if (t.st === 'assigned') t.hold = 1; })); };
function sweep8() {
  return; /* v9: reports come in when someone checks for them, not on their own */
  CASES.forEach(c => {
    const T = c.tasks.filter(t => t.st === 'assigned' && !t.hold && !t.sched); if (!T.length) return;
    const b = filled(c);
    T.forEach((t, i) => { t.sched = 1; later(SOON.report + i * SOON.gap, () => reportIn(c, t, b, true)); });
  });
}
function reportIn(c, t, b, batch) {
  if (t.st !== 'assigned') return;
  readReport(c, t);
  if (batch && c.tasks.some(x => x.st === 'assigned' && !x.hold)) { render(); return; }
  if (S.view === 'case' && C() === c) { afterReports(c, b); return; }
  const auto = settle(c); markFresh(c, b); render();
  toast(caseName(c) + (auto ? ': all reports in and every rule met, so the system sanctioned it' : ': ' + lc1(t.t) + ' report in'));
}
const _render8 = render;
render = function () { sweep8(); _render8(); };
const _tkrem8 = ACT.tkrem, _reasgo8 = ACT.reasgo;
ACT.tkrem = function (v) { _tkrem8(v); };
ACT.reasgo = function () { _reasgo8(); };

/* a check the credit manager asks the customer about: the reply comes back by itself */
const _chkdo8 = ACT.chkdo;
ACT.chkdo = function (v) {
  const [id, act] = String(v).split('|'), c = C(); _chkdo8(v);
  if (act !== 'asked') return;
  const k = (CHECKS[c.id] || []).find(x => x.id === id); if (!k) return;
  later(SOON.reply, () => {
    const s = c.w.chk && c.w.chk[id]; if (!s || s.st !== 'asked' || s.sys) return;
    c.w.chk[id] = { st: 'confirmed', at: tick(25), by: 'the system', note: 'the customer sent ' + lc1(k.ask) + ', and it matches' };
    log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Sent ' + lc1(k.ask), 'Read by the system: it matches.');
    render(); toast(first8(c) + ' replied. The system read it and closed the check');
  });
};

/* a lead's WhatsApp reply */
const _wasend8 = ACT.wasend;
ACT.wasend = function (id) { _wasend8(id); const x = lget(id); if (x && x.waReply && !x.replied) later(SOON.wa, () => { if (!x.replied) ACT.lreply(id); }); };

/* acceptance of the offer: on the customer's page, or by OTP from the link in the email */
function accBtn(c, ro) {
  const san = c.w.san || {}; if (!san.sent || san.accepted || ro) return '';
  return san.rem ? `<span class="when">Reminded ${esc(ftime(san.rem))}</span>` : `<button class="btn btn-s btn-sm" data-act="sanrem">${ic('bell')}Send a reminder</button>`;
}
function accepted8(c) {
  const san = c.w.san; if (!san || !san.sent || san.accepted) return;
  san.accepted = tick(20); const o = lastOffer(c);
  if (o && o.st === 'sent') { o.st = 'accepted'; o.accAt = san.accepted; (c.w.neg || []).forEach(r => { if (r.st === 'open') { r.st = 'closed'; r.res = 'The customer accepted version ' + o.v; } }); }
  log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Sanction and KFS accepted', 'OTP on the registered mobile.');
  render(); toast(caseName(c) + ' accepted the offer');
}
ACT.sanrem = function () {
  const c = C(), san = c.w.san || {}; if (!san.sent || san.accepted || san.rem) return;
  san.rem = tick(1); const pc = portalCus(c);
  log(c, meW(), 'comms', 'Reminder sent to accept the offer', pc ? 'On WhatsApp, with a link to the customer’s page.' : 'By SMS and email, with the link to accept with an OTP.');
  if (pc) say(c, { f: 'bot', t: 'A reminder: your home loan offer is waiting for you. Accept it with an OTP, or ask for a change here.', wa: 1 });
  else later(SOON.remind, () => accepted8(c));
  render(); toast('Reminder sent to ' + first8(c));
};

/* ---------------- policy changes: the head of credit policy approves ---------------- */
const _pchk8 = ACT.pchk, _psubmit8 = ACT.psubmit;
Object.assign(ACT, {
  psubmit() { S.pback = null; _psubmit8(); },
  pchk() { if (S.role !== 'hcp') return; _pchk8(); },
  pback() { if (S.role !== 'hcp' || !S.ppend) return; S.ppend = null; S.pback = tick(1); render(); toast('Sent back to ' + PEOPLE.maker.name); }
});

/* ---------------- new leads after the first ---------------- */
const _newlead8 = ACT.newlead, _mklead8 = ACT.mklead;
ACT.newlead = function () { const c = nlCase(); if (c && c.lead.hidden) { _newlead8(); return; } S.nl = nlInit(); S.nl.extra = 1; S.sheet = { k: 'lead' }; render(); };
ACT.mklead = function () {
  const N = S.nl;
  const mob = N ? nlVal('a1mob').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '') : '';
  if (N && nlVal('a1mob') && !/X/.test(nlVal('a1mob')) && !/^[6-9]\d{9}$/.test(mob)) { N.bad = ['a1mob']; render(); toast('Enter a 10-digit mobile number'); return; }
  if (!N || !N.extra) {
    const c = nlCase(), was = c.apps[0].mobile, pend = !!(N && N.cons && !N.cons.at); _mklead8();
    if (/^[6-9]\d{9}$/.test(mob) && !c.lead.hidden) c.apps[0].mobile = mask10(mob);
    if (pend && !c.lead.hidden && !c.lead.consent) { S.otp = c.id; later(SOON.otp, () => { if (S.otp === c.id) consentGiven(c); }); }
    if (was !== c.apps[0].mobile || pend) render(); return;
  }
  const need = ['a1n', 'a1mob', 'loan', 'ten', 'a1inc'], miss = need.filter(k => !nlVal(k));
  if (miss.length) { N.bad = miss; render(); toast('Add ' + listAnd(miss.map(k => lc1(nlLabel(k))))); return; }
  const at = tick(1), n = LL.filter(z => /^LN/.test(z.id)).length + 1, loan = Math.round(nlNum(nlVal('loan'))), ten = Math.min(30, Math.max(5, Math.round(nlNum(nlVal('ten'))) || 20)), name = nlVal('a1n');
  const x = { id: 'LN' + n, no: 'LD-2611-05' + String(10 + n), name, city: nlVal('city') || 'Pune', lang: 'English', seg: loan < 2500000 ? 'affordable' : 'prime', variant: 'resale', ask: loan || 3000000, ten: ten * 12, emp: 'Salaried', inc: Math.round(nlNum(nlVal('a1inc'))) || 50000, obl: 0, prop: nlVal('price') || nlVal('prop') ? 'identified' : 'searching', propTxt: nlVal('prop') || (nlVal('price') ? 'Property identified' : 'Property not chosen yet'),
    src: { t: 'Branch', n: 'Walked into the branch' }, owner: 'amit', rule: 'r5', created: at, stage: 'consent',
    ev: [{ at, t: 'Met ' + SALES.name + ' at the branch', p: 30 }, { at, t: 'Consent link sent by SMS and WhatsApp', p: 0 }], att: [], con: { inq: at, via: 'the branch', wa: true, link: at } };
  LL.unshift(x); S.sheet = null; S.nl = null; S.bf = 'all'; S.lf = null; S.pg = 0; render(); toast('Lead created. ' + name.split(' ')[0] + ' has the link for consent and documents');
};

/* one redraw at a time: a field that loses focus while the screen redraws can ask for another */
const _render8b = render; let RIN = false, RPEND = false;
render = function () { if (RIN) { RPEND = true; return; } RIN = true; try { _render8b(); } finally { RIN = false; } if (RPEND) { RPEND = false; render(); } };

/* start-up runs at the end of the last layer (23_r9.js) */

/* =====================================================================
   v9: LOS and CRM as two landing pages, a one-screen New lead panel that
   ends in a consent request, and reports that come in when someone checks.
   ===================================================================== */

/* ---------------- navigation ---------------- */
const _go9 = ACT.go, _open9 = ACT.open;
ACT.go = function (v) {
  if (v === 'los') { S.view = 'los'; S.sheet = null; S.edit = null; S.menu = false; render(); const f = $('#full'); if (f) f.scrollTop = 0; return; }
  _go9(v);
};
ACT.open = function (v) { if (S.view === 'los' || S.view === 'board') S.from8 = S.view; _open9(v); };

/* ---------------- LOS: every file after login ---------------- */
const LOSC = [['all', 'Logins', 't-b'], ['san', 'Sanctioned', 't-ok'], ['rej', 'Rejected', 't-err'], ['wip', 'Work in progress', 't-warn'], ['disb', 'Disbursed', 't-info']];
const LOSORD = { wip: 0, san: 1, disb: 2, rej: 3 };
function losRows() {
  const R = CASES.map((c, i) => ({ c, i, ev: fullEval(c) })).filter(r => !r.c.lead || (r.c.lead.in && !r.c.lead.hidden));
  R.forEach(r => { r.me = needsMe2(r.c, r.ev); r.b = bk2(r.c, r.ev.st); r.t = tatOf(r.c, r.ev); const k = r.ev.st.k; r.k = r.c.w.disb ? 'disb' : k === 'approved' ? 'san' : k === 'declined' ? 'rej' : 'wip'; });
  return R;
}
const askAmt = c => (c.v.applied && c.v.applied.loan) || c.v.loan;
function crTxt(n) { if (!n) return RS + '0'; return n >= 1e7 ? RS + trimz((n / 1e7).toFixed(2)) + ' Cr' : RS + trimz((n / 1e5).toFixed(2)) + ' lakh'; }
function losHTML() {
  const R = losRows(), f = LOSC.some(x => x[0] === S.losf) ? S.losf : 'all', q = (S.lq || '').trim().toLowerCase();
  const of = k => k === 'all' ? R : R.filter(r => r.k === k);
  const sum = (L, k) => L.reduce((a, r) => a + (k === 'all' || k === 'rej' ? askAmt(r.c) : r.c.v.loan), 0);
  const tiles = `<div class="los-t">${LOSC.map(([k, l, tone]) => { const L = of(k), on = f === k; return `<button class="los-c ${tone}${on ? ' on' : ''}" data-act="losf" data-v="${k}" aria-pressed="${on}"><span class="los-l">${esc(l)}</span><b>${L.length.toLocaleString('en-IN')}</b><small>${esc(crTxt(sum(L, k)))}</small></button>`; }).join('')}</div>`;
  let L = of(f);
  if (q) L = L.filter(r => [caseName(r.c), r.c.v.appNo, r.c.v.branch, holder(r.c, r.ev).n].join(' ').toLowerCase().includes(q));
  L.sort((a, b) => (b.me - a.me) || (LOSORD[a.k] - LOSORD[b.k]) || (b.t.n - a.t.n));
  const hd = ['Applicant', 'Loan', 'Stage', 'Waiting on', 'Recommendation', 'With', 'Turnaround'];
  const title = f === 'all' ? 'All files after login' : LOSC.find(x => x[0] === f)[1];
  return `${tiles}<div class="bk pl los-l2"><div class="pl-top"><div class="los-h"><b>${esc(title)}</b><span class="cnt">${L.length}</span>${f !== 'all' ? `<button class="lnk" data-act="losf" data-v="all">Show all</button>` : ''}</div><input class="srch" id="lq" type="search" placeholder="Search name, application number, branch or person" value="${esc(S.lq || '')}" aria-label="Search files"></div>
  <div class="pl-row hd" role="presentation">${hd.map(h => `<span>${h}</span>`).join('')}</div>
  ${L.length ? L.map(plRow).join('') : `<div class="bk-empty">${f === 'disb' ? 'No file has been disbursed yet.' : 'Nothing here.'}${f !== 'all' || q ? ' <button class="lnk" data-act="losf" data-v="all">Show all</button>' : ''}</div>`}</div>`;
}
ACT.losf = function (v) { S.losf = v; if (v === 'all') S.lq = ''; render(); };
SAFE_IN.push('lq');


/* ---------------- reports come in when someone checks ---------------- */
ACT.chkrep = function () {
  const c = C(); if (S.chk8) return;
  const T = c.tasks.filter(t => t.st === 'assigned'); if (!T.length) { toast('No reports are waiting'); return; }
  const b = filled(c); S.chk8 = c.id; render();
  T.forEach((t, k) => later(900 + k * 450, () => {
    if (t.st === 'assigned') readReport(c, t);
    if (k < T.length - 1) { render(); return; }
    S.chk8 = null;
    if (S.view === 'case' && C() === c) { afterReports(c, b); return; }
    const auto = settle(c); markFresh(c, b); render();
    toast(caseName(c) + (auto ? ': every report is in and every rule met, so the system sanctioned it' : ': ' + plural(T.length, 'report') + ' in'));
  }));
};

/* ---------------- New lead: one applicant, one screen, ends in a consent request ---------------- */
const NLBR = ['Pune', 'Mumbai', 'Thane', 'Nashik', 'Nagpur', 'Aurangabad', 'Jaipur', 'Kochi', 'Bengaluru', 'Hyderabad'];
const NLLT = ['Home loan', 'Home construction', 'Plot and construction', 'Home improvement', 'Balance transfer', 'Balance transfer with top-up', 'Loan against property'];
const NLAT = ['Individual', 'Company or firm'];
const NLPT = ['Flat or apartment', 'Independent house or villa', 'Row house', 'Residential plot', 'Commercial property', 'Mixed-use property'];
const NLF9 = [['a1n', 'Name'], ['a1mob', 'Contact number', 'tel'], ['atype', 'Type of applicant', NLAT], ['a1pan', 'PAN'], ['a1inc', 'Monthly pay (₹)', 'num'],
  ['ltype', 'Type of loan', NLLT], ['loan', 'Loan amount (₹)', 'num'], ['ten', 'Tenure (years)', 'num'], ['ptype', 'Property type', NLPT], ['price', 'Property value (₹)', 'num'], ['city', 'Branch city', NLBR]];
const NLV9 = { a1n: 'Sameer Joshi', a1pan: 'BQJPJ6612C', a1inc: '1,24,000' };
const NLD9 = {
  ind: [{ id: 'adh_a1', t: 'Aadhaar', s: 'Masked copy', f: ['a1n'], src: 'Aadhaar', conf: 98 }, { id: 'pan_a1', t: 'PAN', s: 'Card or e-PAN', f: ['a1n', 'a1pan'], src: 'PAN', conf: 99 }, { id: 'sal_a1', t: 'Salary slips', s: 'Last 3 months', f: ['a1inc'], src: 'salary slips', conf: 97 }],
  co: [{ id: 'cpan', t: 'Company PAN', s: 'Of the company or firm', f: [] }, { id: 'coi', t: 'Certificate of incorporation', s: 'Or the partnership deed', f: [] }, { id: 'itr', t: 'Latest ITR', s: 'With the computation of income', f: [] }]
};
const isCo = () => nlVal('atype') === 'Company or firm';
const nlDocs9 = () => isCo() ? NLD9.co : NLD9.ind;
const nlFills = () => S.nl && !S.nl.extra && !isCo() && nlCase().lead.hidden;
function nlInit9(extra) { return { f: { atype: { v: 'Individual', src: 'typed' }, ltype: { v: 'Home loan', src: 'typed' }, city: { v: 'Pune', src: 'typed' } }, docs: {}, cons: null, reading: null, bad: [], extra: !!extra }; }
const nlLab9 = k => ({ a1n: isCo() ? 'Name of the company or firm' : 'Name', a1inc: isCo() ? 'Monthly income (₹)' : 'Monthly pay (₹)' })[k] || (NLF9.find(x => x[0] === k) || [k, k])[1];
function nlSheet() {
  if (!S.sheet || S.sheet.k !== 'lead') return '';
  if (!S.nl) S.nl = nlInit9(!nlCase().lead.hidden);
  const N = S.nl, lock = !!N.cons, D = nlDocs9(), nDone = D.filter(d => N.docs[d.id]).length, nm = (nlVal('a1n') || (isCo() ? 'the company' : 'the customer')).split(' ')[0];
  const fld = ([k, , kind]) => {
    const x = N.f[k] || {}, bad = N.bad.includes(k), src = x.src && x.src !== 'typed' && x.v, l = nlLab9(k);
    const lbl = `<span class="nl-l">${esc(l)}${k === 'a1mob' ? '<i class="req" aria-hidden="true">*</i>' : ''}${src ? `<span class="nl-src" title="${esc('Read from the ' + x.src + ' with ' + x.conf + '% confidence')}">${ic('file')}${esc(x.src)}</span>` : ''}</span>`;
    const ctl = Array.isArray(kind)
      ? `<select class="inp2" data-nl="${k}"${lock ? ' disabled' : ''} aria-label="${esc(l)}">${k === 'ptype' ? `<option value=""${x.v ? '' : ' selected'}>Choose</option>` : ''}${kind.map(o => `<option${(x.v || '') === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`
      : `<input class="inp2" data-nl="${k}" value="${esc(x.v || '')}"${kind === 'tel' ? ' inputmode="tel" autocomplete="off" placeholder="10-digit mobile"' : kind === 'num' ? ' inputmode="numeric"' : ''}${lock || N.reading ? ' readonly' : ''}${k === 'a1mob' ? ' aria-required="true"' : ''} aria-label="${esc(l)}">`;
    return `<label class="nl9-f${k === 'a1n' ? ' w2' : ''}${bad ? ' bad' : ''}${x.fresh ? ' fresh' : ''}">${lbl}${ctl}</label>`;
  };
  const doc = d => { const s = N.docs[d.id], rd = N.reading === d.id; return `<div class="nl9-d${s ? ' ok' : ''}">${ic(s ? 'check' : 'file')}<div><b>${esc(d.t)}</b><small>${rd ? 'Reading' : s ? (s.n ? 'Read: ' + plural(s.n, 'detail') + ' filled in' : 'Attached') : esc(d.s)}</small></div>${rd ? '<span class="spin"></span>' : s ? '' : `<button class="btn btn-s btn-sm" data-act="nlup" data-v="${d.id}"${N.reading || lock ? ' disabled' : ''}>${ic('upload')}Upload</button>`}</div>`; };
  const cons = lock
    ? `<div class="nl9-c wait"><span class="spin"></span><p><b>Consent requested at ${esc(ftime(N.cons.sent))}.</b> An SMS went to +91 ${esc(mask10(N.cons.mob))}. Waiting for ${esc(nm)} to approve it with the OTP. The lead is created as soon as they do.</p></div>`
    : `<div class="nl9-c">${ic('lock')}<p><b>Credit consent.</b> An SMS asks ${isCo() ? 'the company' : 'the customer'} to approve a credit report pull, which records an enquiry, and 12 months of bank data through the Account Aggregator. WhatsApp updates are optional.</p></div>`;
  const body = `<section class="nl9-s"><div class="nl9-h"><b>${isCo() ? 'Company or firm' : 'Applicant'}</b><span>Only the contact number is needed. Upload the documents and the details fill themselves.</span></div><div class="nl9-g">${NLF9.map(fld).join('')}</div></section>
  <section class="nl9-s"><div class="nl9-h"><b>Documents</b><span>${nDone ? nDone + ' of ' + D.length + ' in' : 'Optional now; the customer can share them later'}</span>${nDone < D.length && !lock ? `<button class="btn btn-g btn-sm" data-act="nlload"${N.reading ? ' disabled' : ''}>${ic('upload')}Upload all</button>` : ''}</div><div class="nl9-ds">${D.map(doc).join('')}</div></section>${cons}`;
  return `<div class="scrim" data-act="shclose"></div><aside class="as open nl9" role="dialog" aria-modal="true" aria-label="New lead"><div class="as-h"><div><b>New lead</b><small>${esc(SALES.name)}, Pune Kothrud branch</small></div><button class="nic" data-act="shclose" aria-label="Close">${ic('x')}</button></div>
  <div class="as-b nl9-b" id="nlb" data-keep="nlb">${body}</div>
  <div class="as-f nl-f2"><span class="nl-hint">${lock ? 'You can close this. The lead appears in the CRM when consent arrives.' : 'The lead is created when the customer approves.'}</span><button class="btn btn-s" data-act="shclose">${lock ? 'Close' : 'Cancel'}</button><button class="btn btn-p" data-act="nlcons"${lock || N.reading ? ' disabled' : ''}>${lock ? '<span class="spin"></span>Waiting for consent' : ic('send') + 'Send consent request'}</button></div></aside>`;
}
function nlRead9(id, done) {
  const N = S.nl, d = nlDocs9().find(x => x.id === id); if (!N || !d || N.docs[id]) { if (done) done(); return; }
  N.reading = id; render();
  setTimeout(() => {
    if (S.nl !== N) return;
    const fill = nlFills(); let n = 0;
    Object.values(N.f).forEach(x => { x.fresh = 0; });
    if (fill) d.f.forEach(k => { const cur = N.f[k]; if (!cur || !cur.v || cur.src !== 'typed') { N.f[k] = { v: NLV9[k], src: d.src, conf: d.conf, fresh: 1 }; n++; } });
    N.docs[id] = { at: tick(1), n }; N.reading = null;
    render(); if (done) done(); else toast(fill ? 'Read the ' + d.src + ': ' + plural(n, 'detail') + ' filled in' : d.t + ' attached');
  }, 650);
}
function nlCreate9(N) {
  const at = N.cons.at, val = k => ((N.f[k] || {}).v || '').trim(), num = k => nlNum(val(k)), co = val('atype') === 'Company or firm';
  const c = nlCase(), toN1 = !N.extra && !co && c.lead.hidden, wasOpen = S.sheet && S.sheet.k === 'lead' && S.nl === N;
  if (wasOpen) { S.sheet = null; S.nl = null; }
  if (toN1) {
    const i = CASES.indexOf(c);
    c.lead.hidden = false; c.lead.created = c.v.login = N.cons.sent;
    const nm = val('a1n'); if (nm && nm !== c.apps[0].name) { c.apps[0].name = nm; c.apps[0].ini = inits(nm); }
    c.apps[0].mobile = mask10(N.cons.mob);
    if (/^[A-Z]{5}\d{4}[A-Z]$/.test(val('a1pan').toUpperCase())) c.apps[0].pan = val('a1pan').toUpperCase();
    if (num('a1inc') >= 1000) c.apps[0].incDecl = Math.round(num('a1inc'));
    if (num('loan') >= 100000) c.v.loan = c.v.applied.loan = Math.round(num('loan'));
    if (num('ten') >= 1 && num('ten') <= 30) c.v.tenure = c.v.applied.tenure = Math.round(num('ten')) * 12;
    if (num('price') >= 100000) c.lead.price = Math.round(num('price'));
    Object.assign(c.lead, { city: val('city') || 'Pune', ltype: val('ltype'), atype: val('atype'), ptype: val('ptype') });
    c.w.log.forEach(e => { if (e.txt === 'Lead created') { e.at = N.cons.sent; e.w = who('ppl', SALES.name, SALES.sub); } });
    const up = NLD9.ind.filter(d => N.docs[d.id]);
    up.forEach(d => { const x = c.docs.find(y => y.id === d.id); if (x) x.up = { f: x.sample, at: N.docs[d.id].at, by: SALES.name }; });
    if (up.length) docxSeed(c.id, docxBridge.describe(c.id), up.map(d => d.id));
    if (up.length) log(c, who('ppl', SALES.name, SALES.sub), 'doc', 'Uploaded ' + plural(up.length, 'document') + ' with the lead', listAnd(up.map(d => lc1(c.docs.find(y => y.id === d.id).t))) + '. Read at once; the details were filled in from them.', { at: N.cons.sent });
    log(c, who('ppl', SALES.name, SALES.sub), 'comms', 'Consent request sent by SMS', 'To ' + c.apps[0].mobile + '. Privacy notice version 3.2.', { at: N.cons.sent });
    c.lead.consent = { at, ch: 'OTP', wa: 1 };
    log(c, who('cus', c.apps[0].name, 'Customer'), 'comms', 'Consent given by OTP', 'Credit report and bank data. Opted in to updates on WhatsApp. Privacy notice version 3.2.', { at });
    const ready = !c.docs.some(d => d.need === 'pre' && !d.up), first = c.apps[0].name.split(' ')[0];
    if (wasOpen) { ACT.open(i); toast(first + ' gave consent. Lead ' + c.v.appNo + ' created' + (ready ? '. The pre-screen is running' : '')); }
    else { render(); toast(first + ' gave consent. Lead ' + c.v.appNo + ' is in the CRM'); }
    if (ready) runPre(c);
    return;
  }
  const n = LL.filter(z => /^LN/.test(z.id)).length + 1, D = co ? NLD9.co : NLD9.ind, inD = D.filter(d => N.docs[d.id]), miss = D.filter(d => !N.docs[d.id]).map(d => lc1(d.t)).concat(co ? ['audited financials for two years', 'the property papers'] : ['the property papers']);
  const name = val('a1n') || '+91 ' + mask10(N.cons.mob), loan = Math.round(num('loan')), price = Math.round(num('price'));
  const x = { id: 'LN' + n, no: 'LD-2611-05' + String(10 + n), name, city: val('city') || 'Pune', lang: 'English', seg: loan && loan < 2500000 ? 'affordable' : 'prime', variant: 'resale', ask: loan || 3000000, ten: (Math.min(30, Math.max(5, Math.round(num('ten')) || 20))) * 12,
    emp: co ? 'Self-employed' : 'Salaried', inc: Math.round(num('a1inc')) || 60000, obl: 0, prop: price || val('ptype') ? 'identified' : 'searching', propTxt: val('ptype') || 'Property not chosen yet',
    src: { t: 'Branch', n: 'Walked into the branch' }, owner: 'amit', rule: 'r5', created: N.cons.sent, stage: 'docs', docs: { in: inD.length, of: inD.length + miss.length, miss: listAnd(miss) },
    ev: [{ at: N.cons.sent, t: 'Met ' + SALES.name + ' at the branch', p: 30 }, { at, t: 'Gave consent for the credit report and bank data', p: 25 }].concat(inD.length ? [{ at: N.cons.sent, t: 'Shared ' + listAnd(inD.map(d => d.t)), p: 15 }] : []),
    att: [], con: { inq: N.cons.sent, via: 'the branch', wa: true, bureau: at, aa: at, link: N.cons.sent }, ltype: val('ltype'), atype: val('atype') };
  LL.unshift(x);
  if (wasOpen) { S.view = 'board'; S.bf = 'all'; S.lf = null; S.pg = 0; }
  render(); toast((val('a1n') || 'The customer').split(' ')[0] + ' gave consent. The lead is in the CRM');
}
Object.assign(ACT, {
  newlead() { if (!S.nl || S.nl.cons) S.nl = nlInit9(!nlCase().lead.hidden); S.sheet = { k: 'lead' }; render(); },
  nlup(v) { if (S.nl && !S.nl.reading && !S.nl.cons) nlRead9(v); },
  nlload() {
    const N = S.nl; if (!N || N.reading || N.cons) return; const q = nlDocs9().filter(d => !N.docs[d.id]).map(d => d.id);
    const nx = () => { const id = q.shift(); if (!id) { const k = nlDocs9().reduce((a, d) => a + ((N.docs[d.id] || {}).n || 0), 0); render(); toast(nlFills() ? plural(nlDocs9().length, 'document') + ' read: ' + plural(k, 'detail') + ' filled in' : plural(nlDocs9().length, 'document') + ' attached'); return; } nlRead9(id, nx); };
    nx();
  },
  nlcons() {
    const N = S.nl; if (!N || N.cons || N.reading) return;
    const raw = nlVal('a1mob'), mob = raw.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!raw) { N.bad = ['a1mob']; render(); toast('Add the contact number'); return; }
    if (!/^[6-9]\d{9}$/.test(mob)) { N.bad = ['a1mob']; render(); toast('Enter a 10-digit mobile number'); return; }
    N.bad = []; N.cons = { sent: tick(1), mob }; render();
    later(SOON.otp, () => { if (N.cons && !N.cons.at) { N.cons.at = tick(2); nlCreate9(N); } });
  },
  mklead() { ACT.nlcons(); }
});



/* =====================================================================
   v10: what waits on whom.
   - The credit manager's LOS page opens with a queue: customers'
     requests, answers to review and decisions due.
   - The sales manager's CRM opens with the stages, counted from the
     list, and "Waiting on your team" cut by stage or by person.
   ===================================================================== */

/* ---------------- the credit manager's queue ---------------- */
const whenTxt = at => sameDay(at, CLK) ? ftime(at) : fds(at), sentWhen = at => sameDay(at, CLK) ? 'at ' + ftime(at) : 'on ' + fds(at);
function cmQueue() {
  const Q = { req: [], ans: [], dec: [] }, seen = S.qseen || {};
  CASES.forEach((c, i) => {
    if (c.lead && (c.lead.hidden || !c.lead.in)) return;
    const ev = fullEval(c), k = ev.st.k, name = caseName(c);
    if (k === 'approved') openReqs(c).forEach(r => Q.req.push({ key: c.id + '.' + r.id, i, tab: 'sanction', to: '.req7', at: r.at, name, t: '“' + r.txt + '”', s: (r.note || '').split(/(?<=\.)\s/)[0], m: whenTxt(r.at) }));
    if (!['review', 'returned'].includes(k)) return;
    const V = visChecks(c), ans = V.filter(x => chkSt(c, x).st === 'answered'), asked = V.filter(x => chkSt(c, x).st === 'asked').length;
    if (ans.length) {
      const a = chkSt(c, ans[0]), at = ans.map(x => chkSt(c, x).at).sort().pop();
      Q.ans.push({ key: c.id + '.ans.' + ans.map(x => x.id).join('.'), i, tab: 'overview', to: '#checks', at, name, t: 'Answered ' + (asked ? ans.length + ' of ' + (ans.length + asked) + ' questions' : plural(ans.length, 'question')), s: a.opt ? '“' + a.opt + '.' + (a.txt ? ' ' + a.txt : '') + '”' : (a.note || ''), m: whenTxt(at) });
      return;
    }
    if (waitingCus(c)) return;
    const oc = V.filter(x => chkSt(c, x).st === 'open').length, rc = recCell(c, ev), t = tatOf(c, ev);
    Q.dec.push({ key: c.id + '.dec', i, tab: 'overview', to: oc ? '#checks' : '#act', at: c.v.login, name, dec: 1, late: t.late, n: t.n,
      t: k === 'returned' ? 'Sent back by ' + byName(ev.st.by) : recShort(recOf(c, ev), c) + (rc.s ? '. ' + rc.s : ''),
      s: (oc ? plural(oc, 'check') + ' to resolve first' : 'No open checks') + (asked ? '. ' + plural(asked, 'answer') + ' awaited' : ''), m: 'Day ' + t.n + ' of ' + t.tgt });
  });
  Q.req.sort((a, b) => a.at < b.at ? 1 : -1); Q.ans.sort((a, b) => a.at < b.at ? 1 : -1); Q.dec.sort((a, b) => (b.late - a.late) || (b.n - a.n));
  Q.fresh = Q.req.concat(Q.ans).filter(x => !seen[x.key]).length;
  return Q;
}
function cmQueueHTML() {
  const Q = cmQueue(), seen = S.qseen || {};
  const item = x => { const nw = !x.dec && !seen[x.key]; return `<button class="cq-i${nw ? ' new' : ''}" data-act="qopen" data-v="${esc(x.key + '~' + x.i + '~' + x.tab + '~' + x.to)}"><span class="cq-t"><b>${esc(x.name)}</b>${nw ? '<span class="cq-new">New</span>' : ''}<span class="cq-m${x.late ? ' late' : ''}">${esc(x.m)}</span></span><span class="cq-q">${esc(x.t)}</span>${x.s ? `<span class="cq-s">${esc(x.s)}</span>` : ''}</button>`; };
  const col = (l, sub, L, none) => `<div class="cq-c"><div class="cq-h"><b>${l}</b><span class="cnt${L.length ? ' w' : ''}">${L.length}</span></div><small class="cq-sub">${sub}</small>${L.length ? L.slice(0, 4).map(item).join('') + (L.length > 4 ? `<p class="cq-more">And ${L.length - 4} more, marked in the list below</p>` : '') : `<p class="cq-none">${none}</p>`}</div>`;
  return `<section class="panel cq" aria-label="Your queue"><div class="ph"><h3>Your queue</h3><span class="note">Waiting on you. Open an item to go straight to it</span></div><div class="pb cq-g">
  ${col('Customer requests', 'From the chat, when the system could not agree on its own', Q.req, 'No requests from customers.')}
  ${col('Answers to review', 'Customers’ answers to the credit team’s questions', Q.ans, 'No answers waiting.')}
  ${col('Decisions due', 'Every report is in, and the next step is yours', Q.dec, 'No decisions due.')}</div></section>`;
}
const _los10 = losHTML;
losHTML = function () { return (S.role === 'cm' ? cmQueueHTML() : '') + _los10(); };
/* the LOS tab shows how many new items wait in the queue */
const _nav10 = navHTML;
navHTML = function () {
  const h = _nav10(); if (S.role !== 'cm' || !['los', 'board'].includes(S.view)) return h;
  const n = cmQueue().fresh; if (!n) return h;
  return h.replace('aria-label="LOS">', 'aria-label="LOS, ' + n + ' new in your queue">').replace('<span class="ntl">LOS</span>', '<span class="ntl">LOS</span><span class="nbdg">' + n + '</span>');
};
ACT.qopen = function (v) {
  const [key, i, tab, to] = String(v).split('~'); S.qseen = S.qseen || {}; S.qseen[key] = 1;
  ACT.open(+i);
  if (tab && S.tab !== tab) { S.tab = tab; render(); }
  setTimeout(() => { const el = to && document.querySelector(to); if (!el) return; el.scrollIntoView({ block: 'start', behavior: 'smooth' }); el.classList.add('flash10'); setTimeout(() => el.classList.remove('flash10'), 1900); }, 60);
};

/* ---------------- the sales manager: the stages, counted from the list ---------------- */
const CRMC = [['leads', 'Leads', 't-l'], ['all', 'Logins', 't-b'], ['san', 'Sanctioned', 't-ok'], ['rej', 'Rejected', 't-err'], ['disb', 'Disbursed', 't-info']];
function smTilesHTML() {
  const R = losRows(), vis = CASES.filter(c => !(c.lead && c.lead.hidden)), all = vis.length + LL.length, pre = vis.filter(c => c.lead && !c.lead.in).length + LL.length;
  const of = k => k === 'all' ? R : R.filter(r => r.k === k), sum = (L, k) => L.reduce((a, r) => a + (k === 'all' || k === 'rej' ? askAmt(r.c) : r.c.v.loan), 0);
  return `<div class="los-t crm-t">${CRMC.map(([k, l, tone]) => { const L = k === 'leads' ? null : of(k); return `<button class="los-c ${tone}" data-act="crmt" data-v="${k}" title="${k === 'leads' ? 'Go to every lead and file' : 'See these files on the LOS page'}"><span class="los-l">${l}</span><b>${(L ? L.length : all).toLocaleString('en-IN')}</b><small>${esc(L ? crTxt(sum(L, k)) : pre + ' before login')}</small></button>`; }).join('')}</div>`;
}
ACT.crmt = function (v) {
  if (v === 'leads') { S.bf = 'all'; S.lf = null; S.pg = 0; S.bq = ''; render(); const el = $('#lt'); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
  S.losf = v; S.lq = ''; ACT.go('los');
};
const _mgr10 = mgrDash;
mgrDash = function (L) { return smTilesHTML() + _mgr10(L); };

/* ---------------- waiting on your team: by stage, or by person ---------------- */
const WOT10 = [
  ['lead', 'Lead', 'Before login', [['cons', 'Consent pending'], ['pdoc', 'Documents pending'], ['pre', 'Pre-screen done, next step pending']]],
  ['login', 'Login', 'Logged in, not yet sanctioned', [['cdoc', 'Customer documents pending'], ['prop', 'Property documents pending'], ['ans', 'Answers to credit’s questions pending']]],
  ['san', 'Sanction', 'Sanctioned, offer not accepted', [['sign', 'Signed sanction letter pending'], ['rev', 'Revised offer not accepted']]],
  ['disb', 'Disbursement', 'Accepted, before the first disbursement', [['cp', 'Pre-disbursement documents pending'], ['ins', 'Property insurance pending']]]
];
const wsLbl = x => WOT10.find(s => s[0] === x.st)[3].find(g => g[0] === x.sub)[1];
const wfk = x => x.live != null ? 'c' + x.live : 'l' + x.lead;
const moreTxt = (L, n) => listAnd(L.slice(0, n).map(d => lc1(d.t))) + (L.length > n ? ', and ' + (L.length - n) + ' more' : '');
function wotItems() {
  const R = [], add = o => R.push(Object.assign({ d: Math.max(0, Math.round((CLK - P(o.at)) / 86400000)) }, o));
  LL.forEach(x => {
    if (!x.owner || !TEAM[x.owner]) return;
    const base = { own: x.owner, name: x.name, no: x.no, amt: x.ask, lead: x.id, live: null };
    if (x.stage === 'consent') { const op = (x.ev || []).some(e => /opened the consent link/i.test(e.t)); add(Object.assign({ id: x.id + '|cons', st: 'lead', sub: 'cons', at: (x.con && x.con.link) || x.created, what: 'Consent link sent ' + sentWhen((x.con && x.con.link) || x.created) + (op ? '. Opened, not finished' : '. Not opened yet') }, base)); }
    if (x.stage === 'docs') add(Object.assign({ id: x.id + '|pdoc', st: 'lead', sub: 'pdoc', at: (x.con && (x.con.bureau || x.con.link)) || x.created, what: x.docs ? cap1(plural(x.docs.of - x.docs.in, 'document')) + ': ' + x.docs.miss : 'Documents for the pre-screen' }, base));
  });
  CASES.forEach((c, i) => {
    if (c.lead && c.lead.hidden) return;
    const ev = fullEval(c), k = ev.st.k, L = c.lead, base = { own: ownKey(c), name: caseName(c), no: c.v.appNo, amt: c.v.loan, live: i, lead: null };
    if (k === 'lead') {
      const pre = c.docs.filter(d => d.need === 'pre' && !d.up);
      if (!L.consent) add(Object.assign({ id: c.id + '|cons', st: 'lead', sub: 'cons', at: L.created, what: 'Consent request sent, not given yet' }, base));
      else if (pre.length) add(Object.assign({ id: c.id + '|pdoc', st: 'lead', sub: 'pdoc', at: L.consent.at, what: cap1(plural(pre.length, 'document')) + ': ' + moreTxt(pre, 2) }, base));
    }
    if (k === 'prescreen') { const w = waitOn(c, ev); add(Object.assign({ id: c.id + '|pre', st: 'lead', sub: 'pre', at: (L.pre && L.pre.at) || (L.consent && L.consent.at) || L.created, what: cap1(w.t.replace(/^Sales to /, '')) + ': ' + lc1(w.s) }, base)); }
    if (k === 'docs') {
      const m = loginMissing(c), pm = m.filter(d => d.cat === 'Property'), cm = m.filter(d => d.cat !== 'Property');
      if (cm.length) add(Object.assign({ id: c.id + '|cdoc', st: 'login', sub: 'cdoc', at: c.v.login, what: cap1(plural(cm.length, 'document')) + ': ' + moreTxt(cm, 2) }, base));
      if (pm.length) add(Object.assign({ id: c.id + '|prop', st: 'login', sub: 'prop', at: c.v.login, what: cap1(plural(pm.length, 'document')) + ': ' + moreTxt(pm, 2) }, base));
    }
    if (['review', 'returned'].includes(k) && waitingCus(c)) { const q = sysAsked(c); add(Object.assign({ id: c.id + '|ans', st: 'login', sub: 'ans', at: chkSt(c, q[0]).at, what: cap1(plural(q.length, 'question')) + ' asked ' + sentWhen(chkSt(c, q[0]).at) + ', in the customer’s page and on WhatsApp' }, base)); }
    if (k === 'approved') {
      const san = c.w.san || {}, o = lastOffer(c);
      if (!san.accepted && o && o.st === 'sent') add(Object.assign({ id: c.id + '|' + (o.v > 1 ? 'rev' : 'sign') + o.v, st: 'san', sub: o.v > 1 ? 'rev' : 'sign', at: o.at, what: (o.v > 1 ? 'Version ' + o.v + ' sent ' : 'Offer sent ') + sentWhen(o.at) + '. ' + lakh(o.loan) + ' at ' + o.roi.toFixed(2) + '%' + (openReqs(c).length ? '. Customer asked for a change' : '') }, base));
      else if (!san.accepted && !o && san.sent) add(Object.assign({ id: c.id + '|sign', st: 'san', sub: 'sign', at: san.sent, what: 'Sanction letter sent ' + sentWhen(san.sent) + ', not signed yet' }, base));
      if (san.accepted && !san.handoff) {
        const cp = c.docs.filter(d => d.need === 'cp' && !d.up), ins = cp.filter(d => d.id === 'ins'), oth = cp.filter(d => d.id !== 'ins');
        if (oth.length) add(Object.assign({ id: c.id + '|cp', st: 'disb', sub: 'cp', at: san.accepted, what: cap1(moreTxt(oth, 2)) }, base));
        if (ins.length) add(Object.assign({ id: c.id + '|ins', st: 'disb', sub: 'ins', at: san.accepted, what: 'With our interest noted. Accepted ' + fds(san.accepted) }, base));
      }
    }
  });
  R.forEach(x => { if (!x.own || !TEAM[x.own]) { x.own = null; x.wn = holder(CASES[x.live] || CASES[0], fullEval(CASES[x.live] || CASES[0])).n; } });
  return R.sort((a, b) => b.d - a.d);
}
const wName = x => x.live != null ? `<button class="lnk" data-act="open" data-v="${x.live}">${esc(x.name)}</button>` : `<button class="lnk" data-act="lopen" data-v="${esc(x.lead)}">${esc(x.name)}</button>`;
const wDays = x => `<span class="wot-d${x.d >= 5 ? ' late' : ''}">${x.d ? plural(x.d, 'day') : 'Today'}</span>`;
function wsRow(x) {
  const t = x.own ? TEAM[x.own] : null, who2 = t ? t.n : x.wn, nd = (S.nudged || {})[x.id];
  return `<div class="ws-r"><span class="mini-av${t ? '' : ' un'}" title="${esc(who2)}">${esc(inits(who2))}</span><div class="ws-rn">${wName(x)}<small>${esc(x.what)}</small><small class="ws-m">${esc(who2)}, ${esc(lakh(x.amt))}</small></div><div class="ws-x">${wDays(x)}${nd ? `<span class="wot-ok">${ic('check')}Nudged ${esc(ftime(nd))}</span>` : ''}</div></div>`;
}
function wsCol(s, I) {
  const [k, l, sub, G] = s, L = I.filter(x => x.st === k), files = new Set(L.map(wfk)).size, N = S.nudged || {}, open = L.filter(x => x.own && !N[x.id]);
  const btn = !L.length ? '' : open.length ? `<button class="btn btn-s btn-sm" data-act="wnudge" data-v="st|${k}">${ic('bell')}Nudge all</button>` : `<span class="wot-ok">${ic('check')}All nudged</span>`;
  return `<div class="ws-c"><div class="ws-h"><span class="ws-ht"><b>${l}</b><span class="cnt${files ? ' w' : ''}" title="${plural(files, 'file')}">${files}</span></span>${btn}</div><small class="ws-sub">${sub}</small>
  ${G.map(([g, gl]) => { const X = L.filter(x => x.sub === g); return `<div class="ws-sg${X.length ? '' : ' z'}"><div class="ws-sh"><span>${esc(gl)}</span><b>${X.length}</b></div>${X.map(wsRow).join('')}</div>`; }).join('')}</div>`;
}
function wtHTML(I) {
  const N = S.nudged || {};
  const P = Object.keys(TEAM).map(k => { const L = I.filter(x => x.own === k); return { k, t: TEAM[k], L, files: new Set(L.map(wfk)).size, by: WOT10.map(s => new Set(L.filter(x => x.st === s[0]).map(wfk)).size) }; })
    .sort((a, b) => (b.files - a.files) || a.t.n.localeCompare(b.t.n));
  return `<div class="wt-l">${P.map(p => {
    const open = S.wtx === p.k && p.files > 0, left = p.L.filter(x => !N[x.id]), last = p.L.map(x => N[x.id]).filter(Boolean).sort().pop();
    const cells = `<span class="wt-ss">${WOT10.map((s, j) => `<span class="wt-s${p.by[j] ? '' : ' z'}"><small>${s[0] === 'disb' ? '<span class="wt-lg">Disbursement</span><span class="wt-sh">Disb.</span>' : s[1]}</small><b>${p.by[j]}</b></span>`).join('')}</span>`;
    const head = `<span class="av2">${esc(inits(p.t.n))}</span><span class="wt-n"><b>${esc(p.t.n)}</b><small>${esc(p.t.r + ', ' + p.t.w)}</small></span>${cells}<span class="wt-t"><b>${p.files}</b><small>${p.files === 1 ? 'file' : 'files'}</small></span>`;
    const act = !p.files ? '<span class="wt-z">Nothing pending</span>' : left.length ? `<button class="btn btn-s btn-sm" data-act="wnudge" data-v="tm|${p.k}" aria-label="Nudge ${esc(p.t.n)} about ${plural(p.files, 'file')}">${ic('bell')}Nudge</button>` : `<span class="wot-ok">${ic('check')}Nudged ${esc(ftime(last))}</span>`;
    return `<div class="wt-c${open ? ' open' : ''}${p.files ? '' : ' z'}">${p.files ? `<button class="wt-h" data-act="wtx" data-v="${p.k}" aria-expanded="${open}" title="${open ? 'Hide the details' : 'Show where the files are'}">${head}${ic('chev', 'wt-ch')}</button>` : `<div class="wt-h">${head}<span></span></div>`}<div class="wt-a">${act}</div>${open ? wtDetail(p) : ''}</div>`;
  }).join('')}</div>`;
}
function wtDetail(p) {
  return `<div class="wt-d">${WOT10.map(([k, l, sub, G]) => {
    const L = p.L.filter(x => x.st === k);
    return `<div class="wt-dc"><b>${l}</b>${L.length ? G.map(([g, gl]) => { const X = L.filter(x => x.sub === g); return X.length ? `<div class="wt-dg"><span class="wt-dh">${esc(gl)}<i>${X.length}</i></span><ul>${X.map(x => `<li>${wName(x)}<small>${esc(x.what)}</small>${wDays(x)}</li>`).join('')}</ul></div>` : ''; }).join('') : '<p class="wt-dn">Nothing pending</p>'}</div>`;
  }).join('')}</div>`;
}
function wotHTML10() {
  const I = wotItems(), files = new Set(I.map(wfk)).size, v = S.wotv === 'team' ? 'team' : 'stage';
  const seg = `<div class="seg2" role="group" aria-label="Group by">${[['stage', 'By stage'], ['team', 'By team']].map(([k, l]) => `<button class="${v === k ? 'on' : ''}" data-act="wv" data-v="${k}" aria-pressed="${v === k}">${l}</button>`).join('')}</div>`;
  return `<section class="panel wot wot10"><div class="ph"><h3>Waiting on your team</h3><span class="note">${files ? plural(files, 'file') + ' that only sales can move. Oldest first' : 'Nothing is waiting on sales'}</span><span class="act">${seg}</span></div><div class="pb">${v === 'team' ? wtHTML(I) : `<div class="ws-g">${WOT10.map(s => wsCol(s, I)).join('')}</div>`}<p class="hint">A nudge reminds the person in the app and on WhatsApp, and is logged on the file.</p></div></section>`;
}
wotHTML = wotHTML10;
function wNudge(L) {
  const N = S.nudged = S.nudged || {}, todo = L.filter(x => x.own && !N[x.id]); if (!todo.length) return todo;
  const at = tick(1);
  todo.forEach(x => {
    N[x.id] = at; const t = TEAM[x.own], gl = wsLbl(x);
    if (x.live != null) CASES[x.live].w.log.push({ at, w: who('ppl', SMGR.name, SMGR.sub), cat: 'comms', txt: 'Nudged ' + t.n, det: gl + '. ' + x.what + '.' });
    else { const l = LL.find(z => z.id === x.lead); if (l) (l.log = l.log || []).push({ at, t: 'Nudged ' + t.n + ': ' + lc1(gl), who: SMGR.name }); }
  });
  return todo;
}
const _reset10 = ACT.resetall, _persona10 = ACT.persona;
/* each account starts on its own view of the lists */
ACT.persona = function (v) { S.losf = 'all'; S.lq = ''; S.wtx = null; _persona10(v); };
Object.assign(ACT, {
  wv(v) { S.wotv = v === 'team' ? 'team' : 'stage'; render(); },
  wtx(v) { S.wtx = S.wtx === v ? null : v; render(); },
  wnudge(v) {
    const [m, k] = String(v).split('|'), I = wotItems(), L = m === 'st' ? I.filter(x => x.st === k) : m === 'tm' ? I.filter(x => x.own === k) : I.filter(x => x.id === k);
    const done = wNudge(L); if (!done.length) return;
    const ppl = [...new Set(done.map(x => TEAM[x.own].n))], files = new Set(done.map(wfk)).size;
    render(); toast((ppl.length > 1 ? 'Reminders sent to ' : 'Reminder sent to ') + (ppl.length <= 2 ? listAnd(ppl) : ppl.length + ' people') + ' about ' + plural(files, 'file') + ', in the app and on WhatsApp');
  },
  resetall() { S.qseen = {}; S.wotv = 'stage'; S.wtx = null; _reset10(); }
});


/* =====================================================================
   v11: first and last name on a new lead; case facts the RM can change
   at login. A change is checked against the documents on the file;
   when none shows it, a sanction condition asks for one.
   ===================================================================== */

/* ---------------- New lead: first name and last name ---------------- */
const NLNM_IND = [['a1f', 'First name'], ['a1l', 'Last name']], NLNM_CO = [['a1n', 'Name']];
NLD9.ind.forEach(d => { d.f = [].concat(...d.f.map(k => k === 'a1n' ? ['a1f', 'a1l'] : [k])); });
Object.assign(NLV9, { a1f: 'Sameer', a1l: 'Joshi' });
function nlNameSync(N) {
  N = N || S.nl; if (!N || (N.f.atype || {}).v === 'Company or firm') return;
  const p = ['a1f', 'a1l'].map(k => N.f[k] || {}), nm = p.map(x => (x.v || '').trim()).filter(Boolean).join(' '), rd = p.find(x => x.src && x.src !== 'typed' && x.v);
  N.f.a1n = { v: nm, src: rd ? rd.src : 'typed', conf: rd ? rd.conf : null };
}
function nlNameFields() { while (NLF9.length && ['a1n', 'a1f', 'a1l'].includes(NLF9[0][0])) NLF9.shift(); NLF9.unshift(...(isCo() ? NLNM_CO : NLNM_IND)); }
const _nlSheet11 = nlSheet;
nlSheet = function () {
  if (!S.sheet || S.sheet.k !== 'lead') return '';
  if (!S.nl) S.nl = nlInit9(!nlCase().lead.hidden);
  nlNameFields(); nlNameSync();
  return _nlSheet11();
};
const _nlCreate11 = nlCreate9;
nlCreate9 = function (N) { nlNameSync(N); return _nlCreate11(N); };
document.addEventListener('input', ev => { const k = ev.target && ev.target.dataset && ev.target.dataset.nl; if ((k === 'a1f' || k === 'a1l') && S.nl) nlNameSync(); });

/* ---------------- case facts at login: change, check, condition ---------------- */
Object.assign(ICO, { zap: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>' });
/* what each document on Sameer's file shows; other files use the value the system read */
const FXDOC = { N1: { 'inc:a1': { sal_a1: [['August 2026', 122000], ['September 2026', 124000], ['October 2026', 126000]], f16_a1: [['FY 2025-26, a month', 118000]], '@aa': [['Salary credits, last 6 months', 124000]] } } };
const fxIs = (k, p) => k.indexOf(p) === 0;
const _canEdit11 = canEdit;
canEdit = function (c) { return _canEdit11(c) || (['sales', 'cm'].includes(S.role) && E && E.st.k === 'docs' && !(c.lead && !c.lead.in)); };
function fxGet(c, k) {
  if (k === 'loan') return c.v.loan; if (k === 'tenure') return c.v.tenure; if (k === 'price') return c.prop.agreement;
  if (fxIs(k, 'inc:')) return c.apps.find(a => a.id === k.slice(4)).inc;
  if (fxIs(k, 'ob:')) return c.oblig.find(o => o.id === k.slice(3)).count ? 1 : 0;
}
function fx0(c, k) { const w = c.w.fx0 = c.w.fx0 || {}; if (!(k in w)) w[k] = fxGet(c, k); return w[k]; }
function fxSet(c, k, v) {
  if (k === 'loan') c.v.loan = v; else if (k === 'tenure') c.v.tenure = v;
  else if (k === 'price') { c.prop.agreement = v; if (c.lead) c.lead.price = v; }
  else if (fxIs(k, 'inc:')) c.apps.find(a => a.id === k.slice(4)).inc = v;
}
function fxNorm(k, n) { if (k === 'loan' || k === 'price') return Math.round(clamp(n, 100000, 500000000) / 1000) * 1000; if (k === 'tenure') return Math.round(clamp(n, 1, 30)) * 12; return Math.round(clamp(n, 0, 10000000)); }
const fxV = (k, x) => k === 'tenure' ? yrsTxt(x) : k === 'loan' || k === 'price' ? lakh(x) : fxIs(k, 'inc:') ? inr(x) : x ? 'Running' : 'Closed';
function fxFmt(c, k, v) { return fxIs(k, 'inc:') ? inr(v) + ' a month' : fxIs(k, 'ob:') ? (v ? 'counted in FOIR' : 'left out of FOIR') : fxV(k, v); }
function fxLabel(c, k) {
  if (k === 'loan') return 'Loan amount'; if (k === 'tenure') return 'Tenure'; if (k === 'price') return 'Property price';
  if (fxIs(k, 'inc:')) return c.apps.find(x => x.id === k.slice(4)).name.split(' ')[0] + '\u2019s monthly pay';
  return c.oblig.find(x => x.id === k.slice(3)).t;
}
const fxLow = (c, k) => fxIs(k, 'inc:') ? fxLabel(c, k) : lc1(fxLabel(c, k));
function fxDocName(id, t, lab) {
  if (/^sal/.test(id)) return lab && /\d{4}$/.test(lab) ? 'the ' + lab + ' salary slip' : 'the salary slips';
  if (/^f16/.test(id)) return 'Form 16'; if (/^itr/.test(id)) return lab && /^FY/.test(lab) ? 'the ' + lab.split(',')[0] + ' ITR' : 'the ITR'; if (id === '@aa') return 'the salary credits in the bank data'; if (id === '@bur') return 'the credit report';
  return 'the ' + lc1(t.replace(/, [A-Z][a-z]+$/, ''));
}
/* a document in plain words: "the salary slips", "Form 16" */
function fxSrcNm(s) {
  if (/^sal/.test(s.id)) return 'the salary slips'; if (/^f16/.test(s.id)) return 'Form 16'; if (/^itr/.test(s.id)) return 'the ITR';
  if (s.id === '@aa') return 'the bank data'; if (s.id === '@bur') return 'the credit report'; if (s.id === 'app') return 'the application form';
  return 'the ' + lc1(s.t.replace(/, [A-Z][a-z]+$/, ''));
}
function fxDue(c, k, L) {
  const a = fxIs(k, 'inc:') ? c.apps.find(x => x.id === k.slice(4)) : null, p = a ? (a.sex === 'F' ? 'her ' : a.sex === 'M' ? 'his ' : 'their ') : '';
  return p ? p + listAnd(L.map(s => fxSrcNm(s).replace(/^the /, ''))) : listAnd(L.map(fxSrcNm));
}
/* the documents a fact can come from, and what each shows */
function fxSrc(c, k) {
  const doc = id => c.docs.find(x => x.id === id), L = [], v0 = fx0(c, k), rich = (FXDOC[c.id] || {})[k] || (fxIs(k, 'inc:') && (c.apps.find(a => a.id === k.slice(4)) || {}).docVals) || {};
  const add = (id, t, vals) => L.push({ id, t, vals, in: id[0] === '@' ? true : !!(doc(id) && doc(id).up) });
  if (k === 'loan' || k === 'tenure') { const d = doc('app'); if (d) add('app', d.t, [['As applied', k === 'loan' ? c.v.applied.loan : c.v.applied.tenure]]); }
  else if (k === 'price') ['ats', 'afs', 'allot'].forEach(id => { const d = doc(id); if (d) add(id, d.t, [['Price', v0]]); });
  else if (fxIs(k, 'inc:')) {
    const aid = k.slice(4);
    c.docs.filter(d => /^(sal|f16|itr)_/.test(d.id) && d.id.slice(-aid.length - 1) === '_' + aid).forEach(d => add(d.id, d.t, rich[d.id] || [[/^sal/.test(d.id) ? 'Average of 3 months' : /^f16/.test(d.id) ? 'A month' : 'From the return, a month', v0]]));
    if (aid === 'a1' && /Account Aggregator/.test((c.bank || {}).via || '')) add('@aa', 'Bank credits, Account Aggregator', rich['@aa'] || [['Last 6 months', v0]]);
  } else if (fxIs(k, 'ob:')) { const o = c.oblig.find(x => x.id === k.slice(3)); add('@bur', 'Credit report', [['Running', 1]]); }
  return L;
}
function fxNeed(c, k, v) {
  const a = fxIs(k, 'inc:') ? c.apps.find(x => x.id === k.slice(4)) : null;
  if (a) return [(a.emp === 'Salaried' ? 'Salary slip for ' : 'Income proof for ') + a.name.split(' ')[0] + ' showing ' + inr(v) + ' a month', DCAT[2]];
  if (k === 'price') return [(c.variant === 'resale' ? 'Agreement to sell' : 'Agreement') + ' showing a price of ' + lakh(v), DCAT[4]];
  if (fxIs(k, 'ob:')) return ['Closure letter for the ' + lc1(c.oblig.find(x => x.id === k.slice(3)).t), DCAT[2]];
  return ['Revised application form, e-signed, for ' + lakh(c.v.loan) + ' over ' + yrsTxt(c.v.tenure), DCAT[0]];
}
function fxMatch(c, k, v) {
  const L = fxSrc(c, k), inL = L.filter(s => s.in);
  if (fxIs(k, 'ob:')) return v ? { st: 'match', L, doc: L[0], lab: 'Running' } : { st: 'none', L, raise: 1 };
  if (fxIs(k, 'inc:') && !inL.length && L.length) return { st: 'await', L };
  if ((k === 'loan' || k === 'tenure') && !inL.length) return { st: 'pending', L };
  let best = null; for (const s of inL) for (const [lab, x] of s.vals) { const d = Math.abs(x - v); if (d <= Math.max(1, x * 0.005) && (!best || d < best.d)) best = { s, lab, d }; }
  if (best) return { st: 'match', L, doc: best.s, lab: best.lab };
  const top = inL.length ? Math.max(...inL.map(s => Math.max(...s.vals.map(z => z[1])))) : 0;
  if ((fxIs(k, 'inc:') || k === 'price') && inL.length && v <= top) return { st: 'within', L, top };
  return { st: 'none', L, raise: (fxIs(k, 'inc:') || k === 'price') && v > fx0(c, k) };
}
const FXW = () => who('sys', 'Document check', 'Checks a change against the file');
function fxClear(c, k) {
  c.w.extra = (c.w.extra || []).filter(x => x.fx !== k);
  c.docs = c.docs.filter(d => d.fx !== k || d.up);
  const id = 'fx-' + k; if (CHECKS[c.id]) CHECKS[c.id] = CHECKS[c.id].filter(x => x.id !== id); if (c.w.chk) delete c.w.chk[id];
}
function fxEv(c, k, F) {
  const a = fxIs(k, 'inc:') ? c.apps.find(x => x.id === k.slice(4)) : null, s = F.L.find(z => z.in) || F.L[0];
  if (a && s) return { kind: s.id === '@aa' ? 'Bank data' : /^sal/.test(s.id) ? 'Salary slips' : 'Income document', title: s.t, org: a.org || a.name, rows: [['Name', a.name]].concat(s.vals.map(([l, x]) => [l, inr(x)])), hi: s.vals.length, read: inr(Math.max(...s.vals.map(z => z[1]))), conf: 97 };
  if (k === 'price') return { kind: 'Lead', title: s && s.in ? s.t : 'Price stated at the lead', org: c.prop.addr, rows: [['Price', lakh(fx0(c, k))], ['Changed to', lakh(F.to)]], hi: 1, read: lakh(fx0(c, k)), conf: 99 };
  const o = c.oblig.find(x => x.id === k.slice(3)) || {};
  return { kind: 'Credit report', title: 'Credit report', org: 'Pulled at the pre-screen', rows: [['Account', o.t || ''], ['Lender', o.lender || ''], ['Status', 'Running'], ['EMI', inr(o.emi || 0)]], hi: 3, read: 'Running', conf: 99 };
}
function fxApply(c, k, r, was, v, ctx) {
  const me = ctx ? { name: ctx.by } : meWho(), role = ctx ? ctx.role : S.role, decl = !!(ctx && ctx.decl), F0 = c.w.fx = c.w.fx || {};
  fxClear(c, k);
  if (v === fx0(c, k)) {
    delete F0[k]; if (c.w.edited) delete c.w.edited[k];
    if (c.w.fxT && !Object.values(F0).some(x => x.cond && x.raise)) { c.w.touched = false; c.w.fxT = 0; }
    log(c, FXW(), 'data', fxLabel(c, k) + ' is back to what the documents show', 'No condition needed.'); return;
  }
  const F = F0[k] = { from: was, to: v, at: ctx ? ctx.at : S8(CLK), by: me.name, role, decl, st: r.st, doc: r.doc ? fxDocName(r.doc.id, r.doc.t, r.doc.vals.length > 1 ? r.lab : '') : '', top: r.top || 0, L: r.L.map(s => ({ id: s.id, t: s.t, in: s.in, vals: s.vals })), raise: !!r.raise };
  const looked = listAnd(r.L.map(s => fxSrcNm(s) + (s.in ? '' : ', not in yet'))) || 'the file';
  if (r.st === 'match') { log(c, FXW(), 'data', fxLabel(c, k) + ' matches ' + F.doc, cap1(fxFmt(c, k, v)) + '.'); return; }
  if (r.st === 'within') { log(c, FXW(), 'data', fxLabel(c, k) + ' is within what the documents show', 'Up to ' + fxV(k, r.top) + ' in ' + looked + '.'); return; }
  if (r.st === 'pending') { log(c, FXW(), 'data', fxLabel(c, k) + ': the application form will carry it', 'The form is not signed yet. It goes to the customer with ' + fxFmt(c, k, v) + '.'); return; }
  if (r.st === 'await') { log(c, FXW(), 'data', fxLabel(c, k) + ' counted as declared', 'Checked when ' + fxDue(c, k, r.L) + ' come in. If none shows it, a sanction condition asks for one.'); return; }
  const [t, cat] = fxNeed(c, k, v), id = 'fx_' + k.replace(/\W/g, '_');
  F.cond = t;
  c.w.extra.push({ w: 'cp', t, d: fxLabel(c, k) + (decl ? ' declared' : ' changed') + ' at login by ' + me.name + '. No document showed it', fx: k });
  c.docs.push(Object.assign(dk(id, t, cat, 'cp', id + '.pdf'), { fx: k }));
  log(c, FXW(), 'decision', 'Sanction condition added: ' + lc1(t), 'No document on the file shows ' + fxFmt(c, k, v) + '. Looked at ' + looked + '.');
  if (r.raise) {
    if (!c.w.touched) { c.w.touched = true; c.w.fxT = 1; }
    if (role !== 'cm') {
      F.chk = 'fx-' + k;
      const what = fxIs(k, 'ob:') ? fxLabel(c, k) + ' left out of FOIR at login' : fxLabel(c, k) + (decl ? ' declared' : ' changed') + ' at login';
      (CHECKS[c.id] = CHECKS[c.id] || []).push({ id: F.chk, fx: k, sev: 'med', fld: k, t: what + (decl ? ', no document shows it' : ', no document yet'),
        f: me.name + (decl ? ' declared ' + fxLow(c, k) + ' as ' + fxFmt(c, k, v) : ' changed ' + fxLow(c, k) + ' from ' + fxFmt(c, k, was) + ' to ' + fxFmt(c, k, v)) + ' at login. The system looked at ' + looked + ', and none shows it. A condition asks for ' + lc1(t) + ' before disbursement.',
        sug: decl ? 'Accept it with the condition, or decide on what the documents show.' : 'Accept it with the condition, or decide on ' + fxFmt(c, k, was) + '.', ask: lc1(t), ev: fxEv(c, k, F) });
      log(c, FXW(), 'decision', 'Sent to the credit manager to decide', 'A change raises eligibility without a document, so the system will not sanction this file by itself.');
    }
  }
}
function fxRun(c, k, was, v) {
  S.fxBusy = { id: c.id, k }; render();
  later(750, () => {
    S.fxBusy = null; fxApply(c, k, fxMatch(c, k, v), was, v);
    if (c.w.fxT && !Object.values(c.w.fx || {}).some(x => x.cond && x.raise)) { c.w.touched = false; c.w.fxT = 0; }
    if (c.w.sysAt) c.w.sysAt = tick(1);
    render();
    const F = (c.w.fx || {})[k];
    toast(!F ? fxLabel(c, k) + ' is back to what the documents show' : F.st === 'match' ? 'Checked: it matches ' + F.doc : F.st === 'within' ? 'Checked: within what the documents show' : F.st === 'pending' ? 'Changed. The application form will carry it' : F.st === 'await' ? 'Counted as declared. Checked when the documents come in' : 'No document shows it. Sanction condition added' + (F.chk ? ', and the credit manager decides' : ''));
  });
}
function fxRecheck(c) {
  const F0 = (c.w && c.w.fx) || {}, out = [];
  Object.keys(F0).forEach(k => {
    const F = F0[k]; if (!fxIs(k, 'inc:') || !['await', 'none'].includes(F.st)) return;
    const r = fxMatch(c, k, F.to), was = F.L.filter(s => s.in).map(s => s.id).join(), now = r.L.filter(s => s.in).map(s => s.id).join();
    if (r.st === F.st && was === now) return;
    fxApply(c, k, r, F.from, F.to, { by: F.by, at: F.at, role: F.role, decl: F.decl }); out.push(k);
  });
  if (c.w.fxT && !Object.values(F0).some(x => x.cond && x.raise)) { c.w.touched = false; c.w.fxT = 0; }
  return out;
}
/* the result, under the fact */
function fxLine(c, k) {
  if (S.fxBusy && S.fxBusy.id === c.id && S.fxBusy.k === k) return `<div class="fx-l run"><span class="spin"></span>Checking it against the documents on the file</div>`;
  const F = (c.w.fx || {})[k]; if (!F) return '';
  const lk = F.L.length ? `<div class="fx-lk">${F.L.map(s => `<span class="fx-s${s.in ? '' : ' na'}">${ic(s.in ? 'file' : 'clock')}<b>${esc(s.t)}</b><i>${s.in ? esc(s.vals.map(z => fxV(k, z[1])).join(', ')) : 'Not in yet'}</i></span>`).join('')}</div>` : '';
  const by = `<small class="fx-by">${F.decl ? 'Declared' : 'Changed'} by ${esc(F.by)}, ${esc(fds(F.at))} at ${esc(ftime(F.at))}.${F.decl ? '' : ' Was ' + esc(fxFmt(c, k, F.from)) + '.'}</small>`;
  if (F.st === 'match') return `<div class="fx-l ok">${ic('check')}<div><b>Matches ${esc(F.doc)}.</b>${by}${lk}</div></div>`;
  if (F.st === 'within') return `<div class="fx-l ok">${ic('check')}<div><b>Within what the documents show</b>, up to ${esc(fxV(k, F.top))}.${by}${lk}</div></div>`;
  if (F.st === 'await') { const due = F.L.filter(s => !s.in); return `<div class="fx-l info">${ic('clock')}<div><b>Counted as declared.</b> The system checks it when ${esc(fxDue(c, k, due))} ${due.length > 1 ? 'come' : 'comes'} in. If none shows it, a sanction condition asks for one.${by}${lk}</div></div>`; }
  if (F.st === 'pending') return `<div class="fx-l info">${ic('clock')}<div><b>The application form is not signed yet.</b> It goes to the customer with ${esc(fxFmt(c, k, F.to))}, to e-sign.${by}</div></div>`;
  return `<div class="fx-l warn">${ic('alert')}<div><b>No document shows ${esc(fxFmt(c, k, F.to))}.</b> ${F.cond ? 'Sanction condition added: ' + esc(lc1(F.cond)) + ', before disbursement.' : 'A document is still awaited.'}${F.chk ? ' The credit manager decides this file; the system will not sanction it by itself.' : ''}${by}${lk}</div></div>`;
}
const _editRow11 = editRow;
editRow = function (c, key, label, val, src, hint, input) {
  let h = _editRow11(c, key, label, val, src, hint, input); const fl = S.edit === key ? '' : fxLine(c, key);
  if (key === 'roi' && S.role === 'sales') h = h.replace(/<button class="fe"[^>]*data-v="roi"[\s\S]*?<\/button>/, '');
  return fl ? h.replace(/^<div class="fd">/, '<div class="fd has-fx">').replace(/<\/div>$/, fl + '</div>') : h;
};
const _ovLeft11 = ovLeft;
ovLeft = function () {
  let h = _ovLeft11(); const c = C();
  if (E.st.k === 'docs' && canEdit(c)) h = h.replace(/<p>What-if: change a value[^<]*<\/p>/, '<p>Change a value when the customer tells you something new. The system checks it against the documents on the file. If none shows it, a sanction condition asks for one.</p>');
  c.oblig.forEach(o => { const fl = fxLine(c, 'ob:' + o.id); if (fl) h = h.replace(new RegExp('(<label class="obl[^"]*"><input type="checkbox" data-act="oblig" data-v="' + o.id + '"[\\s\\S]*?</label>)'), '$1' + fl); });
  return h;
};
const _propSnap11 = propSnapHTML;
propSnapHTML = function () {
  const c = C(); if (!(E.st.k === 'docs' && c.prop && c.prop.agreement)) return _propSnap11();
  const ed = (c.w.edited || {}).price, ats = c.docs.find(d => ['ats', 'afs', 'allot'].includes(d.id)), inp = `<input class="fin sm" id="fin" type="number" step="10000" value="${c.prop.agreement}" data-autofocus>`;
  return `<section class="panel"><div class="ph"><h3>Property price</h3><span class="note">What the customer pays for it</span></div><div class="pb"><div class="fgrid one">${editRow(c, 'price', ats ? ats.t : 'Price', lakh(c.prop.agreement), ed ? 'edit' : ats && ats.up ? 'doc' : 'dec', ats && ats.up ? 'From the ' + lc1(ats.t) : 'Stated at the lead' + (ats ? '. The ' + lc1(ats.t) + ' is due at login' : ''), inp)}</div></div></section>` + _propSnap11();
};
const _fsave11 = ACT.fsave, _oblig11 = ACT.oblig, _reset11 = ACT.resetall, _chkdo11 = ACT.chkdo;
Object.assign(ACT, {
  fsave() {
    const c = C(), k = S.edit, el = $('#fin');
    if (!c || !E || E.st.k !== 'docs' || !k || !el || k === 'roi') return _fsave11();
    const n = parseFloat(el.value); if (isNaN(n)) { toast('Enter a number'); return; }
    fx0(c, k); const was = fxGet(c, k), v = fxNorm(k, n); S.edit = null;
    if (v === was) { render(); return; }
    fxSet(c, k, v); c.w.edited = c.w.edited || {}; c.w.edited[k] = true;
    log(c, meW(), 'data', fxLabel(c, k) + ' changed at login', cap1(fxFmt(c, k, was)) + ' to ' + fxFmt(c, k, v) + '.');
    fxRun(c, k, was, v);
  },
  oblig(v) {
    const c = C(); if (!c || !E || E.st.k !== 'docs' || !['sales', 'cm'].includes(S.role)) return _oblig11(v);
    const o = c.oblig.find(x => x.id === v); if (!o) return;
    const k = 'ob:' + v, w = c.w.fxWhy = c.w.fxWhy || {}; fx0(c, k); if (!(v in w)) w[v] = o.why;
    o.count = !o.count; o.why = o.count ? w[v] : 'Left out by ' + meWho().name + ': to be closed before disbursement';
    log(c, meW(), 'data', (o.count ? 'Counted in FOIR: ' : 'Left out of FOIR: ') + lc1(o.t), o.emi ? inr(o.emi) + ' a month.' : '');
    fxRun(c, k, o.count ? 0 : 1, o.count ? 1 : 0);
  },
  chkdo(v) {
    const [id, act] = String(v).split('|'), c = C(); _chkdo11(v);
    if (act !== 'asked' || id.indexOf('fx-') !== 0) return;
    later(SOON.reply + 80, () => { const s = c.w.chk && c.w.chk[id]; if (!s || s.st !== 'confirmed') return; const k = id.slice(3), d = c.docs.find(x => x.fx === k); if (d && !d.up) d.up = { f: d.sample, at: S8(CLK), by: (c.apps.find(a => 'inc:' + a.id === k) || c.apps[0]).name }; c.w.extra = (c.w.extra || []).filter(x => x.fx !== k); const F = (c.w.fx || {})[k]; if (F) { F.st = 'match'; F.doc = d ? d.t : F.doc; F.cond = null; } render(); });
  },
  resetall() { S.fxBusy = null; Object.keys(CHECKS).forEach(id => { CHECKS[id] = CHECKS[id].filter(k => !k.fx); }); _reset11(); }
});

/* =====================================================================
   v11: the Admin page in seven sections, in both views:
   Discovery, Workflow, Form design, Policy rules, Vendors and APIs,
   Audit trail and Onboarding.
   - Discovery collects the documents; one read builds the rest.
   - The workflow shows what moves a file on from every step.
   - Form design shows each step's screen next to the workflow. The
     new lead and login screens can be changed by dragging, or by a
     voice note or typed instructions. The preview changes; nothing
     else in the LOS does.
   - Onboarding holds roles, SOPs and the escalation matrix.
   All people, documents and numbers are fictional.
   ===================================================================== */
Object.assign(AREA, { disc: 'Discovery', form: 'Form design', org: 'Onboarding' });
Object.assign(ICO, { grip: '<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>', screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>' });

/* ---------------- Discovery: what a setup is built from ---------------- */
const DSRC = {
  POL: { ic: 'file', n: PDOC.n, meta: PDOC.meta },
  AF: { ic: 'file', n: 'Home loan application form v7.pdf', meta: '6 pages. Sections for individuals and for companies' },
  DC: { ic: 'grid', n: 'Document checklist, home loans.xlsx', meta: '3 sheets: salaried, self-employed and property' },
  SC: { ic: 'file', n: 'Schedule of charges, home loans.pdf', meta: '2 pages. In force from 1 Oct 2026' },
  RMX: { ic: 'grid', n: 'Role master, HRMS export.xlsx', meta: '13 roles and 24 people, with their branches' },
  ESC: { ic: 'file', n: 'Escalation matrix, retail mortgage.pdf', meta: '1 page. 6 triggers, up to 3 levels each' },
  VEN: { ic: 'grid', n: 'Empanelled vendors and API contracts.xlsx', meta: '19 vendors across 14 API calls' }
};
const dsrc = k => WSRC[k] || DSRC[k];
const DGRP = [
  ['proc', 'How the work is done', 'Process notes, a walkthrough and your own words', 'file', [['S1', ['wf', 'form', 'org']], ['S2', ['wf']], ['S4', ['wf']]]],
  ['pol', 'Policy and authority', 'The credit rules and who sanctions what', 'shield', [['POL', ['pol']], ['S3', ['wf', 'org']]]],
  ['form', 'Forms and charges', 'What you collect from customers, and the fees', 'text', [['AF', ['form']], ['DC', ['form']], ['SC', ['form']]]],
  ['ppl', 'People', 'Who does what, and who to escalate to', 'user', [['RMX', ['org']], ['ESC', ['org']]]],
  ['ven', 'Vendors', 'Who you buy each check from', 'link', [['VEN', ['api']]]]
];
const FEED = { wf: 'Workflow', form: 'Form design', pol: 'Policy rules', org: 'Onboarding', api: 'Vendors and APIs' };
const DREAD = { S1: 'Reading the SOP: 38 pages, with OCR', S2: 'Transcribing the walkthrough: Hindi and English, 3 speakers', S3: 'Reading the approval matrix', S4: 'Reading the operations note', POL: 'Reading the credit policy: 42 pages', AF: 'Reading the application form: 6 pages', DC: 'Reading the document checklist: 3 sheets', SC: 'Reading the schedule of charges', RMX: 'Reading the role master: 13 roles, 24 people', ESC: 'Reading the escalation matrix', VEN: 'Reading the vendor list: 19 vendors' };
const DTOOK = { S1: 'Steps, owners and turnarounds; the login documents; an SOP for each role', S2: 'Steps, and two places where practice differs from the SOP', S3: 'Who sanctions what, by amount and deviation', S4: 'Four points on letters, OTC documents and bureau re-pulls', POL: 'Every rule and limit, with its page', AF: 'The details asked for at the lead', DC: 'The documents asked for at the lead and at login', SC: 'The application fee: ₹2,500 plus GST', RMX: '13 roles and the people in them', ESC: '6 escalation triggers, up to 3 levels each', VEN: '14 API calls and the vendors for each' };
const DLIVE = { S1: 'Read 26 Mar 2026. Version 4.2', S2: 'Transcribed 26 Mar 2026', S3: 'Read 30 Oct 2026. FY27 matrix', S4: 'Read 14 Nov 2026', POL: 'Read 3 Nov 2026. Version 12', AF: 'Read 26 Mar 2026. Version 7', DC: 'Read 26 Mar 2026', SC: 'Read 1 Oct 2026', RMX: 'Synced from HRMS every Sunday. Last on 15 Nov 2026', ESC: 'Read 26 Mar 2026', VEN: 'Read 18 Sep 2026' };

/* ---------------- what moves a file on from each step ---------------- */
const TRG = {
  T1: ['auto', 'When the customer approves the consent by OTP'], T2: ['man', 'When the RM sends the file for login'],
  T3: ['auto', 'When the application form, the login fee and KYC are in'], T4: ['man', 'When the credit manager accepts the login'], T5: ['auto', 'When dedupe and CKYC come back clear'],
  T6: ['auto', 'When every bureau report is back'], D3: ['man', 'When the credit manager has verified the income'], T8: ['auto', 'As soon as eligibility is worked out'],
  P4: ['auto', 'When all four reports are in'], D4a: ['auto', 'When the FCU report is clear, or the FCU head lifts the hold'], D4b: ['auto', 'When the valuation is close enough, or the zonal credit manager clears it'],
  T15: ['man', 'When the credit manager records the discussion'], D5: ['man', 'When the personal discussion is recorded'],
  T17: ['man', 'When the credit manager submits the memo'], T18: ['auto', 'When the fresh report is in'], D6: ['man', 'When the second review is done, if one was needed'],
  T20: ['auto', 'As soon as the file is routed'], D7: ['man', 'When the sanctioning authority decides'],
  T22: ['auto', 'When the letter and the KFS are e-signed and sent'], T23: ['man', 'When the RM marks the customer as told'], T24: ['auto', 'When the customer accepts the offer by OTP'],
  T25: ['man', 'When central operations confirms the originals'], D9: ['man', 'When the OTC list is cleared or deferred'], T27: ['man', 'When the disbursement memo is submitted'], T28: ['man', 'When the credit manager authorises the memo'], T29: ['auto', 'Straight away']
};
function trgOf(it) {
  if (it.trg) return it.trg;
  if (it.t === 'par') return { k: 'auto', t: 'When every step in the block is done' };
  if (it.t === 'dec') return { k: 'auto', t: 'When the branch is done' };
  return it.r === 'sys' ? { k: 'auto', t: 'As soon as it is done' } : { k: 'man', t: 'When the owner marks it done' };
}
function addTriggers(F) {
  const set = it => { if (!it.trg && TRG[it.id]) it.trg = { k: TRG[it.id][0], t: TRG[it.id][1] }; };
  F.stages.forEach(g => { const w = arr => arr.forEach(it => { set(it); if (it.t === 'dec') it.arms.forEach(a => w(a.items)); if (it.t === 'par') w(it.lanes); }); w(g.items); });
  return F;
}
const _buildFlow11 = buildFlow;
buildFlow = function (att, text, resolve) { return addTriggers(_buildFlow11(att, text, resolve)); };
const _newStep11 = newStep;
newStep = function (n) { return Object.assign(_newStep11(n), { trg: { k: 'man', t: 'When the owner marks it done' } }); };
const lastItem = g => g && g.items.length ? g.items[g.items.length - 1] : null;
function trgHTML(it, M) {
  if (!it) return fcA();
  const t = trgOf(it), d = M.dm[it.id + ':tg'];
  return `<div class="wf-tg ${t.k}"><i class="wf-l" aria-hidden="true"></i><button class="wf-tl${M.sel === it.id ? ' on' : ''}${d ? ' d-chg' : ''}" data-act="fsel" data-v="${it.id}" title="${t.k === 'auto' ? 'Moves on by itself' : 'Moves on when a person acts'}">${ic(t.k === 'auto' ? 'zap' : 'user')}<span>${esc(t.t)}</span></button><i class="wf-a" aria-hidden="true"></i></div>`;
}
flowHTML = function (F, M) {
  const n = F.stages.length;
  return `<div class="wf"><span class="wf-end">${ic('flag')}A lead comes in</span>${F.stages.map((g, i) => `${i ? trgHTML(lastItem(F.stages[i - 1]), M) : fcA()}<section class="wf-g${M.sel === g.id ? ' on' : ''}${M.dm[g.id] ? ' d-' + M.dm[g.id] : ''}"><button class="wf-gh" data-act="fsel" data-v="${g.id}"><span class="wf-gi">${i + 1}</span><b>${esc(g.n)}</b><small>${esc(slaTxt(g.sla))}</small></button><div class="wf-gb">${g.items.length ? g.items.map((it, j) => (j ? trgHTML(g.items[j - 1], M) : '') + fcItem(it, M)).join('') : '<span class="wf-skip">No steps yet</span>'}</div></section>`).join('')}${n ? trgHTML(lastItem(F.stages[n - 1]), M) : fcA()}<span class="wf-end">${ic('check')}Handed to disbursement</span></div>`;
};
/* the trigger in the edit panel */
const _panelHTML11 = panelHTML;
panelHTML = function (F) {
  let h = _panelHTML11(F); const hit = ADM.sel ? findNode(F, ADM.sel) : null;
  if (!hit) return h.replace('<li>' + ic('alert') + 'A question for you</li>', '<li>' + ic('alert') + 'A question for you</li><li><span class="lg-t auto">' + ic('zap') + '</span>Moves on by itself</li><li><span class="lg-t man">' + ic('user') + '</span>Moves on when a person acts</li>');
  if (hit.stage) return h;
  const n = hit.node, t = trgOf(n), inArm = hit.parent && (hit.parent.dec || hit.parent.par);
  const box = inArm ? `<p class="fp-n">${ic('zap')}This step is on a branch. What moves the file on is set on the ${hit.parent.dec ? 'decision' : 'block'} it sits in.</p>` : `<div class="fp-k">What moves the file on</div><div class="fp-tg"><select class="sel" data-fe="tk|${n.id}" aria-label="How it moves on"><option value="auto"${t.k === 'auto' ? ' selected' : ''}>By itself</option><option value="man"${t.k === 'man' ? ' selected' : ''}>When a person acts</option></select><textarea class="ta" rows="2" data-fe="tt|${n.id}" aria-label="The trigger">${esc(t.t)}</textarea></div><p class="fp-n">Shown on the arrow after this ${n.t === 'dec' ? 'decision' : n.t === 'par' ? 'block' : 'step'}.</p>`;
  const i = h.indexOf('<div class="fp-a">');
  return i < 0 ? h + box : h.slice(0, i) + box + h.slice(i);
};
const _fedit11 = fedit;
fedit = function (key, el) {
  const [k, id] = key.split('|');
  if (k !== 'tk' && k !== 'tt') return _fedit11(key, el);
  const hit = findNode(curFlow(), id); if (!hit) return; const o = hit.node, t = Object.assign({}, trgOf(o)), was = (t.k === 'auto' ? 'By itself: ' : 'A person: ') + t.t;
  if (k === 'tk') t.k = el.value === 'man' ? 'man' : 'auto'; else { const v = el.value.replace(/\s+/g, ' ').trim(); if (!v) { render(); return; } t.t = v; }
  o.trg = t; wlog('What moves the file on after “' + short(o.n || o.q || 'the block', 50) + '”', was, (t.k === 'auto' ? 'By itself: ' : 'A person: ') + t.t); render();
};
const tgStr = it => { const t = trgOf(it); return (t.k === 'auto' ? 'By itself: ' : 'A person: ') + t.t; };
flatNodes = function (F) {
  const out = {}, ord = {};
  F.stages.forEach(g => { out[g.id] = { k: 'stage', n: g.n, sla: slaTxt(g.sla) }; const ids = [];
    const w = (arr, top) => arr.forEach(it => { ids.push(it.id); const tg = top ? tgStr(it) : '';
      if (it.t === 'step') out[it.id] = { k: 'step', n: it.n, r: it.r, sla: slaTxt(it.sla), g: g.n, tg };
      if (it.t === 'dec') { out[it.id] = { k: 'decision', n: it.q, arms: it.arms.map(a => a.l).join(' / '), g: g.n, tg }; it.arms.forEach(a => w(a.items, false)); }
      if (it.t === 'par') { out[it.id] = { k: 'parallel block', n: 'In parallel', note: it.note || '', g: g.n, tg }; w(it.lanes, false); } });
    w(g.items, true); ord[g.id] = ids; });
  return { out, ord };
};
const _flowDiff11 = flowDiff;
flowDiff = function (A, B) {
  const D = _flowDiff11(A, B); if (!A || !B) return D;
  const a = flatNodes(A).out, b = flatNodes(B).out;
  Object.keys(b).forEach(id => { const x = a[id], y = b[id]; if (x && y.tg && x.tg !== y.tg) D.push({ id: id + ':tg', k: 'chg', t: 'What moves the file on after “' + short(y.n, 50) + '”', b: x.tg, a: y.tg }); });
  return D;
};

/* ---------------- Form design: the screens a step shows ---------------- */
const FLIB = {
  a1f: ['First name', 'Sameer'], a1l: ['Last name', 'Joshi'], a1mob: ['Contact number', '10-digit mobile', 1], atype: ['Type of applicant', 'Individual', 0, 1], a1pan: ['PAN', 'ABCDE1234F'], a1inc: ['Monthly pay (₹)', '1,24,000'],
  ltype: ['Type of loan', 'Home loan', 0, 1], loan: ['Loan amount (₹)', '55,00,000'], ten: ['Tenure (years)', '20'], ptype: ['Property type', 'Choose', 0, 1], price: ['Property value (₹)', '78,00,000'], city: ['Branch city', 'Pune', 0, 1],
  mid: ['Middle name', ''], email: ['Email', 'name@example.com'], dob: ['Date of birth', 'DD/MM/YYYY'], emp: ['Employer', 'Company name'], alt: ['Alternate number', '10-digit mobile'], lang: ['Preferred language', 'English', 0, 1], lsrc: ['Lead source', 'Walk-in', 0, 1], pin: ['Property pincode', '411038'], coap: ['Co-applicant name', '']
};
const LDOC = { adh: ['Aadhaar', 'Masked copy'], pan: ['PAN card', 'Card or e-PAN'], sal: ['Salary slips', 'Last 3 months'], bank6: ['Bank statements', 'Last 6 months'], f16: ['Form 16', 'Last 2 years'], itr: ['Latest ITR', 'With the computation of income'], photo: ['Photograph', 'Passport size'] };
const GDOC = {
  app: ['Application form, e-signed', 'All', 0], f16l: ['Form 16, two years', 'Salaried', 2], bank6l: ['Bank statements, 6 months', 'Salaried', 3], itr2: ['ITR with computation, two years', 'Self-employed', 2], bank12: ['Bank statements, 12 months', 'Self-employed', 3], gst: ['GST returns, 12 months', 'Self-employed', 2],
  ats: ['Agreement to sell', 'Resale', 4], deed: ['Sale deed (copy)', 'Resale', 4], ec: ['Encumbrance certificate, 13 years', 'Resale', 4], oc: ['Occupancy certificate', 'Resale', 4], share: ['Society share certificate and NOC', 'Resale flats', 4], allot: ['Allotment letter and builder NOC', 'Under construction', 4], plan: ['Approved plan and cost estimate', 'Self-construction', 4], tax: ['Property tax receipt', 'Resale', 4],
  kyc: ['KYC of every applicant: PAN and Aadhaar', 'All', 1], photo: ['Photograph of every applicant', 'All', 1], sal3: ['Salary slips, 3 months', 'Salaried', 2], pnl: ['Profit and loss and balance sheet, CA-certified', 'Self-employed', 2], chq: ['Cancelled cheque for the EMI mandate', 'All', 3]
};
/* documents asked from each co-applicant added at login */
const CDOC = { pan: ['PAN', 'Every co-applicant', 1], adh: ['Aadhaar, masked', 'Every co-applicant', 1], sal: ['Salary slips, 3 months', 'Earning, salaried', 2], f16: ['Form 16, two years', 'Earning, salaried', 2], itr: ['ITR with computation, two years', 'Earning, self-employed', 2], bank12: ['Bank statements, 12 months', 'Earning, self-employed', 3], bank6: ['Bank statements, 6 months', 'Earning, salaried', 3], photo: ['Photograph', 'Every co-applicant', 1], relp: ['Proof of relationship', 'Every co-applicant', 1] };
const fdef = (form, list) => list === 'fields' ? FLIB : list === 'codocs' ? CDOC : form === 'lead' ? LDOC : GDOC;
const coStr = f => f && f.on ? 'Allowed, up to ' + f.max : 'Not allowed';
const FORM0 = {
  lead: { fields: ['a1f', 'a1l', 'a1mob', 'atype', 'a1pan', 'a1inc', 'ltype', 'loan', 'ten', 'ptype', 'price', 'city'].map(k => ({ k, req: k === 'a1mob' ? 1 : 0 })), docs: ['adh', 'pan', 'sal'].map(k => ({ k, req: 0 })) },
  login: { docs: ['app', 'f16l', 'itr2', 'bank12', 'gst', 'ats', 'deed', 'ec', 'oc', 'share', 'allot', 'plan'].map(k => ({ k, req: k === 'gst' ? 0 : 1 })), fee: { on: 1, amt: 3540, adj: 1 },
    cofg: { on: 1, max: 3 }, codocs: ['pan', 'adh', 'sal', 'f16', 'itr', 'bank12'].map(k => ({ k, req: 1 })) }
};
/* the new setup's forms, as read from the lender's own application form, checklist and charges */
const FORMN = {
  lead: { fields: [['a1f', 0, 'AF'], ['a1l', 0, 'AF'], ['a1mob', 1, 'AF'], ['dob', 0, 'AF'], ['a1pan', 0, 'AF'], ['atype', 0, 'AF'], ['a1inc', 0, 'AF'], ['ltype', 0, 'AF'], ['loan', 0, 'AF'], ['ten', 0, 'AF'], ['ptype', 0, 'AF'], ['price', 0, 'AF'], ['city', 0, 'DC']].map(([k, req, src]) => ({ k, req, src })), docs: [['adh', 0], ['pan', 1], ['sal', 0], ['bank6', 0]].map(([k, req]) => ({ k, req, src: 'DC' })) },
  login: { docs: [['app', 1], ['f16l', 1], ['itr2', 1], ['bank12', 1], ['gst', 0], ['ats', 1], ['deed', 1], ['ec', 1], ['oc', 1], ['tax', 1], ['share', 1], ['allot', 1], ['plan', 1]].map(([k, req]) => ({ k, req, src: 'DC' })), fee: { on: 1, amt: 2950, adj: 1, src: 'SC' },
    cofg: { on: 1, max: 2, src: 'AF' }, codocs: [['pan', 1], ['adh', 1], ['sal', 1], ['f16', 1], ['itr', 1], ['bank12', 1], ['photo', 1]].map(([k, req]) => ({ k, req, src: 'DC' })) }
};
const FSCR = { T1: 'lead', T3: 'login' };
const FNM = { lead: 'New lead form', login: 'Login documents' };
const fmNm = (f, l) => l === 'codocs' ? 'Co-applicant documents' : FNM[f];
const fmLbl = (form, list, it) => it.l || (fdef(form, list)[it.k] || [it.k])[0];

/* ---------------- Onboarding: roles, SOPs and escalations ---------------- */
const OROLE = [
  ['rm', 'Sales RM', ['Amit Joshi, Pune Kothrud', 'Shweta Patil, Pune Baner', 'Rahul Bansal, Gurugram', 'Farida Khan, Mumbai Kandivali', 'Anoop Varghese, Kochi'], ['Capture every lead the day it comes in, with consent for the credit report', 'Collect the documents and send the file for login', 'Tell the customer about the sanction, with the key fact statement'], 'CRM and LOS: own leads and files'],
  ['tsl', 'Tele-sales', ['Divya Nair', 'Sunita Rawat'], ['Call every new lead within 5 minutes', 'Qualify the lead and book a call back or a branch visit', 'Hand interested leads to the RM for the branch'], 'CRM: own leads'],
  ['smgr', 'Sales manager', ['Nikhil Bhatia, head of retail sales'], ['Route leads, and reassign them when an RM is away', 'Watch the funnel and the team’s pending work', 'Nudge the team on files that are stuck'], 'CRM and LOS: every lead and file'],
  ['bops', 'Branch operations', ['Pradeep Kamble, Pune', 'Sana Shaikh, Mumbai'], ['Log in files with the application form, login fee and KYC', 'Issue the sanction letter and key fact statement', 'Collect the signed sanction letter'], 'LOS: files of the branch'],
  ['cm', 'Credit manager, L1', ['Rohit Kulkarni, Pune'], ['Check every login', 'Verify the income documents', 'Hold the personal discussion and write the credit memo', 'Decide files within the L1 limit'], 'LOS: files of the region'],
  ['rcm', 'Regional credit manager, L2', ['Sneha Iyer, West region'], ['Review memos with minor deviations', 'Decide files within the L2 limit', 'Approve OTC deferrals of up to 30 days'], 'LOS: files of the region'],
  ['zcm', 'Zonal credit manager, L3', ['Vikram Rao, West zone'], ['Decide files within the L3 limit', 'Clear valuations well below the price'], 'LOS: files of the zone'],
  ['nch', 'National credit head, L4', ['Meera Nair'], ['Decide files above the L3 limit', 'Own the credit policy with the credit committee'], 'LOS: every file'],
  ['cops', 'Central operations', ['Rajesh Pillai, head of operations', 'Swati Gokhale, Pune'], ['Collect the original title documents and list OTC and PDD items', 'Prepare the disbursement memo'], 'LOS: sanctioned files'],
  ['fcu', 'FCU manager', ['Harpreet Gill'], ['Check KYC, salary slips and bank statements for fraud', 'Report within 2 working days'], 'LOS: files sent for sampling'],
  ['lgl', 'Legal manager', ['Prakash Hegde'], ['Get the title search and legal opinion from an empanelled advocate', 'Answer the advocate’s queries'], 'LOS: property files'],
  ['tech', 'Technical manager', ['Meghna Bose'], ['Appoint an empanelled valuer', 'Check the valuation reports'], 'LOS: property files'],
  ['losadm', 'LOS administrator', [ADMIN.name], ['Change the setup, with a reason for each change', 'Keep the audit trail'], 'Admin']
];
const OSOPX = { tsl: [['Call every new lead within 5 minutes of it coming in', '5 minutes'], ['If there is no answer, try again at 30 minutes and at 2 hours', 'Same day'], ['Record the outcome and the next step in the CRM', 'Same day']], smgr: [['Check leads that are not called or not assigned, every hour', 'Every hour'], ['Go through Waiting on your team every morning, and nudge where needed', 'Daily']], losadm: [['Make every change to the live setup with a reason', 'As needed'], ['Check the audit trail every week', 'Weekly']] };
const OESC = [
  ['e1', 'A new lead is not called within 5 minutes', [['smgr', 15, 'min']]],
  ['e2', 'A complete file is not logged in within 4 working hours', [['smgr', 4, 'wh'], ['cops', 1, 'wd']]],
  ['e3', 'A legal or technical report is late', [['rcm', 1, 'wd'], ['zcm', 3, 'wd']]],
  ['e4', 'A credit decision is past its turnaround', [['rcm', 1, 'wd'], ['zcm', 2, 'wd']]],
  ['e5', 'A sanction letter is not issued within 1 working day', [['cops', 1, 'wd']]],
  ['e6', 'A disbursement memo is not authorised within 4 working hours', [['rcm', 4, 'wh']]]
];
const ESCK = [[/first call|new lead|not called/, 'e1'], [/logged in|log in|login/, 'e2'], [/legal|technical|valuation|title/, 'e3'], [/credit decision|decision/, 'e4'], [/sanction letter/, 'e5'], [/disbursement memo|\bdm\b|disbursement/, 'e6']];
const UNITS = { min: ['minute', 1], wh: ['working hour', 60], wd: ['working day', 540] };
const afterTxt = l => plural(l.n, UNITS[l.u][0]);
const ROLEN = id => { const r = OROLE.find(x => x[0] === id); return r ? r[1] : rn(id); };
function roleLim(id) { const A = POL.auth || {}; return { cm: 'Sanctions up to ' + lakh(A.L1), rcm: 'Sanctions up to ' + lakh(A.L2), zcm: 'Sanctions up to ' + lakh(A.L3), nch: 'Sanctions above ' + lakh(A.L3) }[id] || ''; }
function orgBuild(F, has) {
  const roles = has.roles ? OROLE.map(([id, n, ppl, resp, acc]) => ({ id, n, ppl: ppl.slice(), resp: resp.slice(), acc, src: 'RMX' })) : [];
  const sops = [];
  if (has.sops && F) (roles.length ? roles : OROLE.map(([id, n]) => ({ id, n }))).forEach(r => {
    const steps = []; eachStep(F, (t, g) => { if (t.r === r.id) steps.push({ id: r.id + '-' + steps.length, t: t.n, sla: slaTxt(t.sla), src: (t.src || [])[0] ? refLbl(t.src[0]) : '' }); });
    (OSOPX[r.id] || []).forEach(([t, sla]) => steps.push({ id: r.id + '-' + steps.length, t, sla, src: 'Standard home loan SOP' }));
    if (steps.length) sops.push({ id: r.id, steps });
  });
  const esc = has.esc ? OESC.map(([id, t, lv]) => ({ id, t, lv: lv.map(([r, n, u]) => ({ r, n, u })) })) : [];
  return { roles, sops, esc };
}

/* ---------------- voice notes, a document, and examples ---------------- */
const TKS = {
  lead: { voice: { n: 'Voice note from Nikhil Bhatia, head of retail sales', meta: '0:31. Hindi and English. Mon 16 Nov 2026, 9:12', who: 'Nikhil Bhatia', role: 'smgr', dur: 31, segs: [
      { t: 0, o: 'Lead form mein email bhi le lo, offer aur updates bhejne ke liye.', e: 'Add email to the lead form too, to send offers and updates.' },
      { t: 11, o: 'PAN ko mandatory kar do.', e: 'Make PAN mandatory.' },
      { t: 17, o: 'Aur branch city hata do, woh RM ki branch se aa jaata hai.', e: 'And remove branch city; it comes from the RM’s branch.' }] },
    sug: ['Make PAN mandatory', 'Add email after the contact number', 'Remove branch city', 'Move property value above loan amount', 'Ask for bank statements for 6 months'] },
  login: { voice: { n: 'Voice note from Rajesh Pillai, head of operations', meta: '0:26. English. Sat 14 Nov 2026, 11:20', who: 'Rajesh Pillai', role: 'cops', dur: 26, segs: [
      { t: 0, o: 'From December we are waiving the application fee for home loans.', e: '' },
      { t: 9, o: 'And for salaried customers, add six months of bank statements to the login documents.', e: '' }] },
    sug: ['Stop collecting the application fee', 'Set the application fee to ₹2,500 plus GST', 'Add the property tax receipt', 'Make GST returns mandatory', 'Remove the occupancy certificate', 'Ask co-applicants for a photograph'] },
  org: { voice: { n: 'Voice note from Meera Nair, national credit head', meta: '0:34. Hindi and English. Fri 13 Nov 2026, 18:05', who: 'Meera Nair', role: 'nch', dur: 34, segs: [
      { t: 0, o: 'Credit decision late ho toh RCM ko ek din nahi, 4 working hours mein bata do.', e: 'If a credit decision is late, tell the RCM after 4 working hours, not one day.' },
      { t: 13, o: 'Legal ya technical report paanch working days se late ho, toh mujhe bhi escalate karo.', e: 'If a legal or technical report is late by 5 working days, escalate it to me too.' },
      { t: 25, o: 'Aur Kavita Rane Monday se tele-sales mein join kar rahi hai.', e: 'And Kavita Rane joins tele-sales from Monday.' }] },
    doc: { n: 'Operations circular OPS-2026-09.pdf', meta: '1 page. Issued 13 Nov 2026 by Rajesh Pillai', who: 'Operations circular OPS-2026-09', role: 'cops', lines: ['1. A disbursement memo not authorised within 4 working hours goes to the zonal credit manager after 1 working day.', '2. Ritu Sharma joins branch operations in Pune from 1 December.', '3. Add to the branch operations SOP: check the original sale deed against the scanned copy at login.'] },
    sug: ['Escalate a late valuation to the zonal credit manager after 2 working days', 'Add Kavita Rane to tele-sales', 'Add to the Sales RM SOP: call the customer within 1 hour of a sanction'] }
};

/* ---------------- state ---------------- */
const tkNew = () => ({ k: null, phase: 'pick', step: 0, props: [], miss: [], txt: '', pt: 0, play: 0, added: '' });
const _initAdmin11 = initAdmin;
initAdmin = function () {
  _initAdmin11(); if (!ADM) return;
  Object.assign(ADM, { sec: 'disc', disc: { phase: 'pick', step: 0, steps: [], read: {} }, fsel: 'T1', osec: 'roles', oed: null, drag: null,
    fm: { onb: null, live: deep(FORM0), liveW: deep(FORM0), ver: '7.0', sched: null }, fmHi: [], ogHi: [], osop: null,
    org: { onb: null, onbSrc: {}, live: orgBuild(ADM.live.wf, { roles: 1, sops: 1, esc: 1 }), liveW: null },
    tk: { lead: tkNew(), login: tkNew(), org: tkNew() } });
  ADM.org.liveW = deep(ADM.org.live);
};
const FM = () => ONB() ? ADM.fm.onb : ADM.fm.liveW;
const ORGC = () => ONB() ? ADM.org.onb : ADM.org.liveW;
function ochg(area, what, b, a, why) { if (ONB()) alog2({ area, what, b: b || '', a: a || '', why: why || 'Edited in the new setup' }); }

/* ---------------- the page ---------------- */
function emptyHTML(ico, h, p, act, lbl) { return `<section class="panel emp11"><div class="pb">${ic(ico)}<div><h3>${esc(h)}</h3><p>${esc(p)}</p>${act ? `<button class="btn btn-p btn-sm" data-act="${act.split('|')[0]}" data-v="${act.split('|')[1] || ''}">${esc(lbl)}</button>` : ''}</div></div></section>`; }
adminHTML = function () {
  if (!ADM) initAdmin();
  const onb = ONB(), st = staged(), O = ADM.onb, D = ADM.disc;
  const head = `<div class="adm-h adm-h9">
  <div class="adm-mode" role="tablist" aria-label="View">${[['onb', 'New setup', 'Build it from your documents'], ['live', 'Live setup', 'Change what is running']].map(([k, l, s]) => `<button class="${ADM.mode === k ? 'on' : ''}" data-act="amode" data-v="${k}" role="tab" aria-selected="${ADM.mode === k}"><b>${l}</b><small>${s}</small></button>`).join('')}</div></div>`;
  const F = onb ? O.wf : ADM.live.wfW, fs = F ? flowStats(F) : null, rulesN = PRULES.length, apiOn = apiList().filter(a => a.on).length, G = ORGC(), fm = FM();
  const askN = onb && O.pol ? PRULES.filter(r => r.ask && (O.loc[r.id] == null || O.loc[r.id] === '')).length : 0, nAdd = Object.keys(O.src).filter(k => O.src[k]).length;
  const tabs = [
    ['disc', 'Discovery', onb ? (D.phase === 'done' ? plural(Object.keys(D.read).length, 'document') + ' read' : nAdd ? nAdd + ' of 11 documents added' : 'Nothing added yet') : '11 documents on file', onb && D.phase === 'done', 0],
    ['wf', 'Workflow', onb ? (F ? plural(fs.steps, 'step') + (fs.flags ? ', ' + fs.flags + ' to check' : '') : 'Not built yet') : 'Version ' + ADM.live.ver + ', ' + plural(fs.steps, 'step'), onb && F && !fs.flags, st.wf.length],
    ['form', 'Form design', onb ? (fm ? 'New lead and login' : 'Not drafted yet') : 'Version ' + ADM.fm.ver, onb && !!fm, st.form.length],
    ['pol', 'Policy rules', onb ? (O.pol ? plural(rulesN, 'rule') + (askN ? ', ' + askN + ' to set' : '') : 'Not read yet') : 'Version ' + POL.ver + ', ' + plural(rulesN, 'rule'), onb && O.pol && !askN, st.pol.length],
    ['api', 'Vendors and APIs', plural(apiOn, 'call') + ' in use', onb && O.apiOk, st.api.length],
    ['aud', 'Audit trail', plural(ADM.aud.filter(e => e.view === ADM.mode).length, 'entry', 'entries'), 0, 0],
    ['org', 'Onboarding', G ? plural(G.roles.length, 'role') + ', ' + plural(G.esc.length, 'escalation') : 'Not set up yet', onb && !!G && G.roles.length > 0, st.org.length]];
  const tabH = `<nav class="adm-t adm-t7" role="tablist" aria-label="Sections">${tabs.map(([k, l, s, ok, ch]) => `<button class="${ADM.sec === k ? 'on' : ''}" data-act="asec" data-v="${k}" role="tab" aria-selected="${ADM.sec === k}"><b>${ok ? ic('check') : ''}${esc(l)}</b><small>${esc(s)}</small>${ch ? `<span class="adm-ch">${ch} unsaved</span>` : ''}</button>`).join('')}</nav>`;
  const ready = onb && F && !fs.flags && O.pol && !askN && O.apiOk && fm && G && G.roles.length;
  const banner = ready ? `<div class="adm-ready">${ic('check')}<div><b>${O.live ? 'Go-live scheduled' : 'Ready to go live'}</b><span>${O.live ? 'This setup goes live on ' + GOLIVE + '. Until then, files run on the current live setup.' : 'The workflow, the forms, the policy rules, the vendors and the roles are set, and every question is answered.'}</span></div>${O.live ? '' : `<button class="btn btn-p btn-sm" data-act="ogolive">${ic('clock')}Schedule go-live</button>`}</div>` : '';
  const body = { disc: discHTML, wf: wfSecHTML, form: formSecHTML, pol: polSecHTML, api: apiSecHTML, aud: audSecHTML, org: orgSecHTML }[ADM.sec]();
  return `<div class="adm${st.n ? ' has-bar' : ''}">${head}${onb || ADM.sec === 'form' || ADM.sec === 'org' ? '' : ikHTML()}${banner}${tabH}<div class="adm-b">${body}</div>${st.n ? saveBarHTML(st) : ''}</div>`;
};

/* ---------------- 1. Discovery ---------------- */
function discHTML() {
  const O = ADM.onb, D = ADM.disc, onb = ONB();
  if (onb && D.phase === 'run') return runHTML(D.steps, D.step, 'Reading what you added');
  const item = (k, feeds) => {
    const s = dsrc(k), on = onb ? !!O.src[k] : true, rd = onb ? (D.read[k] || (k === 'POL' && O.pol && O.src.POL)) : DLIVE[k];
    const meta = rd ? (onb ? 'Read: ' + DTOOK[k] : rd) : s.meta;
    const tag = `<span class="dc-f">${feeds.map(f => `<i>${FEED[f]}</i>`).join('')}</span>`;
    if (!onb) return `<div class="sp6 on ro">${ic(s.ic || 'file')}<span><b>${esc(s.n)}</b><small>${esc(meta)}</small>${tag}</span></div>`;
    return `<button class="sp6${on ? ' on' : ''}${rd ? ' rd' : ''}" data-act="dsrc" data-v="${k}" aria-pressed="${on}">${ic(on ? 'check' : 'plus')}<span><b>${esc(s.n)}</b><small>${esc(on ? meta : s.meta)}</small>${tag}</span></button>`;
  };
  const n = Object.keys(O.src).filter(k => O.src[k]).length, txt = (O.txt || '').trim();
  const grp = ([g, t, sub, ico, items]) => `<section class="cap-c dc-c"><header>${ic(ico)}<div><b>${esc(t)}</b><small>${esc(sub)}</small></div></header>${items.map(([k, f]) => item(k, f)).join('')}${g === 'proc' && onb ? `<label class="dc-t"><span>In your own words</span><textarea class="ta cap-ta" id="ocap" rows="3" placeholder="For example: The credit manager checks every login within 4 working hours.">${esc(O.txt)}</textarea></label>` : ''}</section>`;
  const top = onb ? `<div class="cap6-h"><h3>Discovery</h3><p>Collect what Uncia needs to set up your home loan journey: how the work is done, the credit policy, your forms and charges, who does what, and your vendors. Add what you have, in any mix. Uncia reads it all and builds each section from it, showing where every item came from.</p></div>
    <div class="dc-prog"><b>${n} of 11 documents added</b><span class="up-bar"><i style="width:${n / 11 * 100}%"></i></span><span>${D.phase === 'done' ? 'Read. Change what you added and read it again to rebuild' : 'From your document library. PDF, Word, Excel, scans and recordings all work'}</span></div>`
    : `<div class="cap6-h"><h3>Source library</h3><p>The documents the live setup was built from, and what each one feeds. To change the live setup from a new document, a voice note or a few lines, use Change something at the top of this page.</p></div>`;
  const go = onb ? `<div class="cap6-go">${D.phase === 'done' ? '<span class="cap-warn">Reading again rebuilds the sections from these sources, and replaces your edits to them.</span>' : ''}<span id="dcN">${plural(n + (txt ? 1 : 0), 'source')} added</span><button class="btn btn-p" data-act="dread" id="dreadGo"${n || txt ? '' : ' disabled'}>${ic('wand')}${D.phase === 'done' ? 'Read again' : 'Read everything'}</button></div>` : '';
  return top + `<div class="dc-g">${DGRP.map(grp).join('')}</div>` + go + (onb && D.phase === 'done' ? discResHTML() : '');
}
function discResHTML() {
  const O = ADM.onb, fs = O.wf ? flowStats(O.wf) : null, G = ADM.org.onb, fm = ADM.fm.onb;
  const askN = O.pol ? PRULES.filter(r => r.ask && (O.loc[r.id] == null || O.loc[r.id] === '')).length : 0;
  const card = (k, ok, t, s, need) => `<button class="dr-c${ok ? ' ok' : ''}" data-act="asec" data-v="${k}">${ic(ok ? 'check' : 'alert')}<span><b>${esc(t)}</b><small>${esc(ok ? s : need)}</small></span>${ic('fwd')}</button>`;
  return `<section class="panel dr11"><div class="ph"><h3>What was built</h3><span class="note">Open a section to check it and make changes</span></div><div class="pb dr-g">
  ${card('wf', !!fs, 'Workflow', fs ? plural(fs.steps, 'step') + ', ' + plural(fs.decs, 'decision') + (fs.flags ? '. ' + plural(fs.flags, 'question') + ' for you' : '') : '', 'Not built: add the SOP, the walkthrough or a few lines of text')}
  ${card('form', !!fm, 'Form design', 'The new lead form and the login documents', 'Not drafted: add the application form, the checklist or the charges')}
  ${card('pol', !!O.pol, 'Policy rules', plural(PRULES.length, 'rule') + (askN ? '. ' + askN + ' needs a number from you' : ''), 'Not read: add the credit policy')}
  ${card('api', true, 'Vendors and APIs', ADM.disc.read.VEN ? 'From your vendor list. Confirm them' : 'A recommended setup to confirm', '')}
  ${card('org', !!(G && (G.roles.length || G.esc.length)), 'Onboarding', G ? plural(G.roles.length, 'role') + ', ' + plural(G.sops.length, 'SOP') + ', ' + plural(G.esc.length, 'escalation') : '', 'Not set up: add the role master or the escalation matrix')}</div></section>`;
}
function discBuild(att, txt) {
  const O = ADM.onb, D = ADM.disc, proc = att.filter(k => ['S1', 'S2', 'S3', 'S4'].includes(k)), has = k => att.includes(k);
  D.read = {}; att.forEach(k => { D.read[k] = 1; });
  if (proc.length || txt) {
    O.wf = buildFlow(proc, txt, false); O.phase = 'done'; ADM.sel = null; const fs = flowStats(O.wf);
    alog2({ area: 'wf', what: 'Built the workflow from ' + plural(proc.length + (txt ? 1 : 0), 'source'), a: plural(fs.steps, 'step') + ', ' + plural(fs.decs, 'decision') + ', ' + plural(fs.stages, 'stage'), why: 'Discovery', src: listAnd(proc.map(k => WSRC[k].n).concat(txt ? ['typed text'] : [])) });
  }
  if (has('POL')) { O.polOn = 1; O.pol = deep(POL12); O.loc = {}; PRULES.forEach(r => { if (!r.p && r.u !== 'grid' && r.u !== 'rbi') O.loc[r.id] = r.v; }); O.polPhase = 'done'; alog2({ area: 'pol', what: 'Read the credit policy', a: plural(PRULES.length, 'rule') + ' with ' + polLimits() + ' limits', why: 'Discovery', src: PDOC.n }); }
  const fsrc = ['AF', 'DC', 'SC'].filter(has);
  if (fsrc.length) { ADM.fm.onb = deep(FORMN); alog2({ area: 'form', what: 'Drafted the new lead form and the login documents', a: plural(FORMN.lead.fields.length, 'field') + ', ' + plural(FORMN.login.docs.length, 'login document'), why: 'Discovery', src: listAnd(fsrc.map(k => DSRC[k].n)) }); }
  if (has('RMX') || has('ESC') || (has('S1') && O.wf)) {
    ADM.org.onb = orgBuild(O.wf, { roles: has('RMX'), sops: has('S1') && !!O.wf, esc: has('ESC') }); ADM.org.onbSrc = { RMX: has('RMX'), ESC: has('ESC'), S1: has('S1') };
    const G = ADM.org.onb; alog2({ area: 'org', what: 'Set up the roles, SOPs and escalations', a: plural(G.roles.length, 'role') + ', ' + plural(G.sops.length, 'SOP') + ', ' + plural(G.esc.length, 'escalation'), why: 'Discovery', src: listAnd(['RMX', 'ESC', 'S1'].filter(has).map(k => dsrc(k).n)) });
  }
  alog2({ area: 'disc', what: 'Read ' + plural(att.length + (txt ? 1 : 0), 'source'), a: listAnd(att.map(k => dsrc(k).n).concat(txt ? ['typed text'] : [])), why: 'New setup' });
}

/* ---------------- shared bits ---------------- */
function emptyHTML2(ico, h, p, acts) { return `<section class="panel emp11"><div class="pb">${ic(ico)}<div><h3>${esc(h)}</h3><p>${esc(p)}</p><div class="emp-a">${acts.map(([a, v, l, pri]) => `<button class="btn ${pri ? 'btn-p' : 'btn-s'} btn-sm" data-act="${a}" data-v="${esc(v)}">${esc(l)}</button>`).join('')}</div></div></div></section>`; }
const runDisc = () => runHTML(ADM.disc.steps, ADM.disc.step, 'Reading what you added');

/* ---------------- 2. Workflow: drawn from what Discovery read ---------------- */
capAtt = function () { const D = ADM.disc, src = D && D.phase === 'done' ? D.read : ADM.onb.src; return ['S1', 'S2', 'S3', 'S4'].filter(k => src[k]); };
const _wfSecHTML11 = wfSecHTML;
wfSecHTML = function () {
  if (ONB() && ADM.disc.phase === 'run') return runDisc();
  if (ONB() && !ADM.onb.wf) return emptyHTML2('route', 'No workflow yet', 'Add how the work is done in Discovery: the SOP, a recorded walkthrough or a few lines in your own words. Uncia draws the workflow from it, with what moves a file on from every step.', [['asec', 'disc', 'Go to Discovery', 1]]);
  return _wfSecHTML11();
};

/* ---------------- drafts in the live setup: forms and onboarding too ---------------- */
function fmDiff(A, B) {
  const D = []; if (!A || !B) return D;
  [['lead', 'fields'], ['lead', 'docs'], ['login', 'docs'], ['login', 'codocs']].forEach(([f, l]) => {
    const a = A[f][l] || [], b = B[f][l] || [], ak = a.map(x => x.k), bk = b.map(x => x.k), lb = it => fmLbl(f, l, it), w = l === 'fields' ? 'field' : 'document', nm = fmNm(f, l), id = k => f + '|' + l + '|' + k, rq = x => x.req ? 'Required' : 'Optional';
    b.forEach(it => { const o = a.find(x => x.k === it.k);
      if (!o) { D.push({ id: id(it.k), k: 'add', t: nm + ': added the ' + w + ' “' + lb(it) + '”', b: '', a: rq(it) }); return; }
      if (!!o.req !== !!it.req) D.push({ id: id(it.k), k: 'chg', t: nm + ': “' + lb(it) + '”', b: rq(o), a: rq(it) });
      if ((o.l || '') !== (it.l || '')) D.push({ id: id(it.k), k: 'chg', t: nm + ': renamed a ' + w, b: lb(o), a: lb(it) }); });
    a.forEach(it => { if (!bk.includes(it.k)) D.push({ id: id(it.k), k: 'del', t: nm + ': removed the ' + w + ' “' + lb(it) + '”', b: rq(it), a: 'Removed' }); });
    const x = ak.filter(k => bk.includes(k)), y = bk.filter(k => ak.includes(k));
    if (x.join() !== y.join()) D.push({ id: id(':ord'), k: 'chg', t: nm + ': changed the order of the ' + w + 's' });
  });
  const fa = A.login.fee, fb = B.login.fee;
  if (fa.on !== fb.on || (fb.on && fa.amt !== fb.amt)) D.push({ id: 'login|fee', k: 'chg', t: 'Login documents: application fee', b: feeStr(fa), a: feeStr(fb) });
  if (fa.on && fb.on && !!fa.adj !== !!fb.adj) D.push({ id: 'login|fee', k: 'chg', t: 'Login documents: application fee adjusted against the processing fee', b: fa.adj ? 'Yes' : 'No', a: fb.adj ? 'Yes' : 'No' });
  const ca = A.login.cofg, cb = B.login.cofg;
  if (ca && cb && (ca.on !== cb.on || (cb.on && ca.max !== cb.max))) D.push({ id: 'login|cofg', k: 'chg', t: 'Login documents: co-applicants at login', b: coStr(ca), a: coStr(cb) });
  return D;
}
const feeStr = f => f.on ? inr(f.amt) + ', with GST' : 'Not collected';
const orgRN = (G, id) => { const r = G && G.roles.find(x => x.id === id); return r ? r.n : ROLEN(id); };
const escStr = (G, e) => e.lv.length ? e.lv.map(l => orgRN(G, l.r) + ' after ' + afterTxt(l)).join('; ') : 'No one';
function orgDiff(A, B) {
  const D = []; if (!A || !B) return D;
  B.roles.forEach(r => { const o = A.roles.find(x => x.id === r.id), id = 'role|' + r.id;
    if (!o) { D.push({ id, k: 'add', t: 'Added the role “' + r.n + '”', b: '', a: r.ppl.length ? listAnd(r.ppl.map(p => p.split(',')[0])) : 'No one yet' }); return; }
    if (o.n !== r.n) D.push({ id, k: 'chg', t: 'Renamed a role', b: o.n, a: r.n });
    r.ppl.filter(p => !o.ppl.includes(p)).forEach(p => D.push({ id, k: 'chg', t: r.n + ': added a person', b: '', a: p }));
    o.ppl.filter(p => !r.ppl.includes(p)).forEach(p => D.push({ id, k: 'chg', t: r.n + ': removed a person', b: p, a: 'Removed' }));
    if (o.resp.join('\n') !== r.resp.join('\n')) D.push({ id, k: 'chg', t: r.n + ': responsibilities', b: plural(o.resp.length, 'line'), a: plural(r.resp.length, 'line') });
    if (o.acc !== r.acc) D.push({ id, k: 'chg', t: r.n + ': access', b: o.acc, a: r.acc }); });
  A.roles.forEach(r => { if (!B.roles.some(x => x.id === r.id)) D.push({ id: 'role|' + r.id, k: 'del', t: 'Removed the role “' + r.n + '”', b: '', a: 'Removed' }); });
  B.sops.forEach(s => { const o = A.sops.find(x => x.id === s.id) || { steps: [] }, nm = orgRN(B, s.id) + ' SOP', id = 'sop|' + s.id;
    s.steps.forEach(st => { const m = o.steps.find(x => x.id === st.id);
      if (!m) { D.push({ id, k: 'add', t: nm + ': added a step', b: '', a: st.t + ' (' + st.sla + ')' }); return; }
      if (m.t !== st.t) D.push({ id, k: 'chg', t: nm + ': changed a step', b: m.t, a: st.t });
      if (m.sla !== st.sla) D.push({ id, k: 'chg', t: nm + ': turnaround of “' + short(st.t, 44) + '”', b: m.sla, a: st.sla }); });
    o.steps.forEach(st => { if (!s.steps.some(x => x.id === st.id)) D.push({ id, k: 'del', t: nm + ': removed a step', b: st.t, a: 'Removed' }); }); });
  A.sops.forEach(s => { if (!B.sops.some(x => x.id === s.id)) D.push({ id: 'sop|' + s.id, k: 'del', t: orgRN(A, s.id) + ' SOP: removed', b: plural(s.steps.length, 'step'), a: 'Removed' }); });
  B.esc.forEach(e => { const o = A.esc.find(x => x.id === e.id), id = 'esc|' + e.id;
    if (!o) { D.push({ id, k: 'add', t: 'Added an escalation: ' + e.t, b: '', a: escStr(B, e) }); return; }
    if (o.t !== e.t) D.push({ id, k: 'chg', t: 'Renamed an escalation', b: o.t, a: e.t });
    if (escStr(A, o) !== escStr(B, e)) D.push({ id, k: 'chg', t: 'Escalation: ' + short(e.t, 60), b: escStr(A, o), a: escStr(B, e) }); });
  A.esc.forEach(e => { if (!B.esc.some(x => x.id === e.id)) D.push({ id: 'esc|' + e.id, k: 'del', t: 'Removed an escalation: ' + e.t, b: escStr(A, e), a: 'Removed' }); });
  return D;
}
staged = function () {
  if (!ADM || ONB()) return { pol: [], api: [], wf: [], form: [], org: [], n: 0 };
  const pol = polDiffs(), api = apiDiffs(), wf = flowDiff(ADM.live.wf, ADM.live.wfW), form = fmDiff(ADM.fm.live, ADM.fm.liveW), org = orgDiff(ADM.org.live, ADM.org.liveW);
  return { pol, api, wf, form, org, n: pol.length + api.length + wf.length + form.length + org.length };
};
saveBarHTML = function (st) {
  const parts = [['wf', st.wf.length], ['form', st.form.length], ['pol', st.pol.length], ['api', st.api.length], ['org', st.org.length]].filter(x => x[1]).map(([k, n]) => AREA[k] + ' ' + n).join(', ');
  const list = st.wf.map(d => ['wf', d.t, d.b, d.a]).concat(st.form.map(d => ['form', d.t, d.b, d.a]), st.pol.map(d => ['pol', d.l, d.fb, d.fa]), st.api.map(d => ['api', d.t, d.b, d.a]), st.org.map(d => ['org', d.t, d.b, d.a]));
  return `<div class="sbar6">${ADM.showCh ? `<ul class="sb-l">${list.map(([k, t, b, a]) => `<li><span class="ar6 ${k}">${AREA[k]}</span><span>${esc(t)}${b || a ? `: ${b ? `<s>${esc(b)}</s> ${ic('fwd')} ` : ''}<b>${esc(a || '')}</b>` : ''}</span></li>`).join('')}</ul>` : ''}
  <div class="sb-r"><button class="sb-n" data-act="ashow" aria-expanded="${!!ADM.showCh}"><b>${plural(st.n, 'unsaved change')}</b><small>${esc(parts)}. ${ADM.showCh ? 'Hide' : 'See'} them</small></button><input class="inp2${ADM.needWhy ? ' bad' : ''}" id="admWhy" placeholder="Reason, for the audit trail (required)" value="${esc(ADM.why)}" aria-label="Reason for the change"><button class="btn btn-s" data-act="adiscard">Discard</button><button class="btn btn-p" data-act="asave">${ic('check')}Save and apply</button></div></div>`;
};
const FMNEXT = 'Tuesday 17 November 2026, at 8:00';
const _adiscard11 = ACT.adiscard, _amode11 = ACT.amode, _opsrc11 = ACT.opsrc, _resetall11 = ACT.resetall, _asec11 = ACT.asec;
Object.assign(ACT, {
  adiscard() { if (ADM && ADM.fm) { ADM.fm.liveW = deep(ADM.fm.live); ADM.org.liveW = deep(ADM.org.live); ADM.oed = null; Object.values(ADM.tk).forEach(t => { t.added = ''; }); } _adiscard11(); },
  amode(v) { TKP.stop(); if (ADM) ADM.oed = null; _amode11(v); },
  opsrc() { _opsrc11(); ADM.onb.src.POL = ADM.onb.polOn ? 1 : 0; },
  orebuild() { ADM.sec = 'disc'; ADM.sel = null; render(); },
  asave() {
    const st = staged(), why = (ADM.why || '').trim(); if (!st.n) return;
    if (!why) { ADM.needWhy = 1; render(); const el = $('#admWhy'); if (el) el.focus(); toast('Add a reason first, for the audit trail'); return; }
    const at = tick(2), src = ADM.src || '', srcK = ADM.srcK || '';
    const pp = st.pol.filter(d => d.p);
    if (pp.length) { const p = deep(POL); pp.forEach(d => setP(p, d.p, d.to)); p.ver = POL.ver + 1; p.at = at; p.maker = ADMIN.name; p.checker = null; p.note = 'Changed on the Admin page: ' + pp.map(d => d.l + ', ' + d.fb + ' to ' + d.fa).join('; ') + '. Reason: ' + why; POL = p; VERS.unshift(deep(p)); }
    st.pol.forEach(d => { if (d.id) ADM.loc[d.id] = d.to; alog2({ at, area: 'pol', what: d.l, b: d.fb, a: d.fa, why, src, srcK }); });
    st.api.forEach(d => { const a = ADM.live.api.find(x => x.id === d.id); a[d.f] = ADM.ae[d.id][d.f]; alog2({ at, area: 'api', what: d.t, b: d.b, a: d.a, why, src, srcK }); });
    if (st.wf.length) { ADM.live.wf = deep(ADM.live.wfW); ADM.live.ver = (parseFloat(ADM.live.ver) + 0.1).toFixed(1); st.wf.forEach(d => alog2({ at, area: 'wf', what: d.t, b: d.b, a: d.a, why, src, srcK })); }
    if (st.form.length) { ADM.fm.live = deep(ADM.fm.liveW); if (!ADM.fm.sched) ADM.fm.prev = ADM.fm.ver; ADM.fm.ver = (parseFloat(ADM.fm.ver) + 0.1).toFixed(1); ADM.fm.sched = FMNEXT; st.form.forEach(d => alog2({ at, area: 'form', what: d.t, b: d.b, a: d.a, why: why + '. Live from ' + FMNEXT, src, srcK })); }
    if (st.org.length) { ADM.org.live = deep(ADM.org.liveW); st.org.forEach(d => alog2({ at, area: 'org', what: d.t, b: d.b, a: d.a, why, src, srcK })); }
    ADM.pe = {}; ADM.le = {}; ADM.ae = {}; ADM.why = ''; ADM.src = ''; ADM.srcK = ''; ADM.needWhy = 0; ADM.showCh = 0; ADM.ik.added = ''; ADM.oed = null; Object.values(ADM.tk).forEach(t => { t.added = ''; });
    render(); toast(plural(st.n, 'change') + ' applied and logged' + (pp.length ? '. Policy version ' + POL.ver + ' is live' : '') + (st.form.length ? '. The forms change on ' + FMNEXT.replace(', at', ' at') : ''));
  }
});

/* ---------------- audit trail: every section ---------------- */
audSecHTML = function () {
  const F = [['all', 'All'], ['disc', 'Discovery'], ['wf', 'Workflow'], ['form', 'Form design'], ['pol', 'Policy rules'], ['api', 'Vendors and APIs'], ['org', 'Onboarding']], ok = verifyAud();
  const L = ADM.aud.filter(e => e.view === ADM.mode && (ADM.af === 'all' || e.area === ADM.af)).slice().reverse();
  return `<div class="aud-top"><div class="aud-f">${F.map(([k, l]) => `<button class="flt${ADM.af === k ? ' on' : ''}" data-act="aaf" data-v="${k}">${l}</button>`).join('')}</div><span class="nav-sp"></span><button class="btn btn-s btn-sm" data-act="averify">${ic('shield')}Check the trail</button><button class="btn btn-s btn-sm" data-act="aexport">${ic('down')}Export as CSV</button></div>
  <div class="chain6 ${ok ? 'ok' : 'bad'}">${ic(ok ? 'link' : 'alert')}<span>${ok ? 'Intact: ' + plural(ADM.aud.length, 'entry', 'entries') + ' across both views, each carrying the hash of the one before it.' : 'Broken: an entry was changed.'} Entries cannot be edited or deleted, including by administrators.</span></div>
  <section class="panel"><div class="pb aud-w"><table class="aud6"><thead><tr><th>When</th><th>Who</th><th>Area</th><th>What changed</th><th>Reason or source</th></tr></thead><tbody>${L.map(e => `<tr><td class="nw">${esc(fds(e.at))}<small>${esc(ftime(e.at))}</small></td><td><b>${esc(e.who)}</b><small>${esc(e.role)}</small></td><td><span class="ar6 ${e.area}">${esc(AREA[e.area])}</span></td><td><b>${esc(e.what)}</b>${e.b || e.a ? `<small>${e.b ? `<s>${esc(e.b)}</s> ${ic('fwd')} ` : ''}${esc(e.a || '')}</small>` : ''}</td><td>${esc(e.why || '')}${e.src ? `<small>${ic(SRCIC[e.srcK] || 'file')}${esc(e.src)}</small>` : ''}</td></tr>`).join('') || `<tr><td colspan="5" class="muted">Nothing logged ${ONB() ? 'in the new setup ' : ''}yet.</td></tr>`}</tbody></table></div></section>`;
};
/* vendors read from the lender's own list */
const _apiSecHTML11 = apiSecHTML;
apiSecHTML = function () { const h = _apiSecHTML11(); return ONB() && ADM.disc.read.VEN ? h.replace('A recommended setup to start from. For each call, pick the first-choice vendor and the one to switch to if it fails.', 'Read from your vendor list: the first-choice vendor for each call, and the one to switch to if it fails. Check them and confirm.') : h; };

/* ---------------- 3. Form design ---------------- */
function fdList(F) {
  if (!F) return [{ id: 'g1', n: 'Lead', items: [{ id: 'T1', n: XT[0].n, r: 'rm', sla: XT[0].sla, trg: { k: 'auto', t: TRG.T1[1] }, scr: 'lead', d: 0 }] }, { id: 'g2', n: 'Login', items: [{ id: 'T3', n: XT[2].n, r: 'bops', sla: XT[2].sla, trg: { k: 'auto', t: TRG.T3[1] }, scr: 'login', d: 0 }] }];
  const pref = { lead: findNode(F, 'T1') ? 'T1' : '', login: findNode(F, 'T3') ? 'T3' : '' }, seen = {};
  return F.stages.map(g => {
    const items = [];
    const add = (it, d, arm) => {
      let scr = FSCR[it.id] || (g.id === 'g1' && /\blead\b/i.test(it.n) ? 'lead' : g.id === 'g2' && /log ?in/i.test(it.n) ? 'login' : null);
      if (scr && ((pref[scr] && pref[scr] !== it.id) || seen[scr])) scr = null; if (scr) seen[scr] = 1;
      items.push({ id: it.id, n: it.n, r: it.r, sla: it.sla, trg: trgOf(it), scr, d, arm }); };
    const w = (arr, d, arm) => arr.forEach(it => { if (it.t === 'step') add(it, d, arm); else if (it.t === 'dec') { items.push({ dec: 1, n: it.q, d }); it.arms.forEach(a => w(a.items, d + 1, a.l)); } else if (it.t === 'par') { items.push({ dec: 1, par: 1, n: 'At the same time', d }); w(it.lanes, d + 1, ''); } });
    w(g.items, 0, '');
    return { id: g.id, n: g.n, items };
  });
}
function fdDm() { const dm = {}; if (!ONB()) fmDiff(ADM.fm.live, ADM.fm.liveW).forEach(d => { if (!dm[d.id] || d.k === 'add') dm[d.id] = d.k; }); return dm; }
const isHi = id => (ADM.fmHi || []).includes(id);
const dTag = st => st ? `<span class="wf-tag ${st === 'add' ? 'add' : 'chg'}">${st === 'add' ? 'New' : 'Changed'}</span>` : '';
function formSecHTML() {
  const onb = ONB();
  if (onb && ADM.disc.phase === 'run') return runDisc();
  const fm = FM();
  const head = `<div class="fd-hd"><div class="cap6-h"><h3>Form design</h3><p>Pick a step in the workflow to see the screen it shows. The new lead form and the login documents can be changed: drag fields and documents into place, switch them between required and optional, or tell Uncia what to change by voice note or in a few words.</p></div>${onb ? '' : `<div class="fd-ver">${ic('layers')}<span><b>Forms version ${esc(ADM.fm.ver)}</b><small>${ADM.fm.sched ? 'Goes live on ' + esc(ADM.fm.sched) + '. Until then the screens show version ' + esc(ADM.fm.prev) : 'Live since 1 Apr 2026. Saved changes reach the screens at 8:00 on the next working day, so no form changes while someone is filling it in'}</small></span></div>`}</div>`;
  if (!fm) return head + emptyHTML2('screen', 'No forms yet', 'Add your application form, document checklist or schedule of charges in Discovery, and Uncia drafts the new lead form and the login documents from them. Or start from the standard home loan forms and change them here.', [['fmstd', '', 'Start from the standard forms', 1], ['asec', 'disc', 'Go to Discovery']]);
  const L = fdList(curFlow()), all = [].concat(...L.map(g => g.items.filter(x => !x.dec)));
  let sel = all.find(x => x.id === ADM.fsel); if (!sel) { sel = all.find(x => x.scr === 'lead') || all[0]; ADM.fsel = sel ? sel.id : null; }
  const row = x => x.dec ? `<li class="fd-dq" style="--d:${x.d}">${ic(x.par ? 'lanes' : 'dia')}<span>${esc(x.n)}</span></li>`
    : `<li style="--d:${x.d}"><button class="fd-s${sel && x.id === sel.id ? ' on' : ''}${x.scr ? ' scr' : ''}${x.r === 'sys' ? ' sys' : ''}" data-act="fmsel" data-v="${x.id}"${sel && x.id === sel.id ? ' aria-current="true"' : ''}>${ic(x.scr ? 'screen' : x.r === 'sys' ? 'cpu' : 'user')}<span><b>${x.arm ? esc(x.arm) + ': ' : ''}${esc(short(x.n, 72))}</b><small>${x.r === 'sys' ? 'Runs by itself' : esc(rn(x.r)) + (x.sla && x.sla.u !== 'auto' ? ', ' + esc(lc1(slaTxt(x.sla))) : '')}</small>${x.scr ? `<i class="fd-ed">${ic('pen')}A screen you can change</i>` : ''}</span></button></li>`;
  const right = `<aside class="fd-r" aria-label="Workflow"><div class="fd-rh"><b>Workflow</b><small>${onb ? (ADM.onb.wf ? 'The new setup' : 'Build the workflow in Discovery to see every step') : 'Version ' + esc(ADM.live.ver)}</small></div><ol class="fd-wf">${L.map((g, i) => `<li class="fd-g"><span class="fd-gi">${i + 1}</span><b>${esc(g.n)}</b></li>${g.items.map(row).join('') || '<li class="fd-none">No steps yet</li>'}`).join('')}</ol></aside>`;
  const left = !sel ? '' : sel.scr ? fdEdit(sel, fm) : fdView(sel);
  return head + `<div class="fd11"><div class="fd-lc">${left}</div>${right}</div>`;
}
function fdHead(sel) {
  const t = sel.trg, who = sel.r === 'sys' ? '' : rn(sel.r);
  return `<div class="fd-ph"><span class="fd-who">${ic(sel.r === 'sys' ? 'cpu' : 'screen')}${sel.r === 'sys' ? 'Runs by itself' : 'What ' + esc(who) + ' sees'}</span><b>${esc(sel.n)}</b><span class="fd-mv">${ic(t.k === 'auto' ? 'zap' : 'user')}Moves on ${esc(lc1(t.t))}</span></div>`;
}
function fdEdit(sel, fm) {
  const form = sel.scr, dm = fdDm();
  return fdHead(sel) + tkHTML(form) + `<div class="fd-wr"><div class="fd-mk">${form === 'lead' ? mkLead(fm.lead, dm) : mkLogin(fm.login, dm)}</div>${fdPal(form, fm)}</div>`;
}
function fdView(sel) {
  if (sel.r === 'sys') return fdHead(sel) + `<div class="mk mk-sys"><div class="mk-b">${ic('cpu')}<div><b>No screen for this step</b><p>The system does it by itself: ${esc(lc1(sel.n))}. Nobody fills anything in, and the file moves on ${esc(lc1(sel.trg.t))}.</p><p>What it uses is set in Policy rules and in Vendors and APIs.</p></div></div></div>`;
  const who = rn(sel.r);
  return fdHead(sel) + `<div class="mk mk-ro"><div class="mk-h"><div><b>${esc(short(sel.n, 90))}</b><small>${esc(who)}${sel.sla ? ', ' + esc(lc1(slaTxt(sel.sla))) : ''}</small></div></div>
  <div class="mk-b"><dl class="mk-dl"><dt>The file</dt><dd>Sameer Joshi, ₹55 lakh home loan over 20 years</dd><dt>To do</dt><dd>${esc(sel.n)}</dd><dt>Turnaround</dt><dd>${esc(slaTxt(sel.sla))}</dd><dt>Then</dt><dd>The file moves on ${esc(lc1(sel.trg.t))}</dd></dl>
  <p class="mk-ro-n">${ic('info')}This step uses the standard ${esc(lc1(who))} screen: the file, its documents and the checks for the step, with a button to mark it done. The new lead form and the login documents are the screens set up here.</p></div>
  <div class="mk-ft"><span class="mk-btn">Add a note</span><span class="mk-btn p">${ic('check')}Mark as done</span></div></div>`;
}
function mkField(f, dm) {
  const d = FLIB[f.k] || [f.k, ''], lbl = fmLbl('lead', 'fields', f), id = 'lead|fields|' + f.k, st = dm[id];
  return `<div class="mk-fd${st ? ' d-' + st : ''}${isHi(id) ? ' hi' : ''}" draggable="true" data-dk="mv|${id}"${f.src ? ` title="From ${esc(dsrc(f.src).n)}"` : ''}>${dTag(st)}
  <div class="mk-fl"><span class="mk-grip" aria-hidden="true">${ic('grip')}</span><span class="mk-lb">${esc(lbl)}${f.req ? '<i class="mk-st">*</i>' : ''}</span>${d[2] ? `<span class="mk-lk" title="Always required: the consent SMS goes to this number">${ic('lock')}</span>` : `<button class="mk-tg${f.req ? ' on' : ''}" data-act="fmreq" data-v="${id}" aria-pressed="${!!f.req}" title="${f.req ? 'Make it optional' : 'Make it required'}">${f.req ? 'Required' : 'Optional'}</button><button class="mk-x" data-act="fmdel" data-v="${id}" aria-label="Remove ${esc(lbl)}" title="Remove">${ic('x')}</button>`}</div>
  <span class="mk-in${d[3] ? ' sel' : ''}">${esc(d[1] || ' ')}${d[3] ? ic('chev') : ''}</span></div>`;
}
function mkDoc(form, d, dm, list) {
  list = list || 'docs';
  const def = fdef(form, list)[d.k] || [d.k, ''], lbl = fmLbl(form, list, d), id = form + '|' + list + '|' + d.k, st = dm[id], lock = form === 'login' && list === 'docs' && d.k === 'app';
  const sub = list === 'codocs' ? (def[1] === 'Every co-applicant' ? def[1] : 'When: ' + def[1]) : form === 'login' ? (def[1] === 'All' ? 'Every file' : 'When: ' + def[1]) : def[1];
  return `<div class="mk-dc${st ? ' d-' + st : ''}${isHi(id) ? ' hi' : ''}" draggable="true" data-dk="mv|${id}"${d.src ? ` title="From ${esc(dsrc(d.src).n)}"` : ''}>${dTag(st)}<span class="mk-grip" aria-hidden="true">${ic('grip')}</span>${ic('file')}<span class="mk-dt"><b>${esc(lbl)}${d.req ? '<i class="mk-st">*</i>' : ''}</b><small>${esc(sub)}</small></span>
  ${lock ? `<span class="mk-lk" title="Always required: a file cannot log in without it">${ic('lock')}</span>` : `<button class="mk-tg${d.req ? ' on' : ''}" data-act="fmreq" data-v="${id}" aria-pressed="${!!d.req}" title="${d.req ? 'Make it optional' : 'Make it required'}">${d.req ? 'Required' : 'Optional'}</button><button class="mk-x" data-act="fmdel" data-v="${id}" aria-label="Remove ${esc(lbl)}" title="Remove">${ic('x')}</button>`}${form === 'login' && list === 'docs' ? `<span class="mk-btn sm">${ic('upload')}Upload</span>` : ''}</div>`;
}
function mkCo(G, dm) {
  const co = G.cofg || { on: 0, max: 3 }, D = G.codocs || [], st = dm['login|cofg'];
  return `<div class="mk-co${co.on ? ' on' : ''}${st ? ' d-chg' : ''}${isHi('login|cofg') ? ' hi' : ''}">${dTag(st)}<div class="mk-fh">${ic('users')}<span><b>Co-applicants</b><small>${co.on ? 'The RM can add up to ' + plural(co.max, 'co-applicant') + ' at login. Each gets their own consent SMS and upload link' : 'Not added at login'}</small></span><label class="tgl6"><input type="checkbox" data-fm="coon"${co.on ? ' checked' : ''} aria-label="Co-applicants can be added at login"><span></span></label></div>
  ${co.on ? `<div class="mk-fr"><label class="mk-amt"><span>Most on a file</span><select class="sel mk-max" data-fm="comax" aria-label="Most co-applicants on a file">${[1, 2, 3, 4].map(n => `<option value="${n}"${n === co.max ? ' selected' : ''}>${plural(n, 'co-applicant')}</option>`).join('')}</select></label><span class="mk-btn">${ic('userplus')}Add a co-applicant</span></div>
  <div class="mk-ch2"><b>Documents asked from each co-applicant</b><small>${D.filter(d => d.req).length} required. Income documents only when they earn</small></div>
  <div class="mk-codocs" data-dz="login|codocs">${D.map(d => mkDoc('login', d, dm, 'codocs')).join('') || '<p class="mk-empty">Drag documents here</p>'}</div>` : ''}</div>`;
}
function mkLead(L, dm) {
  const req = L.fields.filter(f => f.req).map(f => lc1(fmLbl('lead', 'fields', f)));
  const rt = req.length === 1 && req[0] === 'contact number' ? 'Only the contact number is needed.' : req.length ? 'Needed: ' + listAnd(req) + '.' : 'Nothing is required.';
  return `<div class="mk" aria-label="New lead form"><div class="mk-h"><div><b>New lead</b><small>Amit Joshi, Pune Kothrud branch</small></div><span class="mk-xx" aria-hidden="true">${ic('x')}</span></div>
  <div class="mk-b"><div class="mk-sec"><b>Applicant</b><small>${esc(rt)} Upload the documents and the details fill themselves.</small></div>
  <div class="mk-grid" data-dz="lead|fields">${L.fields.map(f => mkField(f, dm)).join('') || '<p class="mk-empty">Drag fields here</p>'}</div>
  <div class="mk-sec"><b>Documents</b><small>${L.docs.length ? plural(L.docs.length, 'document') + ' asked for' + (L.docs.some(d => d.req) ? '' : ', all optional at the lead') : 'None asked for at the lead'}</small></div>
  <div class="mk-docs" data-dz="lead|docs">${L.docs.map(d => mkDoc('lead', d, dm)).join('') || '<p class="mk-empty">Drag documents here</p>'}</div>
  <div class="mk-cons">${ic('lock')}<span><b>Credit consent.</b> An SMS asks the customer to approve a credit report pull, which records an enquiry, and 12 months of bank data through the Account Aggregator.</span><i>Always asked</i></div></div>
  <div class="mk-ft"><span class="mk-btn">Cancel</span><span class="mk-btn p">${ic('send')}Send consent request</span></div></div>`;
}
function mkLogin(G, dm) {
  const cats = [0, 1, 2, 3, 4].map(i => [i, G.docs.filter(d => (GDOC[d.k] || [])[2] === i)]).filter(x => x[1].length), fee = G.fee, fst = dm['login|fee'];
  return `<div class="mk" aria-label="Login documents"><div class="mk-h"><div><b>Documents due</b><small>${plural(G.docs.length, 'document')} on the list, ${G.docs.filter(d => d.req).length} required. The customer gets an upload link; the RM can upload them here too</small></div><span class="mk-btn">${ic('upload')}Upload documents</span></div>
  <div class="mk-b"><div class="mk-cats" data-dz="login|docs">${cats.map(([i, D]) => `<div class="mk-cat"><div class="mk-ch"><b>${esc(DCAT[i])}</b><small>${D.length} on the list</small></div>${D.map(d => mkDoc('login', d, dm)).join('')}</div>`).join('') || '<p class="mk-empty">Drag documents here</p>'}</div>
  ${mkCo(G, dm)}<div class="mk-fee${fee.on ? ' on' : ''}${fst ? ' d-chg' : ''}${isHi('login|fee') ? ' hi' : ''}">${dTag(fst)}<div class="mk-fh">${ic('bank')}<span><b>Application fee</b><small>${fee.on ? 'Paid by the customer at login, by UPI, card or net banking' : 'Not collected. Files log in without a fee'}</small></span><label class="tgl6"><input type="checkbox" data-fm="on"${fee.on ? ' checked' : ''} aria-label="Collect an application fee"><span></span></label></div>
  ${fee.on ? `<div class="mk-fr"><label class="mk-amt"><span>Amount, with GST</span><span class="mk-ai">₹<input class="pin6" type="number" min="0" step="10" data-fm="amt" value="${fee.amt}" aria-label="Application fee, with GST"></span></label><label class="mk-adj"><input type="checkbox" data-fm="adj"${fee.adj ? ' checked' : ''}><span>Adjusted against the processing fee at disbursement</span></label></div>` : ''}</div></div>
  <div class="mk-ft"><span class="mk-note">${ic('zap')}Goes to the login check once the required documents${fee.on ? ' and the fee' : ''} are in</span><span class="mk-btn p">Log in the file</span></div></div>`;
}
function fdPal(form, fm) {
  const grp = (list, title) => { const have = fm[form][list].map(x => x.k), defs = fdef(form, list), keys = Object.keys(defs).filter(k => !have.includes(k));
    return `<div class="fd-pg"><b>${title}</b><div class="fd-chips" data-dz="${form}|${list}|pal">${keys.map(k => `<button class="fd-chip" draggable="true" data-dk="add|${form}|${list}|${k}" data-act="fmadd" data-v="${form}|${list}|${k}" title="Drag onto the form, or click to add it at the end">${ic('plus')}${esc(defs[k][0])}</button>`).join('') || '<span class="fd-all">All of them are on the form</span>'}</div></div>`; };
  return `<aside class="fd-pal" aria-label="Add to the form"><div class="fd-pk">Add to the form</div><p>Drag onto the form, or click to add at the end. Drag an item back here to remove it.</p>${form === 'lead' ? grp('fields', 'Fields') : ''}${grp('docs', 'Documents')}${form === 'login' && fm.login.cofg && fm.login.cofg.on ? grp('codocs', 'Co-applicant documents') : ''}</aside>`;
}

/* form changes: one function for clicks, drags, voice notes and text */
function fmDesc(op, F) {
  if (op.k === 'fee') { const f = F.login.fee, n = Object.assign({}, f, op.v); return Object.keys(op.v).length === 1 && 'adj' in op.v ? { t: 'Login documents: application fee adjusted against the processing fee', b: f.adj ? 'Yes' : 'No', a: n.adj ? 'Yes' : 'No' } : { t: 'Login documents: application fee', b: feeStr(f), a: feeStr(n) }; }
  if (op.k === 'cofg') { const f = F.login.cofg, n = Object.assign({}, f, op.v); return { t: 'Login documents: co-applicants at login', b: coStr(f), a: coStr(n) }; }
  const nm = fmNm(op.form, op.list), arr = F[op.form][op.list], it = arr.find(x => x.k === op.key), w = op.list === 'fields' ? 'field' : 'document', lb = x => fmLbl(op.form, op.list, x), me = lb(it || { k: op.key });
  const pos = (a, k) => { const j = a.findIndex(x => x.k === k); return j <= 0 ? 'First' : 'After “' + lb(a[j - 1]) + '”'; };
  if (op.k === 'req') return { t: nm + ': “' + me + '”', b: it && it.req ? 'Required' : 'Optional', a: op.v ? 'Required' : 'Optional' };
  if (op.k === 'del') return { t: nm + ': removed the ' + w + ' “' + me + '”', b: it && it.req ? 'Required' : 'Optional', a: 'Removed' };
  if (op.k === 'ren') return { t: nm + ': renamed a ' + w, b: me, a: op.v };
  const nx = arr.slice(); fmApply(op, { [op.form]: { [op.list]: nx } });
  if (op.k === 'add') return { t: nm + ': added the ' + w + ' “' + me + '”', b: '', a: (op.at == null || op.at >= arr.length ? 'At the end' : pos(nx, op.key)) + ', ' + (op.v ? 'required' : 'optional') };
  return { t: nm + ': moved the ' + w + ' “' + me + '”', b: pos(arr, op.key), a: pos(nx, op.key) };
}
function fmApply(op, F) {
  if (op.k === 'fee') { Object.assign(F.login.fee, op.v); return; }
  if (op.k === 'cofg') { Object.assign(F.login.cofg, op.v); return; }
  const arr = F[op.form][op.list], i = arr.findIndex(x => x.k === op.key);
  if (op.k === 'req' && i >= 0) arr[i] = Object.assign({}, arr[i], { req: op.v ? 1 : 0 });
  if (op.k === 'del' && i >= 0) arr.splice(i, 1);
  if (op.k === 'add' && i < 0) arr.splice(op.at == null ? arr.length : Math.max(0, Math.min(op.at, arr.length)), 0, { k: op.key, req: op.v ? 1 : 0 });
  if (op.k === 'mv' && i >= 0) { const [x] = arr.splice(i, 1); let at = op.at == null ? arr.length : op.at; if (op.at != null && i < op.at) at--; arr.splice(Math.max(0, Math.min(at, arr.length)), 0, x); }
  if (op.k === 'ren' && i >= 0) arr[i] = Object.assign({}, arr[i], { l: op.v });
}
function fmHi(ids) { ADM.fmHi = ids; clearTimeout(fmHi.t); fmHi.t = setTimeout(() => { if (ADM) ADM.fmHi = []; }, 1700); }
function fmOp(op, why, src, srcK) {
  const F = FM(); if (!F) return null;
  if (op.k === 'cofg' && Object.keys(op.v).every(x => F.login.cofg[x] === op.v[x])) return null;
  if (op.k !== 'fee' && op.k !== 'cofg') { const it = F[op.form][op.list].find(x => x.k === op.key); if (op.k === 'add' ? it : !it) return null; if (op.k === 'req' && !!it.req === !!op.v) return null; if (op.k === 'ren' && fmLbl(op.form, op.list, it) === op.v) return null; }
  const d = fmDesc(op, F); if (op.k === 'mv' && d.b === d.a) return null;
  fmApply(op, F);
  if (ONB()) alog2({ area: 'form', what: d.t, b: d.b, a: d.a, why: why || 'Edited in the new setup', src: src || '', srcK: srcK || '' });
  fmHi([op.form + '|' + (op.k === 'fee' ? 'fee' : op.k === 'cofg' ? 'cofg' : op.list + '|' + op.key)]);
  return d;
}
Object.assign(ACT, {
  fmsel(v) { ADM.fsel = v; TKP.stop(); render(); },
  fmreq(v) { const [form, list, key] = v.split('|'), F = FM(), it = F && F[form][list].find(x => x.k === key); if (!it) return; fmOp({ k: 'req', form, list, key, v: it.req ? 0 : 1 }); render(); },
  fmdel(v) { const [form, list, key] = v.split('|'), F = FM(), it = F && F[form][list].find(x => x.k === key); if (!it) return; fmOp({ k: 'del', form, list, key }); render(); toast('Removed “' + fmLbl(form, list, it) + '”. It is back in the list on the right'); },
  fmadd(v) { const [form, list, key] = v.split('|'); if (!FM()) return; fmOp({ k: 'add', form, list, key, v: 0 }); render(); },
  fmstd() { ADM.fm.onb = deep(FORM0); alog2({ area: 'form', what: 'Started from the standard forms', a: plural(FORM0.lead.fields.length, 'field') + ', ' + plural(FORM0.login.docs.length, 'login document'), why: 'New setup' }); render(); }
});
/* dragging fields and documents */
function dzClear() { document.querySelectorAll('.dz-b,.dz-a,.dz-end,.dz-on').forEach(e => e.classList.remove('dz-b', 'dz-a', 'dz-end', 'dz-on')); }
function dzTarget(ev) {
  if (!ADM || !ADM.drag || !ev.target || !ev.target.closest) return null;
  const z = ev.target.closest('[data-dz]'); if (!z) return null;
  const [op, form, list] = ADM.drag.split('|'), [zf, zl, pal] = z.dataset.dz.split('|');
  if (zf !== form || zl !== list || (pal && op !== 'mv')) return null;
  return { z, pal: !!pal };
}
document.addEventListener('dragstart', ev => {
  const el = ev.target && ev.target.closest ? ev.target.closest('[data-dk]') : null; if (!el || !ADM || S.view !== 'admin') return;
  ADM.drag = el.dataset.dk; el.classList.add('dragging');
  try { ev.dataTransfer.effectAllowed = 'copyMove'; ev.dataTransfer.setData('text/plain', el.dataset.dk); } catch (e) { /* some browsers limit drag data */ }
});
document.addEventListener('dragover', ev => {
  const t = dzTarget(ev); if (!t) return;
  ev.preventDefault(); dzClear();
  if (t.pal) { t.z.classList.add('dz-on'); return; }
  const key = ADM.drag.split('|')[3], grid = t.z.classList.contains('mk-grid') || t.z.classList.contains('mk-docs');
  const over = ev.target.closest('[data-dk^="mv|"]');
  if (over && over.dataset.dk.split('|')[3] === key) { t.z.classList.add('dz-on'); return; }
  /* the item under the pointer, or the nearest one when the pointer is in a gap */
  let best = null, bd = 1e9;
  t.z.querySelectorAll('[data-dk^="mv|"]').forEach(it => { if (it.dataset.dk.split('|')[3] === key) return; const r = it.getBoundingClientRect(), dx = Math.max(r.left - ev.clientX, 0, ev.clientX - r.right), dy = Math.max(r.top - ev.clientY, 0, ev.clientY - r.bottom), d = dx * dx + dy * dy * (grid ? 4 : 1); if (d < bd) { bd = d; best = it; } });
  if (!best) { t.z.classList.add('dz-end'); return; }
  const r = best.getBoundingClientRect();
  best.classList.add((grid ? (ev.clientY > r.bottom ? true : ev.clientY < r.top ? false : ev.clientX > r.left + r.width / 2) : ev.clientY > r.top + r.height / 2) ? 'dz-a' : 'dz-b');
});
document.addEventListener('drop', ev => {
  const t = dzTarget(ev); if (!t) return; ev.preventDefault();
  const [op, form, list, key] = ADM.drag.split('|'), F = FM(); ADM.drag = null;
  if (!F) { dzClear(); return; }
  if (t.pal) { dzClear(); const it = F[form][list].find(x => x.k === key); if (!it || (form === 'lead' && key === 'a1mob') || (form === 'login' && key === 'app')) { render(); toast(it ? 'That one is always on the form' : 'Nothing to remove'); return; } fmOp({ k: 'del', form, list, key }, 'Edited in the new setup, by dragging'); render(); toast('Removed “' + fmLbl(form, list, it) + '”'); return; }
  const self = ev.target.closest('[data-dk^="mv|"]'); if (op === 'mv' && self && self.dataset.dk.split('|')[3] === key) { dzClear(); return; }
  const m = t.z.querySelector('.dz-b, .dz-a'); let at = null;
  if (m) { const mk = m.dataset.dk.split('|')[3]; at = F[form][list].findIndex(x => x.k === mk); if (m.classList.contains('dz-a')) at++; }
  dzClear();
  const d = fmOp({ k: op === 'add' ? 'add' : 'mv', form, list, key, at, v: 0 }, 'Edited in the new setup, by dragging');
  render(); if (d && op === 'add') toast('Added “' + fmLbl(form, list, { k: key }) + '”');
});
document.addEventListener('dragend', () => { if (ADM) ADM.drag = null; dzClear(); document.querySelectorAll('.dragging').forEach(e => e.classList.remove('dragging')); });

/* ---------------- telling Uncia what to change: a voice note, a document or text ---------------- */
const TKP = { tm: null, ctx: null, stop() { if (this.tm) clearInterval(this.tm); this.tm = null; if (ADM && ADM.tk && this.ctx && ADM.tk[this.ctx]) ADM.tk[this.ctx].play = 0; this.ctx = null; } };
const tkDay = V => V.meta.split('. ').pop().replace(/^\w+ (\d+ \w+) .*$/, '$1');
const tkSrcName = (ctx, k) => ({ voice: TKS[ctx].voice.who + '’s voice note', doc: TKS[ctx].doc ? lc1(TKS[ctx].doc.who) : '', text: 'your text' }[k] || '');
const tkSrcLbl = (ctx, k) => ({ voice: 'Voice note from ' + TKS[ctx].voice.who + ', ' + tkDay(TKS[ctx].voice), doc: TKS[ctx].doc ? TKS[ctx].doc.who : '', text: 'Typed on the Admin page' }[k] || '');
function tkSync(ctx) {
  const T = ADM.tk[ctx], V = TKS[ctx].voice, p = $('#tkP-' + ctx), t = $('#tkT-' + ctx), b = $('#tkB-' + ctx);
  if (p) p.style.width = (T.pt / V.dur * 100) + '%'; if (t) t.textContent = mmss(T.pt) + ' / ' + mmss(V.dur);
  if (b) { b.innerHTML = ic(T.play ? 'pause' : 'play'); b.setAttribute('aria-label', T.play ? 'Pause' : 'Play'); }
  V.segs.forEach((s, i) => { const el = $('#tks-' + ctx + '-' + i); if (el) el.classList.toggle('on', T.pt > 0 && T.pt >= s.t && (!V.segs[i + 1] || T.pt < V.segs[i + 1].t)); });
}
function tkHTML(ctx) {
  const T = ADM.tk[ctx], X = TKS[ctx], V = X.voice, onb = ONB();
  const what = ctx === 'org' ? 'the roles, SOPs and escalations' : ctx === 'lead' ? 'the new lead form' : 'the login documents';
  const opt = (k, ico, l, s) => `<button class="ik-o${T.k === k ? ' on' : ''}" data-act="tkpick" data-v="${ctx}|${k}" aria-pressed="${T.k === k}">${ic(ico)}<span><b>${l}</b><small>${esc(s)}</small></span></button>`;
  let body = '';
  if (T.phase === 'run') body = runHTML(T.k === 'voice' ? ['Transcribing the voice note' + (/hindi/i.test(V.meta) ? ': Hindi and English' : ''), 'Finding the changes', 'Matching them to ' + what] : T.k === 'doc' ? ['Reading the circular', 'Finding the changes', 'Matching them to ' + what] : ['Reading your text', 'Matching it to ' + what], T.step, 'Reading it');
  else if (T.phase === 'review') {
    const n = T.props.filter(p => p.on).length;
    body = `<div class="ik-rv"><p class="ik-rh"><b>${plural(T.props.length, 'change')} found</b> in ${esc(tkSrcName(ctx, T.k))}. Untick anything you don’t want.${onb ? '' : ' Nothing goes live until you save the draft.'}</p>${T.props.map((p, i) => `<label class="ik-p${p.on ? '' : ' off'}"><input type="checkbox" data-tk="${ctx}|${i}"${p.on ? ' checked' : ''}><span class="ar6 ${p.area}">${AREA[p.area]}</span><span class="ik-pt"><b>${esc(p.t)}</b><span class="ik-ba">${p.b ? `<s>${esc(p.b)}</s> ${ic('fwd')} ` : ''}<b>${esc(p.a)}</b></span><q>${esc(p.q)}</q></span></label>`).join('')}
    ${T.miss.length ? `<details class="ik-miss"><summary>${plural(T.miss.length, 'line')} not used</summary><ul>${T.miss.map(x => `<li>${esc(x.q)}${x.why ? `<small>${esc(cap1(x.why))}</small>` : ''}</li>`).join('')}</ul>${T.k === 'text' ? `<p>Try: ${X.sug.map(x => `<button class="lnk" data-act="tksug" data-v="${ctx}|${esc(x)}">${esc(x)}</button>`).join(', ')}</p>` : ''}</details>` : ''}
    <div class="ik-f"><button class="btn btn-p" data-act="tkadd" data-v="${ctx}"${n ? '' : ' disabled'}>${ic('check')}${onb ? 'Make ' + plural(n, 'change') : 'Add ' + plural(n, 'change') + ' to the draft'}</button><button class="btn btn-g" data-act="tkreset" data-v="${ctx}">Start again</button></div></div>`;
  } else {
    const on = i => T.pt > 0 && T.pt >= V.segs[i].t && (!V.segs[i + 1] || T.pt < V.segs[i + 1].t);
    const prev = T.k === 'voice' ? `<div class="ik-src"><div class="ik-ap"><button class="ibtn" id="tkB-${ctx}" data-act="tkplay" data-v="${ctx}" aria-label="${T.play ? 'Pause' : 'Play'}">${ic(T.play ? 'pause' : 'play')}</button><div class="ik-bar"><i id="tkP-${ctx}" style="width:${T.pt / V.dur * 100}%"></i></div><span id="tkT-${ctx}">${mmss(T.pt)} / ${mmss(V.dur)}</span></div><ol class="ik-tr">${V.segs.map((s, i) => `<li id="tks-${ctx}-${i}" class="${on(i) ? 'on' : ''}"><time>${mmss(s.t)}</time><span>${esc(s.o)}${s.e ? `<small>${esc(s.e)}</small>` : ''}</span></li>`).join('')}</ol></div>`
      : T.k === 'doc' ? `<div class="ik-src"><div class="ik-doc"><b>${esc(X.doc.n)}</b><small>${esc(X.doc.meta)}</small>${X.doc.lines.map(l => `<p>${esc(l)}</p>`).join('')}</div></div>`
        : T.k === 'text' ? `<div class="ik-src"><textarea class="ta" id="tktxt-${ctx}" rows="3" placeholder="For example: ${esc(X.sug[0])}">${esc(T.txt)}</textarea><p class="ik-try">Try: ${X.sug.map(x => `<button class="lnk" data-act="tksug" data-v="${ctx}|${esc(x)}">${esc(x)}</button>`).join(', ')}</p></div>` : '';
    body = `<div class="ik-os${X.doc ? '' : ' two'}">${opt('voice', 'mic', 'Voice note', V.who + ', ' + V.meta.split('.')[0])}${X.doc ? opt('doc', 'file', 'Document', X.doc.n) : ''}${opt('text', 'text', 'Type it', 'A few lines, in plain words')}</div>${prev}${T.k ? `<div class="ik-f"><button class="btn btn-p" data-act="tkgo" data-v="${ctx}" id="tkGo-${ctx}"${T.k === 'text' && !T.txt.trim() ? ' disabled' : ''}>${ic('wand')}Find the changes</button></div>` : ''}${T.added ? `<p class="ik-ok">${ic('check')}${esc(T.added)}</p>` : ''}`;
  }
  return `<section class="panel ik tk11"><div class="ph"><h3>${ic('wand')}Tell Uncia what to change</h3><span class="note">${ctx === 'org' ? 'A voice note, a document or a few lines. Uncia finds the changes to the roles, SOPs and escalations.' : 'A voice note or a few lines. Uncia finds the changes to ' + what + '.'}</span></div><div class="pb">${body}</div></section>`;
}

/* reading the words: one sentence at a time */
const NUMW11 = Object.assign({ eight: 8, nine: 9, ten: 10, twelve: 12 }, NUMW);
const toN = x => +x || NUMW11[x] || 0;
function tkSplit(txt) { return txt.split(/\n+|(?<=[.!?;])\s+/).map(x => x.replace(/^\s*(\d+[.)]|[-*•])\s*/, '').replace(/^(and|also|aur|then|plus)\s+/i, '').replace(/;+$/, '').trim()).filter(x => x.length > 3).map(cap1); }
const FAL = [
  [/alternate (mobile|number|phone|contact)/, 'fields', 'alt'], [/contact number|mobile( number)?|phone( number)?/, 'fields', 'a1mob'],
  [/first name/, 'fields', 'a1f'], [/last name|surname/, 'fields', 'a1l'], [/middle name/, 'fields', 'mid'], [/e-?mail/, 'fields', 'email'], [/date of birth|\bdob\b|birth ?date/, 'fields', 'dob'],
  [/pan card|e-?pan|copy of (the )?pan/, 'docs', 'pan'], [/\bpan\b/, 'fields', 'a1pan'], [/aadhaa?r/, 'docs', 'adh'], [/salary slips?|pay ?slips?/, 'docs', 'sal'], [/bank statements?/, 'docs', 'bank6'],
  [/form ?16/, 'docs', 'f16'], [/\bitr\b|income tax returns?/, 'docs', 'itr'], [/photo(graph)?s?/, 'docs', 'photo'],
  [/co-?applicant/, 'fields', 'coap'], [/type of applicant|applicant type/, 'fields', 'atype'], [/type of loan|loan type/, 'fields', 'ltype'], [/loan amount|amount of (the )?loan/, 'fields', 'loan'], [/tenure/, 'fields', 'ten'],
  [/property type|type of property/, 'fields', 'ptype'], [/property (value|price)|(value|price) of the property/, 'fields', 'price'], [/monthly (pay|income|salary)|\bincome\b|\bsalary\b/, 'fields', 'a1inc'],
  [/branch city|\bcity\b/, 'fields', 'city'], [/employer|company name/, 'fields', 'emp'], [/preferred language|\blanguage\b/, 'fields', 'lang'], [/lead source|source of the lead/, 'fields', 'lsrc'], [/pin ?code/, 'fields', 'pin']
];
const GAL = [
  [/application form/, 'app'], [/form ?16/, 'f16l'], [/bank statements?[^.]*?\b(12|twelve) months|\b(12|twelve) months[^.]*?bank statements?|self-?employed[^.]*?bank statements?|bank statements?[^.]*?self-?employed/, 'bank12'], [/bank statements?/, 'bank6l'],
  [/\bitr\b|income tax returns?/, 'itr2'], [/gst returns?|\bgst\b/, 'gst'], [/agreement (to|for) sale|agreement to sell|sale agreement|\bats\b/, 'ats'], [/sale deed|title deed/, 'deed'], [/encumbrance|\bec\b/, 'ec'],
  [/occupancy|completion certificate|\boc\b/, 'oc'], [/share certificate|society noc|\bsociety\b/, 'share'], [/allotment|builder noc/, 'allot'], [/approved plan|building plan|cost estimate/, 'plan'], [/property tax|tax receipt/, 'tax'],
  [/\bkyc\b/, 'kyc'], [/photo(graph)?s?/, 'photo'], [/salary slips?|pay ?slips?/, 'sal3'], [/profit and loss|\bp ?& ?l\b|balance sheet/, 'pnl'], [/cancell?ed cheque|\bcheque\b/, 'chq']
];
const CAL = [[/\bpan\b/, 'pan'], [/aadhaa?r/, 'adh'], [/salary slips?|pay ?slips?/, 'sal'], [/form ?16/, 'f16'], [/\bitr\b|income tax returns?/, 'itr'], [/bank statements?[^.]*?\b(6|six) months|\b(6|six) months[^.]*?bank statements?/, 'bank6'], [/bank statements?/, 'bank12'], [/photo(graph)?s?/, 'photo'], [/relationship|marriage certificate/, 'relp']];
function fmHits(ctx, s) {
  const AL = ctx === 'lead' ? FAL : ctx === 'co' ? CAL.map(([re, k]) => [re, 'codocs', k]) : GAL.map(([re, k]) => [re, 'docs', k]), out = []; let w = s;
  AL.forEach(([re, list, key]) => { const m = w.match(re); if (m) { out.push({ list, key, i: m.index }); w = w.slice(0, m.index) + ' '.repeat(m[0].length) + w.slice(m.index + m[0].length); } });
  return out.sort((a, b) => a.i - b.i);
}
function feeParse(ctx, s, W) {
  if (ctx !== 'login') return { miss: 'the application fee is set on the login documents screen' };
  const f = W.login.fee, mk = v => { const op = { k: 'fee', form: 'login', v }, d = fmDesc(op, W); fmApply(op, W); return { props: [{ area: 'form', t: d.t, b: d.b, a: d.a, ops: [op] }] }; };
  if (/adjust/.test(s)) { const v = /\b(don't|do not|not|stop|no longer)\b/.test(s) ? 0 : 1; return !!f.adj === !!v ? { miss: 'it is already set that way' } : mk({ adj: v }); }
  if (/waiv|\bstop\b|\bno (application |login )?fee|\bremove\b|\bdrop\b|don't (collect|charge|take)|do not (collect|charge|take)|\bscrap|\bfree\b/.test(s)) return f.on ? mk({ on: 0 }) : { miss: 'the application fee is already off' };
  const m = s.match(/(?:₹|\brs\.?|\binr|rupees)\s*([\d,]+(?:\.\d+)?)|\b(\d[\d,]{2,})\s*(?:rupees|rs\b)/);
  if (m) { let a = +String(m[1] || m[2]).replace(/,/g, ''); if (/\+\s*gst|plus gst|excluding gst|before gst|exclusive of gst/.test(s)) a = Math.round(a * 1.18); if (f.on && f.amt === a) return { miss: 'the fee is already ' + inr(a) }; return mk({ on: 1, amt: a }); }
  if (/\b(collect|charge|start|bring back|turn on|take)\b/.test(s)) return f.on ? { miss: 'the application fee is already collected' } : mk({ on: 1 });
  return { miss: 'no change to the fee found' };
}
function coParse(s0, s, W) {
  const f = W.login.cofg, mk = v => { const op = { k: 'cofg', form: 'login', v }, d = fmDesc(op, W); fmApply(op, W); return { props: [{ area: 'form', t: d.t, b: d.b, a: d.a, ops: [op] }] }; };
  const mx = s.match(/up to (\d|one|two|three|four)\b/);
  if (/\b(don't|do not|stop|no longer|not) (allow|let|add|take)|\bno co-?applicants|turn off/.test(s)) return f.on ? mk({ on: 0 }) : { miss: 'co-applicants are already off' };
  if (mx) { const n = Math.max(1, Math.min(4, toN(mx[1]))); return f.on && f.max === n ? { miss: 'it is already up to ' + n } : mk({ on: 1, max: n }); }
  if (/\b(allow|let|turn on|start)\b/.test(s) && !CAL.some(([re]) => re.test(s))) return f.on ? { miss: 'co-applicants are already allowed' } : mk({ on: 1 });
  return fmParse('co', s0, W);
}
function fmParse(ctx, s0, W) {
  const s = ' ' + s0.toLowerCase().replace(/[’']/g, "'") + ' ';
  if (ctx === 'login' && /co-?applicants?/.test(s)) return coParse(s0, s, W);
  if (/\bfee\b/.test(s)) return feeParse(ctx, s, W);
  const H = fmHits(ctx, s); if (!H.length) return { miss: 'it names no field or document on this form' };
  const form = ctx === 'co' ? 'login' : ctx, arr = h => W[form][h.list], got = h => arr(h).find(x => x.k === h.key), lb = h => fmLbl(form, h.list, got(h) || { k: h.key });
  const lockWhy = h => (form === 'lead' && h.key === 'a1mob') ? 'the contact number is always required: the consent SMS goes to it' : (form === 'login' && h.key === 'app') ? 'the application form is always required: a file cannot log in without it' : '';
  const mk = op => { const d = fmDesc(op, W); fmApply(op, W); return { area: 'form', t: d.t, b: d.b, a: d.a, ops: [op] }; };
  const X = H[0], props = [], miss = [];
  if (/\b(rename|call)\b/.test(s) && /\s(to|as)\s/.test(s)) {
    const m = s0.match(/\s(?:to|as)\s+["“]?([^"”]+?)["”]?\.?\s*$/i);
    if (!m || !got(X)) return { miss: lb(X) + ' is not on the form' };
    return { props: [mk({ k: 'ren', form, list: X.list, key: X.key, v: cap1(m[1].trim()) })] };
  }
  if (/\b(move|put|place|show)\b/.test(s) && /\b(above|below|before|after|first|top|last|end|bottom)\b/.test(s)) {
    if (!got(X)) return { miss: lb(X) + ' is not on the form' };
    const Y = H.find(h => h !== X && h.list === X.list), after = /\b(below|after|last|end|bottom)\b/.test(s); let at = null;
    if (Y) { if (!got(Y)) return { miss: lb(Y) + ' is not on the form' }; at = arr(Y).findIndex(x => x.k === Y.key) + (after ? 1 : 0); }
    else if (/\b(first|top)\b/.test(s)) at = 0;
    const op = { k: 'mv', form, list: X.list, key: X.key, at }, d = fmDesc(op, W); if (d.b === d.a) return { miss: lb(X) + ' is already there' };
    return { props: [mk(op)] };
  }
  if (/\b(optional|not (mandatory|required|compulsory|needed)|no longer (mandatory|required))\b/.test(s)) H.forEach(h => { const it = got(h); if (lockWhy(h)) miss.push(lockWhy(h)); else if (!it) miss.push(lb(h) + ' is not on the form'); else if (!it.req) miss.push(lb(h) + ' is already optional'); else props.push(mk({ k: 'req', form, list: h.list, key: h.key, v: 0 })); });
  else if (/\b(remove|delete|drop|hata\w*|take (out|off)|get rid of|no longer (ask|collect|need)|stop (asking|collecting|taking)|don't (ask|collect|take|need)|do not (ask|collect|take|need))\b/.test(s)) H.forEach(h => { if (lockWhy(h)) miss.push(lockWhy(h)); else if (!got(h)) miss.push(lb(h) + ' is not on the form'); else props.push(mk({ k: 'del', form, list: h.list, key: h.key })); });
  else if (/\b(add|include|ask for|ask|collect|also take|take|le lo|chahiye|need)\b/.test(s)) {
    const req = /\b(mandatory|required|compulsory)\b/.test(s) ? 1 : 0, pm = s.match(/\b(after|before|above|below)\b/), Y = pm ? H.find(h => h.i > pm.index && h !== X) : null;
    H.filter(h => h !== Y).forEach(h => { const it = got(h);
      if (it) { if (req && !it.req) props.push(mk({ k: 'req', form, list: h.list, key: h.key, v: 1 })); else miss.push(lb(h) + ' is already on the form'); return; }
      let at = null; if (Y && Y.list === h.list && got(Y)) at = arr(Y).findIndex(x => x.k === Y.key) + (/after|below/.test(pm[1]) ? 1 : 0);
      props.push(mk({ k: 'add', form, list: h.list, key: h.key, at, v: req })); });
  } else if (/\b(mandatory|required|compulsory|must)\b/.test(s)) H.forEach(h => { const it = got(h); if (!it) miss.push(lb(h) + ' is not on the form. Add it first'); else if (it.req) miss.push(lb(h) + ' is already required'); else props.push(mk({ k: 'req', form, list: h.list, key: h.key, v: 1 })); });
  else return { miss: 'no change to the form found' };
  return props.length ? { props } : { miss: miss.join('. ') || 'no change found' };
}

/* onboarding: roles, people, SOP steps and escalations */
const ogRole = (t, G) => { const l = (t || '').toLowerCase(), f = findRole(t || ''); if (f && f !== 'sys') return f; const r = (G ? G.roles : []).concat(OROLE.map(([id, n]) => ({ id, n }))).find(x => l.includes(x.n.toLowerCase().split(',')[0])); return r ? r.id : ''; };
const ogNew = () => 'n' + (++ADM.nid);
function ogApply(op, G) {
  const R = id => G.roles.find(x => x.id === id), SP = id => { let s = G.sops.find(x => x.id === id); if (!s) { s = { id, steps: [] }; G.sops.push(s); } return s; }, E = id => G.esc.find(x => x.id === id);
  const sortLv = e => e.lv.sort((a, b) => a.n * UNITS[a.u][1] - b.n * UNITS[b.u][1]);
  switch (op.k) {
    case 'padd': { const r = R(op.id); if (r && !r.ppl.includes(op.v)) r.ppl.push(op.v); break; }
    case 'pdel': { const r = R(op.id); if (r) r.ppl = r.ppl.filter(p => p !== op.v); break; }
    case 'rn': { const r = R(op.id); if (r) r.n = op.v; break; }
    case 'rr': { const r = R(op.id); if (r) r.resp = op.v.slice(); break; }
    case 'ra': { const r = R(op.id); if (r) r.acc = op.v; break; }
    case 'radd': G.roles.push({ id: op.id, n: op.v, ppl: [], resp: [], acc: 'LOS: files assigned to them', add: 1 }); break;
    case 'rdel': G.roles = G.roles.filter(x => x.id !== op.id); G.sops = G.sops.filter(x => x.id !== op.id); break;
    case 'sopadd': SP(op.id).steps.push({ id: op.sid || ogNew(), t: op.t, sla: op.sla, src: op.src || '', add: 1 }); break;
    case 'st': case 'ss': { const st = SP(op.id).steps.find(x => x.id === op.sid); if (st) st[op.k === 'st' ? 't' : 'sla'] = op.v; break; }
    case 'sdel': { const s = SP(op.id); s.steps = s.steps.filter(x => x.id !== op.sid); break; }
    case 'smv': { const s = SP(op.id), i = s.steps.findIndex(x => x.id === op.sid), j = i + op.d; if (i < 0 || j < 0 || j >= s.steps.length) break; const [x] = s.steps.splice(i, 1); s.steps.splice(j, 0, x); break; }
    case 'escset': case 'escadd': { const e = E(op.id); if (!e) break; const l = e.lv.find(x => x.r === op.r); if (l) { l.n = op.n; l.u = op.u; } else e.lv.push({ r: op.r, n: op.n, u: op.u }); sortLv(e); break; }
    case 'et': { const e = E(op.id); if (e) e.t = op.v; break; }
    case 'el': { const e = E(op.id); if (!e || !e.lv[op.i]) break; Object.assign(e.lv[op.i], op.v); sortLv(e); break; }
    case 'ldel': { const e = E(op.id); if (e) e.lv.splice(op.i, 1); break; }
    case 'eadd': G.esc.push({ id: op.id, t: op.v, lv: [{ r: 'smgr', n: 1, u: 'wd' }], add: 1 }); break;
    case 'edel': G.esc = G.esc.filter(x => x.id !== op.id); break;
  }
}
function ogDesc(op, G) {
  const nm = id => orgRN(G, id), e = op.id ? G.esc.find(x => x.id === op.id) : null, st = op.sid ? ((G.sops.find(x => x.id === op.id) || { steps: [] }).steps.find(x => x.id === op.sid) || {}) : {};
  const escAfter = () => { const C = deep(G); ogApply(op, C); return escStr(C, C.esc.find(x => x.id === op.id)); };
  switch (op.k) {
    case 'padd': return { t: nm(op.id) + ': a new person', b: '', a: op.v + (op.from ? ', from ' + op.from : '') };
    case 'pdel': return { t: nm(op.id) + ': removed a person', b: op.v, a: 'Removed' };
    case 'rn': return { t: 'Renamed a role', b: nm(op.id), a: op.v };
    case 'rr': { const r = G.roles.find(x => x.id === op.id); return { t: nm(op.id) + ': responsibilities', b: plural(r ? r.resp.length : 0, 'line'), a: plural(op.v.length, 'line') }; }
    case 'ra': { const r = G.roles.find(x => x.id === op.id); return { t: nm(op.id) + ': access', b: r ? r.acc : '', a: op.v }; }
    case 'radd': return { t: 'Added a role', b: '', a: op.v };
    case 'rdel': return { t: 'Removed the role “' + nm(op.id) + '”', b: '', a: 'Removed, with its SOP' };
    case 'sopadd': return { t: nm(op.id) + ' SOP: a new step', b: '', a: op.t + ' (' + op.sla + ')' };
    case 'st': return { t: nm(op.id) + ' SOP: changed a step', b: st.t || '', a: op.v };
    case 'ss': return { t: nm(op.id) + ' SOP: turnaround of “' + short(st.t || '', 44) + '”', b: st.sla || '', a: op.v };
    case 'sdel': return { t: nm(op.id) + ' SOP: removed a step', b: st.t || '', a: 'Removed' };
    case 'smv': return { t: nm(op.id) + ' SOP: moved “' + short(st.t || '', 44) + '” ' + (op.d < 0 ? 'up' : 'down'), b: '', a: '' };
    case 'et': return { t: 'Renamed an escalation', b: e ? e.t : '', a: op.v };
    case 'escset': case 'escadd': case 'el': case 'ldel': return { t: 'Escalation: ' + short(e ? e.t : '', 70), b: e ? escStr(G, e) : '', a: escAfter() };
    case 'eadd': return { t: 'Added an escalation', b: '', a: op.v };
    case 'edel': return { t: 'Removed an escalation: ' + (e ? e.t : ''), b: e ? escStr(G, e) : '', a: 'Removed' };
  }
  return { t: 'Onboarding', b: '', a: '' };
}
function ogHi(ids) { ADM.ogHi = ids; clearTimeout(ogHi.t); ogHi.t = setTimeout(() => { if (ADM) ADM.ogHi = []; }, 1700); }
function ogOp(op, why, src, srcK) {
  const G = ORGC(); if (!G) return null;
  const d = ogDesc(op, G); if (d.b && d.b === d.a) return null;
  ogApply(op, G);
  if (ONB()) alog2({ area: 'org', what: d.t, b: d.b, a: d.a, why: why || 'Edited in the new setup', src: src || '', srcK: srcK || '' });
  ogHi([(op.k[0] === 'e' || op.k === 'el' || op.k === 'ldel' ? 'esc|' : op.k[0] === 's' ? 'sop|' : 'role|') + (op.id || '')]);
  return d;
}
const DUR = '(\\d+|one|two|three|four|five|six|seven|eight|ten|twelve)\\s+(?:working\\s+)?(minutes?|hours?|days?)';
const durOf = m => m ? { n: toN(m[1]), u: /minute/.test(m[2]) ? 'min' : /hour/.test(m[2]) ? 'wh' : 'wd' } : null;
function ogParse(s0, who, W) {
  const s = s0.toLowerCase().replace(/[’']/g, "'"), mk = op => { const d = ogDesc(op, W); ogApply(op, W); return { props: [{ area: 'org', t: d.t, b: d.b, a: d.a, ops: [op] }] }; };
  const NAME = '([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)+)', role = t => ogRole(t, W), hasRole = id => W.roles.some(x => x.id === id);
  let m = s0.match(/\badd (?:this )?to (?:the )?(.+?) SOP\s*[:,-]\s*(.+)$/i);
  if (m) { const r = role(m[1]); if (!r) return { miss: 'no role by that name' }; const t = cap1(m[2].trim().replace(/[.;]+$/, '')), sla = findSla(t); return mk({ k: 'sopadd', id: r, sid: ogNew(), t, sla: sla ? slaTxt(sla) : 'As needed' }); }
  m = s0.match(new RegExp('^' + NAME + '\\s+(?:joins|is joining|has joined|will join)\\s+(?:the\\s+)?(.+)$'));
  if (!m) { const a = s0.match(new RegExp('^[Aa]dd\\s+' + NAME + '\\s+to\\s+(?:the\\s+)?(.+?)\\.?$')); if (a) m = a; }
  if (m) { const r = role(m[2]); if (!r) return { miss: 'no role by that name' }; if (!hasRole(r)) return { miss: 'the roles are not set up yet' };
    const city = (m[2].match(/\bin ([A-Z][a-z]+)/) || [])[1], from = (m[2].match(/\bfrom ([A-Z0-9][\w ]*?)\s*(?:[.,]|$)/) || [])[1], p = m[1] + (city ? ', ' + city : '');
    if (W.roles.find(x => x.id === r).ppl.some(x => x.split(',')[0] === m[1])) return { miss: m[1] + ' is already in ' + orgRN(W, r) };
    return mk({ k: 'padd', id: r, v: p, from }); }
  m = s0.match(new RegExp('^[Rr]emove\\s+' + NAME + '\\s+from\\s+(?:the\\s+)?(.+?)\\.?$')) || s0.match(new RegExp('^' + NAME + '\\s+(?:has left|is leaving|leaves|left)\\b'));
  if (m) { const r = W.roles.find(x => x.ppl.some(p => p.split(',')[0] === m[1])); if (!r) return { miss: m[1] + ' is not in any role' }; return mk({ k: 'pdel', id: r.id, v: r.ppl.find(p => p.split(',')[0] === m[1]) }); }
  if (/escalat|\btell\b|\binform\b|goes to|go to|\bbata|notify|\balert/.test(s) && /\b(late|after|within|past)\b/.test(s)) {
    const row = (ESCK.find(([re]) => re.test(s)) || [])[1], e = row ? W.esc.find(x => x.id === row) : null;
    const tm = s.match(/\b(?:escalate(?: it)?|tell|inform|notify|alert|goes|go|send it)\s+(?:it\s+)?(?:to\s+)?(?:the\s+)?(me\b|[a-z][a-z ,-]*?)(?=\s+(?:after|too|also|as well|within|if|when|not)\b|[.,;]|$)/);
    const r = tm ? (tm[1] === 'me' ? who : role(tm[1])) : /\bme\b/.test(s) ? who : '';
    const t = durOf(s.match(new RegExp('after\\s+' + DUR))) || durOf(s.match(new RegExp('late by\\s+' + DUR))) || durOf(s.match(new RegExp(DUR + '\\s+(?:late|past)')));
    if (!e) return { miss: 'no escalation like it in the matrix' }; if (!r) return { miss: 'it does not say who to escalate to' }; if (!t || !t.n) return { miss: 'it does not say after how long' };
    const l = e.lv.find(x => x.r === r); if (l && l.n === t.n && l.u === t.u) return { miss: 'that is already the rule' }; if (!l && e.lv.length >= 3) return { miss: 'an escalation has up to 3 levels' };
    return mk({ k: l ? 'escset' : 'escadd', id: row, r, n: t.n, u: t.u });
  }
  return { miss: 'no change to the roles, SOPs or escalations found' };
}
function tkParse(ctx, txt, who) {
  const W = deep(ctx === 'org' ? ORGC() : FM()), props = [], miss = [];
  tkSplit(txt).forEach(s0 => { const r = ctx === 'org' ? ogParse(s0, who, W) : fmParse(ctx, s0, W); if (r.props) r.props.forEach(p => { p.on = 1; p.q = s0; props.push(p); }); else miss.push({ q: s0, why: r.miss || '' }); });
  return { props, miss };
}
Object.assign(ACT, {
  tkpick(v) { const [ctx, k] = v.split('|'), T = ADM.tk[ctx]; if (T.k !== k) { TKP.stop(); T.k = k; T.pt = 0; } T.added = ''; render(); },
  tksug(v) { const i = v.indexOf('|'), ctx = v.slice(0, i), x = v.slice(i + 1), T = ADM.tk[ctx]; T.k = 'text'; T.txt = (T.txt.trim() ? T.txt.trim() + '\n' : '') + x; T.phase = 'pick'; T.added = ''; render(); },
  tkplay(ctx) {
    const T = ADM.tk[ctx], V = TKS[ctx].voice; if (T.play) { TKP.stop(); tkSync(ctx); return; }
    TKP.stop(); if (T.pt >= V.dur) T.pt = 0; T.play = 1; TKP.ctx = ctx; tkSync(ctx);
    TKP.tm = setInterval(() => { if (!ADM || ADM.tk[ctx] !== T) { TKP.stop(); return; } T.pt = Math.min(V.dur, T.pt + 1); if (T.pt >= V.dur) TKP.stop(); tkSync(ctx); }, 120);
  },
  tkgo(ctx) {
    const T = ADM.tk[ctx], X = TKS[ctx]; if (!T.k) return; TKP.stop();
    const txt = T.k === 'voice' ? X.voice.segs.map(s => s.e || s.o).join('\n') : T.k === 'doc' ? X.doc.lines.join('\n') : T.txt; if (!txt.trim()) return;
    T.phase = 'run'; T.step = 0; T.added = ''; render(); const N = T.k === 'text' ? 2 : 3;
    const nx = () => { if (!ADM || ADM.tk[ctx] !== T || T.phase !== 'run') return; T.step++; if (T.step < N) { render(); setTimeout(nx, 480); return; }
      const who = T.k === 'voice' ? X.voice.role : T.k === 'doc' ? X.doc.role : 'losadm', r = tkParse(ctx, txt, who);
      T.props = r.props; T.miss = T.k === 'voice' ? [] : r.miss; T.phase = r.props.length ? 'review' : 'pick'; render();
      if (!r.props.length) toast(r.miss.length && r.miss[0].why ? 'Nothing to change: ' + r.miss[0].why : 'No change found. Try one of the examples'); };
    setTimeout(nx, 480);
  },
  tkadd(ctx) {
    const T = ADM.tk[ctx], P = T.props.filter(p => p.on); if (!P.length) return;
    const src = tkSrcLbl(ctx, T.k), srcK = { voice: 'S2', doc: 'S1', text: 'T' }[T.k], why = T.k === 'text' ? 'Typed on the Admin page' : 'As asked in ' + tkSrcName(ctx, T.k), ids = []; let n = 0;
    P.forEach(p => p.ops.forEach(op => { const d = ctx === 'org' ? ogOp(op, why, src, srcK) : fmOp(op, why, src, srcK); if (d) { n++; ids.push(ctx === 'org' ? (ADM.ogHi || [])[0] : (ADM.fmHi || [])[0]); } }));
    if (ctx === 'org') { ogHi(ids); const k = P[0].ops[0].k; ADM.osec = /^esc/.test(k) ? 'esc' : k === 'sopadd' ? 'sops' : 'roles'; if (k === 'sopadd') ADM.osop = P[0].ops[0].id; } else fmHi(ids);
    if (!ONB() && n) { ADM.src = src; ADM.srcK = srcK; if (!ADM.why.trim() && T.k !== 'text') ADM.why = why; }
    T.added = n ? plural(n, 'change') + (ONB() ? ' made from ' + tkSrcName(ctx, T.k) + '. Each one is in the audit trail.' : ' added to the draft from ' + tkSrcName(ctx, T.k) + '. Save them at the bottom of the page.') : 'Nothing changed: the form already matches.';
    T.phase = 'pick'; T.k = null; T.props = []; T.miss = []; T.txt = ''; T.pt = 0;
    render(); if (n) toast(plural(n, 'change') + (ONB() ? ' made' : ' added to the draft'));
  },
  tkreset(ctx) { const T = ADM.tk[ctx]; T.phase = 'pick'; T.props = []; T.miss = []; render(); }
});

/* ---------------- 7. Onboarding: roles, SOPs and the escalation matrix ---------------- */
const ogDm = () => { const dm = {}; if (!ONB()) orgDiff(ADM.org.live, ADM.org.liveW).forEach(d => { if (!dm[d.id] || d.k === 'add') dm[d.id] = d.k; }); (ADM.ogHi || []).forEach(id => { dm[id] = dm[id] || 'hi'; }); return dm; };
const ogCls = st => st ? (st === 'hi' ? ' hi' : ' d-' + st) : '';
const ogTag = st => st && st !== 'hi' ? dTag(st) : '';
function orgSecHTML() {
  const onb = ONB();
  if (onb && ADM.disc.phase === 'run') return runDisc();
  const G = ORGC();
  const head = `<div class="cap6-h"><h3>Onboarding</h3><p>Who does what, how each role does it, and who hears about it when something is late. ${onb ? 'Set up from your documents in Discovery; change anything here, by hand or by telling Uncia.' : 'What is running now. Changes stay in a draft until you save them with a reason.'}</p></div>`;
  if (!G || (!G.roles.length && !G.sops.length && !G.esc.length)) return head + emptyHTML2('users', 'No roles yet', 'Add the role master and the escalation matrix in Discovery. Uncia sets up who does what, an SOP for each role from your SOP, and who to escalate to. Or start from the standard home loan roles and change them here.', [['orgstd', '', 'Start from the standard roles', 1], ['asec', 'disc', 'Go to Discovery']]);
  const src = onb ? listAnd(['RMX', 'ESC', 'S1'].filter(k => ADM.org.onbSrc[k]).map(k => dsrc(k).n)) : '';
  const tabs = [['roles', 'Roles and responsibilities', G.roles.length], ['sops', 'SOPs', G.sops.length], ['esc', 'Escalation matrix', G.esc.length]];
  const sub = `<div class="og-t" role="tablist" aria-label="Onboarding">${tabs.map(([k, l, n]) => `<button class="flt${ADM.osec === k ? ' on' : ''}" data-act="osec" data-v="${k}" role="tab" aria-selected="${ADM.osec === k}">${l} <span>${n}</span></button>`).join('')}${src ? `<span class="og-src">${ic('file')}From ${esc(src)}</span>` : ''}</div>`;
  const dm = ogDm(), body = { roles: ogRolesHTML, sops: ogSopsHTML, esc: ogEscHTML }[ADM.osec](G, dm);
  return head + tkHTML('org') + sub + body;
}
function ogRolesHTML(G, dm) {
  if (!G.roles.length) return `<p class="og-none">No roles yet. Add the role master in Discovery, <button class="lnk" data-act="orgstd">start from the standard roles</button> or <button class="lnk" data-act="ogradd">add a role by hand</button>.</p>`;
  const card = r => {
    const id = 'role|' + r.id, st = dm[id], lim = roleLim(r.id), ed = ADM.oed === id;
    if (ed) return `<article class="og-r ed"><label class="fp-f">Role<input class="inp2" data-og="rn|${r.id}" value="${esc(r.n)}"></label>
      <div class="fp-f">People<div class="og-pp">${r.ppl.map(p => `<span class="og-p">${esc(p)}<button class="mk-x" data-act="ogpdel" data-v="${r.id}|${esc(p)}" aria-label="Remove ${esc(p)}">${ic('x')}</button></span>`).join('') || '<small class="og-0">No one yet</small>'}</div><div class="og-add"><input class="inp2" id="ogp-${r.id}" placeholder="Name, and city if any" aria-label="Add a person"><button class="btn btn-s btn-sm" data-act="ogpadd" data-v="${r.id}">${ic('plus')}Add</button></div></div>
      <label class="fp-f">Responsibilities, one a line<textarea class="ta" rows="4" data-og="rr|${r.id}">${esc(r.resp.join('\n'))}</textarea></label>
      <label class="fp-f">Access in the LOS<input class="inp2" data-og="ra|${r.id}" value="${esc(r.acc)}"></label>
      <div class="fp-a"><button class="btn btn-p btn-sm" data-act="oged" data-v="">${ic('check')}Done</button>${r.id === 'losadm' ? '' : `<button class="btn btn-g btn-sm" data-act="ogrdel" data-v="${r.id}">${ic('trash')}Remove the role</button>`}</div></article>`;
    return `<article class="og-r${ogCls(st)}">${ogTag(st)}<header><b>${esc(r.n)}</b><button class="ibtn" data-act="oged" data-v="${id}" aria-label="Edit ${esc(r.n)}" title="Edit">${ic('pen')}</button></header>${lim ? `<span class="og-lim">${ic('shield')}${esc(lim)}</span>` : ''}
      <div class="og-pp">${r.ppl.map(p => `<span class="og-p"><i>${esc(inits(p.split(',')[0]))}</i>${esc(p)}</span>`).join('') || '<small class="og-0">No one yet</small>'}</div>
      ${r.resp.length ? `<ul class="og-rs">${r.resp.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}<small class="og-acc">${ic('key')}${esc(r.acc)}</small></article>`;
  };
  return `<div class="og-rg">${G.roles.map(card).join('')}<button class="og-new" data-act="ogradd">${ic('plus')}Add a role</button></div>`;
}
function ogSopsHTML(G, dm) {
  const ids = [...new Set(G.roles.map(r => r.id).concat(G.sops.map(s => s.id)))];
  if (!ids.length) return `<p class="og-none">No SOPs yet: add the SOP in Discovery.</p>`;
  if (!ids.includes(ADM.osop)) ADM.osop = (G.sops[0] || { id: ids[0] }).id;
  const s = G.sops.find(x => x.id === ADM.osop) || { id: ADM.osop, steps: [] }, id = 'sop|' + s.id, ed = ADM.oed === id, r = G.roles.find(x => x.id === s.id), st = dm[id];
  const nav = `<nav class="og-sl" aria-label="Roles">${ids.map(k => { const x = G.sops.find(y => y.id === k), d = dm['sop|' + k]; return `<button class="${k === ADM.osop ? 'on' : ''}${d && d !== 'hi' ? ' chg' : ''}" data-act="osop" data-v="${k}"><b>${esc(orgRN(G, k))}</b><small>${x && x.steps.length ? plural(x.steps.length, 'step') : 'No SOP yet'}</small></button>`; }).join('')}</nav>`;
  const rows = s.steps.map((x, i) => ed
    ? `<li class="ed"><span class="og-n">${i + 1}</span><span class="og-se"><textarea class="ta" rows="2" data-og="st|${s.id}|${x.id}" aria-label="Step ${i + 1}">${esc(x.t)}</textarea><input class="inp2" data-og="ss|${s.id}|${x.id}" value="${esc(x.sla)}" aria-label="Turnaround of step ${i + 1}"></span><span class="og-sa"><button class="ibtn" data-act="ogsmv" data-v="${s.id}|${x.id}|-1"${i ? '' : ' disabled'} aria-label="Move up">${ic('up')}</button><button class="ibtn" data-act="ogsmv" data-v="${s.id}|${x.id}|1"${i < s.steps.length - 1 ? '' : ' disabled'} aria-label="Move down">${ic('dn')}</button><button class="ibtn" data-act="ogsdel" data-v="${s.id}|${x.id}" aria-label="Remove step ${i + 1}">${ic('trash')}</button></span></li>`
    : `<li><span class="og-n">${i + 1}</span><span class="og-tx"><b>${esc(x.t)}</b><small>${ic('clock')}${esc(x.sla)}${x.src ? `<span>${ic('file')}${esc(x.src)}</span>` : x.add ? '<span>Added here</span>' : ''}</small></span></li>`).join('');
  return `<div class="og-sw${ogCls(st)}">${nav}<section class="panel og-sop">${ogTag(st)}<div class="ph"><h3>${esc(orgRN(G, s.id))}</h3><span class="note">${r && r.ppl.length ? esc(listAnd(r.ppl.map(p => p.split(',')[0]))) : ''}</span>${ed ? '' : `<button class="btn btn-s btn-sm" data-act="oged" data-v="${id}">${ic('pen')}Edit</button>`}</div><div class="pb">${s.steps.length ? `<ol class="og-st">${rows}</ol>` : '<p class="og-none">No steps yet.</p>'}
  ${ed ? `<div class="fp-a"><button class="btn btn-s btn-sm" data-act="ogsadd" data-v="${s.id}">${ic('plus')}Add a step</button><button class="btn btn-p btn-sm" data-act="oged" data-v="">${ic('check')}Done</button></div>` : s.steps.length ? '' : `<div class="fp-a"><button class="btn btn-s btn-sm" data-act="ogsadd" data-v="${s.id}">${ic('plus')}Add a step</button></div>`}
  <p class="fp-n">${s.steps.length ? 'Each step shows where it came from.' : ''}</p></div></section></div>`;
}
function ogEscHTML(G, dm) {
  const roles = G.roles.length ? G.roles.map(r => [r.id, r.n]) : OROLE.map(([id, n]) => [id, n]);
  const lvHTML = (e, l, i, ed) => {
    if (!l) return ed && i === e.lv.length && i < 3 ? `<td><button class="btn btn-s btn-sm" data-act="ogladd" data-v="${e.id}">${ic('plus')}Add a level</button></td>` : '<td class="og-0">None</td>';
    if (!ed) { const r = G.roles.find(x => x.id === l.r); return `<td><b>${esc(orgRN(G, l.r))}</b>${r && r.ppl.length ? `<small>${esc(listAnd(r.ppl.map(p => p.split(',')[0]).slice(0, 2)))}</small>` : ''}<span class="og-af">${ic('clock')}After ${esc(afterTxt(l))}</span></td>`; }
    return `<td class="og-le"><select class="sel" data-og="er|${e.id}|${i}" aria-label="Level ${i + 1}: who">${roles.map(([id, n]) => `<option value="${id}"${id === l.r ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select><span class="og-lt"><input class="pin6 sm" type="number" min="1" data-og="en|${e.id}|${i}" value="${l.n}" aria-label="Level ${i + 1}: after how long"><select class="sel" data-og="eu|${e.id}|${i}" aria-label="Level ${i + 1}: unit">${Object.entries(UNITS).map(([k, u]) => `<option value="${k}"${k === l.u ? ' selected' : ''}>${u[0]}s</option>`).join('')}</select><button class="ibtn" data-act="ogldel" data-v="${e.id}|${i}" aria-label="Remove level ${i + 1}"${e.lv.length > 1 ? '' : ' disabled'}>${ic('x')}</button></span></td>`;
  };
  const row = e => { const id = 'esc|' + e.id, ed = ADM.oed === id, st = dm[id];
    return `<tr class="${ed ? 'ed' : ''}${ogCls(st)}"><td>${ed ? `<textarea class="ta" rows="2" data-og="et|${e.id}" aria-label="When it applies">${esc(e.t)}</textarea>` : `<b>${esc(e.t)}</b>`}${ogTag(st)}</td>${[0, 1, 2].map(i => lvHTML(e, e.lv[i], i, ed)).join('')}<td class="og-ea"><span>${ed ? `<button class="ibtn" data-act="ogedel" data-v="${e.id}" aria-label="Remove this escalation" title="Remove">${ic('trash')}</button><button class="btn btn-p btn-sm" data-act="oged" data-v="">Done</button>` : `<button class="ibtn" data-act="oged" data-v="${id}" aria-label="Edit this escalation" title="Edit">${ic('pen')}</button>`}</span></td></tr>`; };
  return `<section class="panel"><div class="ph"><h3>Escalation matrix</h3><span class="note">The system sends each one by itself, counted from when the step went past its turnaround</span></div><div class="pb og-ew"><table class="og-et"><thead><tr><th>When</th><th>Level 1</th><th>Level 2</th><th>Level 3</th><th><span class="vh11">Edit</span></th></tr></thead><tbody>${G.esc.map(row).join('') || '<tr><td colspan="5" class="og-0">No escalations yet. <button class="lnk" data-act="orgstd">Start from the standard matrix</button></td></tr>'}</tbody></table></div></section><button class="og-new wide" data-act="ogeadd">${ic('plus')}Add an escalation</button>`;
}
Object.assign(ACT, {
  osec(v) { ADM.osec = v; ADM.oed = null; render(); },
  osop(v) { ADM.osop = v; ADM.oed = null; render(); },
  oged(v) { ADM.oed = v || null; render(); if (v) { const el = document.querySelector('.og-r.ed input, .og-st .ed textarea, tr.ed textarea'); if (el && v.indexOf('role|') === 0) el.focus(); } },
  orgstd() { const B = orgBuild(ADM.onb.wf, { roles: 1, sops: !!ADM.onb.wf, esc: 1 }), G0 = ADM.org.onb; if (!G0) { ADM.org.onb = B; ADM.org.onbSrc = {}; } else { if (!G0.roles.length) G0.roles = B.roles; if (!G0.esc.length) G0.esc = B.esc; if (!G0.sops.length) G0.sops = B.sops; } const G = ADM.org.onb; alog2({ area: 'org', what: 'Started from the standard roles', a: plural(G.roles.length, 'role') + ', ' + plural(G.sops.length, 'SOP') + ', ' + plural(G.esc.length, 'escalation'), why: 'New setup' }); render(); },
  ogpadd(v) { const el = $('#ogp-' + v), p = el ? el.value.replace(/\s+/g, ' ').trim() : ''; if (!p) { if (el) el.focus(); return; } const G = ORGC(), r = G.roles.find(x => x.id === v); if (r && r.ppl.includes(p)) { toast(p + ' is already in this role'); return; } ogOp({ k: 'padd', id: v, v: p }); render(); const n = $('#ogp-' + v); if (n) n.focus(); },
  ogpdel(v) { const i = v.indexOf('|'); ogOp({ k: 'pdel', id: v.slice(0, i), v: v.slice(i + 1) }); render(); },
  ogradd() { const id = 'r' + (++ADM.nid); ogOp({ k: 'radd', id, v: 'New role' }); ADM.osec = 'roles'; ADM.oed = 'role|' + id; render(); const el = document.querySelector('.og-r.ed input'); if (el) { el.focus(); el.select(); } },
  ogrdel(v) { const G = ORGC(), n = orgRN(G, v); ogOp({ k: 'rdel', id: v }); ADM.oed = null; render(); toast('Removed the role “' + n + '”'); },
  ogsadd(v) { const sid = ogNew(); ogOp({ k: 'sopadd', id: v, sid, t: 'New step', sla: '1 working day' }); ADM.oed = 'sop|' + v; render(); const el = document.querySelector('[data-og="st|' + v + '|' + sid + '"]'); if (el) { el.focus(); el.select(); } },
  ogsdel(v) { const [id, sid] = v.split('|'); ogOp({ k: 'sdel', id, sid }); render(); },
  ogsmv(v) { const [id, sid, d] = v.split('|'); ogOp({ k: 'smv', id, sid, d: +d }); render(); },
  ogladd(v) { const G = ORGC(), e = G.esc.find(x => x.id === v); if (!e || e.lv.length >= 3) return; const used = e.lv.map(l => l.r), last = e.lv[e.lv.length - 1] || { n: 0, u: 'wd' }, r = ['rcm', 'zcm', 'nch', 'smgr', 'cops'].find(x => !used.includes(x)) || 'nch'; ogOp({ k: 'escadd', id: v, r, n: last.n + 1, u: last.u }); render(); },
  ogldel(v) { const [id, i] = v.split('|'); ogOp({ k: 'ldel', id, i: +i }); render(); },
  ogeadd() { const id = 'x' + (++ADM.nid); ogOp({ k: 'eadd', id, v: 'A step is past its turnaround' }); ADM.osec = 'esc'; ADM.oed = 'esc|' + id; render(); const el = document.querySelector('tr.ed textarea'); if (el) { el.focus(); el.select(); } },
  ogedel(v) { ogOp({ k: 'edel', id: v }); ADM.oed = null; render(); }
});

/* ---------------- 1. Discovery: reading what was added ---------------- */
Object.assign(ACT, {
  dsrc(v) { const O = ADM.onb; O.src[v] = O.src[v] ? 0 : 1; if (v === 'POL') O.polOn = O.src[v]; render(); },
  dread() {
    const O = ADM.onb, D = ADM.disc, att = [].concat(...DGRP.map(g => g[4].map(x => x[0]))).filter(k => O.src[k]), txt = (O.txt || '').trim();
    if (!att.length && !txt) return; TKP.stop();
    D.steps = att.map(k => DREAD[k]).concat(txt ? ['Reading your own words'] : [], ['Finding steps, rules, fields, documents and roles', 'Building each section, with where every item came from']); D.step = 0; D.phase = 'run'; render();
    const nx = () => { if (!ADM || ADM.disc !== D || D.phase !== 'run') return; D.step++; if (D.step < D.steps.length) { render(); setTimeout(nx, 380); return; }
      discBuild(att, txt); D.phase = 'done'; Object.values(ADM.tk).forEach(t => Object.assign(t, tkNew())); render();
      const built = [O.wf && 'the workflow', ADM.fm.onb && 'the forms', O.pol && 'the policy rules', ADM.org.onb && 'the roles'].filter(Boolean);
      toast('Read ' + plural(att.length + (txt ? 1 : 0), 'source') + (built.length ? '. Built ' + listAnd(built) : '')); };
    setTimeout(nx, 380);
  },
  resetall() { TKP.stop(); _resetall11(); },
  asec(v) { TKP.stop(); _asec11(v); }
});

/* ---------------- inputs ---------------- */
document.addEventListener('change', ev => {
  const el = ev.target; if (!el || !el.dataset || S.view !== 'admin' || !ADM || !ADM.fm) return;
  if (el.dataset.fm === 'coon' || el.dataset.fm === 'comax') { const F = FM(); if (!F) return; const on = el.dataset.fm === 'coon', key = on ? 'on' : 'max', v = on ? (el.checked ? 1 : 0) : Math.max(1, Math.min(4, +el.value || 1)); if (F.login.cofg[key] === v) return; fmOp({ k: 'cofg', form: 'login', v: { [key]: v } }); render(); return; }
  if (el.dataset.fm) { const F = FM(); if (!F) return; const k = el.dataset.fm, v = k === 'amt' ? Math.max(0, Math.round(+el.value || 0)) : el.checked ? 1 : 0; if (F.login.fee[k] === v) return; fmOp({ k: 'fee', form: 'login', v: { [k]: v } }); render(); return; }
  if (el.dataset.tk) { const [ctx, i] = el.dataset.tk.split('|'), p = ADM.tk[ctx].props[+i]; if (p) p.on = el.checked ? 1 : 0; render(); return; }
  if (el.dataset.og) {
    const [k, id, x] = el.dataset.og.split('|'), G = ORGC(); if (!G) return; const v = el.value.replace(/[ \t]+/g, ' ').trim();
    if (k === 'rn' && v) ogOp({ k: 'rn', id, v });
    else if (k === 'ra' && v) ogOp({ k: 'ra', id, v });
    else if (k === 'rr') ogOp({ k: 'rr', id, v: el.value.split('\n').map(l => l.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean) });
    else if (k === 'st' && v) ogOp({ k: 'st', id, sid: x, v });
    else if (k === 'ss' && v) ogOp({ k: 'ss', id, sid: x, v });
    else if (k === 'et' && v) ogOp({ k: 'et', id, v });
    else if (k === 'er') ogOp({ k: 'el', id, i: +x, v: { r: el.value } });
    else if (k === 'en') { const n = Math.max(1, Math.round(+el.value || 1)); ogOp({ k: 'el', id, i: +x, v: { n } }); }
    else if (k === 'eu') ogOp({ k: 'el', id, i: +x, v: { u: el.value } });
    render();
  }
});
document.addEventListener('input', ev => {
  const el = ev.target; if (!el || !ADM || !ADM.tk) return;
  const m = el.id && el.id.match(/^tktxt-(lead|login|org)$/);
  if (m) { ADM.tk[m[1]].txt = el.value; const g = $('#tkGo-' + m[1]); if (g) g.disabled = !el.value.trim(); }
  if (el.id === 'ocap') { const n = Object.keys(ADM.onb.src).filter(k => ADM.onb.src[k]).length + (el.value.trim() ? 1 : 0), g = $('#dreadGo'), c = $('#dcN'); if (g) g.disabled = !n; if (c) c.textContent = plural(n, 'source') + ' added'; }
});
document.addEventListener('keydown', ev => {
  const t = ev.target; if (!t || !t.id || ev.key !== 'Enter') return;
  if (/^ogp-/.test(t.id)) { ev.preventDefault(); ACT.ogpadd(t.id.slice(4)); }
});

/* ---------------- the live page's Change something finds form and role changes too ---------------- */
TXTSUG.push('Make PAN mandatory at the lead');
const _parseChanges11 = parseChanges, _applyOps11 = applyOps, _ikadd11 = ACT.ikadd, _ikHTML11 = ikHTML;
parseChanges = function (txt) {
  const r = _parseChanges11(txt); if (!ADM || ONB() || !ADM.fm) return r;
  const Wf = deep(ADM.fm.liveW), Wo = deep(ADM.org.liveW), who = ADM.ik.k === 'voice' ? 'nch' : 'losadm', miss = [];
  r.miss.forEach(s0 => {
    let got = null;
    for (const ctx of ['lead', 'login']) { const x = fmParse(ctx, s0, Wf); if (x.props) { got = x.props; break; } }
    if (!got) { const x = ogParse(s0, who, Wo); if (x.props) got = x.props; }
    if (got) got.forEach(p => { p.on = 1; p.q = s0; p.ch = []; r.props.push(p); }); else miss.push(s0);
  });
  r.miss = miss; return r;
};
applyOps = function (p) { if (p.ops) { p.ops.forEach(op => { if (p.area === 'form') fmOp(op); else ogOp(op); }); return; } _applyOps11(p); };
ACT.ikadd = function () {
  const P = ADM.ik.props.filter(p => p.on), f = P[0]; _ikadd11();
  if (f && f.area === 'form') { ADM.fsel = f.ops[0].form === 'login' ? 'T3' : 'T1'; render(); }
  if (f && f.area === 'org') { const k = f.ops[0].k; ADM.osec = /^esc/.test(k) ? 'esc' : k === 'sopadd' ? 'sops' : 'roles'; render(); }
};
ikHTML = function () { return _ikHTML11().replace('The system finds the changes across the workflow, the rules and the vendors.', 'The system finds the changes across the workflow, the forms, the rules, the vendors and the roles.'); };

/* =====================================================================
   v12: a co-applicant can be added at login. They get their own consent
   SMS and upload link. What they earn counts straight away, as declared,
   and is checked against their documents when those come in.
   ===================================================================== */
Object.assign(ICO, { userplus: '<path d="M15 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 3 18.5V20"/><circle cx="9" cy="8" r="3.5"/><path d="M19 8v6M22 11h-6"/>' });
const COREL = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other relative'];
const COSEX = { Father: 'M', Son: 'M', Brother: 'M', Mother: 'F', Daughter: 'F', Sister: 'F' };
const COEMP = [['sal', 'Salaried'], ['se', 'Self-employed'], ['no', 'Does not earn']];
/* the RM's screen runs on the live setup; Form design on the Admin page previews changes to it */
const coCfg = () => FORM0.login.cofg;
const coWhen = (k, emp) => { const w = CDOC[k][1]; return w === 'Every co-applicant' || (emp === 'sal' && /salaried/.test(w)) || (emp === 'se' && /self-employed/.test(w)); };
const CODT = { pan: ['pan', 'PAN', 1, 'jpg'], adh: ['adh', 'Aadhaar (masked)', 1, 'pdf'], sal: ['sal', 'Salary slips, Aug to Oct 2026', 2, 'pdf'], f16: ['f16', 'Form 16, two years', 2, 'pdf'], itr: ['itr', 'ITR with computation, two years', 2, 'pdf'], bank12: ['bnk', 'Bank statements, 12 months', 3, 'pdf'], bank6: ['bnk', 'Bank statements, 6 months', 3, 'pdf'], photo: ['pho', 'Photograph', 1, 'jpg'], relp: ['rlp', 'Proof of relationship', 1, 'pdf'] };
const COPROF = { sal: { occ: 'Assistant professor', org: 'Deccan College of Commerce', orgCat: 'B', yrs: 5 }, se: { occ: 'Runs a boutique', org: 'Own business', orgCat: null, yrs: 6 } };
/* what the co-applicant's documents show when they arrive */
const coVals = (aid, emp) => emp === 'sal' ? { ['sal_' + aid]: [['August 2026', 61800], ['September 2026', 62000], ['October 2026', 62400]], ['f16_' + aid]: [['FY 2025-26, a month', 59500]] }
  : emp === 'se' ? { ['itr_' + aid]: [['FY 2025-26, a month', 58000], ['FY 2024-25, a month', 52500]] } : {};
const fnA = a => a.name.split(' ')[0];
const pron = a => a.sex === 'F' ? 'her' : a.sex === 'M' ? 'his' : 'their';
const coLive = (c, aid, k) => CASES.includes(c) ? c.apps.find(a => a.id === aid && a.coK === k) : null;
const coDocs = (c, a) => c.docs.filter(d => d.who === a.id && d.need === 'login');
const coPan = a => 'CQXP' + ((a.name.split(' ').slice(-1)[0] || 'X')[0] || 'X').toUpperCase() + '3390K';
function coNew(c) { return { rel: 'Spouse', first: '', last: c.apps[0].name.split(' ').slice(-1)[0], mob: '', emp: 'sal', inc: '', own: 1, bad: [] }; }

/* ---------------- the panel the RM fills in ---------------- */
function coSheet() {
  if (!S.sheet || S.sheet.k !== 'coapp') return '';
  const c = C(); if (!c) return '';
  const X = S.co || (S.co = coNew(c)), m = fnA(c.apps[0]), first = X.first.trim(), them = first || 'the co-applicant', cfg = coCfg();
  const docs = FORM0.login.codocs.filter(d => coWhen(d.k, X.emp));
  const fld = (k, l, req, ctl) => `<label class="nl9-f${X.bad.includes(k) ? ' bad' : ''}"><span class="nl-l">${esc(l)}${req ? '<i class="req" aria-hidden="true">*</i>' : ''}</span>${ctl}</label>`;
  const inp = (k, l, req, extra) => fld(k, l, req, `<input class="inp2" data-co="${k}" value="${esc(X[k])}" autocomplete="off"${extra || ''} aria-label="${esc(l)}"${req ? ' aria-required="true"' : ''}>`);
  const body = `<section class="nl9-s"><div class="nl9-h"><b>Co-applicant</b><span>Joins ${esc(m)} on this loan. They get their own consent SMS and upload link.</span></div>
  <div class="nl9-g">${inp('first', 'First name', 1, ' data-autofocus')}${inp('last', 'Last name', 0)}${fld('rel', 'Relationship to ' + m, 0, `<select class="inp2" data-co="rel" aria-label="Relationship to ${esc(m)}">${COREL.map(o => `<option${X.rel === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`)}${inp('mob', 'Contact number', 1, ' inputmode="tel" placeholder="10-digit mobile"')}</div></section>
  <section class="nl9-s"><div class="nl9-h"><b>Income</b><span>${X.emp === 'no' ? 'Not counted towards eligibility.' : 'Counts towards eligibility straight away, as declared. The system checks it against their documents when they come in.'}</span></div>
  <div class="seg2 co-emp" role="radiogroup" aria-label="Work">${COEMP.map(([k, l]) => `<button class="${X.emp === k ? 'on' : ''}" data-act="coemp" data-v="${k}" role="radio" aria-checked="${X.emp === k}">${l}</button>`).join('')}</div>
  ${X.emp === 'no' ? '' : `<div class="nl9-g">${inp('inc', X.emp === 'sal' ? 'Monthly pay, as declared (₹)' : 'Monthly income, as declared (₹)', 1, ' inputmode="numeric"')}</div>`}</section>
  <section class="nl9-s"><div class="nl9-h"><b>The property</b></div><label class="co-own"><input type="checkbox" data-co="own"${X.own ? ' checked' : ''}><span><b>Co-owner of the property</b><small>The sale deed will be in both names.</small></span></label></section>
  <section class="nl9-s"><div class="nl9-h"><b>Documents they upload</b><span>${plural(docs.length, 'document')}, through their own link</span></div><div class="nl9-ds">${docs.map(d => `<div class="nl9-d">${ic('file')}<div><b>${esc(CDOC[d.k][0])}</b><small>${d.req ? 'Required' : 'Optional'}</small></div></div>`).join('')}</div></section>
  <div class="nl9-c">${ic('lock')}<p><b>Their own consent.</b> An SMS asks ${esc(them)} to approve a credit report pull, which records an enquiry, and 12 months of bank data through the Account Aggregator. It carries the link to upload these documents.</p></div>`;
  return `<div class="scrim" data-act="shclose"></div><aside class="as open nl9 co12" role="dialog" aria-modal="true" aria-label="Add a co-applicant"><div class="as-h"><div><b>Add a co-applicant</b><small>${esc(c.v.appNo)}, ${esc(caseName(c))}</small></div><button class="nic" data-act="shclose" aria-label="Close">${ic('x')}</button></div>
  <div class="as-b nl9-b" id="cob">${body}</div>
  <div class="as-f nl-f2"><span class="nl-hint">Up to ${plural(cfg.max, 'co-applicant')} on a file.</span><button class="btn btn-s" data-act="shclose">Cancel</button><button class="btn btn-p" data-act="cogo">${ic('send')}Add and send the SMS</button></div></aside>`;
}
const _nlSheet12 = nlSheet;
nlSheet = function () { return coSheet() || _nlSheet12(); };
document.addEventListener('input', ev => {
  const el = ev.target; if (!el || !el.dataset || !el.dataset.co || !S.co) return;
  const k = el.dataset.co; S.co[k] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : el.value;
  if (S.co.bad.includes(k)) { S.co.bad = S.co.bad.filter(x => x !== k); const l = el.closest('label'); if (l) l.classList.remove('bad'); }
});
document.addEventListener('change', ev => {
  const el = ev.target; if (!el || !el.dataset || !el.dataset.co || !S.co) return;
  const k = el.dataset.co; S.co[k] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : el.value;
});

/* ---------------- adding one: the SMS goes out, and the income counts at once ---------------- */
function coAdd(c, X) {
  const ids = c.apps.map(a => a.id); let n = 2; while (ids.includes('a' + n)) n++;
  const aid = 'a' + n, first = cap1(X.first.trim()), last = X.last.trim() ? cap1(X.last.trim()) : '', name = (first + ' ' + last).trim(), emp = X.emp, earning = emp !== 'no';
  const inc = earning ? Math.round(nlNum(X.inc)) : 0, me = meWho(), mob = X.mob.replace(/\D/g, '').slice(-10), at = tick(1), k = Date.now() + Math.random();
  const sex = COSEX[X.rel] || (X.rel === 'Spouse' ? ({ M: 'F', F: 'M' })[c.apps[0].sex] || null : null);
  const a = { id: aid, role: 'Co-applicant', rel: X.rel + (X.own ? ', co-owner' : ''), name, ini: inits(name) || name.slice(0, 1).toUpperCase(), age: null, sex,
    emp: earning ? (emp === 'sal' ? 'Salaried' : 'Self-employed') : 'Not earning', occ: '', org: '', orgCat: null, yrs: 0, inc, incDecl: inc,
    incSrc: earning ? 'Declared at login by ' + me.name : 'No income considered', earning, cibil: null, dpd: Z24, enq6: 0, accts: 0, pan: '', aadhaar: '',
    ckyc: 'Searched when the KYC documents are in', addr: c.apps[0].addr, mobile: mask10(mob), email: '',
    coAt: at, coBy: me.name, coK: k, coSt: 'sent', coEmp: emp, coMob: mob, docVals: coVals(aid, emp) };
  c.apps.push(a);
  if (X.own && c.prop && c.prop.owners && !c.prop.owners.includes(aid)) c.prop.owners.push(aid);
  const docs = FORM0.login.codocs.filter(d => coWhen(d.k, emp));
  docs.forEach(d => { const [p, t, ci, ext] = CODT[d.k]; c.docs.push(Object.assign(dk(p + '_' + aid, t + ', ' + first, DCAT[ci], d.req ? 'login' : 'opt', t.split(',')[0].replace(/\W+/g, '_').replace(/_+$/, '') + '_' + first + '.' + ext), { who: aid })); });
  log(c, meW(), 'data', 'Co-applicant added at login: ' + name, X.rel + (X.own ? ', co-owner of the property' : '') + '. ' + (earning ? a.emp + ', ' + inr(inc) + ' a month as declared.' : 'Does not earn; no income counted.'), { at });
  log(c, who('sys', 'System', 'Messages'), 'comms', 'Consent request and upload link sent by SMS to ' + first, '+91 ' + mask10(mob) + '. Privacy notice version 3.2. ' + plural(docs.length, 'document') + ' to upload.');
  if (earning) { const key = 'inc:' + aid; (c.w.fx0 = c.w.fx0 || {})[key] = 0; fxApply(c, key, fxMatch(c, key, inc), 0, inc, { by: me.name, at, role: S.role, decl: 1 }); }
  if (c.w.sysAt) c.w.sysAt = tick(1);
  later(SOON.otp, () => coConsent(c, aid, k));
  return a;
}
/* a few seconds later the co-applicant approves the SMS; the credit report comes with it */
function coConsent(c, aid, k) {
  const a = coLive(c, aid, k); if (!a || a.coSt !== 'sent') return;
  a.coSt = 'consent'; a.consentAt = tick(1);
  log(c, who('cus', a.name, 'Co-applicant'), 'comms', 'Consent given by OTP', 'Credit report and bank data. Privacy notice version 3.2.', { at: a.consentAt });
  const nth = c.apps.filter(x => x.coAt).indexOf(a), score = [774, 752, 768, 781][nth % 4];
  Object.assign(a, { cibil: score, accts: a.coEmp === 'sal' ? 2 : 1, enq6: 1, dpd: Z24 });
  let ob = null;
  if (a.coEmp === 'sal') { let i = c.oblig.length + 1; while (c.oblig.some(o => o.id === 'o' + i)) i++; ob = { id: 'o' + i, who: aid, t: 'Two-wheeler loan, ' + fnA(a), lender: 'An NBFC', emi: 2400, out: 31000, left: 14, count: true, why: '' }; c.oblig.push(ob); }
  log(c, who('sys', 'System', 'Credit bureau'), 'data', 'Credit report pulled for ' + fnA(a), 'CIBIL ' + score + '. ' + plural(a.accts, 'account') + ', no late payments in 24 months.' + (ob ? ' A two-wheeler loan of ' + inr(ob.emi) + ' a month counts in FOIR.' : ''));
  render(); toast(fnA(a) + ' gave consent. Credit report: CIBIL ' + score);
  later(SOON.reply, () => coUpload(c, aid, k));
}
/* then uploads the documents through their own link */
function coUpload(c, aid, k) {
  const a = coLive(c, aid, k); if (!a) return;
  const m = c.docs.filter(d => d.who === aid && !d.up && ['login', 'opt'].includes(d.need)); if (!m.length) return;
  const at = tick(2); m.forEach(d => { d.up = { f: d.sample, at, by: a.name }; });
  log(c, who('cus', a.name, 'Co-applicant'), 'doc', 'Uploaded ' + plural(m.length, 'document') + ' from ' + pron(a) + ' own link', listAnd(m.map(d => lc1(d.t.replace(', ' + fnA(a), '')))) + '.', { at });
  const start = !loginMissing(c).length && c.tasks.some(t => t.st === 'todo');
  afterDocs(c);
  const F = (c.w.fx || {})['inc:' + aid];
  render();
  toast(fnA(a) + '’s documents are in' + (F ? F.st === 'match' ? '. ' + cap1(pron(a)) + ' pay matches ' + F.doc : F.st === 'within' ? '. The declared pay is within what they show' : F.st === 'none' ? '. None shows the declared pay: sanction condition added' : '' : '') + (start ? '. The checks have started' : ''));
}
/* whoever uploads them, the documents fill in the details and settle the declared income */
function coSync(c) {
  c.apps.forEach(a => {
    if (!a.coAt) return;
    const up = p => { const d = c.docs.find(x => x.id === p + '_' + a.id); return !!(d && d.up); };
    if (!a.kycAt && up('pan') && up('adh')) {
      a.kycAt = tick(1); a.pan = coPan(a); a.aadhaar = 'XXXX XXXX ' + a.coMob.slice(-4); a.age = a.age || 33; a.ckyc = 'Found and downloaded';
      log(c, who('sys', 'System', 'KYC and dedupe'), 'data', 'KYC checked for ' + fnA(a), 'PAN verified with the Income Tax database. Aadhaar e-KYC done, stored masked. CKYC: found and downloaded. No match in the dedupe.');
    }
    if (a.earning && !a.workAt && (up('sal') || up('itr'))) { a.workAt = 1; Object.assign(a, COPROF[a.coEmp] || {}); }
  });
  fxRecheck(c);
  c.apps.forEach(a => {
    if (!a.coAt || !a.earning) return; const F = (c.w.fx || {})['inc:' + a.id]; if (!F) return;
    a.incSrc = F.st === 'match' || F.st === 'within' ? (a.coEmp === 'sal' ? 'Salary slips and Form 16' : 'ITR with computation') : F.st === 'none' ? 'Declared at login. No document shows it' : 'Declared at login by ' + a.coBy;
  });
}
const _afterDocs12 = afterDocs, _cusOrder12 = cusOrder;
afterDocs = function (c) { coSync(c); return _afterDocs12(c); };
cusOrder = function (c) { coSync(c); return _cusOrder12(c); };
/* removed before the checks: the documents and the declared income go with them */
function coRemove(c, aid) {
  const a = c.apps.find(x => x.id === aid); if (!a || !a.coAt) return null;
  c.apps = c.apps.filter(x => x.id !== aid);
  if (c.prop && c.prop.owners) c.prop.owners = c.prop.owners.filter(x => x !== aid);
  const obs = c.oblig.filter(o => o.who === aid).map(o => o.id); c.oblig = c.oblig.filter(o => o.who !== aid);
  ['inc:' + aid].concat(obs.map(id => 'ob:' + id)).forEach(key => { fxClear(c, key); ['fx', 'fx0', 'edited'].forEach(w => { if (c.w[w]) delete c.w[w][key]; }); });
  c.docs = c.docs.filter(d => d.who !== aid);
  if (c.w.fxT && !Object.values(c.w.fx || {}).some(x => x.cond && x.raise)) { c.w.touched = false; c.w.fxT = 0; }
  if (S.edit && S.edit.indexOf(aid) >= 0) S.edit = null;
  log(c, meW(), 'data', 'Co-applicant removed: ' + a.name, 'Removed before the checks. Their documents and declared income no longer count.');
  afterDocs(c);
  return a;
}
Object.assign(ACT, {
  coadd() { const c = C(); if (!c) return; S.co = coNew(c); S.coDel = null; S.sheet = { k: 'coapp' }; render(); const el = document.querySelector('[data-co="first"]'); if (el) el.focus(); },
  coemp(v) { if (!S.co) return; S.co.emp = v; S.co.bad = S.co.bad.filter(x => x !== 'inc'); render(); },
  cogo() {
    const c = C(), X = S.co; if (!c || !X) return;
    const mob = X.mob.replace(/\D/g, ''), bad = [];
    if (!X.first.trim()) bad.push('first'); if (mob.length !== 10) bad.push('mob'); if (X.emp !== 'no' && !(nlNum(X.inc) > 0)) bad.push('inc');
    if (bad.length) { X.bad = bad; render(); toast(bad[0] === 'first' ? 'Add the first name' : bad[0] === 'mob' ? 'Add a 10-digit mobile number' : 'Add the monthly pay, as declared'); const el = document.querySelector('[data-co="' + bad[0] + '"]'); if (el) el.focus(); return; }
    const a = coAdd(c, X); S.co = null; S.sheet = null; render(); toast('Added ' + a.name + '. Consent SMS and upload link sent to ' + fnA(a));
  },
  codel(v) { const c = C(); if (!c) return; if (S.coDel !== v) { S.coDel = v; render(); return; } S.coDel = null; const a = coRemove(c, v); render(); if (a) toast('Removed ' + a.name + ' from the file'); },
  cokeep() { S.coDel = null; render(); }
});
const _shclose12 = ACT.shclose, _reset12 = ACT.resetall;
Object.assign(ACT, {
  shclose() { if (S.sheet && S.sheet.k === 'coapp') S.co = null; _shclose12(); },
  resetall() { S.co = null; S.coDel = null; _reset12(); }
});

/* ---------------- the login screen: documents on the left, applicants on the right ---------------- */
loginDocsHTML = function () {
  const c = C(), need = c.docs.filter(d => d.need === 'login'), main = need.filter(d => !d.who), n = need.filter(d => d.up).length, can = ['sales', 'cm'].includes(S.role);
  const pre = c.docs.filter(d => d.need === 'pre' && d.up), cats = [...new Set(main.map(d => d.cat))], open = c.tasks.filter(t => t.kind !== 'sys' && t.st === 'todo');
  const left = need.length - n, cos = c.apps.filter(a => c.docs.some(d => d.who === a.id)), links = ['the customer'].concat(cos.map(fnA));
  const lead = left ? plural(left, 'document') + ' still to come. ' + cap1(listAnd(links)) + (links.length > 1 ? ' have upload links' : ' has an upload link') + (can ? '; you can upload them here too.' : '.') : 'Everything needed to start the checks is in.';
  const coSec = cos.map(a => { const it = c.docs.filter(d => d.who === a.id && ['login', 'opt'].includes(d.need)), req = it.filter(d => d.need === 'login'); return `<section class="dcat co"><header><b>${esc(a.name)}, co-applicant</b><span>${req.filter(d => d.up).length} of ${req.length}</span></header>${it.map(d => docRow2(c, d, !can, 'Link sent to ' + fnA(a))).join('')}</section>`; }).join('');
  return `<div class="lg-badge"><span class="rec-b">${ic('check')}Logged in as ${esc(c.v.appNo)}</span></div>
  <div class="up-h"><div><h2>Documents due</h2><p>${esc(lead)}</p></div>${can && left ? `<div class="up-act"><button class="btn btn-s btn-sm" data-act="loadlogin">${ic('upload')}Upload documents</button></div>` : ''}</div>
  <div class="up-bar"><i style="width:${need.length ? n / need.length * 100 : 0}%"></i></div>
  <div class="cats" style="margin-top:12px">${cats.map(cat => { const it = main.filter(d => d.cat === cat); return `<section class="dcat"><header><b>${cat}</b><span>${it.filter(d => d.up).length} of ${it.length}</span></header>${it.map(d => docRow2(c, d, !can, 'Link sent to the customer')).join('')}</section>`; }).join('')}${coSec}</div>
  ${open.length ? `<section class="panel" style="margin-top:14px"><div class="ph"><h3>Ordered the moment they are in</h3><span class="note">The system assigns these to the panel vendors</span></div><div class="pb">${open.map(t => `<div class="cgi">${ic('clock')}<div><b>${esc(t.t)}</b><small>${esc(t.vendor)}, ${plural(t.slaD, 'working day')}</small></div><span class="when">After the documents</span></div>`).join('')}</div></section>` : ''}
  ${pre.length ? `<section class="panel" style="margin-top:14px"><div class="ph"><h3>Already in</h3><span class="note">${plural(pre.length, 'document')} from the pre-screen</span><button class="lnk act" data-act="tab" data-v="docs">All documents</button></div><div class="pb"><ul class="lg-in">${pre.map(d => `<li>${ic('check')}<span>${esc(d.t)}</span><small>${esc(fds(d.up.at))}</small></li>`).join('')}</ul></div></section>` : ''}`;
};
function coPanelHTML(c) {
  const can = ['sales', 'cm'].includes(S.role) && canEdit(c), cfg = coCfg(), nCo = c.apps.length - 1, room = cfg.on && nCo < cfg.max;
  const step = (cls, l, t, spin) => `<span class="co-s ${cls}">${spin ? '<span class="spin"></span>' : ic(cls === 'ok' ? 'check' : 'clock')}<b>${l}</b><span>${esc(t)}</span></span>`;
  const row = (a, i) => {
    let st = '';
    if (a.coAt) {
      const D = coDocs(c, a), dIn = D.filter(d => d.up).length;
      st = `<div class="co-st">${step(a.coSt === 'sent' ? 'run' : 'ok', 'Consent', a.coSt === 'sent' ? 'SMS sent, waiting for ' + pron(a) + ' OTP' : 'Given by OTP, ' + ftime(a.consentAt), a.coSt === 'sent')}${step(a.cibil ? 'ok' : 'wait', 'Credit report', a.cibil ? 'CIBIL ' + a.cibil : 'After consent')}${step(dIn === D.length ? 'ok' : 'wait', 'Documents', dIn === D.length ? 'All ' + D.length + ' in' : dIn + ' of ' + D.length + ', through ' + pron(a) + ' link')}</div>`;
    }
    const sub = i === 0 ? 'Applicant' + (a.cibil ? '. CIBIL ' + a.cibil : '') : 'Co-applicant, ' + lc1(a.rel) + '. ' + (a.earning ? a.emp + ', ' + inr(a.inc) + ' a month' + (a.coAt && a.incSrc.indexOf('Declared') === 0 ? ' as declared' : '') : 'Not earning') + (!a.coAt && a.cibil ? '. CIBIL ' + a.cibil : '');
    const del = a.coAt && can ? (S.coDel === a.id ? `<span class="co-del"><button class="btn btn-s btn-sm co-rm" data-act="codel" data-v="${a.id}">${ic('trash')}Remove ${esc(fnA(a))}</button><button class="lnk" data-act="cokeep">Keep</button></span>` : `<button class="lnk co-x" data-act="codel" data-v="${a.id}" aria-label="Remove ${esc(a.name)}">Remove</button>`) : '';
    return `<div class="co-r${a.coAt ? ' new' : ''}"><span class="av2">${esc(a.ini)}</span><div class="co-b"><b>${esc(a.name)}</b><small>${esc(sub)}</small>${st}</div>${del}</div>`;
  };
  const add = c.apps.some(a => a.coAt), f = E && E.f, m = E && E.m;
  const sum = add && f && f.incKnown && m && m.foir != null ? `<p class="co-sum">${ic('zap')}<span>Income counted for the loan: <b>${esc(inr(f.incElig))} a month</b>. FOIR ${esc(pctf(m.foir))}, against a ${esc(String(m.foirCap))}% cap.</span></p>` : '';
  return `<section class="panel co-p"><div class="ph"><h3>Applicants</h3><span class="note">${plural(c.apps.length, 'person', 'people')} on the loan</span>${can && room ? `<button class="btn btn-s btn-sm act" data-act="coadd">${ic('userplus')}Add a co-applicant</button>` : ''}</div><div class="pb">${c.apps.map(row).join('')}${sum}${can && cfg.on && !room ? `<p class="co-n">Up to ${esc(plural(cfg.max, 'co-applicant'))} on a file.</p>` : ''}</div></section>`;
}
const _ovLeft12 = ovLeft;
ovLeft = function () {
  const h = _ovLeft12(), c = C();
  return E && E.st.k === 'docs' && !(c.lead && !c.lead.in) ? h.replace('<div class="stack ovl">', '<div class="stack ovl">' + coPanelHTML(c)) : h;
};
/* a declared income shows as declared until a document shows it */
const _editRow12 = editRow;
editRow = function (c, key, label, val, src, hint, input) {
  if (fxIs(key, 'inc:') && src !== 'edit') { const a = c.apps.find(x => x.id === key.slice(4)), F = (c.w.fx || {})[key]; if (a && a.coAt) src = F && (F.st === 'match' || F.st === 'within') ? 'ver' : 'dec'; }
  return _editRow12(c, key, label, val, src, hint, input);
};

/* ---------------- the main applicant's page: the co-applicant uses their own link ---------------- */
const _cusHTML12 = cusHTML;
cusHTML = function () {
  const c = cusCase(); if (!c || !cusSigned(c.id) || !c.docs.some(d => d.who)) return _cusHTML12();
  const all = c.docs, lm = loginMissing, mine = all.filter(d => !d.who), coPend = all.filter(d => d.who && d.need === 'login' && !d.up);
  let h;
  loginMissing = x => x === c ? all.filter(d => d.need === 'login' && !d.up) : lm(x); c.docs = mine;
  try { h = _cusHTML12(); } finally { c.docs = all; loginMissing = lm; }
  const own = mine.filter(d => d.need === 'login' && !d.up).length, cos = c.apps.filter(a => coPend.some(d => d.who === a.id));
  if (cos.length) {
    const names = listAnd(cos.map(fnA)), line = (cos.length === 1 ? fnA(cos[0]) + ' is sending ' + pron(cos[0]) : names + ' are sending their') + ' ' + plural(coPend.length, 'document') + ' through ' + (cos.length === 1 ? pron(cos[0]) + ' own link' : 'their own links');
    h = h.replace(/Upload the \d+ documents? below\. As soon as they are in, we start the property and legal checks\./, esc((own ? 'Upload the ' + plural(own, 'document') + ' below. ' : '') + line + '. As soon as they are in, we start the property and legal checks.'));
    if (!own) h = h.replace('<h1>We need a few more documents</h1>', '<h1>' + esc('We are waiting for ' + names + '’s documents') + '</h1>');
    h = h.replace('<details class="cus-got">', `<p class="cus-co">${ic('clock')}<span>${esc(line)}.</span></p><details class="cus-got">`);
  }
  const need = all.filter(d => d.need === 'login'), nIn = need.filter(d => d.up).length;
  return h.replace(/<b>Documents<\/b><small>[^<]*<\/small>/, `<b>Documents</b><small>${nIn < need.length ? nIn + ' of ' + need.length + ' in' : 'All in'}</small>`);
};
function coLeftMsg(c) {
  const own = c.docs.filter(d => d.need === 'login' && !d.up && !d.who).length, co = c.docs.filter(d => d.who && d.need === 'login' && !d.up);
  const names = listAnd([...new Set(co.map(d => fnA(c.apps.find(a => a.id === d.who))))]);
  return own ? 'Uploaded. ' + plural(own, 'document') + ' to go' : co.length ? 'Uploaded. Thank you. We are waiting for ' + names + '’s documents' : 'Uploaded. Thank you';
}
const _cup12 = ACT.cup, _call12 = ACT.call;
Object.assign(ACT, {
  cup(v) {
    const c = cusCase(); if (!c || !c.docs.some(d => d.who)) return _cup12(v);
    const d = c.docs.find(x => x.id === v); if (!d || d.up || d.who || S.creading) return;
    S.creading = v; render();
    setTimeout(() => { d.up = { f: d.sample, at: tick(1), by: c.apps[0].name }; S.creading = null; log(c, who('cus', c.apps[0].name, 'Customer'), 'doc', 'Uploaded ' + lc1(d.t) + ' from the customer’s page', d.sample); const o = cusOrder(c); render(); toast(o ? 'Thank you. We have everything we need and have started the checks' : coLeftMsg(c)); }, 800);
  },
  call() {
    const c = cusCase(); if (!c || !c.docs.some(d => d.who)) return _call12();
    const m = c.docs.filter(d => d.need === 'login' && !d.up && !d.who); if (!m.length) return;
    m.forEach(d => { d.up = { f: d.sample, at: tick(1), by: c.apps[0].name }; });
    log(c, who('cus', c.apps[0].name, 'Customer'), 'doc', 'Uploaded ' + plural(m.length, 'document') + ' from the customer’s page', listAnd(m.map(d => lc1(d.t))) + '.');
    const o = cusOrder(c); render(); toast(o ? 'Thank you. We have everything we need and have started the checks' : coLeftMsg(c));
  }
});

/* until a co-applicant gives consent, their credit report is awaited, not missing */
const _fullEval12 = fullEval;
fullEval = function (c, pol) {
  const ev = _fullEval12(c, pol); if (!c || !c.apps || !ev || !ev.R) return ev;
  const wait = c.apps.filter(a => a.coAt && a.coSt === 'sent'), r = ev.R.find(x => x.id === 'r_ntc');
  if (wait.length && r && r.st === 'fail' && !(ev.f && ev.f.ntcPrimary) && c.apps.slice(1).filter(a => a.earning && !a.cibil).every(a => wait.includes(a)))
    Object.assign(r, { st: 'needs', kind: null, lvl: null, v: 'Waiting for ' + listAnd(wait.map(fnA)) + '’s credit report', lim: 'Pulled when they give consent' });
  return ev;
};

/* ---------------- start-up: always the last file ---------------- */
initAdmin(); initCases(); applyTheme();


/* ---------------- events: bound once, when the app mounts ---------------- */
export function bindEvents() {
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = ACT[el.dataset.act]; if (!fn) return;
    if (el.tagName === 'BUTTON') ev.preventDefault();
    fn(el.dataset.v, el);
  });
  document.addEventListener('input', ev => {
    const t = ev.target;
    if (t.id === 'bq') { S.bq = t.value; S.focusId = 'bq'; render(); }
    else if (t.id === 'rq') { S.rq = t.value; S.focusId = 'rq'; render(); }
    else if (t.id === 'reqNote') S.form.note = t.value;
    else if (t.id === 'apLoan' || t.id === 'apTen') { const p = $('#apPrev'); if (p) p.innerHTML = apPrevHTML(C(), Math.round((+$('#apLoan').value || 0) / 1000) * 1000, Math.round(+$('#apTen').value || 0) * 12); }
  });
  document.addEventListener('change', ev => {
    const t = ev.target;
    if (t.id === 'lvlSel') { S.lvl = t.value; S.form = {}; render(); }
    else if (t.dataset.g) { if (S.role !== 'pol' || S.ppend) return; const v = parseFloat(t.value); if (isNaN(v)) { render(); return; } if (!S.pdraft) S.pdraft = deep(POL); setP(S.pdraft, t.dataset.g, v); S.psim = null; S.pmsg = null; render(); }
    else if (t.dataset.l) { if (S.role !== 'pol') return; const k = t.dataset.l; LENDER[k] = t.type === 'number' ? (parseFloat(t.value) || 0) : t.value; if (k === 'name') LENDER.short = t.value.replace(/\s+Ltd\.?$/i, ''); render(); toast('Lender setting updated'); }
  });
  document.addEventListener('keydown', ev => {
    const t = ev.target;
    if (t.id === 'fin') { if (ev.key === 'Enter') { ev.preventDefault(); ACT.fsave(); } else if (ev.key === 'Escape') ACT.fcancel(); }
    else if (t.id === 'vsplit' && (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight')) { S.lw = clamp(S.lw + (ev.key === 'ArrowLeft' ? -2 : 2), 28, 64); t.parentElement.style.setProperty('--lw', S.lw + '%'); }
    else if (ev.key === 'Escape' && S.sheet) { S.sheet = null; render(); }
  });
  document.addEventListener('pointerdown', ev => {
    const sp = ev.target.closest('#vsplit'); if (!sp) return;
    ev.preventDefault(); const work = sp.parentElement, r = work.getBoundingClientRect(); sp.classList.add('dragging'); document.body.classList.add('resizing');
    const mv = e => { S.lw = clamp((e.clientX - r.left) / r.width * 100, 28, 64); work.style.setProperty('--lw', S.lw + '%'); };
    const up = () => { sp.classList.remove('dragging'); document.body.classList.remove('resizing'); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  });
  document.addEventListener('input', ev => { if (ev.target.id === 'bq') S.pg = 0; }, true);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && S.menu) { S.menu = false; render(); const b = $('#whoBtn'); if (b) b.focus(); } });
  document.addEventListener('change', ev => {
    const el = ev.target; if (!el || !el.dataset || S.view !== 'admin' || !ADM) return;
    if (el.dataset.fe) { const k = el.dataset.fe.split('|')[0]; if (k === 'sn' || k === 'gsn') feditNum(el.dataset.fe, el); else fedit(el.dataset.fe, el); return; }
    if (el.dataset.pv) { const r = PRULES.find(x => x.id === el.dataset.pv); if (!r) return; let v; if (r.u === 'bool') v = el.checked; else { if (el.value === '') return; v = +el.value; if (r.u === 'lakh') v = Math.round(v * 1e5); } polSet(r, v); return; }
    if (el.dataset.pg) { const p = el.dataset.pg, v = +el.value; if (el.value === '' || isNaN(v)) return; if (ONB()) { const was = getP(ADM.onb.pol, p); if (was === v) return; setP(ADM.onb.pol, p, v); alog2({ area: 'pol', what: pathLabel(p), b: was + '%', a: v + '%', why: 'Edited in the new setup' }); } else ADM.pe[p] = v; render(); return; }
    if (el.dataset.api) { const [f, id] = el.dataset.api.split('|'), L = apiList(), a = L.find(x => x.id === id), v = f === 'on' ? (el.checked ? 1 : 0) : el.value;
      if (ONB()) { const was = a[f]; a[f] = v; if (f === 'pri' && a.bak === v) a.bak = was; alog2({ area: 'api', what: a.n + (f === 'on' ? '' : f === 'pri' ? ': first choice' : ': if it fails, use'), b: f === 'on' ? (was ? 'In use' : 'Not in use') : APIV[was] || 'None', a: f === 'on' ? (v ? 'In use' : 'Not in use') : APIV[v] || 'None', why: 'Edited in the new setup' }); }
      else { const was = a[f]; ADM.ae[id] = Object.assign({ on: a.on, pri: a.pri, bak: a.bak }, ADM.ae[id] || {}, { [f]: v }); if (f === 'pri' && ADM.ae[id].bak === v) ADM.ae[id].bak = was; }
      render(); return; }
    if (el.dataset.ik != null) { ADM.ik.props[+el.dataset.ik].on = el.checked ? 1 : 0; render(); }
  });
  document.addEventListener('input', ev => {
    const el = ev.target; if (!el || !ADM) return;
    if (el.id === 'ocap') { ADM.onb.txt = el.value; const n = capAtt().length + (el.value.trim() && el.value.trim() !== NOTE4TXT ? 1 : 0), g = $('#ocapGo'), c = $('#ocapN'); if (g) g.disabled = !n; if (c) c.textContent = plural(n, 'source') + ' added'; }
    if (el.id === 'iktxt') { ADM.ik.txt = el.value; const g = $('#ikGo'); if (g) g.disabled = !el.value.trim(); }
    if (el.id === 'admWhy') { ADM.why = el.value; if (el.value.trim()) { ADM.needWhy = 0; el.classList.remove('bad'); } }
    if (el.id === 'prs') { ADM.ps = el.value; S.focusId = 'prs'; render(); }
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target && ev.target.matches && ev.target.matches('textarea[data-fe^="n|"]')) { ev.preventDefault(); ev.target.blur(); } });
  document.addEventListener('input', ev => { if (ev.target && ev.target.id === 'cq') S.cq = ev.target.value; });
  document.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target && ev.target.id === 'cq') { ev.preventDefault(); ACT.csend(); } });
  document.addEventListener('input', ev => {
    const el = ev.target; if (!el || !el.dataset || !el.dataset.nl || !S.nl) return;
    const k = el.dataset.nl, cur = S.nl.f[k];
    S.nl.f[k] = { v: el.value, src: cur && cur.src && cur.src !== 'typed' && el.value === cur.v ? cur.src : 'typed', conf: cur ? cur.conf : null };
    if (el.value.trim()) { el.closest('label').classList.remove('bad'); }
  });
  document.addEventListener('input', ev => {
    const el = ev.target; if (!el || !el.dataset) return;
    if (el.dataset.qt) { S.qd = S.qd || {}; S.qd[el.dataset.qt] = Object.assign(S.qd[el.dataset.qt] || {}, { t: el.value }); const b = $('#qs-' + el.dataset.qt); if (b) b.disabled = !el.value.trim(); }
    if (el.dataset.te && S.te) { S.te[el.dataset.te] = el.value; S.focusId = el.id; render(); }
    if (el.dataset.tw && S.te) { S.te[el.dataset.tw] = el.value; if (el.dataset.tw === 'why' && el.value.trim()) { S.teBad = 0; el.classList.remove('bad'); } }
  });
  document.addEventListener('input', ev => {
    const el = ev.target; if (!el || !el.classList) return;
    if (el.dataset && el.dataset.qt) { const Q = QDEF[el.dataset.qt], d = (S.qd || {})[el.dataset.qt] || {}, b = $('#qs-' + el.dataset.qt); if (b && Q) b.disabled = d.o === Q.opts.length - 1 && !el.value.trim(); }
    if (!el.classList.contains('otp-b')) return;
    const g = el.closest('.otp6').dataset.g, digits = el.value.replace(/\D/g, '');
    if (digits.length > 1) { const bx = [...document.querySelectorAll('.otp6[data-g="' + g + '"] .otp-b')]; digits.split('').slice(0, 6).forEach((d, i) => { if (bx[i]) bx[i].value = d; }); otpSync(g); (bx[Math.min(digits.length, 6) - 1] || el).focus(); return; }
    el.value = digits; const bx = otpSync(g), i = bx.indexOf(el);
    if (digits && bx[i + 1]) bx[i + 1].focus();
  });
  document.addEventListener('keydown', ev => {
    const el = ev.target; if (!el || !el.classList || !el.classList.contains('otp-b')) return;
    const g = el.closest('.otp6').dataset.g, bx = [...document.querySelectorAll('.otp6[data-g="' + g + '"] .otp-b')], i = bx.indexOf(el);
    if (ev.key === 'Backspace' && !el.value && bx[i - 1]) { ev.preventDefault(); bx[i - 1].value = ''; bx[i - 1].focus(); otpSync(g); }
    if (ev.key === 'Enter') { ev.preventDefault(); const go = $('#otpGo-' + g); if (go && !go.disabled) go.click(); }
  });
  document.addEventListener('input', ev => { const t = ev.target; if (t && t.id === 'lq') { S.lq = t.value; S.focusId = 'lq'; render(); } });
  document.addEventListener('change', ev => { const t = ev.target; if (t && t.dataset && t.dataset.nl === 'atype' && S.nl) { S.nl.f.atype = { v: t.value, src: 'typed' }; render(); } });
}

const docxBridge = {
  describe(caseId) {
    const c = CASES.find(x => x.id === caseId); if (!c) return null;
    return {
      applicants: c.apps.map(a => ({ id: a.id, name: a.name, role: a.role, sample: { pan: a.pan, last4: String(a.aadhaar || '').slice(-4), address: a.addr, age: a.age, employer: a.org, netPay: a.inc } })),
      docs: c.docs.filter(d => d.need === 'pre').map(d => ({ id: d.id, t: d.t, need: d.need })),
      readOnly: !['sales', 'cm'].includes(S.role) || !!(c.lead && c.lead.pre)
    };
  },
  sync(caseId, p) {
    const c = CASES.find(x => x.id === caseId); if (!c) return;
    let changed = false;
    (p.extraDocs || []).forEach(x => { if (!c.docs.some(d => d.id === x.id)) { c.docs.push(dk(x.id, x.label, DCAT[0], 'login', 'Supporting_document.pdf')); changed = true; } });
    c.docs = c.docs.filter(d => !/^sup_/.test(d.id) || (p.extraDocs || []).some(x => x.id === d.id));
    Object.entries(p.slots).forEach(([id, s]) => {
      const d = c.docs.find(x => x.id === id); if (!d) return;
      const done = s.state === 'done', later = s.state === 'later';
      if (done && !d.up) { d.up = { f: s.files.join(', ') || d.sample, at: tick(1), by: meWho().name }; changed = true; }
      else if (!done && d.up && s.state !== 'reading') { d.up = null; changed = true; }
      else if (done && d.up && s.files.length && d.up.f !== s.files.join(', ')) { d.up.f = s.files.join(', '); }
      if (!!d.later !== later) { d.later = later; changed = true; }
    });
    const sig = JSON.stringify(Object.values(p.fields).map(f => [f.applicantId, f.key, f.value, f.status, f.source && f.source.label || f.source]));
    if (c.extSig !== sig) { c.ext = { fields: p.fields }; c.extSig = sig; changed = true; }
    if (changed) { render(); afterDocs(c); }
  },
  log(caseId, txt, det) { const c = CASES.find(x => x.id === caseId); if (c) { log(c, meW(), 'doc', txt, det); render(); } },
  user() { return meWho().name; }
};
setBridge(docxBridge);
export function start(painter) { paint = painter; render(); }
