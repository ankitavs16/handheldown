import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { useCheckout, donationFee, money } from '../payment'
import { GOOD_CAUSE } from '../data'

export default function MyItems() {
  const navigate = useNavigate()
  const { currentUser, items, claims, markPicked, payDonationFee } = useStore()

  const { CheckoutModal, openCheckout } = useCheckout()

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

  const mine = items.filter((i) => i.postedBy === currentUser.name)
  const publicPosts = mine.filter((i) => !i.isDonation)
  const donations = mine.filter((i) => i.isDonation)
  const claimFor = (id) => claims.find((c) => c.itemId === id)

  const renderDonationStatus = (item) => {
    if (item.status === 'donated' && item.donationFeePaid) {
      return (
        <>
          <p className="mt-1 text-sm font-bold text-leaf">✓ Collected by us — thank you!</p>
          <p className="mt-0.5 text-xs text-inksoft">
            💛 Your donation went to a good cause: {GOOD_CAUSE.name}.
          </p>
        </>
      )
    }
    if (item.status === 'accepted') {
      const fee = donationFee(item)
      return (
        <div className="mt-2">
          <p className="text-sm font-bold text-sun">We accepted your donation!</p>
          <p className="text-xs text-inksoft mt-0.5">
            Your donation is about {item.donationWeightKg} kg, so it's a {fee} donation for a good
            cause — pay it and we'll take it from here.
          </p>
          <button
            onClick={() =>
              openCheckout({
                itemTitle: item.title,
                amountLabel: fee,
                purpose: `Pickup donation · ${fee} · for a good cause`,
                onPaid: () => payDonationFee(item.id),
              })
            }
            className="btn btn-sm rounded-full mt-2 w-full bg-sun border-sun text-white font-display font-bold hover:opacity-90"
          >
            Pay {fee} donation
          </button>
        </div>
      )
    }
    return (
      <p className="mt-1 text-sm font-bold text-inksoft">📦 In our donation inbox — not public</p>
    )
  }

  return (
    <div className="px-4 pt-6">
      <CheckoutModal />
      <h1 className="font-display font-extrabold text-2xl text-ink">My items</h1>
      <p className="text-sm text-inksoft mb-4">
        {currentUser.name}'s posted things and what's happening with them.
      </p>

      {mine.length === 0 ? (
        <div className="tag-card bg-sand rounded-tag shadow-card p-8 text-center">
          <div className="text-4xl mb-2">🏷️</div>
          <h2 className="font-display font-bold text-xl text-ink">No posts yet</h2>
          <p className="text-sm text-inksoft mt-2">
            Post your first item and it'll show up here so you can track it.
          </p>
          <button
            onClick={() => navigate('/post')}
            className="btn btn-sm rounded-full mt-4 bg-coral border-coral text-white font-display font-bold hover:bg-coraldeep"
          >
            ＋ Post an item
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {mine.map((item) => {
            const claim = claimFor(item.id)
            const isDonation = item.isDonation
            return (
              <div
                key={item.id}
                className="tag-card bg-sand rounded-tag shadow-card overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={item.photo}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-ink truncate">{item.title}</h3>
                    <p className="text-xs text-inksoft mt-0.5">
                      {item.type} · {item.condition}
                      {isDonation && <span className="text-sun font-bold"> · ♥ donation</span>}
                    </p>
                    {isDonation
                      ? renderDonationStatus(item)
                      : claim
                        ? (
                            <p className="mt-1 text-sm font-bold text-leaf">
                              ✓ Claimed by {claim.by.name} ({claim.by.room})
                              {claim.paid ? ` · paid ${money(claim.amount)}` : ' · no payment'}
                            </p>
                          )
                        : (
                            <p className="mt-1 text-sm font-bold text-inksoft">⏳ Still waiting</p>
                          )}
                  </div>
                </div>

                {isDonation ? (
                  <div className="px-3 pb-3">
                    {item.status !== 'donated' && (
                      <p className="text-center text-xs text-inksoft">
                        Only you and our team can see this.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 pb-3 space-y-2">
                    {claim ? (
                      <button
                        onClick={() => markPicked(item.id)}
                        className="btn btn-sm rounded-full w-full bg-leaf border-leaf text-white font-display font-bold hover:opacity-90"
                      >
                        Drop-off complete — it's theirs now ✓
                      </button>
                    ) : (
                      <p className="text-center text-xs text-inksoft">
                        Drop it in the <b>shared room</b> when someone claims it
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
