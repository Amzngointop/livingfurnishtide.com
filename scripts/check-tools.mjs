import { load, pages, report } from './lib.mjs'

/*
 * R19: both tools swept across every input they allow, against an
 * independent reading of the rules printed on the page, with the strong form
 * of the dead-input check and negative controls.
 */

const failures = []
const notes = []

const { facts } = await load('data/facts.ts')
const wc = await load('lib/wordcheck.ts')
const bs = await load('lib/brandspread.ts')
const cat = await load('lib/catalog.ts')
const beam = await load('lib/beam.ts')

/* ---------- independent readings of the printed rules ---------- */
const FORMS = cat.WORD_FORMS
const printed = (p, w) => FORMS[w].some((f) => new RegExp(`\\b${f.replace(/[-]/g, '\\-')}\\b`, 'i').test(`${p.name} ${p.listingStates}`))
const FIELD = { 'weight-capacity': 'statedCapacity', 'assembled-dimensions': 'statedDimensions', 'what-holds-it-to-the-wall': 'statedWallAttachment' }
const expectTilt = (l, r) => Math.max(-12, Math.min(12, (r - l) * 1.5))

/* 1. Word Check: every word × every scope. */
let combos = 0
let off = 0
for (const w of cat.WORD_ORDER) {
  const cats = cat.CATEGORY_ORDER.filter((c) => facts.some((p) => p.category === c && printed(p, w)))
  const enabledSigs = []
  for (const o of wc.SCOPE_OPTIONS) {
    const reason = wc.scopeDisabledReason(w, o.value)
    const inScope = facts.filter((p) => o.value === 'all' || p.category === o.value)
    const users = inScope.filter((p) => printed(p, w))
    const shouldBeOff = o.value !== 'all' && (users.length === 0 || (cats.length === 1 && cats[0] === o.value))
    if (Boolean(reason) !== shouldBeOff) failures.push(`${w} / ${o.value}: switched ${reason ? 'off' : 'on'}, printed rule says ${shouldBeOff ? 'off' : 'on'}`)
    if (reason) {
      off += 1
      if (reason.length < 20) failures.push(`${w} / ${o.value}: switched off without a printed reason`)
      let threw = false
      try {
        wc.wordCheck(w, o.value)
      } catch {
        threw = true
      }
      if (!threw) failures.push(`${w} / ${o.value}: a switched-off scope still returns a result`)
      continue
    }
    combos += 1
    const r = wc.wordCheck(w, o.value)
    const field = FIELD[cat.SETTLING[w]]
    const alsoWant = field ? users.filter((p) => p[field] !== null) : []
    if (r.left !== users.length) failures.push(`${w} / ${o.value}: left ${r.left}, rule gives ${users.length}`)
    if (r.right !== alsoWant.length) failures.push(`${w} / ${o.value}: right ${r.right}, rule gives ${alsoWant.length}`)
    if (r.right > r.left) failures.push(`${w} / ${o.value}: more listings state the figure than print the word`)
    if (!r.also.every((p) => r.used.includes(p))) failures.push(`${w} / ${o.value}: a figure listing is not among the word listings`)
    if (r.wordOnly.length + r.also.length !== r.used.length) failures.push(`${w} / ${o.value}: the two lists do not add up`)
    if (r.tilt !== expectTilt(r.left, r.right)) failures.push(`${w} / ${o.value}: tilt ${r.tilt}, printed rule gives ${expectTilt(r.left, r.right)}`)
    if (Math.abs(r.tilt) > 12) failures.push(`${w} / ${o.value}: tilt beyond 12 degrees`)
    const bareWant = users.filter((p) => cat.NUMBER_ORDER.every((n) => !cat.states(p, n))).length
    if (r.bare !== bareWant) failures.push(`${w} / ${o.value}: bare ${r.bare}, rule gives ${bareWant}`)
    if (!r.sentence.includes(`(${r.left})`) || !r.sentence.includes(`(${r.right})`)) failures.push(`${w} / ${o.value}: sentence does not carry both counts`)
    enabledSigs.push({ scope: o.value, sig: JSON.stringify([r.used.map((p) => p.asin), r.also.map((p) => p.asin), r.bare]) })
  }
  /* Strong form: every enabled scope must change at least one result field against every other enabled scope. */
  for (const a of enabledSigs) {
    for (const b of enabledSigs) {
      if (a !== b && a.sig === b.sig) failures.push(`Dead input: ${w} gives the same result for ${a.scope} and ${b.scope}, and neither is switched off`)
    }
  }
}
const wordSigs = cat.WORD_ORDER.map((w) => JSON.stringify(wc.wordCheck(w, 'all').used.map((p) => p.asin)))
if (new Set(wordSigs).size !== wordSigs.length) failures.push('Dead input: two words give the same All categories result')
notes.push(`${combos} allowed word × category combinations swept, ${off} switched off with a printed reason; no two enabled options give the same result`)

/* Negative control: without the single-category rule, anti-tip would carry a dead Dressers option. */
const antitipAll = JSON.stringify(facts.filter((p) => printed(p, 'anti-tip')).map((p) => p.asin))
const antitipDressers = JSON.stringify(facts.filter((p) => p.category === 'dressers' && printed(p, 'anti-tip')).map((p) => p.asin))
if (antitipAll !== antitipDressers) failures.push('Negative control: anti-tip is no longer confined to dressers, so the dead-input rule is untested')
else notes.push('negative control: with the single-category rule removed, anti-tip / Dressers would equal All categories and be caught as dead')

/* Beam formula against the constants. */
if (beam.DEGREES_PER_LISTING !== 1.5 || beam.MAX_TILT !== 12) failures.push('Beam constants changed without the printed rule')
for (let l = 0; l <= 20; l += 1) for (let r = 0; r <= 20; r += 1) if (beam.tiltAngle(l, r) !== expectTilt(l, r)) failures.push(`tiltAngle(${l}, ${r}) off the printed rule`)
if (!(beam.tiltAngle(10, 0) < 0 && beam.tiltAngle(0, 10) > 0 && beam.tiltAngle(3, 3) === 0)) failures.push('The beam does not tip toward the larger count')
notes.push('beam: 441 grid points match the printed formula; tips toward the larger count, level on a tie, capped at 12 degrees')

/* 2. Brand Spread Check: every brand. */
const brandSigs = new Set()
let totalListed = 0
for (const o of bs.BRAND_OPTIONS) {
  const r = bs.brandSpread(o.value)
  const mine = facts.filter((p) => p.brand === o.value)
  totalListed += r.total
  if (r.total !== mine.length) failures.push(`${o.value}: total ${r.total}, exact-match count ${mine.length}`)
  const sum = r.rows.reduce((n, x) => n + x.count, 0)
  if (sum !== r.total) failures.push(`${o.value}: category rows sum to ${sum}, total ${r.total}`)
  const cats = new Set(mine.map((p) => p.category)).size
  if (r.categoryCount !== cats) failures.push(`${o.value}: ${r.categoryCount} categories, exact match gives ${cats}`)
  if (r.spread !== cats > 1) failures.push(`${o.value}: spread flag ${r.spread} for ${cats} categories`)
  if (r.single !== (mine.length === 1)) failures.push(`${o.value}: single flag wrong`)
  if (!o.label.startsWith(o.value)) failures.push(`${o.value}: option label does not start with the brand`)
  brandSigs.add(JSON.stringify([r.brand, r.rows.map((x) => x.count), r.listings.map((p) => p.asin)]))
}
if (brandSigs.size !== bs.BRAND_OPTIONS.length) failures.push('Dead input: two brand options give the same result')
const unbranded = facts.filter((p) => p.brand === null).length
if (totalListed + unbranded !== facts.length) failures.push(`Brands cover ${totalListed} listings plus ${unbranded} without a brand, catalog holds ${facts.length}`)
let merged = false
try {
  bs.brandSpread('Dumos')
  merged = true
} catch {
  /* expected: no merging of spellings */
}
if (merged) failures.push('Negative control: "Dumos" resolved to a brand, so spellings are being merged')
else notes.push('negative control: "Dumos" is not merged into "DUMOS"; exact-match rule holds')
notes.push(`${bs.BRAND_OPTIONS.length} brands swept; rows add up, flags follow the printed rule, every option changes the result`)

/* 3. The rules and lines are printed on the built pages exactly as implemented. */
const built = pages()
const byRoute = Object.fromEntries(built.map((p) => [p.route, p]))
for (const route of ['/word-check', '/']) {
  for (const rule of [...wc.WORD_CHECK_RULES, ...wc.WORD_CHECK_LINES]) if (!byRoute[route].text.includes(rule)) failures.push(`${route}: printed rule or line missing: "${rule.slice(0, 60)}"`)
  if (!byRoute[route].html.includes('data-disabled-reason')) failures.push(`${route}: no printed reason for switched-off inputs`)
  if (!/<ol[^>]*data-rules/.test(byRoute[route].html)) failures.push(`${route}: rules list missing`)
}
for (const route of ['/brand-spread-check', '/']) {
  for (const rule of [...bs.BRAND_RULES, ...bs.BRAND_LINES]) if (!byRoute[route].text.includes(rule)) failures.push(`${route}: printed brand rule missing: "${rule.slice(0, 60)}"`)
}
notes.push('rules and required lines found verbatim on both tool pages and on the home page')

process.exit(report('R19 · tool sweeps, dead inputs, printed rules', failures, notes))
