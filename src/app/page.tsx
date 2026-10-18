import Link from 'next/link';
import { ShieldCheck, PhoneOff, BadgeIndianRupee, Video, Gauge, Landmark, Timer, Wallet, MapPinned, Sparkles, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import SearchHero from '@/components/SearchHero';
import ListingCard from '@/components/ListingCard';
import { LISTINGS } from '@/data/listings';
import { LOCALITIES } from '@/data/geo';
import { BRAND, FEATURES } from '@/config/brand';
import { formatINR } from '@/lib/format';

const DIFFS = [
  { icon: Video, title: FEATURES.proof, text: `Every Proof listing has a live video walk-through recorded on-site with GPS. If it’s fake, you get your fee back plus ${FEATURES.proofCredit} credit.` },
  { icon: BadgeIndianRupee, title: FEATURES.price, text: `See what a home is actually worth vs. the asking price. Rentals priced in line with the market earn a ${FEATURES.fairRent} badge.` },
  { icon: Gauge, title: FEATURES.truth, text: 'Commute, water & tanker dependence, flooding, power cuts, e-Khata A/B, RERA delays and title flags — in one score.' },
  { icon: PhoneOff, title: FEATURES.spam, text: 'Your number stays masked behind a private line and is never resold. Brokers get banned, not your inbox.' },
  { icon: Wallet, title: FEATURES.deposit, text: `Your deposit sits in a bank escrow with a regulated partner — ${BRAND.name} never holds your money. Checklist-based refunds on move-out.` },
  { icon: Landmark, title: 'Builder delay tracker', text: 'RERA-style timelines and delay history for every project — before you pay a single rupee of booking amount.' },
];

export default function Home() {
  const featured = LISTINGS.filter((l) => l.verified).slice(0, 6);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-saffron-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="container-x relative pb-20 pt-14 sm:pt-20">
          <span className="chip border border-white/20 bg-white/10 text-brand-50"><Sparkles className="h-3.5 w-3.5 text-saffron-300" />Now live in {BRAND.city} · 8 localities</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Every home proven. Every price true. <span className="bg-gradient-to-r from-saffron-300 to-saffron-500 bg-clip-text text-transparent">Every deposit safe.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100/90">Rent or buy in {BRAND.city} with no brokers, no spam and no surprises.</p>
          <div className="mt-8"><SearchHero /></div>
          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-saffron-300" />
              <div><div className="font-semibold">{FEATURES.proof}: every home proven</div><div className="text-sm text-brand-100/80">Video + GPS verified on-site. If a Proof listing is fake, your fee back plus {FEATURES.proofCredit} credit.</div></div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <PhoneOff className="mt-0.5 h-6 w-6 shrink-0 text-saffron-300" />
              <div><div className="font-semibold">{FEATURES.spam}</div><div className="text-sm text-brand-100/80">No broker spam. Your number stays masked behind a private {BRAND.name} line and is never resold.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-x -mt-8 relative z-10">
        <div className="card grid grid-cols-2 divide-ink-100 p-2 sm:grid-cols-4 sm:divide-x">
          {[['100%', `${FEATURES.proof} homes video + GPS checked`], ['₹0', 'brokerage for tenants & owners'], [FEATURES.proofCredit, 'credit + fee back if a Proof listing is fake'], ['30', 'sample listings in this demo']].map(([a, b]) => (
            <div key={b} className="p-4 text-center"><div className="font-display text-2xl font-extrabold text-brand-700 sm:text-3xl">{a}</div><div className="mt-1 text-xs text-ink-500">{b}</div></div>
          ))}
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="container-x mt-20">
        <div className="max-w-2xl"><p className="eyebrow">Why {BRAND.name}</p><h2 className="h-section mt-2">Everything the old portals never fixed.</h2>
          <p className="mt-3 text-ink-500">MagicBricks shows you everything. NoBroker charges you to skip brokers. We just verify the home, protect your money, and get out of the way.</p></div>
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

      {/* COMPARISON */}
      <section className="container-x mt-20">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="bg-gradient-to-br from-saffron-500 to-saffron-700 p-8 text-white sm:p-10">
              <h2 className="font-display text-3xl font-extrabold">Honest comparison.</h2>
              <p className="mt-3 text-saffron-50">How {BRAND.name} stacks up against the portals Bangalore already knows. (Our view, based on public product pages; draft.)</p>
              <Link href="/pricing/" className="btn mt-6 bg-white text-saffron-700 hover:bg-saffron-50">See pricing <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-ink-500"><th className="py-2 pr-4 font-medium"></th><th className="px-3 font-bold text-brand-700">{BRAND.name}</th><th className="px-3 font-medium">Typical portal</th><th className="px-3 font-medium">“No-broker” plans</th></tr></thead>
                <tbody className="divide-y divide-ink-100">
                  {[
                    ['Pakka Proof: on-site video + GPS', '✓', '—', 'Partial'],
                    ['Masked number, never resold', '✓ Free', '—', 'Paid'],
                    ['True Price Engine + Fair-Rent badge', '✓', '—', '—'],
                    ['Home Truth Score (water, flood, e-Khata, RERA)', '✓', '—', '—'],
                    ['Escrow deposit protection', '✓', '—', '—'],
                    ['Builder delay history', '✓', 'Partial', '—'],
                    ['Tenant plan from', '₹0', '₹0 (spam)', '~₹999+'],
                  ].map((r) => (
                    <tr key={r[0]}><td className="py-2.5 pr-4 font-medium text-ink-700">{r[0]}</td>
                      <td className="px-3 font-semibold text-brand-700">{r[1]}</td><td className="px-3 text-ink-500">{r[2]}</td><td className="px-3 text-ink-500">{r[3]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x mt-20">
        <p className="eyebrow">Early users (sample)</p><h2 className="h-section mt-2">People who stopped getting 40 broker calls a day</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Shruti, product designer', 'Moved to HSR in 9 days. Every flat I visited actually matched the video — that never happened on other apps.'],
            ['Aakash & Neha, first-time buyers', 'The delay tracker stopped us from booking in a project that had slipped 3 years. Saved our down payment.'],
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
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Own a flat in Bangalore? List it free.</h2>
              <ul className="mt-5 grid gap-2 text-ink-300 sm:grid-cols-2">
                {['AI writes your description', 'Verified badge with a 60-sec video', 'Only genuine, masked enquiries', 'Digital rent agreement included'].map((x) => (
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
