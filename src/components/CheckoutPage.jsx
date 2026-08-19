import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import { money } from '../payment'
import { PAYMENT_MODE } from '../data'

const METHODS = ['UPI', 'Card']

export default function CheckoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, claims, currentUser, claimItem } = useStore()

  const item = items.find((i) => i.id === id)
  const [method, setMethod] = useState('UPI')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  if (!item || item.isDonation) {
    return (
      <div className="px-5 pt-14 min-h-screen flex flex-col items-center text-center">
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 w-full">
          <h1 className="font-display font-extrabold text-2xl text-ink">Item not found</h1>
          <p className="text-sm text-inksoft mt-3">That listing doesn't exist anymore.</p>
          <button
            onClick={() => navigate('/feed')}
            className="btn btn-lg rounded-full mt-6 w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
          >
            Back to the feed
          </button>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="px-5 pt-14 min-h-screen flex flex-col items-center text-center">
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 w-full">
          <h1 className="font-display font-extrabold text-2xl text-ink">Hold on!</h1>
          <p className="text-sm text-inksoft mt-3">Sign in with your name first.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn btn-lg rounded-full mt-6 w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
        >
          Go sign in
        </button>
      </div>
    )
  }

  if (claims.find((c) => c.itemId === id)) {
    return (
      <div className="px-5 pt-14 min-h-screen flex flex-col items-center text-center">
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 w-full">
          <div className="text-6xl mb-3">🫙</div>
          <h1 className="font-display font-extrabold text-2xl text-ink">Oof, too slow!</h1>
          <p className="text-sm text-inksoft mt-3">
            Someone else already claimed this one. New stuff pops up all the time 🏷
          </p>
          <button
            onClick={() => navigate('/feed')}
            className="btn btn-lg rounded-full mt-6 w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
          >
            See what's new
          </button>
        </div>
      </div>
    )
  }

  const amount = Number(item.price) || 0

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => {
      claimItem(item.id, { name: currentUser.name, room: currentUser.room }, { paid: true, amount })
      navigate('/done')
    }, 1400)
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-circle btn-sm bg-cream text-ink border-none"
        >
          ‹
        </button>
        <h1 className="font-display font-extrabold text-xl text-ink">Checkout</h1>
        <span className="w-9" />
      </div>

      <div className="tag-card bg-sand rounded-tag shadow-card overflow-hidden">
        <div className="relative h-44 overflow-hidden">
          <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="badge bg-blush text-coraldeep font-bold border-none">{item.type}</span>
            <span className="badge bg-cream text-inksoft font-bold border-none">
              {item.condition}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-xl text-ink mt-2">{item.title}</h2>
          <p className="text-xs text-inksoft mt-1">
            from {item.postedBy} · pick up in the shared room
          </p>

          <div className="mt-4 bg-paper rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-inksoft">Total</span>
            <span className="font-display font-extrabold text-3xl text-coral">{money(amount)}</span>
          </div>

          <div className="mt-4">
            <p className="font-display font-semibold text-sm text-ink mb-2">Pay with</p>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`btn rounded-full font-display font-bold border-0 ${
                    method === m ? 'bg-coral text-white shadow-card' : 'bg-cream text-inksoft'
                  }`}
                >
                  {m === 'UPI' ? '🟢 UPI' : '💳 Card'}
                </button>
              ))}
            </div>
            <div className="mt-3 bg-paper rounded-xl p-3 text-xs text-inksoft leading-relaxed">
              {method === 'UPI'
                ? 'Pay on any UPI app (GPay, PhonePe, Paytm). This is a demo checkout — no real money moves.'
                : 'Card payments are on the way. For now this is a demo checkout — no real money moves.'}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-3 text-center">{error}</p>}

          <button
            onClick={handlePay}
            disabled={paying}
            className="btn btn-lg rounded-full w-full mt-5 bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep disabled:opacity-60"
          >
            {paying ? 'Processing…' : `Pay ${money(amount)} and claim it`}
          </button>
          <p className="text-center text-xs text-inksoft mt-2">
            {PAYMENT_MODE === 'live'
              ? 'Secured by your payment provider.'
              : 'Demo mode — nothing is actually charged. Real payments need a provider + backend (see README).'}
          </p>
        </div>
      </div>
    </div>
  )
}
