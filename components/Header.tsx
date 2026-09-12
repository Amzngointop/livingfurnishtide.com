'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { LogoMark } from './LogoMark'

type Item = { href: string; title: string }

const TOOL_PATHS = ['/tools', '/word-check', '/brand-spread-check']

function isActive(pathname: string, href: string): boolean {
  if (href === '/tools') return TOOL_PATHS.includes(pathname)
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * The panel is a sibling of the header, never a child (R16). It closes on
 * route change, on any link click, on Escape and on a pointerdown outside it
 * that is not the menu button itself (R7). There is no close cross: the same
 * button toggles it.
 */
export function Header({ nav }: { nav: Item[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [offset, setOffset] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const place = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0
      setOffset(Math.max(0, Math.round(bottom)))
    }
    place()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place)
    }
  }, [open])

  return (
    <>
      <header ref={headerRef} className="border-b border-walnut-3 bg-pitch" data-site-header="">
        <div className="wrap flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3 text-bone">
            <LogoMark />
            <span className="font-display text-[22px] leading-none">LivingFurnishTide</span>
          </Link>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-8 font-mono text-[12px] uppercase tracking-[0.1em]">
              {nav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="nav-item" data-pagelink="" aria-current={isActive(pathname, i.href) ? 'page' : undefined}>
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            ref={buttonRef}
            type="button"
            className="btn btn-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="btn-label">
              <Menu className="h-4 w-4" aria-hidden="true" />
              Menu
            </span>
          </button>
        </div>
        <noscript>
          <nav aria-label="Site sections" className="wrap flex flex-wrap gap-x-5 gap-y-1 pb-4 md:hidden">
            {nav.map((i) => (
              <a key={i.href} href={i.href} className="text-link text-[14px]" data-pagelink="">
                {i.title}
              </a>
            ))}
          </nav>
        </noscript>
      </header>
      <div
        id="mobile-menu"
        ref={panelRef}
        className="mobile-panel md:hidden"
        hidden={!open}
        style={{ top: offset, height: `calc(100dvh - ${offset}px)` }}
      >
        <nav aria-label="Menu" className="wrap py-4">
          <ul className="divide-y divide-walnut-3">
            {nav.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  data-pagelink=""
                  className={`block py-4 font-display text-[28px] leading-tight ${isActive(pathname, i.href) ? 'text-patina' : 'text-bone'}`}
                  aria-current={isActive(pathname, i.href) ? 'page' : undefined}
                >
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
