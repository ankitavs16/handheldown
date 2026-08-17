import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { SEED_ITEMS } from './data'

const STORAGE_KEY = 'handheldown:state:v2'

export const StoreContext = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage full or unavailable — keep in-memory */
  }
}

function initial() {
  const saved = load()
  if (saved) {
    return {
      user: saved.user ?? null,
      items: Array.isArray(saved.items) ? saved.items : SEED_ITEMS,
      claims: Array.isArray(saved.claims) ? saved.claims : [],
      requests: Array.isArray(saved.requests) ? saved.requests : [],
    }
  }
  return { user: null, items: SEED_ITEMS, claims: [], requests: [] }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user }
    case 'ADD_ITEM':
      return { ...state, items: [action.item, ...state.items] }
    case 'CLAIM':
      return {
        ...state,
        claims: [
          ...state.claims.filter((c) => c.itemId !== action.itemId),
          { itemId: action.itemId, by: action.by },
        ],
        requests: state.requests.filter((r) => r.itemId !== action.itemId),
      }
    case 'REQUEST':
      return { ...state, requests: [...state.requests, action.request] }
    case 'APPROVE_REQUEST':
      return {
        ...state,
        requests: state.requests.filter((r) => r.id !== action.requestId),
        claims: [
          ...state.claims.filter((c) => c.itemId !== action.itemId),
          { itemId: action.itemId, by: action.by },
        ],
      }
    case 'DECLINE_REQUEST':
      return { ...state, requests: state.requests.filter((r) => r.id !== action.requestId) }
    case 'MARK_PICKED':
      return { ...state, items: state.items.filter((i) => i.id !== action.itemId) }
    case 'ACCEPT_DONATION':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.itemId ? { ...i, status: 'accepted', donationFeePaid: false } : i,
        ),
      }
    case 'PAY_DONATION_FEE':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.itemId ? { ...i, status: 'donated', donationFeePaid: true } : i,
        ),
      }
    case 'RESET_DEMO':
      return { user: null, items: SEED_ITEMS, claims: [], requests: [] }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial)

  useEffect(() => {
    save(state)
  }, [state])

  const value = useMemo(() => {
    const actions = {
      setUser: (user) => dispatch({ type: 'SET_USER', user }),
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      claimItem: (itemId, by) => dispatch({ type: 'CLAIM', itemId, by }),
      requestItem: (request) => dispatch({ type: 'REQUEST', request }),
      approveRequest: (itemId, requestId, by) =>
        dispatch({ type: 'APPROVE_REQUEST', itemId, requestId, by }),
      declineRequest: (requestId) => dispatch({ type: 'DECLINE_REQUEST', requestId }),
      markPicked: (itemId) => dispatch({ type: 'MARK_PICKED', itemId }),
      acceptDonation: (itemId) => dispatch({ type: 'ACCEPT_DONATION', itemId }),
      payDonationFee: (itemId) => dispatch({ type: 'PAY_DONATION_FEE', itemId }),
      resetDemo: () => dispatch({ type: 'RESET_DEMO' }),
    }
    return { ...state, currentUser: state.user, ...actions }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
