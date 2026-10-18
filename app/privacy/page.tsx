import Link from 'next/link';
import { asset } from '../../lib/asset';

export const metadata = { title: 'Privacy | Luminox Digital' };

export default function Privacy() {
  return (
    <main className="legal">
      <Link href="/" aria-label="Luminox Digital home"><img className="logo-img" src={asset('/images/luminox-logo-320.webp')} srcSet={`${asset('/images/luminox-logo-640.webp')} 2x`} width={320} height={102} alt="Luminox Digital" /></Link>
      <Link href="/">← Back to Luminox Digital</Link>
      <h1>Privacy information</h1>
      <p><strong>Pre-launch draft — not a final legal policy.</strong> Luminox Digital is a proposed brand. The company controller identity and contact details must be verified and added before public launch.</p>
      <h2>AI assistant</h2>
      <p>By default the assistant is an offline guide that runs entirely in your browser; your messages are not sent anywhere. If a live AI service is connected, messages are sent to that service to generate a response. Do not share passwords, wallet recovery phrases or sensitive personal information. Chat transcripts are not intentionally saved.</p>
      <h2>Donations</h2>
      <p>Donations are processed by Stripe on Stripe&apos;s own secure checkout page. We never see or store your card details. Stripe shares the information needed to record your contribution (such as name, email and amount) with us. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe&apos;s privacy policy</a>.</p>
      <h2>Contact form</h2>
      <p>When enabled, enquiries are delivered through a third-party form service and used only to reply to you. Until a secure delivery service is configured, the form is disabled and no enquiry is accepted.</p>
      <h2>Cookies</h2>
      <p>This website does not intentionally set analytics or advertising cookies. It is hosted on GitHub Pages, which may keep operational logs. Stripe may set cookies on its own checkout page.</p>
      <h2>Your rights</h2>
      <p>Before public launch, publish verified controller contact details, lawful bases, retention periods, recipients and rights information, and a process for privacy requests.</p>
    </main>
  );
}
