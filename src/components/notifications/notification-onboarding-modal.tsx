'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Bell, Sparkles, Heart, TrendingUp } from 'lucide-react'
import { SubscribeButton } from './subscribe-button'
import { useNotificationContext } from './notification-provider'

interface NotificationOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationOnboardingModal({ isOpen, onClose }: NotificationOnboardingModalProps) {
  const { fcmToken, permission } = useNotificationContext()
  const [skipped, setSkipped] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const handleSkip = () => {
    setSkipped(true)
    localStorage.setItem('notification-onboarding-skipped', 'true')
    onClose()
  }

  // Não mostrar se já tem token ou foi skipado
  if (!isOpen || fcmToken || skipped) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl shadow-float">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-2 animate-pulse-soft">
            <Bell className="w-10 h-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            Receba Notificações Importantes
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-base">
            Ative as notificações para não perder lembretes e avisos da sua jornada azul
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Lembretes Personalizados</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre suas tarefas diárias e objetivos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-secondary-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Motivação Diária</h3>
                <p className="text-sm text-muted-foreground">
                  Mensagens inspiradoras para manter você no caminho da transformação
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-accent/10 hover:bg-accent/20 transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-accent-vibrant" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Acompanhe seu Progresso</h3>
                <p className="text-sm text-muted-foreground">Notificações sobre marcos alcançados e próximos passos</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row">
          {permission !== 'granted' && (
            <SubscribeButton
              variant="default"
              size="lg"
              className="flex-1 rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
            />
          )}
          {permission === 'granted' && !fcmToken && (
            <Button
              size="lg"
              variant="default"
              className="flex-1 rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
              onClick={handleClose}
            >
              Continuar
            </Button>
          )}
          <Button size="lg" variant="outline" className="flex-1 rounded-xl h-12 font-semibold" onClick={handleSkip}>
            Pular Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
