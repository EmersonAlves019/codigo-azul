'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, Droplet, Zap, Smile, Calendar, Flame, Activity, Heart } from 'lucide-react'
import { Progress as ProgressBar } from '@/components/ui/progress'
import { usePersonalization } from '@/hooks/usePersonalization'

export default function Progress() {
  const router = useRouter()
  const { personalization } = usePersonalization()
  const [stats, setStats] = useState({
    daysCompleted: 0,
    waterIntake: 0,
    energyLevel: 0,
    moodLevel: 0,
  })

  useEffect(() => {
    const progress = localStorage.getItem('journeyProgress')
    if (progress) {
      const { completedDays } = JSON.parse(progress)
      setStats(prev => ({ ...prev, daysCompleted: completedDays || 0 }))
    }
  }, [])

  const totalDays = 30
  const progressPercent = (stats.daysCompleted / totalDays) * 100

  // Calcular progresso por pilar baseado nos dias
  const getPillarProgress = () => {
    if (!personalization) return { desinflamar: 0, reequilibrar: 0, rejuvenescer: 0 }

    const { intensidadeFoco } = personalization

    // Distribuir progresso baseado na intensidade de foco
    const baseProgress = (stats.daysCompleted / totalDays) * 100

    return {
      desinflamar: Math.min(100, (baseProgress * intensidadeFoco.desinflamar) / 100),
      reequilibrar: Math.min(100, (baseProgress * intensidadeFoco.reequilibrar) / 100),
      rejuvenescer: Math.min(100, (baseProgress * intensidadeFoco.rejuvenescer) / 100),
    }
  }

  const pillarProgress = getPillarProgress()

  return (
    <div className="min-h-screen gradient-calm pb-20">
      {/* Header */}
      <div className="bg-card shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary">Meu Progresso</h1>
              <p className="text-sm text-muted-foreground">Acompanhe sua evolução</p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Progresso Geral */}
        <Card className="p-6 rounded-2xl shadow-float mb-6 gradient-energy">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-primary-foreground mx-auto mb-4 animate-pulse-soft" />
            <p className="text-sm font-medium text-primary-foreground/80 mb-2">Jornada de 30 Dias</p>
            <p className="text-5xl font-bold text-primary-foreground mb-4">
              {stats.daysCompleted}/{totalDays}
            </p>
            <ProgressBar value={progressPercent} className="h-3 mb-2 bg-primary-foreground/20" />
            <p className="text-sm text-primary-foreground/80">{Math.round(progressPercent)}% concluído</p>
          </div>
        </Card>

        {/* Progresso por Pilar */}
        {personalization && (
          <Card className="p-6 rounded-2xl shadow-card mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progresso por Pilar
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Desinflamar</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{Math.round(pillarProgress.desinflamar)}%</span>
                </div>
                <ProgressBar value={pillarProgress.desinflamar} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Reequilibrar</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{Math.round(pillarProgress.reequilibrar)}%</span>
                </div>
                <ProgressBar value={pillarProgress.reequilibrar} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Rejuvenescer</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{Math.round(pillarProgress.rejuvenescer)}%</span>
                </div>
                <ProgressBar value={pillarProgress.rejuvenescer} className="h-2" />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-primary/5">
              <p className="text-sm text-muted-foreground text-center">
                Seu foco principal:{' '}
                <Badge variant="outline" className="ml-2">
                  {personalization.pilarPrincipal === 'desinflamar'
                    ? 'Desinflamar'
                    : personalization.pilarPrincipal === 'reequilibrar'
                    ? 'Reequilibrar'
                    : 'Rejuvenescer'}
                </Badge>
              </p>
            </div>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hidratação</p>
                <p className="text-2xl font-bold text-primary">8 copos</p>
              </div>
            </div>
            <ProgressBar value={80} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Meta diária: 10 copos</p>
          </Card>

          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-secondary-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Energia</p>
                <p className="text-2xl font-bold text-secondary-dark">Alta</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`flex-1 h-2 rounded-full ${level <= 4 ? 'bg-secondary-dark' : 'bg-muted'}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Nível 4 de 5</p>
          </Card>

          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center">
                <Smile className="w-5 h-5 text-accent-vibrant" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Humor</p>
                <p className="text-2xl font-bold text-accent-vibrant">Ótimo</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`flex-1 h-2 rounded-full ${level <= 5 ? 'bg-accent-vibrant' : 'bg-muted'}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Nível 5 de 5</p>
          </Card>

          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-light/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consistência</p>
                <p className="text-2xl font-bold text-primary">
                  {stats.daysCompleted > 0 ? Math.round((stats.daysCompleted / totalDays) * 100) : 0}%
                </p>
              </div>
            </div>
            <ProgressBar
              value={stats.daysCompleted > 0 ? (stats.daysCompleted / totalDays) * 100 : 0}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">{stats.daysCompleted} dias seguidos</p>
          </Card>
        </div>

        {/* Insights */}
        <Card className="p-6 rounded-2xl shadow-card gradient-azure">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Insights da Semana
          </h3>

          <div className="space-y-2">
            <p className="text-sm text-foreground">
              ✨ Você está {stats.daysCompleted > 7 ? 'mantendo' : 'iniciando'} uma rotina consistente
            </p>
            <p className="text-sm text-foreground">💧 Sua hidratação melhorou nos últimos dias</p>
            <p className="text-sm text-foreground">
              🌙 Você dormiu bem em {Math.max(1, stats.daysCompleted - 1)} das últimas {stats.daysCompleted} noites
            </p>
            <p className="text-sm text-foreground">💙 Continue assim! Você está criando hábitos duradouros</p>
          </div>
        </Card>

        {/* Conquistas */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Conquistas Desbloqueadas</h3>
          <div className="grid grid-cols-3 gap-3">
            {stats.daysCompleted >= 1 && (
              <Card className="p-4 rounded-xl shadow-card text-center animate-bloom">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-xs font-medium">Primeiro Dia</p>
              </Card>
            )}
            {stats.daysCompleted >= 3 && (
              <Card className="p-4 rounded-xl shadow-card text-center animate-bloom">
                <div className="text-3xl mb-2">🌸</div>
                <p className="text-xs font-medium">3 Dias</p>
              </Card>
            )}
            {stats.daysCompleted >= 7 && (
              <Card className="p-4 rounded-xl shadow-card text-center animate-bloom">
                <div className="text-3xl mb-2">💎</div>
                <p className="text-xs font-medium">1 Semana</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
