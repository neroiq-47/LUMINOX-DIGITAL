// Offline answers used when no live chat API is configured, so the assistant
// still helps on a static host like GitHub Pages.
const topics: { keys: string[]; reply: string }[] = [
  {
    keys: ['price', 'cost', 'how much', 'quote', 'budget'],
    reply:
      "We're at an early stage and don't publish fixed prices yet. Every project is scoped openly and fairly. Share a few details through the contact form and we'll give you a clear, honest estimate.",
  },
  {
    keys: ['website', 'web app', 'site', 'shop', 'store', 'online'],
    reply:
      "A website is a great first step. To shape it, think about three things: what it's for (show info, take bookings, sell online), who it's for, and the must-have features. Many small businesses start with a simple, fast site and add online sales later. Want to describe your idea in the contact form so we can talk it through?",
  },
  {
    keys: ['blockchain', 'web3', 'crypto', 'nft', 'smart contract', 'token'],
    reply:
      "In plain English: a blockchain is a shared record book that many computers keep copies of, so entries are hard to change quietly. Smart contracts are small programs that run on it and follow fixed rules. It's useful when several parties need to trust the same record. It isn't the right tool for everything, and we'll always say so honestly. (This isn't investment advice.)",
  },
  {
    keys: [' ai', 'ai ', 'artificial', 'automation', 'chatbot', 'gpt'],
    reply:
      'AI can save time on everyday tasks: answering common customer questions, drafting emails or posts, summarising documents and organising information. The best place to start is one repetitive task that eats your time. What task would you most like help with?',
  },
  {
    keys: ['donat', 'support', 'fund', 'contribut'],
    reply:
      'Thank you for thinking of us! You can support Luminox Digital from the "Support us" section. Contributions from $25 to $100,000 are processed securely by Stripe.',
  },
  {
    keys: ['privacy', 'data', 'gdpr', 'cookie'],
    reply:
      "This site doesn't set analytics or advertising cookies, and this offline assistant runs entirely in your browser. You can read more on our privacy page.",
  },
  {
    keys: ['contact', 'email', 'talk', 'call', 'hire'],
    reply: "The easiest way to reach us is the contact form near the bottom of the page. You don't need a finished plan, a few sentences is perfect.",
  },
  {
    keys: ['hello', ' hi ', ' hi!', ' hey'],
    reply: 'Hello! I can explain websites, blockchain or AI in plain English, or help you think through a project idea. What would you like to explore?',
  },
];

export function offlineReply(message: string): string {
  const text = ` ${message.toLowerCase()} `;
  const match = topics.find(t => t.keys.some(k => text.includes(k)));
  return (
    match?.reply ??
    "Good question! I'm a simple offline guide, so I can cover websites, blockchain, AI, pricing, donations and privacy. Could you tell me a little more about what you're trying to do?"
  );
}
