'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, CheckCircle2, Video, Home, Globe2, BadgeCheck } from 'lucide-react';
import TenantVerifyModal, { useTenantStatus, VerifiedTenantBadge } from './TenantVerify';
import { NRI_ZONES, istSlotToDate, fmtInZone } from '@/lib/tz';
import { cn, saveLocal } from '@/lib/format';
import { BRAND } from '@/config/brand';

const SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '4:00 PM', '6:00 PM', '7:30 PM'];

export default function VisitPicker({ listingId, title, abroad: abroadInit = false, deal = 'rent' }: { listingId: string; title: string; abroad?: boolean; deal?: 'rent' | 'buy' }) {
  const [mode, setMode] = useState<'in-person' | 'video'>(abroadInit ? 'video' : 'in-person');
  const [tenant, setTenant] = useTenantStatus();
  const [showKyc, setShowKyc] = useState(false);
  const [abroad, setAbroad] = useState(abroadInit);
  const [zone, setZone] = useState<string>(NRI_ZONES[0].tz);
  useEffect(() => { setAbroad(abroadInit); if (abroadInit) setMode('video'); }, [abroadInit]);
  const [days, setDays] = useState<Date[]>([]);
  useEffect(() => {
    const out: Date[] = [];
    const d = new Date();
    for (let i = 1; i <= 7; i++) { const x = new Date(d); x.setDate(d.getDate() + i); out.push(x); }
    setDays(out);
  }, []);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const taken = (i: number, s: string) => (i * 7 + s.length) % 5 === 0;

  if (!days.length) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />;
  if (done) return (
    <div className="rounded-2xl bg-brand-50 p-5 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-brand-600" />
      <div className="mt-2 font-display text-lg font-bold text-brand-800">Visit requested!</div>
      <p className="mt-1 text-sm text-brand-800/80">{days[day].toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {slot} · {mode === 'video' ? 'Live video tour' : 'In person'}</p>
      {abroad && <p className="mt-1 text-sm text-brand-800/80">That’s {fmtInZone(istSlotToDate(days[day], slot), zone)} your time ({NRI_ZONES.find((z) => z.tz === zone)?.label}) · hosted by a verified {BRAND.name} agent</p>}
      {tenant.verified && <div className="mt-2"><VerifiedTenantBadge /></div>}
      <p className="mt-2 text-xs text-ink-500">{tenant.verified ? 'Verified Tenants appear first in the owner’s inbox. ' : ''}The owner will confirm via your masked number. (Demo: saved to this browser.)</p>
      <button className="btn-ghost mt-4" onClick={() => { setDone(false); setSlot(''); }}>Book another slot</button>
    </div>
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveLocal(`${BRAND.name.toLowerCase()}_visits`, { listingId, title, date: days[day].toDateString(), slot, mode, abroad, zone: abroad ? zone : undefined, verifiedTenant: tenant.verified, name, phone }); setDone(true); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1">
        {([['in-person', 'In person', Home], ['video', 'Live video', Video]] as const).map(([k, l, I]) => (
          <button type="button" key={k} onClick={() => setMode(k)} className={cn('flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold', mode === k ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}><I className="h-4 w-4" />{l}</button>
        ))}
      </div>
      <label className="flex items-center justify-between gap-2 rounded-xl border border-ink-200 px-3 py-2 text-sm">
        <span className="flex items-center gap-2 font-medium"><Globe2 className="h-4 w-4 text-brand-600" />Book a video visit from abroad</span>
        <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={abroad} onChange={(e) => { setAbroad(e.target.checked); if (e.target.checked) setMode('video'); }} aria-label="Book a video visit from abroad" />
      </label>
      {abroad && (
        <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800">
          <div className="flex items-center justify-between gap-2"><span>Slots are in IST. Show my time in</span>
            <select className="rounded-lg border border-indigo-200 bg-white px-2 py-1" value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Your time zone">{NRI_ZONES.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}</select></div>
          <p className="mt-1.5">A verified {BRAND.name} agent walks the home live on video (planned service · see <Link className="underline" href="/nri/">{BRAND.name} NRI</Link>).</p>
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {days.map((d, i) => (
          <button type="button" key={i} onClick={() => { setDay(i); setSlot(''); }} className={cn('min-w-[58px] shrink-0 rounded-xl border px-2 py-2 text-center', day === i ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 bg-white hover:border-ink-300')}>
            <div className="text-[10px] font-semibold uppercase opacity-75">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
            <div className="text-lg font-bold leading-tight">{d.getDate()}</div>
            <div className="text-[10px] opacity-75">{d.toLocaleDateString('en-IN', { month: 'short' })}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((s) => {
          const t = taken(day, s);
          return <button type="button" key={s} disabled={t} onClick={() => setSlot(s)} className={cn('rounded-lg border py-2 text-xs font-semibold leading-tight', t ? 'border-ink-100 bg-ink-50 text-ink-300 line-through' : slot === s ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300')}>{s}{abroad && <span className="block text-[10px] font-normal opacity-75">{fmtInZone(istSlotToDate(days[day], s), zone)}</span>}</button>;
        })}
      </div>
      <input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
      <input required value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} className="input" placeholder="Mobile (stays masked)" inputMode="numeric" pattern="[6-9][0-9]{9}" title="10-digit Indian mobile number" />
      {deal === 'rent' && (tenant.verified
        ? <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-800"><VerifiedTenantBadge /><span>You’ll appear first in the owner’s inbox</span></div>
        : <button type="button" onClick={() => setShowKyc(true)} className="flex w-full items-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/60 px-3 py-2 text-left text-xs text-indigo-800 hover:bg-indigo-50"><BadgeCheck className="h-4 w-4 shrink-0" /><span><strong>Get verified (optional, free)</strong> — appear first in the owner’s inbox and get faster visit confirmation.</span></button>)}
      {showKyc && <TenantVerifyModal onClose={() => setShowKyc(false)} onDone={setTenant} />}
      <button disabled={!slot} className="btn-primary w-full py-3"><CalendarCheck className="h-4 w-4" />{slot ? `Book ${slot}` : 'Pick a time slot'}</button>
    </form>
  );
}
