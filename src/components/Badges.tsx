import { ShieldCheck, Video, MapPin, User, Building2, Wallet, BadgeCheck } from 'lucide-react';
import type { Listing } from '@/data/listings';
import { FEATURES } from '@/config/brand';

export function VerifiedBadge({ l, size = 'sm' }: { l: Listing; size?: 'sm' | 'lg' }) {
  if (!l.verified) return <span className="chip bg-ink-100 text-ink-500">Verification pending</span>;
  return (
    <span className={`chip bg-brand-600 text-white ${size === 'lg' ? 'px-3 py-1.5 text-sm' : ''}`} title="Video walk-through + GPS verified on-site">
      <ShieldCheck className="h-3.5 w-3.5" /> {FEATURES.proof}
      {size === 'lg' && <><Video className="ml-1 h-3.5 w-3.5" /><MapPin className="h-3.5 w-3.5" /></>}
    </span>
  );
}

export function KindBadge({ l }: { l: Listing }) {
  return l.kind === 'owner'
    ? <span className="chip bg-saffron-100 text-saffron-700"><User className="h-3 w-3" />Owner · no brokerage</span>
    : <span className="chip bg-indigo-50 text-indigo-700"><Building2 className="h-3 w-3" />Builder project</span>;
}

export function priceVerdict(l: Listing) {
  const d = (l.price - l.truePrice) / l.truePrice;
  if (d <= -0.05) return { label: 'Good deal', tone: 'text-brand-700 bg-brand-50 border-brand-200', bar: 'bg-brand-500', d };
  if (d <= 0.06) return { label: 'Fair price', tone: 'text-brand-700 bg-brand-50 border-brand-200', bar: 'bg-brand-400', d };
  if (d <= 0.12) return { label: 'Slightly high', tone: 'text-saffron-700 bg-saffron-50 border-saffron-200', bar: 'bg-saffron-400', d };
  return { label: 'Overpriced', tone: 'text-red-700 bg-red-50 border-red-200', bar: 'bg-red-500', d };
}

export function PriceVerdictChip({ l }: { l: Listing }) {
  const v = priceVerdict(l);
  if (l.deal === 'rent' && v.d <= 0.06) return <span className={`chip border ${v.tone}`} title="True Price Engine: rent in line with market">✓ {FEATURES.fairRent}</span>;
  return <span className={`chip border ${v.tone}`}>{v.label}</span>;
}

/** Optional owner perk: owner accepts Deposit Safe (shown only on opted-in listings). */
export function DepositSafeBadge({ l, size = 'sm' }: { l: Listing; size?: 'sm' | 'lg' }) {
  if (!l.depositSafe) return null;
  return <span className={`chip bg-saffron-500 text-white ${size === 'lg' ? 'px-3 py-1.5 text-sm' : ''}`} title="Owner opted in to Deposit Safe (optional)"><Wallet className="h-3.5 w-3.5" />{FEATURES.deposit} Owner</span>;
}

/** Optional Tier 2: owner name matched to a tax receipt / electricity bill (doc kept private). */
export function VerifiedOwnerBadge({ l }: { l: Listing }) {
  if (!l.verification.ownerDoc) return null;
  return <span className="chip bg-white/95 text-brand-700 ring-1 ring-brand-200" title="Owner name matched to a property tax receipt or electricity bill (kept private)"><BadgeCheck className="h-3.5 w-3.5" />Verified Owner</span>;
}
