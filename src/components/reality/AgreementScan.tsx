'use client';
import { useState } from 'react';
import { FileSearch, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { scanAgreement, SAMPLE_AGREEMENT, type AgreementFlag } from '@/lib/reality';
import { cn } from '@/lib/format';

const ICON = { high: AlertOctagon, medium: AlertTriangle, info: Info } as const;
const STYLE = { high: 'border-red-200 bg-red-50 text-red-900', medium: 'border-coral-200 bg-coral-50 text-coral-900', info: 'border-ink-200 bg-ink-50 text-ink-700' } as const;

/** Rental agreement red-flag scan. Runs entirely in the browser; nothing is uploaded. */
export default function AgreementScan() {
  const [text, setText] = useState(SAMPLE_AGREEMENT);
  const [flags, setFlags] = useState<AgreementFlag[] | null>(null);
  return (
    <div>
      <textarea value={text} onChange={(e) => { setText(e.target.value); setFlags(null); }} rows={7} className="input text-xs leading-relaxed" aria-label="Agreement text" placeholder="Paste your draft rental agreement here" />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button onClick={() => setFlags(scanAgreement(text))} className="btn-primary"><FileSearch className="h-4 w-4" />Scan for red flags</button>
        <button onClick={() => { setText(SAMPLE_AGREEMENT); setFlags(null); }} className="btn-ghost">Load sample agreement</button>
        <span className="text-[11px] text-ink-500">Runs in your browser; nothing is uploaded.</span>
      </div>
      {flags && (
        <div className="mt-4 space-y-2" aria-live="polite">
          <div className="text-sm font-semibold">{flags.length ? `${flags.filter((f) => f.level === 'high').length} high · ${flags.filter((f) => f.level === 'medium').length} medium · ${flags.filter((f) => f.level === 'info').length} info` : 'No red flags found by the automated check.'}</div>
          {flags.map((f, i) => { const I = ICON[f.level]; return (
            <div key={i} className={cn('rounded-xl border p-3 text-sm', STYLE[f.level])}>
              <div className="flex items-center gap-2 font-semibold"><I className="h-4 w-4 shrink-0" />{f.title}</div>
              <p className="mt-1 text-xs opacity-90">{f.detail}</p>
              {f.quote && <p className="mt-1 text-[11px] italic opacity-75">“…{f.quote}…”</p>}
            </div>
          ); })}
        </div>
      )}
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-ink-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Prototype: rule-based checks for common Bengaluru rental clauses. In the product an AI reviewer explains each clause in English, Kannada or Hindi, and a partner lawyer can review on request. Not legal advice.</p>
    </div>
  );
}
