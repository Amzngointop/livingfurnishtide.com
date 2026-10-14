import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    node: 'node-x-vitrine',
    domain: 'livingfurnishtide.com',
    timestamp: new Date().toISOString(),
  })
}
