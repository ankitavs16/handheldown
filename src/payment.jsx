import { useState } from 'react'
import { DONATION_FEE, PAYMENT_MODE } from './data'

/**
 * Checkout for "pay us" fees (currently the donation pickup fee).
 *
 * Real money:
 *   PAYMENT_MODE === 'live' requires a payment provider account (Stripe/Razorpay)
 *   plus a small backend to create a payment session — see README.
 *
 * Demo mode (default):
 *   PAYMENT_MODE === 'demo' -> checkout is simulated in-app. No real money moves.
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

        {PAYMENT_MODE === 'live' ? (
          <div className="mt-5 space-y-2">
            <p className="text-xs text-inksoft">
              Real payment provider is not configured. In <code className="text-coraldeep">demo</code>{' '}
              mode the payment is simulated.
            </p>
            <button
              onClick={startDemoPay}
              disabled={paying}
              className="btn btn-lg rounded-full w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep disabled:opacity-60"
            >
              {paying ? 'Processing…' : `Pay ${amountLabel} (demo)`}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            <div className="bg-sand rounded-xl p-3 text-xs text-inksoft leading-relaxed">
              <b className="text-ink">Demo mode.</b> No real money moves yet. To accept real
              payments you need a payment provider account plus a tiny backend (see README).
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

/** Format a rupee amount, e.g. 50 -> "₹50". */
export function money(n) {
  return `₹${Number(n) || 0}`
}
