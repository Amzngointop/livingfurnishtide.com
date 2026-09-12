import { products } from '@/data/products'
import { FIGURE_SLOT, wall } from '@/data/wall'
import { words } from '@/data/words'
import { cap, lookup, numberWord } from '@/lib/catalog'
import { SITE } from '@/lib/seo'

const SIZE: Record<number, string> = {
  1: 'text-[18px]',
  2: 'text-[22px] sm:text-[24px]',
  3: 'text-[28px] sm:text-[34px]',
  4: 'text-[34px] sm:text-[48px]',
  5: 'text-[44px] sm:text-[72px]',
}

/**
 * Home section 1: a dense field of adjectives printed by sellers in this
 * catalog, with exactly one slot holding a figure from the data instead.
 * On narrow screens the words marked wide drop out; the figure sits early in
 * the field so it stays in the first screen.
 */
export function WordWallHero() {
  const figure = String(lookup('load-figure:common'))
  const holders = Number(lookup('load-figure:common-count'))
  const strip = `${cap(numberWord(words.length))} words · ${products.length} listings · ${SITE.year}`
  return (
    <section data-section-layout="word-wall" className="bg-walnut" aria-labelledby="home-h1">
      <div className="wrap pb-14 pt-8 md:pb-20 md:pt-14">
        <p className="label" data-seller-block="">
          Seller words, quoted from the titles and listing texts in this catalog
        </p>
        <div
          data-word-wall=""
          className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-0 font-display leading-[1.15] text-bone-3 sm:gap-x-6"
        >
          {wall.map((slot, i) => (
            <span key={slot.text} className="contents">
              {i === FIGURE_SLOT ? (
                <span className={`${SIZE[4]} text-patina`} data-wall-figure="">
                  {figure}
                </span>
              ) : null}
              <q className={`${SIZE[slot.size]} ${slot.wide ? 'hidden sm:inline' : ''} [quotes:none]`} data-seller-words="">
                {slot.text}
              </q>
            </span>
          ))}
        </div>
        <p className="mt-5 max-w-[62ch] text-[14px] text-bone-3" data-wall-note="">
          The only figure in the field, {figure}, is the weight capacity {numberWord(holders)} desk listings print. Every word around it is
          printed by at least one seller here.
        </p>
        <div className="mt-12 grid gap-8 border-t-[3px] border-walnut-3 pt-8 md:grid-cols-[1.3fr_1fr] md:gap-14">
          <div>
            <p className="label label-lg">{SITE.name}</p>
            <h1 id="home-h1" className="mt-3 max-w-[16ch]">
              The words that stand where a figure should be
            </h1>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[17px] leading-relaxed text-bone-2">
              Sturdy, heavy-duty, ergonomic, space-saving: each is a claim about load, floor or the person using the piece, and each could be
              settled by a figure the seller did not print. This site counts who prints the word, then counts how many of the same listings
              also print the figure.
            </p>
            <p className="label mt-5" data-strip="">
              {strip}
            </p>
            <div className="mt-6">
              <a href="#word-ledger" className="btn">
                <span className="btn-label">The Word Ledger, below</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
