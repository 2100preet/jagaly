import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, FileKey2, Fingerprint, Briefcase, Inbox, Zap, HandCoins, Lock, EyeOff, ShieldCheck, Siren, ArrowRight } from 'lucide-react';
import { BRAND, FEATURES } from '@/config/brand';

export const metadata: Metadata = { title: 'Verified Tenant — optional ID verification' };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-950 text-white">
        <div className="container-x py-16">
          <span className="chip bg-white/10 text-indigo-100"><BadgeCheck className="h-4 w-4" />Optional · free for tenants</span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">{FEATURES.tenant}: get taken seriously, faster.</h1>
          <p className="mt-4 max-w-2xl text-lg text-indigo-100">Verify your ID once through a licensed KYC partner using DigiLocker or Aadhaar offline e-KYC. {BRAND.name} never stores your Aadhaar number, and owners never see your document.</p>
          <Link href="/search/?deal=rent" className="btn-accent mt-6 px-5 py-3">Find a rental & get verified when you book <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-3 text-xs text-indigo-200">Concept for the prototype — the “Get verified” flow in visit booking is a simulation. KYC partner to be finalised.</p>
        </div>
      </section>

      <section className="container-x mt-14">
        <p className="eyebrow">Benefits</p><h2 className="h-section mt-2">Why verify</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[[BadgeCheck, '“Verified Tenant” badge', 'Shown to owners on every enquiry and visit request.'], [Inbox, 'First in the owner’s inbox', 'Verified enquiries are sorted to the top.'], [Zap, 'Faster visit booking', 'Owners confirm verified visit requests sooner.'], [HandCoins, 'Deposit-free plan eligibility', `Where the owner offers it through ${FEATURES.deposit}.`]].map(([I, t, d]: any) => (
            <div key={t} className="card p-6"><I className="h-7 w-7 text-indigo-600" /><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1.5 text-sm text-ink-500">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="container-x mt-14 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold">How it works</h2>
          <ol className="mt-4 space-y-4 text-sm">
            {[[Lock, 'Give consent', 'Explicit, purpose-limited consent under India’s Digital Personal Data Protection (DPDP) Act. Withdraw anytime.'], [FileKey2, 'DigiLocker', 'Share a verified ID from your DigiLocker account with our licensed KYC partner…'], [Fingerprint, '…or Aadhaar offline e-KYC', 'Use the password-protected offline e-KYC file / QR. No Aadhaar number is stored by ' + BRAND.name + '.'], [Briefcase, 'Optional: work email', 'Confirm your employer with a one-time code to your work email.']].map(([I, t, d]: any, i) => (
              <li key={t} className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><I className="h-4 w-4" /></span><div><div className="font-semibold">{i + 1}. {t}</div><p className="text-ink-500">{d}</p></div></li>
            ))}
          </ol>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold">What owners see</h2>
          <div className="mt-4 rounded-2xl border border-ink-200 p-4">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">A</span><div><div className="font-semibold">Ananya R. <span className="chip ml-1 bg-indigo-600 text-white"><BadgeCheck className="h-3 w-3" />ID verified</span></div><div className="text-xs text-ink-500">Works at: Sample Tech Pvt Ltd (shared by tenant)</div></div></div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-ink-600">
            <li className="flex gap-2"><EyeOff className="h-4 w-4 shrink-0 text-ink-400" />Never the document, Aadhaar number, date of birth or address.</li>
            <li className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-brand-600" />Owners can choose “Only Verified Tenants can contact me” (off by default).</li>
            <li className="flex gap-2"><Siren className="h-4 w-4 shrink-0 text-coral-500" />Later add-on: assistance with Bengaluru police tenant verification (planned).</li>
          </ul>
        </div>
      </section>

      <section className="container-x mt-14 max-w-3xl pb-4">
        <h2 className="h-section">FAQ</h2>
        <div className="mt-6 space-y-3">
          {[
            ['Is it mandatory?', 'No. Verified Tenant is optional and free. Most owners accept all tenants; some may choose to accept only verified tenants.'],
            ['Does ' + BRAND.name + ' store my Aadhaar?', 'No. Verification is done by a licensed KYC partner. ' + BRAND.name + ' keeps only the result (“ID verified”), your name and, if you choose, your employer.'],
            ['Can I delete my verification?', 'Yes, anytime from your account. Consent is recorded and can be withdrawn under the DPDP Act.'],
          ].map(([q, a]) => (
            <details key={q} className="card group p-5"><summary className="cursor-pointer list-none font-semibold marker:hidden">{q}<span className="float-right text-ink-400 transition group-open:rotate-45">+</span></summary><p className="mt-2 text-sm text-ink-600">{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
