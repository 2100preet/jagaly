'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Wallet, BedDouble, Building2 } from 'lucide-react';
import LocalityTypeahead from './LocalityTypeahead';
import { COMMERCIAL_TYPES, PROPERTY_TYPES } from '@/data/commercial';
import { cn } from '@/lib/format';

const TABS = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'new', label: 'New projects' },
  { key: 'commercial', label: 'Commercial' },
] as const;

const BUDGETS = {
  rent: [['', 'Any budget'], ['20000', 'Up to ₹20K'], ['35000', 'Up to ₹35K'], ['50000', 'Up to ₹50K'], ['80000', 'Up to ₹80K'], ['150000', 'Up to ₹1.5L']],
  buy: [['', 'Any budget'], ['5000000', 'Up to ₹50 L'], ['8000000', 'Up to ₹80 L'], ['12000000', 'Up to ₹1.2 Cr'], ['20000000', 'Up to ₹2 Cr'], ['50000000', 'Up to ₹5 Cr']],
  comRent: [['', 'Any budget'], ['100000', 'Up to ₹1 L/mo'], ['300000', 'Up to ₹3 L/mo'], ['500000', 'Up to ₹5 L/mo'], ['1000000', 'Up to ₹10 L/mo'], ['3000000', 'Up to ₹30 L/mo']],
  comBuy: [['', 'Any budget'], ['10000000', 'Up to ₹1 Cr'], ['30000000', 'Up to ₹3 Cr'], ['100000000', 'Up to ₹10 Cr'], ['300000000', 'Up to ₹30 Cr']],
};

export default function SearchHero() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('rent');
  const [comDeal, setComDeal] = useState<'rent' | 'buy'>('rent');
  const [locality, setLocality] = useState('');
  const [budget, setBudget] = useState('');
  const [bhk, setBhk] = useState('');
  const [ptype, setPtype] = useState('');
  const com = tab === 'commercial';
  const budgets = com ? (comDeal === 'rent' ? BUDGETS.comRent : BUDGETS.comBuy) : tab === 'rent' ? BUDGETS.rent : BUDGETS.buy;

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (com) {
      p.set('seg', 'com');
      p.set('deal', comDeal);
      if (ptype) p.set('ptype', ptype);
    } else {
      p.set('deal', tab === 'rent' ? 'rent' : 'buy');
      if (tab === 'new') p.set('kind', 'builder');
      if (bhk) p.set('bhk', bhk);
    }
    if (locality) p.set('locality', locality);
    if (budget) p.set('max', budget);
    router.push(`/search/?${p.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl text-ink-900">
      <div className="flex flex-wrap items-end gap-2">
        <div className="inline-flex rounded-t-2xl bg-white/95 p-1.5 pb-0" role="tablist" aria-label="Search type">
          {TABS.map((t) => (
            <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => { setTab(t.key); setBudget(''); }}
              className={cn('rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-5', tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-ink-600 hover:text-ink-900')}>
              {t.label}
            </button>
          ))}
        </div>
        {com && (
          <div className="mb-1.5 inline-flex rounded-xl bg-white/15 p-1 text-white" role="group" aria-label="Commercial deal">
            {([['rent', 'Lease / Rent'], ['buy', 'Buy']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setComDeal(k); setBudget(''); if (k === 'rent' && ptype === 'comm-land') setPtype(''); }} aria-pressed={comDeal === k}
                className={cn('rounded-lg px-3 py-1 text-xs font-semibold', comDeal === k ? 'bg-white text-brand-800' : 'text-white/85 hover:text-white')}>{l}</button>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={go} className="grid gap-2 rounded-2xl rounded-tl-none bg-white p-3 shadow-lift sm:grid-cols-[1.4fr_1fr_.9fr_auto]">
        <div className="rounded-xl border border-ink-200 px-3 py-1.5 focus-within:border-brand-500">
          <LocalityTypeahead value={locality} onChange={setLocality} allLabel="All of Bangalore — or type a locality" placeholder={com ? 'Type a locality, e.g. ORR, Peenya, MG Road' : 'Type a locality, e.g. Kora, BTM, E City'} inputClassName="py-1.5" id="hero-locality" />
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 focus-within:border-brand-500">
          <Wallet className="h-4 w-4 shrink-0 text-brand-600" />
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Budget">
            {budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        {com ? (
          <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 focus-within:border-brand-500">
            <Building2 className="h-4 w-4 shrink-0 text-brand-600" />
            <select value={ptype} onChange={(e) => setPtype(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Commercial property type">
              <option value="">Any commercial type</option>
              {COMMERCIAL_TYPES.filter((t) => comDeal === 'buy' || t !== 'comm-land').map((t) => <option key={t} value={t}>{PROPERTY_TYPES[t].label}</option>)}
            </select>
          </label>
        ) : (
          <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 focus-within:border-brand-500">
            <BedDouble className="h-4 w-4 shrink-0 text-brand-600" />
            <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" aria-label="BHK">
              <option value="">Any BHK</option>
              {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}{b === 4 ? '+' : ''} BHK</option>)}
            </select>
          </label>
        )}
        <button type="submit" className="btn-accent py-3 text-base"><Search className="h-5 w-5" />Search</button>
      </form>
    </div>
  );
}
