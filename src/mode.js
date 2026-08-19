import { useSyncExternalStore } from 'react'

const KEY = 'handheldown:mode'
const DEFAULT = 'light'

let current = DEFAULT
const listeners = new Set()

function getStored() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'dark' || v === 'light' ? v : DEFAULT
  } catch {
    return DEFAULT
  }
}

function apply(mode) {
  document.documentElement.dataset.mode = mode
}

function emit() {
  current = getStored()
  listeners.forEach((l) => l())
}

export function initMode() {
  current = getStored()
  apply(current)
}

export function getMode() {
  return current
}

export function toggleMode() {
  const next = current === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* storage unavailable */
  }
  current = next
  apply(next)
  listeners.forEach((l) => l())
}

export function useMode() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
  )
}