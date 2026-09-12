import type { Metadata } from 'next'
import { TextPage } from '@/components/TextPage'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/terms',
  phrase: 'Terms of use for a reference built from listing text',
  description:
    'Terms for using LivingFurnishTide: counts drawn from listing text that can change, seller words quoted as their own, and no advice on assembly or use.',
})

export default function TermsPage() {
  return (
    <TextPage
      path="/terms"
      lede="LivingFurnishTide is an information site. Using it means reading its counts for what they are: a record of what listings printed when the catalog was collected."
    >
      <h2>Counts can go stale</h2>
      <p>
        Sellers edit their listings. A word or a figure counted here may since have been added or removed, and the listing on Amazon is the current
        version.
      </p>
      <h2>Seller words stay the sellers’</h2>
      <p>
        Words in quotation marks are quoted from listings and remain the statements of the businesses that printed them. The site does not confirm
        them.
      </p>
      <h2>No advice</h2>
      <p>
        Nothing here is advice on assembly, on fitting furniture to a wall, on electrical products or on how to use any piece. Those questions belong
        to the manufacturer’s instructions and to qualified people.
      </p>
      <h2>No warranty</h2>
      <p>
        The site is provided as it is. It makes no promise that a page is complete or current, and it is not responsible for the products or websites
        it links to.
      </p>
    </TextPage>
  )
}
