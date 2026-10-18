'use client';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { NRI_ZONES, istSlotToDate, fmtInZone } from '@/lib/tz';

const SLOTS = ['7:00 AM', '10:00 AM', '1:00 PM', '6:00 PM', '9:00 PM'];

/** IST visit slots shown in common NRI time zones (computed in the browser, DST-aware). */
export default function NriClock() {
  const [day, setDay] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { const d = new Date(); d.setDate(d.getDate() + 1); setDay(d); setNow(new Date()); const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  if (!day || !now) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />;
  return (
    <div className="card overflow-x-auto p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-indigo-600" />Video visit slots for {day.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} (IST)</div>
        <span className="text-xs text-ink-500">Now in Bengaluru: {fmtInZone(now, 'Asia/Kolkata')}</span>
      </div>
      <table className="w-full min-w-[640px] text-sm">
        <thead><tr className="text-left text-xs uppercase tracking-wide text-ink-400"><th className="py-2 pr-3">IST (Bengaluru)</th>{NRI_ZONES.map((z) => <th key={z.tz} className="px-2 py-2">{z.label}</th>)}</tr></thead>
        <tbody className="divide-y divide-ink-100">
          {SLOTS.map((s) => { const d = istSlotToDate(day, s); return (
            <tr key={s}><td className="py-2 pr-3 font-semibold text-indigo-700">{s}</td>{NRI_ZONES.map((z) => <td key={z.tz} className="px-2 py-2 text-ink-600">{fmtInZone(d, z.tz)}</td>)}</tr>
          ); })}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-ink-400">Times convert automatically, including daylight saving. Agents work 7 AM–10 PM IST; weekend slots available (planned).</p>
    </div>
  );
}
