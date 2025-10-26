export interface PushSubscription {
  id: string
  userId: string
  fcmToken: string
  deviceInfo: string | null
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationPreference {
  id: string
  userId: string
  dailyTasksEnabled: boolean
  dailyTasksTime: string
  timeZone: string
  morningEnabled: boolean
  morningTime: string
  eveningEnabled: boolean
  eveningTime: string
  createdAt: Date
  updatedAt: Date
}

export interface SendNotificationPayload {
  title: string
  body: string
  url?: string
  imageUrl?: string
}

export interface UpdateNotificationPreferencesPayload {
  dailyTasksEnabled?: boolean
  dailyTasksTime?: string
  timeZone?: string
  morningEnabled?: boolean
  morningTime?: string
  eveningEnabled?: boolean
  eveningTime?: string
}

export type NotificationPermission = 'default' | 'granted' | 'denied'
