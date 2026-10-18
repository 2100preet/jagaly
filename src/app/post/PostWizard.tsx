'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Sparkles, Upload, Video, MapPin, ShieldCheck, Loader2, PartyPopper, Home, Building2, Wallet, BadgeCheck, Globe2, Store, FileCheck2, EyeOff, Eye, Trash2, Lock, Smartphone } from 'lucide-react';
import { areaRates, areaByName, LOCALITIES } from '@/data/geo';
import { COMMERCIAL_TYPES, PROPERTY_TYPES, CONDITIONS, SUITABLE, commercialRate, type PropertyType, type Condition } from '@/data/commercial';
import LocalityTypeahead from '@/components/LocalityTypeahead';
import { NRI_ZONES } from '@/lib/tz';
import { cn, formatINR, saveLocal } from '@/lib/format';
import { BRAND } from '@/config/brand';

const STEPS = ['Basics', 'Details', 'Price', 'Description', 'Verify', 'Contact'];
const COM_AMEN = ['DG power backup', 'Lift', 'Fire NOC', 'Central AC', '24x7 access', 'Loading dock', 'Cafeteria / pantry', 'Sprinklers', 'Signage space', 'Washrooms'];
const RES_TYPES = ['Apartment', 'Independent house', 'Villa', 'Builder floor', 'Studio', 'Residential plot / land'];
const PLOT = 'Residential plot / land';
const AMEN = ['Lift', 'Power backup', 'Covered parking', 'Gym', 'Swimming pool', 'Clubhouse', 'Borewell + Cauvery', 'Gated security', 'Kids play area', 'EV charging'];

type Form = {
  deal: 'rent' | 'sell'; type: string; locality: string; society: string; bhk: string; area: string; floor: string; furnishing: string;
  tenant: string; pets: boolean; amenities: string[]; price: string; deposit: string; maintenance: string; available: string;
  description: string; video: string; name: string; phone: string; agree: boolean;
  depositSafe: boolean; depositFree: boolean; verifiedOnly: boolean; nri: boolean; nriZone: string; ownerDoc: string; otp: string;
  seg: 'res' | 'com'; carpet: string; seats: string; frontage: string; kva: string; carParking: string; condition: Condition; zoning: string; oc: string;
  suitable: string[]; lockIn: string; depositMonths: string; cam: string; escalation: string;
};

const init: Form = { deal: 'rent', type: 'Apartment', locality: '', society: '', bhk: '2', area: '', floor: '', furnishing: 'semi', tenant: 'any', pets: false, amenities: [], price: '', deposit: '', maintenance: '', available: '', description: '', video: '', name: '', phone: '', agree: false, depositSafe: false, depositFree: false, verifiedOnly: false, nri: false, nriZone: NRI_ZONES[0].tz, ownerDoc: '', otp: '', seg: 'res', carpet: '', seats: '', frontage: '', kva: '', carParking: '', condition: 'warm', zoning: 'Commercial', oc: 'OC received', suitable: [], lockIn: '36', depositMonths: '6', cam: '', escalation: '5' };

const comKey = (label: string) => (Object.keys(PROPERTY_TYPES) as PropertyType[]).find((k) => PROPERTY_TYPES[k].label === label) ?? 'office';
/** Short summary, e.g. "2 BHK Apartment" or "Office space". */
const summary = (f: Form) => (f.seg === 'com' || f.type === PLOT ? f.type : `${f.bhk} BHK ${f.type}`);

function generate(f: Form) {
  if (f.seg === 'com' || f.type === PLOT) {
    const k = f.seg === 'com' ? comKey(f.type) : 'res-plot';
    const land = PROPERTY_TYPES[k].land;
    const price = f.price ? ` Asking ${f.deal === 'rent' ? `₹${(+f.price).toLocaleString('en-IN')}/month${f.area ? ` (₹${(+f.price / +f.area).toFixed(0)}/sq ft)` : ''}` : formatINR(+f.price)}.` : '';
    const lease = f.deal === 'rent' ? ` Lease terms: ${f.lockIn || '—'}-month lock-in, ${f.depositMonths || '—'} months’ deposit, ${f.escalation || 5}% yearly escalation${f.cam ? `, CAM ₹${f.cam}/sq ft/month` : ''}.` : '';
    const specs = land ? `Plot area ${f.area || '—'} sq ft${f.frontage ? ` with ${f.frontage} ft frontage` : ''}. Zoning: ${f.zoning}.` : `${f.carpet ? `Carpet ${f.carpet} sq ft, ` : ''}super built-up ${f.area || '—'} sq ft${f.floor ? ` on floor ${f.floor}` : ''}, ${CONDITIONS[f.condition].toLowerCase()}.${f.seats ? ` Fits about ${f.seats} seats.` : ''}${f.frontage ? ` ${f.frontage} ft frontage.` : ''}${f.kva ? ` ${f.kva} kVA power load.` : ''}${f.carParking ? ` ${f.carParking} car parks.` : ''} Zoning: ${f.zoning}; ${f.oc}.`;
    const suit = f.suitable.length ? ` Suitable for ${f.suitable.join(', ').toLowerCase()}.` : '';
    return `${PROPERTY_TYPES[k].label} ${f.deal === 'rent' ? 'for lease' : 'for sale'} in ${f.society || 'a well-located building'}, ${f.locality || 'Bangalore'}. ${specs}${suit}${lease}${price} Listed directly by the owner on ${BRAND.name}: no brokerage, no spam calls.`;
  }
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
  const [otpSent, setOtpSent] = useState(false);
  const otpOk = /^\d{6}$/.test(f.otp);
  const [wantDoc, setWantDoc] = useState(false);
  const [blur, setBlur] = useState<Record<string, boolean>>({ account: true, amount: true, meter: true, date: true });
  const com = f.seg === 'com';
  const plot = !com && f.type === PLOT;
  const spaceKey: PropertyType = com ? comKey(f.type) : 'res-plot';
  const spaceMeta = PROPERTY_TYPES[spaceKey];
  const setSeg = (seg: Form['seg']) => set({ seg, type: seg === 'com' ? PROPERTY_TYPES.office.label : 'Apartment', amenities: [] });
  useEffect(() => { if (typeof window !== 'undefined' && window.location.hash === '#commercial') setSeg('com'); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const valid = [
    !!f.locality && !!f.society,
    !!f.area && +f.area > 100,
    !!f.price && +f.price > 0,
    f.description.length > 30,
    upload === 'done',
    f.name.length > 1 && /^[6-9]\d{9}$/.test(f.phone) && otpOk && f.agree,
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
        <p className="mt-2 text-ink-600">{summary(f)} in {f.society}, {f.locality}. Your video passed the auto-check — a reviewer will add the {BRAND.name} Proof badge within 4 hours.{f.ownerDoc ? ' Your Verified Owner name-match is in review (document kept private).' : ''}{f.depositSafe ? ' Deposit Safe Owner badge added.' : ''}</p>
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
                  <span className="label">Property segment</span>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1" role="group" aria-label="Property segment">
                    {([['res', 'Residential', Home], ['com', 'Commercial', Store]] as const).map(([k, l, I]) => (
                      <button key={k} type="button" onClick={() => setSeg(k)} aria-pressed={f.seg === k} className={cn('flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold', f.seg === k ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}><I className="h-4 w-4" />{l}</button>
                    ))}
                  </div>
                  {com && <p className="mt-1.5 text-xs text-ink-500">Offices, co-working, shops, showrooms, F&B, warehouses, industrial sheds and commercial land. Same {BRAND.name} Proof tiers, no sale deed needed to list.</p>}
                </div>
                <div>
                  <span className="label">I want to</span>
                  <div className="grid grid-cols-2 gap-3">
                    {([['rent', com ? 'Lease it out' : 'Rent it out', Home], ['sell', 'Sell it', Building2]] as const).map(([k, l, I]) => (
                      <button key={k} onClick={() => set({ deal: k })} className={cn('flex items-center gap-3 rounded-xl border-2 p-4 text-left', f.deal === k ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-ink-300')}><I className="h-6 w-6 text-brand-600" /><span className="font-semibold">{l}</span></button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Property type</label><select className="input" aria-label="Property type" value={f.type} onChange={(e) => set({ type: e.target.value })}>{(com ? COMMERCIAL_TYPES.map((k) => PROPERTY_TYPES[k].label) : RES_TYPES).map((x) => <option key={x}>{x}</option>)}</select></div>
                  <div><label className="label" htmlFor="post-locality">Locality *</label><div className="input py-1.5 focus-within:border-brand-500"><LocalityTypeahead id="post-locality" value={f.locality} onChange={(v) => set({ locality: v })} placeholder="Type your area, e.g. BTM, Kora" showIcon={false} inputClassName="py-1" /></div><p className="mt-1 text-[11px] text-ink-400">Approximate location only; exact address is never shown publicly.</p></div>
                </div>
                <div><label className="label">{com ? 'Building / project name *' : plot ? 'Layout name *' : 'Society / building name *'}</label><input className="input" value={f.society} onChange={(e) => set({ society: e.target.value })} placeholder={com ? 'e.g. Lakeside Business Park' : plot ? 'e.g. Green Meadows Layout' : 'e.g. Green Park Apartments'} /></div>
              </div>
            )}
            {step === 1 && (com || plot) && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {!spaceMeta.land && <div><label className="label" htmlFor="carpet">Carpet area (sq ft)</label><input id="carpet" className="input" inputMode="numeric" value={f.carpet} onChange={(e) => set({ carpet: e.target.value.replace(/\D/g, '') })} placeholder="7200" /></div>}
                  <div><label className="label" htmlFor="sba">{spaceMeta.land ? 'Plot area (sq ft) *' : 'Super built-up area (sq ft) *'}</label><input id="sba" className="input" inputMode="numeric" value={f.area} onChange={(e) => set({ area: e.target.value.replace(/\D/g, '') })} placeholder={spaceMeta.land ? '2400' : '10000'} />{f.carpet && f.area && +f.area > 0 && <p className="mt-1 text-xs text-ink-500">Efficiency (carpet ÷ super built-up): {Math.round((+f.carpet / +f.area) * 100)}%</p>}</div>
                  {spaceMeta.seats && <div><label className="label" htmlFor="seats">Seats (approx.)</label><input id="seats" className="input" inputMode="numeric" value={f.seats} onChange={(e) => set({ seats: e.target.value.replace(/\D/g, '') })} placeholder="100" /></div>}
                  {!spaceMeta.land && <div><label className="label" htmlFor="floor">Floor</label><input id="floor" className="input" value={f.floor} onChange={(e) => set({ floor: e.target.value })} placeholder="Ground / 5 of 9" /></div>}
                  {spaceMeta.frontage && <div><label className="label" htmlFor="frontage">Frontage (ft)</label><input id="frontage" className="input" inputMode="numeric" value={f.frontage} onChange={(e) => set({ frontage: e.target.value.replace(/\D/g, '') })} placeholder="20" /></div>}
                  {com && !spaceMeta.land && <div><label className="label" htmlFor="kva">Power load (kVA)</label><input id="kva" className="input" inputMode="numeric" value={f.kva} onChange={(e) => set({ kva: e.target.value.replace(/\D/g, '') })} placeholder="50" /></div>}
                  {com && !spaceMeta.land && <div><label className="label" htmlFor="carParking">Car parking (slots)</label><input id="carParking" className="input" inputMode="numeric" value={f.carParking} onChange={(e) => set({ carParking: e.target.value.replace(/\D/g, '') })} placeholder="4" /></div>}
                </div>
                {com && !spaceMeta.land && <div><span className="label">Condition</span><div className="flex flex-wrap gap-2">{(Object.entries(CONDITIONS) as [Condition, string][]).map(([k, l]) => <button key={k} type="button" onClick={() => set({ condition: k })} className={cn('chip border px-3 py-2 text-sm', f.condition === k ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200')}>{l}</button>)}</div></div>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label" htmlFor="zoning">Zoning / land use</label><select id="zoning" className="input" value={f.zoning} onChange={(e) => set({ zoning: e.target.value })}>{(com ? ['Commercial', 'Industrial', 'Industrial / warehousing', 'Mixed use', 'Converted for commercial use', 'Commercial conversion applied (pending)', 'Not sure'] : ['Residential, approved layout', 'Residential, conversion done', 'Conversion pending', 'Not sure']).map((z) => <option key={z}>{z}</option>)}</select></div>
                  {com && !spaceMeta.land && <div><label className="label" htmlFor="oc">OC / CC status</label><select id="oc" className="input" value={f.oc} onChange={(e) => set({ oc: e.target.value })}>{['OC received', 'CC received, OC pending', 'OC pending', 'Not sure'].map((z) => <option key={z}>{z}</option>)}</select></div>}
                </div>
                {com && <div><span className="label">Suitable for</span><div className="flex flex-wrap gap-2">{SUITABLE.map((a) => { const on = f.suitable.includes(a); return <button key={a} type="button" onClick={() => set({ suitable: on ? f.suitable.filter((x) => x !== a) : [...f.suitable, a] })} className={cn('chip border px-3 py-1.5 text-sm', on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600')}>{on && <Check className="h-3 w-3" />}{a}</button>; })}</div></div>}
                {com && <div><span className="label">Amenities</span><div className="flex flex-wrap gap-2">{COM_AMEN.map((a) => { const on = f.amenities.includes(a); return <button key={a} type="button" onClick={() => set({ amenities: on ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] })} className={cn('chip border px-3 py-1.5 text-sm', on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600')}>{on && <Check className="h-3 w-3" />}{a}</button>; })}</div></div>}
                <p className="text-xs text-ink-500">Not sure about zoning or OC/CC? That’s fine. You can still list; these are checked by partner lawyers only at deal stage.</p>
              </div>
            )}
            {step === 1 && !com && !plot && (
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
                  <div><label className="label">{f.deal === 'rent' ? (com ? 'Monthly rent / lease (₹) *' : 'Monthly rent (₹) *') : 'Expected price (₹) *'}</label><input className="input" inputMode="numeric" value={f.price} onChange={(e) => set({ price: e.target.value.replace(/\D/g, '') })} placeholder={f.deal === 'rent' ? '35000' : '9500000'} />
                    {f.price && <p className="mt-1 text-xs text-brand-700">{formatINR(+f.price)}{f.deal === 'rent' ? ' per month' : ''}{(com || plot) && f.area ? ` · ₹${(+f.price / +f.area).toLocaleString('en-IN', { maximumFractionDigits: f.deal === 'rent' ? 1 : 0 })}/sq ft${f.deal === 'rent' ? '/mo' : ''}` : ''}</p>}</div>
                  {com && f.deal === 'rent' && <>
                    <div><label className="label" htmlFor="depm">Security deposit</label><select id="depm" className="input" value={f.depositMonths} onChange={(e) => set({ depositMonths: e.target.value })}>{[0, 3, 6, 10, 12].map((n) => <option key={n} value={n}>{n} months{f.price ? ` · ${formatINR(+f.price * n)}` : ''}</option>)}</select></div>
                    <div><label className="label" htmlFor="lockin">Lock-in period</label><select id="lockin" className="input" value={f.lockIn} onChange={(e) => set({ lockIn: e.target.value })}>{[0, 12, 24, 36, 60].map((n) => <option key={n} value={n}>{n ? `${n} months` : 'No lock-in'}</option>)}</select></div>
                    <div><label className="label" htmlFor="esc">Yearly escalation (%)</label><input id="esc" className="input" inputMode="decimal" value={f.escalation} onChange={(e) => set({ escalation: e.target.value.replace(/[^\d.]/g, '') })} placeholder="5" /></div>
                  </>}
                  {com && <div><label className="label" htmlFor="cam">Maintenance / CAM (₹ per sq ft / month)</label><input id="cam" className="input" inputMode="decimal" value={f.cam} onChange={(e) => set({ cam: e.target.value.replace(/[^\d.]/g, '') })} placeholder="15" />{f.cam && f.area && <p className="mt-1 text-xs text-brand-700">≈ {formatINR(+f.cam * +f.area)}/month</p>}</div>}
                  {!com && f.deal === 'rent' && <div><label className="label">Security deposit (₹)</label><input className="input" inputMode="numeric" value={f.deposit} onChange={(e) => set({ deposit: e.target.value.replace(/\D/g, '') })} placeholder="200000" />{f.deposit && <p className="mt-1 text-xs text-brand-700">{formatINR(+f.deposit)} · {f.price ? `${(+f.deposit / +f.price).toFixed(1)}× rent` : ''}</p>}</div>}
                  {!com && <div><label className="label">Maintenance (₹/mo)</label><input className="input" inputMode="numeric" value={f.maintenance} onChange={(e) => set({ maintenance: e.target.value.replace(/\D/g, '') })} placeholder="3500" /></div>}
                  <div><label className="label">Available from</label><input className="input" type="date" value={f.available} onChange={(e) => set({ available: e.target.value })} /></div>
                </div>
                {f.locality && f.area && f.price && (() => {
                  const rates = areaRates(f.locality);
                  const tier = areaByName(f.locality)?.tier ?? 3;
                  const resBuy = LOCALITIES.find((x) => x.name === f.locality)?.buyPerSqft ?? rates.buy;
                  const est = com || plot ? commercialRate(spaceKey, tier, f.deal === 'rent' ? 'rent' : 'buy', resBuy) * +f.area : f.deal === 'rent' ? rates.rent * +f.area : rates.buy * +f.area;
                  const d = (+f.price - est) / est;
                  return <div className={cn('rounded-xl border p-4 text-sm', Math.abs(d) <= 0.08 ? 'border-brand-200 bg-brand-50 text-brand-800' : 'border-saffron-200 bg-saffron-50 text-saffron-800')}><strong>True Price check (sample):</strong> similar {com || plot ? spaceMeta.plural : 'homes'} in {f.locality} go for ~{formatINR(est)}{f.deal === 'rent' ? '/mo' : ''}. Your price is {Math.abs(d * 100).toFixed(0)}% {d >= 0 ? 'above' : 'below'} — {Math.abs(d) <= 0.08 ? `${f.deal === 'rent' ? 'tenants' : 'buyers'} will see a “Fair price” tag.` : d > 0 ? 'you may get fewer enquiries.' : 'expect lots of interest!'}</div>;
                })()}
                {f.deal === 'rent' && !com && (
                  <div className="rounded-xl border border-ink-200 p-4">
                    <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-brand-600" checked={f.depositSafe} onChange={(e) => set({ depositSafe: e.target.checked, depositFree: e.target.checked ? f.depositFree : false })} />
                      <span><span className="flex items-center gap-1.5 font-semibold"><Wallet className="h-4 w-4 text-saffron-500" />Accept Deposit Safe <span className="chip bg-ink-100 text-[10px] text-ink-500">Optional</span></span>
                        <span className="mt-0.5 block text-ink-500">Not required to list. Opt in for a “Deposit Safe Owner” badge, higher ranking, faster tenant matching, a free rental agreement and damage released to you via move-in/move-out video comparison. You can also decide later, per tenant. <Link href="/deposit-safe/" className="text-brand-700 underline">Learn more</Link></span></span></label>
                    {f.depositSafe && <label className="ml-7 mt-3 flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-brand-600" checked={f.depositFree} onChange={(e) => set({ depositFree: e.target.checked })} /><span>Also offer the <strong>deposit-free plan</strong> to Verified Tenants (tenant pays a small monthly fee instead; you’re covered by the protection add-on — planned).</span></label>}
                  </div>
                )}
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
                <div className="rounded-xl bg-brand-50 p-3 text-sm text-brand-800"><ShieldCheck className="mr-1 inline h-4 w-4" /><strong>No sale deed needed to list.</strong> Tier 1 is just a live video here + phone OTP in the next step. Documents are only checked at deal stage, when a serious tenant or buyer proceeds.</div>
                <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-6 text-center">
                  {upload === 'idle' ? (
                    <>
                      <Video className="mx-auto h-10 w-10 text-brand-600" />
                      <div className="mt-2 font-semibold">Tier 1 · Record a 60-second live walk-through <span className="text-xs font-normal text-ink-500">(required)</span></div>
                      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">{com || plot ? 'Walk through the whole space (entrance, frontage, floor, washrooms, utilities) in one continuous take' : 'Walk through every room in one continuous take'} inside the {BRAND.name} app. We check GPS against your locality and frame continuity to award {BRAND.name} Proof.</p>
                      <label className="btn-primary mt-4 cursor-pointer"><Upload className="h-4 w-4" />Record / choose video<input type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => onVideo(e.target.files?.[0])} /></label>
                      <button onClick={() => onVideo(new File([''], 'demo-walkthrough.mp4'))} className="mt-2 block w-full text-xs font-semibold text-brand-700 underline">No video handy? Simulate a recording</button>
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

                <div className="rounded-2xl border border-ink-200 p-5">
                  <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-brand-600" checked={wantDoc} onChange={(e) => { setWantDoc(e.target.checked); if (!e.target.checked) set({ ownerDoc: '' }); }} />
                    <span><span className="flex items-center gap-1.5 font-semibold"><BadgeCheck className="h-4 w-4 text-brand-600" />Tier 2 · Get the “Verified Owner” badge <span className="chip bg-ink-100 text-[10px] text-ink-500">Optional · skip anytime</span></span>
                      <span className="mt-0.5 block text-ink-500">Upload a recent <strong>property tax receipt OR electricity bill</strong>. Verified Owner listings rank higher. The document stays private, is used only to match your name, and you can delete it anytime.</span></span></label>
                  {wantDoc && (
                    <div className="mt-4 space-y-3">
                      {!f.ownerDoc ? (
                        <div className="flex flex-wrap gap-2">
                          <label className="btn-ghost cursor-pointer"><Upload className="h-4 w-4" />Choose tax receipt / bill<input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && set({ ownerDoc: e.target.files[0].name })} /></label>
                          <button onClick={() => set({ ownerDoc: 'demo-electricity-bill.jpg' })} className="text-xs font-semibold text-brand-700 underline">Simulate a bill</button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-semibold"><FileCheck2 className="h-4 w-4 text-brand-600" />{f.ownerDoc}</span>
                            <button onClick={() => set({ ownerDoc: '' })} className="flex items-center gap-1 text-xs font-semibold text-red-600"><Trash2 className="h-3.5 w-3.5" />Delete document</button></div>
                          <div className="rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm">
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-500"><span>Blur tool (preview)</span><span>Only name + address need to stay visible</span></div>
                            {[['name', 'Name', f.name || 'R. Owner (your name)'], ['address', 'Address', `${f.society || 'Your society'}, ${f.locality || 'Locality'}, Bengaluru`], ['account', 'Account / RR no.', 'XXXX-4471-2290'], ['meter', 'Meter / PID no.', 'M-88213-07'], ['amount', 'Amount', '₹2,814.00'], ['date', 'Bill date', '02-Oct-2026']].map(([k, label, val]) => {
                              const locked = k === 'name' || k === 'address';
                              const b = !locked && blur[k];
                              return <div key={k} className="flex items-center justify-between gap-2 border-b border-ink-200/70 py-1.5 last:border-0">
                                <span className="w-32 shrink-0 text-xs text-ink-500">{label}</span>
                                <span className={cn('flex-1 font-mono text-xs transition', b && 'select-none blur-sm')}>{val}</span>
                                {locked ? <span className="chip bg-brand-50 text-[10px] text-brand-700"><Eye className="h-3 w-3" />visible</span>
                                  : <button onClick={() => setBlur((x) => ({ ...x, [k]: !x[k] }))} className="chip bg-white text-[10px] text-ink-600 ring-1 ring-ink-200">{b ? <><EyeOff className="h-3 w-3" />blurred</> : <><Eye className="h-3 w-3" />blur</>}</button>}
                              </div>;
                            })}
                          </div>
                          <p className="flex gap-1.5 text-xs text-ink-500"><Lock className="h-3.5 w-3.5 shrink-0" />Private: never shown to tenants or buyers. Used only for a name match with your account. Prototype: the file never leaves your browser.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-ink-500">Tier 3 happens only at deal stage: when a serious tenant or buyer proceeds, ownership documents are checked (for sales, by partner lawyers).</p>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Your name *</label><input className="input" value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
                  <div><label className="label">Mobile *</label><div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">+91</span><input className="input rounded-l-none" inputMode="numeric" value={f.phone} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="98xxxxxxxx" /></div></div>
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[160px] flex-1"><label className="label"><Smartphone className="mr-1 inline h-4 w-4" />Phone OTP * <span className="font-normal text-ink-400">(Tier 1)</span></label><input className="input" inputMode="numeric" value={f.otp} onChange={(e) => set({ otp: e.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder={otpSent ? 'Enter 6-digit code' : 'Send code first'} disabled={!otpSent} /></div>
                  <button type="button" onClick={() => setOtpSent(true)} disabled={!/^[6-9]\d{9}$/.test(f.phone)} className="btn-ghost">{otpSent ? 'Resend' : 'Send OTP'}</button>
                </div>
                {otpSent && <p className="-mt-2 text-xs text-brand-700">Demo: no SMS is sent — enter any 6 digits.</p>}
                {f.deal === 'rent' && !com && (
                  <label className="flex items-start justify-between gap-3 rounded-xl border border-ink-200 p-4 text-sm">
                    <span><span className="flex items-center gap-1.5 font-semibold"><BadgeCheck className="h-4 w-4 text-indigo-600" />Only Verified Tenants can contact me</span><span className="mt-0.5 block text-ink-500">Off by default. Verified Tenants have checked their ID with a licensed KYC partner; you’ll see “ID verified”, their name and employer if shared — never the document.</span></span>
                    <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-brand-600" checked={f.verifiedOnly} onChange={(e) => set({ verifiedOnly: e.target.checked })} aria-label="Only Verified Tenants can contact me" />
                  </label>
                )}
                <div className="rounded-xl border border-ink-200 p-4 text-sm">
                  <label className="flex items-start justify-between gap-3">
                    <span><span className="flex items-center gap-1.5 font-semibold"><Globe2 className="h-4 w-4 text-indigo-600" />I’m an NRI</span><span className="mt-0.5 block text-ink-500">We’ll schedule calls and visits in your time zone and can manage the property for you ({BRAND.name} NRI, planned).</span></span>
                    <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-brand-600" checked={f.nri} onChange={(e) => set({ nri: e.target.checked })} aria-label="I'm an NRI" />
                  </label>
                  {f.nri && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-ink-600">I live in</span><select className="input w-auto py-2" value={f.nriZone} onChange={(e) => set({ nriZone: e.target.value })}>{NRI_ZONES.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}</select><Link href="/nri/" className="text-xs text-brand-700 underline">What {BRAND.name} NRI includes</Link></div>}
                </div>
                <div className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600"><ShieldCheck className="mr-1 inline h-4 w-4 text-brand-600" />Your number is <strong>never shown</strong>. Tenants/buyers call a masked {BRAND.name} number; you can pause calls anytime.</div>
                <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-brand-600" checked={f.agree} onChange={(e) => set({ agree: e.target.checked })} />I confirm I am the owner{com ? ' or authorised signatory' : ''} (not a broker) and agree to the <Link href="/legal/#terms" className="text-brand-700 underline">Terms</Link>.</label>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-5">
              <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-ghost"><ChevronLeft className="h-4 w-4" />Back</button>
              {step < STEPS.length - 1
                ? <button onClick={() => setStep((s) => s + 1)} disabled={!valid} className="btn-primary">Continue<ChevronRight className="h-4 w-4" /></button>
                : <button onClick={submit} disabled={!valid} className="btn-accent">Publish free listing<Check className="h-4 w-4" /></button>}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white"><div className="text-xs font-semibold uppercase tracking-wider text-brand-100">Live preview</div><div className="mt-1 font-display text-lg font-bold">{summary(f)} {f.deal === 'rent' ? (com ? 'for lease' : 'for rent') : 'for sale'}</div><div className="text-sm text-brand-100">{f.society || 'Your society'}, {f.locality || 'Locality'}</div></div>
            <div className="space-y-2 p-4 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Price</span><span className="font-semibold">{f.price ? formatINR(+f.price) + (f.deal === 'rent' ? '/mo' : '') : '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Area</span><span className="font-semibold">{f.area ? `${(+f.area).toLocaleString('en-IN')} sq ft` : '—'}</span></div>
              {com && f.deal === 'rent' && <div className="flex justify-between"><span className="text-ink-500">Lease terms</span><span className="font-semibold">{f.lockIn} mo lock-in · {f.depositMonths} mo deposit</span></div>}
              {com && f.seats && <div className="flex justify-between"><span className="text-ink-500">Seats</span><span className="font-semibold">{f.seats}</span></div>}
              <div className="flex justify-between"><span className="text-ink-500">Verification</span><span className={cn('font-semibold', upload === 'done' ? 'text-brand-700' : 'text-ink-400')}>{upload === 'done' ? 'Video ✓' : 'Pending'}{f.ownerDoc ? ' · Owner doc' : ''}</span></div>
              {f.deal === 'rent' && !com && <div className="flex justify-between"><span className="text-ink-500">Deposit Safe</span><span className="font-semibold">{f.depositSafe ? 'Opted in' : 'Not opted in (fine)'}</span></div>}
              {f.description && <p className="line-clamp-4 border-t border-ink-100 pt-2 text-xs text-ink-600">{f.description}</p>}
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-saffron-50 p-4 text-sm text-saffron-800"><strong>Free forever for owners.</strong> No listing fee, no “premium relationship manager” upsell. Optional add-ons on the <Link href="/pricing/" className="underline">pricing page</Link>.</div>
        </aside>
      </div>
    </div>
  );
}
