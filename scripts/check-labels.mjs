import { load, report } from './lib.mjs'

/*
 * Pre-build: R11 option labels (with a negative control), the brand traps in
 * this catalog, and the shape of every product record, run on the data.
 */

const failures = []
const notes = []

const { products } = await load('data/products.ts')
const { categories } = await load('data/gear.ts')
const { labelProblems } = await load('lib/labels.ts')
const { WORD_OPTIONS, SCOPE_OPTIONS } = await load('lib/wordcheck.ts')
const { BRAND_OPTIONS } = await load('lib/brandspread.ts')
const cat = await load('lib/catalog.ts')

/* Negative control: a clash, an empty label and a short label must all be reported with positions. */
const control = labelProblems(['WLIVE Wide Dresser', '', 'WLIVE', 'wlive wide dresser'])
for (const part of ['#2 has an empty label', '#3 "WLIVE" is shorter', '#1 and #4 both read']) {
  if (!control.some((p) => p.includes(part))) failures.push(`Negative control did not report: ${part}`)
}
if (failures.length === 0) notes.push('negative control: duplicate, empty and short labels reported with both positions')

const groups = {
  'Word Check / word': WORD_OPTIONS.map((o) => o.label),
  'Word Check / category': SCOPE_OPTIONS.map((o) => o.label),
  'Brand Spread Check / brand': BRAND_OPTIONS.map((o) => o.label),
}
for (const [group, labels] of Object.entries(groups)) {
  for (const p of labelProblems(labels)) failures.push(`${group}: ${p}`)
  notes.push(`${group}: ${labels.length} labels unique, present, six characters or more`)
}

/* The brand traps: repeated brands must still give unique names and short labels. */
const byBrand = new Map()
for (const p of products) if (p.brand) byBrand.set(p.brand, [...(byBrand.get(p.brand) ?? []), p])
for (const [brand, list] of byBrand) {
  if (list.length < 2) continue
  for (const x of labelProblems(list.map((p) => p.name))) failures.push(`${brand} names: ${x}`)
  for (const x of labelProblems(list.map((p) => p.shortLabel))) failures.push(`${brand} short labels: ${x}`)
}
const repeats = [...byBrand].filter(([, l]) => l.length > 1).map(([b, l]) => `${b} ${l.length}`)
notes.push(`repeated brands checked for unique names and labels: ${repeats.join(', ')}`)
for (const c of categories) {
  for (const x of labelProblems(products.filter((p) => p.category === c.slug).map((p) => p.shortLabel))) failures.push(`${c.slug} short labels: ${x}`)
}

/* Product records. */
if (products.length !== 52) failures.push(`Expected 52 products, found ${products.length}`)
const PIECE = { 'shoe-racks': 'the-rack', desks: 'the-desk', bookcases: 'the-bookcase', chairs: 'the-chair', dressers: 'the-dresser' }
const NULLABLE = ['statedCapacity', 'statedDimensions', 'statedUnitCount', 'statedTopMaterial', 'statedWallAttachment', 'brand']
const WORDS = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }
const asins = new Set()
for (const p of products) {
  if (asins.has(p.asin)) failures.push(`Duplicate ASIN ${p.asin}`)
  asins.add(p.asin)
  if (!/^B0[A-Z0-9]{8}$/.test(p.asin)) failures.push(`${p.asin}: not an ASIN`)
  if (!/^https:\/\/m\.media-amazon\.com\/images\/I\/.+\.jpg$/.test(p.imageUrl ?? '')) failures.push(`${p.asin}: imageUrl missing or malformed`)
  if (!new RegExp(`^https://www\\.amazon\\.com/[^/?]+/dp/${p.asin}\\?.*[?&]tag=livingfurnish-20(&|$)`).test(p.affiliateUrl)) failures.push(`${p.asin}: affiliateUrl is ${p.affiliateUrl}`)
  if (p.pieceSlug !== PIECE[p.category]) failures.push(`${p.asin}: pieceSlug ${p.pieceSlug} for ${p.category}`)
  if (p.brand !== null && !p.name.startsWith(p.brand)) failures.push(`${p.asin}: brand "${p.brand}" is not the start of the title`)
  if (typeof p.statesAntiTip !== 'boolean') failures.push(`${p.asin}: statesAntiTip is not a boolean`)
  if (!Array.isArray(p.wordsUsed)) failures.push(`${p.asin}: wordsUsed is not an array`)
  for (const k of NULLABLE) if (!(k in p) || p[k] === undefined) failures.push(`${p.asin}: ${k} is undefined, must be a value or null`)
  if (p.pros.length !== 4) failures.push(`${p.asin}: ${p.pros.length} pros`)
  if (p.cons.length !== 3) failures.push(`${p.asin}: ${p.cons.length} cons`)
  const detected = cat.WORD_ORDER.filter((w) => cat.printsWord(p, w))
  if (detected.join() !== p.wordsUsed.join()) failures.push(`${p.asin}: wordsUsed ${p.wordsUsed} but the text prints ${detected}`)
  if (p.statesAntiTip !== cat.printsWord(p, 'anti-tip')) failures.push(`${p.asin}: statesAntiTip disagrees with the text`)

  /* Figures in the title survive into the record, and the number word in the listing text agrees with the count column. */
  const unitInName = p.name.match(/(\d+)(?:[ -]| Fabric )(tiers?|drawers?|cubes?)\b/i)
  const unit = cat.unitCount(p)
  if (unitInName && (!unit || unit.n !== Number(unitInName[1]))) failures.push(`${p.asin}: title says ${unitInName[0]}, statedUnitCount is ${p.statedUnitCount}`)
  const wordInText = p.listingStates.match(/\b(two|three|four|five|six|seven|eight|nine|ten)\s+(?:[a-z-]+\s+){0,2}(tiers|drawers|bins|cubes)\b/)
  if (wordInText && (!unit || unit.n !== WORDS[wordInText[1]])) failures.push(`${p.asin}: listing text says "${wordInText[0]}", count column says ${p.statedUnitCount}`)
  if (unit && !wordInText) failures.push(`${p.asin}: statedUnitCount ${p.statedUnitCount} has no number word in the listing text`)
  const figs = [...p.name.replace(/\b3D\b|\bEN1\b/g, ' ').replace(unitInName?.[0] ?? ' ', ' ').matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]))
  const dims = cat.dimensionFigures(p)
  for (const f of figs) if (!dims.includes(f)) failures.push(`${p.asin}: title figure ${f} is not in statedDimensions ${p.statedDimensions}`)
}
notes.push('52 records: ASINs, images, affiliate URLs, piece slugs, brand prefixes, nullable fields, wordsUsed re-detected from text')
notes.push('title figures and listing number words agree with the count and size fields')

/* Subgroup sums (R18). */
for (const c of categories) {
  const inCat = products.filter((p) => p.category === c.slug)
  const ids = c.subgroups.map((s) => s.id)
  for (const o of inCat.filter((p) => !ids.includes(p.subgroup))) failures.push(`${o.asin} sits in undeclared subgroup ${o.subgroup}`)
  const sizes = c.subgroups.map((s) => inCat.filter((p) => p.subgroup === s.id).length)
  const sum = sizes.reduce((a, b) => a + b, 0)
  if (sum !== inCat.length) failures.push(`${c.slug}: subgroups sum to ${sum}, category holds ${inCat.length}`)
  if (sizes.some((n) => n === 0)) failures.push(`${c.slug}: an empty subgroup`)
  const ranks = inCat.map((p) => p.rank).sort((a, b) => a - b)
  if (ranks.join(',') !== inCat.map((_, i) => i + 1).join(',')) failures.push(`${c.slug}: ranks are not 1..${inCat.length}`)
  notes.push(`${c.slug}: ${inCat.length} = ${c.subgroups.map((s, i) => `${s.id} ${sizes[i]}`).join(' + ')}`)
}

process.exit(report('R11 · option labels, brand traps, product records, subgroup sums', failures, notes))
