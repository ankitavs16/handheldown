import { useState } from 'react'
import { DONATION_FEE, STRIPE_PAYMENT_LINK } from './data'

/**
 * Checkout for "pay us" fees (currently the donation pickup fee).
 *
 * Real money:
 *   Set STRIPE_PAYMENT_LINK in src/data.js to your Stripe Payment Link URL.
 *   Users are sent to Stripe to pay; after paying they tap "I've paid" and the
 *   flow continues. No server required — Stripe sends you the money directly.
 *
 * Demo mode (default):
 *   STRIPE_PAYMENT_LINK is empty, so checkout is simulated in a modal.
 */
export function useCheckout() {
  const [config, setConfig] = useState(null)

  const openCheckout = (cfg) => setConfig({ ...cfg })
  const closeCheckout = () => setConfig(null)

  const CheckoutModal = config
    ? () => (
        <CheckoutDialog
          {...config}
          onClose={closeCheckout}
          onDone={() => {
            const cb = config.onPaid
            closeCheckout()
            cb && cb()
          }}
        />
      )
    : () => null

  return { CheckoutModal, openCheckout }
}

function CheckoutDialog({ itemTitle, amountLabel, purpose, onClose, onDone }) {
  const [paying, setPaying] = useState(false)
  const [stripeOpened, setStripeOpened] = useState(false)

  const startDemoPay = () => {
    setPaying(true)
    setTimeout(onDone, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 p-0 sm:p-4">
      <div className="bg-paper w-full max-w-md rounded-tag shadow-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-inksoft">{purpose}</p>
            <h2 className="font-display font-extrabold text-xl text-ink mt-0.5">Pay us securely</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-circle btn-sm bg-cream text-ink border-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-4 bg-sand rounded-xl p-4">
          <p className="text-sm text-inksoft">For</p>
          <p className="font-display font-bold text-ink">{itemTitle || 'Hand-Me-Down fee'}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-inksoft">Total due</span>
            <span className="font-display font-extrabold text-2xl text-coral">{amountLabel}</span>
          </div>
        </div>

        {STRIPE_PAYMENT_LINK ? (
          <div className="mt-5 space-y-2">
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              onClick={() => setStripeOpened(true)}
              className="btn btn-lg rounded-full w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
            >
              Pay with card (Stripe)
            </a>
            {stripeOpened && (
              <button
                onClick={onDone}
                className="btn btn-lg rounded-full w-full bg-leaf border-leaf text-white font-display font-bold hover:opacity-90"
              >
                I've paid — continue
              </button>
            )}
            <p className="text-center text-xs text-inksoft">
              A secure Stripe checkout opens in a new tab.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            <div className="bg-sand rounded-xl p-3 text-xs text-inksoft leading-relaxed">
              <b className="text-ink">Demo mode.</b> No real money moves yet. Set{' '}
              <code className="text-coraldeep">STRIPE_PAYMENT_LINK</code> in{' '}
              <code className="text-coraldeep">src/data.js</code> to accept real card payments via
              Stripe Payment Links.
            </div>
            <button
              onClick={startDemoPay}
              disabled={paying}
              className="btn btn-lg rounded-full w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep disabled:opacity-60"
            >
              {paying ? 'Processing…' : `Pay ${amountLabel} (demo)`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function feeSummary() {
  return DONATION_FEE.label
}
