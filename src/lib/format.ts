/** Indian currency formatting with lakh / crore. */
export function formatINR(value: number, opts: { compact?: boolean } = {}): string {
  const compact = opts.compact ?? true;
  if (compact) {
    if (value >= 1e7) return `₹${trim(value / 1e7)} Cr`;
    if (value >= 1e5) return `₹${trim(value / 1e5)} L`;
    if (value >= 1e3) return `₹${trim(value / 1e3)}K`;
  }
  return '₹' + Math.round(value).toLocaleString('en-IN');
}
function trim(n: number) {
  return (Math.round(n * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
}
export const fullINR = (v: number) => '₹' + Math.round(v).toLocaleString('en-IN');

export function formatPrice(price: number, deal: 'buy' | 'rent') {
  return deal === 'rent' ? `${fullINR(price)}/mo` : formatINR(price);
}

/** Haversine straight-line distance in km. */
export function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Monthly EMI. rate = annual % */
export function emi(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

export function saveLocal<T>(key: string, value: T) {
  try {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({ ...value, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}
