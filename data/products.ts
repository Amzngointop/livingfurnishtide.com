import { facts } from './facts.ts'
import { copy } from './productCopy.ts'
import type { Product } from './types.ts'

/** Facts and card copy joined; a listing without copy fails the build. */
export const products: Product[] = facts.map((f) => {
  const c = copy[f.asin]
  if (!c) throw new Error(`No card copy for ${f.asin}`)
  return { ...f, ...c, affiliateUrl: `https://www.amazon.com/dp/${f.asin}?tag=YOURTAG-20` }
})

for (const asin of Object.keys(copy)) {
  if (!facts.some((f) => f.asin === asin)) throw new Error(`Card copy for unknown ASIN ${asin}`)
}
