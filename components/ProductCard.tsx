import Image from 'next/image'
import type { Product } from '@/data/types'
import { renderProse } from './Prose'

/**
 * R9: the card stretches to the row, the variable block grows, the button
 * sits at the bottom. The badge slot exists only when there is a badge, and
 * its basis is printed. Product photos sit on a light plate.
 */
export function ProductCard({ p }: { p: Product }) {
  return (
    <article id={`listing-${p.asin}`} data-product-card={p.asin} className="card flex h-full scroll-mt-6 flex-col p-4">
      <div className="plate relative aspect-square w-full overflow-hidden">
        <Image
          src={p.imageUrl}
          alt={p.name}
          fill
          sizes="(min-width: 1200px) 270px, (min-width: 768px) 44vw, 88vw"
          className="object-contain p-5"
        />
      </div>
      {p.badge ? (
        <div className="mt-4 border-l-2 border-patina pl-3" data-badge="">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-patina">{p.badge.label}</p>
          <p className="mt-1 text-[13px] leading-snug text-bone-3" data-badge-basis="">
            {renderProse(p.badge.basis, p)}
          </p>
        </div>
      ) : null}
      <h3 className="mt-4 text-[17px]">{p.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed">{renderProse(p.summary, p)}</p>
      {p.alsoCalled ? (
        <p className="mt-3 rounded-[4px] border border-walnut-3 p-2.5 text-[13px] leading-snug text-bone-2" data-note="">
          {p.shortLabel} also calls itself a {p.alsoCalled.as}, in its {p.alsoCalled.where}. The site does not decide which it is.
        </p>
      ) : null}
      {p.powered && !p.statesSafetyListing ? (
        <p className="mt-3 rounded-[4px] border border-walnut-3 p-2.5 text-[13px] leading-snug text-bone-2" data-safety-note="">
          {p.shortLabel}: no UL or ETL listing is named. Recorded as not stated, with no conclusion drawn either way.
        </p>
      ) : null}
      {p.note ? (
        <p className="mt-3 rounded-[4px] border border-walnut-3 p-2.5 text-[13px] leading-snug text-bone-2" data-listing-note="">
          {renderProse(p.note, p)}
        </p>
      ) : null}
      <div className="flex-grow">
        <p className="label mt-4">What the listing states</p>
        <ul className="mt-1.5 space-y-1 text-[14px] leading-snug">
          {p.pros.map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden="true" className="text-patina">+</span>
              <span>{renderProse(x, p)}</span>
            </li>
          ))}
        </ul>
        <p className="label mt-4">What it leaves out</p>
        <ul className="mt-1.5 space-y-1 text-[14px] leading-snug">
          {p.cons.map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden="true" className="text-rust">–</span>
              <span>{renderProse(x, p)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] leading-snug text-bone-3">
          <span className="label mr-1.5">Suits</span>
          {renderProse(p.bestFor, p)}
        </p>
      </div>
      <a href={p.affiliateUrl} className="btn mt-5 justify-center" rel="nofollow sponsored noopener" target="_blank" data-affiliate="">
        <span className="btn-label">Listing on Amazon</span>
      </a>
    </article>
  )
}
