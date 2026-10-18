'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Map as MapIcon, List, X, ShieldCheck, User, PawPrint, RotateCcw } from 'lucide-react';
import { LISTINGS, type Listing } from '@/data/listings';
import { LOCALITIES } from '@/data/geo';
import ListingCard from '@/components/ListingCard';
import { cn, formatINR } from '@/lib/format';
import { FEATURES } from '@/config/brand';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => <div className="grid h-full place-items-center bg-ink-100 text-sm text-ink-400">Loading map…</div> });

type F = {
  deal: 'buy' | 'rent'; kind: '' | 'builder' | 'owner'; locality: string; min: string; max: string; bhk: string;
  furnishing: string; tenant: string; pets: boolean; owner: boolean; verified: boolean; sort: string;
};

function fromParams(p: URLSearchParams): F {
  return {
    deal: (p.get('deal') as F['deal']) || 'rent',
    kind: (p.get('kind') as F['kind']) || '',
    locality: p.get('locality') || '',
    min: p.get('min') || '', max: p.get('max') || '', bhk: p.get('bhk') || '',
    furnishing: p.get('furnishing') || '', tenant: p.get('tenant') || '',
    pets: p.get('pets') === '1', owner: p.get('owner') === '1', verified: p.get('verified') === '1',
    sort: p.get('sort') || 'relevance',
  };
}

function toParams(f: F) {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (typeof v === 'boolean') { if (v) p.set(k, '1'); }
    else if (v && !(k === 'sort' && v === 'relevance')) p.set(k, v);
  });
  return p.toString();
}

function apply(f: F): Listing[] {
  let r = LISTINGS.filter((l) => l.deal === f.deal);
  if (f.kind) r = r.filter((l) => l.kind === f.kind);
  if (f.locality) r = r.filter((l) => l.locality === f.locality);
  if (f.min) r = r.filter((l) => l.price >= +f.min);
  if (f.max) r = r.filter((l) => l.price <= +f.max);
  if (f.bhk) r = r.filter((l) => (+f.bhk >= 4 ? l.bhk >= 4 : l.bhk === +f.bhk));
  if (f.furnishing) r = r.filter((l) => l.furnishing === f.furnishing);
  if (f.tenant && f.deal === 'rent') r = r.filter((l) => l.tenantType === f.tenant || l.tenantType === 'any');
  if (f.pets) r = r.filter((l) => l.pets);
  if (f.owner) r = r.filter((l) => l.kind === 'owner');
  if (f.verified) r = r.filter((l) => l.verified);
  const s = [...r];
  if (f.sort === 'price-asc') s.sort((a, b) => a.price - b.price);
  if (f.sort === 'price-desc') s.sort((a, b) => b.price - a.price);
  if (f.sort === 'newest') s.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  if (f.sort === 'value') s.sort((a, b) => a.price / a.truePrice - b.price / b.truePrice);
  if (f.sort === 'relevance') s.sort((a, b) => Number(b.verified) - Number(a.verified));
  return s;
}

const PRICE = {
  rent: [10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000],
  buy: [3000000, 5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000],
};

function Toggle({ on, onClick, icon: Icon, children }: { on: boolean; onClick: () => void; icon: any; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn('flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition', on ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300')}>
      <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{children}</span>
      <span className={cn('relative h-5 w-9 rounded-full transition', on ? 'bg-brand-600' : 'bg-ink-200')}><span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition', on ? 'left-[18px]' : 'left-0.5')} /></span>
    </button>
  );
}

export default function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [f, setF] = useState<F>(() => fromParams(new URLSearchParams(params.toString())));
  const [view, setView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => { setF(fromParams(new URLSearchParams(params.toString()))); }, [params]);
  const update = (patch: Partial<F>) => {
    const next = { ...f, ...patch };
    if (patch.deal && patch.deal !== f.deal) { next.min = ''; next.max = ''; }
    setF(next);
    router.replace(`/search/?${toParams(next)}`, { scroll: false });
  };
  const results = useMemo(() => apply(f), [f]);
  const prices = PRICE[f.deal];

  const filters = (
    <div className="space-y-5">
      <div>
        <span className="label">Looking to</span>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1">
          {(['rent', 'buy'] as const).map((d) => (
            <button key={d} onClick={() => update({ deal: d })} className={cn('rounded-lg py-2 text-sm font-semibold capitalize', f.deal === d ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}>{d}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="loc">Locality</label>
        <select id="loc" className="input" value={f.locality} onChange={(e) => update({ locality: e.target.value })}>
          <option value="">All Bangalore</option>
          {LOCALITIES.map((l) => <option key={l.name}>{l.name}</option>)}
        </select>
      </div>
      <div>
        <span className="label">Budget {f.deal === 'rent' ? '(per month)' : ''}</span>
        <div className="grid grid-cols-2 gap-2">
          <select className="input" value={f.min} onChange={(e) => update({ min: e.target.value })} aria-label="Min price">
            <option value="">Min</option>{prices.map((p) => <option key={p} value={p}>{formatINR(p)}</option>)}
          </select>
          <select className="input" value={f.max} onChange={(e) => update({ max: e.target.value })} aria-label="Max price">
            <option value="">Max</option>{prices.map((p) => <option key={p} value={p}>{formatINR(p)}</option>)}
          </select>
        </div>
      </div>
      <div>
        <span className="label">BHK</span>
        <div className="grid grid-cols-5 gap-1.5">
          {['', '1', '2', '3', '4'].map((b) => (
            <button key={b} onClick={() => update({ bhk: b })} className={cn('rounded-lg border py-2 text-sm font-semibold', f.bhk === b ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300')}>{b ? (b === '4' ? '4+' : b) : 'Any'}</button>
          ))}
        </div>
      </div>
      <div>
        <span className="label">Furnishing</span>
        <div className="flex flex-wrap gap-1.5">
          {[['', 'Any'], ['full', 'Full'], ['semi', 'Semi'], ['unfurnished', 'Unfurnished']].map(([v, l]) => (
            <button key={v} onClick={() => update({ furnishing: v })} className={cn('chip border px-3 py-1.5 text-sm', f.furnishing === v ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600')}>{l}</button>
          ))}
        </div>
      </div>
      {f.deal === 'rent' && (
        <div>
          <span className="label">Tenant type</span>
          <div className="flex flex-wrap gap-1.5">
            {[['', 'Any'], ['family', 'Family'], ['bachelor', 'Bachelor']].map(([v, l]) => (
              <button key={v} onClick={() => update({ tenant: v })} className={cn('chip border px-3 py-1.5 text-sm', f.tenant === v ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600')}>{l}</button>
            ))}
          </div>
        </div>
      )}
      {f.deal === 'buy' && (
        <div>
          <span className="label">Listing type</span>
          <div className="flex flex-wrap gap-1.5">
            {[['', 'All'], ['owner', 'Resale (owner)'], ['builder', 'New projects']].map(([v, l]) => (
              <button key={v} onClick={() => update({ kind: v as F['kind'] })} className={cn('chip border px-3 py-1.5 text-sm', f.kind === v ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600')}>{l}</button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Toggle on={f.verified} onClick={() => update({ verified: !f.verified })} icon={ShieldCheck}>{FEATURES.proof} only</Toggle>
        <Toggle on={f.owner} onClick={() => update({ owner: !f.owner })} icon={User}>Owner listings only</Toggle>
        {f.deal === 'rent' && <Toggle on={f.pets} onClick={() => update({ pets: !f.pets })} icon={PawPrint}>Pets allowed</Toggle>}
      </div>
      <button onClick={() => update({ kind: '', locality: '', min: '', max: '', bhk: '', furnishing: '', tenant: '', pets: false, owner: false, verified: false })} className="btn-ghost w-full"><RotateCcw className="h-4 w-4" />Reset filters</button>
    </div>
  );

  return (
    <div className="container-x py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {results.length} {f.kind === 'builder' ? 'new projects' : f.deal === 'rent' ? 'homes for rent' : 'homes for sale'} {f.locality ? `in ${f.locality}` : 'in Bangalore'}
          </h1>
          <p className="text-sm text-ink-500">Showing <strong>sample listings</strong> · prototype data</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input w-auto py-2" value={f.sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort">
            <option value="relevance">{FEATURES.proof} first</option>
            <option value="value">Best value (vs True Price)</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </select>
          <button onClick={() => setShowFilters(true)} className="btn-ghost lg:hidden"><SlidersHorizontal className="h-4 w-4" />Filters</button>
          <div className="flex rounded-xl border border-ink-200 bg-white p-1 xl:hidden">
            <button onClick={() => setView('list')} className={cn('rounded-lg p-1.5', view === 'list' && 'bg-brand-600 text-white')} aria-label="List view"><List className="h-4 w-4" /></button>
            <button onClick={() => setView('map')} className={cn('rounded-lg p-1.5', view === 'map' && 'bg-brand-600 text-white')} aria-label="Map view"><MapIcon className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_1fr]">
        <aside className="hidden lg:block"><div className="card sticky top-20 p-5">{filters}</div></aside>

        <section className={cn(view === 'map' && 'hidden xl:block')}>
          {results.length === 0 ? (
            <div className="card grid place-items-center p-12 text-center">
              <p className="font-semibold">No sample listings match these filters.</p>
              <p className="mt-1 text-sm text-ink-500">Try widening your budget or removing a filter.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {results.map((l) => <ListingCard key={l.id} l={l} active={active === l.id} onHover={setActive} />)}
            </div>
          )}
        </section>

        <section className={cn('xl:block', view === 'list' && 'hidden')}>
          <div className="card sticky top-20 h-[70vh] overflow-hidden xl:h-[calc(100vh-7rem)]">
            <MapView listings={results} activeId={active} onSelect={setActive} />
          </div>
        </section>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-bold">Filters</h2><button onClick={() => setShowFilters(false)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            {filters}
            <button onClick={() => setShowFilters(false)} className="btn-primary mt-4 w-full">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
