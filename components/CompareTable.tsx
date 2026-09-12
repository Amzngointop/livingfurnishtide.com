import type { ColumnKey } from '@/data/gear'
import type { Product } from '@/data/types'
import { liveColumns } from '@/lib/columns'

/**
 * R2/R3: rendered only for two or more rows; a column empty or identical on
 * every row is left out, and the page says which and why.
 */
export function CompareTable({ rows, columns, groupTitle }: { rows: Product[]; columns: ColumnKey[]; groupTitle: string }) {
  if (rows.length < 2) throw new Error(`CompareTable for ${groupTitle} called with ${rows.length} row`)
  const { kept, dropped } = liveColumns(rows, columns)
  return (
    <div className="mt-8">
      <div className="scroll-x rounded-[6px] border border-walnut-3">
        <table className="data-table min-w-[640px]" data-compare-table="">
          <caption className="sr-only">{groupTitle}: what each listing states</caption>
          <thead>
            <tr>
              <th scope="col">Listing</th>
              {kept.map((c) => (
                <th key={c.key} scope="col" data-column={c.key}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.asin}>
                <th scope="row" className="!font-body !text-[14px] !normal-case !tracking-normal !text-bone">
                  {r.shortLabel}
                </th>
                {kept.map((c) => {
                  const v = c.value(r)
                  return (
                    <td key={c.key} className="text-[14px]">
                      {v === null ? <span className="not-stated">Not stated</span> : v}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {dropped.length > 0 ? (
        <p className="mt-2 text-[13px] text-bone-3" data-dropped-columns="">
          Left out of the {groupTitle} table:{' '}
          {dropped.map((d, i) => (
            <span key={d.column.key}>
              {i > 0 ? '; ' : ''}
              {d.column.header}, {d.reason === 'empty' ? 'not stated on any row' : 'the same on every row'}
            </span>
          ))}
          .
        </p>
      ) : null}
    </div>
  )
}
