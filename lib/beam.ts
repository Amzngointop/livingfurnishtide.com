/*
 * The Tilt Beam. The angle is the only thing the drawing adds, and it never
 * carries meaning alone: both counts are always printed beside it (R6).
 */

export const DEGREES_PER_LISTING = 1.5
export const MAX_TILT = 12

/** Positive tilts the right end down. The heavier side goes down. */
export function tiltAngle(left: number, right: number): number {
  const raw = (right - left) * DEGREES_PER_LISTING
  return Math.max(-MAX_TILT, Math.min(MAX_TILT, raw))
}

export const BEAM_RULE = `The beam tips toward the larger count by ${DEGREES_PER_LISTING} degrees for each listing of difference and stops at ${MAX_TILT} degrees; both counts are printed beside it.`
