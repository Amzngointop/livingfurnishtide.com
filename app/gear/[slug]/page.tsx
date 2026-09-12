import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { CompareTable } from '@/components/CompareTable'
import { FAQ } from '@/components/FAQ'
import { PageLink } from '@/components/PageLink'
import { ProductCard } from '@/components/ProductCard'
import { plainProse, renderProse, SellerNote } from '@/components/Prose'
import { categories, categoryBySlug } from '@/data/gear'
import { products } from '@/data/products'
import { pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const c = categoryBySlug(slug)
  if (!c) return {}
  return pageMeta({ path: `/gear/${c.slug}`, phrase: c.seoPhrase, description: plainProse(c.metaDescription) })
}

export default async function GearCategoryPage({ params }: Params) {
  const { slug } = await params
  const c = categoryBySlug(slug)
  if (!c) notFound()
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-6 pt-12 md:pt-16" data-page-layout="catalog-grid">
      <p className="label label-lg">
        <PageLink href="/gear" className="hover:text-bone" /> · {renderProse(c.coreJob)}
      </p>
      <h1 className="mt-3">{c.title}</h1>
      <p className="mt-6 max-w-[70ch] text-[17px] leading-relaxed">{renderProse(c.intro)}</p>
      <p className="mt-4 text-[15px]">
        The piece these listings describe: <PageLink href={`/pieces/${c.pieceSlug}`} />
      </p>
      <AffiliateDisclosure position="top" className="mt-8 max-w-[860px]" />
      <SellerNote className="mt-6" />

      {c.subgroups.map((sg) => {
        const rows = products.filter((p) => p.category === c.slug && p.subgroup === sg.id).sort((a, b) => a.rank - b.rank)
        return (
          <section key={sg.id} id={sg.id} className="mt-16 scroll-mt-6" data-subgroup={sg.id} aria-labelledby={`${sg.id}-h`}>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-[3px] border-walnut-3 pb-3">
              <h2 id={`${sg.id}-h`}>{sg.title}</h2>
              <span className="label label-lg" data-count={rows.length}>
                {rows.length} {rows.length === 1 ? 'listing' : 'listings'}
              </span>
            </div>
            <p className="mt-4 max-w-[75ch] text-[16px]">{renderProse(sg.intro)}</p>
            {rows.length >= 2 ? (
              <>
                <ul className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {rows.map((p) => (
                    <li key={p.asin} className="h-full">
                      <ProductCard p={p} />
                    </li>
                  ))}
                </ul>
                <CompareTable rows={rows} columns={c.columns} groupTitle={sg.title} />
              </>
            ) : (
              <div className="mt-8 max-w-[340px]" data-single-card="">
                <ProductCard p={rows[0]} />
                <p className="mt-3 text-[13px] text-bone-3">No comparison table: this group holds a single listing.</p>
              </div>
            )}
          </section>
        )
      })}

      <div className="mt-20 max-w-[860px]">
        <FAQ items={c.faq} id="faq" heading="Questions about these listings" jsonLd />
      </div>
      <AffiliateDisclosure position="bottom" className="mt-14 max-w-[860px]" />
    </div>
  )
}
