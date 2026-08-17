import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { TYPES, CONDITIONS, DONATION_FEE } from '../data'

export default function PostItem() {
  const navigate = useNavigate()
  const { currentUser, addItem } = useStore()
  const [title, setTitle] = useState('')
  const [type, setType] = useState(TYPES[0])
  const [condition, setCondition] = useState(CONDITIONS[1])
  const [description, setDescription] = useState('')
  const [isDonation, setIsDonation] = useState(false)
  const [error, setError] = useState('')

  const submit = () => {
    if (!title.trim()) {
      return setError('Give it a short title — like "Blue winter jacket".')
    }
    const item = {
      id: 'p' + Date.now() + Math.floor(Math.random() * 1000),
      title: title.trim(),
      type,
      condition,
      description: description.trim() || 'Just looking for a new home 🏷',
      photo:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=70',
      postedBy: currentUser ? currentUser.name : 'You',
      isDonation,
      status: 'available',
      donationFeePaid: false,
    }
    addItem(item)
    navigate(isDonation ? '/donation-posted' : '/done-post')
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
        <h1 className="font-display font-extrabold text-xl text-ink">Post an item</h1>
        <span className="w-9" />
      </div>

      <div className="tag-card bg-sand rounded-tag shadow-card p-5 space-y-4">
        <div className="text-center bg-paper rounded-xl py-6">
          <div className="text-4xl mb-1">📸</div>
          <p className="text-sm text-inksoft">Photo comes soon — for now, a tidy placeholder</p>
        </div>

        <div>
          <label className="font-display font-semibold text-sm text-ink">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
            placeholder="e.g. Blue winter jacket"
            className="input input-bordered w-full rounded-xl bg-paper border-cream focus:border-coral focus:outline-none mt-1"
          />
        </div>

        <div>
          <label className="font-display font-semibold text-sm text-ink">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select select-bordered w-full rounded-xl bg-paper border-cream focus:border-coral focus:outline-none mt-1"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-display font-semibold text-sm text-ink">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="select select-bordered w-full rounded-xl bg-paper border-cream focus:border-coral focus:outline-none mt-1"
          >
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-display font-semibold text-sm text-ink">Say a little about it</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What's good about it? Nothing broken here? (optional)"
            className="textarea textarea-bordered w-full rounded-xl bg-paper border-cream focus:border-coral focus:outline-none mt-1"
          />
        </div>

        <label className="flex items-center justify-between bg-paper rounded-xl px-4 py-3 cursor-pointer">
          <div>
            <p className="font-display font-semibold text-sm text-ink">Make it a donation ♥</p>
            <p className="text-xs text-inksoft">
              Private — only our team sees it. Pickup fee {DONATION_FEE.label} to us, once accepted.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isDonation}
            onChange={(e) => setIsDonation(e.target.checked)}
            className="checkbox checkbox-primary checkbox-lg [--chkbg:var(--color-sun)] border-cream"
          />
        </label>

        {isDonation && (
          <div className="bg-blush/60 border-2 border-dashed border-coral/40 rounded-xl px-4 py-3 text-xs text-ink leading-relaxed">
            <b>How donations work here:</b> your item will <b>not</b> appear on the public feed. It
            goes to our donation inbox, and once we accept it, you'll pay the{' '}
            <b>{DONATION_FEE.label}</b> pickup fee so we can take it off your hands.
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-3 text-center">{error}</p>}

      <button
        onClick={submit}
        className="btn btn-lg rounded-full w-full mt-5 bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
      >
        🏷&nbsp;&nbsp;{isDonation ? 'Send it to our donation inbox' : 'Hang it in the hallway'}
      </button>
      <p className="text-center text-xs text-inksoft mt-2 mb-6">
        {isDonation
          ? "It stays private until we accept it — never on the main page."
          : "It'll be dropped off in the shared room once someone claims it."}
      </p>
    </div>
  )
}
