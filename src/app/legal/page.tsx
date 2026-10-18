import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';
export const metadata: Metadata = { title: 'Legal' };

const SECTIONS = [
  { id: 'terms', t: 'Terms of use', b: `Placeholder. These terms will govern use of ${BRAND.name}. Listings shown in this prototype are sample data and do not represent real properties or offers.` },
  { id: 'privacy', t: 'Privacy policy', b: `Placeholder. ${BRAND.name} will process personal data in line with the Digital Personal Data Protection Act, 2023. Phone numbers are masked and never sold. This prototype stores form data only in your browser’s localStorage.` },
  { id: 'rera', t: 'RERA disclaimer', b: `Placeholder. ${BRAND.name} is a technology platform and not a real estate agent/promoter. Project data shown is sample and in a format similar to Karnataka RERA disclosures; buyers should verify registration on rera.karnataka.gov.in. Registration as an agent under RERA, if applicable, to be completed before launch.` },
  { id: 'grievance', t: 'Grievance officer', b: `Placeholder. Name: TBD · Email: grievance@${BRAND.domain} · Address: Bengaluru, Karnataka. Response within 24 hours, resolution within 15 days as per IT Rules, 2021.` },
];

export default function Page() {
  return (
    <div className="container-x max-w-3xl py-14">
      <h1 className="font-display text-4xl font-extrabold">Legal</h1>
      <p className="mt-2 text-sm text-ink-500">All content on this page is a placeholder for the prototype and is not legal advice.</p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((s) => <section key={s.id} id={s.id} className="card scroll-mt-24 p-6"><h2 className="font-display text-xl font-bold">{s.t}</h2><p className="mt-2 text-sm leading-relaxed text-ink-600">{s.b}</p></section>)}
      </div>
    </div>
  );
}
