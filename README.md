# handheldown

A hand-me-down app for buildings: post things you don't need, claim things you do,
price 0 (free) or set your own price with a checkout, and donate things straight to us.

Rebuilt from the deployed build at `handheldown.vercel.app`, with new features added.

## Features

- **The hallway stash** — 2-column feed of gently used items from your building.
- **Your price, your call** — posters set their own price in ₹; `0` means hand it down for free.
- **Checkout** — priced items go to a checkout page (`/checkout/:id`) to pay before claiming.
  Demo mode simulates UPI / card — no real money moves.
- **Claim now** — first come, first served. Free items claim instantly.
- **My items** — track claims (with paid amount), mark drop-off complete.
- **Donations** — private by design.
  - Donated items never appear on the public feed.
  - They land in a PIN-gated **Donation inbox** (`🔒` on the feed, or `/admin`).
  - Accepting a donation bills the donor a small **pickup fee** (₹50) — paid via the demo modal.
- **Dark / light mode** — toggle on the feed and on the welcome screen; remembered per device.
- **5 themes** — switch looks with `?variant=handmedown|handmeup|stash|regifted|room101`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Payments

The app ships in **demo mode** (`PAYMENT_MODE = 'demo'` in `src/data.js`) — checkout is
simulated so you can test the whole flow. Nothing is actually charged.

To collect real money you'll need:

1. A payment provider account (e.g. **Stripe** or **Razorpay** for UPI).
2. A tiny backend (a serverless function is enough) that creates a payment session /
   intent for each order and returns a client secret.
3. Wire that into the checkout flow (`src/components/CheckoutPage.jsx` and
   `src/payment.jsx`) and flip `PAYMENT_MODE` to `'live'` in `src/data.js`.

Everything else you configure (pickup fee, currency, admin PIN) lives at the top of `src/data.js`.

## Where things are

| File | Purpose |
| --- | --- |
| `src/data.js` | pickup fee, payment mode, admin PIN, seed items, themes |
| `src/store.jsx` | app state (persisted to localStorage) |
| `src/payment.jsx` | donation-fee checkout modal + ₹ formatter |
| `src/components/CheckoutPage.jsx` | buyer checkout page (`/checkout/:id`) |
| `src/mode.js` | dark/light mode (persisted) |
| `src/components/` | every screen |
| `e2e/e2e.cjs` | end-to-end test (18 checks) |

## Deploy

The repo is set up for Vercel (`vercel.json` does the SPA rewrite).
`npm run build` → the `dist/` folder is what Vercel serves.