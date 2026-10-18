import Link from 'next/link';

export const metadata = { title: 'Page not found | Luminox Digital' };

export default function NotFound() {
  return (
    <main className="legal">
      <h1>Page not found</h1>
      <p>Sorry, we couldn&apos;t find that page. It may have moved, or the link may be mistyped.</p>
      <Link href="/">← Back to Luminox Digital</Link>
    </main>
  );
}
