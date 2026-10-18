'use client';
import Link from 'next/link';
import { BedDouble, Maximize2, MapPin, Sofa, PawPrint } from 'lucide-react';
import type { Listing } from '@/data/listings';
import { formatPrice, formatINR } from '@/lib/format';
import PropertyArt from './PropertyArt';
import { VerifiedBadge, KindBadge, PriceVerdictChip } from './Badges';

export default function ListingCard({ l, active, onHover }: { l: Listing; active?: boolean; onHover?: (id: string | null) => void }) {
  return (
    <Link href={`/property/${l.id}/`} onMouseEnter={() => onHover?.(l.id)} onMouseLeave={() => onHover?.(null)}
      className={`card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift ${active ? 'ring-2 ring-saffron-400' : ''}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <PropertyArt hue={l.hue} kind={l.kind} bhk={l.bhk} className="h-full w-full transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5"><VerifiedBadge l={l} /></div>
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-600">{l.deal === 'rent' ? 'For rent' : 'For sale'}</div>
        <div className="absolute bottom-2 left-3 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">Sample listing</div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-display text-xl font-bold text-ink-900">{formatPrice(l.price, l.deal)}</div>
            <div className="text-xs text-ink-500">
              {l.deal === 'buy' ? `₹${Math.round(l.price / l.areaSqft).toLocaleString('en-IN')}/sqft` : `Deposit ${formatINR(l.deposit!)}`}
            </div>
          </div>
          <PriceVerdictChip l={l} />
        </div>
        <h3 className="mt-2 line-clamp-1 font-semibold text-ink-800">{l.title}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500"><MapPin className="h-3.5 w-3.5" />{l.locality}, Bangalore</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-600">
          <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{l.bhk} BHK</span>
          <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{l.areaSqft.toLocaleString('en-IN')} sqft</span>
          <span className="flex items-center gap-1 capitalize"><Sofa className="h-3.5 w-3.5" />{l.furnishing === 'semi' ? 'Semi-furnished' : l.furnishing}</span>
          {l.pets && l.deal === 'rent' && <span className="flex items-center gap-1"><PawPrint className="h-3.5 w-3.5" />Pets ok</span>}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
          <KindBadge l={l} />
          <span className="text-[11px] text-ink-400">{l.postedDaysAgo}d ago</span>
        </div>
      </div>
    </Link>
  );
}
