import type { Metadata } from 'next'
import { TextPage } from '@/components/TextPage'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/privacy',
  phrase: 'Privacy on a static site with no accounts or tracking',
  description:
    'LivingFurnishTide is a static site: no accounts, no analytics scripts, nothing stored in the browser, and what changes once a link leads to Amazon.',
})

export default function PrivacyPage() {
  return (
    <TextPage
      path="/privacy"
      lede="This is a static site. It has no accounts, no forms, no analytics scripts and nothing it writes to the browser’s storage."
    >
      <h2>What the site keeps</h2>
      <p>
        The web server hosting these pages may keep standard access logs, as most servers do: the address a request came from and the page asked
        for. Those logs are used to keep the site running and are not sold or shared for advertising.
      </p>
      <h2>Tools on the page</h2>
      <p>The tools on this site run entirely in the browser tab. Choices made in them are not sent anywhere and are gone when the page is closed.</p>
      <h2>Links that leave the site</h2>
      <p>
        Product links go to Amazon, and source links go to the organizations that publish those documents. Once a link is followed, that website’s
        own privacy policy applies, including any cookies it sets.
      </p>
      <h2>Changes</h2>
      <p>If this page changes, the new version replaces it here, and the date at the foot of every page reflects the year of the current version.</p>
    </TextPage>
  )
}
