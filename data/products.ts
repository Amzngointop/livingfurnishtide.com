import { affiliateLinks } from './affiliateLinks.ts'
import { facts } from './facts.ts'
import { copy } from './productCopy.ts'
import type { Product } from './types.ts'

/** Facts, card copy and the supplied affiliate link joined; a listing missing any of them fails the build. */
export const products: Product[] = facts.map((f) => {
  const c = copy[f.asin]
  if (!c) throw new Error(`No card copy for ${f.asin}`)
  const affiliateUrl = affiliateLinks[f.asin]
  if (!affiliateUrl) throw new Error(`No affiliate link for ${f.asin}`)
  return { ...f, ...c, affiliateUrl }
})

for (const asin of Object.keys(copy)) {
  if (!facts.some((f) => f.asin === asin)) throw new Error(`Card copy for unknown ASIN ${asin}`)
}
for (const asin of Object.keys(affiliateLinks)) {
  if (!facts.some((f) => f.asin === asin)) throw new Error(`Affiliate link for unknown ASIN ${asin}`)
}
