import fs from 'node:fs'
import path from 'node:path'
import { ROOT, load, pages, report, stripTags, walk } from './lib.mjs'

/*
 * R14 badges re-derived from data, R18 typed numbers in prose and the counts
 * sentences rely on, quotes that must exist in listing text, and rendered
 * counts against rendered items on the built pages.
 */

const failures = []
const notes = []

const { products } = await load('data/products.ts')
const { categories } = await load('data/gear.ts')
const { words } = await load('data/words.ts')
const { numbers } = await load('data/numbers.ts')
const { pieces } = await load('data/pieces.ts')
const { glossary } = await load('data/glossary.ts')
const { wall } = await load('data/wall.ts')
const cat = await load('lib/catalog.ts')
const { fill } = await load('lib/fill.ts')

/* ---------- R14 ---------- */
for (const c of categories) {
  const items = products.filter((p) => p.category === c.slug)
  const badged = items.filter((p) => p.badge)
  const labels = badged.map((p) => p.badge.label)
  if (new Set(labels).size !== labels.length) failures.push(`${c.slug}: badge labels repeat`)
  if (!items.find((p) => p.rank === 1)?.badge) failures.push(`${c.slug}: rank 1 carries no badge`)
  for (const p of badged) {
    const rule = p.badge.rule
    const where = `${p.asin} "${p.badge.label}"`
    if (rule.kind === 'flag') {
      const holders = items.filter((x) => x.flags.includes(rule.value))
      if (holders.length !== 1 || holders[0] !== p) failures.push(`${where}: flag "${rule.value}" held by ${holders.map((h) => h.asin).join(', ') || 'nobody'}`)
    } else {
      const values = items.map((x) => cat.metric(x, rule.metric)).filter((v) => v !== null)
      const own = cat.metric(p, rule.metric)
      const extreme = rule.kind === 'max' ? Math.max(...values) : Math.min(...values)
      if (own !== rule.value) failures.push(`${where}: ${rule.metric} is ${own}, rule says ${rule.value}`)
      if (extreme !== rule.value) failures.push(`${where}: ${rule.kind} of ${rule.metric} is ${extreme}`)
      if (values.filter((v) => v === rule.value).length !== 1) failures.push(`${where}: ${rule.value} is not unique in ${c.slug}`)
    }
    if (/\b(only|most|largest|smallest|fewest|highest)\b/i.test(p.badge.label) && rule.kind === 'flag') {
      const holders = items.filter((x) => x.flags.includes(rule.value))
      if (holders.length !== 1) failures.push(`${where}: a superlative label rests on a value held ${holders.length} times`)
    }
    if (!fill(p.badge.basis, p).trim()) failures.push(`${where}: empty basis`)
  }
  notes.push(`${c.slug}: ${badged.length} badges re-derived, all different, rank 1 badged`)
}
/* Flags that badges rest on are checked against the listing text, so a flag cannot be invented. */
const FLAG_TEXT = {
  'pairs-and-three-dimensions': (p) => cat.pairs(p) && cat.dimensionAxes(p) === 3,
  'width-range': (p) => / to .* in wide/.test(p.statedDimensions ?? ''),
  cover: (p) => /\bcover\b/i.test(p.listingStates),
  'open-ended-pairs': (p) => /or more pairs/.test(p.statedUnitCount ?? ''),
  'power-outlet': (p) => /power outlet/i.test(p.listingStates),
  'load-and-cable-hub': (p) => p.statedCapacity && /cable management hub/i.test(p.listingStates),
  'load-and-stable-frame-four-presets': (p) => p.statedCapacity && /stable steel frame/i.test(p.listingStates) && p.statedPresets === 4,
  'load-and-seamless-desktop': (p) => p.statedCapacity && /seamless desktop/i.test(p.listingStates),
  'cubes-with-dimensions': (p) => /cubes/.test(p.statedUnitCount ?? '') && cat.dimensionAxes(p) === 3,
  'stackable-bookcase': (p) => p.category === 'bookcases' && cat.printsWord(p, 'stackable-and-expandable'),
  'ergonomic-in-title': (p) => /\bergonomic\b/i.test(p.name),
  'chair-weight-figure': (p) => p.statedCapacity !== null,
  '3d-armrests': (p) => /3D armrests/.test(p.listingStates),
  'rocking-mode': (p) => /rocking mode/.test(p.listingStates),
  'no-wheels': (p) => /no wheels/i.test(`${p.name} ${p.listingStates}`),
  'anti-tip': (p) => p.statesAntiTip,
  'television-size': (p) => /televisions up to/.test(p.listingStates),
}
for (const c of categories) {
  const items = products.filter((p) => p.category === c.slug)
  for (const [flag, test] of Object.entries(FLAG_TEXT)) {
    const byText = items.filter((p) => test(p)).map((p) => p.asin)
    const byFlag = items.filter((p) => p.flags.includes(flag)).map((p) => p.asin)
    if (byFlag.length > 0 && byText.join() !== byFlag.join()) failures.push(`${c.slug}: flag ${flag} on ${byFlag}, text gives ${byText}`)
  }
}
notes.push('badge flags re-derived from the listing text')

/* ---------- R18: prose never types a number ---------- */
const ALLOWED = [/\b3D\b/g, /360 degree/g, /\bEN1\b/g]
const MANY = 'two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty'
const NOUNS = 'listings?|categor(?:y|ies)|brands?|desks?|chairs?|dressers?|racks?|bookcases?|pieces?|words?|figures?|terms?|tools?|pages?|titles?|towers?|drawers?|tiers?|pairs?|cubes?'
/* "one" counts only when the noun follows at once; "more than one" is an idiom, not a count. */
const COUNTED_RE = new RegExp(`\\b(?:one\\s+(?:${NOUNS})|(?:${MANY})\\s+(?:[a-z-]+\\s+){0,2}(?:${NOUNS}))\\b`, 'i')
const COUNTED = { match: (s) => s.replace(/more than one/gi, ' ').match(COUNTED_RE) }
const texts = products.map((p) => `${p.name} ${p.listingStates}`.toLowerCase())
function prose(where, s, product) {
  if (typeof s !== 'string') return
  let filled
  try {
    filled = fill(s, product)
  } catch (err) {
    failures.push(`${where}: ${err.message}`)
    return
  }
  const owner = product ? [`${product.name} ${product.listingStates}`.toLowerCase()] : texts
  for (const m of filled.matchAll(/\[\[([^\]]+)\]\]/g)) {
    if (!owner.some((t) => t.includes(m[1].toLowerCase()))) failures.push(`${where}: quoted "${m[1]}" is not in ${product ? 'its listing' : 'any listing'}`)
  }
  let t = s.replace(/\[\[[^\]]+\]\]/g, ' ').replace(/\{[^}]+\}/g, ' ')
  for (const a of ALLOWED) t = t.replace(a, ' ')
  if (/\d/.test(t)) failures.push(`${where}: typed digit in "${s.slice(0, 100)}"`)
  const m = COUNTED.match(t)
  if (m) failures.push(`${where}: typed count "${m[0]}" in "${s.slice(0, 100)}"`)
}
const before = failures.length
prose('control', 'Seven listings print 176 lbs.')
if (failures.length - before !== 2) failures.push('Negative control: the prose check did not flag both a digit and a number word')
else {
  failures.splice(before, 2)
  notes.push('negative control: a typed digit and a typed count are both flagged')
}

let fields = 0
const count = (where, list, product) => list.forEach((s, i) => ((fields += 1), prose(`${where}#${i}`, s, product)))
for (const p of products) count(p.asin, [p.summary, ...p.pros, ...p.cons, p.bestFor, p.note, p.badge?.label, p.badge?.basis], p)
for (const w of words) count(`words/${w.slug}`, [w.whatItWouldMean, w.settlingFigure, w.whoDefinesIt, w.whatItDoesNotPromise, w.lede, w.metaDescription, ...w.body])
for (const n of numbers) count(`numbers/${n.slug}`, [n.whatItIs, n.whatItDecides, n.lede, n.metaDescription, ...n.body])
for (const p of pieces) count(`pieces/${p.slug}`, [p.whatItIs, p.metaDescription, ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs])])
for (const c of categories) count(`gear/${c.slug}`, [c.coreJob, c.intro, c.metaDescription, ...c.subgroups.map((s) => s.intro), ...c.faq.flatMap((f) => [f.q, f.a])])
for (const g of glossary) count(`glossary/${g.slug}`, [g.definition])
notes.push(`${fields} prose fields scanned for typed digits, typed counts and quotes absent from the listing text`)

/* Counts a sentence relies on without a token. */
let pinned = 0
for (const rec of [...words, ...numbers, ...pieces, ...categories, ...glossary]) {
  for (const [key, want] of Object.entries(rec.assumes ?? {})) {
    pinned += 1
    let got
    try {
      got = cat.lookup(key)
    } catch (err) {
      failures.push(`${rec.slug}: ${err.message}`)
      continue
    }
    if (got !== want) failures.push(`${rec.slug}: prose assumes ${key} = ${want}, data gives ${got}; rewrite the sentence`)
  }
}
notes.push(`${pinned} counts that sentences lean on still hold`)

/* Page source: no typed counts in JSX text. */
for (const file of [...walk(path.join(ROOT, 'app'), '.tsx'), ...walk(path.join(ROOT, 'components'), '.tsx')]) {
  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
      const m = COUNTED.match(line.replace(/\{[^}]*\}/g, ' '))
      if (m) failures.push(`${path.relative(ROOT, file)}:${i + 1}: typed count "${m[0]}"`)
    })
}

/* The wall: every word printed by a seller, exactly one figure. */
for (const s of wall) if (!texts.some((t) => cat.formsRegex([s.text]).test(t))) failures.push(`Word Wall: "${s.text}" is not printed by any listing`)
notes.push(`${wall.length} Word Wall words each printed by at least one listing`)

/* ---------- rendered counts ---------- */
const built = pages()
const page = (r) => {
  const found = built.find((p) => p.route === r)
  if (!found) throw new Error(`No built page at ${r}`)
  return found
}
const countOf = (s, needle) => s.split(needle).length - 1
const visible = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')

for (const c of categories) {
  const html = visible(page(`/gear/${c.slug}`).html)
  const chunks = html.split('data-subgroup="').slice(1)
  if (chunks.length !== c.subgroups.length) failures.push(`/gear/${c.slug}: ${chunks.length} subgroup sections, ${c.subgroups.length} declared`)
  let cards = 0
  for (const chunk of chunks) {
    const body = chunk.split('data-subgroup="')[0].split('class="faq"')[0]
    const id = chunk.slice(0, chunk.indexOf('"'))
    const printed = Number((body.match(/data-count="(\d+)"/) ?? [])[1])
    const rendered = countOf(body, 'data-product-card="')
    cards += rendered
    if (printed !== rendered) failures.push(`/gear/${c.slug}#${id}: label says ${printed}, ${rendered} cards rendered`)
    if (printed !== cat.inSubgroup(c.slug, id).length) failures.push(`/gear/${c.slug}#${id}: label says ${printed}, data holds ${cat.inSubgroup(c.slug, id).length}`)
    const table = body.includes('data-compare-table=""')
    if (rendered >= 2 && !table) failures.push(`/gear/${c.slug}#${id}: ${rendered} cards but no comparison table (R3)`)
    if (rendered < 2 && table) failures.push(`/gear/${c.slug}#${id}: comparison table with ${rendered} card (R3)`)
    if (rendered < 2 && !body.includes('data-single-card')) failures.push(`/gear/${c.slug}#${id}: single card without its note`)
    /* R18: a count in a row label agrees with the count column in the same row. */
    for (const row of body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
      const cells = [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/g)].map((m) => stripTags(m[1]))
      const label = cells[0]?.match(/(\d+)-(tier|drawer|cube)/)
      const unitCell = cells.find((x, i) => i > 0 && /^\d+ (tiers|drawers|cubes)/.test(x))
      if (label && unitCell && Number(unitCell.match(/^\d+/)[0]) !== Number(label[1])) failures.push(`/gear/${c.slug}: row "${cells[0]}" vs count "${unitCell}"`)
    }
  }
  const total = products.filter((p) => p.category === c.slug).length
  if (cards !== total) failures.push(`/gear/${c.slug}: ${cards} cards rendered, category holds ${total}`)
}
notes.push('gear pages: subgroup counts equal rendered cards and data; R3 holds on both branches; row labels agree with count columns')

const home = page('/')
const hv = visible(home.html)
for (const w of words) {
  const row = hv.match(new RegExp(`data-word-row="${w.slug}" data-used="(\\d+)" data-also="(\\d+)"`))
  if (!row || Number(row[1]) !== cat.usedBy(w.slug).length || Number(row[2]) !== cat.alsoStating(w.slug).length) failures.push(`home ledger row ${w.slug}: ${row?.slice(1)}`)
}
for (const n of numbers) {
  const row = hv.match(new RegExp(`data-number-row="${n.slug}" data-stating="(\\d+)" data-silent="(\\d+)"`))
  if (!row || Number(row[1]) !== cat.stating(n.slug).length || Number(row[2]) !== cat.silent(n.slug).length) failures.push(`home numbers row ${n.slug}: ${row?.slice(1)}`)
}
for (const m of hv.matchAll(/data-strip-key="([^"]+)" data-value="(\d+)"/g)) {
  if (Number(m[2]) !== cat.lookup(m[1])) failures.push(`home strip ${m[1]}: ${m[2]} vs ${cat.lookup(m[1])}`)
}
if (countOf(hv, 'data-strip-key=') !== 4) failures.push('home strip does not hold four numbers')
const listCount = (layout, tag) => {
  const sec = hv.split(`data-section-layout="${layout}"`)[1]?.split('</section>')[0] ?? ''
  const m = sec.match(new RegExp(`<${tag}[^>]*data-count="(\\d+)"`))
  const inner = sec.split(new RegExp(`<${tag}[^>]*data-count="\\d+"[^>]*>`))[1]?.split(`</${tag}>`)[0] ?? ''
  return { printed: Number(m?.[1]), items: countOf(inner, '<li') }
}
for (const [layout, tag] of [['card-grid-3x2', 'ul'], ['snap-carousel', 'ol'], ['photo-plus-contents', 'ul']]) {
  const { printed, items } = listCount(layout, tag)
  if (printed !== items) failures.push(`home ${layout}: data-count ${printed}, ${items} items`)
}
const rail = hv.split('data-section-layout="product-rail"')[1].split('</section>')[0]
const railCount = Number(rail.match(/data-count="(\d+)"/)?.[1])
if (railCount !== countOf(rail, 'data-affiliate=""') || railCount !== categories.length) failures.push(`home rail: heading ${railCount}, ${countOf(rail, 'data-affiliate=""')} listings`)
const strip = `${cat.cap(cat.numberWord(words.length))} words · ${products.length} listings · 2026`
if (!home.text.includes(strip)) failures.push(`home strip does not read "${strip}"`)
const noDims = stripTags(hv.split('data-no-dims-statement=""')[1]?.split('</p>')[0] ?? '')
const wantNoDims = `${cat.numberWord(cat.silent('assembled-dimensions', 'chairs').length)} chairs and ${cat.numberWord(cat.silent('assembled-dimensions', 'dressers').length)} dressers`
if (!noDims.includes(wantNoDims)) failures.push(`home no-dimensions statement does not read "${wantNoDims}"`)
notes.push('home: ledger rows, numbers table, strip, card grid, carousel, contents list and rail counts equal the data and the rendered items')

for (const w of words) {
  const html = visible(page(`/words/${w.slug}`).html)
  const beam = html.match(/data-tilt-beam="word-header" data-left="(\d+)" data-right="(\d+)"/)
  if (!beam || Number(beam[1]) !== w.usedBy.length || Number(beam[2]) !== w.alsoStatingNumber.length) failures.push(`/words/${w.slug}: beam ${beam?.slice(1)}`)
  const lists = [...html.matchAll(/<ul class="[^"]*" data-count="(\d+)">([\s\S]*?)<\/ul>/g)]
  for (const l of lists) if (Number(l[1]) !== countOf(l[2], '<li')) failures.push(`/words/${w.slug}: list data-count ${l[1]}, ${countOf(l[2], '<li')} items`)
  for (const m of html.matchAll(/data-where="([^"]+)" data-value="(\d+)"/g)) if (Number(m[2]) !== cat.usedBy(w.slug, m[1]).length) failures.push(`/words/${w.slug}: where ${m[1]} ${m[2]}`)
}
for (const n of numbers) {
  const html = visible(page(`/numbers/${n.slug}`).html)
  const railM = html.match(/data-rail="" data-stating="(\d+)" data-silent="(\d+)"/)
  if (!railM || Number(railM[1]) !== cat.stating(n.slug).length || Number(railM[2]) !== cat.silent(n.slug).length) failures.push(`/numbers/${n.slug}: rail ${railM?.slice(1)}`)
  const beam = html.match(/data-tilt-beam="number-header" data-left="(\d+)" data-right="(\d+)"/)
  if (!beam || Number(beam[1]) !== cat.stating(n.slug).length || Number(beam[2]) !== cat.numberWordSide(n.slug).users.length) failures.push(`/numbers/${n.slug}: beam ${beam?.slice(1)}`)
  const table = html.split('id="claimants"')[1].split('</section>')[0]
  const printed = Number(table.match(/data-count="(\d+)"/)?.[1])
  if (printed !== cat.stating(n.slug).length || (printed > 0 && countOf(table, '<tr') - 1 !== printed)) failures.push(`/numbers/${n.slug}: claimants ${printed}`)
}
for (const p of pieces) {
  const html = visible(page(`/pieces/${p.slug}`).html)
  const m = html.match(/data-lean-word="([^"]+)" data-lean-count="(\d+)"/)
  if (!m || m[1] !== cat.leanWord(p.category) || Number(m[2]) !== cat.usedBy(m[1], p.category).length) failures.push(`/pieces/${p.slug}: lean ${m?.slice(1)}`)
}
/* Index pages: the printed count against a marker each item carries once (plates hold nested lists, so <li> cannot be counted). */
const INDEX_ITEMS = {
  '/numbers': (h) => countOf(h, 'data-number-card="'),
  '/gear': (h) => countOf(h, 'data-plate="'),
  '/pieces': (h) => countOf(h.split(/<ul[^>]*data-count="\d+"[^>]*>/)[1]?.split('</ul>')[0] ?? '', '<li'),
  '/tools': (h) => countOf(h.split(/<ul[^>]*data-count="\d+"[^>]*>/)[1]?.split('</ul>')[0] ?? '', '<li'),
  '/words': (h) => countOf(h.split(/<dl[^>]*data-count="\d+"[^>]*>/)[1]?.split('</dl>')[0] ?? '', '<dt'),
}
for (const [route, itemsOf] of Object.entries(INDEX_ITEMS)) {
  const html = visible(page(route).html)
  const printed = Number(html.match(/<(?:ul|dl)[^>]*data-count="(\d+)"/)?.[1])
  const items = itemsOf(html)
  if (!printed || printed !== items) failures.push(`${route}: data-count ${printed}, ${items} items`)
}
const g = visible(page('/glossary').html)
if (Number(g.match(/<dl[^>]*data-count="(\d+)"/)?.[1]) !== countOf(g, '<dt')) failures.push('/glossary: count and terms differ')
if (glossary.length !== 24) failures.push(`glossary holds ${glossary.length} terms, 24 required`)
const linked = glossary.filter((x) => x.links.length > 0).length
if (linked < 12) failures.push(`only ${linked} glossary terms are cross-linked`)
for (const slug of ['weight-capacity', 'shelf-load']) if (!/\d|one|two|three|four|five|no /i.test(fill(glossary.find((x) => x.slug === slug).definition))) failures.push(`glossary ${slug}: no catalog count`)
if (!/no instructions for fitting/i.test(fill(glossary.find((x) => x.slug === 'anti-tip-hardware').definition))) failures.push('glossary anti-tip hardware: no statement that the site gives no fitting instructions')
notes.push(`word, number and piece pages match the data; indexes count their items; glossary ${glossary.length} terms, ${linked} linked`)

process.exit(report('R14 · R18 · badges, typed numbers, rendered counts', failures, notes))
