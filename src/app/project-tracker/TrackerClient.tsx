'use client';
import { useMemo, useState } from 'react';
import { Info, Search, Landmark, ExternalLink, CalendarClock, FileCheck2, CalendarX2, CalendarCheck2 } from 'lucide-react';
import data from '@/data/rera-projects.json';
import { cn } from '@/lib/format';

type Ext = { type: string; from: string; to: string; approved_on?: string | null };
type P = {
  project_id: string; reg_number: string; project_name: string; promoter: string; taluk: string; pin_code: string | null;
  registration_date: string; original_completion_date: string; current_completion_date: string; extensions: Ext[]; extension_months: number;
  completion_applied_on: string | null; complaints_on_project: number | null; record_status: string; official_certificate_url: string;
};
const PROJECTS = data.projects as P[];
const META = data.meta;

const fmt = (iso?: string | null) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const snapshot = fmt(META.source_snapshot_date);
const downloaded = fmt(META.fetched_on);

const STATUS: Record<string, { label: string; c: string; i: any }> = {
  'Completion applied': { label: 'Completion applied (per record)', c: 'bg-brand-50 text-brand-700 border-brand-200', i: FileCheck2 },
  'Within current completion date': { label: 'Within current completion date', c: 'bg-indigo-50 text-indigo-700 border-indigo-200', i: CalendarCheck2 },
  'Completion date passed, no completion application in record': { label: 'Completion date passed · no completion application in record', c: 'bg-ink-100 text-ink-700 border-ink-200', i: CalendarX2 },
};

function extText(p: P) {
  if (!p.extension_months) return 'No extension in record';
  return `Completion date extended by ${p.extension_months} month${p.extension_months === 1 ? '' : 's'} per RERA record`;
}

export default function TrackerClient() {
  const [q, setQ] = useState('');
  const [taluk, setTaluk] = useState('');
  const [status, setStatus] = useState('');
  const [ext, setExt] = useState('');
  const [sort, setSort] = useState<'ext' | 'reg' | 'due' | 'complaints'>('ext');
  const taluks = useMemo(() => [...new Set(PROJECTS.map((p) => p.taluk))].sort(), []);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = PROJECTS.filter((p) => !s || (p.project_name + ' ' + p.promoter + ' ' + p.reg_number + ' ' + p.taluk + ' ' + (p.pin_code ?? '')).toLowerCase().includes(s));
    if (taluk) r = r.filter((p) => p.taluk === taluk);
    if (status) r = r.filter((p) => p.record_status === status);
    if (ext === 'none') r = r.filter((p) => !p.extension_months);
    if (ext === 'any') r = r.filter((p) => p.extension_months > 0);
    if (ext === 'covid') r = r.filter((p) => p.extensions.some((e) => e.type.startsWith('COVID')));
    if (ext === 's6') r = r.filter((p) => p.extensions.some((e) => e.type.startsWith('Section 6')));
    return [...r].sort((a, b) =>
      sort === 'reg' ? b.registration_date.localeCompare(a.registration_date)
        : sort === 'due' ? a.current_completion_date.localeCompare(b.current_completion_date)
          : sort === 'complaints' ? (b.complaints_on_project ?? -1) - (a.complaints_on_project ?? -1)
            : b.extension_months - a.extension_months || a.project_name.localeCompare(b.project_name));
  }, [q, taluk, status, ext, sort]);

  const n = PROJECTS.length;
  const withExt = PROJECTS.filter((p) => p.extension_months > 0).length;
  const s6 = PROJECTS.filter((p) => p.extensions.some((e) => e.type.startsWith('Section 6'))).length;
  const applied = PROJECTS.filter((p) => p.record_status === 'Completion applied').length;

  return (
    <div className="container-x py-10">
      <div role="note" className="mb-8 flex items-start gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-4 text-indigo-950 sm:p-5">
        <Info className="mt-0.5 h-6 w-6 shrink-0 text-indigo-600" />
        <div>
          <p className="font-semibold sm:text-base">Data from RERA Karnataka public records, fetched {snapshot}. {'Pakka'} is not affiliated with RERA Karnataka. Verify on the official site before decisions.</p>
          <p className="mt-1 text-xs text-indigo-800">Records via the open <a className="underline" href="https://github.com/Vonter/karnataka-rera-projects" target="_blank" rel="noopener noreferrer">karnataka-rera-projects</a> dataset (ODbL 1.0; some contents © Karnataka RERA), built from <a className="underline" href="https://rera.karnataka.gov.in/viewAllProjects?language=en" target="_blank" rel="noopener noreferrer">rera.karnataka.gov.in</a>; downloaded {downloaded}. Each project links to its official registration certificate.</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <span className="chip bg-indigo-50 text-indigo-700"><Landmark className="h-3.5 w-3.5" />RERA Karnataka public records · Bengaluru Urban</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">RERA project completion tracker</h1>
        <p className="mt-3 text-ink-600">Registered completion dates, extensions and completion applications for a random sample of {n} residential projects in Bengaluru Urban, exactly as shown in RERA Karnataka records. Extensions can have many causes, including the COVID-19 general extension the Authority granted to all projects; read the official record for context.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[['Projects in sample', n], ['Completion date extended (any)', withExt], ['With a Section 6 extension', s6], ['Completion applied (per record)', applied]].map(([k, v]) => (
          <div key={k as string} className="card p-5"><div className="text-xs uppercase tracking-wide text-ink-400">{k}</div><div className="mt-1 font-display text-3xl font-extrabold">{v}</div></div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <label className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><input className="input pl-9" placeholder="Search project, promoter, RERA no., taluk, PIN" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <select className="input w-auto" value={taluk} onChange={(e) => setTaluk(e.target.value)} aria-label="Taluk"><option value="">All taluks</option>{taluks.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="input w-auto" value={ext} onChange={(e) => setExt(e.target.value)} aria-label="Extensions"><option value="">Any extension status</option><option value="any">Completion date extended</option><option value="none">No extension in record</option><option value="covid">COVID-19 general extension</option><option value="s6">Section 6 extension</option></select>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Record status"><option value="">Any record status</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort"><option value="ext">Sort: longest extension</option><option value="reg">Sort: newest registration</option><option value="due">Sort: earliest current completion date</option><option value="complaints">Sort: complaints listed</option></select>
      </div>
      <p className="mt-2 text-xs text-ink-500">Showing {rows.length} of {n}</p>

      <div className="card mt-2 overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>{['Project & promoter', 'Taluk', 'Registered', 'Original completion', 'Current completion', 'Extensions (per RERA record)', 'Complaints listed', 'Record status'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((p) => { const S = STATUS[p.record_status]; return (
              <tr key={p.reg_number} className="align-top hover:bg-ink-50/60">
                <td className="px-4 py-3"><div className="font-semibold">{p.project_name}</div><div className="text-xs text-ink-500">{p.promoter}</div>
                  <a href={p.official_certificate_url} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-indigo-700 underline">{p.reg_number}<ExternalLink className="h-3 w-3" /></a></td>
                <td className="px-4 py-3">{p.taluk}{p.pin_code && <div className="text-xs text-ink-400">{p.pin_code}</div>}</td>
                <td className="px-4 py-3 whitespace-nowrap">{fmt(p.registration_date)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{fmt(p.original_completion_date)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{fmt(p.current_completion_date)}</td>
                <td className="px-4 py-3"><div className={cn('font-semibold', p.extension_months ? 'text-ink-800' : 'text-ink-500')}>{extText(p)}</div>
                  {p.extensions.map((e) => <div key={e.type + e.from} className="text-[11px] text-ink-500">{e.type}: {fmt(e.from)} → {fmt(e.to)}{e.approved_on ? ` (approved ${fmt(e.approved_on)})` : ''}</div>)}</td>
                <td className="px-4 py-3">{p.complaints_on_project ?? <span className="text-ink-400">none listed</span>}</td>
                <td className="px-4 py-3"><span className={cn('chip border text-[11px]', S.c)}><S.i className="h-3.5 w-3.5" />{S.label}</span>{p.completion_applied_on && <div className="mt-1 text-[11px] text-ink-500">Applied {fmt(p.completion_applied_on)}</div>}</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card p-6 text-sm text-ink-600">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900"><CalendarClock className="h-5 w-5 text-indigo-600" />Method</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li><strong>Sample:</strong> {META.selection}.</li>
            <li><strong>Original completion:</strong> the completion date recorded at registration.</li>
            <li><strong>Current completion:</strong> the proposed completion date currently on the project record.</li>
            <li><strong>Extension months:</strong> whole months from original to current completion date. Nothing is estimated; projects without a later date show “No extension in record”.</li>
            <li><strong>Record status:</strong> “Completion applied” if the record shows a completion application date; “Completion date passed · no completion application in record” if the current completion date is before {snapshot} and no application is shown; otherwise “Within current completion date”. This is a statement about the record, not about construction on site.</li>
            <li><strong>Complaints listed:</strong> the count of complaints against the project shown on the record. A complaint is not a finding.</li>
            <li>No grades or scores are assigned to promoters.</li>
          </ul>
        </div>
        <div className="card p-6 text-sm text-ink-600">
          <h2 className="font-display text-lg font-bold text-ink-900">Not shown / caveats</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>Quarterly progress reports are filed as documents and aren’t available as structured data, so construction progress isn’t shown.</li>
            <li>Records reflect the portal on {snapshot}; anything filed later (extensions, completion applications, OCs) won’t appear until the next refresh.</li>
            <li>Five records were spot-checked against the official certificate pages (registration number, approval date and original completion date all matched).</li>
            <li>Always confirm on <a className="text-indigo-700 underline" href="https://rera.karnataka.gov.in/viewAllProjects?language=en" target="_blank" rel="noopener noreferrer">rera.karnataka.gov.in</a> before any decision. Corrections: {`hello@pakka.example`}.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
