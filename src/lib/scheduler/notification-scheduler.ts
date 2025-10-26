import cron, { ScheduledTask } from 'node-cron'
import admin from '@/lib/firebase/admin-config'
import { prisma } from '@/lib/prisma-client'

// Store cron tasks
const cronTasks: Map<string, ScheduledTask> = new Map()

export function scheduleNotification(
  cronExpression: string,
  notificationFunction: () => Promise<void>,
  taskName: string
): void {
  // Cancel existing task if any
  const existingTask = cronTasks.get(taskName)
  if (existingTask) {
    existingTask.stop()
  }

  const task = cron.schedule(
    cronExpression,
    async () => {
      try {
        await notificationFunction()
      } catch (error) {
        console.error(`Error in scheduled task ${taskName}:`, error)
      }
    },
    {
      timezone: 'America/Sao_Paulo',
    }
  )

  cronTasks.set(taskName, task)
}

export async function sendDailyTaskNotifications() {
  try {
    // Get current date in user timezone
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`

    // Get all users with enabled daily tasks at this time
    const preferences = await prisma.notificationPreference.findMany({
      where: {
        dailyTasksEnabled: true,
        dailyTasksTime: currentTime,
      },
      include: {
        user: {
          include: {
            subscriptions: {
              where: {
                enabled: true,
              },
            },
          },
        },
      },
    })

    console.log(`Found ${preferences.length} users for daily task notifications at ${currentTime}`)

    for (const pref of preferences) {
      if (pref.user.subscriptions.length === 0) {
        continue
      }

      // Send notification to all user's devices
      for (const subscription of pref.user.subscriptions) {
        try {
          await admin.messaging().send({
            token: subscription.fcmToken,
            notification: {
              title: '🎯 Suas tarefas diárias estão liberadas!',
              body: 'Comece sua jornada de bem-estar hoje.',
            },
            data: {
              url: '/dashboard',
            },
            android: {
              priority: 'high',
            },
          })

          console.log(`Sent daily task notification to user ${pref.userId}`)
        } catch (error) {
          console.error(`Error sending notification to token ${subscription.fcmToken}:`, error)

          // Remove invalid token
          if (error && typeof error === 'object' && 'code' in error && error.code === 'messaging/invalid-registration-token') {
            await prisma.pushSubscription.delete({
              where: { id: subscription.id },
            })
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in sendDailyTaskNotifications:', error)
  }
}

export async function sendMotivationalNotification(
  title: string,
  body: string,
  userId: string
) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        enabled: true,
      },
    })

    for (const subscription of subscriptions) {
      try {
        await admin.messaging().send({
          token: subscription.fcmToken,
          notification: {
            title,
            body,
          },
          data: {
            url: '/dashboard',
          },
          android: {
            priority: 'high',
          },
        })
      } catch (error) {
        console.error(`Error sending motivational notification:`, error)

        // Remove invalid token
        if (error && typeof error === 'object' && 'code' in error && error.code === 'messaging/invalid-registration-token') {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          })
        }
      }
    }
  } catch (error) {
    console.error('Error in sendMotivationalNotification:', error)
  }
}
