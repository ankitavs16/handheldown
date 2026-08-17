import { VARIANTS } from './data'

const params = new URLSearchParams(window.location.search)
const requested = params.get('variant')
const variantId = requested && VARIANTS[requested] ? requested : 'handmedown'

export function getVariant() {
  return VARIANTS[variantId]
}
