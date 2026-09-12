import type { Metadata } from 'next'
import { TextPage } from '@/components/TextPage'
import { SITE } from '@/lib/seo'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/contact',
  phrase: 'Contact details for corrections to the listing counts',
  description:
    'How to reach LivingFurnishTide about a count that looks wrong, a listing that changed its wording, or a source that no longer says what a page quotes.',
})

export default function ContactPage() {
  return (
    <TextPage
      path="/contact"
      lede="Corrections are the most useful mail this site gets: a count that does not match a listing, a listing whose wording has changed, or a source that has moved."
    >
      <p>
        Email:{' '}
        <a href={`mailto:${SITE.email}`} className="text-link">
          {SITE.email}
        </a>
      </p>
      <p>Post: {SITE.name}, {SITE.address}</p>
      <p>
        A correction is easiest to act on when it names the page, the listing and the words in question. The site cannot answer questions about
        assembling, repairing or fitting a particular piece; those belong to its manufacturer.
      </p>
    </TextPage>
  )
}
