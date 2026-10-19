/**
 * "Bengaluru Reality" engines used across the site.
 *  - floodCheck: REAL public data (BBMP / KSRSAC flood-vulnerable, flood-prone and low-lying points, via OpenCity, public domain).
 *  - water / power & internet, deposit norms, commute speed profiles: SAMPLE / ESTIMATED values for the prototype, clearly labelled in the UI.
 */
import FLOOD from '@/data/flood-points.json';
import { distanceKm, emi } from '@/lib/format';
import type { Listing } from '@/data/listings';

export type FloodType = 'v' | 'f' | 'l';
export interface FloodPoint { lat: number; lng: number; type: FloodType; name: string; ward: string }
export const FLOOD_SOURCE = FLOOD.source as string;
export const FLOOD_TYPES = FLOOD.types as Record<FloodType, string>;
export const FLOOD_POINTS: FloodPoint[] = (FLOOD.points as [number, number, FloodType, string, string][]).map(([lat, lng, type, name, ward]) => ({ lat, lng, type, name, ward }));

const cap = (n: number, lo = 1, hi = 10) => Math.max(lo, Math.min(hi, n));
const titleCase = (s: string) => s.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase());

export interface FloodResult {
  score: number; // 1–10, higher = safer
  label: 'Low' | 'Moderate' | 'High' | 'Very high' | 'Limited data';
  within500: number; within1k: number; within2k: number;
  nearest?: FloodPoint & { km: number };
  spots: (FloodPoint & { km: number })[]; // within 2 km, nearest first
  limitedData: boolean;
}

/** Counts BBMP-listed flood spots around a coordinate. Weighted: <0.5 km heavy, 0.5–1 km medium, 1–2 km light. */
export function floodCheck(coord: [number, number]): FloodResult {
  const all = FLOOD_POINTS.map((p) => ({ ...p, km: distanceKm(coord, [p.lat, p.lng]) })).sort((a, b) => a.km - b.km);
  const spots = all.filter((p) => p.km <= 2).map((p) => ({ ...p, name: titleCase(p.name || 'Unnamed spot') }));
  const within500 = spots.filter((p) => p.km <= 0.5).length;
  const within1k = spots.filter((p) => p.km <= 1).length;
  const within2k = spots.length;
  const penalty = within500 * 1.6 + (within1k - within500) * 0.8 + (within2k - within1k) * 0.25;
  const score = Math.round(cap(10 - penalty) * 10) / 10;
  // Points cover the BBMP area; far from any point usually means "outside BBMP coverage", not "no risk".
  const limitedData = !all.length || all[0].km > 2.5;
  const label: FloodResult['label'] = limitedData ? 'Limited data' : score >= 8 ? 'Low' : score >= 6 ? 'Moderate' : score >= 4 ? 'High' : 'Very high';
  return { score: limitedData ? 6 : score, label, within500, within1k, within2k, nearest: all[0] && { ...all[0], name: titleCase(all[0].name || 'Unnamed spot') }, spots: spots.slice(0, 6), limitedData };
}

/* ---------------- Water reality (sample, resident-reported in the product) ---------------- */
export interface WaterResult { cauvery: boolean; borewell: boolean; tankerTripsSummer: number; tankerCostPerTrip: number; summerCostPerMonth: number; yearCostPerMonth: number; label: string; reports: number }
export function waterReality(l: Pick<Listing, 'risk' | 'tankerPerMonth' | 'amenities' | 'hue'>): WaterResult {
  const cauvery = l.risk.water >= 6 || l.amenities.includes('Borewell + Cauvery');
  const borewell = l.amenities.includes('Borewell + Cauvery') || l.risk.water < 7;
  const trips = l.tankerPerMonth;
  const perTrip = 600 + (l.hue % 5) * 100; // ₹600–1,000 per ~6,000 L load (sample; Mar 2024 district caps were ₹600 ≤5 km / ₹750 5–10 km)
  const summer = trips * perTrip;
  const year = Math.round((summer * 4) / 12 / 50) * 50; // ~4 dry months a year
  const label = trips === 0 ? 'No tankers reported' : trips <= 3 ? 'Occasional summer tankers' : trips <= 7 ? 'Regular summer tankers' : 'Heavy tanker dependency';
  return { cauvery, borewell, tankerTripsSummer: trips, tankerCostPerTrip: perTrip, summerCostPerMonth: summer, yearCostPerMonth: year, label, reports: 4 + (l.hue % 9) };
}

/* ---------------- Power & internet reality (sample) ---------------- */
export interface PowerNetResult { outageHrsPerMonth: number; backup: 'Full DG backup' | 'Partial DG (lights, fans, lift)' | 'Inverter only'; backupCostPerMonth: number; fibreProviders: number; typicalSpeed: string; wfhReady: boolean; reports: number }
export function powerNet(l: Pick<Listing, 'risk' | 'amenities' | 'kind' | 'hue'>): PowerNetResult {
  const outage = Math.round((11 - l.risk.power) * 2.2 + (l.hue % 4));
  const hasBackup = l.amenities.includes('Power backup');
  const backup = hasBackup ? (l.kind === 'builder' ? 'Full DG backup' : 'Partial DG (lights, fans, lift)') : 'Inverter only';
  const backupCost = backup === 'Full DG backup' ? 900 : backup === 'Partial DG (lights, fans, lift)' ? 450 : 250;
  const fibre = 1 + ((l.hue >> 2) % 4);
  const speed = fibre >= 3 ? '300 Mbps–1 Gbps plans' : fibre === 2 ? '100–300 Mbps plans' : 'Up to 100 Mbps';
  return { outageHrsPerMonth: outage, backup, backupCostPerMonth: backupCost, fibreProviders: fibre, typicalSpeed: speed, wfhReady: fibre >= 2 && outage <= 12, reports: 3 + (l.hue % 7) };
}

/* ---------------- Peak-hour commute (model estimate; production = routing API with traffic) ---------------- */
export const COMMUTE_SLOTS = [
  { k: 'am', label: '9:00 AM', speed: 15 },
  { k: 'pm', label: '6:00 PM', speed: 13 },
  { k: 'off', label: '11:00 AM', speed: 24 },
  { k: 'night', label: '10:00 PM', speed: 32 },
] as const;
// Known peak bottleneck corridors add delay (sample multipliers).
const HOTSPOTS: { c: [number, number]; r: number; f: number; name: string }[] = [
  { c: [12.9172, 77.6229], r: 2.5, f: 1.25, name: 'Silk Board' },
  { c: [12.9347, 77.6905], r: 3.5, f: 1.2, name: 'ORR (Marathahalli–Sarjapur)' },
  { c: [13.0358, 77.597], r: 2.5, f: 1.15, name: 'Hebbal flyover' },
  { c: [12.9698, 77.7], r: 3, f: 1.15, name: 'Whitefield / KR Puram' },
];
export function peakCommute(from: [number, number], to: [number, number]) {
  const km = distanceKm(from, to) * 1.35;
  const hits = HOTSPOTS.filter((h) => distanceKm(from, h.c) < h.r || distanceKm(to, h.c) < h.r || distanceKm([(from[0] + to[0]) / 2, (from[1] + to[1]) / 2], h.c) < h.r);
  const factor = hits.reduce((a, h) => a * h.f, 1);
  const slots = COMMUTE_SLOTS.map((s) => {
    const peak = s.k === 'am' || s.k === 'pm';
    const mins = Math.round((km / s.speed) * 60 * (peak ? factor : 1) + 4);
    return { ...s, mins };
  });
  const am = slots[0].mins, pm = slots[1].mins;
  const hoursPerMonth = Math.round(((am + pm) * 22) / 60);
  return { km, slots, bottlenecks: hits.map((h) => h.name), hoursPerMonth, bestLeave: am - slots[2].mins > 15 ? 'Leaving before 8:00 AM or after 10:30 AM saves time (estimate)' : 'Little difference by time of day' };
}

/* ---------------- Deposit fairness (sample locality norms) ---------------- */
export const DEPOSIT_NORMS: Record<string, { typical: number; low: number; high: number }> = {
  Whitefield: { typical: 5, low: 3, high: 8 }, 'Sarjapur Road': { typical: 5, low: 3, high: 8 }, 'HSR Layout': { typical: 6, low: 4, high: 10 },
  Koramangala: { typical: 6, low: 4, high: 10 }, 'Electronic City': { typical: 4, low: 2, high: 6 }, Hebbal: { typical: 5, low: 3, high: 8 },
  Indiranagar: { typical: 6, low: 4, high: 10 }, Yelahanka: { typical: 4, low: 2, high: 6 },
};
export const DEFAULT_NORM = { typical: 5, low: 3, high: 8 };
export function depositFairness(rent: number, deposit: number, locality: string) {
  const n = DEPOSIT_NORMS[locality] ?? DEFAULT_NORM;
  const months = deposit / rent;
  const verdict = months <= n.low ? 'Tenant-friendly' : months <= n.typical + 0.25 ? 'Typical for the area' : months <= n.high ? 'Above typical' : 'Very high';
  const suggest = Math.max(2, Math.min(n.typical, Math.round(months) - 1));
  return { months, norm: n, verdict, suggestMonths: suggest, savings: Math.max(0, deposit - suggest * rent) };
}
export function negotiationMessage(o: { rent: number; deposit: number; months: number; target: number; locality: string; tone: 'polite' | 'firm'; perks: string[] }) {
  const fmt = (v: number) => '₹' + Math.round(v).toLocaleString('en-IN');
  const ask = fmt(o.target * o.rent);
  const lines = [
    `Hi! Thank you for showing me the flat in ${o.locality}. I really like it and would like to go ahead at ${fmt(o.rent)}/month.`,
    o.tone === 'polite'
      ? `The deposit of ${fmt(o.deposit)} (${o.months.toFixed(1)} months) is a bit difficult for me right now. Would you consider ${o.target} months, i.e. ${ask}?`
      : `The deposit asked is ${o.months.toFixed(1)} months. Comparable homes here typically ask less, so I'd like to propose ${o.target} months (${ask}).`,
    ...o.perks.map((p) => `• ${p}`),
    'Happy to sign quickly and keep the home in great condition. Thank you!',
  ];
  return lines.join('\n');
}
export const NEGOTIATION_PERKS = [
  'I can sign an 11-month agreement and pay rent on time by the 5th, every month.',
  'I am a Verified Tenant (ID-checked), so there is less risk for you.',
  'I can pay the first month in advance and agree to a joint move-in video so deductions are clear at move-out.',
  'We can keep the deposit in a bank escrow (Deposit Safe), so it is protected for both of us.',
];

/* ---------------- True monthly cost ---------------- */
export interface CostInputs { base: number; maintenance: number; tanker: number; backup: number; electricity: number; parking: number; internet: number; commute: number }
export const costTotal = (c: CostInputs) => Object.values(c).reduce((a, b) => a + b, 0);
export function defaultCostInputs(l: Listing, commuteKmOneWay: number): CostInputs {
  const base = l.deal === 'rent' ? l.price : Math.round(emi(l.price * 0.8, 8.5, 20));
  const w = waterReality(l), p = powerNet(l);
  return {
    base,
    maintenance: l.maintenance,
    tanker: w.yearCostPerMonth,
    backup: p.backupCostPerMonth,
    electricity: Math.round((l.bhk * 900 + 600) / 50) * 50,
    parking: l.amenities.includes('Covered parking') ? 0 : 1500,
    internet: 800,
    commute: Math.round((commuteKmOneWay * 2 * 22 * 9) / 100) * 100, // cab/fuel ~₹9/km (sample)
  };
}

/* ---------------- Agreement red-flag scan (rule-based, client-side) ---------------- */
export interface AgreementFlag { level: 'high' | 'medium' | 'info'; title: string; detail: string; quote?: string }
export function scanAgreement(text: string, rent?: number): AgreementFlag[] {
  const t = text.replace(/\s+/g, ' ').replace(/\bRs\.\s*/gi, 'Rs ');
  const low = t.toLowerCase();
  const flags: AgreementFlag[] = [];
  const quote = (re: RegExp) => { const m = t.match(re); return m ? t.slice(Math.max(0, m.index! - 40), m.index! + m[0].length + 60).trim() : undefined; };
  const num = (s: string) => +s.replace(/[,₹\s]/g, '');
  // Deposit months
  const depM = low.match(/(\d{1,2})\s*(?:months?|month's)\s*(?:of\s*)?(?:rent\s*)?(?:as\s*)?(?:security\s*)?deposit|deposit[^.]{0,60}?(\d{1,2})\s*months?/);
  const depAmt = t.match(/(?:security\s*)?deposit[^.]{0,40}?(?:rs\.?|₹|inr)\s*([\d,]{4,})/i);
  const rentM = t.match(/rent[^.]{0,30}?(?:rs|₹|inr)\s*([\d,]{4,})/i);
  rent = rent ?? (rentM ? num(rentM[1]) : undefined);
  let months: number | undefined = depM ? +(depM[1] || depM[2]) : undefined;
  if (!months && depAmt && rent) months = num(depAmt[1]) / rent;
  if (months !== undefined) {
    if (months > 6) flags.push({ level: 'high', title: `Deposit of ~${Math.round(months)} months`, detail: 'Well above what many Bengaluru homes ask. Negotiate, or ask for Deposit Safe escrow so it is protected.', quote: quote(/deposit/i) });
    else if (months > 3) flags.push({ level: 'medium', title: `Deposit of ~${Math.round(months)} months`, detail: 'Common in Bengaluru, but negotiable. The central Model Tenancy Act, 2021 suggests up to 2 months where a state adopts it.', quote: quote(/deposit/i) });
  }
  if (/paint/.test(low) && /(deduct|charge|borne|bear|recover)/.test(low)) flags.push({ level: 'medium', title: 'Painting charges deducted from deposit', detail: 'Ask for a fixed, capped amount (or pro-rata by months stayed) instead of a full repaint at your cost.', quote: quote(/paint/i) });
  const lock = low.match(/lock[\s-]*in[^.]{0,40}?(\d{1,2})\s*months?/);
  if (lock && +lock[1] > 6) flags.push({ level: 'medium', title: `Lock-in of ${lock[1]} months`, detail: 'A long lock-in can make you pay rent for months you do not live there. 3–6 months is easier to live with.', quote: quote(/lock[\s-]*in/i) });
  const esc = low.match(/(\d{1,2})\s*%[^.]{0,60}?(?:increase|hike|escalat|enhance)|(?:increase|hike|escalat|enhance)[^.]{0,60}?(\d{1,2})\s*%/);
  if (esc && +(esc[1] || esc[2]) > 10) flags.push({ level: 'medium', title: `Rent increase of ${esc[1] || esc[2]}% at renewal`, detail: 'Above the common 5–10% range. Ask to cap it at renewal.', quote: quote(/%/) });
  if (!/notice/.test(low)) flags.push({ level: 'high', title: 'No notice period found', detail: 'Make sure both sides must give notice (often 1–2 months) before ending the agreement.' });
  if (/(without|no)\s+(any\s+)?(prior\s+)?notice/.test(low) && /(vacate|terminat|evict)/.test(low)) flags.push({ level: 'high', title: 'Owner can end the agreement without notice', detail: 'One-sided termination is a red flag. Ask for equal notice on both sides.', quote: quote(/without\s+(any\s+)?(prior\s+)?notice/i) });
  if (/forfeit/.test(low)) flags.push({ level: 'high', title: 'Deposit forfeiture clause', detail: 'Losing the whole deposit for a small breach is unfair. Deductions should match actual, documented damage.', quote: quote(/forfeit/i) });
  if (/(all|any)\s+(repairs?|maintenance)[^.]{0,40}(tenant|lessee)/.test(low)) flags.push({ level: 'medium', title: 'Tenant pays for all repairs', detail: 'Structural repairs, plumbing lines and seepage are usually the owner’s cost. Limit tenant repairs to minor day-to-day items.', quote: quote(/repairs?/i) });
  if (!/(refund|return)[^.]{0,60}deposit|deposit[^.]{0,60}(refund|return)/.test(low)) flags.push({ level: 'medium', title: 'No deposit refund timeline', detail: 'Add “deposit refunded within 7–15 days of handing over keys, after documented deductions”.' });
  if (!/(stamp|registered|registration)/.test(low)) flags.push({ level: 'info', title: 'Stamp duty / registration not mentioned', detail: 'Check the agreement is on correct stamp paper (or e-stamped) for it to be valid evidence.' });
  return flags;
}
export const SAMPLE_AGREEMENT = `This rental agreement is made between the Owner and the Tenant for Flat 304, Sample Residency, HSR Layout, Bengaluru. Monthly rent is Rs. 32,000 payable before the 5th of every month. The Tenant shall pay a security deposit of Rs. 3,20,000 (10 months rent). The agreement has a lock-in period of 11 months. Rent shall increase by 15% on renewal. At the time of vacating, painting charges of the entire flat shall be deducted from the security deposit. All repairs and maintenance shall be borne by the tenant. The Owner may ask the Tenant to vacate without any notice in case of breach, and the deposit shall be forfeited.`;
