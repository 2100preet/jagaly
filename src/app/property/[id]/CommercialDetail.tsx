'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  ArrowLeft, Heart, Share2, MapPin, Maximize2, Building, Users, FileCheck2, Zap, CloudRain, Landmark, Check, Smartphone, Scale, Globe2, Phone, Sparkles,
  Car, Info, PlayCircle, Ruler, Lock, Wallet, Store, Briefcase, Route, FileBadge, Truck, Footprints,
} from 'lucide-react';
import { getListing, LISTINGS } from '@/data/listings';
import { typeMeta, dealLabel, CONDITIONS, commercialRate } from '@/data/commercial';
import { TECH_PARKS, AREAS, areaByName, LOCALITIES } from '@/data/geo';
import { distanceKm, formatINR, formatPrice, fullINR, cn } from '@/lib/format';
import PropertyArt from '@/components/PropertyArt';
import { VerifiedBadge, KindBadge, priceVerdict, VerifiedOwnerBadge } from '@/components/Badges';
import { EmiCalculator, LeaseCalculator } from '@/components/Calculators';
import VisitPicker from '@/components/VisitPicker';
import ListingCard from '@/components/ListingCard';
import { BRAND, FEATURES } from '@/config/brand';
import FloodCard from '@/components/reality/FloodCard';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => <div className="h-full bg-ink-100" /> });

function Section({ id, title, subtitle, children, tag }: { id?: string; title: string; subtitle?: string; children: React.ReactNode; tag?: string }) {
  return (
    <section id={id} className="card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div><h2 className="font-display text-lg font-bold">{title}</h2>{subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}</div>
        {tag && <span className="chip bg-ink-100 text-ink-500">{tag}</span>}
      </div>
      {children}
    </section>
  );
}
function scoreTone(s: number) {
  if (s >= 8) return { t: 'Low risk', c: 'bg-brand-500', tx: 'text-brand-700' };
  if (s >= 6) return { t: 'Moderate', c: 'bg-brand-300', tx: 'text-brand-700' };
  if (s >= 4) return { t: 'Watch out', c: 'bg-coral-400', tx: 'text-coral-700' };
  return { t: 'High risk', c: 'bg-red-500', tx: 'text-red-700' };
}

// Approximate logistics points for warehouses / industrial / land (straight-line estimates only).
const LOGISTICS: { name: string; coord: [number, number] }[] = [
  { name: 'Kempegowda Intl Airport (cargo)', coord: [13.1989, 77.7068] },
  { name: 'NH-48 Tumakuru Road (Nelamangala)', coord: [13.099, 77.393] },
  { name: 'NH-75 Old Madras Road (Hoskote)', coord: [13.0707, 77.7982] },
  { name: 'NH-44 Hosur Road (Attibele)', coord: [12.779, 77.77] },
  { name: 'Whitefield rail container depot (approx.)', coord: [12.983, 77.724] },
];
const HUBS = ['Koramangala', 'HSR Layout', 'Whitefield', 'Electronic City', 'Hebbal', 'Indiranagar', 'Marathahalli', 'Jayanagar'];

export default function CommercialDetail({ id }: { id: string }) {
  const l = getListing(id)!;
  const sp = l.space!;
  const meta = typeMeta(l);
  const v = priceVerdict(l);
  const area = areaByName(l.locality);
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [abroad, setAbroad] = useState(false);
  const lease = l.deal === 'rent';
  const isLand = !!meta.land;
  const unit = lease ? '/sqft/mo' : '/sqft';
  const fmtPsf = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 1 })}${unit}`;

  // Access section depends on the use
  const road = (km: number, speed: number) => Math.round(((km * 1.35) / speed) * 60 + 5);
  const logisticsMode = meta.art === 'shed' || (isLand && l.segment === 'commercial');
  const access = logisticsMode
    ? LOGISTICS.map((p) => { const km = distanceKm(l.coord, p.coord); return { name: p.name, km, mins: road(km, 28) }; })
    : meta.art === 'shop'
      ? HUBS.map((h) => areaByName(h)!).map((a) => { const km = distanceKm(l.coord, a.coord); return { name: `${a.name} (residential catchment)`, km, mins: road(km, 18) }; })
      : [...TECH_PARKS.map((p) => ({ name: p.name, coord: p.coord })), ...HUBS.slice(0, 4).map((h) => ({ name: `${h} (talent catchment)`, coord: areaByName(h)!.coord }))]
        .map((p) => { const km = distanceKm(l.coord, p.coord); return { name: p.name, km, mins: road(km, 18) }; });
  access.sort((a, b) => a.km - b.km);
  const within3 = AREAS.filter((a) => distanceKm(a.coord, l.coord) <= 3).length;

  const risks = [
    { k: 'Power backup', s: sp.truth.power, i: Zap, d: sp.powerKva ? `${sp.powerKva} kVA sanctioned load · DG backup (sample)` : 'Power at plot boundary (sample)' },
    { k: 'Flooding', s: sp.truth.flooding, i: CloudRain, d: 'Storm-drain and lake proximity, past monsoon reports' },
    { k: 'Access road', s: sp.truth.access, i: logisticsMode ? Truck : Route, d: logisticsMode ? 'Truck access, road width, highway distance' : `Road width${sp.frontageFt ? `, ${sp.frontageFt} ft frontage` : ''}, metro / bus access` },
    { k: 'Zoning / conversion', s: sp.truth.zoning, i: Landmark, d: sp.zoning },
    isLand ? { k: 'Title & khata', s: sp.truth.occc, i: FileBadge, d: `${l.khataType} · title checked at deal stage` } : { k: 'OC / CC status', s: sp.truth.occc, i: FileBadge, d: sp.ocStatus },
  ];
  const truthScore = risks.reduce((a, r) => a + r.s, 0) / risks.length;
  const pos = Math.max(0, Math.min(100, 50 + v.d * 250));
  const similar = LISTINGS.filter((x) => x.id !== l.id && x.segment === l.segment && x.space && (x.propertyType === l.propertyType || x.locality === l.locality)).slice(0, 3);
  const tier = area?.tier ?? 3;
  const resBuy = LOCALITIES.find((x) => x.name === l.locality)?.buyPerSqft ?? 8000;
  const yieldPct = !lease && !isLand ? ((commercialRate(l.propertyType, tier, 'rent', resBuy) * 12) / sp.ratePsf) * 100 : null;

  const facts: [any, string, string][] = [
    [meta.art === 'shop' ? Store : meta.art === 'shed' ? Truck : Briefcase, 'Property type', meta.label],
    ...(isLand ? [[Maximize2, 'Plot area', `${sp.superBuiltUpSqft.toLocaleString('en-IN')} sq ft`]] as [any, string, string][]
      : [[Maximize2, 'Carpet area', `${sp.carpetSqft?.toLocaleString('en-IN') ?? '—'} sq ft`], [Maximize2, 'Super built-up', `${sp.superBuiltUpSqft.toLocaleString('en-IN')} sq ft`]] as [any, string, string][]),
    [Wallet, lease ? 'Rent per sq ft' : 'Price per sq ft', fmtPsf(sp.ratePsf)],
    ...(sp.seats ? [[Users, 'Seats', `${sp.seats}`]] as [any, string, string][] : []),
    [Building, isLand ? 'Plot' : 'Floor', l.floor],
    ...(sp.frontageFt ? [[Ruler, 'Frontage', `${sp.frontageFt} ft`]] as [any, string, string][] : []),
    ...(sp.powerKva ? [[Zap, 'Power load', `${sp.powerKva} kVA`]] as [any, string, string][] : []),
    [Car, 'Parking', sp.parkingNote],
    ...(sp.condition ? [[Check, 'Condition', CONDITIONS[sp.condition]]] as [any, string, string][] : []),
    ...(lease ? [[Lock, 'Lock-in', `${sp.lockInMonths} months`], [Wallet, 'Security deposit', `${sp.depositMonths} months · ${formatINR(l.deposit ?? 0)}`]] as [any, string, string][] : []),
    [Wallet, 'Maintenance / CAM', sp.camPsf ? `₹${sp.camPsf}/sqft/mo · ${fullINR(l.maintenance)}/mo` : lease ? 'Included in rent' : 'None'],
    ...(lease ? [[Info, 'Escalation', `${sp.escalationPct}% per year`]] as [any, string, string][] : []),
    [Landmark, 'Zoning / land use', sp.zoning],
    ...(!isLand ? [[FileBadge, 'OC / CC', sp.ocStatus]] as [any, string, string][] : []),
  ];

  return (
    <div className="pb-10">
      <div className="container-x pt-4">
        <Link href={`/search/?${l.segment === 'commercial' ? 'seg=com&' : ''}deal=${l.deal}${isLand && l.segment === 'residential' ? '&ptype=res-plot' : ''}`} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"><ArrowLeft className="h-4 w-4" />Back to results</Link>
      </div>

      <div className="container-x mt-3">
        <div className="grid gap-2 overflow-hidden rounded-3xl md:h-[400px] md:grid-cols-[2fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:h-full">
            <PropertyArt hue={l.hue} kind={l.kind} bhk={0} variant={meta.art} className="absolute inset-0 h-full w-full" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2"><VerifiedBadge l={l} size="lg" /><VerifiedOwnerBadge l={l} /></div>
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">Sample listing · illustration</div>
            {l.verified && <button onClick={() => setShowVideo(true)} className="absolute bottom-4 right-4 btn bg-white/95 text-ink-900 shadow-lift hover:bg-white"><PlayCircle className="h-5 w-5 text-coral-600" />Watch verified walk-through</button>}
          </div>
          <div className="hidden min-h-0 grid-rows-2 gap-2 md:grid">
            <div className="relative overflow-hidden"><PropertyArt hue={(l.hue + 30) % 360} kind={l.kind} bhk={0} variant={meta.art} className="absolute inset-0 h-full w-full" /></div>
            <div className="relative overflow-hidden"><PropertyArt hue={(l.hue + 60) % 360} kind={l.kind} bhk={0} variant={meta.art} className="absolute inset-0 h-full w-full" /><div className="absolute inset-0 grid place-items-center bg-ink-900/40 text-sm font-semibold text-white">+ floor plan & 10 verified photos</div></div>
          </div>
        </div>
      </div>

      <div className="container-x mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2"><KindBadge l={l} /><span className="chip bg-indigo-50 text-indigo-700">{l.segment === 'commercial' ? 'Commercial' : 'Residential plot'}</span><span className="chip bg-ink-100 text-ink-600">{dealLabel(l)}</span>{sp.condition && <span className="chip bg-ink-100 text-ink-600">{CONDITIONS[sp.condition]}</span>}</div>
            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{l.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-ink-500"><MapPin className="h-4 w-4" />{l.locality}, Bengaluru{l.builder && ` · by ${l.builder}`}</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div className="font-display text-3xl font-extrabold text-ink-900">{formatPrice(l.price, l.deal)}</div>
              <div className="text-sm text-ink-500">{fmtPsf(sp.ratePsf)} on {sp.superBuiltUpSqft.toLocaleString('en-IN')} sq ft{lease && sp.depositMonths ? ` · ${sp.depositMonths} months’ deposit` : ''}{sp.camPsf ? ` · CAM ₹${sp.camPsf}/sqft/mo` : ''}</div>
              <div className="ml-auto flex gap-2">
                <button onClick={() => setSaved(!saved)} className="btn-ghost px-3" aria-label="Save"><Heart className={cn('h-4 w-4', saved && 'fill-red-500 text-red-500')} /></button>
                <button onClick={() => navigator.clipboard?.writeText(location.href)} className="btn-ghost px-3" aria-label="Share"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <Section title="Space details" tag="Sample data">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {facts.map(([I, k, val]) => (
                <div key={k} className="flex items-start gap-2.5"><I className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /><div><div className="text-[11px] uppercase tracking-wide text-ink-400">{k}</div><div className="text-sm font-semibold">{val}</div></div></div>
              ))}
            </div>
            {sp.suitableFor.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4"><span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Suitable for</span>{sp.suitableFor.map((s) => <span key={s} className="chip bg-brand-50 text-brand-700">{s}</span>)}</div>}
          </Section>

          <Section title={FEATURES.proof} subtitle="Same tiers as homes. No sale deed needed to list" tag="Sample data">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [Smartphone, 'Tier 1 · Required to list', 'Phone OTP + live in-app video walk-through of the space with GPS within 50 m of the listed address', l.verification.otp && l.verification.video && l.verification.geotag, 'OTP done · video pending'],
                [FileCheck2, 'Tier 2 · Verified Owner (optional)', 'Owner name matched to a recent property tax receipt or electricity bill. Kept private, deletable anytime', l.verification.ownerDoc, l.kind === 'builder' ? 'N/A · developer' : 'Not opted in'],
                [Scale, 'Tier 3 · At deal stage', lease ? 'Before you sign: title, OC/CC and zoning checked by partner lawyers, lease deed reviewed' : 'Before any token amount: title, conversion/zoning and approvals checked by partner lawyers', false, 'When you proceed'],
              ].map(([I, t, d, ok, pending]: any) => (
                <div key={t} className={cn('rounded-xl border p-4', ok ? 'border-brand-200 bg-brand-50/60' : 'border-ink-200 bg-ink-50')}>
                  <div className="flex items-center justify-between"><I className={cn('h-5 w-5', ok ? 'text-brand-600' : 'text-ink-400')} /><span className={cn('chip', ok ? 'bg-brand-600 text-white' : 'bg-ink-200 text-ink-500')}>{ok ? <><Check className="h-3 w-3" />Done</> : pending}</span></div>
                  <div className="mt-2 text-sm font-semibold">{t}</div><div className="text-xs text-ink-500">{d}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title={`${FEATURES.price} · per sq ft`} subtitle="Sample model estimate vs asking, on the same area basis" tag="Sample model">
            <div className="grid gap-5 sm:grid-cols-[1fr_1.3fr] sm:items-center">
              <div>
                <div className={cn('inline-flex rounded-xl border px-3 py-1.5 text-sm font-bold', v.tone)}>{v.label} · {v.d > 0 ? '+' : ''}{(v.d * 100).toFixed(1)}%</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-ink-500">Asking</div><div className="font-display text-xl font-bold">{fmtPsf(sp.ratePsf)}</div><div className="text-xs text-ink-500">{formatPrice(l.price, l.deal)}</div></div>
                  <div><div className="text-ink-500">True Price</div><div className="font-display text-xl font-bold text-brand-700">{fmtPsf(sp.trueRatePsf)}</div><div className="text-xs text-ink-500">{formatPrice(l.truePrice, l.deal)}</div></div>
                </div>
              </div>
              <div>
                <div className="relative h-3 rounded-full bg-gradient-to-r from-brand-500 via-brand-300 via-50% to-red-500"><div className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-ink-900 ring-2 ring-white" style={{ left: `${pos}%` }} /></div>
                <div className="mt-2 flex justify-between text-[11px] text-ink-500"><span>Good deal</span><span>Fair</span><span>Overpriced</span></div>
                <p className="mt-3 text-xs text-ink-500">Based on {8 + (l.hue % 20)} comparable sample {meta.plural} in and around {l.locality}, adjusted for {isLand ? 'frontage and conversion status' : 'condition, floor, power load and parking'}. Estimate only.{yieldPct ? ` Indicative gross rental yield if leased at a sample market rate: ~${yieldPct.toFixed(1)}%.` : ''}</p>
              </div>
            </div>
          </Section>

          <Section title={logisticsMode ? 'Logistics access' : meta.art === 'shop' ? 'Footfall & catchment' : 'Commute & talent catchment'} subtitle="Straight-line distance × 1.35 road factor at assumed peak speeds" tag="Estimate">
            {meta.art === 'shop' && sp.footfall && (
              <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl bg-coral-50 p-4">
                <Footprints className="h-6 w-6 text-coral-600" />
                <div><div className="text-xs uppercase tracking-wide text-coral-700">Footfall index (sample)</div><div className="font-display text-2xl font-extrabold text-coral-800">{sp.footfall}<span className="text-sm text-coral-600">/10</span></div></div>
                <div className="text-sm text-coral-800">{within3} searchable localities within 3 km · evening and weekend peaks typical for {l.locality} (sample).</div>
              </div>
            )}
            <div className="space-y-2.5">
              {access.slice(0, 6).map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-36 shrink-0 text-sm font-medium sm:w-60">{c.name}</div>
                  <div className="h-2 flex-1 rounded-full bg-ink-100"><div className={cn('h-full rounded-full', c.mins <= 30 ? 'bg-brand-500' : c.mins <= 60 ? 'bg-coral-400' : 'bg-red-400')} style={{ width: `${Math.min(100, (c.mins / 120) * 100)}%` }} /></div>
                  <div className="w-32 shrink-0 whitespace-nowrap text-right text-sm"><span className="font-semibold">~{c.mins} min</span> <span className="text-ink-400">· {c.km.toFixed(1)} km</span></div>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{logisticsMode ? 'Truck speeds assumed ~28 km/h; city entry restrictions for heavy vehicles may apply.' : 'Car / cab speeds assumed ~18 km/h at peak.'} Points are approximate. Not live traffic.</p>
          </Section>

          <Section id="flood" title="Flood & Monsoon Check" subtitle="BBMP-listed flood-prone, vulnerable and low-lying spots near this pin" tag="Real public data">
            <FloodCard coord={l.coord} place={`${l.society}, ${l.locality}`} />
          </Section>

          <Section id="truth" title="Property Truth Score" subtitle="Power backup, flooding, access road, zoning/conversion, OC/CC: higher = safer (out of 10)" tag="Sample scores">
            <div className="mb-5 flex flex-wrap items-center gap-5 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 p-5 text-white">
              <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-coral-400 bg-white/10"><div className="text-center"><div className="font-display text-2xl font-extrabold leading-none">{truthScore.toFixed(1)}</div><div className="text-[10px] text-brand-100">/ 10</div></div></div>
              <div className="flex-1">
                <div className="font-display text-lg font-bold">{truthScore >= 7.5 ? 'Strong property' : truthScore >= 6 ? 'Good, with a few watch-outs' : 'Do your homework'}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  <span className={cn('chip', sp.zoningOk ? 'bg-white/15' : 'bg-coral-600')}>{sp.zoningOk ? 'Zoning / conversion in place' : 'Conversion pending'}</span>
                  {!isLand && <span className={cn('chip', sp.ocStatus === 'OC received' ? 'bg-white/15' : 'bg-coral-600')}>{sp.ocStatus}</span>}
                  {sp.powerKva && <span className="chip bg-white/15">{sp.powerKva} kVA</span>}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {risks.map((r) => { const t = scoreTone(r.s); return (
                <div key={r.k} className="rounded-xl border border-ink-200 p-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-semibold"><r.i className="h-4 w-4 text-brand-600" />{r.k}</div><div className="text-right"><span className="font-display text-xl font-extrabold">{r.s}</span><span className="text-xs text-ink-400">/10</span></div></div>
                  <div className="mt-2 h-1.5 rounded-full bg-ink-100"><div className={cn('h-full rounded-full', t.c)} style={{ width: `${r.s * 10}%` }} /></div>
                  <div className="mt-2 flex justify-between gap-2 text-xs"><span className="text-ink-500">{r.d}</span><span className={cn('shrink-0 font-semibold', t.tx)}>{t.t}</span></div>
                </div>
              ); })}
            </div>
            {l.titleFlags.length > 0 && <div className="mt-3 rounded-xl border border-coral-200 bg-coral-50 p-3 text-sm text-coral-800"><strong>Flags:</strong> {l.titleFlags.join(' · ')}</div>}
            <p className="mt-2 text-xs text-ink-400">All scores are sample data for the prototype. OC/CC, zoning and title are verified by partner lawyers at deal stage (Tier 3).</p>
          </Section>

          <Section title={lease ? 'Lease cost calculator' : 'Purchase calculator'} subtitle={lease ? `Total cost with ${sp.escalationPct}% yearly escalation, deposit and CAM` : 'Loan EMI for this property (commercial loan rates are usually higher)'}>
            {lease ? <LeaseCalculator rent={l.price} areaSqft={sp.superBuiltUpSqft} escalation={sp.escalationPct} depositMonths={sp.depositMonths} camPsf={sp.camPsf} lockInMonths={sp.lockInMonths} /> : <EmiCalculator price={l.price} />}
          </Section>

          <Section title="About this space">
            <p className="text-sm leading-relaxed text-ink-700">{l.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{l.amenities.map((a) => <span key={a} className="chip border border-ink-200 bg-white text-ink-700"><Check className="h-3 w-3 text-brand-600" />{a}</span>)}</div>
          </Section>

          <Section title="Location" subtitle={`${l.society}, ${l.locality} (approximate pin)`}>
            <div className="h-72 overflow-hidden rounded-xl"><MapView listings={[l]} center={l.coord} zoom={14} /></div>
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-coral-100 font-bold text-coral-700">{l.kind === 'owner' ? 'O' : 'D'}</span>
              <div><div className="font-semibold">{l.kind === 'owner' ? 'Owner (name hidden)' : l.builder}</div><div className="text-xs text-ink-500">{l.kind === 'owner' ? 'Responds in ~4 hrs · No brokerage' : 'Developer (sample)'}</div></div>
            </div>
            <button onClick={() => setRevealed(true)} className="btn-ghost mt-4 w-full"><Phone className="h-4 w-4" />{revealed ? '+91 80 4718 •••• (masked line)' : 'Call via masked number'}</button>
            {revealed && <p className="mt-2 text-[11px] text-ink-500">Calls are routed through {BRAND.name}. Neither side sees the real number. (Demo)</p>}
          </div>
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between gap-2"><h3 className="font-display text-lg font-bold">Book a site visit</h3><button onClick={() => setAbroad(true)} className="chip bg-indigo-50 text-indigo-700 hover:bg-indigo-100"><Globe2 className="h-3.5 w-3.5" />Video visit from abroad</button></div>
            <VisitPicker listingId={l.id} title={l.title} abroad={abroad} deal="buy" />
          </div>
          <Link href="/pricing/#commercial" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Scale className="h-5 w-5 text-brand-600" /><div><div className="text-sm font-semibold">Leasing or buying for your business?</div><div className="text-xs text-ink-500">Lease deed, OC/CC and zoning checks at deal stage (draft plan)</div></div>
          </Link>
          <button onClick={() => window.dispatchEvent(new Event('gk-open-chat'))} className="card flex w-full items-center gap-3 p-4 text-left hover:shadow-lift">
            <Sparkles className="h-5 w-5 text-coral-500" /><div><div className="text-sm font-semibold">Ask AI about this space</div><div className="text-xs text-ink-500">“What will this cost over 5 years?” “Is the zoning OK for a clinic?”</div></div>
          </button>
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="container-x mt-12">
          <h2 className="h-section">Similar sample listings</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <ListingCard key={s.id} l={s} />)}</div>
        </div>
      )}

      {showVideo && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink-900/80 p-4" onClick={() => setShowVideo(false)}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-black" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <PropertyArt hue={l.hue} kind={l.kind} bhk={0} variant={meta.art} className="h-full w-full opacity-60" />
              <div className="absolute inset-0 grid place-items-center text-center text-white"><div><PlayCircle className="mx-auto h-16 w-16" /><div className="mt-2 font-semibold">Verified walk-through (demo placeholder)</div><div className="mt-1 text-xs text-white/70">Recorded {l.verification.verifiedOn} · GPS {l.coord[0].toFixed(4)}, {l.coord[1].toFixed(4)}</div></div></div>
            </div>
            <button onClick={() => setShowVideo(false)} className="w-full bg-white py-3 text-sm font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
