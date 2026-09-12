import fs from 'node:fs'
import path from 'node:path'
import { ROOT, decode, load, pages, report, stripTags, walk, withoutSellerQuotes } from './lib.mjs'

/*
 * Post-build text audit on stripTags(html) (R25). Every R24 rule runs on a
 * planted fixture first and must fire, so a silent pass cannot come from a
 * broken pattern.
 */

const failures = []
const notes = []
const control = (name, pattern, fixture) => {
  pattern.lastIndex = 0
  if (!pattern.test(fixture)) failures.push(`Negative control failed for ${name}: pattern did not fire on "${fixture}"`)
  pattern.lastIndex = 0
}

const { products } = await load('data/products.ts')
const { registry, NAV } = await load('lib/routes.ts')
const { photos } = await load('data/photos.ts')
const { wall } = await load('data/wall.ts')
const built = pages()
const byRoute = Object.fromEntries(built.map((p) => [p.route, p]))
const routes = new Set(built.map((p) => p.route))
notes.push(`${built.length} pages, each with at least 200 characters of stripped text`)

const productNames = products.map((p) => p.name).sort((a, b) => b.length - a.length)
const withoutNames = (t) => productNames.reduce((s, n) => s.split(n).join(' '), t)
const bodyHtml = (html) =>
  html
    .replace(/<header[\s\S]*?<\/header>/, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/, ' ')
    .replace(/<div id="mobile-menu"[\s\S]*?<\/nav><\/div>/, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
const outsideQuotes = (p) => withoutNames(stripTags(withoutSellerQuotes(bodyHtml(p.html))))

/* ---------- source and built CSS ---------- */
const sourceFiles = ['app', 'components', 'lib', 'data'].flatMap((d) => walk(path.join(ROOT, d))).filter((f) => /\.(tsx?|css)$/.test(f))
const cssFiles = walk(path.join(ROOT, '.next', 'static'), '.css')
const allCss = cssFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
for (const f of sourceFiles) {
  const src = fs.readFileSync(f, 'utf8')
  const rel = path.relative(ROOT, f)
  if (/\bdark:/.test(src)) failures.push(`${rel}: dark: class`)
  if (/backdrop-(blur|filter)/.test(src)) failures.push(`${rel}: backdrop filter`)
  if (/\b(TODO|lorem|Content pending)\b/i.test(src)) failures.push(`${rel}: TODO / lorem / Content pending`)
  if (/localStorage|sessionStorage/.test(src)) failures.push(`${rel}: browser storage`)
  if (/IntersectionObserver/.test(src)) failures.push(`${rel}: IntersectionObserver`)
  if (/<legend|<fieldset/.test(src)) failures.push(`${rel}: fieldset or legend`)
  if (/darkMode/.test(src)) failures.push(`${rel}: darkMode setting`)
  if (/framer-motion|gsap|@react-spring/.test(src)) failures.push(`${rel}: animation library`)
}
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
if (!pkg.dependencies?.sharp) failures.push('sharp is not in dependencies')
if (!/^\^16\./.test(pkg.dependencies?.next ?? '')) failures.push(`next is ${pkg.dependencies?.next}`)
const nextConfig = fs.readFileSync(path.join(ROOT, 'next.config.mjs'), 'utf8')
if (/output:\s*['"]export['"]/.test(nextConfig)) failures.push('next.config uses output: export')
if (!nextConfig.includes('deviceSizes: [256, 384, 640, 750, 828, 1080, 1200, 1920]')) failures.push('deviceSizes not as required')
const gitignore = fs.existsSync(path.join(ROOT, '.gitignore')) ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8') : ''
for (const entry of ['node_modules/', '.next/', 'out/', 'build/', '.DS_Store', '*.pem', '.env*.local', '.vercel', '*.tsbuildinfo', 'next-env.d.ts']) {
  if (!gitignore.split('\n').includes(entry)) failures.push(`.gitignore lacks ${entry}`)
}

control('gradient', /gradient\(/, '.x{background:linear-gradient(red,blue)}')
if (/gradient\(/.test(allCss)) failures.push('built CSS contains a gradient')
if (/text-shadow:/.test(allCss)) failures.push('built CSS contains text-shadow')
for (const m of allCss.matchAll(/box-shadow:([^;}]+)/g)) {
  if (!/^\s*(none|var\(--tw-ring-offset-shadow[^)]*\)\s*,\s*var\(--tw-ring-shadow[^)]*\)\s*,\s*var\(--tw-shadow[^)]*\))\s*$/.test(m[1])) failures.push(`built CSS box-shadow: ${m[1]}`)
}
if (/drop-shadow\(/.test(allCss)) failures.push('built CSS contains drop-shadow')
if (/backdrop-filter/.test(allCss)) failures.push('built CSS contains backdrop-filter')
if (/opacity:\s*0(?![.\d])/.test(allCss)) failures.push('built CSS contains opacity:0')
if (/prefers-color-scheme/.test(allCss)) failures.push('built CSS contains a color-scheme media query')
notes.push(`${sourceFiles.length} source files and ${cssFiles.length} built CSS files: no dark:, backdrop, storage, legend, gradient, glow or opacity 0`)

/* ---------- motion ---------- */
const keyframes = new Set([...allCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))
const ALLOWED_KEYFRAMES = new Set(['beam-settle'])
for (const k of keyframes) if (!ALLOWED_KEYFRAMES.has(k)) failures.push(`@keyframes ${k} is not on the allowed list`)
for (const k of ALLOWED_KEYFRAMES) if (!keyframes.has(k)) failures.push(`allowed @keyframes ${k} missing from built CSS`)
const animations = new Set([...allCss.matchAll(/animation(?:-name)?:\s*([\w-]+)/g)].map((m) => m[1]).filter((n) => !/^\d|^none$/.test(n)))
for (const a of animations) if (!ALLOWED_KEYFRAMES.has(a)) failures.push(`animation ${a} is not on the allowed list`)
const reduced = allCss.match(/@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\}\s*\}/)?.[0] ?? ''
for (const prop of ['animation-duration', 'transition-duration', 'animation-iteration-count']) {
  if (!reduced.includes(prop)) failures.push(`prefers-reduced-motion block does not neutralize ${prop}`)
}
if (/parallax|scroll-timeline|animation-timeline|infinite/.test(allCss)) failures.push('scroll-driven, parallax or infinite motion in built CSS')
notes.push(`keyframes in built CSS: ${[...keyframes].join(', ')} (allowed list matches); reduced motion neutralizes duration, transitions and iteration count`)

/* ---------- R10 ---------- */
const ROOTS = /(colour|centre|favour|licence|draught|metre|analogue|mould|neighbour|tyre|aluminium|harbour|catalogue|fibre|flavour|behaviour|programme|cheque|grey|defence|jewellery|storey|pyjama|plough|kerb|whilst|armour|honour|cosy|practise)/i
const ISE = /\b(organi[sz]e[sd]?|reali[sz]e[sd]?|recogni[sz]e[sd]?|apologi[sz]e|customi[sz]e[sd]?|customi[sz]able|optimi[sz]e[sd]?|standardi[sz]ed?|prioriti[sz]e|minimi[sz]e|maximi[sz]e|summari[sz]e|emphasi[sz]e|categori[sz]e[sd]?|utili[sz]e|finali[sz]e|analy[sz]e[sd]?|travelled|labelled|cancelled|modelled|levelled|fuelled|signalled|totalled|organisers?)\b/gi
control('R10 roots', ROOTS, 'the colour of it')
control('R10 -ise', ISE, 'a customisable top')
for (const p of built) {
  const t = withoutNames(p.text)
  const r = t.match(ROOTS)
  if (r) failures.push(`${p.route}: British root "${r[0]}" near "${t.slice(Math.max(0, r.index - 30), r.index + 30)}"`)
  for (const m of t.matchAll(ISE)) if (/is(e|ed|es|able|ers?)\b|ys|elled/i.test(m[0])) failures.push(`${p.route}: British form "${m[0]}"`)
}
notes.push('R10: roots by substring and -ise/-elled by word boundary on stripped text, product names excluded')

/* ---------- visible entities ---------- */
for (const p of built) {
  const m = p.text.match(/&(apos|amp|quot|#\d+|#x[0-9a-f]+|[a-z]+);/i)
  if (m) failures.push(`${p.route}: entity "${m[0]}" left in visible text`)
  const raw = bodyHtml(p.html).replace(/<[^>]+>/g, ' ')
  if (/&apos;/.test(raw)) failures.push(`${p.route}: &apos; in the HTML body`)
}

/* ---------- generic banned text ---------- */
const BANNED = [
  ['lorem / placeholder / Content pending', /\b(lorem|ipsum|placeholder|content pending)\b/i, 'lorem ipsum'],
  ['testing claims', /\b(we tested|we assembled|our office|we tried|in our testing|hands-on|we sat)\b/i, 'we assembled it'],
  ['rank N', /\brank\s*\d+/i, 'Rank 4'],
  ['prices', /\$\s?\d|\bon sale\b|\bdiscount\b/i, 'only $199'],
  ['ratings', /\b\d(\.\d)? (out of 5|stars)\b|\brated \d/i, '4.5 stars'],
]
for (const [name, re, fixture] of BANNED) {
  control(name, re, fixture)
  for (const p of built) {
    const m = p.text.match(re)
    if (m) failures.push(`${p.route}: ${name}: "${m[0]}"`)
  }
}
notes.push('no lorem, testing claims, rank N, prices or ratings in any page text')

/* ---------- R24 ---------- */
const sentencesOf = (t) => t.split(/(?<=[.!?])\s+/)
const NEGATED = /\b(not|no|nothing|never|none|neither|nor|without|does not|do not|cannot)\b/i
const R24 = [
  ['stability or strength assessments', /\b(will hold|can hold|holds up to|supports up to|stable enough|safe to|guaranteed|won'?t tip|will not tip|is stable|are stable|very sturdy|sturdier|built to last|rock[- ]solid)\b/i, 'this rack is stable enough and will hold'],
  ['missing figure read as weakness', /\b(weaker|flimsier|less sturdy|lower quality|inferior|cheaply made|flimsy)\b/i, 'a flimsy rack'],
  ['assembly, wall or drilling instructions', /\b(to assemble|attach the|screw (it|the)|tighten|drill (a|the|into)|pilot hole|wall anchor|anchor (it|the)|into a stud|find a stud|mount it|use the (included )?strap)\b/i, 'drill a pilot hole into a stud'],
  ['health words', /\b(posture|spine|spinal|back pain|circulation|fatigue|health|healthy|pain relief|orthopedic)\b/i, 'good for posture and back pain'],
  ['desk height, sitting or standing advice', /\b(elbow|eye level|elbows?|hours? a day|minutes? a day|sit for|stand for|standing is better|alternate between sitting|wrists?)\b/i, 'keep your elbows at desk height'],
  ['children and teen words', /\b(child|children|kids?|toddlers?|nursery|youth|teens?|teenagers?|dorms?|students?|baby|babies)\b/i, 'great for kids in a dorm'],
  ['electrical conclusions', /\b(unsafe|safe to use|fire hazard|fire risk|certified safe|overload|extension cords?|power strips?|surge)\b/i, 'safe to use with a power strip'],
  ['material composition, fumes or smell', /\b(formaldehyde|off-?gas\w*|fumes?|odou?rs?|smells?|emissions?|VOCs?|toxic|solid wood|real wood|particleboard core)\b/i, 'solid wood with no smell'],
  ['recommendations', /\b(we recommend|is recommended|recommended for|ideal for|perfect for|great for|best choice|you should buy|must-have)\b/i, 'ideal for small rooms'],
]
for (const [name, re, fixture] of R24) {
  control(name, re, fixture)
  let hits = 0
  for (const p of built) {
    const t = outsideQuotes(p)
    for (const s of sentencesOf(t)) {
      const m = s.match(re)
      if (!m) continue
      /* A negated or questioned mention is the site saying it will not do the thing, not doing it. */
      const allowed = (name === 'stability or strength assessments' || name === 'missing figure read as weakness' || name === 'electrical conclusions') && (NEGATED.test(s) || s.trim().endsWith('?'))
      if (allowed) continue
      if (name === 'material composition, fumes or smell' && /particleboard|fiberboard/i.test(s) && /\bdefine\b|\bterm\b/i.test(s)) continue
      hits += 1
      failures.push(`${p.route}: ${name}: "${s.slice(0, 160)}"`)
    }
  }
  if (hits === 0) notes.push(`R24 ${name}: 0 outside seller quotes (control fired)`)
}

/* Imperatives addressed to the reader, sentence-initial, in running text. */
const IMPERATIVE = /^(Anchor|Attach|Drill|Mount|Secure|Install|Screw|Tighten|Assemble|Check|Make sure|Avoid|Use|Keep|Remove|Measure|Choose|Pick|Buy|Consider|Look|Don['’]t|Do not|Never|Always|Set|Adjust|Sit|Stand|Plug|Unplug|Contact|Call|Read|Open|See|Try|Place|Put|Follow|Ask|Hire)\b/
control('imperative', IMPERATIVE, 'Drill into the stud.')
let imperatives = 0
for (const p of built) {
  const html = withoutSellerQuotes(bodyHtml(p.html))
  for (const m of html.matchAll(/<(p|li|dd|td|figcaption|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const t = stripTags(m[2])
    for (const s of sentencesOf(t)) {
      if (IMPERATIVE.test(s.trim())) {
        imperatives += 1
        failures.push(`${p.route}: imperative addressed to the reader: "${s.slice(0, 100)}"`)
      }
    }
  }
}
if (imperatives === 0) notes.push('imperatives addressed to the reader in running text: 0 (control fired)')

/* Positive controls: the quotes carrying these words exist and are marked. */
if (!/<q[^>]*data-seller-words=""[^>]*>a dorm or teen room<\/q>/.test(byRoute['/gear/bookcases'].html)) failures.push('Positive control: the quoted dorm phrase on the bookcase card is missing or unmarked')
for (const p of built) {
  const quotes = (p.html.match(/data-seller-words=""/g) ?? []).length
  const markers = (p.html.match(/data-seller-block=""/g) ?? []).length
  if (quotes > 0 && markers === 0) failures.push(`${p.route}: seller quotes without the visible seller marker`)
}
notes.push('every page with seller quotes carries the visible marker; the dorm phrase exists only as a marked quote')

/* CPSC exactly once, on the anti-tip page. */
const cpsc = built.flatMap((p) => [...p.html.matchAll(/href="https?:\/\/(www\.)?cpsc\.gov[^"]*"/g)].map(() => p.route))
if (cpsc.length !== 1 || cpsc[0] !== '/words/anti-tip') failures.push(`CPSC is linked ${cpsc.length} times: ${cpsc.join(', ')}`)
else notes.push('CPSC linked exactly once, on /words/anti-tip')

/* Tip-over band above the first product link on the home page, by DOM order. */
const home = byRoute['/']
const band = home.html.indexOf('data-section-layout="bordered-band"')
const firstProduct = Math.min(...['amazon.com/dp/', '#listing-'].map((n) => home.html.indexOf(n)).filter((i) => i > -1))
if (!(band > -1 && band < firstProduct)) failures.push('home: the tip-over band is not above the first product link')
else notes.push('home: tip-over band sits above the first product link in DOM order')
const bandText = stripTags(home.html.split('data-section-layout="bordered-band"')[1].split('</section>')[0])
if (!/Tall furniture can tip over/.test(bandText) || !/does not assess/.test(bandText) || !/no instructions/.test(bandText)) failures.push('home: tip-over band text incomplete')

/* Electric desks: the missing UL/ETL listing is recorded as an absence, with no conclusion. */
const desks = byRoute['/gear/desks']
if (!/names a UL or ETL listing; the site notes that as not stated and draws no conclusion from it in either direction/.test(desks.text)) failures.push('/gear/desks: the UL or ETL absence statement is missing')
for (const p of products.filter((x) => x.powered)) {
  if (!new RegExp(`data-safety-note=""[^>]*>${p.shortLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(desks.html)) failures.push(`/gear/desks: no UL/ETL note on ${p.shortLabel}`)
}
notes.push('UL/ETL absence stated on /gear/desks and noted on every powered desk card, no conclusion drawn')

/* Dressers that also call themselves a nightstand or TV stand carry the note on their card. */
const dressers = byRoute['/gear/dressers']
for (const p of products.filter((x) => x.alsoCalled)) {
  const card = dressers.html.split(`data-product-card="${p.asin}"`)[1]?.split('data-product-card="')[0] ?? ''
  if (!card.includes('data-note=""') || !stripTags(card).includes(`also calls itself a ${p.alsoCalled.as}`)) failures.push(`/gear/dressers: ${p.asin} has no dual-name note`)
}
notes.push(`${products.filter((x) => x.alsoCalled).length} dual-name dressers carry the note on their card`)

/* The plain no-dimensions statement, computed. */
for (const route of ['/', '/gear']) if (!byRoute[route].html.includes('data-no-dims-statement')) failures.push(`${route}: the chairs-and-dressers dimensions statement is missing`)

/* Word Wall: exactly one figure, every word marked as seller words, no photo. */
const wallHtml = home.html.split('data-section-layout="word-wall"')[1].split('</section>')[0]
if (countIn(wallHtml, 'data-wall-figure=""') !== 1) failures.push('Word Wall: not exactly one figure')
const wallWords = [...wallHtml.split('data-word-wall=""')[1].split('</div>')[0].matchAll(/<q\b([^>]*)>([^<]*)<\/q>/g)]
if (wallWords.length !== wall.length) failures.push(`Word Wall renders ${wallWords.length} words, data holds ${wall.length}`)
for (const w of wallWords) if (!/data-seller-words=""/.test(w[1])) failures.push(`Word Wall: "${w[2]}" is not marked as seller words`)
if (!wallHtml.includes('data-seller-block=""')) failures.push('Word Wall: no visible seller marker')
if (/<img\b/.test(wallHtml)) failures.push('Word Wall carries a photo')
notes.push(`Word Wall: ${wallWords.length} marked seller words, one figure, no photo`)

function countIn(s, needle) {
  return s.split(needle).length - 1
}

/* ---------- SEO ---------- */
const TITLE = /^(.+), 2026 \| LivingFurnishTide$/
for (const p of built) {
  const title = decode(p.html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
  if (!TITLE.test(title)) failures.push(`${p.route}: title "${title}" does not follow "phrase, 2026 | LivingFurnishTide"`)
  if (title.split('| LivingFurnishTide').length !== 2) failures.push(`${p.route}: suffix count wrong in "${title}"`)
  if (title.trim() === 'LivingFurnishTide') failures.push(`${p.route}: title equals the bare site name`)
  const h1 = (p.html.match(/<h1[\s>]/g) ?? []).length
  if (h1 !== 1) failures.push(`${p.route}: ${h1} h1 elements`)
  const canonical = p.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const og = p.html.match(/<meta property="og:url" content="([^"]+)"/)?.[1]
  if (!canonical || canonical !== og) failures.push(`${p.route}: canonical ${canonical} vs og:url ${og}`)
  const want = p.route === '/' ? 'https://livingfurnishtide.com' : `https://livingfurnishtide.com${p.route}`
  if (canonical !== want) failures.push(`${p.route}: canonical is ${canonical}, expected ${want}`)
  const desc = decode(p.html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
  if (desc.length < 140 || desc.length > 160) failures.push(`${p.route}: description is ${desc.length} characters`)
  if (p.text.includes(desc)) failures.push(`${p.route}: description is copied from the body text`)
}
notes.push('titles "phrase, 2026 | LivingFurnishTide", one h1, canonical = og:url, description 140–160 and not body text, on every page')
const faqPages = built.filter((p) => /"@type":"FAQPage"/.test(p.html)).map((p) => p.route)
if (faqPages.length !== 5 || !faqPages.every((r) => r.startsWith('/gear/'))) failures.push(`FAQPage JSON-LD on ${faqPages.join(', ')}`)

/* ---------- links (R12, R13) ---------- */
const reg = registry()
const ids = Object.fromEntries(built.map((p) => [p.route, new Set([...p.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]))
let internal = 0
let affiliate = 0
for (const p of built) {
  for (const m of p.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = m[1]
    const href = decode(attrs.match(/href="([^"]*)"/)?.[1] ?? '')
    const text = stripTags(m[2])
    if (href.startsWith('/')) {
      internal += 1
      const [pathPart, hash] = href.split('#')
      if (!routes.has(pathPart)) failures.push(`${p.route}: link to missing page ${href}`)
      else if (hash && !ids[pathPart].has(hash)) failures.push(`${p.route}: link to missing anchor ${href}`)
      if (href !== '/' && !/data-pagelink/.test(attrs)) failures.push(`${p.route}: internal link to ${href} not built by PageLink ("${text}")`)
      if (/data-pagelink/.test(attrs) && reg.get(href) !== text) failures.push(`${p.route}: link ${href} reads "${text}", target title is "${reg.get(href)}"`)
    } else if (href.startsWith('#')) {
      if (!ids[p.route].has(href.slice(1))) failures.push(`${p.route}: in-page link to missing ${href}`)
    } else if (/amazon\.com\/dp\//.test(href)) {
      affiliate += 1
      const rel = attrs.match(/rel="([^"]*)"/)?.[1] ?? ''
      if (rel !== 'nofollow sponsored noopener') failures.push(`${p.route}: Amazon link rel="${rel}"`)
      if (!/^https:\/\/www\.amazon\.com\/dp\/B0[A-Z0-9]{8}\?tag=YOURTAG-20$/.test(href)) failures.push(`${p.route}: malformed affiliate link ${href}`)
    }
  }
}
notes.push(`${internal} internal links resolve to built pages and anchors and read their target title; ${affiliate} affiliate links well formed`)
for (const href of NAV) {
  if (!routes.has(href)) failures.push(`nav item ${href} has no page`)
  const h1 = stripTags(byRoute[href]?.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
  if (h1 !== reg.get(href)) failures.push(`nav item ${href}: page h1 "${h1}" is not "${reg.get(href)}"`)
}
notes.push(`nav ${NAV.join(' · ')}: every item has a page whose h1 is its title`)

/* ---------- affiliate coverage, images, disclosures ---------- */
const gearHtml = built.filter((p) => p.route.startsWith('/gear/')).map((p) => p.html).join('\n')
for (const p of products) {
  if (!gearHtml.includes(`href="https://www.amazon.com/dp/${p.asin}?tag=YOURTAG-20"`)) failures.push(`${p.asin}: no affiliate link on its gear page`)
  if (!gearHtml.includes(encodeURIComponent(p.imageUrl))) failures.push(`${p.asin}: image not rendered through next/image`)
}
for (const p of built) {
  if (/[?&;]w=3840/.test(p.html)) failures.push(`${p.route}: w=3840 in srcset`)
  for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
    if (/srcset=/.test(m[0]) && !/sizes="/.test(m[0])) failures.push(`${p.route}: next/image without sizes`)
    if (/media-amazon/.test(m[0])) {
      const parent = p.html.slice(Math.max(0, m.index - 400), m.index)
      if (!/class="plate[ "]/.test(parent)) failures.push(`${p.route}: product image without its light plate`)
    }
  }
  const hasAffiliate = /amazon\.com\/dp\//.test(p.html)
  const disclosures = [...p.html.matchAll(/data-disclosure="(\w+)"/g)].map((d) => d[1])
  if (p.route.startsWith('/gear/') && disclosures.join(',') !== 'top,bottom') failures.push(`${p.route}: disclosures ${disclosures}`)
  if (p.route === '/' && disclosures.join(',') !== 'home') failures.push(`home: disclosures ${disclosures}`)
  if (hasAffiliate && disclosures.length === 0) failures.push(`${p.route}: affiliate links without a disclosure`)
}
notes.push(`${products.length} products linked and imaged through the optimizer with sizes, on light plates; disclosures top and bottom on gear, one on home`)

/* ---------- R4 ---------- */
for (const p of built) {
  for (const ol of p.html.matchAll(/<ol\b[\s\S]*?<\/ol>/g)) {
    for (const li of ol[0].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)) {
      if (/^\s*\d+[.)]\s/.test(stripTags(li[1]))) failures.push(`${p.route}: manual number inside <ol>: "${stripTags(li[1]).slice(0, 40)}"`)
    }
  }
}

/* ---------- R26 layouts, Joint Rule, Tilt Beam, photos ---------- */
const layouts = [...home.html.matchAll(/data-section-layout="([^"]+)"/g)].map((m) => m[1])
if (layouts.length < 14) failures.push(`home has ${layouts.length} sections`)
if (layouts[0] !== 'word-wall') failures.push(`home opens with ${layouts[0]}`)
layouts.forEach((l, i) => i > 0 && l === layouts[i - 1] && failures.push(`home sections ${i} and ${i + 1} share the layout ${l}`))
if (new Set(layouts).size < 8) failures.push(`home uses only ${new Set(layouts).size} distinct layouts`)
notes.push(`home: ${layouts.length} sections, ${new Set(layouts).size} distinct layouts: ${layouts.join(' → ')}`)

const joints = [...home.html.matchAll(/<div[^>]*data-joint-rule=""[^>]*>/g)].map((m) => m[0])
if (joints.length !== 3) failures.push(`home has ${joints.length} Joint Rules`)
for (const j of joints) if (!/aria-hidden="true"/.test(j)) failures.push('a Joint Rule is not aria-hidden')
const jointAfter = home.html.split(/data-joint-rule=""/).slice(0, -1).map((chunk) => [...chunk.matchAll(/data-section-layout="([^"]+)"/g)].pop()?.[1])
if (jointAfter.join(',') !== 'card-grid-3x2,wide-table,photo-plus-contents') failures.push(`Joint Rules sit after ${jointAfter.join(', ')}`)
for (const p of built) if (p.route !== '/' && /data-joint-rule/.test(p.html)) failures.push(`${p.route}: Joint Rule outside the home page`)
notes.push('Joint Rule exactly three times on home, aria-hidden, between sections 4|5, 8|9 and 12|13')

const beamPlaces = new Map()
for (const p of built) {
  for (const m of p.html.matchAll(/<figure[^>]*data-tilt-beam="([^"]+)" data-left="(\d+)" data-right="(\d+)"[^>]*>([\s\S]*?)<\/figure>/g)) {
    beamPlaces.set(m[1], [...(beamPlaces.get(m[1]) ?? []), p.route])
    const left = m[4].match(/data-pan="left">(\d+)</)?.[1]
    const right = m[4].match(/data-pan="right">(\d+)</)?.[1]
    if (left !== m[2] || right !== m[3]) failures.push(`${p.route}: Tilt Beam ${m[1]} does not print both counts beside it`)
    const sentence = stripTags(m[4].split('data-beam-sentence=""')[1] ?? '')
    if (!sentence.includes(`(${m[2]})`) || !sentence.includes(`(${m[3]})`)) failures.push(`${p.route}: Tilt Beam sentence lacks the counts in digits`)
    if (!/aria-hidden="true"/.test(m[4].split('</svg>')[0])) failures.push(`${p.route}: Tilt Beam drawing is not aria-hidden`)
  }
}
const placeRoutes = { 'word-header': /^\/words\/[^/]+$/, 'word-check': /^\/(word-check)?$/, 'number-header': /^\/numbers\/[^/]+$/ }
for (const [place, list] of beamPlaces) {
  if (!placeRoutes[place]) failures.push(`Tilt Beam used in an unlisted place: ${place}`)
  else for (const r of list) if (!placeRoutes[place].test(r)) failures.push(`Tilt Beam ${place} on ${r}`)
}
if (beamPlaces.size !== 3) failures.push(`Tilt Beam appears in ${beamPlaces.size} kinds of place`)
notes.push(`Tilt Beam in exactly three kinds of place (${[...beamPlaces.keys()].join(', ')}), each with both counts in digits beside it and in the sentence`)

const templateLayout = (re) => new Set(built.filter((p) => re.test(p.route)).map((p) => p.html.match(/data-page-layout="([^"]+)"/)?.[1]))
const tl = [/^\/words\/.+/, /^\/numbers\/.+/, /^\/pieces\/.+/, /^\/gear\/.+/].map((re) => [String(re), [...templateLayout(re)]])
for (const [x, set] of tl) if (set.length !== 1) failures.push(`${x} pages use ${set.length} root layouts`)
if (new Set(tl.map(([, s]) => s[0])).size !== 4) failures.push(`template root layouts are not pairwise different: ${tl.map(([x, s]) => `${x}=${s[0]}`)}`)
const indexLayouts = ['/words', '/numbers', '/pieces', '/gear'].map((r) => byRoute[r].html.match(/data-page-layout="([^"]+)"/)?.[1])
if (new Set(indexLayouts).size !== 4) failures.push(`index layouts repeat: ${indexLayouts}`)
notes.push(`templates: ${tl.map(([, s]) => s[0]).join(', ')}; indexes: ${indexLayouts.join(', ')}`)

const photoIds = new Set(built.flatMap((p) => [...p.html.matchAll(/data-photo="([^"]+)"/g)].map((m) => m[1])))
for (const id of Object.keys(photos)) if (!photoIds.has(id)) failures.push(`photo slot ${id} not rendered`)
for (const p of built) {
  for (const fig of p.html.matchAll(/<figure[^>]*data-photo="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)) {
    if (!/Photo: .+ on Pexels/.test(stripTags(fig[2]))) failures.push(`${p.route}: photo ${fig[1]} without credit`)
    const imageBox = fig[2].split('<figcaption')[0]
    if (stripTags(imageBox).length > 0) failures.push(`${p.route}: text inside the image box of ${fig[1]}`)
  }
}
for (const ph of Object.values(photos)) if (!ph.credit || !/^https:\/\/www\.pexels\.com\/@/.test(ph.creditUrl)) failures.push(`photo ${ph.id}: credit or creditUrl missing`)
if (!byRoute['/pieces'].html.includes('data-photo="spread-pieces"')) failures.push('spread-pieces is not on /pieces')
notes.push('four photo slots rendered with credits and no text over the pixels; spread-pieces on /pieces')

/* ---------- R11 ---------- */
const nameSet = new Set(products.map((p) => p.name))
for (const p of built) {
  const html = withoutSellerQuotes(bodyHtml(p.html))
  const blocks = [...html.matchAll(/<(p|li|dd|td|h2|h3|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => stripTags(m[2])).filter((t) => t.length >= 40 && !nameSet.has(t))
  const seen = new Map()
  for (const b of blocks) seen.set(b, (seen.get(b) ?? 0) + 1)
  for (const [b, n] of seen) if (n > 1) failures.push(`${p.route}: text repeated ${n} times: "${b.slice(0, 90)}"`)
}
notes.push('R11: no text block of 40 or more characters repeats inside a page body')

process.exit(report('R25 · text audit on stripTags(html): R4 R10 R11 R13 R17 R24 R26', failures, notes))
