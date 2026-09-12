import type { ReactNode } from 'react'
import { titleForPath } from '@/lib/routes'

/** Service pages: one narrow column, H1 from the registry. */
export function TextPage({ path, lede, children }: { path: string; lede: string; children: ReactNode }) {
  return (
    <div className="wrap max-w-[760px] pb-10 pt-12 md:pt-16" data-page-layout="service-column">
      <h1>{titleForPath(path)}</h1>
      <p className="mt-5 text-[18px] leading-relaxed text-bone-2">{lede}</p>
      <div className="prose-body mt-10 space-y-4 text-[16px] [&_h2]:mt-10 [&_h2]:text-[28px]">{children}</div>
    </div>
  )
}
