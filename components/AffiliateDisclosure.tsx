import { PageLink } from './PageLink'

const TEXT = {
  top: 'Listings on this page link to Amazon. LivingFurnishTide earns a commission on qualifying purchases made through those links, at no extra cost to the buyer, and no listing is placed or described by commission.',
  bottom:
    'As an Amazon Associate, LivingFurnishTide earns from qualifying purchases. The cards above repeat what each listing states; what a commission pays for is set out on the',
  home: 'The listings in the rail below link to Amazon, and LivingFurnishTide earns from qualifying purchases made through them. Nothing on this site is ordered by what it earns; the full terms are on the',
} as const

export function AffiliateDisclosure({ position, className = '' }: { position: keyof typeof TEXT; className?: string }) {
  return (
    <aside
      className={`border-l-2 border-bone-3 pl-4 text-[14px] leading-relaxed text-bone-3 ${className}`}
      data-disclosure={position}
      aria-label="Affiliate disclosure"
    >
      {position === 'top' ? (
        TEXT.top
      ) : (
        <>
          {TEXT[position]} <PageLink href="/affiliate-disclosure" /> page.
        </>
      )}
    </aside>
  )
}
