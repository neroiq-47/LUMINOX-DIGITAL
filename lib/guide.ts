// Offline answers used when no live chat API is configured, so the assistant
// still helps on a static host like GitHub Pages.
// Each key matches at the start of a word ("donat" matches "donate", "donation"),
// and keys ending in "$" must match the whole word ("ai$" won't match "air").
// Topics are checked in order, so safety and specific questions come before broad ones.

type Context = { formEnabled: boolean };

const contactLine = ({ formEnabled }: Context) =>
  formEnabled
    ? "You can reach us through the contact form near the bottom of the page. You don't need a finished plan, a few sentences is perfect."
    : "Online enquiries open soon via the contact form at the bottom of the page. Until then, I'm happy to help you think your idea through here.";

const topics: { keys: string[]; reply: string | ((c: Context) => string) }[] = [
  {
    keys: ['password', 'passcode', 'seed phrase', 'recovery phrase', 'secret phrase', 'private key', 'mnemonic', 'pin$', 'card number', 'credit card', 'debit card', 'cvv', 'cvc', 'bank details', 'sort code', 'account number'],
    reply:
      "Please don't share passwords, wallet recovery (seed) phrases, private keys or card details here, or with anyone who asks for them. Luminox will never ask for them. If you've already shared a seed phrase or password somewhere, move your funds or change that password straight away. Donations are only ever paid on Stripe's secure checkout page.",
  },
  {
    keys: ['invest', 'buy bitcoin', 'buy crypto', 'buy ethereum', 'should i buy', 'price of bitcoin', 'make money from crypto', 'get rich', 'crypto trading', 'day trading', 'trade crypto'],
    reply:
      "I can't give investment or financial advice, and nobody can promise crypto will go up. Prices can fall sharply and you could lose what you put in. If you're considering investing, speak to an FCA-authorised financial adviser. I'm happy to explain how the technology works in plain English, though!",
  },
  {
    keys: ['real person', 'human$', 'a person$', 'a bot$', 'are you ai$', 'are you a robot', 'are you real', 'who am i talking'],
    reply:
      "I'm Luminox AI, an automated assistant, not a person. Right now I'm a simple offline guide with prepared answers that runs entirely in your browser, so I can make mistakes and can't see any personal information.",
  },
  {
    keys: ['tax deductible', 'tax-deductible', 'gift aid', 'charity', 'charitable'],
    reply:
      "Luminox Digital is a company, not a registered charity, so contributions aren't tax-deductible and Gift Aid doesn't apply. Every contribution still goes directly towards building our free resources and tools.",
  },
  {
    keys: ['minimum donation', 'maximum donation', 'minimum contribution', 'maximum contribution', 'minimum amount', 'maximum amount', 'how much can i', 'how much should i', 'smallest donation', 'largest donation', 'donation limit', 'limit$', 'limits$'],
    reply: 'You can contribute any amount from £25 to £10,000. You choose the exact amount on Stripe\'s secure checkout page after pressing "Donate now".',
  },
  {
    keys: ['dollar', 'usd$', 'euro', 'currency', 'currencies', 'pounds', 'gbp$'],
    reply:
      'Contributions are taken in British pounds (GBP), from £25 to £10,000. If your card is in another currency, your bank converts it automatically, though it may add a small fee.',
  },
  {
    keys: ['refund', 'cancel my donation', 'money back', 'charged twice', 'receipt'],
    reply: c =>
      "Sorry if something went wrong with a payment. Stripe processes contributions, so check your email for anything Stripe sent after paying. For refunds or payment problems, please contact Luminox Digital directly. " + contactLine(c),
  },
  {
    keys: ['donat', 'contribut', 'support us$', 'support luminox', 'sponsor', 'give money', 'pay you', 'pay luminox', 'pay by card'],
    reply:
      'Thank you for thinking of us! Press "Donate now" in the "Support us" section to give any amount from £25 to £10,000. Payment is handled securely by Stripe, so we never see your card details.',
  },
  {
    keys: ['price', 'pricing', 'cost', 'how much', 'charge$', 'charges$', 'fee$', 'fees$', 'quote$', 'budget', 'afford', 'cheap', 'expensive'],
    reply: c =>
      "We're at an early stage and don't publish fixed prices yet. Every project is scoped openly and fairly, and we'll explain any costs in plain English before anything starts. " + contactLine(c),
  },
  {
    keys: ['how long', 'timeline', 'timescale', 'turnaround', 'deadline', 'how quickly', 'how fast'],
    reply:
      "It depends on what you need. A simple information website can be quick, while online shops, custom apps or blockchain features take longer. Tell me what you have in mind and I can help you work out what's essential for a first version.",
  },
  {
    keys: ['app$', 'apps$', 'mobile app', 'iphone', 'android', 'ios$', 'application'],
    reply:
      "Apps are a great idea for some projects. Often a mobile-friendly web app is a quicker, cheaper first step that works on every phone, and it can become a full iPhone or Android app later. What would your app help people do?",
  },
  {
    keys: ['seo$', 'search engine', 'google ranking', 'rank on google', 'hosting', 'host my', 'domain', 'redesign', 'existing site', 'existing website', 'update my site', 'maintenance'],
    reply:
      "Yes, these are part of getting a website right: a clear structure that search engines understand, reliable hosting, your own domain name, and keeping things up to date. If you already have a site, tell me what isn't working for you and we can start there.",
  },
  {
    keys: ['ai$', 'a.i', 'artificial intelligence', 'automat', 'chatbot', 'chat bot', 'gpt', 'machine learning', 'llm$', 'chatgpt', 'openai', 'claude$', 'gemini$'],
    reply:
      'AI can save time on everyday tasks: answering common customer questions, drafting emails or posts, summarising documents and organising information. The best place to start is one repetitive task that eats your time. What task would you most like help with?',
  },
  {
    keys: ['website', 'web app', 'webapp', 'web page', 'webpage', 'site$', 'sites$', 'shop', 'store$', 'ecommerce', 'e-commerce', 'online store', 'landing page', 'portfolio'],
    reply:
      "A website is a great first step. To shape it, think about three things: what it's for (show info, take bookings, sell online), who it's for, and the must-have features. Many small businesses start with a simple, fast site and add online sales later. What would you like your website to do?",
  },
  {
    keys: ['blockchain', 'web3', 'crypto', 'nft', 'smart contract', 'token', 'bitcoin', 'ethereum', 'crypto wallet', 'digital wallet', 'metamask', 'defi$', 'dao$'],
    reply:
      "In plain English: a blockchain is a shared record book that many computers keep copies of, so entries are hard to change quietly. Smart contracts are small programs that run on it and follow fixed rules. It's useful when several parties need to trust the same record. It isn't the right tool for everything, and we'll always say so honestly. (This isn't investment advice.)",
  },
  {
    keys: ['services', 'what do you do', 'what do you offer', 'what can you do', 'what can you help', 'help me with'],
    reply:
      "Luminox Digital is exploring four areas: web development (websites and web apps), blockchain & Web3 (explained honestly, without hype), practical AI tools that save time, and friendly guidance for people who find technology confusing. Which of those sounds closest to what you need?",
  },
  {
    keys: ['founder', 'founded', 'who runs', 'who owns', 'who started', 'who are you', 'what is luminox', 'about luminox', 'about you', 'your story', 'team$'],
    reply:
      "Luminox Digital is an early-stage UK technology venture started by a founder who believes technology should create opportunities for everyone, not just big companies. The aim is to make web development, blockchain and AI easier to understand and fairer to access. You can read the founder's story in the \"Our story\" section.",
  },
  {
    keys: ['where are you', 'based$', 'located', 'location', 'london', 'uk$', 'united kingdom', 'england', 'britain', 'british'],
    reply: "Luminox Digital is a UK technology venture, and we're happy to help people wherever they are.",
  },
  {
    keys: ['privacy', 'privat', 'personal data', 'my data', 'data safe', 'gdpr', 'cookie', 'tracking', 'track me'],
    reply:
      "This site doesn't set analytics or advertising cookies, and this offline assistant runs entirely in your browser, so your messages aren't sent anywhere. You can read more on our privacy page (linked below this chat).",
  },
  {
    keys: ['contact', 'email', 'get in touch', 'talk to', 'speak to', 'call me', 'book a call', 'phone', 'hire', 'enquir', 'inquir', 'meeting'],
    reply: contactLine,
  },
  { keys: ['thank', 'cheers', 'ta$'], reply: "You're very welcome! Is there anything else you'd like to explore?" },
  { keys: ['bye', 'goodbye', 'see you', 'that is all', "that's all"], reply: 'Thanks for stopping by! If you think of anything else, just open the chat again. Take care.' },
  {
    keys: ['hello$', 'hi$', 'hey$', 'hiya$', 'good morning', 'good afternoon', 'good evening'],
    reply: 'Hello! I can explain websites, blockchain or AI in plain English, or help you think through a project idea. What would you like to explore?',
  },
  { keys: ['ok$', 'okay$', 'cool$', 'great$', 'nice$', 'yes$', 'no$', 'sure$'], reply: "Great! What would you like to look at next: websites, AI, blockchain, or supporting Luminox?" },
];

const FALLBACK =
  "I'm not sure I understood that. I'm a simple offline guide, so I can help with websites and apps, AI tools, blockchain, pricing, donations, privacy and getting in touch. Could you tell me a little more about what you're trying to do?";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchers = topics.map(t => ({
  reply: t.reply,
  patterns: t.keys.map(k => (k.endsWith('$') ? new RegExp(`\\b${escape(k.slice(0, -1))}\\b`) : new RegExp(`\\b${escape(k)}`))),
}));

// Long digit runs look like a card or account number, so warn rather than answer.
const looksLikeCardNumber = (text: string) => /(?:\d[ -]?){12,19}/.test(text);

export function offlineReply(message: string, context: Context = { formEnabled: false }): string {
  const text = message.toLowerCase().replace(/[’‘]/g, "'");
  if (looksLikeCardNumber(text)) return matchers[0].reply as string;
  const match = matchers.find(m => m.patterns.some(p => p.test(text)));
  if (!match) return FALLBACK;
  return typeof match.reply === 'function' ? match.reply(context) : match.reply;
}
