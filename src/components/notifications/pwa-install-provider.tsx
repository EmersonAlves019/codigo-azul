'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface PWAInstallContextValue {
  isStandalone: boolean
  isIOS: boolean
  showInstallGuide: boolean
  setShowInstallGuide: (show: boolean) => void
}

const PWAInstallContext = createContext<PWAInstallContextValue | undefined>(undefined)

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if app is installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const iosStandalone =
      'standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true

    setIsStandalone(standalone || iosStandalone)

    // Check if iOS
    const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboarding-completed')
    const hasShownInstallGuide = localStorage.getItem('ios-install-guide-shown')

    // Show iOS install guide if iOS, not installed, and onboarding is completed
    if (iOS && !(standalone || iosStandalone) && onboardingCompleted && !hasShownInstallGuide) {
      setTimeout(() => {
        setShowInstallGuide(true)
      }, 2000) // Delay to avoid appearing immediately after personalization modal
    }
  }, [])

  return (
    <PWAInstallContext.Provider
      value={{
        isStandalone,
        isIOS,
        showInstallGuide,
        setShowInstallGuide,
      }}
    >
      {children}
    </PWAInstallContext.Provider>
  )
}

export function usePWAInstall() {
  const context = useContext(PWAInstallContext)
  if (context === undefined) {
    throw new Error('usePWAInstall must be used within PWAInstallProvider')
  }
  return context
}
