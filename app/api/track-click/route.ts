import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

interface ClickData {
  asin?: string
  name?: string
  category?: string
  isAuto?: boolean
  url?: string
  timestamp?: string
  ip?: string
  userAgent?: string
  referer?: string
}

function recordClick(data: ClickData) {
  const lineObj = {
    timestamp: data.timestamp || new Date().toISOString(),
    ip: data.ip || 'unknown',
    asin: data.asin || 'unknown',
    name: data.name || 'unknown',
    category: data.category || 'unknown',
    type: data.isAuto ? 'AUTO' : 'MANUAL',
    isAuto: Boolean(data.isAuto),
    referer: data.referer || '',
    userAgent: data.userAgent || '',
  }

  const logLine = JSON.stringify(lineObj) + '\n'
  console.log('[AMAZON_CLICK]', logLine.trim())

  const targetPaths = [
    '/var/log/nginx/amazon-clicks.log',
    path.join(process.cwd(), 'logs', 'amazon-clicks.log'),
  ]

  for (const targetPath of targetPaths) {
    try {
      const dir = path.dirname(targetPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.appendFileSync(targetPath, logLine, 'utf-8')
      break
    } catch {
      // Continue to next path
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    recordClick({
      ...body,
      ip,
      userAgent,
      referer,
    })

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Error tracking Amazon click:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    const asin = url.searchParams.get('asin') || ''
    const name = url.searchParams.get('name') || ''
    const category = url.searchParams.get('category') || ''
    const isAuto =
      url.searchParams.get('isAuto') === 'true' ||
      url.searchParams.get('auto') === '1'

    recordClick({
      asin,
      name,
      category,
      isAuto,
      ip,
      userAgent,
      referer,
    })

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Error tracking Amazon click:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
