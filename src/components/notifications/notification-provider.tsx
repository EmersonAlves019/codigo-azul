'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { messaging } from '@/lib/firebase/client-config'
import { setupForegroundMessageHandler } from '@/lib/firebase/messaging'
import type { NotificationPermission } from '@/services/notifications/types'

interface NotificationContextValue {
  permission: NotificationPermission
  fcmToken: string | null
  setFcmToken: (token: string | null) => void
  isSupported: boolean
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if browser supports notifications
    setIsSupported('Notification' in window && 'serviceWorker' in navigator)

    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }

    // Setup foreground message handler - aguardar messaging estar disponível
    let unsubscribe: (() => void) | undefined

    const setupHandler = async () => {
      // Aguardar um pouco para messaging estar disponível
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (messaging) {
        unsubscribe = setupForegroundMessageHandler(messaging)
      }
    }

    setupHandler()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Listen for permission changes
  useEffect(() => {
    if (!('Notification' in window)) return

    const checkPermission = () => {
      setPermission(Notification.permission)
    }

    // Check permission periodically in case it changes
    const interval = setInterval(checkPermission, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        permission,
        fcmToken,
        setFcmToken,
        isSupported,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within NotificationProvider')
  }
  return context
}
