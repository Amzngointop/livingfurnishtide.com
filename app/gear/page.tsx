import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { renderProse } from '@/components/Prose'
import { categories } from '@/data/gear'
import { products } from '@/data/products'
import { cap, inCategory, inSubgroup, numberWord, silent } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/gear',
  phrase: 'Furniture listings by category, as each listing describes itself',
  description:
    'Shoe racks, desks, bookcases, desk chairs and dressers: every listing in the catalog by category, with what each prints and leaves out, ranked by nothing.',
})

export default function GearIndex() {
  const chairsSilent = silent('assembled-dimensions', 'chairs').length
  const dressersSilent = silent('assembled-dimensions', 'dressers').length
  return (
    <div className="wrap pb-6 pt-12 md:pt-16" data-page-layout="category-plates">
      <h1>{titleForPath('/gear')}</h1>
      <p className="mt-6 max-w-[64ch] text-[17px] leading-relaxed">
        {cap(numberWord(products.length))} listings in {numberWord(categories.length)} categories. Each category page repeats what its listings print and
        marks what they leave out.
      </p>
      <p className="mt-4 max-w-[64ch] text-[16px]" data-no-dims-statement="">
        Chairs and dressers print no size at all: none of the {numberWord(chairsSilent)} chair listings and none of the {numberWord(dressersSilent)}{' '}
        dresser listings gives a single dimension.
      </p>
      <ul className="mt-12 grid gap-px overflow-hidden rounded-[6px] border border-walnut-3 bg-walnut-3 md:grid-cols-2" data-count={categories.length}>
        {categories.map((c) => (
          <li key={c.slug} className="flex flex-col bg-walnut p-7 md:p-9" data-plate={c.slug}>
            <h2 className="!text-[34px]">
              <PageLink href={`/gear/${c.slug}`} className="text-bone hover:text-patina" />
            </h2>
            <p className="mt-3 font-mono text-[13px] uppercase tracking-[0.08em] text-patina">{renderProse(c.coreJob)}</p>
            <p className="figure mt-6 text-[48px] leading-none text-bone">{inCategory(c.slug).length}</p>
            <p className="label mt-1">listings</p>
            <ul className="mt-5 space-y-1 text-[14px] text-bone-2">
              {c.subgroups.map((s) => (
                <li key={s.id} className="flex justify-between gap-4 border-b border-walnut-3 pb-1">
                  <span>{s.title}</span>
                  <span className="figure">{inSubgroup(c.slug, s.id).length}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px]">
              The piece behind it: <PageLink href={`/pieces/${c.pieceSlug}`} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
