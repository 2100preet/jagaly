'use client';
import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import type { Listing } from '@/data/listings';
import { TECH_PARKS } from '@/data/geo';
import { costTotal, defaultCostInputs, type CostInputs } from '@/lib/reality';
import { distanceKm, fullINR } from '@/lib/format';

const ROWS: [keyof CostInputs, string][] = [
  ['base', 'Rent / EMI'], ['maintenance', 'Society maintenance'], ['tanker', 'Water tankers (avg)'], ['backup', 'Power backup / DG'],
  ['electricity', 'Electricity (BESCOM)'], ['parking', 'Parking'], ['internet', 'Internet'], ['commute', 'Commute (cab / fuel)'],
];
const COLORS = ['bg-brand-600', 'bg-brand-400', 'bg-sky-400', 'bg-amber-400', 'bg-yellow-300', 'bg-coral-400', 'bg-indigo-300', 'bg-coral-600'];

/** True Monthly Cost: listed rent/EMI vs what the home really costs each month. Editable. */
export default function TrueCost({ l }: { l: Listing }) {
  const nearest = useMemo(() => Math.min(...TECH_PARKS.map((p) => distanceKm(l.coord, p.coord))) * 1.35, [l.coord]);
  const [c, setC] = useState<CostInputs>(() => defaultCostInputs(l, nearest));
  const total = costTotal(c);
  const extra = total - c.base;
  return (
    <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
      <div className="space-y-2">
        {ROWS.map(([k, label], i) => (
          <label key={k} className="flex items-center gap-3 text-sm">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${COLORS[i]}`} />
            <span className="flex-1 text-ink-600">{label}</span>
            <span className="relative w-32"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">₹</span>
              <input type="number" min={0} step={100} value={c[k]} onChange={(e) => setC({ ...c, [k]: Math.max(0, +e.target.value || 0) })} className="input py-1.5 pl-6 text-right" aria-label={label} /></span>
          </label>
        ))}
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white">
        <div className="text-sm text-brand-100">{l.deal === 'rent' ? 'Listed rent' : 'EMI (20% down, 8.5%, 20 yrs)'}</div>
        <div className="font-display text-xl font-bold">{fullINR(c.base)}/mo</div>
        <div className="mt-3 text-sm text-brand-100">True monthly cost</div>
        <div className="font-display text-4xl font-extrabold">{fullINR(total)}</div>
        <div className="mt-1 text-sm text-coral-200">+{fullINR(extra)} ({Math.round((extra / Math.max(1, c.base)) * 100)}%) on top of the {l.deal === 'rent' ? 'rent' : 'EMI'}</div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/10">
          {ROWS.map(([k], i) => <div key={k} className={COLORS[i]} style={{ width: `${(c[k] / Math.max(1, total)) * 100}%` }} />)}
        </div>
        <p className="mt-3 text-[11px] text-brand-100">Defaults are sample estimates for this home (tankers from the water report, backup from the power report, commute to the nearest tech park at ~₹9/km). Edit any line.</p>
      </div>
      <p className="flex items-start gap-1.5 text-[11px] text-ink-500 md:col-span-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Estimate only, sample data. Excludes one-time costs (deposit, moving, furnishing).</p>
    </div>
  );
}
