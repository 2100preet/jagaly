'use client';
import { useState } from 'react';
import { Clock, Info, AlertTriangle } from 'lucide-react';
import { TECH_PARKS, resolveArea } from '@/data/geo';
import { peakCommute } from '@/lib/reality';
import LocalityTypeahead from '@/components/LocalityTypeahead';
import { cn } from '@/lib/format';

/** Peak-hour commute: 9 AM / 6 PM vs off-peak, to a tech park or any locality (model estimate). */
export default function PeakCommute({ from, fromLabel, pickFrom = false }: { from?: [number, number]; fromLabel?: string; pickFrom?: boolean }) {
  const [office, setOffice] = useState<string>(TECH_PARKS[2].name);
  const [custom, setCustom] = useState('');
  const [origin, setOrigin] = useState('HSR Layout');
  const src: [number, number] | undefined = pickFrom ? resolveArea(origin)?.coord : from;
  const dest: [number, number] | undefined = custom ? resolveArea(custom)?.coord : TECH_PARKS.find((t) => t.name === office)?.coord;
  const r = src && dest ? peakCommute(src, dest) : undefined;
  const max = r ? Math.max(...r.slots.map((s) => s.mins)) : 1;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {pickFrom && (
          <div><div className="label">From (your home area)</div><LocalityTypeahead value={origin} onChange={setOrigin} placeholder="e.g. HSR Layout" /></div>
        )}
        <div>
          <div className="label">To (your office)</div>
          <select className="input" value={custom ? '' : office} onChange={(e) => { setCustom(''); setOffice(e.target.value); }}>
            {TECH_PARKS.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
            {custom && <option value="">{custom}</option>}
          </select>
        </div>
        {!pickFrom && (
          <div><div className="label">…or any locality</div><LocalityTypeahead value={custom} onChange={setCustom} placeholder="Type a locality, e.g. MG Road" allLabel="" /></div>
        )}
      </div>
      {r ? (
        <div className="mt-4">
          <div className="space-y-2">
            {r.slots.map((s) => (
              <div key={s.k} className="flex items-center gap-3">
                <div className="flex w-24 shrink-0 items-center gap-1.5 text-sm font-medium"><Clock className="h-3.5 w-3.5 text-ink-400" />{s.label}</div>
                <div className="h-2.5 flex-1 rounded-full bg-ink-100"><div className={cn('h-full rounded-full', s.mins <= 30 ? 'bg-brand-500' : s.mins <= 60 ? 'bg-coral-400' : 'bg-red-500')} style={{ width: `${(s.mins / max) * 100}%` }} /></div>
                <div className="w-20 shrink-0 text-right text-sm font-semibold">~{s.mins} min</div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-900"><strong>{r.hoursPerMonth} hours a month</strong> in peak-hour traffic (22 workdays, 9 AM + 6 PM){fromLabel ? ` from ${fromLabel}` : ''}.</div>
            <div className="rounded-xl bg-ink-50 p-3 text-ink-700">{r.bestLeave}. Road distance ~{r.km.toFixed(1)} km.</div>
          </div>
          {r.bottlenecks.length > 0 && <p className="mt-2 flex items-center gap-1.5 text-xs text-coral-700"><AlertTriangle className="h-3.5 w-3.5" />Route likely passes known peak bottlenecks: {r.bottlenecks.join(', ')}.</p>}
        </div>
      ) : <p className="mt-4 text-sm text-ink-500">Pick a locality from the list to see times.</p>}
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Estimate from road-distance and time-of-day speed profiles with bottleneck delays. In the product this uses a routing service with live and historical traffic for 9 AM and 6 PM departures.</p>
    </div>
  );
}
