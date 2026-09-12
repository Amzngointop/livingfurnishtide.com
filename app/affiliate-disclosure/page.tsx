import type { Metadata } from 'next'
import { TextPage } from '@/components/TextPage'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/affiliate-disclosure',
  phrase: 'How Amazon affiliate links work on this furniture reference',
  description:
    'LivingFurnishTide earns from qualifying Amazon purchases made through its product links. What that pays for, and why it never changes a count, a note or a card.',
})

export default function AffiliateDisclosurePage() {
  return (
    <TextPage
      path="/affiliate-disclosure"
      lede="As an Amazon Associate, LivingFurnishTide earns from qualifying purchases. That is the only way the site is paid."
    >
      <p>
        Product cards link to Amazon listings with an affiliate tag. When someone buys through one of those links, Amazon pays the site a commission.
        The buyer pays the same price either way.
      </p>
      <p>
        The commission does not touch the counts. A listing is included because it belongs to the catalog, and what its card says comes from its own
        listing text. There are no paid placements, no prices and no ratings on the site.
      </p>
      <p>Affiliate links are marked for search engines as sponsored, and every page that carries them says so at the top and at the bottom.</p>
    </TextPage>
  )
}
