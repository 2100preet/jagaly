import Link from 'next/link';
import { BRAND } from '@/config/brand';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label={`${BRAND.name} home`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11 12 4l9 7" /><path d="M5 10v9h14v-9" /><path d="M9 19v-5h6v5" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-saffron-500" />
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`}>
        {BRAND.name}
      </span>
    </Link>
  );
}
