import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { renderProse, SellerNote } from '@/components/Prose'
import { glossary } from '@/data/glossary'
import { cap, numberWord } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/glossary',
  phrase: 'Glossary of furniture listing terms, from flat pack to zapatera',
  description:
    'Plain definitions of furniture listing terms, from flat pack and tier to lumbar support and anti-tip hardware, with how often this catalog prints each.',
})

export default function GlossaryPage() {
  return (
    <div className="wrap pb-6 pt-12 md:pt-16" data-page-layout="glossary-list">
      <h1>{titleForPath('/glossary')}</h1>
      <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed">
        {cap(numberWord(glossary.length))} terms. Where a definition mentions this catalog, the count comes from the same listing text as every other
        page.
      </p>
      <SellerNote className="mt-4" />
      <dl className="mt-12 grid gap-x-12 md:grid-cols-2" data-count={glossary.length}>
        {glossary.map((g) => (
          <div key={g.slug} id={g.slug} className="scroll-mt-6 border-t border-walnut-3 py-6">
            <dt className="font-display text-[26px] leading-tight text-bone">{g.term}</dt>
            <dd className="mt-2 text-[15px]">
              {renderProse(g.definition)}
              {g.links.length > 0 ? (
                <span className="mt-2 block text-[14px]">
                  Related:{' '}
                  {g.links.map((href, i) => (
                    <span key={href}>
                      {i > 0 ? ' and ' : ''}
                      <PageLink href={href} />
                    </span>
                  ))}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
