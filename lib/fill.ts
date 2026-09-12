import { FACTS } from '../data/sources.ts'
import type { ProductFacts } from '../data/types.ts'
import { cap, lookup, numberWord } from './catalog.ts'

const PRODUCT_TOKENS: Record<string, (p: ProductFacts) => string | null> = {
  dims: (p) => p.statedDimensions,
  capacity: (p) => p.statedCapacity,
  units: (p) => p.statedUnitCount,
  top: (p) => p.statedTopMaterial,
  presets: (p) => (p.statedPresets === null ? null : numberWord(p.statedPresets)),
  also: (p) => p.alsoCalled?.as ?? null,
}

/**
 * Prose never types a number (R18). Tokens:
 *   {dims} {capacity} {units} {top} {presets} {also}   from the product
 *   {n:key} digits · {w:key} number word · {W:key} capitalized word
 *   {z:key} "no" for zero, else the word · {Z:key} capitalized
 *   {s:key} string · {S:key} capitalized string
 *   {o:key} "none" for zero, else the word · {O:key} capitalized
 *   {p:key|one|many} the noun that agrees with the count
 *   {f:key} a citation fact from data/sources.ts
 * A token that cannot be resolved throws, so a bad token fails the build.
 */
export function fill(text: string, product?: ProductFacts): string {
  return text.replace(
    /\{([a-z]+)\}|\{([pP]):([^|}]+)\|([^|}]+)\|([^}]+)\}|\{([nwWzZoOsSf]):([^}]+)\}/g,
    (whole, plain?: string, pm?: string, pkey?: string, one?: string, many?: string, mode?: string, key?: string) => {
      if (mode === 'f') {
        const fact = FACTS[key!]
        if (fact === undefined) throw new Error(`Unknown fact ${whole} in "${text}"`)
        return fact
      }
      if (plain) {
        const fn = PRODUCT_TOKENS[plain]
        if (!fn) throw new Error(`Unknown token ${whole} in "${text}"`)
        if (!product) throw new Error(`Product token ${whole} used without a product in "${text}"`)
        const v = fn(product)
        if (v === null) throw new Error(`Token ${whole} is null for ${product.asin} in "${text}"`)
        return v
      }
      if (pm && pkey) {
        const v = lookup(pkey)
        if (typeof v !== 'number') throw new Error(`Plural token ${whole} needs a count`)
        const noun = v === 1 ? one! : many!
        return pm === 'P' ? cap(noun) : noun
      }
      const value = lookup(key!)
      const asWord = (v: number | string) => (typeof v === 'number' ? numberWord(v) : v)
      switch (mode) {
        case 'n':
          return String(value)
        case 'w':
          return asWord(value)
        case 'W':
          return cap(asWord(value))
        case 'z':
          return value === 0 ? 'no' : asWord(value)
        case 'Z':
          return value === 0 ? 'No' : cap(asWord(value))
        case 'o':
          return value === 0 ? 'none' : asWord(value)
        case 'O':
          return value === 0 ? 'None' : cap(asWord(value))
        case 's':
          return String(value)
        case 'S':
          return cap(String(value))
        default:
          throw new Error(`Unknown token mode in ${whole}`)
      }
    }
  )
}
