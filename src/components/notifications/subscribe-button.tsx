'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNotificationContext } from './notification-provider'
import { requestNotificationPermission, getFCMToken } from '@/lib/firebase/messaging'
import { subscribeToNotifications } from '@/services/notifications/actions/subscribe'
import { messaging } from '@/lib/firebase/client-config'
import { toast } from 'sonner'

interface SubscribeButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function SubscribeButton({ variant = 'default', size = 'default', className }: SubscribeButtonProps) {
  const { permission, fcmToken, setFcmToken, isSupported } = useNotificationContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    try {
      setIsLoading(true)

      if (!isSupported) {
        toast.error('Notificações não são suportadas neste navegador')
        return
      }

      // Request permission
      if (permission !== 'granted') {
        const permissionResult = await requestNotificationPermission()

        if (permissionResult !== 'granted') {
          toast.error('Permissão de notificações negada')
          return
        }
      }

      // Verificar se messaging está disponível
      if (!messaging) {
        toast.error('Firebase messaging não está disponível. Verifique se está em HTTPS ou localhost.')
        return
      }

      const token = await getFCMToken(messaging)

      if (!token) {
        toast.error('Não foi possível obter o token de notificação')
        return
      }

      // Save to database
      const deviceInfo = JSON.stringify({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      })

      const result = await subscribeToNotifications(token, deviceInfo)

      if (result.success) {
        setFcmToken(token)
        toast.success('Notificações ativadas com sucesso!')
      } else {
        toast.error(result.error || 'Falha ao ativar notificações')
      }
    } catch (error) {
      toast.error('Erro ao ativar notificações')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return null
  }

  if (permission === 'denied') {
    return (
      <Button variant="secondary" size={size} className={className} disabled>
        Notificações bloqueadas
      </Button>
    )
  }

  if (fcmToken) {
    return (
      <Button variant="secondary" size={size} className={className} disabled>
        Notificações ativadas
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSubscribe} disabled={isLoading}>
      {isLoading ? 'Ativando...' : 'Ativar notificações'}
    </Button>
  )
}
