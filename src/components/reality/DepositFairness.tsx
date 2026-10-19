'use client';
import { useMemo, useState } from 'react';
import { Copy, Check, MessageCircle, Info, Scale } from 'lucide-react';
import { depositFairness, negotiationMessage, NEGOTIATION_PERKS } from '@/lib/reality';
import { fullINR, cn } from '@/lib/format';

/** Deposit fairness meter + AI-style negotiation message (template-based in the prototype). */
export default function DepositFairness({ rent, deposit, locality, editable = false }: { rent: number; deposit: number; locality: string; editable?: boolean }) {
  const [r, setR] = useState(rent);
  const [d, setD] = useState(deposit);
  const f = depositFairness(r, d, locality);
  const [target, setTarget] = useState(f.suggestMonths);
  const [tone, setTone] = useState<'polite' | 'firm'>('polite');
  const [perks, setPerks] = useState<string[]>([NEGOTIATION_PERKS[0], NEGOTIATION_PERKS[2]]);
  const [copied, setCopied] = useState(false);
  const msg = useMemo(() => negotiationMessage({ rent: r, deposit: d, months: f.months, target, locality, tone, perks }), [r, d, f.months, target, locality, tone, perks]);
  const pos = (m: number) => `${Math.min(100, Math.max(0, (m / 12) * 100))}%`;
  return (
    <div className="space-y-4">
      {editable && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label><span className="label">Monthly rent (₹)</span><input type="number" className="input" value={r} min={5000} step={500} onChange={(e) => setR(Math.max(1000, +e.target.value || 0))} /></label>
          <label><span className="label">Deposit asked (₹)</span><input type="number" className="input" value={d} min={0} step={5000} onChange={(e) => setD(Math.max(0, +e.target.value || 0))} /></label>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Scale className="h-5 w-5 text-brand-600" />
        <div className="font-display text-2xl font-extrabold">{f.months.toFixed(1)} months</div>
        <span className={cn('chip', f.verdict === 'Tenant-friendly' ? 'bg-brand-600 text-white' : f.verdict === 'Typical for the area' ? 'bg-brand-100 text-brand-800' : f.verdict === 'Above typical' ? 'bg-coral-100 text-coral-800' : 'bg-coral-600 text-white')}>{f.verdict}</span>
      </div>
      <div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-brand-400 via-brand-200 to-coral-500">
          <div className="absolute -top-1 h-5 w-1 -translate-x-1/2 rounded bg-ink-400" style={{ left: pos(2) }} title="Model Tenancy Act guidance" />
          <div className="absolute -top-1 h-5 w-1 -translate-x-1/2 rounded bg-brand-800" style={{ left: pos(f.norm.typical) }} />
          <div className="absolute -top-2 h-7 w-2 -translate-x-1/2 rounded-full bg-ink-900 ring-2 ring-white" style={{ left: pos(f.months) }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-ink-500"><span>0</span><span>2 mo · MTA 2021 guidance</span><span>{f.norm.typical} mo · typical in {locality} (sample)</span><span>12 mo</span></div>
      </div>
      <div className="rounded-2xl border border-ink-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold">Draft a polite counter-offer</div>
          <div className="inline-flex rounded-lg bg-ink-100 p-0.5 text-xs">{(['polite', 'firm'] as const).map((t) => <button key={t} onClick={() => setTone(t)} className={cn('rounded-md px-2.5 py-1 font-semibold capitalize', tone === t ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}>{t}</button>)}</div>
        </div>
        <label className="mt-3 block text-sm"><span className="flex justify-between text-ink-600"><span>Propose</span><strong>{target} months · {fullINR(target * r)}</strong></span>
          <input type="range" min={1} max={Math.max(2, Math.ceil(f.months))} value={target} onChange={(e) => setTarget(+e.target.value)} className="w-full accent-brand-600" /></label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {NEGOTIATION_PERKS.map((p, i) => {
            const on = perks.includes(p);
            return <button key={i} onClick={() => setPerks(on ? perks.filter((x) => x !== p) : [...perks, p])} className={cn('chip border text-left', on ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-ink-200 bg-white text-ink-600')}>{on && <Check className="h-3 w-3" />}{['On-time rent', 'Verified Tenant', 'Joint move-in video', 'Deposit Safe (optional)'][i]}</button>;
          })}
        </div>
        <textarea readOnly value={msg} rows={6} className="input mt-3 font-mono text-xs leading-relaxed" aria-label="Negotiation message" />
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={() => { navigator.clipboard?.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="btn-ghost">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</button>
          <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="btn-primary"><MessageCircle className="h-4 w-4" />Send on WhatsApp</a>
        </div>
        {f.savings > 0 && <p className="mt-2 text-xs text-brand-700">If accepted at {f.suggestMonths} months, {fullINR(f.savings)} stays in your pocket.</p>}
      </div>
      <p className="flex items-start gap-1.5 text-[11px] text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Typical deposits are sample estimates by locality. The central Model Tenancy Act, 2021 suggests up to 2 months for residential homes, but it applies only where a state adopts it. Not legal advice.</p>
    </div>
  );
}
