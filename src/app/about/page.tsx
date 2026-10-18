import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Video, PhoneOff, CalendarCheck, FileSignature, KeyRound, Target, HeartHandshake, Eye } from 'lucide-react';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = { title: 'About & how it works' };

export default function Page() {
  const steps = [
    { i: Search, t: 'Search smarter', d: 'Filter by commute, Home Truth Scores, pets, tenant type and True Price — not just BHK and budget.' },
    { i: Video, t: 'Trust what you see', d: 'Every Proof listing has a phone-verified owner and a live in-app video walk-through with GPS. Fake? We refund your fee plus credit.' },
    { i: PhoneOff, t: 'Talk privately', d: 'Your number is masked. Owners and builders can’t share it, brokers get blocked automatically.' },
    { i: CalendarCheck, t: 'Book a slot', d: 'Pick an in-person or live-video slot (time-zone aware for NRIs). Optional Verified Tenant puts you first in the owner’s inbox.' },
    { i: FileSignature, t: 'Sign digitally', d: 'Agreement, e-stamp and e-sign inside the app. Ownership documents are checked at this stage. Deposit Safe escrow if both sides opt in.' },
    { i: KeyRound, t: 'Move in', d: 'Condition report on day one means a fair, fast refund on the last day.' },
  ];
  return (
    <>
      <section className="container-x py-14">
        <div className="max-w-3xl">
          <p className="eyebrow">About {BRAND.name}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">We’re building the property platform Bangalore deserves.</h1>
          <p className="mt-5 text-lg text-ink-600">Every Bangalorean has a story: the ₹38K flat that turned out to be a 1RK, the 40 broker calls after filling one form, the deposit that came back three months late minus “painting”. {BRAND.name} exists to end those stories — starting with Bangalore and a promise: if it’s on {BRAND.name} and it’s verified, it’s real.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[[Target, 'Mission', 'Make renting and buying a home in India as transparent as booking a flight.'], [Eye, 'Radical transparency', 'True Price, Home Truth Scores and builder delays are shown to everyone, free.'], [HeartHandshake, 'Fair to both sides', 'Owners list free; tenants and buyers never pay brokerage.']].map(([I, t, d]: any) => (
            <div key={t} className="card p-6"><I className="h-6 w-6 text-saffron-500" /><h3 className="mt-3 font-display text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-ink-500">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="bg-white py-14">
        <div className="container-x">
          <p className="eyebrow">How it works</p><h2 className="h-section mt-2">From search to keys in six steps</h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.t} className="flex gap-4">
                <div className="flex flex-col items-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white"><s.i className="h-5 w-5" /></span></div>
                <div><div className="text-xs font-bold text-brand-600">STEP {i + 1}</div><h3 className="font-display text-lg font-bold">{s.t}</h3><p className="mt-1 text-sm text-ink-500">{s.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-14">
        <div className="card grid gap-6 p-8 md:grid-cols-2">
          <div><h2 className="font-display text-2xl font-bold">How verification works</h2><p className="mt-2 text-sm text-ink-600">Owners never need to upload a sale deed to list. <strong>Tier 1 (required):</strong> phone OTP plus a continuous walk-through recorded live in the {BRAND.name} app — we check the GPS geotag against the listed locality and run frame-continuity checks, then a human reviewer approves {BRAND.name} Proof. <strong>Tier 2 (optional “Verified Owner”):</strong> a recent property tax receipt or electricity bill, blurred in-app so only name + address are visible; kept private, used only for a name match, deletable anytime. <strong>Tier 3 (deal stage only):</strong> when a serious tenant or buyer proceeds, documents are checked — for sales, by partner lawyers. Re-verification every 60 days or after edits.</p></div>
          <div><h2 className="font-display text-2xl font-bold">How we make money</h2><p className="mt-2 text-sm text-ink-600">Optional paid services — Tenant Plus, owner Assured plans, Buyer Pro legal checks, optional Deposit Safe add-ons and planned Pakka NRI services — plus builder project listings that must pass our delay-tracker disclosure. We never sell your phone number. Ever.</p><Link href="/pricing/" className="btn-primary mt-4">See draft pricing</Link></div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href="/verified-tenant/" className="card p-5 hover:shadow-lift"><div className="font-semibold">Verified Tenant (optional) →</div><p className="mt-1 text-sm text-ink-500">ID check via DigiLocker or Aadhaar offline e-KYC through a licensed partner. We never store your Aadhaar number.</p></Link>
          <Link href="/nri/" className="card p-5 hover:shadow-lift"><div className="font-semibold">{BRAND.name} NRI (planned) →</div><p className="mt-1 text-sm text-ink-500">Video visits across time zones, remote buying, PoA guidance and property management.</p></Link>
        </div>
      </section>
      <section className="container-x max-w-3xl pb-14">
        <h2 className="h-section">FAQ</h2>
        <div className="mt-6 space-y-3">
          {[
            ['Do I need to upload a sale deed to list my property?', 'No. To list you only need phone OTP + a live in-app video walk-through with GPS (Tier 1). Ownership documents are checked only at deal stage, when a serious tenant or buyer proceeds.'],
            ['What is the “Verified Owner” badge?', 'An optional Tier 2 badge. Upload a recent property tax receipt or electricity bill, use the in-app blur tool so only your name and address are visible, and we match the name to your account. The document is kept private, never shown to tenants or buyers, and you can delete it anytime. Verified Owner listings rank higher.'],
            ['What happens at deal stage?', 'Tier 3: when a tenant or buyer is ready to proceed, ownership documents are checked before money changes hands. For sales, this is done by partner lawyers.'],
            ['Is Deposit Safe required?', 'No. Deposit Safe is optional for owners and tenants. Owners who opt in get a badge and ranking boost; listings without it are never hidden.'],
            ['Is Verified Tenant required?', 'No. It’s an optional, free ID check through a licensed KYC partner. Owners can choose to accept only Verified Tenants (off by default).'],
          ].map(([q, a]) => (
            <details key={q} className="card group p-5"><summary className="cursor-pointer list-none font-semibold marker:hidden">{q}<span className="float-right text-ink-400 transition group-open:rotate-45">+</span></summary><p className="mt-2 text-sm text-ink-600">{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
