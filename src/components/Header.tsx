'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/format';

const NAV = [
  { href: '/search/?deal=buy', label: 'Buy', match: '/search' },
  { href: '/search/?deal=rent', label: 'Rent', match: '/search' },
  { href: '/search/?deal=buy&kind=builder', label: 'New projects', match: '/search' },
  { href: '/deposit-safe/', label: 'Deposit Safe', match: '/deposit-safe' },
  { href: '/project-tracker/', label: 'Delay Tracker', match: '/project-tracker' },
  { href: '/pricing/', label: 'Pricing', match: '/pricing' },
  { href: '/about/', label: 'How it works', match: '/about' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-white/85 backdrop-blur-lg">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}
              className={cn('rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900',
                n.match !== '/search' && path?.startsWith(n.match) && 'bg-brand-50 text-brand-700')}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/post/" className="btn-accent hidden sm:inline-flex"><Plus className="h-4 w-4" />Post property <span className="rounded bg-white/25 px-1.5 text-[10px] font-bold">FREE</span></Link>
          <button className="btn-ghost px-3 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <nav className="container-x grid gap-1 py-3">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium text-ink-700 hover:bg-ink-100">{n.label}</Link>
            ))}
            <Link href="/post/" onClick={() => setOpen(false)} className="btn-accent mt-2">Post property — free</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
