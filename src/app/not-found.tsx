'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route')
  }, [])

  return (
    <div className="min-h-screen gradient-calm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-float">
        <div className="mb-6">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold text-primary mb-2">Página não encontrada</h1>
          <p className="text-muted-foreground mb-6">
            Oops! Parece que você se perdeu na sua jornada azul. Vamos te ajudar a encontrar o caminho de volta.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Voltar ao Dashboard
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full rounded-xl h-12 font-semibold"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Página Anterior
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">💙 Continue sua jornada de transformação</p>
        </div>
      </Card>
    </div>
  )
}
