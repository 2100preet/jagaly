import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BRAND } from '@/config/brand';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: `${BRAND.name}: verified, broker-free homes and commercial spaces to rent, lease and buy in ${BRAND.city}. Jagaly Proof listings, Zero-Spam Promise, True Price Engine, Home Truth Score, optional Deposit Safe and Jagaly NRI. Prototype with sample data.`,
};
export const viewport: Viewport = { themeColor: '#185944', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="bg-ink-900 px-4 py-1.5 text-center text-[11px] font-medium text-ink-200 sm:text-xs">Prototype · <strong className="text-white">sample data</strong>: listings, prices, scores and reviews are fictional. The RERA tracker uses real public records.</div>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
