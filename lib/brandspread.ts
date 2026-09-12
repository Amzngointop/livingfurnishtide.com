import { facts } from '../data/facts.ts'
import { categories } from '../data/gear.ts'
import type { CategorySlug, ProductFacts } from '../data/types.ts'
import { brandRows, cap, CATEGORY_ORDER, numberWord } from './catalog.ts'
import { assertOptionLabels } from './labels.ts'

/*
 * Brand Spread Check. The brand is the exact string at the start of the
 * listing title; no two spellings are merged.
 */

export const BRAND_RULES = [
  'A listing belongs to a brand when its title starts with exactly that brand string, capitals and spaces included.',
  'Similar spellings are not merged: a title starting with a different capitalization or a shortened name would count as a separate brand.',
  'A brand counts as spread across categories when its listings sit in more than one of the five categories.',
]

export const BRAND_LINES = [
  'This is a fact about the listings collected for this catalog, not about any brand’s range or the wider market.',
]

export const BRAND_OPTIONS = brandRows().map((r) => ({
  value: r.brand,
  label: `${r.brand} · ${r.total} ${r.total === 1 ? 'listing' : 'listings'}`,
}))

assertOptionLabels('Brand Spread Check / brand', BRAND_OPTIONS.map((o) => o.label))

export interface BrandResult {
  brand: string
  total: number
  rows: { category: CategorySlug; title: string; count: number }[]
  categoryCount: number
  spread: boolean
  single: boolean
  listings: ProductFacts[]
  headline: string
  singleLine: string
}

export function brandSpread(brand: string): BrandResult {
  const row = brandRows().find((r) => r.brand === brand)
  if (!row) throw new Error(`No brand "${brand}" in this catalog`)
  const listings = facts.filter((p) => p.brand === brand)
  if (listings.length !== row.total) throw new Error(`Brand count mismatch for ${brand}`)
  const rows = CATEGORY_ORDER.map((c) => ({
    category: c,
    title: categories.find((x) => x.slug === c)!.title,
    count: row.byCategory[c],
  }))
  const categoryCount = row.categories.length
  const spread = categoryCount > 1
  const single = row.total === 1
  const headline = `${brand} has ${numberWord(row.total)} ${row.total === 1 ? 'listing' : 'listings'} (${row.total}) in ${numberWord(categoryCount)} ${categoryCount === 1 ? 'category' : 'categories'} (${categoryCount}).`
  const rowsAll = brandRows()
  const singles = rowsAll.filter((r) => r.total === 1).length
  const singleLine = single
    ? `${brand} is one of ${numberWord(singles)} brands (${singles} of ${rowsAll.length}) with a single listing in a single category, which is most of the brands here.`
    : `${cap(numberWord(singles))} of the ${numberWord(rowsAll.length)} brands (${singles} of ${rowsAll.length}) have a single listing in a single category; ${brand} is not one of them.`
  return { brand, total: row.total, rows, categoryCount, spread, single, listings, headline, singleLine }
}

export function brandSummary() {
  const rowsAll = brandRows()
  return {
    brands: rowsAll.length,
    spread: rowsAll.filter((r) => r.categories.length > 1),
    singles: rowsAll.filter((r) => r.total === 1).length,
    unbranded: facts.filter((p) => p.brand === null).length,
    top: rowsAll[0],
  }
}
