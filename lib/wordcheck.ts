import { categories } from '../data/gear.ts'
import type { CategorySlug, ProductFacts, WordSlug } from '../data/types.ts'
import { alsoStating, cap, CATEGORY_NOUN, CATEGORY_ORDER, numberWord, SETTLING, statesNothing, usedBy, WORD_ORDER } from './catalog.ts'
import { BEAM_RULE, tiltAngle } from './beam.ts'
import { assertOptionLabels } from './labels.ts'

/*
 * Word Check. Pure functions so the page, the home section and
 * scripts/check-tools.mjs all run the same code against the printed rules.
 */

export type Scope = CategorySlug | 'all'

export const WORD_TITLES: Record<WordSlug, string> = {
  sturdy: 'Sturdy',
  'heavy-duty': 'Heavy-duty',
  'ergonomic-and-lumbar-support': 'Ergonomic and lumbar support',
  'space-saving-and-compact': 'Space-saving and compact',
  'stackable-and-expandable': 'Stackable and expandable',
  'anti-tip': 'Anti-tip',
}

export const NUMBER_TITLES: Record<string, string> = {
  'weight-capacity': 'a weight capacity',
  'assembled-dimensions': 'assembled dimensions',
  'capacity-in-pairs-drawers-and-tiers': 'a capacity count',
  'what-the-top-is-made-of': 'a top material',
  'what-holds-it-to-the-wall': 'a named wall attachment part',
}

export const WORD_OPTIONS = WORD_ORDER.map((w) => ({ value: w, label: WORD_TITLES[w] }))

export const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: 'all', label: 'All categories' },
  ...CATEGORY_ORDER.map((c) => ({ value: c as Scope, label: categories.find((x) => x.slug === c)!.title })),
]

/* R11: labels inside each group are unique, present and at least six characters, or the build fails. */
assertOptionLabels('Word Check / word', WORD_OPTIONS.map((o) => o.label))
assertOptionLabels('Word Check / category', SCOPE_OPTIONS.map((o) => o.label))

export const WORD_CHECK_RULES = [
  'A listing prints a word when one of the spellings on that word’s page appears as a whole word in its title or listing text.',
  'A listing also states the figure when the field for the figure that could settle that word is filled in from its listing text.',
  BEAM_RULE,
  'A category where no listing prints the chosen word is switched off, and so is a category that holds every listing printing it, because All categories already gives that result.',
]

export const WORD_CHECK_LINES = [
  'A missing figure is not a property of the piece. It only means the listing does not print one.',
  'This tool sets printed words against printed figures and nothing else.',
  'Only anti-tip has a published federal requirement behind it, set out on its own page; the documents this site links give none of the other words a regulated definition.',
]

/**
 * The words-and-digits line that sits beside every word beam. `lead` is the
 * opening clause about the left count; the rest agrees with both counts.
 */
export function beamSentence(lead: string, left: number, right: number, figure: string | null): string {
  if (figure === null) return `${lead} (${left}). No printed figure could settle it, so the other side holds zero (0).`
  if (left === 1) return `${lead} (${left}), and it ${right === 1 ? 'also states' : 'does not also state'} ${figure} (${right}).`
  const also = right === 0 ? 'none of them also states' : `${numberWord(right)} of them also ${right === 1 ? 'states' : 'state'}`
  return `${lead} (${left}); ${also} ${figure} (${right}).`
}

function categoriesPrinting(w: WordSlug): CategorySlug[] {
  return CATEGORY_ORDER.filter((c) => usedBy(w, c).length > 0)
}

/** Why a scope option is switched off for this word, or null when it can change the result. */
export function scopeDisabledReason(w: WordSlug, s: Scope): string | null {
  if (s === 'all') return null
  const noun = CATEGORY_NOUN[s]
  if (usedBy(w, s).length === 0) return `No ${noun.one} listing prints ${WORD_TITLES[w].toLowerCase()}.`
  const cats = categoriesPrinting(w)
  if (cats.length === 1 && cats[0] === s) {
    return `Every listing that prints ${WORD_TITLES[w].toLowerCase()} is a ${noun.one}, so All categories already shows this result.`
  }
  return null
}

export interface WordCheckResult {
  word: WordSlug
  scope: Scope
  used: ProductFacts[]
  also: ProductFacts[]
  wordOnly: ProductFacts[]
  bare: number
  left: number
  right: number
  tilt: number
  figure: string | null
  sentence: string
  bareLine: string
}

export function wordCheck(w: WordSlug, s: Scope): WordCheckResult {
  if (scopeDisabledReason(w, s)) throw new Error(`wordCheck called with a switched-off scope: ${w} / ${s}`)
  const c = s === 'all' ? undefined : s
  const used = usedBy(w, c)
  const also = alsoStating(w, c)
  const wordOnly = used.filter((p) => !also.includes(p))
  const bare = used.filter(statesNothing).length
  const n = SETTLING[w]
  const figure = n === null ? null : NUMBER_TITLES[n]
  const where = s === 'all' ? 'in the catalog' : `among the ${CATEGORY_NOUN[s].many}`
  const left = used.length
  const right = also.length
  const sentence = beamSentence(`${cap(numberWord(left))} ${left === 1 ? 'listing' : 'listings'} ${where} ${left === 1 ? 'prints' : 'print'} this word`, left, right, figure)
  const bareLine =
    bare === 0
      ? `Every listing that prints it states at least one of the five figures this site counts; the count that state none is zero (0).`
      : `${cap(numberWord(bare))} of the ${numberWord(left)} ${left === 1 ? 'listing' : 'listings'} that print it ${bare === 1 ? 'states' : 'state'} none of the five figures this site counts (${bare}).`
  return { word: w, scope: s, used, also, wordOnly, bare, left, right, tilt: tiltAngle(left, right), figure, sentence, bareLine }
}
