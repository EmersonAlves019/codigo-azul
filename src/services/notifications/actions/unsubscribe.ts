'use server'

import { prisma } from '@/lib/prisma-client'
import { getAuthenticatedUser } from '@/lib/auth-utils'

export async function unsubscribeFromNotifications(fcmToken: string) {
  try {
    await getAuthenticatedUser()

    const subscription = await prisma.pushSubscription.findUnique({
      where: { fcmToken },
    })

    if (!subscription) {
      return { success: true, message: 'Not subscribed' }
    }

    await prisma.pushSubscription.delete({
      where: { id: subscription.id },
    })

    return { success: true, message: 'Unsubscribed successfully' }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to unsubscribe' 
    }
  }
}
