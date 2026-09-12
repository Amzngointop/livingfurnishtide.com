import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { PageLink } from '@/components/PageLink'
import { plainProse, renderProse, SellerNote } from '@/components/Prose'
import { SourcesList } from '@/components/SourcesList'
import { facts } from '@/data/facts'
import { categories } from '@/data/gear'
import { pieceBySlug, pieces } from '@/data/pieces'
import { words } from '@/data/words'
import { inCategory, NUMBER_ORDER, numberScope, numberWord, stating, usedBy } from '@/lib/catalog'
import { listingPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = pieceBySlug(slug)
  if (!p) return {}
  return pageMeta({ path: `/pieces/${p.slug}`, phrase: p.seoPhrase, description: plainProse(p.metaDescription) })
}

export default async function PiecePage({ params }: Params) {
  const { slug } = await params
  const piece = pieceBySlug(slug)
  if (!piece) notFound()
  const category = categories.find((c) => c.slug === piece.category)!
  const total = inCategory(piece.category).length
  const lean = usedBy(piece.leanWord, piece.category).length
  const tiedWith = piece.leanTied.filter((w) => w !== piece.leanWord)
  const unstated = NUMBER_ORDER.filter((n) => numberScope(n).includes(piece.category) && stating(n, piece.category).length === 0)

  return (
    <article className="mx-auto max-w-[820px] px-5 pb-6 pt-12 md:pt-16" data-page-layout="single-column-insets">
      <p className="label label-lg">
        A piece · <PageLink href={`/gear/${category.slug}`} className="hover:text-bone" />
      </p>
      <h1 className="mt-3">{piece.title}</h1>
      <p className="mt-6 text-[19px] leading-relaxed text-bone-2">{renderProse(piece.whatItIs)}</p>
      <SellerNote className="mt-4" />

      <div className="mt-10 grid gap-8 border-t-[3px] border-walnut-3 pt-6 sm:grid-cols-2">
        <div data-lean-word={piece.leanWord} data-lean-count={lean}>
          <p className="label">The word it leans on</p>
          <p className="mt-2 font-display text-[30px] leading-tight">
            <PageLink href={`/words/${piece.leanWord}`} className="text-bone hover:text-patina" />
          </p>
          <p className="mt-2 text-[14px] text-bone-3">
            Printed on {numberWord(lean)} of {numberWord(total)} listings ({lean} of {total}), the most of any tracked word in the category.
            {tiedWith.length > 0
              ? ` It ties with ${tiedWith.map((t) => words.find((w) => w.slug === t)!.title.toLowerCase()).join(' and ')}; a tie goes to the word listed first in the ledger.`
              : ''}
          </p>
        </div>
        <div data-unstated={unstated.join(',')}>
          <p className="label">Printed by no listing in the category</p>
          {unstated.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-[15px]">
              {unstated.map((n) => (
                <li key={n}>
                  <PageLink href={`/numbers/${n}`} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[15px]">Every figure this site counts appears at least once here.</p>
          )}
        </div>
      </div>

      {piece.sections.map((s, i) => {
        const inset = piece.insets[i]
        const source = inset ? facts.find((f) => f.asin === inset.asin)! : null
        return (
          <Fragment key={s.heading}>
            <section className="prose-body mt-14">
              <h2>{renderProse(s.heading)}</h2>
              <div className="mt-5">
                {s.paragraphs.map((para) => (
                  <p key={para}>{renderProse(para)}</p>
                ))}
              </div>
            </section>
            {inset && source ? (
              <figure className="mx-[calc(50%-50vw)] mt-14 border-y border-walnut-3 bg-walnut-2 px-5 py-12" data-inset="">
                <div className="mx-auto max-w-[820px]">
                  <blockquote className="font-display text-[34px] leading-tight text-bone md:text-[46px]">
                    <q className="seller not-italic" data-seller-words="">
                      {inset.phrase}
                    </q>
                  </blockquote>
                  <figcaption className="mt-4 text-[14px] text-bone-3">
                    From the listing text for <PageLink href={listingPath(source)} />
                  </figcaption>
                </div>
              </figure>
            ) : null}
          </Fragment>
        )
      })}

      <p className="mt-14 text-[15px]">
        Every listing in this category, card by card: <PageLink href={`/gear/${category.slug}`} />.
      </p>
      <SourcesList sources={piece.sources} className="mt-10" />
    </article>
  )
}
