import { Fragment, type ReactNode } from 'react'
import type { ProductFacts } from '@/data/types'
import { fill } from '@/lib/fill'

/** Fill tokens, then render [[seller words]] as a marked quotation. */
export function renderProse(text: string, product?: ProductFacts): ReactNode[] {
  const filled = fill(text, product)
  return filled.split(/\[\[([^\]]+)\]\]/).map((part, i) =>
    i % 2 === 1 ? (
      <q key={i} className="seller" data-seller-words="">
        {part}
      </q>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

export function plainProse(text: string, product?: ProductFacts): string {
  return fill(text, product).replace(/\[\[([^\]]+)\]\]/g, '$1')
}

export function Prose({
  text,
  product,
  as: Tag = 'p',
  className,
}: {
  text: string
  product?: ProductFacts
  as?: 'p' | 'span' | 'li' | 'dd' | 'h2' | 'h3' | 'div'
  className?: string
}) {
  return <Tag className={className}>{renderProse(text, product)}</Tag>
}

/** The visible marker every page with seller quotes carries. */
export function SellerNote({ className = '' }: { className?: string }) {
  return (
    <p className={`label ${className}`} data-seller-block="">
      Words in quotation marks are the sellers’ own, quoted from the listings
    </p>
  )
}
