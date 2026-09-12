import { words } from '@/data/words'
import { renderProse } from './Prose'
import { PageLink } from './PageLink'

/**
 * The Word Ledger: one row per word, with the two counts side by side and a
 * bar under each so the gap reads at a glance. Both counts are printed as
 * digits; the bars add nothing the digits do not say.
 */
export function WordLedger({ caption }: { caption: string }) {
  const max = Math.max(...words.map((w) => w.usedBy.length))
  return (
    <div className="scroll-x">
      <table className="data-table min-w-[860px]" data-word-ledger="">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[17%]">The word</th>
            <th scope="col" className="w-[27%]">What it would have to mean</th>
            <th scope="col" className="w-[22%]">The figure that would settle it</th>
            <th scope="col" className="w-[17%]">Listings using the word</th>
            <th scope="col" className="w-[17%]">Listings also stating the figure</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w) => {
            const used = w.usedBy.length
            const also = w.alsoStatingNumber.length
            return (
              <tr key={w.slug} data-word-row={w.slug} data-used={used} data-also={also}>
                <th scope="row" className="!font-display !text-[22px] !normal-case !tracking-normal !leading-tight">
                  <PageLink href={`/words/${w.slug}`} className="text-bone hover:text-patina" />
                </th>
                <td className="text-[15px]">{renderProse(w.whatItWouldMean)}</td>
                <td className="text-[15px]">
                  {renderProse(w.settlingFigure)}
                  {w.settlingNumberSlug ? (
                    <span className="mt-1 block text-[13px]">
                      <PageLink href={`/numbers/${w.settlingNumberSlug}`} />
                    </span>
                  ) : null}
                </td>
                <td>
                  <span className="figure text-[30px] leading-none text-bone">{used}</span>
                  <span className="mt-2 block h-1.5 bg-bone-3" style={{ width: `${(used / max) * 100}%` }} aria-hidden="true" />
                </td>
                <td>
                  <span className={`figure text-[30px] leading-none ${also === 0 ? 'text-rust' : 'text-patina'}`}>{also}</span>
                  {also === 0 ? <span className="not-stated ml-2">none</span> : null}
                  <span
                    className={`mt-2 block h-1.5 ${also === 0 ? 'border-t border-dashed border-rust-d' : 'bg-patina'}`}
                    style={{ width: also === 0 ? '100%' : `${(also / max) * 100}%` }}
                    aria-hidden="true"
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
