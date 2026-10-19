import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe2, Video, FileSearch, Scale, FileSignature, Landmark, Banknote, Building2, MessageCircle, Gauge, ArrowRight, Info, ShieldCheck, Wallet, Wrench, Receipt, CalendarClock, FileBarChart } from 'lucide-react';
import { BRAND, FEATURES } from '@/config/brand';
import NriClock from './NriClock';

export const metadata: Metadata = { title: 'Jagaly NRI — buy, rent out and manage your Bengaluru home from abroad (planned)' };

const SERVICES = [
  { i: Video, t: 'Live video site visits', d: `A verified ${BRAND.name} agent walks the home live on video at a time that suits you, with a recording and checklist afterwards.` },
  { i: FileSearch, t: 'Remote buying flow', d: 'Shortlist, visit by video, negotiate and review documents digitally — from offer to registration.' },
  { i: Scale, t: 'Title & legal check', d: 'Title search and document review by partner lawyers before you pay a token amount.' },
  { i: Landmark, t: 'e-Khata, RERA & encumbrance verification', d: 'e-Khata status, RERA registration and encumbrance certificate checks, summarised in plain language.' },
  { i: FileSignature, t: 'Power of Attorney guidance', d: 'Guidance and drafting support for a property PoA, and how to execute it abroad and register it in Bengaluru.' },
  { i: Banknote, t: 'Home loans & repatriation explainer', d: 'Referrals to NRI home-loan partners, plus a plain-English guide to NRE/NRO accounts, FEMA basics and TDS.' },
  { i: Gauge, t: `${FEATURES.truth} reports`, d: 'Water, flooding, power, e-Khata, RERA and commute risk for any shortlisted home (sample scores in this demo).' },
  { i: MessageCircle, t: 'WhatsApp concierge across time zones', d: 'A dedicated relationship contact who replies in your working hours, not just IST.' },
];

const MANAGE = [
  { i: ShieldCheck, t: `Tenant finding with ${FEATURES.proof}` },
  { i: Banknote, t: 'Rent collection to your NRE/NRO account' },
  { i: Wallet, t: `${FEATURES.deposit} — optional` },
  { i: Video, t: 'Quarterly video inspections' },
  { i: Wrench, t: 'Maintenance & repairs coordination' },
  { i: Receipt, t: 'Property tax / BBMP payments' },
  { i: FileBarChart, t: 'Monthly statement' },
  { i: CalendarClock, t: 'Lease renewals & move-out reports' },
];

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-800 via-indigo-900 to-ink-900 text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="chip bg-white/10 text-indigo-100"><Globe2 className="h-4 w-4" />{FEATURES.nri} · planned add-on</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Your Bengaluru home, handled from anywhere.</h1>
            <p className="mt-4 text-lg text-indigo-100">For NRIs in the US, UK, UAE, Singapore, Australia and beyond: video site visits in your time zone, a remote buying flow with partner-lawyer checks, and full management of the home you own back in Bengaluru.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/search/?deal=buy" className="btn-accent px-5 py-3">Browse homes & book a video visit <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/pricing/" className="btn bg-white/10 px-5 py-3 text-white hover:bg-white/20">Draft pricing</Link>
            </div>
            <p className="mt-4 text-xs text-indigo-200">These are planned services for the prototype. Partners, scope and pricing are drafts and subject to change.</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="text-sm font-semibold text-indigo-100">Who it’s for</div>
            <ul className="mt-3 space-y-3 text-sm">
              {['Buying a flat in Bengaluru while living abroad', 'Renting out a home you already own', 'Parents in Bengaluru, you abroad — sharing the decisions', 'Selling a property as an NRI (TDS & repatriation questions)'].map((x) => <li key={x} className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-saffron-300" />{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x mt-14">
        <p className="eyebrow">Time zones</p><h2 className="h-section mt-2">Visits scheduled for your clock, not just IST</h2>
        <div className="mt-6"><NriClock /></div>
      </section>

      <section className="container-x mt-16">
        <p className="eyebrow">Planned services</p><h2 className="h-section mt-2">Buying from abroad</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.t} className="card p-6"><s.i className="h-7 w-7 text-indigo-600" /><h3 className="mt-3 font-semibold">{s.t}</h3><p className="mt-1.5 text-sm text-ink-500">{s.d}</p></div>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <div className="card grid gap-8 p-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h2 className="mt-3 font-display text-2xl font-extrabold">Property management for NRI owners</h2>
            <p className="mt-2 text-sm text-ink-600">Hand over the keys and get a monthly statement. Owners stay in control of every decision — tenant approval, rent, repairs above a limit you set.</p>
            <Link href="/post/" className="btn-primary mt-5">List your home (toggle “I’m an NRI”)</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MANAGE.map((m) => <li key={m.t} className="flex items-center gap-3 rounded-xl bg-ink-50 p-3 text-sm font-medium"><m.i className="h-5 w-5 shrink-0 text-indigo-600" />{m.t}</li>)}
          </ul>
        </div>
      </section>

      <section className="container-x mt-16 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold">Power of Attorney — guidance</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-600">
            <li>A specific PoA for one property transaction is usually safer than a general PoA.</li>
            <li>Executed abroad, a PoA is typically signed before an Indian Embassy / Consulate officer, or notarised and apostilled in Hague Convention countries.</li>
            <li>Once it reaches India it generally needs to be adjudicated and stamped in Karnataka within the prescribed time, and a PoA used to sell or transfer property is typically registered at the Sub-Registrar’s office.</li>
            <li>{BRAND.name} NRI would help draft the PoA with partner lawyers and coordinate stamping and registration.</li>
          </ul>
          <p className="mt-4 flex gap-2 rounded-xl bg-saffron-50 p-3 text-xs text-saffron-800"><Info className="h-4 w-4 shrink-0" />Guidance only, not legal advice. Requirements vary by country and transaction; confirm with a qualified lawyer.</p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold">NRE/NRO, FEMA & TDS — the basics</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-600">
            <li><strong>FEMA:</strong> NRIs can generally buy residential and commercial property in India, but not agricultural land, plantation property or farmhouses (except by inheritance).</li>
            <li><strong>Paying for it:</strong> via inward remittance or from NRE / NRO / FCNR(B) accounts; home loans from Indian lenders are available to NRIs.</li>
            <li><strong>Rent:</strong> usually credited to an NRO account; tenants paying rent to an NRI are generally required to deduct TDS.</li>
            <li><strong>Selling:</strong> the buyer generally deducts TDS on the NRI seller’s capital gains (Section 195). A lower-deduction certificate can be applied for in some cases.</li>
            <li><strong>Repatriation:</strong> sale proceeds may be repatriated subject to limits and conditions (for example, the annual limit on NRO remittances and Form 15CA/15CB requirements).</li>
          </ul>
          <p className="mt-4 flex gap-2 rounded-xl bg-saffron-50 p-3 text-xs text-saffron-800"><Info className="h-4 w-4 shrink-0" />General information only, not tax or legal advice. Rates, limits and rules change; check current RBI/FEMA and Income Tax rules with a chartered accountant.</p>
        </div>
      </section>

      <section className="container-x mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white sm:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1.5fr_1fr]">
            <div><h2 className="font-display text-3xl font-extrabold">{FEATURES.nri} plans (draft)</h2><p className="mt-2 text-ink-300">NRI Visit from ₹999 per video visit · NRI Buy from ₹14,999 per property · NRI Manage ~8% of monthly rent. Draft pricing, subject to change.</p></div>
            <div className="flex md:justify-end"><Link href="/pricing/" className="btn-accent px-6 py-3.5">See all plans <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
