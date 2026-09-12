/** The site mark: a beam on a fulcrum. Decorative next to the site name. */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect x="3" y="12" width="26" height="2.5" fill="var(--patina)" transform="rotate(-8 16 13)" />
      <polygon points="11,28 21,28 16,15" fill="var(--bone-3)" />
      <circle cx="16" cy="13.2" r="2" fill="var(--bone)" />
    </svg>
  )
}
