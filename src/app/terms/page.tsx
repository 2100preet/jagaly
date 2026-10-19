import type { Metadata } from 'next';
import PolicyPage, { Contact, Placeholder } from '@/components/policy/PolicyPage';
import { BRAND } from '@/config/brand';
export const metadata: Metadata = { title: 'Terms of use', description: `Terms for using the ${BRAND.name} website and app.` };

export default function Page() {
  return (
    <PolicyPage title="Terms of use"
      intro={<p>By using the {BRAND.name} website or app you agree to these terms. {BRAND.name} is in early access: <strong>listings, prices, scores and reviews are sample data</strong> for demonstration and do not represent real properties or offers.</p>}
      sections={[
        { id: 'service', t: 'The service', b: <p>{BRAND.name} lets you explore homes and commercial spaces in {BRAND.city}, compare prices, and use tools such as the Flood &amp; Monsoon Check, Peak-Hour Commute, True Monthly Cost, Deposit Fairness Meter and Agreement Red-Flag Scan. Flood data comes from BBMP public records via OpenCity; other figures are estimates or sample data.</p> },
        { id: 'advice', t: 'No professional advice', b: <p>Scores, estimates and agreement flags are for information only. They are not legal, financial, valuation or engineering advice. Check documents with a qualified professional before you pay or sign anything.</p> },
        { id: 'deposit', t: 'Deposit Safe is optional', b: <p>Deposit Safe is an optional feature. Owners and tenants are never required to use it. When it launches it will be provided through a regulated partner; {BRAND.name} will not hold your money.</p> },
        { id: 'use', t: 'Acceptable use', b: <ul><li>Do not post false, misleading or someone else’s property.</li><li>Do not scrape the service, send spam or harass other users.</li><li>Do not use the service for unlawful purposes.</li></ul> },
        { id: 'ip', t: 'Content and intellectual property', b: <p>The {BRAND.name} name, logo and software belong to {BRAND.legalEntity}. Public data sources keep their own licences and are credited where used.</p> },
        { id: 'liability', t: 'Liability', b: <p>The service is provided “as is” during early access. To the extent allowed by law, we are not liable for decisions made using sample data or estimates.</p> },
        { id: 'law', t: 'Governing law', b: <p>These terms are governed by the laws of India, with courts in {BRAND.city}, Karnataka having jurisdiction. <Placeholder>to be reviewed by counsel</Placeholder></p> },
        { id: 'contact', t: 'Contact and grievances', b: <p>Write to <Contact />. We aim to acknowledge within 24 hours and resolve within 15 days.</p> },
      ]} />
  );
}
