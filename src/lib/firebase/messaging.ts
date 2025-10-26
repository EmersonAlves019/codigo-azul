import { getToken, onMessage, Messaging } from 'firebase/messaging'
import { toast } from 'sonner'

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return 'denied'
  }
}

export async function getFCMToken(messaging: Messaging): Promise<string | null> {
  try {
    if (!messaging) return null

    let registration = await navigator.serviceWorker.getRegistration('/')
    
    if (!registration) {
      registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      })
      await navigator.serviceWorker.ready
    }
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    return token
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao obter token FCM:', error)
    }
    return null
  }
}

export function setupForegroundMessageHandler(messaging: Messaging | undefined) {
  if (!messaging || typeof window === 'undefined') {
    return () => {}
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    toast.info(payload.notification?.title || 'Nova notificação', {
      description: payload.notification?.body,
      duration: 5000,
    })
  })

  return unsubscribe
}
