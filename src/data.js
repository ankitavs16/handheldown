export const VARIANTS = {
  handmedown: {
    id: 'handmedown',
    name: 'Hand-Me-Down',
    tagline: 'Neighborly. Warm. Yours.',
    theme: 'classic',
    logo: '🏷',
    accent: '#3f5fe0',
    accentDeep: '#2e47b0',
    blush: '#e9edfd',
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

// Donation pickup is priced by approximate weight and goes to a good
// cause (school kits, books & supplies for families who need them).
export const GOOD_CAUSE = {
  name: 'Our charity partner',
  blurb:
    'Every pickup donation you make goes to a good cause — school kits, books and supplies for families who need them.',
}

// Rough rate. Pick an approximate weight; the fee is rate x ~kg.
export const DONATION_RATE = { amountPerKg: 30, currency: 'INR', label: '₹30/kg' }

// Approximate weights a donor can pick from (in kg).
export const WEIGHT_CHOICES = [0.5, 1, 2, 3, 5]

export function donationFeeFor(weightKg) {
  const amount = Math.round((DONATION_RATE.amountPerKg * (Number(weightKg) || 0)) * 100) / 100
  return { amount, label: `₹${amount}` }
}

// Payment mode.
//   'demo' -> in-app simulated checkout (card / UPI) — no real money moves.
//   For real payments you'll need a payment provider account (Stripe/Razorpay)
//   and a tiny backend to create payment sessions. See README.
export const PAYMENT_MODE = 'demo'

// PIN for the admin view (donation inbox). Change this before sharing.
export const ADMIN_PIN = '1234'

/* ------------------------------------------------------------------ *
 * Seed data
 *   price: 0 means hand it down for free; otherwise the poster's price in ₹
 *   status:
 *     'available'  -> listed on the feed (public)
 *     'accepted'   -> donation accepted by us; donor still owes the donation
 *     'donated'    -> donation completed, collected by us
 *   isDonation: true -> hidden from the public feed; admin inbox only
 *   donationWeightKg -> donor's approximate weight (drives the donation amount)
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
    price: 0,
    donationWeightKg: 1,
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
    price: 30,
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
    price: 0,
    donationWeightKg: 1,
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
    price: 150,
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
    price: 0,
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
    price: 0,
    donationWeightKg: 1,
    status: 'available',
    donationFeePaid: false,
  },
]

/**
 * Seed demo claims.
 * Item 2 (gel pens, ₹30, posted by Carlos M.) ships pre-claimed AND paid so
 * you can check the payment trail without running a checkout:
 *   - sign in as Carlos M. -> My items shows "Claimed by Aisha R. · paid ₹30"
 *   - the feed shows item 2 as claimed
 */
export const SEED_CLAIMS = [
  {
    itemId: '2',
    by: { name: 'Aisha R.', room: 'Room 204' },
    paid: true,
    amount: 30,
  },
]