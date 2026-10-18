# LUMINOX-DIGITAL

Luminox Digital is a UK technology startup making web development, blockchain, Web3 and AI accessible to everyday people. Built on fairness and transparency, our platform offers modern digital solutions, practical AI assistance and user-friendly technology that empowers individuals, startups and businesses.

**Live site:** https://neroiq-47.github.io/LUMINOX-DIGITAL/

## What's in the site

- Responsive Next.js 15 site, statically exported for GitHub Pages
- Services, founder story, concept project and contact sections
- **Support us / Donate** section: contributions from **£25 to £10,000** via Stripe Checkout
- Luminox AI chat: a built-in offline guide that runs in the browser, or a live AI backend if `CHAT_API_URL` is set
- Contact form that posts to a form service (e.g. Formspree) once `FORM_ENDPOINT` is set; disabled otherwise
- Draft privacy page at `/privacy/`

## Run locally

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
npm run build                # static site in ./out
```

## Deployment (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `./out` to the `gh-pages` branch.

One-time setup: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `gh-pages` / `(root)`**.

## Donations

The Donate button opens the live Stripe Payment Link https://buy.stripe.com/14A00bgTEfLSaKBcYZ1gs00 (product **LUMINOX LTD**, `prod_VSlEXtmSC7DCWo`). Donors choose any amount from **£25 to £10,000**, and Stripe enforces those limits at checkout.

To use a different link without editing code: **Settings → Secrets and variables → Actions → Variables**, add `DONATION_URL`, then **Actions → Deploy to GitHub Pages → Run workflow**. If you change the price limits in Stripe, also update `DONATION_MIN` / `DONATION_MAX` in `lib/config.ts`.

Optional variables, same place: `FORM_ENDPOINT` (contact form), `CHAT_API_URL` (live AI chat: `POST {messages}` → `{reply}`; must allow CORS from the Pages domain and keep its API key server-side).

## Before public launch

- Confirm legal use of the Luminox Digital brand and company registration details.
- Check how donations are described and taxed for a UK company (they are not charitable donations) and that Stripe's terms cover this use.
- Replace the draft privacy notice with a verified UK GDPR notice and company identity.
- Configure business email and SPF/DKIM/DMARC.
