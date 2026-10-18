'use client';
import { useState, useRef, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Bot, Blocks, BrainCircuit, CheckCircle2, ChevronDown, Code2, Gift, HeartHandshake,
  Lock, Mail, Menu, MessageCircle, Send, ShieldCheck, Sparkles, X,
} from 'lucide-react';
import { CHAT_API_URL, DONATION_MAX, DONATION_MIN, DONATION_URL, FORM_ENDPOINT } from '../lib/config';
import { offlineReply } from '../lib/guide';

type Msg = { role: 'user' | 'assistant'; content: string };
type FormState = 'idle' | 'sending' | 'sent' | 'error';

const starter = ['I need a website', 'Explain blockchain simply', 'How could AI help me?'];
const services = [
  { icon: Code2, title: 'Web development', desc: 'Clear, modern websites and useful digital tools built around your goals.', tag: 'Websites & applications' },
  { icon: Blocks, title: 'Blockchain & Web3', desc: 'Explore transparent digital records, smart contracts and practical Web3 ideas.', tag: 'Clarity over complexity' },
  { icon: BrainCircuit, title: 'Practical AI', desc: 'Friendly AI tools that help save time and make everyday tasks easier.', tag: 'Useful automation' },
  { icon: HeartHandshake, title: 'Guidance & support', desc: 'A human-first approach, with simple explanations and honest advice.', tag: 'No confusing jargon' },
];
const usd = (n: number) => '$' + n.toLocaleString('en-US');
const navItems = [['#about', 'Our story'], ['#services', 'Services'], ['#projects', 'Projects'], ['#support', 'Support us'], ['#contact', 'Contact']];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hi! I'm Luminox AI, your friendly technology guide. What would you like to explore today?" },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), [messages, chat]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setChat(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function send(value: string) {
    const v = value.trim();
    if (!v || busy) return;
    const next = [...messages, { role: 'user' as const, content: v }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setError('');
    try {
      let reply: string;
      if (CHAT_API_URL) {
        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next.slice(-12) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to respond right now');
        reply = data.reply;
      } else {
        await new Promise(r => setTimeout(r, 450));
        reply = offlineReply(v);
      }
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  async function submitEnquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORM_ENDPOINT) return;
    const form = e.currentTarget;
    setFormState('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setFormState('sent');
    } catch {
      setFormState('error');
    }
  }

  const logo = (size: number) => (
    <>
      <span className="mark"><Sparkles size={size} /></span>
      <span>luminox<span className="dot">.</span><small>DIGITAL</small></span>
    </>
  );

  return (
    <>
      <a href="#home" className="skip-link">Skip to content</a>
      <header className="header">
        <div className="shell nav">
          <a href="#home" className="logo" aria-label="Luminox Digital home">{logo(21)}</a>
          <nav className={menu ? 'links open' : 'links'} aria-label="Main navigation">
            {navItems.map(([href, label]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
          </nav>
          <div className="nav-actions">
            <a className="nav-donate" href="#support"><Gift size={16} /> Donate</a>
            <button className="nav-chat" onClick={() => setChat(true)}><MessageCircle size={17} /> Ask Luminox AI</button>
          </div>
          <button className="mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="pulse" /> A FRIENDLIER WAY INTO TECHNOLOGY</div>
              <h1>Technology made <em>simple.</em><br />For everyone.</h1>
              <p className="lead">Web development, blockchain and AI — made easier to understand, fairer to access and more useful in everyday life.</p>
              <div className="actions">
                <a href="#services" className="btn primary">Explore our services <ArrowRight size={18} /></a>
                <button className="btn light" onClick={() => setChat(true)}><MessageCircle size={18} /> Meet Luminox AI</button>
              </div>
              <div className="hero-note"><ShieldCheck size={19} /> Built on fairness, clarity and transparency</div>
            </div>
            <div className="hero-visual">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="float-icon float-one"><Blocks /></div>
              <div className="float-icon float-two"><BrainCircuit /></div>
              <div className="assistant-card">
                <div className="assistant-top">
                  <div className="bot-avatar"><Bot size={25} /></div>
                  <div><strong>Hi, I'm Luminox AI!</strong><span>Your friendly digital guide</span></div>
                  <span className="online" />
                </div>
                <p>Not sure where to start? That's okay. I'm here to help you explore technology in plain English.</p>
                <div className="suggestions">
                  {starter.map(s => (
                    <button key={s} onClick={() => { setChat(true); send(s); }}>{s} <ArrowUpRight size={14} /></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="shell">
            <div className="section-head">
              <span className="kicker">WHAT WE DO</span>
              <h2>Good technology should<br /><em>work for you.</em></h2>
              <p>Whether you're starting a small business or exploring a new idea, we'll help you find a practical place to begin.</p>
            </div>
            <div className="service-grid">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <article className="service" key={s.title}>
                    <div className={'service-icon tone-' + i}><Icon size={27} /></div>
                    <span className="tag">{s.tag}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <a href="#contact">Let's talk <ArrowRight size={16} /></a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section story" id="about">
          <div className="shell story-grid">
            <div className="story-art">
              <div className="story-art-inner">
                <div className="heart-circle"><HeartHandshake size={55} /></div>
                <p>People first.<br />Technology second.</p>
                <div className="small-stars" aria-hidden="true">✦ &nbsp; ✧ &nbsp; ✦</div>
              </div>
            </div>
            <div className="story-copy">
              <span className="kicker">WHY I'M BUILDING LUMINOX</span>
              <h2>Because technology should <em>include everyone.</em></h2>
              <p>I believe technology should create opportunities for everyone — not just big companies or people who understand complicated systems.</p>
              <p>I'm building Luminox to bring web development and blockchain technology to everyday people, with <strong>fairness, honesty and transparency</strong> at the heart of everything we do.</p>
              <p>Our aim isn't to make technology more complicated. It's to make it useful, affordable and easier to understand.</p>
              <a href="#contact" className="text-link">Get in touch <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>

        <section className="section projects" id="projects">
          <div className="shell">
            <div className="section-head">
              <span className="kicker">WHAT WE'RE WORKING TOWARDS</span>
              <h2>Small steps. <em>Big possibilities.</em></h2>
              <p>We're at an early stage, exploring useful ideas and learning what people genuinely need.</p>
            </div>
            <div className="project-card">
              <div className="project-icon"><Sparkles size={36} /></div>
              <div>
                <span className="stage">CONCEPT STAGE</span>
                <h3>Luminox Digital Platform</h3>
                <p>A friendly place to explore website services, practical blockchain features and AI-powered guidance — designed for real people, not just technology experts.</p>
                <div className="project-pills"><span>Web tools</span><span>Blockchain education</span><span>AI guidance</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section support" id="support">
          <div className="shell support-grid">
            <div>
              <span className="kicker">SUPPORT LUMINOX</span>
              <h2>Help us make technology<br /><em>fairer for everyone.</em></h2>
              <p>Luminox Digital is independent and early-stage. Your contribution helps us build free learning resources, accessible tools and the Luminox Digital Platform.</p>
              <ul className="checks">
                <li><CheckCircle2 /> Free plain-English guides to web, blockchain and AI</li>
                <li><CheckCircle2 /> Accessible tools for small businesses and individuals</li>
                <li><CheckCircle2 /> Honest, transparent use of every contribution</li>
              </ul>
            </div>
            <div className="donate-card">
              <div className="donate-icon"><Gift size={30} /></div>
              <h3>Make a contribution</h3>
              <p className="donate-range">
                Give any amount from <strong>{usd(DONATION_MIN)}</strong> up to <strong>{usd(DONATION_MAX)}</strong>.
              </p>
              <div className="donate-scale" aria-hidden="true">
                <span>{usd(DONATION_MIN)}</span><span className="bar" /><span>{usd(DONATION_MAX)}</span>
              </div>
              {DONATION_URL ? (
                <a className="btn primary donate-btn" href={DONATION_URL} target="_blank" rel="noopener noreferrer">
                  <HeartHandshake size={19} /> Donate now <ArrowUpRight size={17} />
                </a>
              ) : (
                <button className="btn primary donate-btn" disabled>Donations opening soon</button>
              )}
              <p className="donate-note"><Lock size={14} /> Secure checkout by Stripe. You choose the amount on the next page. Contributions are not tax-deductible.</p>
            </div>
          </div>
        </section>

        <section className="section ai-section" id="ai">
          <div className="shell ai-grid">
            <div>
              <span className="kicker">MEET YOUR DIGITAL GUIDE</span>
              <h2>Questions welcome.<br /><em>Jargon optional.</em></h2>
              <p>Curious about websites, blockchain or AI? Luminox AI is here to help you understand your options and take the first step.</p>
              <ul className="checks">
                <li><CheckCircle2 /> Plain-English explanations</li>
                <li><CheckCircle2 /> Help planning a project</li>
                <li><CheckCircle2 /> No pressure, no confusing jargon</li>
              </ul>
              <button className="btn primary" onClick={() => setChat(true)}>Chat with Luminox AI <ArrowRight size={18} /></button>
            </div>
            <div className="ai-preview">
              <div className="preview-top">
                <div className="bot-avatar"><Bot /></div>
                <div><strong>Luminox AI</strong><span>Friendly technology guide</span></div>
              </div>
              <div className="bubble">Hello there! 👋 What would you like to learn or build today?</div>
              <div className="bubble visitor">I have a small shop. Could I get a website?</div>
              <div className="bubble">Absolutely! We can start simple. Would you like to show your products, sell online, or both?</div>
              <button onClick={() => setChat(true)} className="preview-input">Ask your own question... <Send size={17} /></button>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="shell contact-grid">
            <div>
              <span className="kicker">LET'S CONNECT</span>
              <h2>Have an idea?<br /><em>Let's hear it.</em></h2>
              <p>You don't need a finished plan. Tell us a little about what you'd like to do and we'll take it from there.</p>
              <p className="contact-foot"><Mail size={18} /> Business contact email coming soon</p>
            </div>
            <form className="contact-form" onSubmit={submitEnquiry}>
              <fieldset disabled={!FORM_ENDPOINT || formState === 'sending'}>
                <label>Your name<input name="name" required maxLength={100} placeholder="What should we call you?" /></label>
                <label>Email address<input name="email" type="email" required maxLength={254} placeholder="you@example.com" /></label>
                <label>What are you interested in?
                  <span className="select-wrap">
                    <select name="interest" defaultValue="website">
                      <option value="website">A website or web app</option>
                      <option value="blockchain">Blockchain / Web3</option>
                      <option value="ai">AI tools</option>
                      <option value="other">Something else</option>
                    </select>
                    <ChevronDown size={17} />
                  </span>
                </label>
                <label>Tell us about your idea<textarea name="message" required maxLength={3000} rows={4} placeholder="A few sentences is perfect..." /></label>
                <label className="consent">
                  <input type="checkbox" required name="consent" value="yes" /> I agree to be contacted about my enquiry and have read the <Link href="/privacy/">privacy notice</Link>.
                </label>
                <button className="btn primary" type="submit">
                  {formState === 'sending' ? 'Sending…' : 'Send enquiry'} <ArrowRight size={18} />
                </button>
              </fieldset>
              {!FORM_ENDPOINT && <p className="form-status" role="status">Online enquiries open soon. In the meantime, Luminox AI is happy to help.</p>}
              {formState === 'sent' && <p className="form-status ok" role="status">Thank you! Your enquiry has been received.</p>}
              {formState === 'error' && <p className="form-status err" role="alert">Sorry, your enquiry couldn't be sent. Please try again later.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-main">
          <div>
            <a className="logo" href="#home">{logo(19)}</a>
            <p>Technology for everyday people.<br />Built on fairness. Driven by transparency.</p>
          </div>
          <div className="footer-links">
            {navItems.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            <Link href="/privacy/">Privacy</Link>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} Luminox Digital. Concept-stage website.</span>
          <span>Made with people in mind ♡</span>
        </div>
      </footer>

      {!chat && (
        <button className="chat-fab" onClick={() => setChat(true)} aria-label="Open Luminox AI chat">
          <MessageCircle size={25} /><span>Ask Luminox AI</span>
        </button>
      )}
      {chat && (
        <div className="chat-window" role="dialog" aria-label="Luminox AI assistant">
          <div className="chat-head">
            <div className="bot-avatar"><Bot /></div>
            <div>
              <strong>Luminox AI</strong>
              <span>Your friendly technology guide · {CHAT_API_URL ? 'AI assistant' : 'offline guide'}</span>
            </div>
            <button onClick={() => setChat(false)} aria-label="Close chat"><X size={21} /></button>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((m, i) => <div key={i} className={'chat-msg ' + m.role}>{m.content}</div>)}
            {busy && <div className="chat-msg assistant">Thinking...</div>}
            {error && <p className="chat-error" role="alert">{error}</p>}
            <div ref={bottom} />
          </div>
          <div className="chat-starters">
            {starter.map(s => <button key={s} onClick={() => send(s)} disabled={busy}>{s}</button>)}
          </div>
          <form className="chat-input" onSubmit={e => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." aria-label="Your message" maxLength={1000} autoFocus />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={18} /></button>
          </form>
          <div className="chat-disclaimer">
            {CHAT_API_URL ? 'AI can make mistakes. ' : ''}Please don't share sensitive information. <Link href="/privacy/">Privacy</Link>
          </div>
        </div>
      )}
    </>
  );
}
