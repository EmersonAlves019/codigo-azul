'use server'

import { prisma } from '@/lib/prisma-client'
import { getAuthenticatedUser } from '@/lib/auth-utils'

export async function subscribeToNotifications(fcmToken: string, deviceInfo?: string) {
  try {
    const userId = await getAuthenticatedUser()

    // Check if subscription already exists
    const existing = await prisma.pushSubscription.findUnique({
      where: { fcmToken },
    })

    if (existing) {
      // Update existing subscription
      const subscription = await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          enabled: true,
          deviceInfo: deviceInfo || existing.deviceInfo,
          updatedAt: new Date(),
        },
      })
      return { success: true, subscription }
    }

    // Create new subscription
    const subscription = await prisma.pushSubscription.create({
      data: {
        userId,
        fcmToken,
        deviceInfo: deviceInfo || null,
        enabled: true,
      },
    })

    return { success: true, subscription }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to subscribe' 
    }
  }
}
