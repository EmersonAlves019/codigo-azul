import { NextResponse } from 'next/server'
import { getAuthenticatedUserFromRequest } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma-client'

export async function GET() {
  try {
    const userId = await getAuthenticatedUserFromRequest()

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ subscriptions: [] }, { status: 200 })
    }
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}
