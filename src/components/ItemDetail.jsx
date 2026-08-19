import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import { money } from '../payment'

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, claims, currentUser, claimItem } = useStore()

  const item = items.find((i) => i.id === id)

  if (!item || item.isDonation) {
    return <div className="p-6 text-inksoft">Item not found.</div>
  }

  const claim = claims.find((c) => c.itemId === id)
  const isOwner = currentUser && item.postedBy === currentUser.name
  const canClaim = !claim && !isOwner
  const amount = Number(item.price) || 0

  const handleClaim = () => {
    if (!currentUser) return navigate('/')
    if (claim) return navigate('/too-slow')
    if (amount > 0) return navigate(`/checkout/${id}`)
    claimItem(id, { name: currentUser.name, room: currentUser.room })
    navigate('/done')
  }

  return (
    <div className="pb-8">
      <div className="relative h-64 overflow-hidden">
        <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 btn btn-circle btn-sm bg-sand/95 text-ink shadow-card hover:bg-sand border-none"
        >
          ‹
        </button>
      </div>

      <div className="px-4 -mt-6 relative">
        <div className="bg-sand rounded-tag shadow-card p-5">
          <div className="flex items-center gap-2">
            <span className="badge bg-blush text-coraldeep font-bold border-none">{item.type}</span>
            <span className="badge bg-cream text-inksoft font-bold border-none">{item.condition}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-ink mt-2">{item.title}</h1>

          <div className="mt-4">
            <h3 className="font-display font-semibold text-sm text-inksoft">About it</h3>
            <p className="text-sm text-ink mt-1 leading-relaxed">{item.description}</p>
          </div>

          <div className="mt-4 bg-paper rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm text-inksoft">Price</span>
            <span className="font-display font-extrabold text-2xl text-coral">
              {amount > 0 ? money(amount) : 'Free 🎁'}
            </span>
          </div>

          <div className="mt-4 bg-paper rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blush text-coraldeep font-display font-bold flex items-center justify-center shrink-0">
              {item.postedBy.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm text-ink">{item.postedBy}</p>
              <p className="text-xs text-inksoft">Drop-off: shared room</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {claim ? (
            <div className="tag-card bg-leaf/10 border-2 border-leaf rounded-tag p-4 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <h2 className="font-display font-bold text-lg text-leaf">Already claimed!</h2>
              <p className="text-sm text-inksoft mt-1">
                {claim.by.name} from {claim.by.room} got there first. Keep an eye out for the next
                one 🏷
              </p>
            </div>
          ) : isOwner ? (
            <div className="tag-card bg-blush/50 border-2 border-coral rounded-tag p-4 text-center">
              <h2 className="font-display font-bold text-lg text-coraldeep">This is yours 🏷</h2>
              <p className="text-sm text-inksoft mt-1">
                Head to your My Items page when it gets picked up, and mark it done.
              </p>
            </div>
          ) : canClaim ? (
            <>
              <button
                onClick={handleClaim}
                className="btn btn-lg rounded-full w-full bg-coral border-coral text-white font-display font-bold shadow-card hover:bg-coraldeep"
              >
                🏷&nbsp;&nbsp;{amount > 0 ? `I want this — ${money(amount)}` : 'I want this! — Free'}
              </button>

              <p className="text-center text-xs text-inksoft mt-3">
                {amount > 0
                  ? `First come, first served. You'll pay ${currentUser ? 'at a secure checkout' : 'after signing in'}.`
                  : 'First come, first served — claim fast!'}
              </p>
            </>
          ) : (
            <p className="text-center text-xs text-inksoft mt-3">
              First come, first served — claim fast!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
