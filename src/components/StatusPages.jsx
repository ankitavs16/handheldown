import { useNavigate } from 'react-router-dom'

export function Done() {
  const navigate = useNavigate()
  return (
    <StatusShell>
      <div className="text-6xl mb-3">🎉</div>
      <h1 className="font-display font-extrabold text-2xl text-ink">You got it!</h1>
      <p className="text-sm text-inksoft mt-3 leading-relaxed">
        The poster has been told. Head to the <b>shared room</b> (your building's pick-up spot) when
        it's dropped off. First one there — well, it's already yours 🏷
      </p>
      <div className="mt-4 bg-paper rounded-xl p-3 text-left">
        <p className="text-xs text-inksoft">Next step</p>
        <p className="text-sm text-ink font-semibold">Pick it up from the shared room, then it's all yours</p>
      </div>
      <PrimaryButton onClick={() => navigate('/feed')}>Keep browsing</PrimaryButton>
    </StatusShell>
  )
}

export function DonePost() {
  const navigate = useNavigate()
  return (
    <StatusShell>
      <div className="text-6xl mb-3">🏷️</div>
      <h1 className="font-display font-extrabold text-2xl text-ink">It's hanging!</h1>
      <p className="text-sm text-inksoft mt-3 leading-relaxed">
        Your item is now in the hallway stash for everyone to see. When someone claims it, we'll tell
        you here — then just drop it in the shared room. Easy as that ✨
      </p>
      <div className="mt-4 bg-paper rounded-xl p-3 text-left">
        <p className="text-xs text-inksoft">Keep an eye on</p>
        <p className="text-sm text-ink font-semibold">My items → for the 'Claimed' alert</p>
      </div>
      <PrimaryButton onClick={() => navigate('/mine')}>Go to my items</PrimaryButton>
    </StatusShell>
  )
}

export function DonationPosted() {
  const navigate = useNavigate()
  return (
    <StatusShell>
      <div className="text-6xl mb-3">📦</div>
      <h1 className="font-display font-extrabold text-2xl text-ink">Thanks for donating!</h1>
      <p className="text-sm text-inksoft mt-3 leading-relaxed">
        Your item is <b>not</b> on the public feed — it went straight to our private donation inbox.
        When our team accepts it, you'll get a notification here to pay the small pickup fee, then we
        take it from there 💚
      </p>
      <div className="mt-4 bg-paper rounded-xl p-3 text-left">
        <p className="text-xs text-inksoft">Next step</p>
        <p className="text-sm text-ink font-semibold">My items → watch for the 'Accepted' alert</p>
      </div>
      <PrimaryButton onClick={() => navigate('/mine')}>Go to my items</PrimaryButton>
    </StatusShell>
  )
}

export function TooSlow() {
  const navigate = useNavigate()
  return (
    <StatusShell>
      <div className="text-6xl mb-3">🫙</div>
      <h1 className="font-display font-extrabold text-2xl text-ink">Oof, too slow!</h1>
      <p className="text-sm text-inksoft mt-3 leading-relaxed">
        Someone else claimed that one just before you. Good things go fast here — but new stuff pops
        up all the time. Keep an eye on the feed 🏷
      </p>
      <PrimaryButton onClick={() => navigate('/feed')} leaf>
        See what's new
      </PrimaryButton>
    </StatusShell>
  )
}

function StatusShell({ children }) {
  return (
    <div className="px-5 pt-14 min-h-screen flex flex-col items-center text-center">
      <div className="tag-card bg-sand rounded-tag shadow-card p-8 w-full">{children}</div>
    </div>
  )
}

function PrimaryButton({ children, onClick, leaf }) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-lg rounded-full mt-6 w-full ${
        leaf ? 'bg-leaf border-leaf' : 'bg-coral border-coral'
      } text-white font-display font-bold shadow-card ${
        leaf ? 'hover:opacity-90' : 'hover:bg-coraldeep'
      }`}
    >
      {children}
    </button>
  )
}
