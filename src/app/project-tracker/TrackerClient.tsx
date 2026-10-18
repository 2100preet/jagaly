'use client';
import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Ban, Search, Landmark, PackageCheck } from 'lucide-react';
import { PROJECTS, type ProjectDelay } from '@/data/projects';
import { cn } from '@/lib/format';

const STATUS: Record<ProjectDelay['status'], { c: string; i: any }> = {
  'On track': { c: 'bg-brand-50 text-brand-700 border-brand-200', i: CheckCircle2 },
  'Minor delay': { c: 'bg-saffron-50 text-saffron-700 border-saffron-200', i: Clock },
  Delayed: { c: 'bg-red-50 text-red-700 border-red-200', i: AlertTriangle },
  Stalled: { c: 'bg-ink-900 text-white border-ink-900', i: Ban },
  Delivered: { c: 'bg-indigo-50 text-indigo-700 border-indigo-200', i: PackageCheck },
};

export default function TrackerClient() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState<'delay' | 'progress' | 'complaints'>('delay');
  const rows = useMemo(() => {
    let r = PROJECTS.filter((p) => (p.name + p.builder + p.locality).toLowerCase().includes(q.toLowerCase()));
    if (status) r = r.filter((p) => p.status === status);
    return [...r].sort((a, b) => (sort === 'progress' ? b.progress - a.progress : sort === 'complaints' ? b.complaints - a.complaints : b.delayMonths - a.delayMonths));
  }, [q, status, sort]);

  const builders = useMemo(() => {
    const m: Record<string, { n: number; delay: number; delivered: number }> = {};
    PROJECTS.forEach((p) => { m[p.builder] ??= { n: 0, delay: 0, delivered: 0 }; m[p.builder].n++; m[p.builder].delay += p.delayMonths; if (p.status === 'Delivered') m[p.builder].delivered++; });
    return Object.entries(m).map(([b, v]) => ({ b, ...v, avg: v.delay / v.n })).sort((a, b) => a.avg - b.avg);
  }, []);

  const totalDelayed = PROJECTS.filter((p) => p.delayMonths > 0 && p.status !== 'Delivered').length;
  const avgDelay = Math.round(PROJECTS.reduce((a, p) => a + p.delayMonths, 0) / PROJECTS.length);

  return (
    <div className="container-x py-10">
      <div className="max-w-3xl">
        <span className="chip bg-indigo-50 text-indigo-700"><Landmark className="h-3.5 w-3.5" />RERA-style tracker · sample data</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Builder project delay tracker</h1>
        <p className="mt-3 text-ink-600">Before you pay a booking amount, see how a project — and its builder — has actually performed against the possession dates they promised. All projects and builders below are fictional sample data in a Karnataka RERA-like format.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[['Projects tracked', PROJECTS.length], ['Currently delayed', totalDelayed], ['Avg delay', `${avgDelay} mo`], ['Total complaints', PROJECTS.reduce((a, p) => a + p.complaints, 0)]].map(([k, v]) => (
          <div key={k as string} className="card p-5"><div className="text-xs uppercase tracking-wide text-ink-400">{k}</div><div className="mt-1 font-display text-3xl font-extrabold">{v}</div></div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <label className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><input className="input pl-9" placeholder="Search project, builder, locality" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{Object.keys(STATUS).map((s) => <option key={s}>{s}</option>)}</select>
        <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value as any)}><option value="delay">Sort: most delayed</option><option value="progress">Sort: most complete</option><option value="complaints">Sort: most complaints</option></select>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>{['Project', 'Locality', 'Promised', 'Revised', 'Delay', 'Construction', 'Complaints', 'Status'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((p) => { const S = STATUS[p.status]; return (
              <tr key={p.name} className="hover:bg-ink-50/60">
                <td className="px-4 py-3"><div className="font-semibold">{p.name}</div><div className="text-xs text-ink-500">{p.builder} · {p.units} units</div><div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.rera}</div></td>
                <td className="px-4 py-3">{p.locality}</td>
                <td className="px-4 py-3">{p.promised}</td>
                <td className="px-4 py-3">{p.revised}</td>
                <td className={cn('px-4 py-3 font-bold', p.delayMonths === 0 ? 'text-brand-700' : p.delayMonths < 12 ? 'text-saffron-600' : 'text-red-600')}>{p.delayMonths ? `+${p.delayMonths} mo` : 'None'}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-ink-100"><div className={cn('h-full rounded-full', p.progress === 100 ? 'bg-indigo-500' : 'bg-brand-500')} style={{ width: `${p.progress}%` }} /></div><span className="text-xs font-semibold">{p.progress}%</span></div><div className="text-[10px] text-ink-400">Updated {p.lastUpdate}</div></td>
                <td className="px-4 py-3">{p.complaints}</td>
                <td className="px-4 py-3"><span className={cn('chip border', S.c)}><S.i className="h-3.5 w-3.5" />{p.status}</span></td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>

      <h2 className="h-section mt-14">Builder scorecard</h2>
      <p className="mt-1 text-sm text-ink-500">Average delay across all tracked projects (lower is better). Sample.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {builders.map((b, i) => (
          <div key={b.b} className="card p-5">
            <div className="flex items-center justify-between"><div className="font-semibold">{b.b}</div><span className={cn('chip', b.avg < 6 ? 'bg-brand-600 text-white' : b.avg < 18 ? 'bg-saffron-500 text-white' : 'bg-red-600 text-white')}>Grade {['A', 'A', 'B', 'C', 'D'][Math.min(4, i)]}</span></div>
            <div className="mt-3 grid grid-cols-3 text-center text-sm">
              <div><div className="font-display text-xl font-extrabold">{b.n}</div><div className="text-[11px] text-ink-500">projects</div></div>
              <div><div className="font-display text-xl font-extrabold">{b.avg.toFixed(0)}<span className="text-xs">mo</span></div><div className="text-[11px] text-ink-500">avg delay</div></div>
              <div><div className="font-display text-xl font-extrabold">{b.delivered}</div><div className="text-[11px] text-ink-500">delivered</div></div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink-400">Data source in production: Karnataka RERA quarterly progress reports + verified buyer reports. This prototype uses fictional sample entries; RERA numbers are format examples only.</p>
    </div>
  );
}
