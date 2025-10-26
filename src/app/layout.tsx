import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import NextTopLoader from 'nextjs-toploader'
import { AppProviders } from '@/providers/app-providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sua Balança no Azul',
  description: 'Jornada de 30 dias para desinflamar, reequilibrar e rejuvenescer naturalmente',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sua Balança no Azul',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
}

export function generateViewport() {
  return {
    themeColor: '#0066ff',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTopLoader showSpinner={false} height={2} />
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
