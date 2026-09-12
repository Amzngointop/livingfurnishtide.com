import { categories } from '@/data/gear'
import { numbers } from '@/data/numbers'
import { pieces } from '@/data/pieces'
import { words } from '@/data/words'
import { SITE } from '@/lib/seo'
import { PageLink } from './PageLink'

function Column({ head, links }: { head: string; links: string[] }) {
  return (
    <div>
      <p className="label label-lg mb-3">
        <PageLink href={head} className="hover:text-bone" />
      </p>
      <ul className="space-y-2 text-[14px] leading-snug">
        {links.map((href) => (
          <li key={href}>
            <PageLink href={href} className="text-bone-2 hover:text-bone" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Five columns on pitch, every list complete. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-walnut-3 bg-pitch" data-section-layout="footer-five-columns">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <Column head="/words" links={words.map((w) => `/words/${w.slug}`)} />
        <Column head="/numbers" links={numbers.map((n) => `/numbers/${n.slug}`)} />
        <Column head="/pieces" links={pieces.map((p) => `/pieces/${p.slug}`)} />
        <Column head="/gear" links={categories.map((c) => `/gear/${c.slug}`)} />
        <Column head="/tools" links={['/word-check', '/brand-spread-check', '/glossary', '/about', '/contact', '/privacy', '/terms', '/affiliate-disclosure']} />
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-walnut-3 py-6 text-[13px] text-bone-3 md:flex-row md:justify-between">
        <p>
          {SITE.name} · {SITE.address} · <a href={`mailto:${SITE.email}`} className="text-link">{SITE.email}</a>
        </p>
        <p>Counts reflect the listing text collected for this catalog in {SITE.year}.</p>
      </div>
    </footer>
  )
}
