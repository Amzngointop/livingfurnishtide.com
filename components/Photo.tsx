import Image from 'next/image'
import type { Photo as PhotoData } from '@/data/photos'

function Credit({ photo, className = '' }: { photo: PhotoData; className?: string }) {
  return (
    <figcaption className={`mt-2 text-right ${className}`}>
      <a href={photo.creditUrl} className="label hover:text-bone" rel="noopener noreferrer" target="_blank">
        Photo: {photo.credit} on Pexels
      </a>
    </figcaption>
  )
}

/** A stock photo slot. `sizes` is required (R5). No text is ever set over the pixels. */
export function Photo({ photo, sizes, className = '' }: { photo: PhotoData; sizes: string; className?: string }) {
  return (
    <figure className={className} data-photo={photo.id}>
      <div className="relative w-full overflow-hidden rounded-[6px] bg-walnut-3" style={{ aspectRatio: photo.aspect }}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <Credit photo={photo} />
    </figure>
  )
}

/** Full-bleed spread with only a credit, set below the image rather than on it. */
export function Spread({ photo, height }: { photo: PhotoData; height: string }) {
  return (
    <section data-section-layout="full-bleed-photo" aria-label="Photograph">
      <figure className="w-full" data-photo={photo.id}>
        <div className="relative w-full overflow-hidden bg-walnut-3" style={{ height }}>
          <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
        </div>
        <Credit photo={photo} className="wrap" />
      </figure>
    </section>
  )
}
