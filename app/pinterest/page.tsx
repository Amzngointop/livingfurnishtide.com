import type { Metadata } from 'next'
import Image from 'next/image'
import { photos } from '@/data/photos'
import { pageMeta } from '@/lib/seo'

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
          <div className="card sticky top-8 overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4">
              <span className="label text-patina">Featured Pin</span>
              <span className="font-mono text-[12px] uppercase tracking-wider text-bone-3">Board: Living Design</span>
            </div>

            {/* Pin Image */}
            <div className="plate relative aspect-[4/3] w-full overflow-hidden rounded-[4px]">
              <Image
                src={pinPhoto.src}
                alt={pinPhoto.alt}
                fill
                sizes="(min-width: 1024px) 380px, 90vw"
                className="object-cover"
              />
            </div>

            {/* Pin Description */}
            <div className="mt-5 space-y-2">
              <h3 className="text-[19px]">Modular Interior & Reading Room Harmony</h3>
              <p className="text-[14px] leading-relaxed text-bone-3">
                Curated visual inspiration exploring warm ambient lighting, dual armchairs, and floor-to-ceiling modular
                bookshelf architecture designed for contemporary living quarters.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded bg-walnut px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-bone-3">
                #HomeDecor
              </span>
              <span className="rounded bg-walnut px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-bone-3">
                #ModularStorage
              </span>
              <span className="rounded bg-walnut px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-bone-3">
                #LivingSpace
              </span>
            </div>

            {/* Direct Pinterest Button */}
            <a
              href="https://pin.it/1BJCIqIRx"
              target="_blank"
              rel="nofollow sponsored noopener"
              className="btn mt-6 w-full justify-center"
              style={{
                backgroundColor: '#e60023',
                borderColor: '#e60023',
                color: '#ffffff',
              }}
            >
              <span className="btn-label flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.38.03-3.41l1-4.25s-.25-.5-.25-1.25c0-1.17.68-2.05 1.53-2.05.72 0 1.07.54 1.07 1.19 0 .73-.46 1.81-.7 2.82-.2.85.42 1.54 1.25 1.54 1.5 0 2.66-1.58 2.66-3.87 0-2.02-1.45-3.44-3.53-3.44-2.4 0-3.81 1.8-3.81 3.66 0 .73.28 1.5.63 1.93a.3.3 0 0 1 .07.29c-.08.33-.25 1.03-.29 1.18-.05.19-.16.23-.37.14-1.39-.65-2.26-2.68-2.26-4.32 0-3.52 2.56-6.75 7.37-6.75 3.87 0 6.88 2.76 6.88 6.45 0 3.85-2.43 6.95-5.8 6.95-1.13 0-2.2-.59-2.56-1.29l-.7 2.66c-.25.98-.94 2.21-1.4 2.96A12 12 0 1 0 12 0z" />
                </svg>
                <span>View Pin on Pinterest</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
