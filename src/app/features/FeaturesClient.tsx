'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Sparkles, Bot } from 'lucide-react';
import { DIFF_ICONS } from '@/components/reality/icons';
import { DIFFERENTIATORS, type DiffId } from '@/config/differentiators';
import { LISTINGS } from '@/data/listings';
import { LOCALITIES, resolveArea } from '@/data/geo';
import LocalityTypeahead from '@/components/LocalityTypeahead';
import FloodCard from '@/components/reality/FloodCard';
import { WaterCard, PowerNetCard } from '@/components/reality/WaterPower';
import PeakCommute from '@/components/reality/PeakCommute';
import TrueCost from '@/components/reality/TrueCost';
import DepositFairness from '@/components/reality/DepositFairness';
import AgreementScan from '@/components/reality/AgreementScan';
import VoiceListing from '@/components/reality/VoiceListing';
import { formatPrice } from '@/lib/format';

const AGENT: Record<DiffId, string> = {
  flood: 'Data agent refreshes BBMP flood-spot lists each monsoon and tags every listing pin.',
  water: 'Concierge agent asks residents two questions after move-in and every summer; outliers go to a human.',
  power: 'Data agent logs BESCOM planned-outage notices; residents confirm backup and fibre on WhatsApp.',
  commute: 'Routing agent prices 9 AM and 6 PM trips to your office and alerts you if a route gets worse.',
  cost: 'Pricing agent pre-fills every line from the home’s reports; you can edit everything.',
  deposit: 'Negotiation agent drafts the message; you review and send. It never sends on its own.',
  agreement: 'Legal-check agent flags clauses in plain language; a partner lawyer reviews on request.',
  voice: 'Listing agent transcribes Kannada, Hindi or English voice notes and asks only for missing details.',
};
const SAMPLE_HOMES = LOCALITIES.map((loc) => LISTINGS.find((l) => l.locality === loc.name && l.deal === 'rent' && !l.space) ?? LISTINGS.find((l) => l.locality === loc.name && !l.space)!).filter(Boolean);

function Block({ id, children }: { id: DiffId; children: React.ReactNode }) {
  const d = DIFFERENTIATORS.find((x) => x.id === id)!;
  const I = DIFF_ICONS[id];
  return (
    <section id={id} className="card scroll-mt-24 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-coral-600 text-white"><I className="h-5 w-5" /></span>
          <div><h2 className="font-display text-xl font-bold">{d.title}</h2><p className="mt-1 max-w-2xl text-sm text-ink-600">{d.line}</p></div>
        </div>
        <span className="chip bg-ink-100 text-ink-600">{d.data}</span>
      </div>
      <div className="mt-5">{children}</div>
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs text-brand-900"><Bot className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>How it runs:</strong> {AGENT[id]}</span></p>
    </section>
  );
}

export default function FeaturesClient() {
  const [floodLoc, setFloodLoc] = useState('Koramangala');
  const floodArea = resolveArea(floodLoc);
  const [homeId, setHomeId] = useState(SAMPLE_HOMES[0].id);
  const home = LISTINGS.find((l) => l.id === homeId)!;
  return (
    <div className="pb-10">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-coral-500/25 blur-3xl" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="chip border border-white/20 bg-white/10 text-brand-50"><Sparkles className="h-3.5 w-3.5 text-coral-300" />Built for Bengaluru</span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">What makes Jagaly different</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">The things Bengaluru renters and buyers usually discover after moving in, shown before you sign: floods, water, power cuts, the real commute, the real monthly cost, and the deposit.</p>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((d) => { const I = DIFF_ICONS[d.id]; return (
              <a key={d.id} href={`#${d.id}`} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/20"><I className="h-4 w-4 text-coral-300" />{d.title}</a>
            ); })}
          </div>
        </div>
      </section>

      <div className="container-x mt-8 space-y-6">
        <Block id="flood">
          <div className="grid gap-4 md:grid-cols-[280px_1fr]">
            <div><div className="label">Check any locality</div><LocalityTypeahead value={floodLoc} onChange={setFloodLoc} placeholder="e.g. Bellandur, Hebbal" />
              <p className="mt-2 text-xs text-ink-500">Uses the locality’s approximate centre. Property pages use the listing pin.</p></div>
            {floodArea ? <FloodCard coord={floodArea.coord} place={floodArea.name} /> : <p className="text-sm text-ink-500">Pick a locality from the list.</p>}
          </div>
        </Block>

        <div className="card flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm font-semibold">Try the home-level reports on a sample home:</span>
          <select className="input w-auto" value={homeId} onChange={(e) => setHomeId(e.target.value)} aria-label="Sample home">
            {SAMPLE_HOMES.map((l) => <option key={l.id} value={l.id}>{l.locality} · {l.bhk ? `${l.bhk} BHK` : l.title} · {formatPrice(l.price, l.deal)}</option>)}
          </select>
          <Link href={`/property/${home.id}/`} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">Open the full property page<ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Block id="water"><WaterCard key={home.id} l={home} /></Block>
          <Block id="power"><PowerNetCard key={home.id} l={home} /></Block>
        </div>
        <Block id="cost"><TrueCost key={home.id} l={home} /></Block>
        <Block id="commute"><PeakCommute pickFrom /></Block>
        <Block id="deposit"><DepositFairness rent={32000} deposit={320000} locality="HSR Layout" editable /></Block>
        <Block id="agreement"><AgreementScan /></Block>
        <Block id="voice"><VoiceListing /></Block>

        <div className="card bg-gradient-to-r from-brand-700 to-coral-600 p-6 text-white sm:p-8">
          <h2 className="font-display text-2xl font-bold">See it on a sample listing</h2>
          <p className="mt-1 max-w-2xl text-sm text-white/90">Every property page now carries the Flood &amp; Monsoon Check, Water and Power reality, Peak-Hour Commute, True Monthly Cost and, for rentals, the Deposit Fairness Meter. Prototype: listings are sample data.</p>
          <div className="mt-4 flex flex-wrap gap-2"><Link href="/search/?deal=rent&flood=1" className="btn bg-white text-brand-800 hover:bg-brand-50">Low-flood-risk rentals</Link><Link href={`/property/${home.id}/`} className="btn border border-white/40 text-white hover:bg-white/10">Open a sample home</Link></div>
        </div>
      </div>
    </div>
  );
}
