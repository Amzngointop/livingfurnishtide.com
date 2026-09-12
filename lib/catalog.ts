import { facts } from '../data/facts.ts'
import type { CategorySlug, NumberSlug, ProductFacts, WordSlug } from '../data/types.ts'

/*
 * Every count the site prints comes from here (R18). Prose asks for a number
 * through a token such as {w:used:sturdy}; lookup() answers or throws.
 */

export const CATEGORY_ORDER: CategorySlug[] = ['shoe-racks', 'desks', 'bookcases', 'chairs', 'dressers']

export const CATEGORY_NOUN: Record<CategorySlug, { one: string; many: string }> = {
  'shoe-racks': { one: 'shoe rack', many: 'shoe racks' },
  desks: { one: 'desk', many: 'desks' },
  bookcases: { one: 'bookcase', many: 'bookcases' },
  chairs: { one: 'chair', many: 'chairs' },
  dressers: { one: 'dresser', many: 'dressers' },
}

export const WORD_ORDER: WordSlug[] = [
  'sturdy',
  'heavy-duty',
  'ergonomic-and-lumbar-support',
  'space-saving-and-compact',
  'stackable-and-expandable',
  'anti-tip',
]

export const NUMBER_ORDER: NumberSlug[] = [
  'weight-capacity',
  'assembled-dimensions',
  'capacity-in-pairs-drawers-and-tiers',
  'what-the-top-is-made-of',
  'what-holds-it-to-the-wall',
]

/** The spellings each word page counts, matched on whole words in the title and the listing text. */
export const WORD_FORMS: Record<WordSlug, string[]> = {
  sturdy: ['sturdy'],
  'heavy-duty': ['heavy-duty', 'heavy duty'],
  'ergonomic-and-lumbar-support': ['ergonomic', 'lumbar support'],
  'space-saving-and-compact': ['space-saving', 'space saving', 'compact', 'small spaces'],
  'stackable-and-expandable': ['stackable', 'expandable'],
  'anti-tip': ['anti-tip', 'anti tip'],
}

/** Which printed figure could settle each word. Ergonomic has none in these listings. */
export const SETTLING: Record<WordSlug, NumberSlug | null> = {
  sturdy: 'weight-capacity',
  'heavy-duty': 'weight-capacity',
  'ergonomic-and-lumbar-support': null,
  'space-saving-and-compact': 'assembled-dimensions',
  'stackable-and-expandable': 'assembled-dimensions',
  'anti-tip': 'what-holds-it-to-the-wall',
}

export const NUMBER_FIELD: Record<NumberSlug, keyof ProductFacts> = {
  'weight-capacity': 'statedCapacity',
  'assembled-dimensions': 'statedDimensions',
  'capacity-in-pairs-drawers-and-tiers': 'statedUnitCount',
  'what-the-top-is-made-of': 'statedTopMaterial',
  'what-holds-it-to-the-wall': 'statedWallAttachment',
}

/** Seller phrases outside the six word pages that a figure would settle. */
export const NUMBER_PHRASES: Record<NumberSlug, string[]> = {
  'weight-capacity': [],
  'assembled-dimensions': [],
  'capacity-in-pairs-drawers-and-tiers': ['large-capacity', 'large storage'],
  'what-the-top-is-made-of': ['wood grain', 'rustic', 'maple'],
  'what-holds-it-to-the-wall': [],
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export const formsRegex = (forms: string[]) => new RegExp(`\\b(${forms.map(escape).join('|')})\\b`, 'i')

export function listingText(p: ProductFacts): string {
  return `${p.name} ${p.listingStates}`
}

export function printsWord(p: ProductFacts, w: WordSlug): boolean {
  return formsRegex(WORD_FORMS[w]).test(listingText(p))
}

export function printsPhrase(p: ProductFacts, phrases: string[]): boolean {
  return phrases.length > 0 && formsRegex(phrases).test(listingText(p))
}

export const all = (): ProductFacts[] => facts

export function inCategory(c: CategorySlug): ProductFacts[] {
  return facts.filter((p) => p.category === c)
}

export function inSubgroup(c: CategorySlug, id: string): ProductFacts[] {
  return inCategory(c).filter((p) => p.subgroup === id)
}

const scoped = (c?: CategorySlug) => (c ? inCategory(c) : facts)

/**
 * Whether a listing prints the figure. For shoe racks the capacity figure is
 * pairs, because every rack already counts tiers in its title and a tier
 * count does not say how many shoes a tier takes.
 */
export function states(p: ProductFacts, n: NumberSlug): boolean {
  if (n === 'capacity-in-pairs-drawers-and-tiers' && p.category === 'shoe-racks') return pairs(p) !== null
  return p[NUMBER_FIELD[n]] !== null
}

export function statesNothing(p: ProductFacts): boolean {
  return NUMBER_ORDER.every((n) => !states(p, n))
}

export function usedBy(w: WordSlug, c?: CategorySlug): ProductFacts[] {
  return scoped(c).filter((p) => p.wordsUsed.includes(w))
}

export function alsoStating(w: WordSlug, c?: CategorySlug): ProductFacts[] {
  const n = SETTLING[w]
  if (n === null) return []
  return usedBy(w, c).filter((p) => states(p, n))
}

/** Categories a figure is counted in, with the printed reason. */
export function numberScope(n: NumberSlug): CategorySlug[] {
  if (n === 'capacity-in-pairs-drawers-and-tiers') {
    return CATEGORY_ORDER.filter((c) => inCategory(c).some((p) => p.statedUnitCount !== null))
  }
  if (n === 'what-the-top-is-made-of') {
    return CATEGORY_ORDER.filter((c) => inCategory(c).some((p) => /\b(top|tabletop|desktop)\b/i.test(listingText(p))))
  }
  return CATEGORY_ORDER
}

export const SCOPE_RULE: Record<NumberSlug, string> = {
  'weight-capacity': 'Counted across all five categories, because every piece here is sold to carry something.',
  'assembled-dimensions': 'Counted across all five categories, because every piece here takes up floor.',
  'capacity-in-pairs-drawers-and-tiers':
    'Counted only in the categories where at least one listing counts its storage in pairs, tiers, cubes or drawers. A shoe rack counts as stating it only when it prints pairs.',
  'what-the-top-is-made-of':
    'Counted only in the categories where at least one listing mentions a top, a tabletop or a desktop.',
  'what-holds-it-to-the-wall': 'Counted across all five categories; the count does not decide which pieces need it.',
}

export function stating(n: NumberSlug, c?: CategorySlug): ProductFacts[] {
  const scope = numberScope(n)
  return scoped(c).filter((p) => scope.includes(p.category) && states(p, n))
}

export function inScope(n: NumberSlug, c?: CategorySlug): ProductFacts[] {
  const scope = numberScope(n)
  return scoped(c).filter((p) => scope.includes(p.category))
}

export function silent(n: NumberSlug, c?: CategorySlug): ProductFacts[] {
  return inScope(n, c).filter((p) => !states(p, n))
}

/** Words a figure would settle: word pages that point at it, plus seller phrases. */
export function numberWordSide(n: NumberSlug): { pages: WordSlug[]; phrases: string[]; users: ProductFacts[] } {
  const pages = WORD_ORDER.filter((w) => SETTLING[w] === n)
  const phrases = NUMBER_PHRASES[n]
  const users = facts.filter((p) => pages.some((w) => p.wordsUsed.includes(w)) || printsPhrase(p, phrases))
  return { pages, phrases, users }
}

/** The word a category leans on: the most printed of the six, ties to the earlier word in the ledger. */
export function leanWord(c: CategorySlug): WordSlug {
  let best: WordSlug = WORD_ORDER[0]
  let bestN = -1
  for (const w of WORD_ORDER) {
    const n = usedBy(w, c).length
    if (n > bestN) {
      best = w
      bestN = n
    }
  }
  return best
}

export function leanTied(c: CategorySlug): WordSlug[] {
  const top = usedBy(leanWord(c), c).length
  return WORD_ORDER.filter((w) => usedBy(w, c).length === top)
}

/* ---------- brands ---------- */

export interface BrandRow {
  brand: string
  total: number
  byCategory: Record<CategorySlug, number>
  categories: CategorySlug[]
}

export function brandRows(): BrandRow[] {
  const map = new Map<string, BrandRow>()
  for (const p of facts) {
    if (p.brand === null) continue
    let row = map.get(p.brand)
    if (!row) {
      row = {
        brand: p.brand,
        total: 0,
        byCategory: { 'shoe-racks': 0, desks: 0, bookcases: 0, chairs: 0, dressers: 0 },
        categories: [],
      }
      map.set(p.brand, row)
    }
    row.total += 1
    row.byCategory[p.category] += 1
  }
  for (const row of map.values()) row.categories = CATEGORY_ORDER.filter((c) => row.byCategory[c] > 0)
  return [...map.values()].sort((a, b) => b.categories.length - a.categories.length || b.total - a.total || a.brand.localeCompare(b.brand))
}

/* ---------- parsed figures, for badges ---------- */

export function unitCount(p: ProductFacts): { n: number; unit: 'tiers' | 'drawers' | 'cubes' } | null {
  const m = p.statedUnitCount?.match(/^(\d+) (tiers|drawers|cubes)\b/)
  return m ? { n: Number(m[1]), unit: m[2] as 'tiers' | 'drawers' | 'cubes' } : null
}

export function pairs(p: ProductFacts): { min: number; max: number | null } | null {
  const s = p.statedUnitCount ?? ''
  const range = s.match(/(\d+) to (\d+) pairs/)
  if (range) return { min: Number(range[1]), max: Number(range[2]) }
  const open = s.match(/(\d+) or more pairs/)
  if (open) return { min: Number(open[1]), max: null }
  return null
}

export function dimensionFigures(p: ProductFacts): number[] {
  return [...(p.statedDimensions ?? '').matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]))
}

export function dimensionAxes(p: ProductFacts): number {
  const s = p.statedDimensions
  if (s === null) return 0
  return s.includes(' x ') ? s.split(' x ').length : 1
}

export function metric(p: ProductFacts, name: 'tiers' | 'drawers' | 'largestInch' | 'smallestInch' | 'wordCount'): number | null {
  if (name === 'wordCount') return p.wordsUsed.length
  if (name === 'tiers' || name === 'drawers') {
    const u = unitCount(p)
    return u && u.unit === name ? u.n : null
  }
  const figs = dimensionFigures(p)
  if (figs.length === 0) return null
  return name === 'largestInch' ? Math.max(...figs) : Math.min(...figs)
}

/* ---------- words for numbers ---------- */

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

export function numberWord(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) throw new Error(`numberWord supports whole numbers 0 to 99, got ${n}`)
  if (n < 20) return ONES[n]
  const t = TENS[Math.floor(n / 10)]
  return n % 10 === 0 ? t : `${t}-${ONES[n % 10]}`
}

export const cap = (s: string) => (s.length === 0 ? s : s[0].toUpperCase() + s.slice(1))

export function joinWords(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return n === 1 ? one : many
}

/* ---------- the token lookup ---------- */

const isCategory = (s: string): s is CategorySlug => (CATEGORY_ORDER as string[]).includes(s)
const isWord = (s: string): s is WordSlug => (WORD_ORDER as string[]).includes(s)
const isNumber = (s: string): s is NumberSlug => (NUMBER_ORDER as string[]).includes(s)

export function lookup(key: string): number | string {
  const [head, a, b] = key.split(':')
  const cat = (x?: string) => {
    if (x === undefined) return undefined
    if (!isCategory(x)) throw new Error(`Unknown category in token key "${key}"`)
    return x
  }
  const word = (x?: string) => {
    if (!x || !isWord(x)) throw new Error(`Unknown word in token key "${key}"`)
    return x
  }
  const num = (x?: string) => {
    if (!x || !isNumber(x)) throw new Error(`Unknown number in token key "${key}"`)
    return x
  }
  const brands = brandRows()
  switch (head) {
    case 'products':
      return facts.length
    case 'categories':
      return CATEGORY_ORDER.length
    case 'words':
      return WORD_ORDER.length
    case 'numbers':
      return NUMBER_ORDER.length
    case 'cat':
      return inCategory(cat(a)!).length
    case 'sub':
      return inSubgroup(cat(a)!, b ?? '').length || (() => { throw new Error(`Empty or unknown subgroup in "${key}"`) })()
    case 'used':
      return usedBy(word(a), cat(b)).length
    case 'also':
      return alsoStating(word(a), cat(b)).length
    case 'bare':
      return usedBy(word(a), cat(b)).filter(statesNothing).length
    case 'stating':
      return stating(num(a), cat(b)).length
    case 'silent':
      return silent(num(a), cat(b)).length
    case 'scope':
      return inScope(num(a), cat(b)).length
    case 'wordside':
      return numberWordSide(num(a)).users.length
    case 'brands':
      return brands.length
    case 'brands-multi':
      return brands.filter((r) => r.categories.length > 1).length
    case 'brands-single':
      return brands.filter((r) => r.total === 1).length
    case 'no-brand':
      return facts.filter((p) => p.brand === null).length
    case 'top-brand':
      return brands[0].brand
    case 'top-brand-listings':
      return brands[0].total
    case 'top-brand-cats':
      return brands[0].categories.length
    case 'antitip':
      return facts.filter((p) => p.statesAntiTip).length
    case 'wall':
      return facts.filter((p) => p.statedWallAttachment !== null).length
    case 'tall-storage':
      return inCategory('dressers').length + inCategory('bookcases').length
    case 'dual':
      return facts.filter((p) => p.alsoCalled !== null).length
    case 'dual-title':
      return facts.filter((p) => p.alsoCalled?.where === 'title').length
    case 'powered':
      return facts.filter((p) => p.powered).length
    case 'electric':
      return inSubgroup('desks', 'electric-standing').length
    case 'safety-listing':
      return facts.filter((p) => p.powered && p.statesSafetyListing).length
    case 'pairs':
      return facts.filter((p) => pairs(p) !== null).length
    case 'load-figure': {
      const values = facts.map((p) => p.statedCapacity).filter((v): v is string => v !== null)
      if (a === 'distinct') return new Set(values).size
      if (a === 'common') {
        const counts = new Map<string, number>()
        for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
        return [...counts.entries()].sort((x, y) => y[1] - x[1])[0][0]
      }
      if (a === 'common-count') {
        const counts = new Map<string, number>()
        for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
        return [...counts.values()].sort((x, y) => y - x)[0]
      }
      throw new Error(`Unknown load-figure key "${key}"`)
    }
    case 'no-dims-seats-and-drawers':
      return silent('assembled-dimensions', 'chairs').length + silent('assembled-dimensions', 'dressers').length
    case 'three-axes':
      return facts.filter((p) => dimensionAxes(p) === 3).length
    case 'word-free':
      return facts.filter((p) => p.wordsUsed.length === 0).length
    case 'states-nothing':
      return facts.filter(statesNothing).length
    case 'unbranded':
      return facts.filter((p) => p.brand === null).length
    case 'phrase': {
      if (!a) throw new Error(`Empty phrase in "${key}"`)
      return scoped(cat(b)).filter((p) => formsRegex([a]).test(listingText(p))).length
    }
    case 'title': {
      if (!a) throw new Error(`Empty title phrase in "${key}"`)
      return scoped(cat(b)).filter((p) => formsRegex([a]).test(p.name)).length
    }
    case 'stating-cats':
      return CATEGORY_ORDER.filter((c) => stating(num(a), c).length > 0).length
    case 'width-range':
      return facts.filter((p) => (p.statedDimensions ?? '').includes(' to ')).length
    case 'axes': {
      const n = Number(a)
      return scoped(cat(b)).filter((p) => dimensionAxes(p) === n).length
    }
    case 'lean-count':
      return usedBy(leanWord(cat(a)!), cat(a)).length
    case 'top-word': {
      const counts = WORD_ORDER.map((w) => usedBy(w).length)
      const max = Math.max(...counts)
      if (counts.filter((n) => n === max).length !== 1) return 'tie'
      return WORD_ORDER[counts.indexOf(max)]
    }
    case 'substating': {
      const [, n, c, sub] = key.split(':')
      return inSubgroup(cat(c)!, sub).filter((p) => states(p, num(n))).length
    }
    case 'subdual': {
      const [, c, sub] = key.split(':')
      return inSubgroup(cat(c)!, sub).filter((p) => p.alsoCalled !== null).length
    }
    case 'subused': {
      const [, w, c, sub] = key.split(':')
      return inSubgroup(cat(c)!, sub).filter((p) => p.wordsUsed.includes(word(w))).length
    }
    case 'shelf-load':
      return facts.filter((p) => /\b(shelf load|per shelf|per tier|per drawer|each shelf|each tier|each drawer)\b/i.test(listingText(p))).length
    default:
      throw new Error(`Unknown token key "${key}"`)
  }
}
