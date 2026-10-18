'use client';
import { useState } from 'react';
import { fullINR, formatINR } from '@/lib/format';

export default function DepositEstimator() {
  const [rent, setRent] = useState(35000);
  const [months, setMonths] = useState(6);
  const dep = rent * months;
  const lostInterest = dep * 0.07; // 7%/yr FD equivalent over 1 year
  return (
    <div className="rounded-3xl bg-white p-6 text-ink-900 shadow-lift">
      <div className="font-display text-lg font-bold">What’s at stake?</div>
      <label className="mt-4 block text-sm"><div className="flex justify-between"><span className="text-ink-600">Monthly rent</span><span className="font-semibold">{fullINR(rent)}</span></div>
        <input type="range" min={10000} max={150000} step={1000} value={rent} onChange={(e) => setRent(+e.target.value)} className="mt-1 w-full accent-brand-600" /></label>
      <label className="mt-3 block text-sm"><div className="flex justify-between"><span className="text-ink-600">Deposit months asked</span><span className="font-semibold">{months} months</span></div>
        <input type="range" min={2} max={10} value={months} onChange={(e) => setMonths(+e.target.value)} className="mt-1 w-full accent-brand-600" /></label>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-ink-50 p-4"><div className="text-xs text-ink-500">Your deposit</div><div className="font-display text-2xl font-extrabold">{formatINR(dep)}</div></div>
        <div className="rounded-2xl bg-saffron-50 p-4"><div className="text-xs text-saffron-700">Typical “painting” cut (1 mo)</div><div className="font-display text-2xl font-extrabold text-saffron-700">{formatINR(rent)}</div></div>
      </div>
      <div className="mt-3 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">With Deposit Safe, deductions need photo evidence, and the {formatINR(dep)} sits in escrow. You also avoid ~{formatINR(lostInterest)}/yr of interest you’d otherwise forgo (if escrow is interest-bearing — planned).</div>
    </div>
  );
}
