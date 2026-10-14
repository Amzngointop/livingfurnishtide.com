import { NextResponse } from 'next/server'
import { validateZToken } from '@/lib/crypto'
import { products } from '@/data/products'

export const dynamic = 'force-dynamic'

const SECRET_SALT = process.env.SECRET_SALT || 'AlphaOmegaSecureSaltMatrix2026'
const MAX_AGE_SECONDS = parseInt(process.env.TOKEN_MAX_AGE_SECONDS || '300', 10)

const TRACKING_PARAMS_TO_REMOVE = [
  'token',
  'clickid',
  'subid',
  'sub_id',
  'sub1',
  'sub2',
  'sub3',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'zoneid',
  'fbclid',
  'gclid',
  'ref_id',
]

interface Destination {
  url: string
  isExternal: boolean
}

/**
 * Picks a destination uniformly across all items:
 * Every single catalog product has 1 ticket,
 * Twitter has 1 ticket,
 * and /pinterest (dedicated page with pin & button) has 1 ticket.
 */
function getRandomDestination(publicOrigin: string): Destination {
  const pool: Destination[] = [
    { url: 'https://t.co/jZl0ITG5XP', isExternal: true },
    { url: new URL('/pinterest', publicOrigin).toString(), isExternal: false },
    ...(products || []).map((p) => ({
      url: new URL(`/gear/${p.category}#listing-${p.asin}`, publicOrigin).toString(),
      isExternal: false,
    })),
  ]

  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token = requestUrl.searchParams.get('token') || ''

  // Determine external public origin to prevent any internal upstream leaks
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    requestUrl.host
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  const cleanHost = host.includes('localhost') ? 'livingfurnishtide.com' : host
  const publicOrigin = `${proto}://${cleanHost}`

  // Validate cryptographically signed token and TTL (Barrier passed from Node Z)
  const validation = validateZToken(token, SECRET_SALT, MAX_AGE_SECONDS)

  if (!validation.valid) {
    // If token is forged, missing, or expired -> redirect directly to vitrine homepage
    const homeUrl = new URL('/', publicOrigin)
    return NextResponse.redirect(homeUrl, 302)
  }

  // Pick destination
  const destination = getRandomDestination(publicOrigin)

  if (destination.isExternal) {
    // Direct redirect to external link (e.g. Twitter)
    const response = NextResponse.redirect(destination.url, 302)
    response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  }

  // Internal destination (product listing or /pinterest)
  const targetUrl = new URL(destination.url)

  // Copy any legitimate safe query parameters while stripping all ad/tracking tags
  requestUrl.searchParams.forEach((value, key) => {
    const lowerKey = key.toLowerCase()
    if (!TRACKING_PARAMS_TO_REMOVE.includes(lowerKey)) {
      targetUrl.searchParams.set(key, value)
    }
  })

  // 302 Redirect to the destination
  const response = NextResponse.redirect(targetUrl.toString(), 302)

  // Security headers: Truncate HTTP Referer and prevent leaks
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')

  // Set checked=true cookie (used if landing on catalog products)
  response.cookies.set('checked', 'true', {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 86400 * 7,
  })

  // Set internal verification cookie
  response.cookies.set('zg_verified', '1', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600,
  })

  return response
}
