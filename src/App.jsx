import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useStore } from './store'
import Onboarding from './components/Onboarding'
import Feed from './components/Feed'
import ItemDetail from './components/ItemDetail'
import PostItem from './components/PostItem'
import MyItems from './components/MyItems'
import { Done, DonePost, DonationPosted, Requested, TooSlow } from './components/StatusPages'
import BottomNav from './components/BottomNav'
import Admin from './components/Admin'

const HIDE_NAV = ['/post', '/done', '/done-post', '/donation-posted', '/requested', '/too-slow', '/admin']

function Shell() {
  const { user } = useStore()
  const location = useLocation()
  const showNav = !!user && !HIDE_NAV.includes(location.pathname)

  return (
    <div className="mx-auto max-w-md min-h-screen flex flex-col">
      <div className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/post" element={<PostItem />} />
          <Route path="/mine" element={<MyItems />} />
          <Route path="/done" element={<Done />} />
          <Route path="/done-post" element={<DonePost />} />
          <Route path="/donation-posted" element={<DonationPosted />} />
          <Route path="/requested" element={<Requested />} />
          <Route path="/too-slow" element={<TooSlow />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
