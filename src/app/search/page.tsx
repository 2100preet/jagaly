import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = { title: 'Search homes in Bangalore' };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-ink-500">Loading listings…</div>}>
      <SearchClient />
    </Suspense>
  );
}
