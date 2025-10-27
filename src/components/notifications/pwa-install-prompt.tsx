'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Download, Smartphone } from 'lucide-react'
import { usePWAInstall } from './pwa-install-provider'
import { IosInstallGuide } from './ios-install-guide'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const { isStandalone, isIOS, showInstallGuide, setShowInstallGuide } = usePWAInstall()

  useEffect(() => {
    setIsInstalled(isStandalone)

    // Listen for install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      setIsHidden(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [isStandalone])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to install prompt: ${outcome}`)
      setDeferredPrompt(null)

      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const handleDismiss = () => {
    setIsHidden(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  const handleiOSGuideClose = () => {
    localStorage.setItem('ios-install-guide-shown', 'true')
    setShowInstallGuide(false)
  }

  // Se for iOS e não instalado, mostrar iOS guide
  if (isIOS && !isInstalled && showInstallGuide) {
    const IOSGuide = IosInstallGuide as React.FC<{ isOpen: boolean; onClose: () => void }>
    return <IOSGuide isOpen={showInstallGuide} onClose={handleiOSGuideClose} />
  }

  // Android/Desktop install prompt
  if (isInstalled || isHidden || !deferredPrompt) {
    return null
  }

  const onboardingCompleted = localStorage.getItem('onboarding-completed')

  // Só mostrar após onboarding completo
  if (!onboardingCompleted) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-96 shadow-float">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Instalar App</CardTitle>
              <CardDescription className="text-sm">Acesso rápido e experiência melhor</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8 flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-muted/50 transition-smooth">
            <Smartphone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Acesso Offline</p>
              <p className="text-xs text-muted-foreground">Use mesmo sem internet</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button
          onClick={handleInstall}
          className="flex-1 rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
        >
          Instalar Agora
        </Button>
        <Button onClick={handleDismiss} variant="outline" className="rounded-xl h-12 font-semibold">
          Depois
        </Button>
      </CardFooter>
    </Card>
  )
}
