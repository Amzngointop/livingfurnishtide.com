'use client'

import { useState } from 'react'
import { BRAND_LINES, BRAND_OPTIONS, BRAND_RULES, brandSpread, brandSummary } from '@/lib/brandspread'
import { listingPath } from '@/lib/routes'
import { OptionGroup } from './OptionGroup'
import { PageLink } from './PageLink'

const START = brandSummary().top.brand

export function BrandSpreadCheck({ idPrefix }: { idPrefix: string }) {
  const [brand, setBrand] = useState<string>(START)
  const r = brandSpread(brand)
  const s = brandSummary()

  return (
    <div data-tool="brand-spread-check">
      <OptionGroup id={`${idPrefix}-brand`} label="Brand, as printed at the start of the title" options={BRAND_OPTIONS} value={brand} onChange={setBrand} />
      <div className="mt-6">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setBrand(START)}>
          <span className="btn-label">Reset</span>
        </button>
      </div>
      <noscript>
        <p className="mt-4 text-[14px] text-bone-3">The brand options need JavaScript. The result below is for {START}.</p>
      </noscript>

      <div className="mt-8 border-t border-walnut-3 pt-6" aria-live="polite" data-brand-result={r.brand}>
        <p className="text-[18px] text-bone">{r.headline}</p>
        <table className="data-table mt-4">
          <caption className="sr-only">Listings for {r.brand} by category</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col" className="!text-right">
                Listings
              </th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.category}>
                <th scope="row" className="!font-body !text-[14px] !normal-case !tracking-normal !text-bone-2">
                  {row.title}
                </th>
                <td className={`figure text-right ${row.count > 0 ? 'text-patina' : 'text-bone-3'}`}>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-[15px]" data-spread-flag={r.spread ? 'yes' : 'no'}>
          {r.spread
            ? `Spread across more than one category: yes, ${r.categoryCount} of ${r.rows.length}.`
            : 'Spread across more than one category: no, every listing sits in a single category.'}
        </p>
        <p className="mt-2 text-[15px]" data-single-flag={r.single ? 'yes' : 'no'}>
          {r.singleLine}
        </p>
        <ul className="mt-4 space-y-1.5 text-[14px]">
          {r.listings.map((p) => (
            <li key={p.asin}>
              <PageLink href={listingPath(p)} className="text-bone-2 hover:text-bone" />
            </li>
          ))}
        </ul>
        <p className="mt-5 border-l-2 border-walnut-3 pl-4 text-[14px] text-bone-2">{BRAND_LINES[0]}</p>
        <p className="mt-2 text-[13px] text-bone-3">
          {s.unbranded} {s.unbranded === 1 ? 'title names' : 'titles name'} no brand and {s.unbranded === 1 ? 'is' : 'are'} left out of the brand list.
        </p>
      </div>

      <div className="mt-8">
        <p className="label label-lg">How it matches</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] text-bone-2" data-rules="">
          {BRAND_RULES.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
