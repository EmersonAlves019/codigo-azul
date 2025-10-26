'use client'

import { useState, useEffect } from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useNotificationContext } from './notification-provider'
import { SubscribeButton } from './subscribe-button'

export function NotificationPermissionBanner() {
  const { permission, fcmToken, isSupported } = useNotificationContext()
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('notification-banner-dismissed')
    if (dismissed) {
      setIsHidden(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsHidden(true)
    localStorage.setItem('notification-banner-dismissed', 'true')
  }

  if (!isSupported || isHidden || permission === 'granted' || fcmToken) {
    return null
  }

  if (permission === 'denied') {
    return null
  }

  return (
    <Card className="mx-4 my-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Receba notificações</CardTitle>
            <CardDescription>Ative as notificações para receber avisos sobre suas tarefas diárias</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardFooter>
        <SubscribeButton />
      </CardFooter>
    </Card>
  )
}
