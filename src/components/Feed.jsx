import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { useMode, toggleMode } from '../mode'
import { getVariant } from '../variant'

export default function Feed() {
  const { items, claims, currentUser } = useStore()
  const mode = useMode()
  const variant = getVariant()
  const navigate = useNavigate()

  // Donations are private — they only ever show up in the admin inbox.
  const visible = items.filter((i) => !i.isDonation)
  const claimedMap = {}
  claims.forEach((c) => (claimedMap[c.itemId] = c))

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 text-white flex items-center justify-center text-xl shadow-sm shrink-0 rotate-[-4deg]">
            {variant.logo}
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-ink leading-tight">
              The hallway stash
            </h1>
            <p className="text-sm text-inksoft">Gently used things, one building over.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn btn-circle btn-xs bg-cream text-inksoft border-none hover:bg-blush"
          >
            {mode === 'dark' ? '☾' : '☀'}
          </button>
          <span className="bg-cream text-inksoft text-xs font-bold rounded-full px-3 py-1">
            {visible.length} {visible.length === 1 ? 'item' : 'items'}
          </span>
          <button
            onClick={() => navigate('/admin')}
            title="Admin (donation inbox)"
            className="btn btn-circle btn-xs bg-cream text-inksoft border-none hover:bg-blush"
          >
            🔒
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 text-center">
          <div className="text-4xl mb-2">🧺</div>
          <h2 className="font-display font-bold text-xl text-ink">Nothing here yet!</h2>
          <p className="text-sm text-inksoft mt-2">
            Be the first to post something — someone in the building is probably looking for exactly
            what you've got.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-2">
          {visible.map((item) => (
            <ItemCard key={item.id} item={item} claimedBy={claimedMap[item.id]} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  )
}

function ItemCard({ item, claimedBy, currentUser }) {
  const claimed = !!claimedBy
  return (
    <Link to={`/item/${item.id}`} className="block no-underline">
      <div className="tag-card bg-sand rounded-tag shadow-card overflow-hidden group h-full">
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.photo}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a4e6e33] via-transparent to-transparent" />
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            {item.condition}
          </span>
          <span
            className={`absolute top-2 right-2 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
              Number(item.price) > 0 ? 'bg-coral text-white' : 'bg-leaf text-white'
            }`}
          >
            {Number(item.price) > 0 ? `₹${item.price}` : 'Free'}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-display font-bold text-ink leading-snug">{item.title}</h3>
          <p className="text-xs text-inksoft mt-1">
            {item.type} · from {item.postedBy}
          </p>
          {claimed ? (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-leaf">
              ✓ Claimed by {claimedBy.by?.name}
            </span>
          ) : (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-coral">
              🏷 I want this
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
