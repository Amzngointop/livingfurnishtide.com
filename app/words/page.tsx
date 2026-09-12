import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { WordLedger } from '@/components/WordLedger'
import { words } from '@/data/words'
import { cap, numberWord } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/words',
  phrase: 'The Word Ledger of furniture listing adjectives',
  description:
    'The full Word Ledger: each adjective these furniture listings lean on, what it would have to mean, the figure that could settle it, and both counts.',
})

export default function WordsIndex() {
  return (
    <div className="wrap pb-6 pt-12 md:pt-16" data-page-layout="ledger-index">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end">
        <h1>{titleForPath('/words')}</h1>
        <p className="text-[17px] leading-relaxed">
          {cap(numberWord(words.length))} words do most of the describing in these titles. Each row below counts the listings that print the word,
          then counts how many of those same listings print the figure that could back it up.
        </p>
      </div>
      <div className="mt-12 rounded-[6px] border border-walnut-3 bg-walnut-2 p-2 on-walnut-2 md:p-4">
        <WordLedger caption="Every tracked word with its two counts" />
      </div>
      <section className="mx-auto mt-16 max-w-[760px]" aria-labelledby="how-counted">
        <h2 id="how-counted">How a word gets counted</h2>
        <p className="mt-5">
          A listing counts as printing a word when one of the spellings below appears as a whole word in its title or listing text. Spellings are not
          stretched to cover near relatives: a stable frame is not counted as sturdy, and a small dresser is not counted as space-saving.
        </p>
        <dl className="mt-8 divide-y divide-walnut-3 border-y border-walnut-3" data-count={words.length}>
          {words.map((w) => (
            <div key={w.slug} className="grid gap-2 py-4 sm:grid-cols-[220px_1fr]">
              <dt>
                <PageLink href={`/words/${w.slug}`} />
              </dt>
              <dd className="font-mono text-[13px] text-bone-3">{w.forms.join(' · ')}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-[15px]">
          Weighing a single word against a single category is the job of <PageLink href="/word-check" />.
        </p>
      </section>
    </div>
  )
}
