import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { WordCheck } from '@/components/WordCheck'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/word-check',
  phrase: 'Word Check for furniture listing adjectives by category',
  description:
    'A listing word such as sturdy or anti-tip and a category go in; out comes how many listings print it and how many also print the figure behind it.',
})

export default function WordCheckPage() {
  return (
    <div className="bg-pitch" data-page-layout="tool-page">
      <div className="wrap pb-16 pt-12 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h1>{titleForPath('/word-check')}</h1>
            <p className="mt-6 text-[17px] leading-relaxed">
              A word on one side of the beam, the figure that could back it on the other. Categories where the word never appears are switched off,
              with the reason printed.
            </p>
            <p className="mt-6 text-[15px]">
              All the words at once, with their meanings: <PageLink href="/words" />.
            </p>
          </div>
          <WordCheck idPrefix="wc" />
        </div>
      </div>
    </div>
  )
}
