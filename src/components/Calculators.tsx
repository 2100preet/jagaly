'use client';
import { useMemo, useState } from 'react';
import { emi, formatINR, fullINR } from '@/lib/format';

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; fmt: (n: number) => string }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm"><span className="text-ink-600">{label}</span><span className="font-semibold text-ink-900">{fmt(value)}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-brand-600" />
    </label>
  );
}

export function EmiCalculator({ price }: { price: number }) {
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const loan = price * (1 - down / 100);
  const m = emi(loan, rate, years);
  const total = m * years * 12;
  const interest = total - loan;
  const pct = (loan / total) * 100;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Slider label="Down payment" value={down} min={10} max={60} step={5} onChange={setDown} fmt={(n) => `${n}% · ${formatINR(price * n / 100)}`} />
        <Slider label="Interest rate (p.a.)" value={rate} min={7} max={12} step={0.05} onChange={setRate} fmt={(n) => `${n.toFixed(2)}%`} />
        <Slider label="Tenure" value={years} min={5} max={30} step={1} onChange={setYears} fmt={(n) => `${n} years`} />
      </div>
      <div className="rounded-2xl bg-brand-50 p-5">
        <div className="text-sm text-brand-800">Monthly EMI</div>
        <div className="font-display text-3xl font-extrabold text-brand-800">{fullINR(m)}</div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-saffron-300"><div className="h-full bg-brand-600" style={{ width: `${pct}%` }} /></div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div><div className="flex items-center gap-1.5 text-ink-500"><span className="h-2 w-2 rounded-full bg-brand-600" />Loan amount</div><div className="font-semibold">{formatINR(loan)}</div></div>
          <div><div className="flex items-center gap-1.5 text-ink-500"><span className="h-2 w-2 rounded-full bg-saffron-400" />Total interest</div><div className="font-semibold">{formatINR(interest)}</div></div>
        </div>
        <p className="mt-3 text-[11px] text-ink-500">Indicative only. Actual EMI depends on lender, credit score and processing fees.</p>
      </div>
    </div>
  );
}

/** Simple rent-vs-buy over N years: compares net cost of renting (rent + lost returns on nothing) vs buying (EMI interest, maintenance, opportunity cost of down payment, minus appreciation). */
export function RentVsBuy({ price, monthlyRent }: { price: number; monthlyRent: number }) {
  const [years, setYears] = useState(7);
  const [rentHike, setRentHike] = useState(7);
  const [appreciation, setAppreciation] = useState(6);
  const [rate, setRate] = useState(8.5);
  const invReturn = 8;
  const r = useMemo(() => {
    let rentTotal = 0, rent = monthlyRent;
    for (let y = 0; y < years; y++) { rentTotal += rent * 12; rent *= 1 + rentHike / 100; }
    const down = price * 0.2, loan = price - down;
    const m = emi(loan, rate, 20);
    // outstanding principal after N years
    const i = rate / 1200; const n = years * 12;
    const outstanding = loan * Math.pow(1 + i, n) - m * ((Math.pow(1 + i, n) - 1) / i);
    const paid = m * n;
    const value = price * Math.pow(1 + appreciation / 100, years);
    const stamp = price * 0.07; // stamp duty + registration (approx, Karnataka)
    const lostReturns = down * (Math.pow(1 + invReturn / 100, years) - 1);
    const buyCost = down + paid + stamp + lostReturns - (value - Math.max(0, outstanding));
    return { rentTotal, buyCost, m };
  }, [years, rentHike, appreciation, rate, price, monthlyRent]);
  const buyWins = r.buyCost < r.rentTotal;
  const max = Math.max(r.rentTotal, Math.abs(r.buyCost));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Slider label="How long will you stay?" value={years} min={2} max={20} step={1} onChange={setYears} fmt={(n) => `${n} years`} />
        <Slider label="Annual rent increase" value={rentHike} min={3} max={12} step={1} onChange={setRentHike} fmt={(n) => `${n}%`} />
        <Slider label="Property appreciation" value={appreciation} min={0} max={12} step={0.5} onChange={setAppreciation} fmt={(n) => `${n}%/yr`} />
        <Slider label="Home loan rate" value={rate} min={7} max={12} step={0.05} onChange={setRate} fmt={(n) => `${n.toFixed(2)}%`} />
        <p className="text-xs text-ink-500">Assumes equivalent rent of {fullINR(monthlyRent)}/mo, 20% down, 20-yr loan, 7% stamp duty & registration, 8% return on invested down payment.</p>
      </div>
      <div className="rounded-2xl border border-ink-200 p-5">
        <div className={`chip ${buyWins ? 'bg-brand-600 text-white' : 'bg-saffron-500 text-white'}`}>{buyWins ? 'Buying looks better' : 'Renting looks better'} over {years} yrs</div>
        {[['Net cost of renting', r.rentTotal, 'bg-saffron-400'], ['Net cost of buying', r.buyCost, 'bg-brand-600']].map(([l, v, c]) => (
          <div key={l as string} className="mt-4">
            <div className="flex justify-between text-sm"><span className="text-ink-600">{l}</span><span className="font-semibold">{(v as number) < 0 ? '− ' : ''}{formatINR(Math.abs(v as number))}</span></div>
            <div className="mt-1 h-2.5 rounded-full bg-ink-100"><div className={`h-full rounded-full ${c}`} style={{ width: `${Math.max(3, (Math.abs(v as number) / max) * 100)}%` }} /></div>
          </div>
        ))}
        <p className="mt-4 text-sm text-ink-600">Difference: <strong>{formatINR(Math.abs(r.rentTotal - r.buyCost))}</strong> in favour of {buyWins ? 'buying' : 'renting'}.</p>
        <p className="mt-2 text-[11px] text-ink-400">Simplified estimate, not financial advice.</p>
      </div>
    </div>
  );
}
