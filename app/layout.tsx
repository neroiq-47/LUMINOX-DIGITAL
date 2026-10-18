import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luminox Digital | Technology for everyday people',
  description: 'Friendly web development, blockchain and AI guidance, built around fairness and transparency.',
  openGraph: {
    title: 'Luminox Digital',
    description: 'Technology made simple. For everyone.',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#147d79' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
