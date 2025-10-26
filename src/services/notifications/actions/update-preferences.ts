'use server'

import { prisma } from '@/lib/prisma-client'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import type { UpdateNotificationPreferencesPayload } from '../types'

export async function updateNotificationPreferences(
  preferences: UpdateNotificationPreferencesPayload
) {
  try {
    const userId = await getAuthenticatedUser()

    // Check if preferences exist
    const existing = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    if (existing) {
      // Update existing preferences
      const updated = await prisma.notificationPreference.update({
        where: { id: existing.id },
        data: preferences,
      })
      return { success: true, preferences: updated }
    }

    // Create new preferences
    const created = await prisma.notificationPreference.create({
      data: {
        userId,
        ...preferences,
      },
    })

    return { success: true, preferences: created }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update preferences',
    }
  }
}
