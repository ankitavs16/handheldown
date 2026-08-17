export const VARIANTS = {
  handmedown: {
    id: 'handmedown',
    name: 'Hand-Me-Down',
    tagline: 'Neighborly. Warm. Yours.',
    theme: 'classic',
    logo: '🏷',
    accent: '#e4572e',
    accentDeep: '#c63e17',
    blush: '#fce4d4',
  },
  handmeup: {
    id: 'handmeup',
    name: 'Hand-Me-Up',
    tagline: 'Goodbye clutter. Hello glow.',
    theme: 'neon',
    logo: '⚡',
    accent: '#29f5c8',
    accentDeep: '#0fb896',
    blush: '#0e2b23',
  },
  stash: {
    id: 'stash',
    name: 'The Stash',
    tagline: "Your building's hidden gem.",
    theme: 'grunge',
    logo: '📦',
    accent: '#c08a1e',
    accentDeep: '#97700f',
    blush: '#e8d9b4',
  },
  regifted: {
    id: 'regifted',
    name: 'ReGifted',
    tagline: 'Love it twice.',
    theme: 'pastel',
    logo: '🤍',
    accent: '#a86fb8',
    accentDeep: '#8a4fa0',
    blush: '#f0ddf5',
  },
  room101: {
    id: 'room101',
    name: 'Room 101',
    tagline: 'Where nothing goes to waste.',
    theme: 'forest',
    logo: '🌿',
    accent: '#3d7a52',
    accentDeep: '#2e5d40',
    blush: '#dfe9da',
  },
}

export const NAMES = ['Aisha R.', 'Carlos M.', 'Priya K.', 'Diego F.', 'Maya T.', 'Jonah W.']
export const ROOMS = ['Room 101', 'Room 204', 'Room 307', 'Room 412']
export const TYPES = ['Clothing', 'Accessories', 'Stationery']
export const CONDITIONS = ['Like new', 'Good', 'Worn']

/* ------------------------------------------------------------------ *
 * Donations & payments
 * ------------------------------------------------------------------ */

// What "we" charge to take a donated item off the donor's hands.
// Amount is in your chosen currency; change freely.
export const DONATION_FEE = { amount: 2, currency: 'USD', label: '$2' }

// Drop a real Stripe Payment Link here and donations get real payments.
// Leave empty ("") to stay in demo mode (simulated payment inside the app).
// How to make one: https://dashboard.stripe.com/payment-links
export const STRIPE_PAYMENT_LINK = ''

// PIN for the admin view (donation inbox). Change this before sharing.
export const ADMIN_PIN = '1234'

/* ------------------------------------------------------------------ *
 * Seed items
 *   status:
 *     'available'  -> listed on the feed (public)
 *     'claimed'    -> someone claimed it (kept for history)
 *     'accepted'   -> donation accepted by us; donor still owes the fee
 *     'donated'    -> donation completed, collected by us
 *   isDonation: true -> hidden from the public feed; admin inbox only
 * ------------------------------------------------------------------ */

export const SEED_ITEMS = [
  {
    id: '1',
    title: 'Cozy blue winter jacket',
    description:
      'Worn one season, still toasty warm. Zips perfectly, no stains. Great for the walk to school.',
    type: 'Clothing',
    condition: 'Like new',
    photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=70',
    postedBy: 'Aisha R.',
    isDonation: true,
    status: 'available',
    donationFeePaid: false,
  },
  {
    id: '2',
    title: 'Box of gel pens — 24 colors',
    description: 'Bought for a project, barely used. Every color still vibrant. Perfect for notes and doodles.',
    type: 'Stationery',
    condition: 'Good',
    photo: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=70',
    postedBy: 'Carlos M.',
    isDonation: false,
    status: 'available',
    donationFeePaid: false,
  },
  {
    id: '3',
    title: 'Vintage canvas tote bag',
    description: 'Sturdy, roomy, perfect for groceries or books. A little faded in the most charming way.',
    type: 'Accessories',
    condition: 'Good',
    photo: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=70',
    postedBy: 'Priya K.',
    isDonation: true,
    status: 'available',
    donationFeePaid: false,
  },
  {
    id: '4',
    title: 'Sturdy backpack (16 inch)',
    description: 'Two years old, still going strong. Big front pocket + bottle holder. Nothing broken.',
    type: 'Accessories',
    condition: 'Good',
    photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70',
    postedBy: 'Diego F.',
    isDonation: false,
    status: 'available',
    donationFeePaid: false,
  },
  {
    id: '5',
    title: 'Striped long-sleeve shirt',
    description: 'Soft cotton, worn a handful of times. Fits like a relaxed medium.',
    type: 'Clothing',
    condition: 'Like new',
    photo: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=600&q=70',
    postedBy: 'Maya T.',
    isDonation: false,
    status: 'available',
    donationFeePaid: false,
  },
  {
    id: '6',
    title: 'Math study workbook',
    description: 'Half-filled with a pencil — eraser marks mean you get to start fresh. Great for exam prep.',
    type: 'Stationery',
    condition: 'Worn',
    photo: 'https://images.unsplash.com/photo-1491309055486-24ae511c15c7?auto=format&fit=crop&w=600&q=70',
    postedBy: 'Jonah W.',
    isDonation: true,
    status: 'available',
    donationFeePaid: false,
  },
]
