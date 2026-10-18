import Link from 'next/link';
import { Building2, ShieldCheck, PhoneOff, BadgeIndianRupee, Video, Gauge, Landmark, Timer, Wallet, MapPinned, Sparkles, ArrowRight, Star, CheckCircle2, BadgeCheck, Globe2, Smartphone, FileCheck2, Scale, Lock } from 'lucide-react';
import SearchHero from '@/components/SearchHero';
import ListingCard from '@/components/ListingCard';
import { LISTINGS } from '@/data/listings';
import { LOCALITIES, AREAS } from '@/data/geo';
import { BRAND, FEATURES } from '@/config/brand';
import { formatINR } from '@/lib/format';
import { COMMERCIAL_TYPES, PROPERTY_TYPES } from '@/data/commercial';

const DIFFS = [
  { icon: Video, title: FEATURES.proof, text: `Every Proof listing has a phone-verified owner and a live in-app video walk-through with GPS. No sale deed needed to list. If it’s fake, you get your fee back plus ${FEATURES.proofCredit} credit.` },
  { icon: BadgeIndianRupee, title: FEATURES.price, text: `See what a home is actually worth vs. the asking price. Rentals priced in line with the market earn a ${FEATURES.fairRent} badge.` },
  { icon: Gauge, title: FEATURES.truth, text: 'Commute, water & tanker dependence, flooding, power cuts, e-Khata A/B, RERA delays and title flags — in one score.' },
  { icon: PhoneOff, title: FEATURES.spam, text: 'Your number stays masked behind a private line and is never resold. Brokers get banned, not your inbox.' },
  { icon: Wallet, title: `${FEATURES.deposit} (optional)`, text: `Owners list with zero obligation. Those who opt in get a badge, higher ranking and damage protection; tenants get escrow-held deposits or a deposit-free plan.` },
  { icon: Landmark, title: 'RERA project tracker', text: 'Registered completion dates, extensions and completion applications from RERA Karnataka public records — check before you pay a booking amount.' },
];

export default function Home() {
  const featured = LISTINGS.filter((l) => l.verified && l.segment === 'residential' && !l.space).slice(0, 6);
  const commercial = LISTINGS.filter((l) => l.segment === 'commercial');
  const comPicks = ['blr-c01', 'blr-c08', 'blr-c17', 'blr-c02'].map((id) => commercial.find((l) => l.id === id)!).filter(Boolean);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-saffron-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="container-x relative pb-20 pt-14 sm:pt-20">
          <span className="chip border border-white/20 bg-white/10 text-brand-50"><Sparkles className="h-3.5 w-3.5 text-saffron-300" />Prototype · {BRAND.city} · {AREAS.length} localities searchable</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Every home proven. Every price true. <span className="bg-gradient-to-r from-saffron-300 to-saffron-500 bg-clip-text text-transparent">Deposits protected, by choice.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100/90">Rent, lease or buy homes and commercial spaces in {BRAND.city} with zero brokerage, zero spam and no surprises.</p>
          <div className="mt-8"><SearchHero /></div>
          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-saffron-300" />
              <div><div className="font-semibold">{FEATURES.proof}: every home proven</div><div className="text-sm text-brand-100/80">Phone OTP + live video with GPS. If a Proof listing is fake, your fee back plus {FEATURES.proofCredit} credit.</div></div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <PhoneOff className="mt-0.5 h-6 w-6 shrink-0 text-saffron-300" />
              <div><div className="font-semibold">{FEATURES.spam}</div><div className="text-sm text-brand-100/80">Zero spam calls. Your number stays masked behind a private {BRAND.name} line and is never resold.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-x -mt-8 relative z-10">
        <div className="card grid grid-cols-2 divide-ink-100 p-2 sm:grid-cols-4 sm:divide-x">
          {[['100%', `${FEATURES.proof} homes video + GPS checked`], ['₹0', 'brokerage for tenants & owners'], [FEATURES.proofCredit, 'credit + fee back if a Proof listing is fake'], [String(LISTINGS.length), 'sample listings in this demo (fictional)']].map(([a, b]) => (
            <div key={b} className="p-4 text-center"><div className="font-display text-2xl font-extrabold text-brand-700 sm:text-3xl">{a}</div><div className="mt-1 text-xs text-ink-500">{b}</div></div>
          ))}
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="container-x mt-20">
        <div className="max-w-2xl"><p className="eyebrow">Why {BRAND.name}</p><h2 className="h-section mt-2">Built for how Bangalore actually rents and buys.</h2>
          <p className="mt-3 text-ink-500">We verify the home, show you the real numbers, keep your phone number private, and get out of the way. Every score and listing on this prototype is sample data.</p></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFS.map((d) => (
            <div key={d.title} className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white"><d.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg font-bold">{d.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x mt-20">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Fresh & verified</p><h2 className="h-section mt-2">Handpicked sample listings</h2></div>
          <Link href="/search/" className="btn-ghost hidden sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      {/* COMMERCIAL */}
      <section className="container-x mt-20" id="commercial">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.6fr]">
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 text-white sm:p-10">
              <span className="chip bg-white/10 text-indigo-100"><Building2 className="h-3.5 w-3.5" />New · Commercial</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold">Commercial spaces</h2>
              <p className="mt-3 text-indigo-100">Offices, co-working, shops, showrooms, F&B, warehouses, industrial sheds and land. Filter by seats, power load, frontage, lock-in and zoning. See True Price per sq ft, a Property Truth Score (power backup, flooding, access road, zoning, OC/CC) and the full lease cost with escalation.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {COMMERCIAL_TYPES.map((t) => <Link key={t} href={`/search/?seg=com&deal=${t === 'comm-land' ? 'buy' : 'rent'}&ptype=${t}`} className="chip bg-white/10 text-white hover:bg-white/20">{PROPERTY_TYPES[t].label}</Link>)}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/search/?seg=com&deal=rent" className="btn bg-white text-indigo-800 hover:bg-indigo-50">Browse {commercial.length} sample spaces <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/post/#commercial" className="btn border border-white/30 text-white hover:bg-white/10">List a commercial space</Link>
              </div>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
              {comPicks.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-400">Sample commercial listings: fictional buildings, prices and scores across ORR, Whitefield, Koramangala, Indiranagar, MG Road, Hebbal, Electronic City, Peenya, Hoskote, Bommasandra and HSR.</p>
      </section>

      {/* LOCALITIES */}
      <section className="container-x mt-20">
        <p className="eyebrow">Explore Bangalore</p><h2 className="h-section mt-2">Popular localities</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {LOCALITIES.map((l, i) => {
            const count = LISTINGS.filter((x) => x.locality === l.name).length;
            return (
              <Link key={l.name} href={`/search/?locality=${encodeURIComponent(l.name)}`} className="card group relative overflow-hidden p-4 transition hover:shadow-lift">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 transition group-hover:scale-125" style={{ background: `hsl(${(i * 45) % 360} 70% 55%)` }} />
                <MapPinned className="h-5 w-5 text-brand-600" />
                <div className="mt-3 font-semibold">{l.name}</div>
                <div className="text-xs text-ink-500">{count} listings · Rent ~₹{l.rentPerSqft}/sqft</div>
                <div className="text-xs text-ink-500">Buy ~{formatINR(l.buyPerSqft, { compact: false })}/sqft</div>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-400">Rates are sample estimates for demo purposes.</p>
      </section>

      {/* WHAT YOU GET */}
      <section className="container-x mt-20">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="bg-gradient-to-br from-saffron-500 to-saffron-700 p-8 text-white sm:p-10">
              <h2 className="font-display text-3xl font-extrabold">What you get with {BRAND.name}</h2>
              <p className="mt-3 text-saffron-50">Core features are free for tenants, owners, buyers and businesses. Optional extras are clearly priced (draft).</p>
              <Link href="/pricing/" className="btn mt-6 bg-white text-saffron-700 hover:bg-saffron-50">See draft pricing <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="p-4 sm:p-6">
              <ul className="divide-y divide-ink-100 text-sm">
                {[
                  [`${FEATURES.proof}`, 'Phone-verified owner + live in-app video with GPS', 'Free'],
                  [FEATURES.spam, 'Masked number, never resold', 'Free'],
                  [`${FEATURES.price} + ${FEATURES.fairRent} badge`, 'Model estimate vs asking price (sample model)', 'Free'],
                  [FEATURES.truth, 'Water, flooding, power, e-Khata, RERA, commute (sample scores)', 'Free'],
                  ['RERA project tracker', 'Original vs current completion dates from RERA Karnataka public records', 'Free'],
                  [`${FEATURES.tenant}`, 'Optional ID check via licensed KYC partner', 'Free, optional'],
                  [`${FEATURES.deposit}`, 'Escrow-held deposit when the owner opts in', 'Optional'],
                  [FEATURES.nri, 'Video visits, remote buying, property management', 'Planned · draft'],
                  ['Commercial spaces', 'True Price per sq ft, Property Truth Score, lease cost calculator', 'Free to list'],
                ].map(([t, d, p]) => (
                  <li key={t} className="flex items-start justify-between gap-4 py-3"><div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /><div><div className="font-semibold text-ink-800">{t}</div><div className="text-xs text-ink-500">{d}</div></div></div><span className="shrink-0 text-xs font-semibold text-brand-700">{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER-FRIENDLY PROOF */}
      <section className="container-x mt-20">
        <p className="eyebrow">For owners</p><h2 className="h-section mt-2">Verification that doesn’t ask for your sale deed</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            [Smartphone, 'Tier 1 · to list', 'Phone OTP + a live in-app video walk-through with GPS. That’s all you need to go live.'],
            [FileCheck2, 'Tier 2 · optional “Verified Owner”', 'Upload a recent property tax receipt or electricity bill. Blur everything except name + address in-app. Kept private, used only for a name match, deletable anytime. Ranks higher.'],
            [Scale, 'Tier 3 · only at deal stage', 'When a serious tenant or buyer proceeds, documents are checked — for sales, by partner lawyers.'],
          ].map(([I, t, d]: any) => (
            <div key={t} className="card p-6"><I className="h-7 w-7 text-brand-600" /><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1.5 text-sm text-ink-500">{d}</p></div>
          ))}
        </div>
      </section>

      {/* VERIFIED TENANT + NRI */}
      <section className="container-x mt-20 grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col p-8">
          <span className="chip w-fit bg-indigo-50 text-indigo-700"><BadgeCheck className="h-3.5 w-3.5" />Optional for tenants</span>
          <h2 className="mt-3 font-display text-2xl font-extrabold">{FEATURES.tenant}</h2>
          <p className="mt-2 text-sm text-ink-600">Verify your ID once via DigiLocker or Aadhaar offline e-KYC through a licensed partner. Appear first in owners’ inboxes, book visits faster and qualify for deposit-free plans.</p>
          <p className="mt-3 flex gap-2 rounded-xl bg-ink-50 p-3 text-xs text-ink-600"><Lock className="h-4 w-4 shrink-0" />{BRAND.name} never stores your Aadhaar number. Owners see only “ID verified”, your name and employer if you share it.</p>
          <Link href="/verified-tenant/" className="btn-ghost mt-5 w-fit">How Verified Tenant works <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="card flex flex-col bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 text-white">
          <span className="chip w-fit bg-white/10 text-indigo-100"><Globe2 className="h-3.5 w-3.5" />Planned add-on</span>
          <h2 className="mt-3 font-display text-2xl font-extrabold">{FEATURES.nri}</h2>
          <p className="mt-2 text-sm text-indigo-100">Living in the US, UK, UAE, Singapore or Australia? Live video site visits with a verified agent at a time that suits you, remote buying with partner-lawyer checks, Power of Attorney guidance, and full property management for your Bangalore home.</p>
          <Link href="/nri/" className="btn mt-5 w-fit bg-white text-indigo-800 hover:bg-indigo-50">Explore {FEATURES.nri} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x mt-20">
        <p className="eyebrow">Early users (sample)</p><h2 className="h-section mt-2">People who stopped getting 40 broker calls a day</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Shruti, product designer', 'Moved to HSR in 9 days. Every flat I visited actually matched the video. No surprises at the door.'],
            ['Aakash & Neha, first-time buyers', 'The RERA tracker showed us the project’s completion date had already been extended twice. We asked better questions before booking.'],
            ['Mr. Ramesh, owner in Indiranagar', 'Listed free, got 6 genuine tenant enquiries in two days, zero brokers. The agreement was signed online.'],
          ].map(([n, t]) => (
            <figure key={n} className="card p-6">
              <div className="flex gap-0.5 text-saffron-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-3 text-ink-700">“{t}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink-900">{n}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Own a flat, shop or office in Bangalore? List it free.</h2>
              <ul className="mt-5 grid gap-2 text-ink-300 sm:grid-cols-2">
                {['No sale deed needed: phone OTP + 60-sec video', 'AI writes your description', 'Only genuine, masked enquiries', 'Deposit Safe optional, never required'].map((x) => (
                  <li key={x} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-400" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link href="/post/" className="btn-accent px-6 py-3.5 text-base">Post your property — free <ArrowRight className="h-4 w-4" /></Link>
              <span className="text-xs text-ink-400">Takes about 3 minutes</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
