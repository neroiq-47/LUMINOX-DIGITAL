import type { Metadata, Viewport } from 'next';
import './globals.css';

// Next adds the base path to opengraph-image.jpg itself, so metadataBase is just the origin.
const origin = 'https://neroiq-47.github.io';
const siteUrl = origin + (process.env.PAGES_BASE_PATH || '') + '/';

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: 'Luminox Digital | Technology for everyday people',
  description: 'Friendly web development, blockchain and AI guidance, built around fairness and transparency.',
  openGraph: {
    title: 'Luminox Digital',
    description: 'Technology made simple. For everyone.',
    type: 'website',
    url: siteUrl,
    siteName: 'Luminox Digital',
    locale: 'en_GB',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#0b5bd3' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
