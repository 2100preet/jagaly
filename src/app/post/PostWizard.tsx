'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Sparkles, Upload, Video, MapPin, ShieldCheck, Loader2, PartyPopper, Home, Building2 } from 'lucide-react';
import { LOCALITIES } from '@/data/geo';
import { cn, formatINR, saveLocal } from '@/lib/format';
import { BRAND } from '@/config/brand';

const STEPS = ['Basics', 'Details', 'Price', 'Description', 'Verify', 'Contact'];
const AMEN = ['Lift', 'Power backup', 'Covered parking', 'Gym', 'Swimming pool', 'Clubhouse', 'Borewell + Cauvery', 'Gated security', 'Kids play area', 'EV charging'];

type Form = {
  deal: 'rent' | 'sell'; type: string; locality: string; society: string; bhk: string; area: string; floor: string; furnishing: string;
  tenant: string; pets: boolean; amenities: string[]; price: string; deposit: string; maintenance: string; available: string;
  description: string; video: string; name: string; phone: string; agree: boolean;
};

const init: Form = { deal: 'rent', type: 'Apartment', locality: '', society: '', bhk: '2', area: '', floor: '', furnishing: 'semi', tenant: 'any', pets: false, amenities: [], price: '', deposit: '', maintenance: '', available: '', description: '', video: '', name: '', phone: '', agree: false };

function generate(f: Form) {
  const furn = f.furnishing === 'full' ? 'fully furnished' : f.furnishing === 'semi' ? 'semi-furnished' : 'unfurnished';
  const am = f.amenities.length ? ` The society offers ${f.amenities.slice(0, 4).join(', ').toLowerCase()}${f.amenities.length > 4 ? ' and more' : ''}.` : '';
  const who = f.deal === 'rent' ? ` Ideal for ${f.tenant === 'family' ? 'families' : f.tenant === 'bachelor' ? 'working professionals' : 'families and working professionals'}${f.pets ? ', and pets are welcome' : ''}.` : '';
  const price = f.price ? ` Asking ${f.deal === 'rent' ? `₹${(+f.price).toLocaleString('en-IN')}/month` : formatINR(+f.price)}${f.deposit ? ` with a deposit of ₹${(+f.deposit).toLocaleString('en-IN')}` : ''}.` : '';
  return `Bright, well-ventilated ${f.bhk} BHK ${f.type.toLowerCase()} ${f.deal === 'rent' ? 'for rent' : 'for sale'} in ${f.society || 'a well-maintained society'}, ${f.locality || 'Bangalore'}. Spread over ${f.area || '—'} sqft${f.floor ? ` on floor ${f.floor}` : ''}, the home is ${furn} and ready to move in${f.available ? ` from ${new Date(f.available).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}.${am}${who}${price} Listed directly by the owner on ${BRAND.name} — no brokerage, no spam calls.`;
}

export default function PostWizard() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(init);
  const [gen, setGen] = useState(false);
  const [upload, setUpload] = useState<'idle' | 'uploading' | 'checking' | 'done'>('idle');
  const [done, setDone] = useState(false);
  const set = (p: Partial<Form>) => setF((x) => ({ ...x, ...p }));

  const valid = [
    !!f.locality && !!f.society,
    !!f.area && +f.area > 100,
    !!f.price && +f.price > 0,
    f.description.length > 30,
    true,
    f.name.length > 1 && /^[6-9]\d{9}$/.test(f.phone) && f.agree,
  ][step];

  const runAI = () => {
    setGen(true);
    const text = generate(f);
    set({ description: '' });
    let i = 0;
    const t = setInterval(() => {
      i += 6;
      set({ description: text.slice(0, i) });
      if (i >= text.length) { clearInterval(t); setGen(false); }
    }, 18);
  };

  const onVideo = (file?: File) => {
    if (!file) return;
    set({ video: file.name });
    setUpload('uploading');
    setTimeout(() => setUpload('checking'), 1300);
    setTimeout(() => setUpload('done'), 2800);
  };

  const submit = () => {
    saveLocal(`${BRAND.name.toLowerCase()}_listings`, { ...f, id: `draft-${Date.now()}` });
    setDone(true);
  };

  if (done) return (
    <div className="container-x py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-100"><PartyPopper className="h-8 w-8 text-brand-600" /></div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Your listing is submitted!</h1>
        <p className="mt-2 text-ink-600">{f.bhk} BHK in {f.society}, {f.locality}. {upload === 'done' ? 'Your video passed the auto-check — a reviewer will add the Verified badge within 4 hours.' : 'Upload a walk-through video anytime to get the Verified badge.'}</p>
        <p className="mt-2 text-xs text-ink-400">Prototype: saved to this browser’s localStorage (key <code>{BRAND.name.toLowerCase()}_listings</code>). Nothing was sent to a server.</p>
        <div className="mt-6 flex justify-center gap-2"><Link href="/" className="btn-ghost">Go home</Link><button className="btn-primary" onClick={() => { setF(init); setStep(0); setUpload('idle'); setDone(false); }}>Post another</button></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-brand-50 to-ink-50">
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="eyebrow">Free for owners · always</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Post your property in 3 minutes</h1>
          {/* Stepper */}
          <ol className="mt-6 flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-1">
                <button onClick={() => i < step && setStep(i)} className={cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap', i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-brand-100 text-brand-700' : 'bg-white text-ink-400')}>
                  <span className={cn('grid h-5 w-5 place-items-center rounded-full text-[10px]', i === step ? 'bg-white/25' : i < step ? 'bg-brand-600 text-white' : 'bg-ink-100')}>{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>{s}
                </button>
                {i < STEPS.length - 1 && <span className="h-px w-4 bg-ink-200" />}
              </li>
            ))}
          </ol>

          <div className="card mt-6 p-6">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <span className="label">I want to</span>
                  <div className="grid grid-cols-2 gap-3">
                    {([['rent', 'Rent it out', Home], ['sell', 'Sell it', Building2]] as const).map(([k, l, I]) => (
                      <button key={k} onClick={() => set({ deal: k })} className={cn('flex items-center gap-3 rounded-xl border-2 p-4 text-left', f.deal === k ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-ink-300')}><I className="h-6 w-6 text-brand-600" /><span className="font-semibold">{l}</span></button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Property type</label><select className="input" value={f.type} onChange={(e) => set({ type: e.target.value })}>{['Apartment', 'Independent house', 'Villa', 'Builder floor', 'Studio'].map((x) => <option key={x}>{x}</option>)}</select></div>
                  <div><label className="label">Locality *</label><select className="input" value={f.locality} onChange={(e) => set({ locality: e.target.value })}><option value="">Select locality</option>{LOCALITIES.map((l) => <option key={l.name}>{l.name}</option>)}</select></div>
                </div>
                <div><label className="label">Society / building name *</label><input className="input" value={f.society} onChange={(e) => set({ society: e.target.value })} placeholder="e.g. Sobha Lake View" /></div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <div><span className="label">BHK</span><div className="grid grid-cols-5 gap-2">{['1', '2', '3', '4', '5'].map((b) => <button key={b} onClick={() => set({ bhk: b })} className={cn('rounded-xl border py-2.5 font-semibold', f.bhk === b ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200')}>{b}{b === '5' ? '+' : ''}</button>)}</div></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Built-up area (sqft) *</label><input className="input" inputMode="numeric" value={f.area} onChange={(e) => set({ area: e.target.value.replace(/\D/g, '') })} placeholder="1200" /></div>
                  <div><label className="label">Floor</label><input className="input" value={f.floor} onChange={(e) => set({ floor: e.target.value })} placeholder="3 of 12" /></div>
                </div>
                <div><span className="label">Furnishing</span><div className="flex flex-wrap gap-2">{[['full', 'Fully furnished'], ['semi', 'Semi-furnished'], ['unfurnished', 'Unfurnished']].map(([k, l]) => <button key={k} onClick={() => set({ furnishing: k })} className={cn('chip border px-3 py-2 text-sm', f.furnishing === k ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200')}>{l}</button>)}</div></div>
                {f.deal === 'rent' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Preferred tenants</label><select className="input" value={f.tenant} onChange={(e) => set({ tenant: e.target.value })}><option value="any">Anyone</option><option value="family">Family</option><option value="bachelor">Bachelors</option></select></div>
                    <label className="flex items-center gap-2 self-end rounded-xl border border-ink-200 px-3 py-2.5 text-sm"><input type="checkbox" className="accent-brand-600" checked={f.pets} onChange={(e) => set({ pets: e.target.checked })} />Pets allowed</label>
                  </div>
                )}
                <div><span className="label">Amenities</span><div className="flex flex-wrap gap-2">{AMEN.map((a) => { const on = f.amenities.includes(a); return <button key={a} onClick={() => set({ amenities: on ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] })} className={cn('chip border px-3 py-1.5 text-sm', on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600')}>{on && <Check className="h-3 w-3" />}{a}</button>; })}</div></div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">{f.deal === 'rent' ? 'Monthly rent (₹) *' : 'Expected price (₹) *'}</label><input className="input" inputMode="numeric" value={f.price} onChange={(e) => set({ price: e.target.value.replace(/\D/g, '') })} placeholder={f.deal === 'rent' ? '35000' : '9500000'} />
                    {f.price && <p className="mt-1 text-xs text-brand-700">{formatINR(+f.price)}{f.deal === 'rent' ? ' per month' : ''}</p>}</div>
                  {f.deal === 'rent' && <div><label className="label">Security deposit (₹)</label><input className="input" inputMode="numeric" value={f.deposit} onChange={(e) => set({ deposit: e.target.value.replace(/\D/g, '') })} placeholder="200000" />{f.deposit && <p className="mt-1 text-xs text-brand-700">{formatINR(+f.deposit)} · {f.price ? `${(+f.deposit / +f.price).toFixed(1)}× rent` : ''}</p>}</div>}
                  <div><label className="label">Maintenance (₹/mo)</label><input className="input" inputMode="numeric" value={f.maintenance} onChange={(e) => set({ maintenance: e.target.value.replace(/\D/g, '') })} placeholder="3500" /></div>
                  <div><label className="label">Available from</label><input className="input" type="date" value={f.available} onChange={(e) => set({ available: e.target.value })} /></div>
                </div>
                {f.locality && f.area && f.price && (() => {
                  const loc = LOCALITIES.find((l) => l.name === f.locality)!;
                  const est = f.deal === 'rent' ? loc.rentPerSqft * +f.area : loc.buyPerSqft * +f.area;
                  const d = (+f.price - est) / est;
                  return <div className={cn('rounded-xl border p-4 text-sm', Math.abs(d) <= 0.08 ? 'border-brand-200 bg-brand-50 text-brand-800' : 'border-saffron-200 bg-saffron-50 text-saffron-800')}><strong>True Price check (sample):</strong> similar homes in {f.locality} go for ~{formatINR(est)}{f.deal === 'rent' ? '/mo' : ''}. Your price is {Math.abs(d * 100).toFixed(0)}% {d >= 0 ? 'above' : 'below'} — {Math.abs(d) <= 0.08 ? 'buyers will see a “Fair price” tag.' : d > 0 ? 'you may get fewer enquiries.' : 'expect lots of interest!'}</div>;
                })()}
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="label mb-0">Description *</label>
                  <button onClick={runAI} disabled={gen} className="btn bg-gradient-to-r from-saffron-500 to-pink-500 text-white">{gen ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{gen ? 'Writing…' : 'Write it with AI'}</button>
                </div>
                <textarea className="input min-h-[180px]" value={f.description} onChange={(e) => set({ description: e.target.value })} placeholder="Describe your home, or let AI write it from the details you entered." />
                <p className="text-xs text-ink-500">AI generation is a demo mock: it composes text from your form answers locally. You can edit freely. {f.description.length}/1000</p>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-5">
                <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-6 text-center">
                  {upload === 'idle' ? (
                    <>
                      <Video className="mx-auto h-10 w-10 text-brand-600" />
                      <div className="mt-2 font-semibold">Upload a 60-second walk-through</div>
                      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">Walk through every room in one continuous take. We check location metadata and frames to award the <strong>Verified</strong> badge.</p>
                      <label className="btn-primary mt-4 cursor-pointer"><Upload className="h-4 w-4" />Choose video<input type="file" accept="video/*" className="hidden" onChange={(e) => onVideo(e.target.files?.[0])} /></label>
                      <button onClick={() => onVideo(new File([''], 'demo-walkthrough.mp4'))} className="mt-2 block w-full text-xs font-semibold text-brand-700 underline">No video handy? Simulate an upload</button>
                    </>
                  ) : (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-2 text-sm font-semibold"><Video className="h-4 w-4 text-brand-600" />{f.video}</div>
                      {[['uploading', 'Uploading securely'], ['checking', 'Checking geotag & continuity'], ['done', 'Ready for human review']].map(([k, l], i) => {
                        const order = ['uploading', 'checking', 'done'];
                        const cur = order.indexOf(upload);
                        const st = i < cur || upload === 'done' ? 'done' : i === cur ? 'active' : 'todo';
                        return <div key={k} className="flex items-center gap-2 text-sm">{st === 'done' ? <Check className="h-4 w-4 text-brand-600" /> : st === 'active' ? <Loader2 className="h-4 w-4 animate-spin text-saffron-500" /> : <span className="h-4 w-4 rounded-full border border-ink-300" />}<span className={st === 'todo' ? 'text-ink-400' : ''}>{l}</span></div>;
                      })}
                      {upload === 'done' && <div className="mt-2 flex items-center gap-2 rounded-xl bg-brand-600 p-3 text-sm text-white"><ShieldCheck className="h-5 w-5" />Auto-check passed · <MapPin className="h-4 w-4" />Location matches {f.locality || 'listing'} (simulated)</div>}
                    </div>
                  )}
                </div>
                <p className="text-xs text-ink-500">Optional, but verified listings get ~3× more genuine enquiries (target metric). Prototype: the file never leaves your browser.</p>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Your name *</label><input className="input" value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
                  <div><label className="label">Mobile *</label><div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">+91</span><input className="input rounded-l-none" inputMode="numeric" value={f.phone} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="98xxxxxxxx" /></div></div>
                </div>
                <div className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600"><ShieldCheck className="mr-1 inline h-4 w-4 text-brand-600" />Your number is <strong>never shown</strong>. Tenants/buyers call a masked {BRAND.name} number; you can pause calls anytime.</div>
                <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-brand-600" checked={f.agree} onChange={(e) => set({ agree: e.target.checked })} />I confirm I am the owner (not a broker) and agree to the <Link href="/legal/#terms" className="text-brand-700 underline">Terms</Link>.</label>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-5">
              <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-ghost"><ChevronLeft className="h-4 w-4" />Back</button>
              {step < STEPS.length - 1
                ? <button onClick={() => setStep((s) => s + 1)} disabled={!valid} className="btn-primary">{step === 4 && upload === 'idle' ? 'Skip for now' : 'Continue'}<ChevronRight className="h-4 w-4" /></button>
                : <button onClick={submit} disabled={!valid} className="btn-accent">Publish free listing<Check className="h-4 w-4" /></button>}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white"><div className="text-xs font-semibold uppercase tracking-wider text-brand-100">Live preview</div><div className="mt-1 font-display text-lg font-bold">{f.bhk} BHK {f.type} {f.deal === 'rent' ? 'for rent' : 'for sale'}</div><div className="text-sm text-brand-100">{f.society || 'Your society'}, {f.locality || 'Locality'}</div></div>
            <div className="space-y-2 p-4 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Price</span><span className="font-semibold">{f.price ? formatINR(+f.price) + (f.deal === 'rent' ? '/mo' : '') : '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Area</span><span className="font-semibold">{f.area ? `${f.area} sqft` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Verification</span><span className={cn('font-semibold', upload === 'done' ? 'text-brand-700' : 'text-ink-400')}>{upload === 'done' ? 'Video ✓' : 'Pending'}</span></div>
              {f.description && <p className="line-clamp-4 border-t border-ink-100 pt-2 text-xs text-ink-600">{f.description}</p>}
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-saffron-50 p-4 text-sm text-saffron-800"><strong>Free forever for owners.</strong> No listing fee, no “premium relationship manager” upsell. Optional add-ons on the <Link href="/pricing/" className="underline">pricing page</Link>.</div>
        </aside>
      </div>
    </div>
  );
}
