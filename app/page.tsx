import Image from 'next/image'
import type { Metadata } from 'next'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { BrandSpreadCheck } from '@/components/BrandSpreadCheck'
import { JointRule } from '@/components/JointRule'
import { PageLink } from '@/components/PageLink'
import { Photo, Spread } from '@/components/Photo'
import { renderProse, SellerNote } from '@/components/Prose'
import { WordCheck } from '@/components/WordCheck'
import { WordLedger } from '@/components/WordLedger'
import { WordWallHero } from '@/components/WordWallHero'
import { categories } from '@/data/gear'
import { numbers } from '@/data/numbers'
import { photos } from '@/data/photos'
import { pieces } from '@/data/pieces'
import { products } from '@/data/products'
import { words } from '@/data/words'
import { brandSummary } from '@/lib/brandspread'
import { cap, CATEGORY_NOUN, inCategory, joinWords, lookup, numberWord, silent, stating, usedBy } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'
import { titleForPath } from '@/lib/routes'

export const metadata: Metadata = pageMeta({
  path: '/',
  phrase: 'Furniture listing adjectives and the figures they stand in for',
  description: `Sturdy, heavy-duty, ergonomic, space-saving: who prints each word across ${products.length} furniture listings, and how many also print the figure behind it.`,
})

const n = (key: string) => Number(lookup(key))

const ANSWERS = [
  {
    q: 'Does this site say which furniture is sturdy?',
    a: 'No. It counts which listings print the word and which of those also print a weight capacity, and it judges no piece.',
  },
  {
    q: 'Why count printed figures at all?',
    a: 'A printed figure can be set against another printed figure. An adjective cannot, and this site does not collect reviews to fill the gap.',
  },
  {
    q: 'Is a listing without a load figure a weaker piece?',
    a: 'Nothing here says so. When a listing prints no figure, the site records exactly that and draws nothing further from it.',
  },
  {
    q: 'What does ergonomic mean on these chair listings?',
    a: 'The listings do not say, and none names a standard. The word is quoted as printed, with no meaning added by this site.',
  },
  {
    q: 'Does the site explain how to fit a dresser to a wall?',
    a: 'No. Anything fitted to a wall belongs to the manufacturer’s instructions and to a person who does that work.',
  },
  {
    q: 'Where does the catalog come from?',
    a: '{W:products} Amazon listings across {w:categories} categories, described from the text each listing supplies. Prices and ratings are left out.',
  },
]

export default function HomePage() {
  const brands = brandSummary()
  const railItems = categories.map((c) => products.find((p) => p.category === c.slug && p.rank === 1)!)
  const strip = [
    { value: n('stating:weight-capacity'), line: `of ${products.length} listings print a weight capacity`, key: 'stating:weight-capacity' },
    { value: n('no-dims-seats-and-drawers'), line: 'chair and dresser listings print no size at all', key: 'no-dims-seats-and-drawers' },
    { value: n('pairs'), line: `of ${inCategory('shoe-racks').length} shoe rack listings count pairs`, key: 'pairs' },
    { value: n('wall'), line: 'listings name a part that holds the piece to a wall', key: 'wall' },
  ]
  const noDims = ['chairs', 'dressers'] as const
  return (
    <>
      {/* 1 */}
      <WordWallHero />

      {/* 2 */}
      <section id="word-ledger" data-section-layout="ledger-table" className="on-walnut-2 scroll-mt-4 bg-walnut-2 py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end">
            <h2>The Word Ledger</h2>
            <p className="text-[16px]">
              One row for each word this site tracks. The last two columns are counted from the listings: how many print the word, and how many of
              those same listings print the figure that could settle it.
            </p>
          </div>
          <div className="mt-10">
            <WordLedger caption={`The Word Ledger: ${numberWord(words.length)} words, what each would have to mean, and the two counts`} />
          </div>
          <p className="mt-6 text-[15px]">
            Every row opens its own page; the full ledger also lives on <PageLink href="/words" />.
          </p>
        </div>
      </section>

      {/* 3 */}
      <section data-section-layout="bordered-band" className="py-12 md:py-16" aria-labelledby="tip-band">
        <div className="wrap">
          <div className="grid gap-6 border-2 border-rust-d p-6 md:grid-cols-[auto_1fr] md:gap-10 md:p-9">
            <p id="tip-band" className="font-mono text-[12px] uppercase tracking-[0.1em] text-rust">
              Tip-over
            </p>
            <div className="space-y-3 text-[16px] text-bone-2">
              <p className="text-bone">
                Tall furniture can tip over. This site does not assess whether any piece here is stable, and it gives no instructions for fitting
                anything to a wall.
              </p>
              <p>
                {renderProse('{W:antitip} of the {w:tall-storage} dresser and bookcase listings in this catalog {p:antitip|prints|print} the word anti-tip, and {o:wall} {p:wall|names|name} a part.')}{' '}
                What the Consumer Product Safety Commission describes as the federal requirement for clothing storage units is set out, with its source, on the page for the word: <PageLink href="/words/anti-tip" />.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 */}
      <section data-section-layout="card-grid-3x2" className="pb-4 pt-6" aria-labelledby="word-cards">
        <div className="wrap">
          <h2 id="word-cards">The {numberWord(words.length)} words, one card each</h2>
          <ul className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3" data-count={words.length}>
            {words.map((w) => {
              const used = w.usedBy.length
              const also = w.alsoStatingNumber.length
              const max = Math.max(...words.map((x) => x.usedBy.length))
              return (
                <li key={w.slug} className="card flex h-full flex-col p-6">
                  <h3 className="font-display text-[28px] font-normal leading-tight">
                    <PageLink href={`/words/${w.slug}`} className="text-bone hover:text-patina" />
                  </h3>
                  <div className="mt-5 space-y-2" aria-hidden="true">
                    <span className="block h-1.5 bg-bone-3" style={{ width: `${(used / max) * 100}%` }} />
                    <span className={`block h-1.5 ${also === 0 ? 'border-t border-dashed border-rust-d' : 'bg-patina'}`} style={{ width: also === 0 ? '100%' : `${(also / max) * 100}%` }} />
                  </div>
                  <p className="mt-3 font-mono text-[13px] text-bone-3">
                    <span className="text-bone">{used}</span> print it · <span className={also === 0 ? 'text-rust' : 'text-patina'}>{also}</span> also print the figure
                  </p>
                  <p className="mt-4 flex-grow text-[15px]">{renderProse(w.whatItDoesNotPromise)}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <JointRule />

      {/* 5 */}
      <Spread photo={photos['spread-words']} height="44vh" />

      {/* 6 */}
      <section data-section-layout="tool-panel" className="mt-16 bg-pitch py-16 md:py-24" aria-labelledby="home-word-check">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="home-word-check">{titleForPath('/word-check')}</h2>
            <p className="mt-4 text-[16px]">
              A word and a category go in. The beam weighs the listings that print the word against the ones that also print the figure behind it.
            </p>
            <p className="mt-4 text-[15px]">
              The same tool on its own page: <PageLink href="/word-check" />.
            </p>
          </div>
          <WordCheck idPrefix="home-wc" />
        </div>
      </section>

      {/* 7 */}
      <section data-section-layout="snap-carousel" className="py-16 md:py-24" aria-labelledby="home-pieces">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="home-pieces">{cap(numberWord(pieces.length))} pieces, and the word each leans on</h2>
            <p className="text-[15px]">
              All of them side by side: <PageLink href="/pieces" />
            </p>
          </div>
          <ol className="snap-row mt-8 [grid-auto-columns:minmax(260px,320px)]" data-count={pieces.length}>
            {pieces.map((p) => (
              <li key={p.slug} className="card flex h-full flex-col p-6">
                <h3 className="font-display text-[26px] font-normal leading-tight">
                  <PageLink href={`/pieces/${p.slug}`} className="text-bone hover:text-patina" />
                </h3>
                <p className="mt-3 flex-grow text-[15px]">{renderProse(p.whatItIs)}</p>
                <p className="mt-5 border-t border-walnut-3 pt-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bone-3">
                  Leans on <span className="text-patina">{words.find((w) => w.slug === p.leanWord)!.title}</span> ·{' '}
                  {usedBy(p.leanWord, p.category).length} of {inCategory(p.category).length}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 */}
      <section data-section-layout="wide-table" className="pb-8" aria-labelledby="home-numbers">
        <div className="wrap">
          <h2 id="home-numbers">The figures that would settle them</h2>
          <div className="scroll-x mt-8">
            <table className="data-table min-w-[760px]" data-numbers-table="">
              <caption className="sr-only">The figures, what each decides, and how many listings print or omit it</caption>
              <thead>
                <tr>
                  <th scope="col">The figure</th>
                  <th scope="col">What it decides</th>
                  <th scope="col">Listings stating it</th>
                  <th scope="col">Listings silent</th>
                  <th scope="col">Page</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((x) => {
                  const s = stating(x.slug).length
                  const q = silent(x.slug).length
                  return (
                    <tr key={x.slug} data-number-row={x.slug} data-stating={s} data-silent={q}>
                      <th scope="row" className="!font-body !text-[16px] !normal-case !tracking-normal !text-bone">
                        {x.title}
                      </th>
                      <td className="text-[15px]">{renderProse(x.whatItDecides)}</td>
                      <td className={`figure text-[24px] ${s === 0 ? 'text-rust' : 'text-patina'}`}>{s}</td>
                      <td className="figure text-[24px] text-bone-2">{q}</td>
                      <td className="text-[14px]">
                        <PageLink href={`/numbers/${x.slug}`} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14px] text-bone-3">Silent counts only cover the categories each figure is counted in; each page prints its rule.</p>
        </div>
      </section>

      <JointRule />

      {/* 9 */}
      <section data-section-layout="numbers-strip" className="pb-16" aria-label="Four counts from the catalog">
        <div className="wrap">
          <ul className="grid gap-y-10 border-y-[3px] border-walnut-3 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-walnut-3">
            {strip.map((s) => (
              <li key={s.key} className="lg:px-8 lg:first:pl-0" data-strip-key={s.key} data-value={s.value}>
                <p className={`figure text-[64px] leading-none md:text-[80px] ${s.value === 0 ? 'text-rust' : 'text-bone'}`}>{s.value}</p>
                <p className="mt-3 text-[15px] text-bone-2">
                  <span className="sr-only">{s.value} </span>
                  {cap(numberWord(s.value))} {s.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 */}
      <Spread photo={photos['spread-numbers']} height="40vh" />

      {/* 11 */}
      <section data-section-layout="narrow-tool" className="py-16 md:py-24" aria-labelledby="home-brand">
        <div className="mx-auto max-w-[720px] rounded-[6px] border border-walnut-3 bg-walnut-2 px-5 py-10 md:px-10">
          <h2 id="home-brand">{titleForPath('/brand-spread-check')}</h2>
          <p className="mt-4 text-[16px]">
            Some brands turn up in more than one category, and this shows where a chosen brand’s listings sit. The tool also lives on <PageLink href="/brand-spread-check" />.
          </p>
          <BrandSpreadCheck idPrefix="home-bs" />
        </div>
      </section>

      {/* 12 */}
      <section data-section-layout="photo-plus-contents" className="pb-6" aria-labelledby="home-catalog">
        <div className="mx-auto grid max-w-[860px] gap-10 px-5 md:grid-cols-[280px_1fr] md:px-0">
          <Photo photo={photos.contents} sizes="(min-width: 768px) 280px, 90vw" />
          <div>
            <h2 id="home-catalog">What this catalog is</h2>
            <p className="mt-5 text-[16px]">
              {cap(numberWord(products.length))} Amazon listings in {numberWord(categories.length)} categories, each described only from the text its
              listing supplies.
            </p>
            <ul className="mt-5 divide-y divide-walnut-3 border-y border-walnut-3 text-[15px]" data-count={categories.length}>
              {categories.map((c) => (
                <li key={c.slug} className="flex items-baseline justify-between gap-4 py-2.5">
                  <PageLink href={`/gear/${c.slug}`} />
                  <span className="figure text-bone-3">{inCategory(c.slug).length}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[16px]" data-no-dims-statement="">
              The chair and dresser listings print no dimensions at all: {joinWords(noDims.map((c) => `${numberWord(silent('assembled-dimensions', c).length)} ${CATEGORY_NOUN[c].many}`))}, and not one
              size figure between them.
            </p>
            <p className="mt-3 text-[16px]">
              {cap(numberWord(brands.spread.length))} of the {numberWord(brands.brands)} brands appear in more than one category (
              {joinWords(brands.spread.map((b) => b.brand))}), and {brands.top.brand} appears most often, with {numberWord(brands.top.total)} listings in{' '}
              {numberWord(brands.top.categories.length)} categories. That is a fact about this catalog, not about the market.
            </p>
            <p className="mt-3 text-[16px]">
              {cap(numberWord(n('dual')))} dresser listings also call themselves a nightstand or a TV stand, and their cards say so.
            </p>
          </div>
        </div>
      </section>

      <JointRule />

      {/* 13 */}
      <section data-section-layout="qa-grid-2x3" className="pb-16" aria-labelledby="home-answers">
        <div className="wrap">
          <h2 id="home-answers">{cap(numberWord(ANSWERS.length))} plain answers</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {ANSWERS.map((x) => (
              <div key={x.q} className="border-t-[3px] border-walnut-3 pt-4">
                <dt className="text-[18px] font-medium leading-snug text-bone">{x.q}</dt>
                <dd className="mt-2 text-[15px]">{renderProse(x.a)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 14 */}
      <section data-section-layout="product-rail" className="bg-walnut-2 py-16 md:py-20" aria-labelledby="home-rail">
        <div className="wrap">
          <AffiliateDisclosure position="home" className="max-w-[760px]" />
          <h2 id="home-rail" className="mt-8" data-count={railItems.length}>
            {cap(numberWord(railItems.length))} listings, one from each category
          </h2>
          <SellerNote className="mt-3" />
          <ul className="snap-row mt-8 [grid-auto-columns:minmax(240px,280px)]">
            {railItems.map((p) => (
              <li key={p.asin} className="card flex h-full flex-col bg-walnut p-4">
                <div className="plate relative aspect-square w-full overflow-hidden">
                  <Image src={p.imageUrl} alt={p.name} fill sizes="(min-width: 640px) 220px, 60vw" className="object-contain p-5" />
                </div>
                <p className="label mt-3">
                  <PageLink href={`/gear/${p.category}`} className="hover:text-bone" />
                </p>
                <h3 className="mt-2 text-[15px] leading-snug">
                  <PageLink href={`/gear/${p.category}#listing-${p.asin}`} className="text-bone hover:text-patina" />
                </h3>
                <p className="mt-2 flex-grow text-[14px] leading-snug text-bone-3">The listing states {p.listingStates}.</p>
                <a href={p.affiliateUrl} className="btn btn-sm mt-4 justify-center" rel="nofollow sponsored noopener" target="_blank" data-affiliate="">
                  <span className="btn-label">Listing on Amazon</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
