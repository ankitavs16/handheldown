import { useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="bg-ink text-paper rounded-full shadow-card px-2 py-2 flex items-center justify-around">
          <button
            onClick={() => navigate('/feed')}
            className="btn btn-ghost btn-circle btn-sm text-paper"
            title="Browse"
          >
            🏠
          </button>
          <button
            onClick={() => navigate('/post')}
            className="btn btn-circle btn-primary btn-lg -mt-8 border-4 border-ink bg-coral hover:bg-coraldeep text-white shadow-card"
            title="Post an item"
          >
            ＋
          </button>
          <button
            onClick={() => navigate('/mine')}
            className="btn btn-ghost btn-circle btn-sm text-paper"
            title="My items"
          >
            🎒
          </button>
        </div>
      </div>
    </div>
  )
}
