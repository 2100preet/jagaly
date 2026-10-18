'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, MapPin, Wallet, BedDouble } from 'lucide-react';
import { LOCALITIES } from '@/data/geo';
import { cn } from '@/lib/format';

const TABS = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'new', label: 'New projects' },
] as const;

const BUDGETS = {
  rent: [['', 'Any budget'], ['20000', 'Up to ₹20K'], ['35000', 'Up to ₹35K'], ['50000', 'Up to ₹50K'], ['80000', 'Up to ₹80K'], ['150000', 'Up to ₹1.5L']],
  buy: [['', 'Any budget'], ['5000000', 'Up to ₹50 L'], ['8000000', 'Up to ₹80 L'], ['12000000', 'Up to ₹1.2 Cr'], ['20000000', 'Up to ₹2 Cr'], ['50000000', 'Up to ₹5 Cr']],
};

export default function SearchHero() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('rent');
  const [locality, setLocality] = useState('');
  const [budget, setBudget] = useState('');
  const [bhk, setBhk] = useState('');
  const budgets = tab === 'rent' ? BUDGETS.rent : BUDGETS.buy;

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    p.set('deal', tab === 'rent' ? 'rent' : 'buy');
    if (tab === 'new') p.set('kind', 'builder');
    if (locality) p.set('locality', locality);
    if (budget) p.set('max', budget);
    if (bhk) p.set('bhk', bhk);
    router.push(`/search/?${p.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl text-ink-900">
      <div className="inline-flex rounded-t-2xl bg-white/95 p-1.5 pb-0">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setBudget(''); }}
            className={cn('rounded-xl px-4 py-2 text-sm font-semibold transition sm:px-6', tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-ink-600 hover:text-ink-900')}>
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={go} className="grid gap-2 rounded-2xl rounded-tl-none bg-white p-3 shadow-lift sm:grid-cols-[1.4fr_1fr_.8fr_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 focus-within:border-brand-500">
          <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
          <select value={locality} onChange={(e) => setLocality(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Locality">
            <option value="">All localities in Bangalore</option>
            {LOCALITIES.map((l) => <option key={l.name}>{l.name}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 focus-within:border-brand-500">
          <Wallet className="h-4 w-4 shrink-0 text-brand-600" />
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Budget">
            {budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 focus-within:border-brand-500">
          <BedDouble className="h-4 w-4 shrink-0 text-brand-600" />
          <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" aria-label="BHK">
            <option value="">Any BHK</option>
            {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}{b === 4 ? '+' : ''} BHK</option>)}
          </select>
        </label>
        <button className="btn-accent py-3 text-base"><Search className="h-5 w-5" />Search</button>
      </form>
    </div>
  );
}
