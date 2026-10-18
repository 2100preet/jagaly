'use client';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { BRAND, FEATURES } from '@/config/brand';

type Msg = { from: 'bot' | 'me'; text: string };

function reply(q: string): string {
  const s = q.toLowerCase();
  if (/commercial|office|shop|showroom|warehouse|godown|retail|co-?working|industrial|\blease\b|lock-?in|zoning|kva|seats/.test(s)) return 'Commercial is in: switch the search to “Commercial” for offices, co-working, shops, showrooms, F&B, warehouses, industrial sheds and land. Filter by seats, power load (kVA), frontage, lock-in and zoning. Each sample listing shows True Price per sq ft, a Property Truth Score (power backup, flooding, access road, zoning, OC/CC) and a lease calculator with 5% yearly escalation, deposit months and CAM.';
  if (/nri|abroad|overseas|poa|power of attorney|nre|nro|fema/.test(s)) return `${BRAND.name} NRI (planned) offers live video visits across time zones, remote buying with partner-lawyer title checks, PoA guidance, and property management for NRI owners. See the ${BRAND.name} NRI page — general info, not legal or tax advice.`;
  if (/verified tenant|kyc|aadhaar|digilocker/.test(s)) return `Verified Tenant is optional: verify your ID via DigiLocker or Aadhaar offline e-KYC through a licensed partner. ${BRAND.name} never stores your Aadhaar number; owners see only “ID verified”, your name and employer if you share it.`;
  if (/sale deed|document|docs|verify my listing|proof/.test(s)) return `Owners never need a sale deed to list. Tier 1 (required): phone OTP + live in-app video with GPS. Tier 2 (optional Verified Owner): a tax receipt or electricity bill, blurred to name + address, kept private. Tier 3 happens only at deal stage.`;
  if (/deposit|escrow|safe/.test(s)) return `${FEATURES.deposit} is optional. Owners can list normally; if an owner opts in (or accepts your request), the deposit sits with a regulated escrow partner — ${BRAND.name} never holds the money. Move-in and move-out videos decide any deductions. Look for the “${FEATURES.deposit} Owner” badge.`;
  if (/broker|spam|number|call|masked/.test(s)) return `That’s our ${FEATURES.spam}: your number is never shown and never resold. Owners reach you through a masked ${BRAND.name} line, and listings flagged as brokers are removed within 24h.`;
  if (/emi|loan|interest/.test(s)) return 'Open any buy listing and scroll to the EMI calculator. At 8.5% for 20 years, every ₹10 L of loan is roughly ₹8,678/month.';
  if (/flood|water|power|khata|risk/.test(s)) return `Every listing has a ${FEATURES.truth} (sample): commute, water & tanker dependence, flooding, power cuts, e-Khata A/B, RERA delays and title flags. Higher = safer.`;
  if (/whitefield|itpl/.test(s)) return 'Whitefield has 5 sample listings right now — 2 BHKs from ₹37K/mo. Want me to filter by commute to ITPL under 5 km?';
  if (/hsr|koramangala/.test(s)) return 'HSR & Koramangala are pricier (₹42–48/sqft rent, sample) but have great Khata scores. Try the “Pakka Proof only” filter to see video + GPS verified homes.';
  if (/pet|dog|cat/.test(s)) return 'Toggle “Pets allowed” in search filters — about half of our sample rentals are pet-friendly.';
  if (/price|fair|overpriced|true price/.test(s)) return `The ${FEATURES.price} estimates value from locality rates, size, furnishing and age (sample model). Rentals in line with the market get a ${FEATURES.fairRent} badge; red means asking >12% above estimate.`;
  return `I’m the ${BRAND.name} assistant (demo). Ask me about localities, commute, True Price, Deposit Safe, EMI or how Pakka Proof works!`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: `Namaste! 👋 I’m ${BRAND.name} AI (demo). Looking to rent or buy in ${BRAND.city}?` }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener('gk-open-chat', h);
    return () => window.removeEventListener('gk-open-chat', h);
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { from: 'bot', text: reply(text) }]); }, 700);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Open assistant"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lift transition hover:scale-105">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-saffron-500 text-[10px] font-bold">AI</span>}
      </button>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[480px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift">
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-900 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15"><Sparkles className="h-5 w-5" /></span>
            <div>
              <div className="text-sm font-semibold">{BRAND.name} Assistant</div>
              <div className="text-[11px] text-brand-100">Demo mock · scripted replies</div>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-ink-50 p-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex'}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.from === 'me' ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm border border-ink-200 bg-white text-ink-800'}`}>{m.text}</div>
              </div>
            ))}
            {typing && <div className="flex"><div className="rounded-2xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-400">typing…</div></div>}
            <div ref={end} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto border-t border-ink-100 px-3 py-2 no-scrollbar">
            {[`How does ${FEATURES.deposit} work?`, 'Is my number masked?', 'Flood risk?', 'EMI for ₹80 L'].map((q) => (
              <button key={q} onClick={() => send(q)} className="chip shrink-0 border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100">{q}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-ink-100 p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="input" placeholder="Ask anything…" />
            <button className="btn-primary px-3" aria-label="Send"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
