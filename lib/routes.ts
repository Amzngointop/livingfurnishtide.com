import { facts } from '../data/facts.ts'
import { categories } from '../data/gear.ts'
import { glossary } from '../data/glossary.ts'
import { numbers } from '../data/numbers.ts'
import { pieces } from '../data/pieces.ts'
import { words } from '../data/words.ts'

/*
 * R13: the one registry of internal paths and the titles their pages carry.
 * Every page reads its H1 from here or from the same data record, and
 * PageLink reads its text from here, so a link cannot outlive a rename.
 */

export const STATIC_TITLES = {
  '/words': 'Words',
  '/numbers': 'Numbers',
  '/pieces': 'Pieces',
  '/tools': 'Tools',
  '/gear': 'Gear',
  '/word-check': 'Word Check',
  '/brand-spread-check': 'Brand Spread Check',
  '/glossary': 'Glossary',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/affiliate-disclosure': 'Affiliate Disclosure',
  '/pinterest': 'Pinterest Inspiration',
} as const

export type StaticPath = keyof typeof STATIC_TITLES

export const NAV: StaticPath[] = ['/words', '/numbers', '/pieces', '/tools', '/gear']

let cache: Map<string, string> | null = null

export function registry(): Map<string, string> {
  if (cache) return cache
  const map = new Map<string, string>(Object.entries(STATIC_TITLES))
  for (const w of words) map.set(`/words/${w.slug}`, w.title)
  for (const n of numbers) map.set(`/numbers/${n.slug}`, n.title)
  for (const p of pieces) map.set(`/pieces/${p.slug}`, p.title)
  for (const c of categories) map.set(`/gear/${c.slug}`, c.title)
  for (const g of glossary) map.set(`/glossary#${g.slug}`, g.term)
  for (const p of facts) map.set(`/gear/${p.category}#listing-${p.asin}`, p.name)
  cache = map
  return map
}

export function titleForPath(path: string): string {
  const title = registry().get(path)
  if (!title) throw new Error(`PageLink: no page is registered at "${path}"`)
  return title
}

export function pagePaths(): string[] {
  return ['/', ...Array.from(registry().keys()).filter((p) => !p.includes('#'))]
}

export const listingPath = (p: { category: string; asin: string }) => `/gear/${p.category}#listing-${p.asin}`
