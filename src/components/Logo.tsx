import Link from 'next/link';
import { BRAND } from '@/config/brand';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Jagaly logo (house-J mark + wordmark). Source SVGs live in /public/brand (generated from /brand/src/make_logo.py). */
export default function Logo({ light = false, className = 'h-9' }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${BRAND.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}/brand/${light ? 'jagaly-logo-white.svg' : 'jagaly-logo.svg'}`}
        alt={BRAND.name}
        width={972}
        height={418}
        className={`${className} w-auto`}
      />
    </Link>
  );
}
