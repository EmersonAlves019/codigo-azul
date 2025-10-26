'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationProvider } from '@/components/notifications/notification-provider'
import { PWAInstallPrompt } from '@/components/notifications/pwa-install-prompt'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        {children}
        <PWAInstallPrompt />
      </NotificationProvider>
    </QueryClientProvider>
  )
}
