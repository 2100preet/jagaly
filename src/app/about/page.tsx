import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Video, PhoneOff, CalendarCheck, FileSignature, KeyRound, Target, HeartHandshake, Eye } from 'lucide-react';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = { title: 'About & how it works' };

export default function Page() {
  const steps = [
    { i: Search, t: 'Search smarter', d: 'Filter by commute, Home Truth Scores, pets, tenant type and True Price — not just BHK and budget.' },
    { i: Video, t: 'Trust what you see', d: 'Verified listings have an on-site video walk-through with a GPS geotag. Fake? We refund your visit.' },
    { i: PhoneOff, t: 'Talk privately', d: 'Your number is masked. Owners and builders can’t share it, brokers get blocked automatically.' },
    { i: CalendarCheck, t: 'Book a slot', d: 'Pick an in-person or live-video visit slot. No “come today itself sir” pressure.' },
    { i: FileSignature, t: 'Sign digitally', d: 'Agreement, e-stamp and e-sign inside the app. Deposit goes into Deposit Safe escrow.' },
    { i: KeyRound, t: 'Move in', d: 'Condition report on day one means a fair, fast refund on the last day.' },
  ];
  return (
    <>
      <section className="container-x py-14">
        <div className="max-w-3xl">
          <p className="eyebrow">About {BRAND.name}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">We’re building the property platform Bangalore deserves.</h1>
          <p className="mt-5 text-lg text-ink-600">Every Bangalorean has a story: the ₹38K flat that turned out to be a 1RK, the 40 broker calls after filling one form, the deposit that came back three months late minus “painting”. {BRAND.name} exists to end those stories — starting with 8 localities and a promise: if it’s on {BRAND.name} and it’s verified, it’s real.</p>
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
          <div><h2 className="font-display text-2xl font-bold">How verification works</h2><p className="mt-2 text-sm text-ink-600">Owners record a continuous walk-through from inside the {BRAND.name} app. We check the GPS geotag against the listed address, run frame continuity checks to catch re-uploads, and a human reviewer in Bangalore approves the badge. Ownership documents are matched for the “Docs verified” tick. Re-verification is needed every 60 days or after any edit to photos/price.</p></div>
          <div><h2 className="font-display text-2xl font-bold">How we make money</h2><p className="mt-2 text-sm text-ink-600">Optional paid services — Tenant Plus, owner Assured plans, Buyer Pro legal checks and Deposit Safe fees — plus builder project listings that must pass our delay-tracker disclosure. We never sell your phone number. Ever.</p><Link href="/pricing/" className="btn-primary mt-4">See draft pricing</Link></div>
        </div>
      </section>
    </>
  );
}
