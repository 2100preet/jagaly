'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Maximize2, Sofa, Compass, Building, CalendarDays, PawPrint, Users, ShieldCheck, Video, FileCheck2,
  Droplets, CloudRain, Zap, Landmark, FileBadge, Star, Car, PlayCircle, Phone, Sparkles, Check, Smartphone, Lock, Scale, Wallet, Globe2,
} from 'lucide-react';
import { getListing, LISTINGS } from '@/data/listings';
import { TECH_PARKS, localityByName } from '@/data/geo';
import { distanceKm, formatINR, formatPrice, fullINR, cn } from '@/lib/format';
import PropertyArt from '@/components/PropertyArt';
import { VerifiedBadge, KindBadge, priceVerdict, DepositSafeBadge, VerifiedOwnerBadge } from '@/components/Badges';
import { EmiCalculator, RentVsBuy } from '@/components/Calculators';
import VisitPicker from '@/components/VisitPicker';
import ListingCard from '@/components/ListingCard';
import { BRAND, FEATURES } from '@/config/brand';
import { floodCheck, peakCommute } from '@/lib/reality';
import FloodCard from '@/components/reality/FloodCard';
import { WaterCard, PowerNetCard } from '@/components/reality/WaterPower';
import PeakCommute from '@/components/reality/PeakCommute';
import TrueCost from '@/components/reality/TrueCost';
import DepositFairness from '@/components/reality/DepositFairness';

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

export default function PropertyDetail({ id }: { id: string }) {
  const l = getListing(id)!;
  const loc = localityByName(l.locality);
  const v = priceVerdict(l);
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [tab, setTab] = useState<'emi' | 'rvb'>(l.deal === 'buy' ? 'emi' : 'rvb');
  const [showVideo, setShowVideo] = useState(false);
  const [dsRequested, setDsRequested] = useState(false);
  const [abroad, setAbroad] = useState(false);

  const commute = TECH_PARKS.map((p) => {
    const km = distanceKm(l.coord, p.coord);
    const pc = peakCommute(l.coord, p.coord);
    return { ...p, km, mins: pc.slots[0].mins };
  }).sort((a, b) => a.km - b.km);
  const flood = floodCheck(l.coord);
  const commuteScore = Math.max(1, Math.min(10, Math.round(11 - commute[0].mins / 8)));

  const risks = [
    { k: 'Commute', s: commuteScore, i: Car, d: `Nearest: ${commute[0].short} ~${commute[0].mins} min at 9 AM (estimate)` },
    { k: 'Water & tankers', s: l.risk.water, i: Droplets, d: 'Cauvery connection, borewell depth & tanker dependence' },
    { k: 'Flooding', s: Math.round(flood.score), i: CloudRain, d: flood.limitedData ? 'Outside BBMP flood-spot coverage · limited data' : `${flood.within1k} BBMP flood spot${flood.within1k === 1 ? '' : 's'} within 1 km (real public data)` },
    { k: 'Power cuts', s: l.risk.power, i: Zap, d: 'BESCOM outage frequency & society backup' },
    { k: 'e-Khata & title', s: l.risk.khata, i: FileBadge, d: `${l.khataType} · ${l.titleFlags.length ? `${l.titleFlags.length} title flag(s)` : 'no title flags'}` },
    ...(l.risk.rera !== undefined ? [{ k: 'RERA & delays', s: l.risk.rera, i: Landmark, d: `Registration, quarterly updates · delay ${l.reraDelayMonths ? `+${l.reraDelayMonths} mo` : 'none'}` }] : []),
  ];
  const truthScore = risks.reduce((a, r) => a + r.s, 0) / risks.length;
  const avgRating = l.reviews.reduce((a, r) => a + r.rating, 0) / l.reviews.length;
  const similar = LISTINGS.filter((x) => x.id !== l.id && !x.space && x.deal === l.deal && (x.locality === l.locality || x.bhk === l.bhk)).slice(0, 3);
  const equivBuy = l.deal === 'buy' ? l.price : Math.round((loc.buyPerSqft * l.areaSqft) / 100000) * 100000;
  const equivRent = l.deal === 'rent' ? l.price : Math.round((loc.rentPerSqft * l.areaSqft) / 500) * 500;

  // position marker on true-price scale (−20% … +20%)
  const pos = Math.max(0, Math.min(100, 50 + v.d * 250));

  return (
    <div className="pb-10">
      <div className="container-x pt-4">
        <Link href={`/search/?deal=${l.deal}`} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"><ArrowLeft className="h-4 w-4" />Back to results</Link>
      </div>

      {/* Gallery */}
      <div className="container-x mt-3">
        <div className="grid gap-2 overflow-hidden rounded-3xl md:h-[420px] md:grid-cols-[2fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:h-full">
            <PropertyArt hue={l.hue} kind={l.kind} bhk={l.bhk} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2"><VerifiedBadge l={l} size="lg" /><VerifiedOwnerBadge l={l} /><DepositSafeBadge l={l} size="lg" /></div>
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">Sample listing · illustration</div>
            {l.verified && (
              <button onClick={() => setShowVideo(true)} className="absolute bottom-4 right-4 btn bg-white/95 text-ink-900 shadow-lift hover:bg-white"><PlayCircle className="h-5 w-5 text-coral-600" />Watch verified walk-through</button>
            )}
          </div>
          <div className="hidden min-h-0 grid-rows-2 gap-2 md:grid">
            <div className="relative overflow-hidden"><PropertyArt hue={(l.hue + 30) % 360} kind={l.kind === 'owner' ? 'builder' : 'owner'} bhk={l.bhk} className="absolute inset-0 h-full w-full" /></div>
            <div className="relative overflow-hidden">
              <PropertyArt hue={(l.hue + 60) % 360} kind={l.kind} bhk={l.bhk + 1} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 grid place-items-center bg-ink-900/40 text-sm font-semibold text-white">+ 14 verified photos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2"><KindBadge l={l} /><span className="chip bg-ink-100 text-ink-600">{l.deal === 'rent' ? 'For rent' : 'For sale'}</span>{l.possession && <span className="chip bg-indigo-50 text-indigo-700">Possession: {l.possession}</span>}</div>
            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{l.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-ink-500"><MapPin className="h-4 w-4" />{l.society}, {l.locality}, Bengaluru{l.builder && ` · by ${l.builder}`}</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div className="font-display text-3xl font-extrabold text-ink-900">{formatPrice(l.price, l.deal)}</div>
              <div className="text-sm text-ink-500">
                {l.deal === 'rent' ? <>Deposit {fullINR(l.deposit!)} · Maintenance {fullINR(l.maintenance)}/mo</> : <>₹{Math.round(l.price / l.areaSqft).toLocaleString('en-IN')}/sqft · Maintenance {fullINR(l.maintenance)}/mo</>}
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={() => setSaved(!saved)} className="btn-ghost px-3" aria-label="Save"><Heart className={cn('h-4 w-4', saved && 'fill-red-500 text-red-500')} /></button>
                <button onClick={() => navigator.clipboard?.writeText(location.href)} className="btn-ghost px-3" aria-label="Share"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
            {[
              [BedDouble, 'Configuration', `${l.bhk} BHK`], [Maximize2, 'Built-up area', `${l.areaSqft.toLocaleString('en-IN')} sqft`],
              [Sofa, 'Furnishing', l.furnishing === 'semi' ? 'Semi-furnished' : l.furnishing === 'full' ? 'Fully furnished' : 'Unfurnished'], [Building, 'Floor', l.floor],
              [Compass, 'Facing', l.facing], [CalendarDays, 'Age', l.ageYears ? `${l.ageYears} yrs` : 'New'],
              [Users, 'Tenants', l.deal === 'rent' ? (l.tenantType === 'any' ? 'Family / Bachelor' : l.tenantType === 'family' ? 'Family only' : 'Bachelors') : '—'],
              [PawPrint, 'Pets', l.pets ? 'Allowed' : 'Not allowed'],
            ].map(([I, k, val]: any) => (
              <div key={k} className="flex items-start gap-2.5"><I className="mt-0.5 h-4 w-4 text-brand-600" /><div><div className="text-[11px] uppercase tracking-wide text-ink-400">{k}</div><div className="text-sm font-semibold capitalize">{val}</div></div></div>
            ))}
          </div>

          {/* Verification */}
          <Section title={FEATURES.proof} subtitle="Tiered verification — owners never need to upload a sale deed to list" tag="Sample data">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [Smartphone, 'Tier 1 · Required to list', 'Phone OTP + live in-app video walk-through with GPS within 50 m of the listed address', l.verification.otp && l.verification.video && l.verification.geotag, l.verification.otp ? 'OTP done · video pending' : 'Pending'],
                [FileCheck2, 'Tier 2 · Verified Owner (optional)', 'Owner name matched to a recent property tax receipt or electricity bill. Doc kept private, only name + address visible to our reviewer, deletable anytime', l.verification.ownerDoc, l.kind === 'builder' ? 'N/A · builder' : 'Not opted in'],
                [Scale, 'Tier 3 · At deal stage', l.deal === 'buy' ? 'When you proceed, title documents are checked by partner lawyers before any token amount' : 'When you proceed, ownership is confirmed before you sign or pay a deposit', false, 'When you proceed'],
              ].map(([I, t, d, ok, pending]: any) => (
                <div key={t} className={cn('rounded-xl border p-4', ok ? 'border-brand-200 bg-brand-50/60' : 'border-ink-200 bg-ink-50')}>
                  <div className="flex items-center justify-between"><I className={cn('h-5 w-5', ok ? 'text-brand-600' : 'text-ink-400')} />
                    <span className={cn('chip', ok ? 'bg-brand-600 text-white' : 'bg-ink-200 text-ink-500')}>{ok ? <><Check className="h-3 w-3" />Done</> : pending}</span></div>
                  <div className="mt-2 text-sm font-semibold">{t}</div><div className="text-xs text-ink-500">{d}</div>
                </div>
              ))}
            </div>
            {l.verification.verifiedOn && <p className="mt-3 text-xs text-ink-500"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand-600" />Tier 1 verified on {l.verification.verifiedOn} (sample). If a Proof listing is fake, you get your fee back plus {FEATURES.proofCredit} credit.</p>}
          </Section>

          {/* True price */}
          <Section title={FEATURES.price} subtitle="Our model estimate vs the asking price" tag="Sample model">
            <div className="grid gap-5 sm:grid-cols-[1fr_1.3fr] sm:items-center">
              <div>
                <div className="flex flex-wrap gap-2"><div className={cn('inline-flex rounded-xl border px-3 py-1.5 text-sm font-bold', v.tone)}>{v.label} · {v.d > 0 ? '+' : ''}{(v.d * 100).toFixed(1)}%</div>
                  {l.deal === 'rent' && v.d <= 0.06 && <div className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-sm font-bold text-white"><Check className="h-4 w-4" />{FEATURES.fairRent} badge</div>}</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-ink-500">Asking</div><div className="font-display text-xl font-bold">{formatPrice(l.price, l.deal)}</div></div>
                  <div><div className="text-ink-500">True Price</div><div className="font-display text-xl font-bold text-brand-700">{formatPrice(l.truePrice, l.deal)}</div></div>
                </div>
              </div>
              <div>
                <div className="relative h-3 rounded-full bg-gradient-to-r from-brand-500 via-brand-300 via-50% to-red-500">
                  <div className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-ink-900 ring-2 ring-white" style={{ left: `${pos}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-ink-500"><span>Good deal</span><span>Fair</span><span>Overpriced</span></div>
                <p className="mt-3 text-xs text-ink-500">Based on {l.locality} {l.deal === 'rent' ? `rent ~₹${loc.rentPerSqft}/sqft/mo` : `sale ~₹${loc.buyPerSqft.toLocaleString('en-IN')}/sqft`}, size, furnishing, age and {12 + (l.hue % 30)} comparable sample transactions. Estimate only.</p>
              </div>
            </div>
          </Section>

          {/* Bengaluru reality check */}
          <Section id="reality" title="Bengaluru Reality Check" subtitle="Floods, water and power: what residents usually find out after moving in" tag="Flood: real data · rest: sample">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><FloodCard coord={l.coord} place={`${l.society}, ${l.locality}`} /></div>
              <WaterCard l={l} />
              <PowerNetCard l={l} />
            </div>
            <Link href="/features/" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">How these checks work →</Link>
          </Section>

          {/* Peak-hour commute */}
          <Section id="commute" title="Peak-Hour Commute" subtitle="9 AM and 6 PM door-to-office estimates, with known bottlenecks" tag="Estimate">
            <PeakCommute from={l.coord} fromLabel={`${l.society}, ${l.locality}`} />
          </Section>

          {/* True monthly cost */}
          <Section id="true-cost" title="True Monthly Cost" subtitle={`${l.deal === 'rent' ? 'Rent' : 'EMI'} plus everything else this home really costs each month. Edit any line.`} tag="Sample estimate">
            <TrueCost l={l} />
          </Section>

          {l.deal === 'rent' && l.deposit ? (
            <Section id="deposit-fairness" title="Deposit Fairness Meter" subtitle={`Is ${fullINR(l.deposit)} fair for ${l.locality}? Draft a polite counter-offer.`} tag="Sample norms">
              <DepositFairness rent={l.price} deposit={l.deposit} locality={l.locality} />
              <Link href="/features/#agreement" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">Got the draft agreement? Scan it for red flags before you sign →</Link>
            </Section>
          ) : null}

          {/* Risk */}
          <Section id="truth" title={FEATURES.truth} subtitle="Commute, water, flooding, power, e-Khata, RERA & title — higher = safer (out of 10)" tag="Sample scores">
            <div className="mb-5 flex flex-wrap items-center gap-5 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 p-5 text-white">
              <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-coral-400 bg-white/10"><div className="text-center"><div className="font-display text-2xl font-extrabold leading-none">{truthScore.toFixed(1)}</div><div className="text-[10px] text-brand-100">/ 10</div></div></div>
              <div className="flex-1">
                <div className="font-display text-lg font-bold">{truthScore >= 7.5 ? 'Strong home' : truthScore >= 6 ? 'Good, with a few watch-outs' : 'Do your homework'}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  <span className="chip bg-white/15">{l.khataType}</span>
                  <span className="chip bg-white/15">Tankers: {l.tankerPerMonth === 0 ? 'none' : `~${l.tankerPerMonth}/mo in summer`}</span>
                  <span className="chip bg-white/15">Nearest tech park ~{commute[0].mins} min</span>
                  {l.reraDelayMonths !== undefined && <span className="chip bg-white/15">RERA delay: {l.reraDelayMonths ? `+${l.reraDelayMonths} mo` : 'none'}</span>}
                  <span className={cn('chip', l.titleFlags.length ? 'bg-coral-600' : 'bg-white/15')}>{l.titleFlags.length ? `${l.titleFlags.length} title flag${l.titleFlags.length > 1 ? 's' : ''}` : 'No title flags'}</span>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {risks.map((r) => {
                const t = scoreTone(r.s);
                return (
                  <div key={r.k} className="rounded-xl border border-ink-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold"><r.i className="h-4 w-4 text-brand-600" />{r.k}</div>
                      <div className="text-right"><span className="font-display text-xl font-extrabold">{r.s}</span><span className="text-xs text-ink-400">/10</span></div>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-ink-100"><div className={cn('h-full rounded-full', t.c)} style={{ width: `${r.s * 10}%` }} /></div>
                    <div className="mt-2 flex justify-between text-xs"><span className="text-ink-500">{r.d}</span><span className={cn('shrink-0 pl-2 font-semibold', t.tx)}>{t.t}</span></div>
                  </div>
                );
              })}
            </div>
            {l.titleFlags.length > 0 && (
              <div className="mt-3 rounded-xl border border-coral-200 bg-coral-50 p-3 text-sm text-coral-800"><strong>Title flags:</strong> {l.titleFlags.join(' · ')}</div>
            )}
            {l.rera && <p className="mt-3 text-xs text-ink-500">RERA No. (sample format): <span className="font-mono">{l.rera}</span></p>}
            <p className="mt-2 text-xs text-ink-400">Flooding uses real BBMP flood-spot data; commute is a model estimate; other scores are sample data for the prototype.</p>
          </Section>

          {/* Description + amenities */}
          <Section title="About this home">
            <p className="text-sm leading-relaxed text-ink-700">{l.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{l.amenities.map((a) => <span key={a} className="chip border border-ink-200 bg-white text-ink-700"><Check className="h-3 w-3 text-brand-600" />{a}</span>)}</div>
          </Section>

          {/* Map */}
          <Section title="Location" subtitle={`${l.society}, ${l.locality} (approximate pin)`}>
            <div className="h-72 overflow-hidden rounded-xl"><MapView listings={[l]} center={l.coord} zoom={14} /></div>
          </Section>

          {/* Reviews */}
          <Section title="Society reviews" subtitle={`From verified residents of ${l.society}`} tag="Sample reviews">
            <div className="mb-4 flex items-center gap-3">
              <div className="font-display text-4xl font-extrabold">{avgRating.toFixed(1)}</div>
              <div><div className="flex text-coral-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('h-4 w-4', i < Math.round(avgRating) && 'fill-current')} />)}</div><div className="text-xs text-ink-500">{l.reviews.length * 7 + 3} ratings</div></div>
            </div>
            <div className="space-y-3">
              {l.reviews.map((r, i) => (
                <div key={i} className="rounded-xl bg-ink-50 p-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{r.name[0]}</span><div><div className="text-sm font-semibold">{r.name}</div><div className="text-[11px] text-ink-500">{r.tenure}</div></div></div>
                    <div className="flex text-coral-500">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}</div></div>
                  <p className="mt-2 text-sm text-ink-700">{r.text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Calculators */}
          <Section title="Money calculators">
            <div className="mb-5 inline-flex rounded-xl bg-ink-100 p-1">
              <button onClick={() => setTab('emi')} className={cn('rounded-lg px-4 py-1.5 text-sm font-semibold', tab === 'emi' ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}>EMI calculator</button>
              <button onClick={() => setTab('rvb')} className={cn('rounded-lg px-4 py-1.5 text-sm font-semibold', tab === 'rvb' ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}>Rent vs Buy</button>
            </div>
            {l.deal === 'rent' && tab === 'emi' && <p className="mb-3 text-xs text-ink-500">Using an equivalent purchase price of {formatINR(equivBuy)} for this home (sample estimate).</p>}
            {tab === 'emi' ? <EmiCalculator price={equivBuy} /> : <RentVsBuy price={equivBuy} monthlyRent={equivRent} />}
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-coral-100 font-bold text-coral-700">{l.kind === 'owner' ? 'O' : l.builder?.[0]}</span>
              <div><div className="font-semibold">{l.kind === 'owner' ? 'Owner (name hidden)' : l.builder}</div><div className="text-xs text-ink-500">{l.kind === 'owner' ? 'Responds in ~2 hrs · No brokerage' : 'RERA registered builder (sample)'}</div></div>
            </div>
            <button onClick={() => setRevealed(true)} className="btn-ghost mt-4 w-full"><Phone className="h-4 w-4" />{revealed ? '+91 80 4718 •••• (masked line)' : 'Call via masked number'}</button>
            {revealed && <p className="mt-2 text-[11px] text-ink-500">Calls are routed through {BRAND.name}. Neither side sees the real number. (Demo)</p>}
          </div>
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between gap-2"><h3 className="font-display text-lg font-bold">Book a visit</h3><button onClick={() => setAbroad(true)} className="chip bg-indigo-50 text-indigo-700 hover:bg-indigo-100"><Globe2 className="h-3.5 w-3.5" />Book a video visit from abroad</button></div>
            <VisitPicker listingId={l.id} title={l.title} abroad={abroad} deal={l.deal} />
          </div>
          {l.deal === 'rent' && (l.depositSafe ? (
            <Link href="/deposit-safe/" className="card block bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white">
              <Wallet className="h-6 w-6 text-coral-300" />
              <div className="mt-2 font-semibold">This owner accepts {FEATURES.deposit}</div>
              <p className="mt-1 text-sm text-brand-100">Optional for you: keep the {formatINR(l.deposit!)} deposit in a partner bank escrow, or ask about the deposit-free plan. Learn how it works →</p>
            </Link>
          ) : (
            <div className="card p-5">
              <div className="flex items-center gap-2 font-semibold"><Wallet className="h-5 w-5 text-coral-500" />Want {FEATURES.deposit}?</div>
              <p className="mt-1 text-sm text-ink-500">This owner hasn’t opted in — that’s fine, it’s optional. You can request it; the owner can accept or decline.</p>
              <button onClick={() => setDsRequested(true)} disabled={dsRequested} className="btn-ghost mt-3 w-full">{dsRequested ? 'Request sent (demo)' : `Request ${FEATURES.deposit}`}</button>
            </div>
          ))}
          <Link href="/nri/" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Globe2 className="h-5 w-5 text-indigo-600" /><div><div className="text-sm font-semibold">Living abroad?</div><div className="text-xs text-ink-500">Book a live video visit across time zones with {BRAND.name} NRI (planned)</div></div>
          </Link>
          <button onClick={() => window.dispatchEvent(new Event('gk-open-chat'))} className="card flex w-full items-center gap-3 p-4 text-left hover:shadow-lift">
            <Sparkles className="h-5 w-5 text-coral-500" /><div><div className="text-sm font-semibold">Ask AI about this home</div><div className="text-xs text-ink-500">“Is this a fair price?” “How bad is flooding?”</div></div>
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
              <PropertyArt hue={l.hue} kind={l.kind} bhk={l.bhk} className="h-full w-full opacity-60" />
              <div className="absolute inset-0 grid place-items-center text-center text-white">
                <div><PlayCircle className="mx-auto h-16 w-16" /><div className="mt-2 font-semibold">Verified walk-through (demo placeholder)</div>
                  <div className="mt-1 text-xs text-white/70">Recorded {l.verification.verifiedOn} · GPS {l.coord[0].toFixed(4)}, {l.coord[1].toFixed(4)}</div></div>
              </div>
              <div className="absolute left-3 top-3 chip bg-red-600 text-white">● REC 02:14</div>
            </div>
            <button onClick={() => setShowVideo(false)} className="w-full bg-white py-3 text-sm font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
