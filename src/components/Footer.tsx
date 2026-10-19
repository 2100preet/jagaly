import Link from 'next/link';
import Logo from './Logo';
import { BRAND } from '@/config/brand';
import { LOCALITIES } from '@/data/geo';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-ink-300">
      <div className="container-x grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo light className="h-10" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">{BRAND.tagline} Built in {BRAND.city} for people who are tired of fake listings, broker spam and lost deposits. Prototype: all data is sample data.</p>
          <p className="mt-4 text-xs text-ink-500">Prototype · All listings, scores and prices shown are <strong className="text-ink-300">sample data</strong> for demonstration only.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            {LOCALITIES.slice(0, 6).map((l) => (
              <li key={l.name}><Link className="hover:text-white" href={`/search/?locality=${encodeURIComponent(l.name)}`}>Homes in {l.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/features/">What makes Jagaly different</Link></li>
            <li><Link className="hover:text-white" href="/post/">Post property free</Link></li>
            <li><Link className="hover:text-white" href="/search/?seg=com&deal=rent">Commercial spaces</Link></li>
            <li><Link className="hover:text-white" href="/deposit-safe/">Deposit Safe (optional)</Link></li>
            <li><Link className="hover:text-white" href="/verified-tenant/">Verified Tenant</Link></li>
            <li><Link className="hover:text-white" href="/nri/">Jagaly NRI</Link></li>
            <li><Link className="hover:text-white" href="/project-tracker/">RERA project tracker</Link></li>
            <li><Link className="hover:text-white" href="/pricing/">Pricing</Link></li>
            <li><Link className="hover:text-white" href="/about/">How it works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/terms/">Terms of use</Link></li>
            <li><Link className="hover:text-white" href="/privacy/">Privacy policy</Link></li>
            <li><Link className="hover:text-white" href="/delete-account/">Delete account &amp; data</Link></li>
            <li><Link className="hover:text-white" href="/support/">Support</Link></li>
            <li><Link className="hover:text-white" href="/legal/#rera">RERA disclaimer</Link></li>
            <li><Link className="hover:text-white" href="/legal/#grievance">Grievance officer</Link></li>
          </ul>
          <p className="mt-4 text-xs text-ink-500">{BRAND.supportEmail}<br />{BRAND.supportPhone}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-500 sm:flex-row sm:justify-between">
          <span>© 2026 {BRAND.legalEntity}. All rights reserved.</span>
          <span>CIN: U00000KA2026PTC000000 (placeholder) · Made with ♥ in Bengaluru</span>
        </div>
      </div>
    </footer>
  );
}
