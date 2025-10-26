'use server'

import { initializeFirebase } from '@/lib/firebase/admin-config'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma-client'
import type { SendNotificationPayload } from '../types'

export async function sendNotification(
  userId: string,
  payload: SendNotificationPayload
) {
  try {
    const currentUserId = await getAuthenticatedUser()
    const admin = initializeFirebase()

    // For now, only allow users to send to themselves
    // In production, you might want admin-only access
    if (currentUserId !== userId) {
      throw new Error('Unauthorized')
    }

    // Get all subscriptions for the user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        enabled: true,
      },
    })

    if (subscriptions.length === 0) {
      return { success: false, error: 'No active subscriptions found' }
    }

    const tokens = subscriptions.map((sub) => sub.fcmToken)
    const results: Array<{ token: string; success: boolean; messageId?: string; error?: string }> = []

    // Send to each token
    for (const token of tokens) {
      try {
        const message = {
          notification: {
            title: payload.title,
            body: payload.body,
            ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
          },
          data: {
            url: payload.url || '/',
            ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
          },
          token,
          android: {
            priority: 'high' as const,
          },
          apns: {
            payload: {
              aps: {
                sound: 'default' as const,
                badge: 1,
              },
            },
          },
        }

        const result = await admin.messaging().send(message)
        results.push({ token, success: true, messageId: result })
      } catch (error) {
        console.error('Error sending to token:', token, error)
        results.push({ token, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
        
        // If token is invalid, remove it
        if (error && typeof error === 'object' && 'code' in error && error.code === 'messaging/invalid-registration-token') {
          await prisma.pushSubscription.deleteMany({
            where: { fcmToken: token },
          })
        }
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return {
      success: true,
      sent: successCount,
      failed: failureCount,
      results,
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification',
    }
  }
}
