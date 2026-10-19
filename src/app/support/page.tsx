import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage, { Contact, Placeholder } from '@/components/policy/PolicyPage';
import { BRAND } from '@/config/brand';
export const metadata: Metadata = { title: 'Support', description: `Get help with the ${BRAND.name} app and website.` };

export default function Page() {
  return (
    <PolicyPage title="Support"
      intro={<p>Questions, bugs or feedback about the {BRAND.name} app or website? Email <Contact />. We aim to reply within one working day (IST).</p>}
      sections={[
        { id: 'faq', t: 'Common questions', b: <ul><li><strong>Are these real listings?</strong> Not yet. During early access, listings, prices and scores are sample data. Flood data is real BBMP public data.</li><li><strong>The OTP never arrives.</strong> No SMS is sent in this version. Use the demo code shown on screen (2468).</li><li><strong>How do I delete my data?</strong> Profile → Delete my data. See <Link className="text-brand-700 underline" href="/delete-account/">Account &amp; data deletion</Link>.</li><li><strong>Is Deposit Safe compulsory?</strong> No, it is always optional.</li></ul> },
        { id: 'contact', t: 'Contact', b: <p>Email: <Contact />. Grievance officer: <Placeholder>name to be appointed</Placeholder>, {BRAND.city}, Karnataka.</p> },
      ]} />
  );
}
