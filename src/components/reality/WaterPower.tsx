'use client';
import { Droplets, Zap, Wifi, Info } from 'lucide-react';
import { waterReality, powerNet } from '@/lib/reality';
import type { Listing } from '@/data/listings';
import { fullINR, cn } from '@/lib/format';

export function WaterCard({ l }: { l: Listing }) {
  const w = waterReality(l);
  const sources = [w.cauvery && 'Cauvery (BWSSB)', w.borewell && 'Borewell', w.tankerTripsSummer > 0 && 'Tanker in summer'].filter(Boolean) as string[];
  return (
    <div className="rounded-2xl border border-ink-200 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2 font-semibold"><Droplets className="h-5 w-5 text-brand-600" />Water reality</div><span className="chip bg-ink-100 text-ink-500">Sample · {w.reports} resident reports</span></div>
      <div className="mt-3 flex flex-wrap gap-1.5">{sources.map((s) => <span key={s} className="chip border border-ink-200 bg-white text-ink-700">{s}</span>)}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-ink-50 p-2"><div className="font-display text-lg font-bold">{w.tankerTripsSummer}</div><div className="text-ink-500">tankers / summer month</div></div>
        <div className="rounded-lg bg-ink-50 p-2"><div className="font-display text-lg font-bold">{w.tankerTripsSummer ? fullINR(w.summerCostPerMonth) : '₹0'}</div><div className="text-ink-500">summer month cost</div></div>
        <div className="rounded-lg bg-ink-50 p-2"><div className="font-display text-lg font-bold">{fullINR(w.yearCostPerMonth)}</div><div className="text-ink-500">avg / month over a year</div></div>
      </div>
      <p className={cn('mt-3 text-sm font-semibold', w.tankerTripsSummer > 7 ? 'text-coral-700' : 'text-brand-700')}>{w.label}</p>
      <p className="mt-1 flex items-start gap-1.5 text-[11px] text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Sample data. In the product, residents report water source and summer tanker trips; cost assumes ~{fullINR(w.tankerCostPerTrip)} per load and about 4 dry months a year.</p>
    </div>
  );
}

export function PowerNetCard({ l }: { l: Listing }) {
  const p = powerNet(l);
  return (
    <div className="rounded-2xl border border-ink-200 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2 font-semibold"><Zap className="h-5 w-5 text-brand-600" />Power &amp; internet reality</div><span className="chip bg-ink-100 text-ink-500">Sample · {p.reports} reports</span></div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-ink-50 p-2"><div className="font-display text-lg font-bold">~{p.outageHrsPerMonth} h</div><div className="text-ink-500">power cuts / month</div></div>
        <div className="rounded-lg bg-ink-50 p-2"><div className="font-display text-lg font-bold">{p.fibreProviders}</div><div className="text-ink-500">fibre providers in building</div></div>
        <div className="rounded-lg bg-ink-50 p-2"><div className="text-sm font-bold leading-tight">{p.backup}</div><div className="text-ink-500">backup</div></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><Wifi className="h-4 w-4 text-brand-600" />{p.typicalSpeed}<span className={cn('chip', p.wfhReady ? 'bg-brand-600 text-white' : 'bg-coral-100 text-coral-800')}>{p.wfhReady ? 'Work-from-home ready' : 'Check before WFH'}</span></div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Sample data. In the product: outage hours from residents’ reports and BESCOM planned-outage notices; fibre availability confirmed by residents and owners.</p>
    </div>
  );
}
