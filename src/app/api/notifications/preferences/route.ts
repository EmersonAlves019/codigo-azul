import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'
import { getAuthenticatedUserFromRequest } from '@/lib/api-utils'

export async function GET() {
  try {
    const userId = await getAuthenticatedUserFromRequest()
    
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    return NextResponse.json({ preferences })
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserFromRequest()
    const body = await request.json()

    const existing = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    const preferences = existing
      ? await prisma.notificationPreference.update({
          where: { id: existing.id },
          data: body,
        })
      : await prisma.notificationPreference.create({
          data: {
            userId,
            ...body,
          },
        })

    return NextResponse.json({ preferences })
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
