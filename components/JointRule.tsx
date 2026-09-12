/** Decorative divider: a thin line broken by a notch and a patina dowel, like two carcass panels meeting. Carries no information. */
export function JointRule() {
  return (
    <div data-joint-rule="" aria-hidden="true" className="wrap flex h-[14px] items-center py-10 md:py-14">
      <span className="h-px flex-1 bg-walnut-3" />
      <svg width="46" height="14" viewBox="0 0 46 14" className="shrink-0">
        <path d="M0 7.5 H14 V2.5 H32 V7.5 H46" fill="none" stroke="var(--walnut-3)" strokeWidth="1" />
        <circle cx="23" cy="8" r="2.5" fill="var(--patina)" />
      </svg>
      <span className="h-px flex-1 bg-walnut-3" />
    </div>
  )
}
