import type { Metadata } from 'next'

export const SITE = {
  name: 'LivingFurnishTide',
  domain: 'livingfurnishtide.com',
  url: 'https://livingfurnishtide.com',
  email: 'info@livingfurnishtide.com',
  address: '2217 Alder Ridge Road, Suite 4, Madison, WI 53704',
  year: 2026,
} as const

export const SUFFIX = `| ${SITE.name}`

/** The one place a <title> is built: a descriptive phrase, then 2026, then the suffix once (R17). */
export function titleFor(phrase: string): string {
  const clean = phrase.trim()
  if (clean.length < 12) throw new Error(`Title phrase too short: "${phrase}"`)
  if (/livingfurnishtide/i.test(clean)) throw new Error(`Title phrase must not contain the site name: "${phrase}"`)
  if (/\b2026\b/.test(clean)) throw new Error(`Title phrase must not carry the year itself: "${phrase}"`)
  const title = `${clean}, ${SITE.year} ${SUFFIX}`
  if (title.split(SUFFIX).length !== 2) throw new Error(`Suffix must occur exactly once: "${title}"`)
  if (title.trim().toLowerCase() === SITE.name.toLowerCase()) throw new Error('Title equals the bare site name')
  return title
}

export function absoluteUrl(path: string): string {
  if (!path.startsWith('/')) throw new Error(`Path must start with a slash: ${path}`)
  return path === '/' ? SITE.url : `${SITE.url}${path}`
}

export function pageMeta({ path, phrase, description }: { path: string; phrase: string; description: string }): Metadata {
  const length = description.length
  if (length < 140 || length > 160) {
    throw new Error(`metaDescription for ${path} is ${length} characters; it must be 140 to 160: "${description}"`)
  }
  const title = titleFor(phrase)
  const url = absoluteUrl(path)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: SITE.name, locale: 'en_US' },
    twitter: { card: 'summary', title, description },
  }
}
