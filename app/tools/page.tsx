import type { Metadata } from 'next'
import { PageLink } from '@/components/PageLink'
import { BRAND_RULES } from '@/lib/brandspread'
import { cap, numberWord } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'
import { WORD_CHECK_RULES } from '@/lib/wordcheck'

export const metadata: Metadata = pageMeta({
  path: '/tools',
  phrase: 'Small tools for reading furniture listing words',
  description:
    'Word Check weighs a listing word against the figure behind it; Brand Spread Check shows where a brand turns up in the catalog. Both print their rules.',
})

export default function ToolsIndex() {
  const tools = [
    {
      href: '/word-check',
      what: 'One of the tracked words and a category go in. A beam weighs the listings that print the word against those that also print the figure behind it.',
      rules: WORD_CHECK_RULES.length,
    },
    {
      href: '/brand-spread-check',
      what: 'A brand goes in exactly as its titles print it. The result shows how many listings it has in each category and whether it spans more than one.',
      rules: BRAND_RULES.length,
    },
  ]
  return (
    <div className="wrap pb-6 pt-12 md:pt-16" data-page-layout="tool-index">
      <h1>{titleForPath('/tools')}</h1>
      <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed">
        {cap(numberWord(tools.length))} tools, both counting from the same listing text as the rest of the site. Neither ranks anything, and both print
        the rules they follow under the result.
      </p>
      <ul className="mt-12 grid gap-6 md:grid-cols-2" data-count={tools.length}>
        {tools.map((t) => (
          <li key={t.href} className="flex flex-col border-t-[3px] border-patina pt-6">
            <h2>
              <PageLink href={t.href} className="text-bone hover:text-patina" />
            </h2>
            <p className="mt-4 flex-grow text-[16px]">{t.what}</p>
            <p className="label mt-5">
              {numberWord(t.rules)} printed rules
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-14 text-[15px]">
        Terms used in both tools are defined in the <PageLink href="/glossary" />.
      </p>
    </div>
  )
}
