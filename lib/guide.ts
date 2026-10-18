// Offline answers used when no live chat API is configured, so the assistant
// still helps on a static host like GitHub Pages.
// Each key matches at the start of a word ("donat" matches "donate", "donation"),
// and keys ending in "$" must match the whole word ("ai$" won't match "air").
const topics: { keys: string[]; reply: string }[] = [
  {
    keys: ['price', 'pricing', 'cost', 'how much', 'quote$', 'budget', 'afford', 'cheap'],
    reply:
      "We're at an early stage and don't publish fixed prices yet. Every project is scoped openly and fairly. Share a few details through the contact form and we'll give you a clear, honest estimate.",
  },
  {
    keys: ['donat', 'contribut', 'support us$', 'support luminox', 'sponsor', 'give money'],
    reply:
      'Thank you for thinking of us! You can support Luminox Digital from the "Support us" section. Contributions from $25 to $100,000 are processed securely by Stripe.',
  },
  {
    keys: ['website', 'web app', 'webapp', 'web page', 'webpage', 'site$', 'sites$', 'shop', 'store$', 'ecommerce', 'e-commerce', 'online shop', 'landing page'],
    reply:
      "A website is a great first step. To shape it, think about three things: what it's for (show info, take bookings, sell online), who it's for, and the must-have features. Many small businesses start with a simple, fast site and add online sales later. Want to describe your idea in the contact form so we can talk it through?",
  },
  {
    keys: ['blockchain', 'web3', 'crypto', 'nft', 'smart contract', 'token', 'bitcoin', 'ethereum', 'wallet'],
    reply:
      "In plain English: a blockchain is a shared record book that many computers keep copies of, so entries are hard to change quietly. Smart contracts are small programs that run on it and follow fixed rules. It's useful when several parties need to trust the same record. It isn't the right tool for everything, and we'll always say so honestly. (This isn't investment advice, and never share a wallet's recovery phrase with anyone.)",
  },
  {
    keys: ['ai$', 'a.i', 'artificial intelligence', 'automat', 'chatbot', 'gpt', 'machine learning'],
    reply:
      'AI can save time on everyday tasks: answering common customer questions, drafting emails or posts, summarising documents and organising information. The best place to start is one repetitive task that eats your time. What task would you most like help with?',
  },
  {
    keys: ['privacy', 'privat', 'personal data', 'my data', 'gdpr', 'cookie'],
    reply:
      "This site doesn't set analytics or advertising cookies, and this offline assistant runs entirely in your browser, so your messages aren't sent anywhere. You can read more on our privacy page.",
  },
  {
    keys: ['contact', 'email', 'get in touch', 'talk to', 'speak to', 'call me', 'phone', 'hire'],
    reply: "The easiest way to reach us is the contact form near the bottom of the page. You don't need a finished plan, a few sentences is perfect.",
  },
  {
    keys: ['who are you', 'what is luminox', 'about luminox', 'about you'],
    reply:
      "Luminox Digital is an early-stage UK technology venture. We want to make web development, blockchain and AI easier to understand and fairer to access, with honesty and transparency at the heart of it. I'm Luminox AI, a simple guide to help you find a starting point.",
  },
  {
    keys: ['thank', 'cheers'],
    reply: "You're very welcome! Is there anything else you'd like to explore?",
  },
  {
    keys: ['hello$', 'hi$', 'hey$', 'hiya$', 'good morning', 'good afternoon', 'good evening'],
    reply: 'Hello! I can explain websites, blockchain or AI in plain English, or help you think through a project idea. What would you like to explore?',
  },
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchers = topics.map(t => ({
  reply: t.reply,
  patterns: t.keys.map(k => (k.endsWith('$') ? new RegExp(`\\b${escape(k.slice(0, -1))}\\b`) : new RegExp(`\\b${escape(k)}`))),
}));

export function offlineReply(message: string): string {
  const text = message.toLowerCase();
  const match = matchers.find(m => m.patterns.some(p => p.test(text)));
  return (
    match?.reply ??
    "Good question! I'm a simple offline guide, so I can cover websites, blockchain, AI, pricing, donations and privacy. Could you tell me a little more about what you're trying to do?"
  );
}
