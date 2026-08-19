import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StoreProvider } from './store'
import { getVariant } from './variant'
import { initMode } from './mode'
import './index.css'

const variant = getVariant()
const el = document.documentElement
el.dataset.variant = variant.id
el.style.setProperty('--color-coral', variant.accent)
el.style.setProperty('--color-coraldeep', variant.accentDeep)
el.style.setProperty('--color-blush', variant.blush)
document.title = variant.name
window.__APP_VARIANT__ = variant
initMode()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)
