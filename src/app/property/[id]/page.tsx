import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LISTINGS, getListing } from '@/data/listings';
import PropertyDetail from './PropertyDetail';
import CommercialDetail from './CommercialDetail';

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getListing(id);
  return { title: l ? `${l.title}, ${l.locality}` : 'Property' };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = getListing(id);
  if (!l) notFound();
  return l.space ? <CommercialDetail id={l.id} /> : <PropertyDetail id={l.id} />;
}
