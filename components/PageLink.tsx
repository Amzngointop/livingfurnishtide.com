import Link from 'next/link'
import { titleForPath } from '@/lib/routes'

/**
 * R13: an internal link whose text is always the target page's title.
 * It takes no children, and an unknown path throws during the build.
 */
export function PageLink({
  href,
  className = 'text-link',
  button = false,
  ...rest
}: {
  href: string
  className?: string
  button?: boolean
  children?: never
  'aria-current'?: 'page' | undefined
}) {
  if ((rest as { children?: unknown }).children !== undefined) {
    throw new Error(`PageLink to ${href} was given children; its text comes from the page title`)
  }
  const title = titleForPath(href)
  return (
    <Link href={href} className={className} aria-current={rest['aria-current']} data-pagelink="">
      {button ? <span className="btn-label">{title}</span> : title}
    </Link>
  )
}
