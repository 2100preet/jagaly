import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <div className="font-display text-6xl font-extrabold text-brand-600">404</div>
      <p className="mt-2 text-ink-600">This page is as real as a ₹15K 3BHK in Koramangala.</p>
      <Link href="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
