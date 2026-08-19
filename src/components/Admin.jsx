import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { ADMIN_PIN, GOOD_CAUSE, donationFeeFor } from '../data'

const ADMIN_KEY = 'handheldown:admin'

export default function Admin() {
  const navigate = useNavigate()
  const { items, claims, acceptDonation } = useStore()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_KEY) === '1')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const tryUnlock = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_KEY, '1')
      setUnlocked(true)
      setError('')
    } else {
      setError('Wrong PIN.')
    }
  }

  if (!unlocked) {
    return (
      <div className="px-5 pt-14 min-h-screen flex flex-col items-center text-center">
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 w-full">
          <div className="text-5xl mb-3">🔒</div>
          <h1 className="font-display font-extrabold text-2xl text-ink">Team only</h1>
          <p className="text-sm text-inksoft mt-3">
            This is where donations land before they're public — and where pickup fees are handled.
          </p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
            placeholder="Admin PIN"
            className="input input-bordered w-full rounded-xl bg-paper border-cream focus:border-coral focus:outline-none mt-4 text-center tracking-widest"
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <button
            onClick={tryUnlock}
            className="btn btn-lg rounded-full mt-4 w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
          >
            Unlock
          </button>
          <p className="text-xs text-inksoft mt-3">
            PIN is set in <code>src/data.js</code> ({ADMIN_PIN})
          </p>
        </div>
      </div>
    )
  }

  const donations = items.filter((i) => i.isDonation)
  const recentActivity = claims.map((c) => ({ kind: 'claim', text: `${c.by.name} claimed`, ...c }))
  const donationStatus = (d) => {
    if (d.status === 'donated') return { label: '✓ Collected by us', tone: 'text-leaf' }
    if (d.status === 'accepted') return { label: '⏳ Awaiting donor payment', tone: 'text-sun' }
    return { label: 'In inbox — not public', tone: 'text-inksoft' }
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate('/feed')}
          className="btn btn-circle btn-sm bg-cream text-ink border-none"
        >
          ‹
        </button>
        <h1 className="font-display font-extrabold text-xl text-ink">Donation inbox</h1>
        <button
          onClick={() => {
            sessionStorage.removeItem(ADMIN_KEY)
            navigate('/feed')
          }}
          className="btn btn-circle btn-sm bg-cream text-inksoft border-none"
          title="Lock"
        >
          🔓
        </button>
      </div>

      <p className="text-sm text-inksoft mb-4">
        Donations stay hidden from the public feed until we take them. Donor fees are based on the
        item's approximate weight ({donationFeeFor(donations[0]?.donationWeightKg ?? 0).label} × kg)
        and go to {GOOD_CAUSE.name}.
      </p>

      {donations.length === 0 ? (
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 text-center">
          <div className="text-4xl mb-2">📦</div>
          <h2 className="font-display font-bold text-xl text-ink">No donations yet</h2>
          <p className="text-sm text-inksoft mt-2">Donations will land here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => {
            const s = donationStatus(d)
            return (
              <div key={d.id} className="tag-card bg-sand rounded-tag shadow-card overflow-hidden">
                <div className="flex gap-3 p-3">
                  <img
                    src={d.photo}
                    alt={d.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-ink truncate">{d.title}</h3>
                    <p className="text-xs text-inksoft mt-0.5">
                      {d.type} · {d.condition} · from {d.postedBy}
                    </p>
                    <p className={`mt-1 text-sm font-bold ${s.tone}`}>{s.label}</p>
                  </div>
                </div>
                {d.status === 'available' && (
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => acceptDonation(d.id)}
                      className="btn btn-sm rounded-full w-full bg-sun border-sun text-white font-display font-bold hover:opacity-90"
                    >
                      Accept from donor (bill {donationFeeFor(d.donationWeightKg).label})
                    </button>
                  </div>
                )}
                {d.status === 'accepted' && (
                  <p className="px-3 pb-3 text-center text-xs text-inksoft">
                    Donor was asked to donate {donationFeeFor(d.donationWeightKg).label} for a good
                    cause. It'll flip to collected once paid.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <h2 className="font-display font-bold text-lg text-ink mt-6 mb-2">Recent activity</h2>
      {recentActivity.length === 0 ? (
        <p className="text-sm text-inksoft">Nothing yet.</p>
      ) : (
        <div className="space-y-2 mb-8">
          {recentActivity.slice(0, 10).map((a, i) => (
            <div key={i} className="bg-paper rounded-xl px-3 py-2 text-sm text-ink">
              <span className="text-leaf font-bold">✓</span> {a.text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
