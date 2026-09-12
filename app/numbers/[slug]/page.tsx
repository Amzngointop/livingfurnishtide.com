import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLink } from '@/components/PageLink'
import { plainProse, renderProse, SellerNote } from '@/components/Prose'
import { SourcesList } from '@/components/SourcesList'
import { TiltBeam } from '@/components/TiltBeam'
import { categories } from '@/data/gear'
import { numberBySlug, numbers } from '@/data/numbers'
import type { NumberSlug, ProductFacts } from '@/data/types'
import { cap, formsRegex, inScope, listingText, NUMBER_FIELD, numberScope, numberWord, numberWordSide, pairs, silent, stating } from '@/lib/catalog'
import { listingPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return numbers.map((n) => ({ slug: n.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const n = numberBySlug(slug)
  if (!n) return {}
  return pageMeta({ path: `/numbers/${n.slug}`, phrase: n.seoPhrase, description: plainProse(n.metaDescription) })
}

function asPrinted(p: ProductFacts, slug: NumberSlug): string {
  if (slug === 'capacity-in-pairs-drawers-and-tiers' && p.category === 'shoe-racks') {
    const pr = pairs(p)!
    return pr.max === null ? `${pr.min} or more pairs` : `${pr.min} to ${pr.max} pairs`
  }
  return String(p[NUMBER_FIELD[slug]])
}

export default async function NumberPage({ params }: Params) {
  const { slug } = await params
  const n = numberBySlug(slug)
  if (!n) notFound()
  const claimants = stating(n.slug)
  const s = claimants.length
  const q = silent(n.slug).length
  const scope = numberScope(n.slug)
  const side = numberWordSide(n.slug)
  const ws = side.users.length
  const sentence = `${cap(numberWord(s))} ${s === 1 ? 'listing prints' : 'listings print'} ${n.title.toLowerCase()} (${s}); ${numberWord(ws)} ${ws === 1 ? 'listing prints' : 'listings print'} a word or phrase it would settle (${ws}).`

  return (
    <div className="mx-auto max-w-[960px] px-5 pb-6 pt-12 md:pt-16" data-page-layout="sticky-right-rail">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
        <aside className="order-first md:order-last" aria-label="Counter">
          <div className="card p-5 md:sticky md:top-6" data-rail="" data-stating={s} data-silent={q}>
            <p className="label">Print it</p>
            <p className={`figure text-[56px] leading-none ${s === 0 ? 'text-rust' : 'text-patina'}`}>{s}</p>
            <p className="label mt-5">Silent</p>
            <p className="figure text-[56px] leading-none text-bone">{q}</p>
            <p className="label mt-6 border-t border-walnut-3 pt-4">By category</p>
            <ul className="mt-2 space-y-2 text-[13px]">
              {categories.map((c) => {
                const counted = scope.includes(c.slug)
                const cs = stating(n.slug, c.slug).length
                const total = inScope(n.slug, c.slug).length
                return (
                  <li key={c.slug} className="flex items-baseline justify-between gap-3" data-rail-cat={c.slug} data-value={counted ? cs : 'out'}>
                    <span className="text-bone-2">{c.title}</span>
                    {counted ? (
                      <span className="figure shrink-0 text-bone">
                        {cs}/{total}
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[11px] uppercase text-bone-3">not counted</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        <article>
          <p className="label label-lg">A figure that would settle a word</p>
          <h1 className="mt-3">{n.title}</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-bone-2">{renderProse(n.lede)}</p>
          <SellerNote className="mt-4" />

          <div className="mt-10 border-y-[3px] border-walnut-3 py-8">
            <TiltBeam
              place="number-header"
              left={{ value: s, label: 'Listings stating it', tone: s > 0 ? 'patina' : 'rust' }}
              right={{ value: ws, label: 'Print a word it would settle', tone: 'bone' }}
              sentence={sentence}
            />
          </div>

          <p className="mt-10 text-[17px] text-bone">{renderProse(n.whatItIs)}</p>
          <div className="prose-body mt-6">
            {n.body.map((b) => (
              <p key={b}>{renderProse(b)}</p>
            ))}
          </div>
          <p className="mt-6 border-l-2 border-walnut-3 pl-4 text-[14px] text-bone-3" data-scope-rule="">
            {n.scopeRule}
          </p>

          <section className="mt-12" aria-labelledby="claimants">
            <h2 id="claimants" className="!text-[30px]">
              Listings that print it
            </h2>
            {s === 0 ? (
              <p className="not-stated mt-4" data-count="0">
                No listing in the catalog prints this figure
              </p>
            ) : (
              <div className="scroll-x mt-5">
                <table className="data-table" data-count={s}>
                  <caption className="sr-only">Listings that print {n.title.toLowerCase()}, with the figure as printed</caption>
                  <thead>
                    <tr>
                      <th scope="col">Listing</th>
                      <th scope="col">As printed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimants.map((p) => (
                      <tr key={p.asin}>
                        <td className="text-[14px]">
                          <PageLink href={listingPath(p)} />
                        </td>
                        <td className="figure text-[14px] text-patina">{asPrinted(p, n.slug)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-12" aria-labelledby="settles">
            <h2 id="settles" className="!text-[30px]">
              What it would settle
            </h2>
            <ul className="mt-5 space-y-2 text-[15px]">
              {side.pages.map((w) => (
                <li key={w}>
                  <PageLink href={`/words/${w}`} />
                </li>
              ))}
              {side.phrases.map((ph) => {
                const count = side.users.filter((p) => formsRegex([ph]).test(listingText(p))).length
                return (
                  <li key={ph}>
                    <q className="seller" data-seller-words="">
                      {ph}
                    </q>{' '}
                    <span className="text-bone-3">
                      printed on {numberWord(count)} {count === 1 ? 'listing' : 'listings'} ({count})
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <SourcesList sources={n.sources} className="mt-14" />
        </article>
      </div>
    </div>
  )
}
