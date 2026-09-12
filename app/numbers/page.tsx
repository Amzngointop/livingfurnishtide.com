import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { renderProse } from '@/components/Prose'
import { numbers } from '@/data/numbers'
import { cap, inScope, numberWord, silent, stating } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/numbers',
  phrase: 'The figures furniture listings leave out, counted',
  description:
    'Weight capacity, assembled size, pair and drawer counts, top material and wall parts: how many furniture listings print each figure and how many stay silent.',
})

export default function NumbersIndex() {
  return (
    <div className="wrap pb-6 pt-12 md:pt-16" data-page-layout="counter-cards">
      <h1>{titleForPath('/numbers')}</h1>
      <p className="mt-6 max-w-[64ch] text-[17px] leading-relaxed">
        {cap(numberWord(numbers.length))} figures, each one able to settle a word or a phrase the listings print. Every card counts the listings that
        print the figure against the listings it is counted in.
      </p>
      <ul className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3" data-count={numbers.length}>
        {numbers.map((x) => {
          const s = stating(x.slug).length
          const total = inScope(x.slug).length
          const q = silent(x.slug).length
          return (
            <li key={x.slug} className="card flex h-full flex-col p-6" data-number-card={x.slug} data-stating={s} data-silent={q}>
              <h2 className="!text-[28px]">
                <PageLink href={`/numbers/${x.slug}`} className="text-bone hover:text-patina" />
              </h2>
              <p className="mt-6 flex items-baseline gap-2">
                <span className={`figure text-[64px] leading-none ${s === 0 ? 'text-rust' : 'text-patina'}`}>{s}</span>
                <span className="figure text-[20px] text-bone-3">/ {total}</span>
              </p>
              <p className="label mt-2">
                print it · {q} silent
              </p>
              <p className="mt-5 flex-grow text-[15px]">{renderProse(x.whatItIs)}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
