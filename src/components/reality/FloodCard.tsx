'use client';
import { CloudRain, Info, MapPin } from 'lucide-react';
import { floodCheck, FLOOD_TYPES } from '@/lib/reality';
import { cn } from '@/lib/format';

const tone = (label: string) =>
  label === 'Low' ? 'bg-brand-600 text-white' : label === 'Moderate' ? 'bg-brand-100 text-brand-800' : label === 'Limited data' ? 'bg-ink-200 text-ink-700' : label === 'High' ? 'bg-coral-600 text-white' : 'bg-red-700 text-white';

/** Flood & monsoon check from REAL BBMP / KSRSAC flood-spot data (public domain, via OpenCity). */
export default function FloodCard({ coord, place, compact = false }: { coord: [number, number]; place: string; compact?: boolean }) {
  const f = floodCheck(coord);
  return (
    <div className="rounded-2xl border border-ink-200 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold"><CloudRain className="h-5 w-5 text-brand-600" />Flood &amp; monsoon check</div>
        <span className="chip bg-brand-50 text-brand-700">Real public data · BBMP</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="text-center"><div className="font-display text-3xl font-extrabold">{f.limitedData ? '—' : f.score.toFixed(1)}</div><div className="text-[11px] text-ink-500">/10 safer</div></div>
        <div className="flex-1">
          <span className={cn('chip', tone(f.label))}>{f.label === 'Limited data' ? 'Limited data' : `${f.label} flood risk`}</span>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            {[['≤ 500 m', f.within500], ['≤ 1 km', f.within1k], ['≤ 2 km', f.within2k]].map(([k, v]) => (
              <div key={k as string} className="rounded-lg bg-ink-50 p-2"><div className="font-display text-lg font-bold">{v}</div><div className="text-ink-500">spots {k}</div></div>
            ))}
          </div>
        </div>
      </div>
      {f.limitedData ? (
        <p className="mt-3 text-xs text-ink-600">No BBMP-listed flood spot within 2.5 km of {place}. This area may be outside BBMP’s mapped limits, so no data is not the same as no risk. Ask residents about last monsoon.</p>
      ) : (
        !compact && f.spots.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-xs">
            {f.spots.slice(0, 4).map((s, i) => (
              <li key={i} className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-600" /><span><strong>{s.name}</strong>{s.ward && ` (${s.ward} ward)`} · {s.km < 1 ? `${Math.round(s.km * 1000)} m` : `${s.km.toFixed(1)} km`} · <span className="text-ink-500">{FLOOD_TYPES[s.type]}</span></span></li>
            ))}
          </ul>
        )
      )}
      {!f.limitedData && f.within2k === 0 && f.nearest && <p className="mt-3 text-xs text-ink-600">Nearest listed spot: {f.nearest.name}, {f.nearest.km.toFixed(1)} km away.</p>}
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Counts of BBMP-identified flood-vulnerable, flood-prone and low-lying locations near the {compact ? 'locality centre' : 'listing pin'} (BBMP / KSRSAC via OpenCity, public domain, dataset updated Nov 2025). Pins of sample listings are approximate. Some spots may since have been fixed.</p>
    </div>
  );
}
