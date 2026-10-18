import Link from 'next/link';
import { asset } from '../lib/asset';

export const metadata = { title: 'Page not found | Luminox Digital' };

export default function NotFound() {
  return (
    <main className="legal">
      <Link href="/" aria-label="Luminox Digital home"><img className="logo-img" src={asset('/images/luminox-logo-320.webp')} srcSet={`${asset('/images/luminox-logo-640.webp')} 2x`} width={320} height={102} alt="Luminox Digital" /></Link>
      <h1>Page not found</h1>
      <p>Sorry, we couldn&apos;t find that page. It may have moved, or the link may be mistyped.</p>
      <Link href="/">← Back to Luminox Digital</Link>
    </main>
  );
}
