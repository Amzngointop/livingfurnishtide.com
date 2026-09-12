import fs from 'node:fs'
import path from 'node:path'
import { ROOT, load, walk, report, selfTestStripTags, stripTags } from './lib.mjs'

/*
 * First check of every run (R25): control and invisible characters in the
 * sources, the awkward characters this niche's catalog titles carry, and the
 * stripTags self test. Everything else leans on these passing.
 */

const NAMED = new Map([
  [0x200b, 'ZERO WIDTH SPACE'],
  [0x200c, 'ZERO WIDTH NON-JOINER'],
  [0x200d, 'ZERO WIDTH JOINER'],
  [0x200e, 'LEFT-TO-RIGHT MARK'],
  [0x200f, 'RIGHT-TO-LEFT MARK'],
  [0x2060, 'WORD JOINER'],
  [0x00a0, 'NO-BREAK SPACE'],
  [0xfeff, 'BYTE ORDER MARK'],
  [0x202a, 'LEFT-TO-RIGHT EMBEDDING'],
  [0x202c, 'POP DIRECTIONAL FORMATTING'],
  [0x202e, 'RIGHT-TO-LEFT OVERRIDE'],
  [0x00ad, 'SOFT HYPHEN'],
])

const failures = []
const notes = []
let scanned = 0

const bad = (code) => NAMED.has(code) || (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) || (code >= 0x7f && code <= 0x9f)

for (const dir of ['app', 'components', 'data', 'lib', 'scripts']) {
  for (const file of walk(path.join(ROOT, dir))) {
    if (!/\.(tsx?|mjs|css|json|svg)$/.test(file)) continue
    scanned += 1
    const src = fs.readFileSync(file, 'utf8')
    const lines = src.split('\n')
    lines.forEach((line, i) => {
      for (const ch of line) {
        const code = ch.codePointAt(0)
        if (bad(code)) {
          failures.push(`${path.relative(ROOT, file)}:${i + 1} contains ${NAMED.get(code) ?? `U+${code.toString(16).toUpperCase().padStart(4, '0')}`}`)
        }
      }
    })
    if (dir === 'data' && /&apos;|&#39;|&quot;/.test(src)) failures.push(`${path.relative(ROOT, file)}: raw HTML entity in data`)
  }
}
notes.push(`${scanned} source files scanned for C0/C1 controls and invisible characters`)

/* Negative control: the scanner must catch what it claims to catch. */
const planted = 'a\u200bb\ufeffc\u00a0d\u2060e\u0007f\u0085g'
const caught = [...planted].filter((ch) => bad(ch.codePointAt(0))).length
if (caught !== 6) failures.push(`Negative control: planted 6 bad characters, scanner caught ${caught}`)
else notes.push('negative control: 6 planted characters (ZWSP, BOM, NBSP, WJ, BEL, NEL) caught')

/* The characters this catalog's titles carry must not break any pattern the site runs. */
const { formsRegex, WORD_FORMS } = await load('lib/catalog.ts')
const specimens = [
  { s: 'Sturdy™ Shoe Rack, 360° Swivel', word: 'sturdy', expect: true },
  { s: 'Heavy-Duty • Tool-Free • Stackable', word: 'heavy-duty', expect: true },
  { s: 'Desk 48×24 Inch, Ergonomic', word: 'ergonomic-and-lumbar-support', expect: true },
  { s: 'Kid&apos;s Anti-Tip Dresser', word: 'anti-tip', expect: true },
  { s: 'Rack 27.5" Wide, Space-Saving', word: 'space-saving-and-compact', expect: true },
  { s: "Rack 27.5'' Wide, Expandable", word: 'stackable-and-expandable', expect: true },
  { s: 'Zapateras Organizadoras, Sturdyish', word: 'sturdy', expect: false },
  { s: 'Unstackable ”Pro” Cabinet', word: 'stackable-and-expandable', expect: false },
]
for (const { s, word, expect } of specimens) {
  try {
    const got = formsRegex(WORD_FORMS[word]).test(s)
    if (got !== expect) failures.push(`Word pattern for ${word} read ${got} on "${s}", expected ${expect}`)
  } catch (err) {
    failures.push(`A word pattern broke on "${s}": ${err}`)
  }
}
const INCH = /(\d+(?:\.\d+)?)\s*(?:-|\s)?(?:inches|inch|in\b|''|"|”)/i
for (const [s, want] of [['27.5" Wide', 27.5], ["27.5'' Wide", 27.5], ['17.5 in Wide', 17.5], ['63 Inch', 63], ['9.3 x 12 x 71 in', 71], ['45 inches', 45], ['12” deep', 12]]) {
  const m = s.match(INCH)
  if (!m || Number(m[1]) !== want) failures.push(`Inch pattern read ${m?.[1]} from "${s}", expected ${want}`)
}
if (!/\bzapateras?\b/i.test('Zapateras de metal')) failures.push('Zapateras did not match its own word-boundary pattern')
const decoded = stripTags('<p>Kid&apos;s rack • 48&times;24 in™ 360°</p>')
if (decoded !== "Kid's rack • 48×24 in™ 360°") failures.push(`stripTags decoded specimens as "${decoded}"`)
notes.push(`${specimens.length} title specimens with ™ ° • × &apos; inch marks and Zapateras ran through the word patterns; inch pattern and entity decoding hold`)

try {
  selfTestStripTags()
  if (stripTags(undefined) !== '') throw new Error('stripTags(undefined) must return an empty string')
  notes.push('stripTags self test passed: head, title, desc, script and style removed with contents; &apos; decoded')
} catch (err) {
  failures.push(String(err.message ?? err))
}

process.exit(report('R25 · invisible characters, catalog specimens, stripTags self test', failures, notes))
