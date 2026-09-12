import type { Metadata } from 'next'
import { BrandSpreadCheck } from '@/components/BrandSpreadCheck'
import { PageLink } from '@/components/PageLink'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/brand-spread-check',
  phrase: 'Brand Spread Check across the furniture catalog',
  description:
    'A brand, matched exactly as its listing titles print it, with how many listings it has in each furniture category and whether it turns up in more than one.',
})

export default function BrandSpreadPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pb-10 pt-12 md:pt-16" data-page-layout="narrow-tool-page">
      <h1>{titleForPath('/brand-spread-check')}</h1>
      <p className="mt-6 text-[17px] leading-relaxed">
        Brand names are matched letter for letter, so the count is about this catalog’s titles and nothing wider. Most brands here have a single listing;
        a few spread across categories.
      </p>
      <div className="mt-10 rounded-[6px] border border-walnut-3 bg-walnut-2 px-5 py-8 md:px-8">
        <BrandSpreadCheck idPrefix="bs" />
      </div>
      <p className="mt-8 text-[15px]">
        The categories themselves: <PageLink href="/gear" />.
      </p>
    </div>
  )
}
