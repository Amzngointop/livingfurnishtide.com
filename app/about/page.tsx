import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { TextPage } from '@/components/TextPage'
import { products } from '@/data/products'
import { words } from '@/data/words'
import { numberWord } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/about',
  phrase: 'About a reference that counts furniture listing words',
  description:
    'Why this site counts the adjectives furniture listings print and the figures they leave out, what it will never claim, and where every count on it comes from.',
})

export default function AboutPage() {
  return (
    <TextPage
      path="/about"
      lede="LivingFurnishTide is a reference for the adjectives that stand in for figures on furniture listings. It reads the box before the reviews, and it only counts what the box says."
    >
      <h2>What it does</h2>
      <p>
        The site takes {numberWord(words.length)} words that carry much of the describing in these titles and counts who prints each one. Then it
        counts how many of those same listings also print the figure that would settle the word: a weight capacity, a size, a named part. The gap
        between the two counts is the finding.
      </p>
      <p>
        The catalog behind the counts is {numberWord(products.length)} Amazon listings, described from the listing text collected for it in 2026.
        When a listing does not print a size, a load, a count or a material, the site records it as not stated. It never averages, estimates or borrows
        a figure from a similar listing.
      </p>
      <h2>What it will not do</h2>
      <p>
        It does not say that a piece is strong, stable, comfortable or well made, and it does not read a missing figure as a lower one. It does not
        test furniture, assemble it or use it. It gives no instructions for assembly, for fitting anything to a wall or for electrical work, and nothing
        on it is advice about how to sit, stand or set up a desk.
      </p>
      <p>
        Statements about who regulates a word, or what a federal standard requires, come only from published documents, and each such page links its
        sources.
      </p>
      <h2>Where to start</h2>
      <p>
        The whole method fits in one table: <PageLink href="/words" />. The figures have their own pages under <PageLink href="/numbers" />.
      </p>
    </TextPage>
  )
}
