import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Landmark, FileSignature, ClipboardCheck, Scale, ArrowRight, CheckCircle2, TrendingUp, Zap, Video, HandCoins, BadgeCheck, ToggleLeft, Users } from 'lucide-react';
import { BRAND, FEATURES } from '@/config/brand';
import DepositEstimator from './DepositEstimator';

export const metadata: Metadata = { title: 'Deposit Safe — optional deposit protection owners can opt in to' };

const OWNER_PERKS = [
  { i: BadgeCheck, t: `“${FEATURES.deposit} Owner” badge`, d: 'Shown on your listing. Opted-in listings rank higher in search.' },
  { i: Zap, t: 'Faster tenant matching', d: 'Tenants who want deposit protection — often Verified Tenants — are shown your home first.' },
  { i: FileSignature, t: 'Free digital rental agreement', d: 'e-Stamped, e-signed Karnataka 11-month agreement included at no cost (planned).' },
  { i: ShieldCheck, t: 'Rent-default & damage protection add-on', d: 'Optional cover for unpaid rent and damage beyond the deposit, via an insurance partner (planned, priced separately).' },
  { i: Video, t: 'Deposit released to you for documented damage', d: 'AI compares the move-in and move-out video walk-throughs room by room. Documented damage is paid to you from escrow — no arguments.' },
  { i: HandCoins, t: 'Deposit-free plan option', d: 'Offer a lower or zero deposit: the tenant pays a small non-refundable monthly fee instead, and you stay covered by the protection add-on (planned).' },
];

const STEPS = [
  { i: ToggleLeft, t: 'Owner opts in (or not)', d: 'List normally with zero obligation. Tick “Accept Deposit Safe” any time — or accept it when a tenant requests it.' },
  { i: Landmark, t: 'Deposit goes into escrow', d: `The agreed deposit sits with a regulated bank / trustee escrow partner. ${BRAND.name} never holds the money.` },
  { i: ClipboardCheck, t: 'Move-in video report', d: 'Both sides record a timestamped in-app video walk-through on move-in day.' },
  { i: Scale, t: 'Fair, fast move-out', d: 'AI compares move-in vs move-out videos. Documented damage goes to the owner; the rest returns to the tenant within 48 h. Disputes go to a neutral mediator.' },
];

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="chip bg-white/10 text-coral-200"><ShieldCheck className="h-4 w-4" />{FEATURES.deposit} · optional</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Deposit protection both sides can opt in to.</h1>
            <p className="mt-4 text-lg text-brand-100">Owners list on {BRAND.name} normally — <strong className="text-white">no escrow required, ever</strong>. {FEATURES.deposit} is an opt-in perk: tenants can request it, owners can accept it, and owners who do get a badge, better ranking and extra protection.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/post/" className="btn-accent px-5 py-3">List your home — free <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/search/?deal=rent&ds=1" className="btn bg-white/10 px-5 py-3 text-white hover:bg-white/20">Browse {FEATURES.deposit} homes</Link>
            </div>
            <p className="mt-4 text-xs text-brand-200">Concept explainer for the prototype. Escrow partner, insurance partner, fees and legal structure to be finalised.</p>
          </div>
          <DepositEstimator />
        </div>
      </section>

      <section className="container-x mt-12">
        <div className="card grid gap-4 border-brand-200 bg-brand-50/50 p-6 md:grid-cols-3">
          {[['Owners', 'List with zero obligation. Opting in is your choice, per tenancy.'], ['Tenants', `Request ${FEATURES.deposit} on any rental. The owner can accept or decline.`], ['No pressure', 'Listings without it are never hidden or penalised — opted-in ones simply get a boost.']].map(([t, d]) => (
            <div key={t} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /><div><div className="font-semibold">{t}</div><p className="text-sm text-ink-600">{d}</p></div></div>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <p className="eyebrow">For owners</p><h2 className="h-section mt-2">Why owners choose to opt in</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {OWNER_PERKS.map((p) => (
            <div key={p.t} className="card p-6"><p.i className="h-7 w-7 text-coral-500" /><h3 className="mt-3 font-semibold">{p.t}</h3><p className="mt-1.5 text-sm text-ink-500">{p.d}</p></div>
          ))}
        </div>
      </section>

      <section id="how" className="container-x mt-16">
        <p className="eyebrow">How it works</p><h2 className="h-section mt-2">When both sides opt in</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.t} className="card relative p-6">
              <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-ink-100">{i + 1}</span>
              <s.i className="h-7 w-7 text-brand-600" />
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-16 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <TrendingUp className="h-7 w-7 text-brand-600" />
          <h3 className="mt-3 font-display text-xl font-bold">For tenants</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-700">
            {['Deposit held in escrow, not spent', 'Deductions only for damage documented on video', 'Undisputed amount back within 48 hours', `Look for the “${FEATURES.deposit} Owner” badge, or request it on any rental`, 'Verified Tenants can be offered the deposit-free plan'].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />{x}</li>)}
          </ul>
        </div>
        <div className="card border-coral-200 bg-coral-50/40 p-6">
          <Users className="h-7 w-7 text-coral-600" />
          <h3 className="mt-3 font-display text-xl font-bold">Deposit-free plan (planned)</h3>
          <p className="mt-2 text-sm text-ink-600">For owners who opt in and tenants who are verified: instead of a large deposit, the tenant pays a small non-refundable monthly fee (draft: ~3–4% of rent). The owner is covered for unpaid rent and damage up to an agreed limit by the protection add-on. Owners decide whether to offer it.</p>
          <Link href="/pricing/" className="btn-ghost mt-4">See draft pricing</Link>
        </div>
      </section>

      <section className="container-x mt-16 max-w-3xl">
        <h2 className="h-section">FAQ</h2>
        <div className="mt-6 space-y-3">
          {[
            ['Do I have to use Deposit Safe to list?', `No. Listing on ${BRAND.name} has zero obligation. ${FEATURES.deposit} is optional for every tenancy; you can opt in when you post, later, or only when a tenant requests it.`],
            ['What if a tenant requests it and I decline?', 'Nothing happens to your listing. You can still rent to that tenant the usual way.'],
            ['Who holds the money?', `A regulated bank / trustee escrow partner (to be finalised). ${BRAND.name} never holds the money.`],
            ['How are damages decided?', 'Both sides record in-app video walk-throughs at move-in and move-out. AI flags differences room by room; documented damage is released to the owner. Anything disputed goes to a neutral mediator.'],
            ['What does it cost?', 'Opting in is free for owners and includes a free digital agreement. Optional protection add-on and deposit-free plan fees are on the pricing page (draft).'],
          ].map(([q, a]) => (
            <details key={q} className="card group p-5"><summary className="cursor-pointer list-none font-semibold marker:hidden">{q}<span className="float-right text-ink-400 transition group-open:rotate-45">+</span></summary><p className="mt-2 text-sm text-ink-600">{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
