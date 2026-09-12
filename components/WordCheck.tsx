'use client'

import { useState } from 'react'
import type { WordSlug } from '@/data/types'
import { SCOPE_OPTIONS, WORD_CHECK_LINES, WORD_CHECK_RULES, WORD_OPTIONS, scopeDisabledReason, wordCheck, type Scope } from '@/lib/wordcheck'
import { listingPath } from '@/lib/routes'
import { OptionGroup } from './OptionGroup'
import { PageLink } from './PageLink'
import { TiltBeam } from './TiltBeam'

const START_WORD: WordSlug = 'sturdy'
const START_SCOPE: Scope = 'all'

export function WordCheck({ idPrefix }: { idPrefix: string }) {
  const [word, setWord] = useState<WordSlug>(START_WORD)
  const [scope, setScope] = useState<Scope>(START_SCOPE)

  const chooseWord = (w: WordSlug) => {
    setWord(w)
    if (scopeDisabledReason(w, scope)) setScope('all')
  }

  const reasons = Object.fromEntries(SCOPE_OPTIONS.map((o) => [o.value, scopeDisabledReason(word, o.value)])) as Record<Scope, string | null>
  const r = wordCheck(word, scope)

  return (
    <div data-tool="word-check">
      <OptionGroup id={`${idPrefix}-word`} label="Word" options={WORD_OPTIONS} value={word} onChange={chooseWord} />
      <OptionGroup id={`${idPrefix}-scope`} label="Category" options={SCOPE_OPTIONS} value={scope} onChange={setScope} reasons={reasons} />
      <div className="mt-6">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setWord(START_WORD)
            setScope(START_SCOPE)
          }}
        >
          <span className="btn-label">Reset</span>
        </button>
      </div>
      <noscript>
        <p className="mt-4 text-[14px] text-bone-3">
          The options need JavaScript. The result below is for Sturdy across all categories, and every word’s counts are in the ledger on the
          words page.
        </p>
      </noscript>

      <div className="mt-10 border-t border-walnut-3 pt-8" aria-live="polite" data-word-check-result={`${r.word}|${r.scope}`}>
        <TiltBeam
          key={`${r.word}-${r.scope}`}
          place="word-check"
          left={{ value: r.left, label: 'Print the word', tone: 'bone' }}
          right={{
            value: r.right,
            label: r.figure ? `Also state ${r.figure}` : 'No printed figure could settle it',
            tone: r.right > 0 ? 'patina' : 'rust',
          }}
          sentence={r.sentence}
        />
        <p className="mt-3 text-[15px]" data-bare-line="">
          {r.bareLine}
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <p className="label label-lg">Print the word and state the figure</p>
            {r.also.length > 0 ? (
              <ul className="mt-3 space-y-2 text-[14px]">
                {r.also.map((p) => (
                  <li key={p.asin}>
                    <PageLink href={listingPath(p)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="not-stated mt-3">No listing in this selection</p>
            )}
          </div>
          <div>
            <p className="label label-lg">Print the word only</p>
            {r.wordOnly.length > 0 ? (
              <ul className="mt-3 space-y-2 text-[14px]">
                {r.wordOnly.map((p) => (
                  <li key={p.asin}>
                    <PageLink href={listingPath(p)} className="text-bone-2 hover:text-bone" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[14px] text-bone-3">Every listing here also states the figure.</p>
            )}
          </div>
        </div>
        <ul className="mt-8 space-y-2 border-l-2 border-walnut-3 pl-4 text-[14px] text-bone-2" data-required-lines="">
          {WORD_CHECK_LINES.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <p className="label label-lg">How it counts</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] text-bone-2" data-rules="">
          {WORD_CHECK_RULES.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
