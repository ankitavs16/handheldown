import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { getVariant } from '../variant'
import { VARIANTS } from '../data'

export default function Onboarding() {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  const variant = getVariant()
  const [name, setName] = useState(user ? user.name : '')
  const [room, setRoom] = useState(user ? user.room : null)
  const [showVariants, setShowVariants] = useState(false)

  const comeIn = () => {
    if (name.trim()) {
      setUser({ name: name.trim(), room: room || user?.room || 'Room 101' })
      return navigate('/feed')
    }
    if (user) return navigate('/feed')
  }

  return (
    <div className="px-5 pt-12 min-h-screen flex flex-col">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1 select-none">
          <span className="bg-coral !text-white font-display font-bold px-3 py-1 rounded-full text-sm rotate-[-4deg] shadow-sm">
            {variant.name}
          </span>
          <span className="font-display font-bold text-xl text-ink">{variant.logo}</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-ink mt-4">{variant.logo}</h1>
        <p className="font-display font-bold text-inksoft mt-1">{variant.tagline}</p>
      </div>

      <div className="rounded-tag bg-sand shadow-card p-6 mb-6">
        <label className="font-display font-semibold text-ink text-sm">Your name</label>
        <div className="mt-1 mb-3">
          {['Aisha R.', 'Carlos M.', 'Priya K.', 'Diego F.', 'Maya T.', 'Jonah W.'].map((n) => (
            <button
              key={n}
              onClick={() => setName(n)}
              className={`badge badge-lg mr-1.5 mb-1.5 cursor-pointer ${
                name === n
                  ? 'bg-coral text-white border-coral shadow-sm'
                  : 'bg-paper text-inksoft border-cream hover:border-coral'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <label className="font-display font-semibold text-ink text-sm">
          Your room (where you pick up)
        </label>
        <div className="mt-1">
          {['Room 101', 'Room 204', 'Room 307', 'Room 412'].map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`badge badge-lg mr-1.5 mb-1 cursor-pointer ${
                room === r
                  ? 'bg-coral text-white border-coral shadow-sm'
                  : 'bg-paper text-inksoft border-cream hover:border-coral'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={comeIn}
        disabled={!user && !name.trim()}
        className="btn btn-lg rounded-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep disabled:opacity-40 disabled:shadow-none"
      >
        ✦&nbsp;&nbsp;Come in!
      </button>
      <p className="text-center text-xs text-inksoft mt-4">
        No passwords here — just pick your name. (Real sign-in comes later ⚡)
      </p>

      <div className="mt-8 mb-4 text-center">
        <button
          onClick={() => setShowVariants((v) => !v)}
          className="text-[11px] text-inksoft underline underline-offset-2 opacity-70 hover:opacity-100"
        >
          Preview all 5 looks (demo only)
        </button>
        {showVariants && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {Object.values(VARIANTS).map((v) => (
              <a
                key={v.id}
                href={v.id === 'handmedown' ? '/#' : `/?variant=${v.id}`}
                className={`btn btn-xs rounded-full font-bold border-0 ${
                  v.id === variant.id ? 'opacity-100 ring-2 ring-offset-1' : 'opacity-70'
                }`}
                style={{ background: v.accent, color: '#fff' }}
              >
                {v.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
