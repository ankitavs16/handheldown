# handheldown

A hand-me-down app for buildings: post things you don't need, claim things you do,
request items before they're gone, and donate things straight to us.

Rebuilt from the deployed build at `handheldown.vercel.app`, with new features added.

## Features

- **The hallway stash** — 2-column feed of gently used items from your building.
- **Claim now** — first come, first served (`I want this!`).
- **Request instead** — send the poster a note; they approve or decline in My Items.
- **My items** — track claims, approve/decline requests, mark drop-off complete.
- **Donations** — private by design.
  - Donated items never appear on the public feed.
  - They land in a PIN-gated **Donation inbox** (`🔒` on the feed, or `/admin`).
  - Accepting a donation bills the donor a small **pickup fee** ("pay us so we can take it").
- **Payments** — Stripe Payment Links (or a built-in demo checkout).
- **5 themes** — switch looks with `?variant=handmedown|handmeup|stash|regifted|room101`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Take real payments (Stripe)

The app ships in **demo mode** — checkout is simulated so you can test the whole flow.

To collect real money:

1. Create a Payment Link at <https://dashboard.stripe.com/payment-links>.
2. Put its URL in `src/data.js`:

```js
export const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/xxxxx'
```

3. Rebuild & deploy. Users now get sent to Stripe to pay the fee; after paying they
   tap "I've paid — continue".

Everything you configure (fee amount, currency, admin PIN) lives at the top of `src/data.js`.

## Where things are

| File | Purpose |
| --- | --- |
| `src/data.js` | fee, Stripe link, admin PIN, seed items, themes |
| `src/store.jsx` | app state (persisted to localStorage) |
| `src/payment.jsx` | checkout modal + demo payment |
| `src/components/` | every screen |
| `e2e/e2e.cjs` | end-to-end test (16 checks) |

## Deploy

The repo is set up for Vercel (`vercel.json` does the SPA rewrite).
`npm run build` → the `dist/` folder is what Vercel serves.
