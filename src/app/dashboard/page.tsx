'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, TrendingUp, BookOpen, Sparkles, Target, Heart, Sun } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SignoutButton } from '@/app/dashboard/_components/signout-button'
import { useAuth } from '@/hooks/useAuth'
import { useGetPhrase } from '@/services/motivational-phrases/queries/use-get-phrase'
import { Loading } from '@/components/ui/loading'

interface UserData {
  name: string
  age: string
  goal: string
  startDate: string
}

export default function Dashboard() {
  const router = useRouter()
  const { user: authUser, loading } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState(0)
  const { data: dailyPhrase, isLoading: isLoadingPhrase } = useGetPhrase()

  useEffect(() => {
    if (loading) return

    if (!authUser) {
      router.push('/auth/login')
      return
    }

    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/welcome')
      return
    }

    setUser(JSON.parse(userData))

    // Calcular progresso
    const progress = localStorage.getItem('journeyProgress')
    if (progress) {
      const { currentDay: savedDay, completedDays: savedCompleted } = JSON.parse(progress)
      setCurrentDay(savedDay || 1)
      setCompletedDays(savedCompleted || 0)
    }
  }, [authUser, loading, router])

  const progress = (completedDays / 30) * 100

  if (loading) {
    return (
      <div className="min-h-screen gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-energy flex items-center justify-center animate-pulse-soft mx-auto mb-4">
            <Sun className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-primary font-medium">Carregando sua jornada...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <div className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Olá, {user.name}! ✨</h1>
              <p className="text-sm text-muted-foreground mt-1">Dia {currentDay} da sua jornada</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-energy flex items-center justify-center animate-pulse-soft">
                <Sun className="w-8 h-8 text-primary-foreground" />
              </div>
              <SignoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progresso */}
        <Card className="p-6 shadow-card mb-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Seu Progresso Azul</h2>
            <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">{completedDays} de 30 dias concluídos</p>
        </Card>

        {/* Frase do Dia */}
        <div className="bg-gradient-azure rounded-2xl p-6 mb-6 shadow-soft animate-fade-in">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary mt-1 animate-pulse-soft" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">Mensagem do Dia</p>
              <p className="text-lg font-semibold text-primary">{isLoadingPhrase ? <Loading /> : dailyPhrase}</p>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card
            className="p-6 rounded-2xl shadow-card hover:shadow-float transition-smooth cursor-pointer"
            onClick={() => router.push('/journey')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Plano de 30 Dias</h3>
                <p className="text-sm text-muted-foreground">Continue sua jornada</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 rounded-2xl shadow-card hover:shadow-float transition-smooth cursor-pointer"
            onClick={() => router.push('/progress')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary-dark" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Medir Progresso</h3>
                <p className="text-sm text-muted-foreground">Veja suas conquistas</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 rounded-2xl shadow-card hover:shadow-float transition-smooth cursor-pointer"
            onClick={() => router.push('/diary')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent-vibrant" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Diário Azul</h3>
                <p className="text-sm text-muted-foreground">Registre suas vitórias</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 rounded-2xl shadow-card hover:shadow-float transition-smooth cursor-pointer"
            onClick={() => router.push('/pillars')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-lighter/50 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">3 Pilares Azuis</h3>
                <p className="text-sm text-muted-foreground">Aprenda o método</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Objetivo Principal */}
        <Card className="p-6 rounded-2xl shadow-card gradient-energy">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-primary">Seu Objetivo</h3>
          </div>
          <p className="text-lg font-medium text-primary-foreground">{user.goal}</p>
        </Card>

        {/* CTA Principal */}
        <div className="mt-8">
          <Button
            onClick={() => router.push('/journey')}
            className="w-full rounded-xl h-14 text-lg font-semibold shadow-float hover:shadow-glow transition-smooth"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Continuar Minha Jornada
          </Button>
        </div>
      </div>
    </div>
  )
}
