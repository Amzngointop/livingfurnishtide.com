import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { Photo } from '@/components/Photo'
import { renderProse } from '@/components/Prose'
import { photos } from '@/data/photos'
import { pieces } from '@/data/pieces'
import { words } from '@/data/words'
import { cap, inCategory, numberWord, usedBy } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/pieces',
  phrase: 'Furniture pieces described only by their own listings',
  description:
    'The shoe rack, desk, bookcase, chair and dresser, each described only from its own listings, with the word it leans on and the figures it leaves out.',
})

export default function PiecesIndex() {
  return (
    <div className="wrap pb-6 pt-12 md:pt-16" data-page-layout="photo-cards">
      <h1>{titleForPath('/pieces')}</h1>
      <Photo photo={photos['spread-pieces']} sizes="(min-width: 1240px) 1176px, 94vw" className="mt-10" />
      <p className="mx-auto mt-10 max-w-[64ch] text-center text-[17px] leading-relaxed">
        {cap(numberWord(pieces.length))} pieces, one per category. Each page describes the piece the way its listings do, names the word the category
        leans on hardest, and lists the figures no listing in it prints.
      </p>
      <ul className="mt-12 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-5" data-count={pieces.length}>
        {pieces.map((p) => (
          <li key={p.slug} className="card flex h-full flex-col p-5">
            <h2 className="!text-[26px]">
              <PageLink href={`/pieces/${p.slug}`} className="text-bone hover:text-patina" />
            </h2>
            <p className="mt-4 flex-grow text-[14px] leading-relaxed">{renderProse(p.whatItIs)}</p>
            <p className="label mt-5 border-t border-walnut-3 pt-3">
              {words.find((w) => w.slug === p.leanWord)!.title} · {usedBy(p.leanWord, p.category).length} of {inCategory(p.category).length}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
