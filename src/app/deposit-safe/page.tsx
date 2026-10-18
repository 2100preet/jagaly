import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Landmark, FileSignature, ClipboardCheck, Scale, Banknote, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { BRAND } from '@/config/brand';
import DepositEstimator from './DepositEstimator';

export const metadata: Metadata = { title: 'Deposit Safe — bank-escrow security deposit' };

const STEPS = [
  { i: FileSignature, t: 'Sign a digital rental agreement', d: 'Standard Karnataka 11-month agreement, pre-filled from the listing. e-Stamp + Aadhaar e-sign in 10 minutes (planned integration).' },
  { i: Landmark, t: 'Deposit goes into escrow', d: 'You pay the deposit into a dedicated bank escrow account with a regulated partner — not the owner’s savings account. ' + BRAND.name + ' never holds your money.' },
  { i: ClipboardCheck, t: 'Move-in condition report', d: 'Both sides record a timestamped photo + video checklist of every room on move-in day inside the app.' },
  { i: Scale, t: 'Fair, fast move-out', d: 'On move-out, the same checklist is repeated. Undisputed amount is released within 48 h; disputes go to a neutral mediator, decided in 7 days.' },
];

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="chip bg-white/10 text-saffron-200"><ShieldCheck className="h-4 w-4" />Deposit Safe</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Bangalore’s 10-month deposit problem, solved.</h1>
            <p className="mt-4 text-lg text-brand-100">Tenants in Bangalore routinely hand over 6–10 months of rent with nothing but trust. {BRAND.name} Deposit Safe keeps it in a bank escrow with a regulated partner — {BRAND.name} never holds the money — and releases it on a fair, documented checklist.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/search/?deal=rent&verified=1" className="btn-accent px-5 py-3">Find a Deposit Safe home <ArrowRight className="h-4 w-4" /></Link><a href="#how" className="btn bg-white/10 px-5 py-3 text-white hover:bg-white/20">How it works</a></div>
            <p className="mt-4 text-xs text-brand-200">Concept explainer for the prototype. Escrow partner, fees and legal structure to be finalised.</p>
          </div>
          <DepositEstimator />
        </div>
      </section>

      <section id="how" className="container-x mt-16">
        <p className="eyebrow">How it works</p><h2 className="h-section mt-2">Four steps. Zero awkward WhatsApp fights.</h2>
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
          <h3 className="font-display text-xl font-bold">Without Deposit Safe</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-600">
            {['Deposit sits in the owner’s account, often spent', '“Painting charges” of 1–2 months deducted arbitrarily', 'Refund takes weeks of follow-up calls', 'No evidence of move-in condition', 'Only remedy is a slow civil court case'].map((x) => <li key={x} className="flex gap-2"><XCircle className="h-5 w-5 shrink-0 text-red-500" />{x}</li>)}
          </ul>
        </div>
        <div className="card border-brand-200 bg-brand-50/40 p-6">
          <h3 className="font-display text-xl font-bold text-brand-800">With Deposit Safe</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-700">
            {['Money held in escrow, untouchable by either party', 'Deductions only for documented damage, capped by agreement', 'Undisputed amount released in 48 hours', 'Shared photo/video move-in & move-out reports', 'Neutral mediation in 7 days, binding by agreement'].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />{x}</li>)}
          </ul>
        </div>
      </section>

      <section className="container-x mt-16">
        <div className="card grid gap-8 p-8 md:grid-cols-3">
          <div><Banknote className="h-7 w-7 text-saffron-500" /><h3 className="mt-3 font-semibold">For owners</h3><p className="mt-1 text-sm text-ink-500">Guaranteed deposit is real money (not a promise), tenants are KYC-verified, and rent can be auto-collected via UPI AutoPay.</p></div>
          <div><ShieldCheck className="h-7 w-7 text-saffron-500" /><h3 className="mt-3 font-semibold">For tenants</h3><p className="mt-1 text-sm text-ink-500">Option to pay just 2 months upfront with a Deposit Safe bond covering the rest (planned, via insurance partner).</p></div>
          <div><FileSignature className="h-7 w-7 text-saffron-500" /><h3 className="mt-3 font-semibold">Digital rental agreement</h3><p className="mt-1 text-sm text-ink-500">e-Stamped, e-signed, stored in the app with clear clauses on notice period, lock-in, maintenance and deductions.</p></div>
        </div>
      </section>

      <section className="container-x mt-16 max-w-3xl">
        <h2 className="h-section">FAQ</h2>
        <div className="mt-6 space-y-3">
          {[
            ['Who holds the money?', 'A regulated bank / trustee escrow partner (to be finalised). ' + BRAND.name + ' never holds your money — not in its own accounts, not on its balance sheet.'],
            ['Is the digital agreement legally valid?', 'Yes — e-stamped agreements with Aadhaar-based e-signatures are commonly used in Karnataka. Registration requirements depend on term; we will guide you. (Not legal advice.)'],
            ['What does it cost?', 'Draft: ₹499 one-time per agreement, split 50/50 by default. See pricing.'],
            ['What if the owner refuses?', 'Deposit Safe-eligible listings are marked. Owners opting in get a badge and rank higher in search.'],
          ].map(([q, a]) => (
            <details key={q} className="card group p-5"><summary className="cursor-pointer list-none font-semibold marker:hidden">{q}<span className="float-right text-ink-400 group-open:rotate-45 transition">+</span></summary><p className="mt-2 text-sm text-ink-600">{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
