'use client';
import { useState } from 'react';
import { Mic, Check, MessageCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';

const SAMPLES = {
  kn: { lang: 'ಕನ್ನಡ', text: 'ನಮಸ್ಕಾರ, ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್ ಸೆಕ್ಟರ್ 2 ನಲ್ಲಿ ಎರಡು ಬಿಎಚ್‌ಕೆ ಮನೆ ಬಾಡಿಗೆಗೆ ಇದೆ. ಬಾಡಿಗೆ ಮೂವತ್ತೆರಡು ಸಾವಿರ, ಡೆಪಾಸಿಟ್ ಎರಡು ಲಕ್ಷ. ಕಾವೇರಿ ನೀರು ಇದೆ, ಕಾರ್ ಪಾರ್ಕಿಂಗ್ ಇದೆ. ಕುಟುಂಬಕ್ಕೆ ಮಾತ್ರ.', en: 'Hello, a 2 BHK house is for rent in HSR Layout Sector 2. Rent thirty-two thousand, deposit two lakh. Cauvery water is there, car parking is there. Family only.', kannada: true },
  hi: { lang: 'हिन्दी', text: 'नमस्ते, व्हाइटफ़ील्ड में तीन बीएचके फ्लैट किराए पर है। किराया पैंतालीस हज़ार, डिपॉज़िट तीन लाख। पावर बैकअप है, पालतू जानवर चलेंगे।', en: 'Hello, a 3 BHK flat is for rent in Whitefield. Rent forty-five thousand, deposit three lakh. Power backup is there, pets are fine.', kannada: false },
  en: { lang: 'English', text: 'Hi, my 1 BHK in Koramangala 5th Block is available from next month. Rent 24 thousand, deposit one lakh twenty. Fully furnished, bachelors okay.', en: '', kannada: false },
} as const;
const FIELDS: Record<keyof typeof SAMPLES, [string, string][]> = {
  kn: [['Locality', 'HSR Layout (Sector 2)'], ['Type', '2 BHK, for rent'], ['Rent', '₹32,000/mo'], ['Deposit', '₹2,00,000'], ['Water', 'Cauvery'], ['Parking', 'Car'], ['Tenants', 'Family only']],
  hi: [['Locality', 'Whitefield'], ['Type', '3 BHK, for rent'], ['Rent', '₹45,000/mo'], ['Deposit', '₹3,00,000'], ['Power', 'Backup available'], ['Pets', 'Allowed']],
  en: [['Locality', 'Koramangala (5th Block)'], ['Type', '1 BHK, for rent'], ['Rent', '₹24,000/mo'], ['Deposit', '₹1,20,000'], ['Furnishing', 'Fully furnished'], ['Tenants', 'Bachelors OK'], ['Available', 'Next month']],
};

/** Voice-note listing demo: owner speaks in Kannada / Hindi / English, AI fills the listing (sample transcripts). */
export default function VoiceListing() {
  const [k, setK] = useState<keyof typeof SAMPLES>('kn');
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const s = SAMPLES[k];
  const run = () => { setStage(1); setTimeout(() => setStage(2), 900); };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="inline-flex rounded-xl bg-ink-100 p-1">{(Object.keys(SAMPLES) as (keyof typeof SAMPLES)[]).map((x) => (
          <button key={x} onClick={() => { setK(x); setStage(0); }} className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', k === x ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500', x !== 'en' && 'font-kannada')}>{SAMPLES[x].lang}</button>
        ))}</div>
        <div className="mt-3 rounded-2xl bg-[#e7f6e9] p-3">
          <div className="ml-auto max-w-[95%] rounded-2xl rounded-tr-sm bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-ink-500"><Mic className="h-4 w-4 text-brand-600" />Voice note · 0:{k === 'kn' ? '14' : '11'} (sample)</div>
            <p className={cn('mt-1.5 text-sm text-ink-800', k !== 'en' && 'font-kannada')} lang={k}>{s.text}</p>
            {s.en && <p className="mt-1 text-[11px] italic text-ink-500">English: {s.en}</p>}
          </div>
        </div>
        <button onClick={run} disabled={stage === 1} className="btn-primary mt-3">{stage === 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}{stage === 1 ? 'Listening…' : 'Turn voice note into a listing'}</button>
      </div>
      <div className="rounded-2xl border border-ink-200 p-4">
        <div className="text-sm font-semibold">Draft listing</div>
        {stage < 2 ? <p className="mt-2 text-sm text-ink-500">The AI fills these from the voice note. The owner confirms on WhatsApp, then records the live video for {`Proof`}.</p> : (
          <>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">{FIELDS[k].map(([a, b]) => <div key={a} className="contents"><dt className="text-ink-500">{a}</dt><dd className="font-semibold">{b}</dd></div>)}</dl>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-700"><Check className="h-4 w-4" />Reply sent to owner in the same language: confirm details, then record a live walk-through.</p>
          </>
        )}
      </div>
      <p className="flex items-start gap-1.5 text-[11px] text-ink-500 md:col-span-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Demo with sample transcripts. Planned on WhatsApp: speech-to-text for Kannada, Hindi and English, then an AI agent extracts the listing fields and asks only for what is missing.</p>
    </div>
  );
}
