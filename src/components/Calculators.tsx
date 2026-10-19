'use client';
import { useMemo, useState } from 'react';
import { emi, formatINR, fullINR } from '@/lib/format';

export function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; fmt: (n: number) => string }) {
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
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-coral-300"><div className="h-full bg-brand-600" style={{ width: `${pct}%` }} /></div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div><div className="flex items-center gap-1.5 text-ink-500"><span className="h-2 w-2 rounded-full bg-brand-600" />Loan amount</div><div className="font-semibold">{formatINR(loan)}</div></div>
          <div><div className="flex items-center gap-1.5 text-ink-500"><span className="h-2 w-2 rounded-full bg-coral-400" />Total interest</div><div className="font-semibold">{formatINR(interest)}</div></div>
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
        <div className={`chip ${buyWins ? 'bg-brand-600 text-white' : 'bg-coral-600 text-white'}`}>{buyWins ? 'Buying looks better' : 'Renting looks better'} over {years} yrs</div>
        {[['Net cost of renting', r.rentTotal, 'bg-coral-400'], ['Net cost of buying', r.buyCost, 'bg-brand-600']].map(([l, v, c]) => (
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

/** Commercial lease cost: rent with yearly escalation + CAM + refundable deposit (sample calculator). */
export function LeaseCalculator({ rent: rent0, areaSqft, escalation: esc0 = 5, depositMonths: dep0 = 6, camPsf: cam0 = 0, lockInMonths = 36 }: { rent: number; areaSqft: number; escalation?: number; depositMonths?: number; camPsf?: number; lockInMonths?: number }) {
  const [rent, setRent] = useState(rent0);
  const [esc, setEsc] = useState(esc0);
  const [years, setYears] = useState(Math.max(3, Math.ceil(lockInMonths / 12)));
  const [dep, setDep] = useState(dep0);
  const [cam, setCam] = useState(cam0);
  const [gst, setGst] = useState(false);
  const rows = useMemo(() => Array.from({ length: years }, (_, i) => {
    const monthly = rent * Math.pow(1 + esc / 100, i);
    const camM = cam * areaSqft;
    const base = (monthly + camM) * 12;
    return { y: i + 1, monthly, rentY: monthly * 12, camY: camM * 12, gstY: gst ? base * 0.18 : 0 };
  }), [rent, esc, years, cam, areaSqft, gst]);
  const totRent = rows.reduce((a, r) => a + r.rentY, 0);
  const totCam = rows.reduce((a, r) => a + r.camY, 0);
  const totGst = rows.reduce((a, r) => a + r.gstY, 0);
  const total = totRent + totCam + totGst;
  const deposit = rent * dep;
  return (
    <div className="grid gap-6 md:grid-cols-2" data-testid="lease-calculator">
      <div className="space-y-4">
        <Slider label="Starting rent" value={rent} min={Math.round(rent0 * 0.5)} max={Math.round(rent0 * 1.5)} step={Math.max(500, Math.round(rent0 / 200) * 10)} onChange={setRent} fmt={(n) => `${fullINR(n)}/mo · ₹${(n / areaSqft).toFixed(1)}/sqft`} />
        <Slider label="Yearly escalation" value={esc} min={0} max={15} step={0.5} onChange={setEsc} fmt={(n) => `${n}%`} />
        <Slider label="Lease term" value={years} min={1} max={15} step={1} onChange={setYears} fmt={(n) => `${n} year${n > 1 ? 's' : ''}`} />
        <Slider label="Security deposit" value={dep} min={0} max={12} step={1} onChange={setDep} fmt={(n) => `${n} months · ${formatINR(rent * n)}`} />
        <Slider label="CAM / maintenance" value={cam} min={0} max={40} step={0.5} onChange={setCam} fmt={(n) => (n ? `₹${n}/sqft/mo · ${formatINR(n * areaSqft)}/mo` : 'Included in rent')} />
        <label className="flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" className="accent-brand-600" checked={gst} onChange={(e) => setGst(e.target.checked)} />Add 18% GST on rent + CAM (if you can’t claim input credit)</label>
      </div>
      <div className="rounded-2xl bg-brand-50 p-5">
        <div className="text-sm text-ink-600">Total occupancy cost over {years} year{years > 1 ? 's' : ''}</div>
        <div className="font-display text-3xl font-extrabold text-brand-800" data-testid="lease-total">{formatINR(total)}</div>
        <div className="mt-1 text-xs text-ink-500">≈ {fullINR(total / (years * 12))}/mo effective · plus {formatINR(deposit)} refundable deposit</div>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div><dt className="text-ink-500">Rent</dt><dd className="font-semibold">{formatINR(totRent)}</dd></div>
          <div><dt className="text-ink-500">CAM</dt><dd className="font-semibold">{totCam ? formatINR(totCam) : 'Included'}</dd></div>
          {gst && <div><dt className="text-ink-500">GST (18%)</dt><dd className="font-semibold">{formatINR(totGst)}</dd></div>}
          <div><dt className="text-ink-500">Deposit (refundable)</dt><dd className="font-semibold">{formatINR(deposit)}</dd></div>
        </dl>
        <div className="mt-4 max-h-48 overflow-y-auto rounded-xl bg-white">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white text-ink-500"><tr><th className="px-3 py-2 text-left font-medium">Year</th><th className="px-3 py-2 text-right font-medium">Rent / mo</th><th className="px-3 py-2 text-right font-medium">Year total</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.y} className="border-t border-ink-100"><td className="px-3 py-1.5">{r.y}</td><td className="px-3 py-1.5 text-right">{fullINR(r.monthly)}</td><td className="px-3 py-1.5 text-right font-semibold">{formatINR(r.rentY + r.camY + r.gstY)}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-ink-500">Sample calculator. Excludes stamp duty and registration, fit-out, electricity and brokerage (none on Jagaly owner listings). Escalation compounds yearly.</p>
      </div>
    </div>
  );
}
