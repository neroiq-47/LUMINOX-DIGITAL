// Luminox AI: prepared answers about Luminox, plus live facts from free, keyless public APIs
// that browsers can call directly (so it works on GitHub Pages with no server or secrets).
//   - Wikipedia (definitions)          https://www.mediawiki.org/wiki/API:Main_page
//   - CoinGecko (crypto prices)        https://docs.coingecko.com/
//   - Frankfurter (ECB exchange rates) https://frankfurter.dev/
// Only the search term (e.g. "smart contract", "bitcoin", "GBP→USD") is sent, never the conversation.
import { FALLBACK, matchTopic, normalise, type Context } from './guide';
import { DONATION_MAX, DONATION_MIN } from './config';

export type Source = { label: string; url: string };
export type Reply = { text: string; source?: Source };

// Topics about Luminox itself always use the prepared answer, never a lookup.
const SITE_TOPICS = new Set(['safety', 'invest', 'human', 'tax', 'limits', 'refund', 'donate', 'pricing', 'timeline', 'services', 'about', 'location', 'privacy', 'contact']);

const TIMEOUT_MS = 7000;
const cache = new Map<string, { at: number; data: unknown }>();

async function getJson<T>(url: string, maxAgeMs: number): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < maxAgeMs) return hit.data as T;
  // AbortSignal.timeout is missing on older Safari; without it the request simply has no time limit.
  const signal = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(TIMEOUT_MS) : undefined;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as T;
  cache.set(url, { at: Date.now(), data });
  return data;
}

const fmt = (n: number, currency: string, digits?: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: digits ?? (n >= 1000 ? 0 : n >= 1 ? 2 : 6),
  }).format(n);

const ukTime = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });

/* ---------------- Crypto prices (CoinGecko) ---------------- */

const COINS: { id: string; name: string; symbol: string; re: RegExp }[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', re: /\bbitcoins?\b|\bbtc\b/ },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', re: /\bethereum\b|\beth\b|\bether\b/ },
  { id: 'solana', name: 'Solana', symbol: 'SOL', re: /\bsolana\b|\bsol\b/ },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', re: /\bxrp\b|\bripple\b/ },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', re: /\bcardano\b|\bada\b/ },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', re: /\bdogecoin\b|\bdoge\b/ },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', re: /\blitecoin\b|\bltc\b/ },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', re: /\bbnb\b|\bbinance coin\b/ },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', re: /\bpolkadot\b/ },
  { id: 'tether', name: 'Tether', symbol: 'USDT', re: /\btether\b|\busdt\b/ },
  { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC', re: /\busdc\b|\busd coin\b/ },
];
const PRICE_WORDS = /\bprices?\b|\bworth\b|\bvalue\b|\bhow much is\b|\bhow much are\b|\btrading at\b|\bgoing for\b|\brate\b/;

export function cryptoPriceIntent(text: string) {
  if (!PRICE_WORDS.test(text)) return null;
  const coins = COINS.filter(c => c.re.test(text));
  if (coins.length) return coins.slice(0, 4);
  return /\bcrypto(currency|currencies)?\b|\bcoins?\b/.test(text) ? COINS.slice(0, 3) : null;
}

type CoinGecko = Record<string, { gbp: number; gbp_24h_change?: number; last_updated_at?: number }>;

async function cryptoPrices(coins: typeof COINS): Promise<Reply> {
  const ids = coins.map(c => c.id).join(',');
  const data = await getJson<CoinGecko>(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=gbp&include_24hr_change=true&include_last_updated_at=true`,
    60_000,
  );
  const lines = coins.flatMap(c => {
    const d = data[c.id];
    if (!d || typeof d.gbp !== 'number') return [];
    const ch = d.gbp_24h_change;
    const move = typeof ch === 'number' ? `, ${ch >= 0 ? 'up' : 'down'} ${Math.abs(ch).toFixed(1)}% in 24 hours` : '';
    return [`${c.name} (${c.symbol}): ${fmt(d.gbp, 'GBP')}${move}`];
  });
  if (!lines.length) throw new Error('no prices');
  const updated = Math.max(...coins.map(c => data[c.id]?.last_updated_at ?? 0));
  return {
    text:
      `Live prices${updated ? ` (as of ${ukTime(updated)} UK time)` : ''}:\n` +
      lines.join('\n') +
      '\n\nPrices change constantly and can fall sharply. This is information, not investment advice.',
    source: { label: 'CoinGecko', url: 'https://www.coingecko.com/' },
  };
}

/* ---------------- Currency conversion (Frankfurter / ECB) ---------------- */

const CURRENCIES: { code: string; re: RegExp }[] = [
  { code: 'CAD', re: /\bcad\b|\bcanadian dollars?\b/ },
  { code: 'AUD', re: /\baud\b|\baustralian dollars?\b/ },
  { code: 'NZD', re: /\bnzd\b|\bnew zealand dollars?\b/ },
  { code: 'SGD', re: /\bsgd\b|\bsingapore dollars?\b/ },
  { code: 'HKD', re: /\bhkd\b|\bhong kong dollars?\b/ },
  { code: 'USD', re: /\$|\busd\b|(?<!canadian |australian |new zealand |singapore |hong kong )\b(us )?dollars?\b|\bbucks\b/ },
  { code: 'GBP', re: /£|\bgbp\b|\bpounds?\b|\bsterling\b|\bquid\b/ },
  { code: 'EUR', re: /€|\beur\b|\beuros?\b/ },
  { code: 'JPY', re: /¥|\bjpy\b|\byen\b/ },
  { code: 'INR', re: /₹|\binr\b|\brupees?\b/ },
  { code: 'CHF', re: /\bchf\b|\bswiss francs?\b/ },
  { code: 'CNY', re: /\bcny\b|\byuan\b|\brmb\b/ },
  { code: 'ZAR', re: /\bzar\b|\brand\b/ },
  { code: 'PLN', re: /\bpln\b|\bzloty\b/ },
  { code: 'SEK', re: /\bsek\b|\bswedish kron(a|or)\b/ },
  { code: 'NOK', re: /\bnok\b|\bnorwegian kron(e|er)\b/ },
  { code: 'DKK', re: /\bdkk\b|\bdanish kron(e|er)\b/ },
  { code: 'MXN', re: /\bmxn\b|\bmexican pesos?\b/ },
  { code: 'BRL', re: /\bbrl\b|\breais\b|\breal\b(?= brazil)/ },
  { code: 'TRY', re: /\btry\b(?= lira)|\blira\b/ },
];

function currenciesIn(text: string) {
  const found: { code: string; at: number }[] = [];
  for (const c of CURRENCIES) {
    const m = c.re.exec(text);
    if (m && !found.some(f => f.code === c.code)) found.push({ code: c.code, at: m.index });
  }
  return found.sort((a, b) => a.at - b.at).map(f => f.code);
}

function amountIn(text: string) {
  const m = /(\d[\d,]*(?:\.\d+)?)\s*(k|m)?\b/.exec(text);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, '')) * (m[2] === 'k' ? 1e3 : m[2] === 'm' ? 1e6 : 1);
  return Number.isFinite(n) && n > 0 && n < 1e12 ? n : null;
}

export function conversionIntent(text: string) {
  const codes = currenciesIn(text);
  if (!codes.length) return null;
  const asks = /\bconvert\b|\binto\b|\bin\b|\bto\b|\bworth\b|\bequals?\b|\bexchange rate\b|\brate\b|=/.test(text);
  if (codes.length >= 2 && asks) return { amount: amountIn(text) ?? 1, from: codes[0], to: [codes[1]] };
  // With one currency, only an explicit question counts ("I want to spend $5000 on a site" is not a conversion).
  const explicit = /\bconvert\b|\bhow much is\b|\bwhat is\b|\bwhat's\b|\bworth\b|\bexchange\b/.test(text);
  const amount = amountIn(text);
  if (codes.length === 1 && amount !== null && explicit) {
    return codes[0] === 'GBP' ? { amount, from: 'GBP', to: ['USD', 'EUR'] } : { amount, from: codes[0], to: ['GBP'] };
  }
  return null;
}

type Frankfurter = { base: string; date: string; rates: Record<string, number> };

async function rates(from: string, to: string[]) {
  return getJson<Frankfurter>(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to.join(',')}`, 3_600_000);
}

const ECB: Source = { label: 'European Central Bank rates via Frankfurter', url: 'https://frankfurter.dev/' };
const dateGB = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

async function convert({ amount, from, to }: { amount: number; from: string; to: string[] }): Promise<Reply> {
  const targets = to.filter(c => c !== from);
  if (!targets.length) return { text: `That's the same currency, so ${fmt(amount, from)} is ${fmt(amount, from)}.` };
  const r = await rates(from, targets);
  const parts = targets.filter(c => typeof r.rates[c] === 'number').map(c => fmt(amount * r.rates[c], c, 2));
  if (!parts.length) throw new Error('no rates');
  return {
    text: `${fmt(amount, from, 2)} is about ${parts.join(' or ')} at the latest reference rate (${dateGB(r.date)}). Your bank's rate may differ slightly and it may add a fee.`,
    source: ECB,
  };
}

async function donationInCurrency(text: string, prepared: string): Promise<Reply> {
  const wanted = currenciesIn(text).filter(c => c !== 'GBP');
  const to = wanted.length ? wanted.slice(0, 2) : ['USD', 'EUR'];
  const r = await rates('GBP', to);
  const say = (gbp: number) => to.filter(c => r.rates[c]).map(c => fmt(gbp * r.rates[c], c, 0)).join(' / ');
  return {
    text: `${prepared}\n\nAt today's reference rate (${dateGB(r.date)}), £${DONATION_MIN} is about ${say(DONATION_MIN)} and £${DONATION_MAX.toLocaleString('en-GB')} is about ${say(DONATION_MAX)}.`,
    source: ECB,
  };
}

/* ---------------- Definitions (Wikipedia) ---------------- */

const DEFINITION = [
  /^(?:what|who)\s*(?:is|are|was|were|'s|’s)\s+(?:an?\s+|the\s+)?(.+)$/,
  /^what does\s+(.+?)\s+(?:mean|stand for)$/,
  /^(?:define|definition of|meaning of|tell me about|explain what)\s+(?:an?\s+|the\s+)?(.+?)(?:\s+(?:is|are|means))?$/,
];
const NOT_A_SUBJECT = /^(you|your|yours|it|this|that|these|those|my|me|i|we|us|luminox|luminox digital|luminox ai|up|going on|happening|new|the best|better|best)\b/;

export function definitionSubject(text: string) {
  const t = text.trim().replace(/[?!.]+$/, '').replace(/\s+(please|exactly|simply|in simple terms|in plain english)$/, '');
  for (const re of DEFINITION) {
    const m = re.exec(t);
    if (m) {
      const subject = m[1].trim();
      if (subject.length >= 2 && subject.length <= 60 && !NOT_A_SUBJECT.test(subject)) return subject;
    }
  }
  return null;
}

type Wiki = {
  query?: { pages?: { title: string; extract?: string; canonicalurl?: string; pageprops?: { disambiguation?: string } }[] };
};

function trimExtract(extract: string) {
  const clean = extract.replace(/\s*\([^()]*\)/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 480) return clean;
  const cut = clean.slice(0, 480);
  const end = cut.lastIndexOf('. ');
  return end > 150 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

async function define(subject: string): Promise<Reply> {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1' +
    '&generator=search&gsrlimit=1&gsrsearch=' + encodeURIComponent(subject) +
    '&prop=extracts|info|pageprops&ppprop=disambiguation&exintro=1&explaintext=1&exsentences=3&inprop=url';
  const data = await getJson<Wiki>(url, 86_400_000);
  const page = data.query?.pages?.[0];
  if (!page?.extract || page.pageprops?.disambiguation !== undefined) throw new Error('no article');
  const link = page.canonicalurl?.startsWith('https://en.wikipedia.org/') ? page.canonicalurl : 'https://en.wikipedia.org/';
  return { text: trimExtract(page.extract), source: { label: `Wikipedia: ${page.title}`, url: link } };
}

/* ---------------- Putting it together ---------------- */

export async function agentReply(message: string, context: Context): Promise<Reply> {
  const text = normalise(message).trim();
  const topic = matchTopic(message, context);

  // Safety and investment warnings always win.
  if (topic && (topic.id === 'safety' || topic.id === 'invest')) return { text: topic.reply };

  const coins = cryptoPriceIntent(text);
  if (coins) {
    try {
      return await cryptoPrices(coins);
    } catch {
      return { text: "Sorry, I couldn't fetch live crypto prices just now. Please try again in a minute." };
    }
  }

  const conversion = conversionIntent(text);
  if (conversion) {
    try {
      return await convert(conversion);
    } catch {
      return { text: "Sorry, I couldn't fetch live exchange rates just now. Please try again in a minute." };
    }
  }

  if (topic?.id === 'currency') {
    try {
      return await donationInCurrency(text, topic.reply);
    } catch {
      return { text: topic.reply };
    }
  }

  if (topic && SITE_TOPICS.has(topic.id)) return { text: topic.reply };

  const subject = definitionSubject(text);
  if (subject) {
    try {
      return await define(subject);
    } catch {
      // Fall back to the prepared answer below.
    }
  }

  return { text: topic?.reply ?? FALLBACK };
}

/** True when a message will need a network lookup, so the UI can skip its artificial delay. */
export function needsLookup(message: string) {
  const text = normalise(message).trim();
  const topic = matchTopic(message);
  if (topic && (topic.id === 'safety' || topic.id === 'invest')) return false;
  return Boolean(cryptoPriceIntent(text) || conversionIntent(text) || topic?.id === 'currency' || (!(topic && SITE_TOPICS.has(topic.id)) && definitionSubject(text)));
}
