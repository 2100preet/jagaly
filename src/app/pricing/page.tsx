import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Info } from 'lucide-react';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = { title: 'Pricing (draft)' };

type Plan = { name: string; price: string; note?: string; cta: string; features: string[]; hot?: boolean };
const GROUPS: { who: string; blurb: string; plans: Plan[] }[] = [
  { who: 'Tenants', blurb: 'Find a verified rental without paying a broker a month’s rent.', plans: [
    { name: 'Free', price: '₹0', cta: 'Start searching', features: ['Browse all listings & Home Truth Scores', '15 masked owner contacts / month', 'True Price on every listing', 'AI assistant'] },
    { name: 'Tenant Plus', price: '₹499', note: 'one-time, 60 days', hot: true, cta: 'Get Tenant Plus', features: ['Unlimited masked contacts', 'Priority visit slots', 'Digital rental agreement included', 'Deposit Safe setup included', 'Relationship-free support on WhatsApp'] },
  ] },
  { who: 'Owners', blurb: 'List free forever. Pay only if you want us to do more.', plans: [
    { name: 'Free listing', price: '₹0', cta: 'Post property', features: ['Unlimited listing duration', 'Verified badge (with video)', 'AI-written description', 'Masked calls, spam filtered'] },
    { name: 'Boost', price: '₹799', note: 'one-time', cta: 'Boost listing', features: ['Top of search for 14 days', 'Pro photo shoot (Bangalore)', 'Featured in locality alerts'] },
    { name: 'Assured', price: '₹1,999', note: 'per tenancy', hot: true, cta: 'Get Assured', features: ['Tenant KYC & background check', 'Digital agreement + e-stamp', 'Deposit Safe escrow', 'UPI rent auto-collection', 'Move-in/out condition report'] },
  ] },
  { who: 'Buyers', blurb: 'Make a ₹1 crore decision with real data, not brochures.', plans: [
    { name: 'Free', price: '₹0', cta: 'Explore homes', features: ['True Price & Home Truth Scores', 'Builder delay tracker', 'EMI & rent-vs-buy calculators'] },
    { name: 'Buyer Pro', price: '₹1,499', note: 'one-time', hot: true, cta: 'Get Buyer Pro', features: ['Detailed True Price report with comps', 'Khata & EC pre-check', 'Free cab for 3 site visits', 'Negotiation brief'] },
    { name: 'Legal Check', price: '₹4,999', note: 'per property', cta: 'Get Legal Check', features: ['Advocate title search (30 yrs)', 'Sale agreement review', 'RERA & approval verification', 'Home loan assistance'] },
  ] },
];

export default function Page() {
  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip bg-saffron-100 text-saffron-700">Draft pricing · subject to change</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Simple pricing. Way less than a broker.</h1>
        <p className="mt-3 text-ink-600">Core features are free for everyone. Paid plans are priced to undercut typical “no-broker” subscription plans in Bangalore — with more included.</p>
      </div>
      <div className="mt-12 space-y-14">
        {GROUPS.map((g) => (
          <section key={g.who}>
            <div className="mb-5"><h2 className="h-section">{g.who}</h2><p className="text-ink-500">{g.blurb}</p></div>
            <div className={`grid gap-5 ${g.plans.length === 2 ? 'md:grid-cols-2 lg:max-w-4xl' : 'md:grid-cols-3'}`}>
              {g.plans.map((p) => (
                <div key={p.name} className={`card relative flex flex-col p-6 ${p.hot ? 'border-2 border-brand-500 shadow-lift' : ''}`}>
                  {p.hot && <span className="chip absolute -top-3 left-6 bg-brand-600 text-white">Most popular</span>}
                  <div className="font-semibold text-ink-600">{p.name}</div>
                  <div className="mt-2 flex items-baseline gap-1.5"><span className="font-display text-4xl font-extrabold">{p.price}</span>{p.note && <span className="text-sm text-ink-500">{p.note}</span>}</div>
                  {p.price !== '₹0' && <div className="text-xs text-ink-400">+ 18% GST</div>}
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                    {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-brand-600" />{f}</li>)}
                  </ul>
                  <Link href={g.who === 'Owners' ? '/post/' : '/search/'} className={`mt-6 ${p.hot ? 'btn-primary' : 'btn-ghost'}`}>{p.cta}</Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-14 rounded-2xl bg-ink-100 p-5 text-sm text-ink-600"><Info className="mr-1 inline h-4 w-4" />Draft pricing for the {BRAND.name} prototype. Competitor comparisons are directional; verify current competitor prices before any public claim. No payment is collected on this site.</div>
    </div>
  );
}
