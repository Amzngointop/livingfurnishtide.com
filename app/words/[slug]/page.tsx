import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLink } from '@/components/PageLink'
import { plainProse, renderProse, SellerNote } from '@/components/Prose'
import { SourcesList } from '@/components/SourcesList'
import { TiltBeam } from '@/components/TiltBeam'
import { categories } from '@/data/gear'
import { facts } from '@/data/facts'
import type { ProductFacts } from '@/data/types'
import { wordBySlug, words } from '@/data/words'
import { cap, NUMBER_FIELD, numberWord, usedBy } from '@/lib/catalog'
import { listingPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'
import { beamSentence, NUMBER_TITLES } from '@/lib/wordcheck'

export const dynamicParams = false

export function generateStaticParams() {
  return words.map((w) => ({ slug: w.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const w = wordBySlug(slug)
  if (!w) return {}
  return pageMeta({ path: `/words/${w.slug}`, phrase: w.seoPhrase, description: plainProse(w.metaDescription) })
}

export default async function WordPage({ params }: Params) {
  const { slug } = await params
  const w = wordBySlug(slug)
  if (!w) notFound()
  const byAsin = (a: string) => facts.find((p) => p.asin === a)!
  const used = w.usedBy.map(byAsin)
  const also = w.alsoStatingNumber.map(byAsin)
  const wordOnly = used.filter((p) => !also.includes(p))
  const figure = w.settlingNumberSlug ? NUMBER_TITLES[w.settlingNumberSlug] : null
  const valueOf = (p: ProductFacts) => (w.settlingNumberSlug ? String(p[NUMBER_FIELD[w.settlingNumberSlug]]) : '')
  const u = used.length
  const a = also.length
  const lower = w.title.toLowerCase()
  const sentence = beamSentence(`${cap(numberWord(u))} ${u === 1 ? 'listing prints' : 'listings print'} ${lower}`, u, a, figure)

  return (
    <article className="mx-auto max-w-[1000px] px-5 pb-6 pt-12 md:pt-16" data-page-layout="beam-top">
      <p className="label label-lg">A word from the ledger</p>
      <h1 className="mt-3">{w.title}</h1>
      <p className="mt-6 max-w-[62ch] text-[18px] leading-relaxed text-bone-2">{renderProse(w.lede)}</p>
      <SellerNote className="mt-4" />

      <div className="mt-10 border-y-[3px] border-walnut-3 py-10">
        <TiltBeam
          place="word-header"
          left={{ value: u, label: 'Listings that print the word', tone: 'bone' }}
          right={{ value: a, label: figure ? `Also state ${figure}` : 'No printed figure could settle it', tone: a > 0 ? 'patina' : 'rust' }}
          sentence={sentence}
        />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section aria-labelledby="with-figure">
          <h2 id="with-figure" className="!text-[28px]">
            Print the word and the figure
          </h2>
          {also.length > 0 ? (
            <ul className="mt-5 divide-y divide-walnut-3 border-y border-walnut-3 text-[15px]" data-count={also.length}>
              {also.map((p) => (
                <li key={p.asin} className="flex flex-col gap-1 py-3">
                  <PageLink href={listingPath(p)} />
                  <span className="figure text-[13px] text-patina">{valueOf(p)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="not-stated mt-5" data-count="0">
              No listing prints both
            </p>
          )}
        </section>
        <section aria-labelledby="word-only">
          <h2 id="word-only" className="!text-[28px]">
            Print the word only
          </h2>
          {wordOnly.length > 0 ? (
            <ul className="mt-5 divide-y divide-walnut-3 border-y border-walnut-3 text-[15px]" data-count={wordOnly.length}>
              {wordOnly.map((p) => (
                <li key={p.asin} className="py-3">
                  <PageLink href={listingPath(p)} className="text-bone-2 hover:text-bone" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-[15px] text-bone-3" data-count="0">
              Every listing that prints it also prints the figure.
            </p>
          )}
        </section>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="label label-lg">Where it is printed</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {categories.map((c) => {
              const count = usedBy(w.slug, c.slug).length
              return (
                <div key={c.slug} className="border-t border-walnut-3 pt-2" data-where={c.slug} data-value={count}>
                  <dt className="text-[12px] leading-tight text-bone-3">{c.title}</dt>
                  <dd className={`figure mt-1 text-[22px] ${count > 0 ? 'text-bone' : 'text-bone-3'}`}>{count}</dd>
                </div>
              )
            })}
          </dl>
        </div>
        <div>
          <p className="label label-lg">Spellings counted</p>
          <p className="mt-3 font-mono text-[14px] text-bone-2">{w.forms.join(' · ')}</p>
        </div>
      </div>

      <div className="prose-body mx-auto mt-16 max-w-[720px]">
        <h2>Who defines it</h2>
        <p className="mt-5">{renderProse(w.whoDefinesIt)}</p>
        <h2 className="mt-12">What the listings do with it</h2>
        <div className="mt-5">
          {w.body.map((b) => (
            <p key={b}>{renderProse(b)}</p>
          ))}
        </div>
      </div>

      <section className="mt-14 border-y-[3px] border-walnut-3 py-10" data-promise-band="" aria-labelledby="not-promise">
        <p id="not-promise" className="label label-lg">
          What the word does not promise
        </p>
        <p className="mt-4 max-w-[34ch] font-display text-[30px] leading-tight text-bone md:text-[38px]">{renderProse(w.whatItDoesNotPromise)}</p>
      </section>

      <div className="mx-auto mt-12 max-w-[720px] space-y-3 text-[15px]">
        {w.settlingNumberSlug ? (
          <p>
            The figure behind this word has its own count: <PageLink href={`/numbers/${w.settlingNumberSlug}`} />.
          </p>
        ) : null}
        <p>
          Narrowing this word to a single category is the job of <PageLink href="/word-check" />.
        </p>
        <SourcesList sources={w.sources} className="pt-8" />
      </div>
    </article>
  )
}
