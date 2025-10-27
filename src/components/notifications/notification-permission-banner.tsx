'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, X } from 'lucide-react'
import { useNotificationContext } from './notification-provider'
import { NotificationOnboardingModal } from './notification-onboarding-modal'

export function NotificationPermissionBanner() {
  const { permission, fcmToken, isSupported } = useNotificationContext()
  const [isHidden, setIsHidden] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  if (!isSupported || isHidden || permission === 'granted' || fcmToken) {
    return null
  }

  if (permission === 'denied') {
    return null
  }

  return (
    <>
      <div className="mx-4 my-4 p-4 rounded-2xl bg-gradient-azure border border-primary/20 shadow-card hover:shadow-float transition-smooth">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ative as notificações</h3>
              <p className="text-sm text-muted-foreground">Receba avisos importantes da sua jornada</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" onClick={handleOpenModal} className="rounded-xl font-semibold">
              Ativar
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <NotificationOnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
