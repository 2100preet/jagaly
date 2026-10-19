'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Map as MapIcon, List, X, ShieldCheck, User, PawPrint, RotateCcw, Wallet, MapPinOff, Car, BadgeCheck, Home, Building2 } from 'lucide-react';
import { LISTINGS, type Listing } from '@/data/listings';
import { COMMERCIAL_TYPES, PROPERTY_TYPES, CONDITIONS, SUITABLE, type PropertyType } from '@/data/commercial';
import { AREAS, areaByName } from '@/data/geo';
import LocalityTypeahead from '@/components/LocalityTypeahead';
import { distanceKm } from '@/lib/format';
import ListingCard from '@/components/ListingCard';
import { cn, formatINR } from '@/lib/format';
import { FEATURES } from '@/config/brand';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => <div className="grid h-full place-items-center bg-ink-100 text-sm text-ink-400">Loading map…</div> });

type F = {
  seg: 'res' | 'com'; deal: 'buy' | 'rent'; kind: '' | 'builder' | 'owner'; ptype: string; locality: string; min: string; max: string; bhk: string;
  furnishing: string; tenant: string; pets: boolean; owner: boolean; verified: boolean; ds: boolean; sort: string;
  // commercial / plot filters
  amin: string; amax: string; psf: string; seats: string; cond: string; kva: string; suit: string; lockin: string; parking: boolean; zoned: boolean;
};
const EMPTY_EXTRA = { kind: '', ptype: '', min: '', max: '', bhk: '', furnishing: '', tenant: '', pets: false, ds: false, amin: '', amax: '', psf: '', seats: '', cond: '', kva: '', suit: '', lockin: '', parking: false, zoned: false } as const;

function fromParams(p: URLSearchParams): F {
  const g = (k: string) => p.get(k) || '';
  return {
    seg: g('seg') === 'com' ? 'com' : 'res',
    deal: (p.get('deal') as F['deal']) || 'rent',
    kind: (p.get('kind') as F['kind']) || '', ptype: g('ptype'),
    locality: g('locality'), min: g('min'), max: g('max'), bhk: g('bhk'), furnishing: g('furnishing'), tenant: g('tenant'),
    pets: p.get('pets') === '1', owner: p.get('owner') === '1', verified: p.get('verified') === '1', ds: p.get('ds') === '1',
    sort: g('sort') || 'relevance',
    amin: g('amin'), amax: g('amax'), psf: g('psf'), seats: g('seats'), cond: g('cond'), kva: g('kva'), suit: g('suit'), lockin: g('lockin'),
    parking: p.get('parking') === '1', zoned: p.get('zoned') === '1',
  };
}

function toParams(f: F) {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (typeof v === 'boolean') { if (v) p.set(k, '1'); }
    else if (v && !(k === 'sort' && v === 'relevance') && !(k === 'seg' && v === 'res')) p.set(k, v);
  });
  return p.toString();
}

const psf = (l: Listing) => (l.space ? l.space.ratePsf : l.price / l.areaSqft);

function apply(f: F): Listing[] {
  const seg = f.seg === 'com' ? 'commercial' : 'residential';
  let r = LISTINGS.filter((l) => l.segment === seg && l.deal === f.deal);
  if (f.kind) r = r.filter((l) => l.kind === f.kind);
  if (f.ptype) r = r.filter((l) => l.propertyType === f.ptype);
  if (f.locality) r = r.filter((l) => l.locality === f.locality);
  if (f.min) r = r.filter((l) => l.price >= +f.min);
  if (f.max) r = r.filter((l) => l.price <= +f.max);
  if (f.bhk) r = r.filter((l) => (+f.bhk >= 4 ? l.bhk >= 4 : l.bhk === +f.bhk));
  if (f.furnishing) r = r.filter((l) => !l.space && l.furnishing === f.furnishing);
  if (f.tenant && f.deal === 'rent' && seg === 'residential') r = r.filter((l) => l.tenantType === f.tenant || l.tenantType === 'any');
  if (f.pets) r = r.filter((l) => l.pets);
  if (f.owner) r = r.filter((l) => l.kind === 'owner');
  if (f.verified) r = r.filter((l) => l.verified);
  if (f.ds && f.deal === 'rent') r = r.filter((l) => l.depositSafe);
  if (f.amin) r = r.filter((l) => l.areaSqft >= +f.amin);
  if (f.amax) r = r.filter((l) => l.areaSqft <= +f.amax);
  if (f.psf) r = r.filter((l) => psf(l) <= +f.psf);
  if (f.seats) r = r.filter((l) => (l.space?.seats ?? 0) >= +f.seats);
  if (f.cond) r = r.filter((l) => l.space?.condition === f.cond);
  if (f.kva) r = r.filter((l) => (l.space?.powerKva ?? 0) >= +f.kva);
  if (f.suit) r = r.filter((l) => l.space?.suitableFor.includes(f.suit as never));
  if (f.lockin) r = r.filter((l) => (l.space?.lockInMonths ?? 0) <= +f.lockin);
  if (f.parking) r = r.filter((l) => (l.space?.carParking ?? 0) > 0);
  if (f.zoned) r = r.filter((l) => l.space?.zoningOk);
  const s = [...r];
  if (f.sort === 'price-asc') s.sort((a, b) => a.price - b.price);
  if (f.sort === 'price-desc') s.sort((a, b) => b.price - a.price);
  if (f.sort === 'psf-asc') s.sort((a, b) => psf(a) - psf(b));
  if (f.sort === 'area-desc') s.sort((a, b) => b.areaSqft - a.areaSqft);
  if (f.sort === 'newest') s.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  if (f.sort === 'value') s.sort((a, b) => a.price / a.truePrice - b.price / b.truePrice);
  // relevance: Proof first, then optional owner perks (Verified Owner, Deposit Safe Owner) rank higher
  const rank = (l: Listing) => Number(l.verified) * 4 + Number(l.verification.ownerDoc) * 2 + Number(l.depositSafe) * 2;
  if (f.sort === 'relevance') s.sort((a, b) => rank(b) - rank(a));
  return s;
}

const PRICE = {
  res: { rent: [10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000], buy: [3000000, 5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000] },
  com: { rent: [50000, 100000, 200000, 300000, 500000, 1000000, 2000000, 3000000], buy: [5000000, 10000000, 20000000, 50000000, 100000000, 200000000, 300000000] },
};
const AREA_STEPS = [500, 1000, 2500, 5000, 10000, 25000, 50000];
const PSF_STEPS = { rent: [25, 50, 75, 100, 150, 200, 300], buy: [3000, 5000, 8000, 12000, 20000, 30000] };

function Toggle({ on, onClick, icon: Icon, children }: { on: boolean; onClick: () => void; icon: any; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn('flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition', on ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300')}>
      <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{children}</span>
      <span className={cn('relative h-5 w-9 shrink-0 rounded-full transition', on ? 'bg-brand-600' : 'bg-ink-200')}><span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition', on ? 'left-[18px]' : 'left-0.5')} /></span>
    </button>
  );
}

function Chips({ value, options, onPick, label }: { value: string; options: [string, string][]; onPick: (v: string) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onPick(v)} aria-pressed={value === v} className={cn('chip border px-3 py-1.5 text-sm', value === v ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600')}>{l}</button>
      ))}
    </div>
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
    let next = { ...f, ...patch };
    if ((patch.deal && patch.deal !== f.deal) || (patch.seg && patch.seg !== f.seg)) { next.min = ''; next.max = ''; next.psf = ''; }
    if (patch.seg && patch.seg !== f.seg) next = { ...next, ...EMPTY_EXTRA };
    setF(next);
    router.replace(`/search/?${toParams(next)}`, { scroll: false });
  };
  const com = f.seg === 'com';
  const plot = f.ptype === 'res-plot';
  const results = useMemo(() => apply(f), [f]);
  // locality with no sample listings: suggest the nearest sample listings (same filters, any locality)
  const area = f.locality ? areaByName(f.locality) : undefined;
  const nearby = useMemo(() => {
    if (results.length || !area) return [];
    return apply({ ...f, locality: '' }).map((l) => ({ l, km: distanceKm(area.coord, l.coord) })).sort((a, b) => a.km - b.km).slice(0, 6);
  }, [results.length, area, f]);
  const shown = results.length ? results : nearby.map((n) => n.l);
  const prices = PRICE[f.seg][f.deal];
  const segCount = LISTINGS.filter((l) => l.segment === (com ? 'commercial' : 'residential')).length;
  const segLocalities = new Set(LISTINGS.filter((l) => l.segment === (com ? 'commercial' : 'residential')).map((l) => l.locality)).size;
  const showSeats = com && (!f.ptype || PROPERTY_TYPES[f.ptype as PropertyType]?.seats);

  const heading = (() => {
    if (com) {
      const what = f.ptype ? PROPERTY_TYPES[f.ptype as PropertyType].plural : 'commercial spaces';
      return `${results.length} ${what} ${f.deal === 'rent' ? 'for lease' : 'for sale'}`;
    }
    if (plot) return `${results.length} residential plots for sale`;
    return `${results.length} ${f.kind === 'builder' ? 'new projects' : f.deal === 'rent' ? 'homes for rent' : 'homes for sale'}`;
  })();

  const filters = (
    <div className="space-y-5">
      <div>
        <span className="label">Property segment</span>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1" role="group" aria-label="Property segment">
          {([['res', 'Residential', Home], ['com', 'Commercial', Building2]] as const).map(([k, t, I]) => (
            <button key={k} onClick={() => update({ seg: k })} aria-pressed={f.seg === k} className={cn('flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold', f.seg === k ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}><I className="h-4 w-4" />{t}</button>
          ))}
        </div>
      </div>
      <div>
        <span className="label">Looking to</span>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1" role="group" aria-label="Deal">
          {(['rent', 'buy'] as const).map((d) => (
            <button key={d} onClick={() => update({ deal: d, ...(d === 'rent' && plot ? { ptype: '' } : {}) })} aria-pressed={f.deal === d} className={cn('rounded-lg py-2 text-sm font-semibold', f.deal === d ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}>{d === 'rent' ? (com ? 'Lease / Rent' : 'Rent') : 'Buy'}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="loc">Locality</label>
        <div className="input py-1.5 focus-within:border-brand-500"><LocalityTypeahead id="loc" value={f.locality} onChange={(v) => update({ locality: v })} allLabel="All Bengaluru" placeholder="Type a locality" showIcon={false} inputClassName="py-1" /></div>
        <p className="mt-1 text-[11px] text-ink-400">{AREAS.length} localities · try “ORR”, “E City”, “Peenya”</p>
      </div>
      {com ? (
        <div>
          <span className="label">Property type</span>
          <Chips label="Property type" value={f.ptype} onPick={(v) => update({ ptype: v, seats: '' })} options={[['', 'All'], ...COMMERCIAL_TYPES.map((t) => [t, PROPERTY_TYPES[t].label] as [string, string])]} />
        </div>
      ) : f.deal === 'buy' && (
        <div>
          <span className="label">Property type</span>
          <Chips label="Property type" value={f.ptype} onPick={(v) => update({ ptype: v, bhk: '', furnishing: '' })} options={[['', 'All'], ['apartment', 'Homes'], ['res-plot', 'Residential plots / land']]} />
        </div>
      )}
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
      {(com || plot) && (
        <>
          <div>
            <span className="label">{plot || f.ptype === 'comm-land' ? 'Plot area (sq ft)' : 'Area (sq ft, super built-up)'}</span>
            <div className="grid grid-cols-2 gap-2">
              <select className="input" value={f.amin} onChange={(e) => update({ amin: e.target.value })} aria-label="Min area">
                <option value="">Min</option>{AREA_STEPS.map((a) => <option key={a} value={a}>{a.toLocaleString('en-IN')}</option>)}
              </select>
              <select className="input" value={f.amax} onChange={(e) => update({ amax: e.target.value })} aria-label="Max area">
                <option value="">Max</option>{AREA_STEPS.map((a) => <option key={a} value={a}>{a.toLocaleString('en-IN')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="psf">{f.deal === 'rent' ? 'Max rent per sq ft / month' : 'Max price per sq ft'}</label>
            <select id="psf" className="input" value={f.psf} onChange={(e) => update({ psf: e.target.value })}>
              <option value="">Any</option>{PSF_STEPS[f.deal].map((p) => <option key={p} value={p}>Up to ₹{p.toLocaleString('en-IN')}{f.deal === 'rent' ? '/sqft/mo' : '/sqft'}</option>)}
            </select>
          </div>
        </>
      )}
      {com && (
        <>
          {showSeats && (
            <div>
              <label className="label" htmlFor="seats">Seats (offices)</label>
              <select id="seats" className="input" value={f.seats} onChange={(e) => update({ seats: e.target.value })}>
                <option value="">Any</option>{[10, 25, 50, 100, 200].map((n) => <option key={n} value={n}>{n}+ seats</option>)}
              </select>
            </div>
          )}
          <div>
            <span className="label">Condition</span>
            <Chips label="Condition" value={f.cond} onPick={(v) => update({ cond: v })} options={[['', 'Any'], ...Object.entries(CONDITIONS)] as [string, string][]} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label" htmlFor="kva">Power load</label>
              <select id="kva" className="input" value={f.kva} onChange={(e) => update({ kva: e.target.value })}>
                <option value="">Any</option>{[10, 25, 50, 100, 250].map((n) => <option key={n} value={n}>{n}+ kVA</option>)}
              </select>
            </div>
            {f.deal === 'rent' && (
              <div>
                <label className="label" htmlFor="lockin">Lock-in</label>
                <select id="lockin" className="input" value={f.lockin} onChange={(e) => update({ lockin: e.target.value })}>
                  <option value="">Any</option>{[12, 24, 36].map((n) => <option key={n} value={n}>≤ {n} months</option>)}
                </select>
              </div>
            )}
          </div>
          <div>
            <span className="label">Suitable for</span>
            <Chips label="Suitable for" value={f.suit} onPick={(v) => update({ suit: v })} options={[['', 'Any'], ...SUITABLE.map((s) => [s, s] as [string, string])]} />
          </div>
        </>
      )}
      {!com && !plot && (
        <>
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
            <Chips label="Furnishing" value={f.furnishing} onPick={(v) => update({ furnishing: v })} options={[['', 'Any'], ['full', 'Full'], ['semi', 'Semi'], ['unfurnished', 'Unfurnished']]} />
          </div>
        </>
      )}
      {!com && f.deal === 'rent' && (
        <div>
          <span className="label">Tenant type</span>
          <Chips label="Tenant type" value={f.tenant} onPick={(v) => update({ tenant: v })} options={[['', 'Any'], ['family', 'Family'], ['bachelor', 'Bachelor']]} />
        </div>
      )}
      {!com && f.deal === 'buy' && !plot && (
        <div>
          <span className="label">Listing type</span>
          <Chips label="Listing type" value={f.kind} onPick={(v) => update({ kind: v as F['kind'] })} options={[['', 'All'], ['owner', 'Resale (owner)'], ['builder', 'New projects']]} />
        </div>
      )}
      <div className="space-y-2">
        <Toggle on={f.verified} onClick={() => update({ verified: !f.verified })} icon={ShieldCheck}>{FEATURES.proof} only</Toggle>
        <Toggle on={f.owner} onClick={() => update({ owner: !f.owner })} icon={User}>Owner listings only</Toggle>
        {com && <Toggle on={f.parking} onClick={() => update({ parking: !f.parking })} icon={Car}>Car parking included</Toggle>}
        {(com || plot) && <Toggle on={f.zoned} onClick={() => update({ zoned: !f.zoned })} icon={BadgeCheck}>Zoning / conversion in place</Toggle>}
        {!com && f.deal === 'rent' && <Toggle on={f.ds} onClick={() => update({ ds: !f.ds })} icon={Wallet}>Deposit Safe owners</Toggle>}
        {!com && f.deal === 'rent' && <Toggle on={f.pets} onClick={() => update({ pets: !f.pets })} icon={PawPrint}>Pets allowed</Toggle>}
      </div>
      <button onClick={() => update({ ...EMPTY_EXTRA, locality: '', owner: false, verified: false })} className="btn-ghost w-full"><RotateCcw className="h-4 w-4" />Reset filters</button>
    </div>
  );

  return (
    <div className="container-x py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{heading} {f.locality ? `in ${f.locality}` : 'in Bengaluru'}</h1>
          <p className="text-sm text-ink-500">Showing <strong>sample listings</strong> · prototype data, not real {com ? 'spaces' : 'homes'} or prices</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input w-auto py-2" value={f.sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort">
            <option value="relevance">{FEATURES.proof} first</option>
            <option value="value">Best value (vs True Price)</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="psf-asc">{f.deal === 'rent' && com ? 'Rent per sq ft: low to high' : 'Price per sq ft: low to high'}</option>
            {com && <option value="area-desc">Area: largest first</option>}
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
        <aside className="hidden lg:block"><div className="card p-5">{filters}</div></aside>

        <section className={cn(view === 'map' && 'hidden xl:block')}>
          {results.length === 0 && (
            <div className="card mb-5 p-6 text-center">
              <MapPinOff className="mx-auto h-7 w-7 text-ink-400" />
              <p className="mt-2 font-semibold">{area ? `No sample listings in ${area.name} yet` : 'No sample listings match these filters.'}</p>
              <p className="mt-1 text-sm text-ink-500">{area ? `This prototype has ${segCount} sample ${com ? 'commercial listings' : 'residential listings'} across ${segLocalities} localities. ` : 'Try widening your budget or removing a filter.'}{nearby.length > 0 && 'Here are the nearest sample listings (straight-line distance from the approximate locality centre).'}</p>
              {area && <button onClick={() => update({ locality: '' })} className="btn-ghost mt-3">Search all of Bengaluru</button>}
            </div>
          )}
          {shown.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {shown.map((l) => (
                <div key={l.id} className="relative">
                  {!results.length && <span className="chip absolute -top-2 right-3 z-10 bg-ink-900 text-white">~{distanceKm(area!.coord, l.coord).toFixed(1)} km away · {l.locality}</span>}
                  <ListingCard l={l} active={active === l.id} onHover={setActive} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={cn('xl:block', view === 'list' && 'hidden')}>
          <div className="card sticky top-20 h-[70vh] overflow-hidden xl:h-[calc(100vh-7rem)]">
            <MapView key={area && !results.length ? `c-${area.name}` : 'm'} listings={shown} activeId={active} onSelect={setActive} center={area && !results.length ? area.coord : undefined} zoom={12} />
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
