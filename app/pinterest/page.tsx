import type { Metadata } from 'next'
import { photos } from '@/data/photos'
import { pageMeta } from '@/lib/seo'
import { PinterestCard } from '@/components/PinterestCard'

export const metadata: Metadata = pageMeta({
  path: '/pinterest',
  phrase: 'Pinterest furniture inspiration and room ideas',
  description:
    'Curated Pinterest pin collections and interior design ideas for space-saving modular furniture, functional entryway organizers, and modern room layouts.',
})

export default function PinterestPage() {
  const pinPhoto = photos['spread-pieces']

  return (
    <div className="wrap pb-16 pt-12 md:pt-16">
      {/* Page Header */}
      <div className="max-w-[780px]">
        <p className="label label-lg text-patina">Visual Pinboard · Space & Storage</p>
        <h1 className="mt-3">Pinterest Inspiration</h1>
        <p className="mt-5 text-[18px] leading-relaxed text-bone-2">
          Interior layouts built around modular casegoods, entryway organization, and vertical floor space efficiency.
        </p>
      </div>

      <div className="rule-thick mt-10" />

      {/* Main Content Grid: Mini-Blog + Pin Card */}
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Mini-Blog Editorial */}
        <div className="space-y-8 lg:col-span-7">
          <section className="space-y-4">
            <h2>Spatial Harmony & Modular Storage</h2>
            <p className="text-[15.5px] leading-relaxed text-bone-2">
              Modern interior design relies heavily on functional simplicity. Rather than overwhelming compact floor plans
              with bulky casework, contemporary arrangements prioritize open shelving, tiered vertical shoe racks,
              and low-profile dressers that keep sightlines clear while preserving storage capacity.
            </p>
            <p className="text-[15.5px] leading-relaxed text-bone-2">
              By pairing warm natural walnut tones with structural metal uprights, living areas achieve a grounded, architectural
              presence. Lighting plays a central role: soft ambient perimeter lamps bounce light off matte finishes, preventing
              narrow corridors or compact alcoves from feeling enclosed.
            </p>
          </section>

          <section className="space-y-4">
            <h2>Proportions, Clearance & Daily Movement</h2>
            <p className="text-[15.5px] leading-relaxed text-bone-2">
              Every curated pin focuses on intentional proportion. Maintaining at least thirty-six inches of unobstructed
              walkway in front of storage units preserves open room without cramped bottlenecks. Floating shelves and
              modular bookcases extend utility upward toward the ceiling, capturing vertical real estate that otherwise sits vacant.
            </p>
            <p className="text-[15.5px] leading-relaxed text-bone-2">
              Whether arranging a dedicated home corner with a desk or outfitting an entryway with
              expandable tiered racks, balanced dimensional proportions remain the foundation of enduring residential aesthetics.
            </p>
          </section>
        </div>

        {/* Right Column: Visual Pin Card with Direct Action Button */}
        <div className="lg:col-span-5">
          <PinterestCard src={pinPhoto.src} alt={pinPhoto.alt} />
        </div>
      </div>
    </div>
  )
}
