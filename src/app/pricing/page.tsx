import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Info } from 'lucide-react';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = { title: 'Pricing (draft)' };

type Plan = { name: string; price: string; note?: string; cta: string; features: string[]; hot?: boolean };
const GROUPS: { who: string; blurb: string; plans: Plan[]; href?: string }[] = [
  { who: 'Tenants', blurb: 'Find a verified rental without paying brokerage.', plans: [
    { name: 'Free', price: '₹0', cta: 'Start searching', features: ['Browse all listings & Home Truth Scores', '15 masked owner contacts / month', 'True Price on every listing', 'Verified Tenant ID check (optional, free)', 'AI assistant'] },
    { name: 'Tenant Plus', price: '₹499', note: 'one-time, 60 days', hot: true, cta: 'Get Tenant Plus', features: ['Unlimited masked contacts', 'Priority visit slots', 'Digital rental agreement included', 'Request Deposit Safe on any rental (owner may accept)', 'Support on WhatsApp'] },
  ] },
  { who: 'Owners', blurb: 'List free forever, with zero obligation. Every extra is optional.', plans: [
    { name: 'Free listing', price: '₹0', cta: 'Post property', features: ['Unlimited listing duration', 'Pakka Proof: phone OTP + live video (no sale deed needed)', 'Optional Verified Owner badge (tax receipt or electricity bill, kept private)', 'Optional “Only Verified Tenants can contact me”', 'Masked calls, spam filtered'] },
    { name: 'Boost', price: '₹799', note: 'one-time', cta: 'Boost listing', features: ['Top of search for 14 days', 'Pro photo shoot (Bangalore)', 'Featured in locality alerts'] },
    { name: 'Assured', price: '₹1,999', note: 'per tenancy', hot: true, cta: 'Get Assured', features: ['Verified Tenant + background check assistance', 'Digital agreement + e-stamp', 'Police tenant verification assistance (planned)', 'UPI rent auto-collection', 'Move-in/out video condition report'] },
  ] },
  { who: 'Deposit Safe (optional)', blurb: 'Opt in per tenancy — or not at all. Listings without it are never penalised.', href: '/deposit-safe/', plans: [
    { name: 'Deposit Safe Owner', price: '₹0', note: 'opt-in', cta: 'Learn more', features: ['“Deposit Safe Owner” badge, ranks higher', 'Faster tenant matching', 'Free digital rental agreement', 'Documented damage released to you (AI video comparison)'] },
    { name: 'Owner protection add-on', price: '₹2,499', note: 'per year (draft)', hot: true, cta: 'Learn more', features: ['Rent-default cover (planned, via insurance partner)', 'Damage cover beyond the deposit (planned)', 'Neutral mediation for disputes'] },
    { name: 'Deposit-free plan', price: '~3–4%', note: 'of rent / month, paid by tenant (draft)', cta: 'Learn more', features: ['Tenant pays a small fee instead of a large deposit', 'Only where the owner offers it', 'Verified Tenants eligible', 'Owner covered by the protection add-on'] },
  ] },
  { who: 'Buyers', blurb: 'Make a big decision with real data, not brochures.', plans: [
    { name: 'Free', price: '₹0', cta: 'Explore homes', features: ['True Price & Home Truth Scores', 'Builder delay tracker', 'EMI & rent-vs-buy calculators'] },
    { name: 'Buyer Pro', price: '₹1,499', note: 'one-time', hot: true, cta: 'Get Buyer Pro', features: ['Detailed True Price report with comps', 'Khata & EC pre-check', 'Free cab for 3 site visits', 'Negotiation brief'] },
    { name: 'Legal Check', price: '₹4,999', note: 'per property', cta: 'Get Legal Check', features: ['Partner-lawyer title search (30 yrs) at deal stage', 'Sale agreement review', 'RERA & approval verification', 'Home loan assistance'] },
  ] },
  { who: 'Pakka NRI (planned)', blurb: 'For Bangalore homes bought or owned from abroad. Planned services; draft pricing.', href: '/nri/', plans: [
    { name: 'NRI Visit', price: '₹999', note: 'per live video visit (draft)', cta: 'See Pakka NRI', features: ['Verified Pakka agent on-site', 'Scheduled in your time zone', 'Recording + Home Truth Score report'] },
    { name: 'NRI Buy', price: '₹14,999', note: 'per property (draft)', hot: true, cta: 'See Pakka NRI', features: ['Remote buying flow + digital document review', 'Partner-lawyer title/legal check', 'e-Khata, RERA & encumbrance verification', 'PoA guidance & drafting support', 'Dedicated WhatsApp concierge'] },
    { name: 'NRI Manage', price: '8%', note: 'of monthly rent (draft)', cta: 'See Pakka NRI', features: ['Tenant finding with Pakka Proof', 'Rent collection to NRE/NRO', 'Quarterly video inspections', 'Maintenance, property tax/BBMP payments', 'Monthly statement'] },
  ] },
];

export default function Page() {
  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip bg-saffron-100 text-saffron-700">Draft pricing · subject to change</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Free to start. Pay only for extras.</h1>
        <p className="mt-3 text-ink-600">Core features are free for tenants, owners and buyers. Everything else is optional. All prices are drafts for this prototype.</p>
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
                  {p.price.startsWith('₹') && p.price !== '₹0' && <div className="text-xs text-ink-400">+ 18% GST</div>}
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                    {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-brand-600" />{f}</li>)}
                  </ul>
                  <Link href={g.href ?? (g.who === 'Owners' ? '/post/' : '/search/')} className={`mt-6 ${p.hot ? 'btn-primary' : 'btn-ghost'}`}>{p.cta}</Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-14 rounded-2xl bg-ink-100 p-5 text-sm text-ink-600"><Info className="mr-1 inline h-4 w-4" />Draft pricing for the {BRAND.name} prototype — subject to change. Insurance, escrow, KYC and legal services would be provided by licensed partners (to be finalised). No payment is collected on this site.</div>
    </div>
  );
}
