'use client';
import { useEffect, useState } from 'react';
import { BadgeCheck, Fingerprint, FileKey2, Briefcase, Lock, Loader2, X, Check } from 'lucide-react';
import { cn } from '@/lib/format';
import { BRAND } from '@/config/brand';

const KEY = `${BRAND.name.toLowerCase()}_tenant_verified`;
export type TenantStatus = { verified: boolean; name?: string; employer?: string };

export function useTenantStatus(): [TenantStatus, (s: TenantStatus) => void] {
  const [s, setS] = useState<TenantStatus>({ verified: false });
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (v) setS(JSON.parse(v)); } catch {} }, []);
  return [s, (n) => { setS(n); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} }];
}

export function VerifiedTenantBadge({ className = '' }: { className?: string }) {
  return <span className={cn('chip bg-indigo-600 text-white', className)}><BadgeCheck className="h-3.5 w-3.5" />Verified Tenant</span>;
}

/** Mock "Get verified" flow: consent → DigiLocker / Aadhaar offline e-KYC via licensed partner → optional work email. */
export default function TenantVerifyModal({ onClose, onDone }: { onClose: () => void; onDone: (s: TenantStatus) => void }) {
  const [step, setStep] = useState<'consent' | 'method' | 'running' | 'work' | 'done'>('consent');
  const [agree, setAgree] = useState(false);
  const [method, setMethod] = useState<'digilocker' | 'offline' | ''>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employer, setEmployer] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const run = () => { setStep('running'); setTimeout(() => setStep('work'), 1800); };
  const finish = (withWork: boolean) => {
    const s: TenantStatus = { verified: true, name: name || 'Verified tenant', employer: withWork ? employer || email.split('@')[1]?.split('.')[0] : undefined };
    onDone(s); setStep('done');
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-end bg-ink-900/60 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Get verified">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div><span className="chip bg-indigo-50 text-indigo-700"><BadgeCheck className="h-3.5 w-3.5" />Optional · free</span><h2 className="mt-2 font-display text-xl font-extrabold">Get Verified Tenant</h2></div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-1 text-xs text-ink-500">Demo flow — nothing is sent anywhere. In production, ID is checked by a licensed KYC partner.</p>

        {step === 'consent' && (
          <div className="mt-4 space-y-3 text-sm">
            <ul className="space-y-2 text-ink-700">
              {['Appear first in the owner’s inbox', 'Faster visit confirmation', 'Eligible for the deposit-free plan (where the owner offers it)'].map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-brand-600" />{x}</li>)}
            </ul>
            <div className="rounded-xl bg-ink-50 p-3 text-xs text-ink-600"><Lock className="mr-1 inline h-3.5 w-3.5" />{BRAND.name} <strong>never stores your Aadhaar number</strong> or document. Owners see only “ID verified”, your name and (if you choose) your employer. Consent is recorded under India’s DPDP Act; you can withdraw it and delete your verification anytime.</div>
            <label className="flex items-start gap-2"><input type="checkbox" className="mt-1 accent-brand-600" checked={agree} onChange={(e) => setAgree(e.target.checked)} />I consent to a one-time ID check by {BRAND.name}’s licensed KYC partner for tenant verification only.</label>
            <button disabled={!agree} onClick={() => setStep('method')} className="btn-primary w-full">Continue</button>
          </div>
        )}

        {step === 'method' && (
          <div className="mt-4 space-y-3 text-sm">
            <label className="label">Name as on ID</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            {([['digilocker', 'DigiLocker', 'Share a verified ID from your DigiLocker account', FileKey2], ['offline', 'Aadhaar offline e-KYC', 'Upload the password-protected offline XML / QR — no Aadhaar number stored', Fingerprint]] as const).map(([k, t, d, I]) => (
              <button key={k} onClick={() => setMethod(k)} className={cn('flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left', method === k ? 'border-brand-600 bg-brand-50' : 'border-ink-200')}>
                <I className="mt-0.5 h-5 w-5 text-brand-600" /><span><span className="block font-semibold">{t}</span><span className="text-xs text-ink-500">{d}</span></span>
              </button>
            ))}
            <button disabled={!method || name.trim().length < 2} onClick={run} className="btn-primary w-full">Verify with {method === 'offline' ? 'offline e-KYC' : 'DigiLocker'} (simulated)</button>
          </div>
        )}

        {step === 'running' && <div className="mt-6 flex items-center gap-3 rounded-xl bg-ink-50 p-4 text-sm"><Loader2 className="h-5 w-5 animate-spin text-brand-600" />Checking with KYC partner… (simulated)</div>}

        {step === 'work' && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl bg-brand-50 p-3 font-semibold text-brand-800"><Check className="h-4 w-4" />ID verified</div>
            <div className="font-semibold"><Briefcase className="mr-1 inline h-4 w-4 text-brand-600" />Optional: verify your work email</div>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            <input className="input" value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder="Employer name to show owners (optional)" />
            {otpSent ? <p className="text-xs text-brand-700">Demo: a code would be emailed. Treating it as confirmed.</p> : null}
            <div className="flex gap-2">
              <button onClick={() => finish(false)} className="btn-ghost flex-1">Skip</button>
              <button disabled={!/.+@.+\..+/.test(email)} onClick={() => { if (!otpSent) setOtpSent(true); else finish(true); }} className="btn-primary flex-1">{otpSent ? 'Confirm' : 'Send code'}</button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="mt-5 text-center">
            <VerifiedTenantBadge className="px-3 py-1.5 text-sm" />
            <p className="mt-3 text-sm text-ink-600">Owners will see: <strong>ID verified · {name || 'your name'}</strong>{employer || email ? ` · ${employer || email.split('@')[1]}` : ''}. Never your document.</p>
            <button onClick={onClose} className="btn-primary mt-4 w-full">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
