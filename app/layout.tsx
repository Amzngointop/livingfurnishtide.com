import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Gloock, Mona_Sans } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { NAV, titleForPath } from '@/lib/routes'
import { SITE } from '@/lib/seo'

/*
 * Instrument Serif (ChillVentVale) and Geist (ChargeCaseYard, ScreenSoundLoft)
 * are already used in the series, so the display serif is Gloock and the body
 * face is Mona Sans. Geist Mono was free and stays.
 */
const display = Gloock({ subsets: ['latin'], weight: ['400'], variable: '--font-display', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })
const body = Mona_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: '#120E0C',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = NAV.map((href) => ({ href, title: titleForPath(href) }))
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header nav={nav} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
