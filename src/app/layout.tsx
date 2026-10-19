import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Noto_Sans_Kannada, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { BRAND } from '@/config/brand';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const kannada = Noto_Sans_Kannada({ subsets: ['kannada'], variable: '--font-kn', display: 'swap', weight: ['400', '600'], preload: false });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-dev', display: 'swap', weight: ['400', '600'], preload: false });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600', '700', '800'] });

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const SITE_ORIGIN = 'https://2100preet.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: `${BRAND.name}: verified, broker-free homes and commercial spaces to rent, lease and buy in ${BRAND.city}. Jagaly Proof listings, Zero-Spam Promise, True Price Engine, Home Truth Score, optional Deposit Safe and Jagaly NRI. Prototype with sample data.`,
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.ico`, sizes: '16x16 32x32 48x48' },
      { url: `${BASE_PATH}/brand/jagaly-icon.svg`, type: 'image/svg+xml' },
      { url: `${BASE_PATH}/icon-192.png`, sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: `${BASE_PATH}/apple-touch-icon.png`, sizes: '180x180' }],
  },
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.shortTagline}`,
    description: `Verified, broker-free homes and commercial spaces in ${BRAND.city}. Prototype with sample data.`,
    url: `${BASE_PATH}/`,
    images: [{ url: `${BASE_PATH}/og.png`, width: 1200, height: 630, alt: `${BRAND.name}: Every home proven. Every price true. ${BRAND.city}` }],
  },
  twitter: { card: 'summary_large_image', title: `${BRAND.name} — ${BRAND.shortTagline}`, images: [`${BASE_PATH}/og.png`] },
};
export const viewport: Viewport = { themeColor: '#7b2ff7', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable} ${kannada.variable} ${devanagari.variable}`}>
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
