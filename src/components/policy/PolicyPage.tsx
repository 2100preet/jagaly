import Link from 'next/link';
import { BRAND } from '@/config/brand';

export const SUPPORT_EMAIL = 'support@jagaly.example'; // PLACEHOLDER: replace with a real, monitored inbox before store submission
export const POLICY_UPDATED = '19 October 2026';

export function Placeholder({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-coral-50 px-1 font-semibold text-coral-700">{children}</mark>;
}
export function Contact() {
  return <><a className="font-semibold text-brand-700 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> <Placeholder>placeholder address, to be replaced</Placeholder></>;
}

export default function PolicyPage({ title, intro, sections }: { title: string; intro: React.ReactNode; sections: { id: string; t: string; b: React.ReactNode }[] }) {
  return (
    <div className="container-x max-w-3xl py-14">
      <p className="eyebrow">{BRAND.name} · Legal</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated {POLICY_UPDATED}. Applies to the {BRAND.name} website and the {BRAND.name} mobile app (Android and iOS, package/bundle ID in.jagaly.app).</p>
      <div className="mt-5 text-[15px] leading-relaxed text-ink-700">{intro}</div>
      <nav className="mt-6 flex flex-wrap gap-2">{sections.map((s) => <a key={s.id} href={`#${s.id}`} className="chip border border-ink-200 bg-white text-ink-600 hover:border-brand-300">{s.t}</a>)}</nav>
      <div className="mt-8 space-y-5">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="card scroll-mt-24 p-6">
            <h2 className="font-display text-xl font-bold">{s.t}</h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-700 [&_li]:ml-5 [&_li]:list-disc">{s.b}</div>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-500">Related: <Link className="text-brand-700 underline" href="/privacy/">Privacy policy</Link> · <Link className="text-brand-700 underline" href="/terms/">Terms of use</Link> · <Link className="text-brand-700 underline" href="/delete-account/">Account &amp; data deletion</Link> · <Link className="text-brand-700 underline" href="/support/">Support</Link></p>
    </div>
  );
}
