import type { CSSProperties } from 'react'
import { tiltAngle } from '@/lib/beam'

export type Tone = 'bone' | 'patina' | 'rust'

export interface Pan {
  value: number
  label: string
  tone: Tone
}

const FILL: Record<Tone, string> = { bone: 'var(--bone)', patina: 'var(--patina)', rust: 'var(--rust-d)' }
const TEXT: Record<Tone, string> = { bone: 'text-bone', patina: 'text-patina', rust: 'text-rust' }

/**
 * The Tilt Beam, used in exactly three places: a word page header, the Word
 * Check result and a number page header. The tilt is never the only carrier
 * of meaning: both counts sit beside it in digits, and the sentence gives
 * them in words (R6).
 */
export function TiltBeam({
  place,
  left,
  right,
  sentence,
  className = '',
}: {
  place: 'word-header' | 'word-check' | 'number-header'
  left: Pan
  right: Pan
  sentence: string
  className?: string
}) {
  const tilt = tiltAngle(left.value, right.value)
  const armStyle = { '--tilt': `${tilt}deg`, '--pivot-x': '300px', '--pivot-y': '100px' } as CSSProperties
  return (
    <figure
      className={`w-full ${className}`}
      data-tilt-beam={place}
      data-left={left.value}
      data-right={right.value}
      data-tilt={tilt}
    >
      <svg viewBox="0 0 600 196" className="mx-auto block w-full max-w-[720px]" aria-hidden="true">
        <rect x="222" y="186" width="156" height="4" fill="var(--walnut-3)" />
        <polygon points="266,186 334,186 300,104" fill="var(--walnut-3)" />
        <g className="beam-arm" style={armStyle}>
          <rect x="40" y="96" width="520" height="8" fill="var(--bone-3)" />
          <line x1="90" y1="104" x2="90" y2="138" stroke="var(--bone-3)" strokeWidth="2" />
          <line x1="510" y1="104" x2="510" y2="138" stroke="var(--bone-3)" strokeWidth="2" />
          <path d="M36 138 H144 Q144 166 90 166 Q36 166 36 138 Z" fill={FILL[left.tone]} />
          <path d="M456 138 H564 Q564 166 510 166 Q456 166 456 138 Z" fill={FILL[right.tone]} />
        </g>
        <circle cx="300" cy="100" r="6" fill="var(--patina)" />
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-6 border-t border-walnut-3 pt-4">
        <div>
          <p className={`figure text-[44px] leading-none md:text-[56px] ${TEXT[left.tone]}`} data-pan="left">
            {left.value}
          </p>
          <p className="label mt-2">{left.label}</p>
        </div>
        <div className="text-right">
          <p className={`figure text-[44px] leading-none md:text-[56px] ${TEXT[right.tone]}`} data-pan="right">
            {right.value}
          </p>
          <p className="label mt-2">
            {right.label}
            {right.value === 0 ? <span className="not-stated ml-1 block">none printed</span> : null}
          </p>
        </div>
      </div>
      <figcaption className="mt-4 text-[15px] text-bone-2" data-beam-sentence="">
        {sentence}
      </figcaption>
    </figure>
  )
}
