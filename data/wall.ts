/*
 * The Word Wall. Every word is printed by at least one seller in this
 * catalog (checked by scripts/check-numbers.mjs). Exactly one slot holds a
 * figure instead, read from the data. `size` runs 1 to 5 (18 to 72px);
 * `wide` words drop out below 640px so the field shrinks to a few lines
 * with the figure still in the first screen.
 */

export interface WallSlot {
  text: string
  size: 1 | 2 | 3 | 4 | 5
  wide?: boolean
}

export const wall: WallSlot[] = [
  { text: 'heavy duty', size: 3 },
  { text: 'sturdy', size: 5 },
  { text: 'stable', size: 2, wide: true },
  { text: 'modern', size: 1 },
  { text: 'ergonomic', size: 4 },
  { text: 'breathable', size: 2 },
  { text: 'space-saving', size: 3, wide: true },
  { text: 'narrow', size: 1, wide: true },
  { text: 'reinforcement', size: 2 },
  { text: 'stackable', size: 4, wide: true },
  { text: 'quiet', size: 1 },
  { text: 'expandable', size: 3 },
  { text: 'tool-free', size: 1, wide: true },
  { text: 'large-capacity', size: 2, wide: true },
  { text: 'seamless', size: 2 },
  { text: 'non-slip', size: 1, wide: true },
  { text: 'tall', size: 4 },
  { text: 'rustic', size: 2, wide: true },
  { text: 'easy-pull', size: 1, wide: true },
  { text: 'adjustable', size: 3, wide: true },
  { text: 'silent', size: 2, wide: true },
  { text: 'wide', size: 3 },
  { text: 'smooth', size: 1, wide: true },
  { text: 'simple', size: 2, wide: true },
  { text: 'anti-tip', size: 4 },
  { text: 'dense', size: 1, wide: true },
  { text: 'reversible', size: 2, wide: true },
  { text: 'customizable', size: 1, wide: true },
  { text: 'small', size: 3, wide: true },
  { text: 'vertical', size: 2, wide: true },
  { text: 'flip-up', size: 1, wide: true },
  { text: 'open', size: 2, wide: true },
  { text: 'matte', size: 1, wide: true },
  { text: 'large', size: 3, wide: true },
  { text: 'easy', size: 1, wide: true },
]

/** Index in the wall where the figure replaces a word. Early, so it stays in the first screen on a phone. */
export const FIGURE_SLOT = 2
