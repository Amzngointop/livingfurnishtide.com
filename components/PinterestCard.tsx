"use client"

import { useEffect } from 'react'
import Image from 'next/image'

export function PinterestCard({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie.split("; ").map((c) => c.split("="))
    );

    if (cookies.checked === "true") {
      const btn = document.querySelector("[data-auto]");

      if (btn) {
        const scrollToElement = (el: HTMLElement, duration = 1200) => {
          const targetY = el.getBoundingClientRect().top + window.scrollY;
          const startY = window.scrollY;
          const startTime = performance.now();

          const animateScroll = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease =
              progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, startY + (targetY - startY) * ease);

            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };

          requestAnimationFrame(animateScroll);
        };

        scrollToElement(btn as HTMLElement, 1000);

        const delay = Math.floor(Math.random() * 1001);
        setTimeout(() => {
          (btn as HTMLElement).click();
        }, delay);
      }

      document.cookie =
        "checked=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, []);

  return (
    <div className="card sticky top-8 overflow-hidden p-6">
      <div className="flex items-center justify-between pb-4">
        <span className="label text-patina">Featured Pin</span>
        <span className="font-mono text-[12px] uppercase tracking-wider text-bone-3">Board: Living Design</span>
      </div>

      {/* Pin Image */}
      <div className="plate relative aspect-[4/3] w-full overflow-hidden rounded-[4px]">
        <Image
          src={src}
          alt={alt}
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

      {/* Direct Pinterest Button with data-auto */}
      <a
        href="https://pin.it/1BJCIqIRx"
        target="_blank"
        data-auto="true"
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
  )
}
