import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'
import { initializeFirebase } from '@/lib/firebase/admin-config'
import { getAuthenticatedUserFromRequest } from '@/lib/api-utils'

export async function POST(request: Request) {
  try {
    // Initialize Firebase Admin if not already initialized
    const admin = initializeFirebase()
    
    const userId = await getAuthenticatedUserFromRequest()

    const body = await request.json()
    const { title, body: messageBody, url } = body

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    // Get user's subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        enabled: true,
      },
    })

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active subscriptions found' },
        { status: 400 }
      )
    }

    const results = []

    // Send to each subscription
    for (const subscription of subscriptions) {
      try {
        await admin.messaging().send({
          token: subscription.fcmToken,
          notification: {
            title,
            body: messageBody,
          },
          data: {
            url: url || '/',
          },
          android: {
            priority: 'high',
          },
        })

        results.push({
          token: subscription.fcmToken,
          success: true,
        })
      } catch (error) {
        results.push({
          token: subscription.fcmToken,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })

        // Remove invalid token
        if (error && typeof error === 'object' && 'code' in error && error.code === 'messaging/invalid-registration-token') {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send notification' 
      },
      { status: 500 }
    )
  }
}
