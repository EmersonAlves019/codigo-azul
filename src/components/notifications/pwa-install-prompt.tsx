'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = ('standalone' in window.navigator) && (window.navigator as unknown as { standalone: boolean }).standalone === true
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches

    setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome)

    // Listen for install prompt
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
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to install prompt: ${outcome}`)
    setDeferredPrompt(null)

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
  }

  const handleDismiss = () => {
    setIsHidden(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (isInstalled || isHidden || !deferredPrompt) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-96 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Instalar App</CardTitle>
            <CardDescription>Instale o app para acesso rápido e experiência melhor</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Instale o app e tenha acesso offline, notificações e muito mais.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleInstall} className="flex-1">
          Instalar
        </Button>
        <Button onClick={handleDismiss} variant="outline">
          Depois
        </Button>
      </CardFooter>
    </Card>
  )
}
