'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Droplet, Footprints, Coffee, Apple, Moon, Star, Sparkles, Flame, Activity } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { usePersonalization } from '@/hooks/usePersonalization'

interface DayTask {
  id: string
  label: string
  icon: any
  completed: boolean
}

export default function Journey() {
  const router = useRouter()
  const { toast } = useToast()
  const { personalization } = usePersonalization()
  const [currentDay, setCurrentDay] = useState(1)
  const [tasks, setTasks] = useState<DayTask[]>([])

  // Gerar tarefas personalizadas baseadas no pilar principal
  useEffect(() => {
    const baseTasks = [
      { id: 'gratitude', label: 'Gratidão matinal', icon: Sparkles, completed: false },
      { id: 'water', label: 'Beber 500ml de água', icon: Droplet, completed: false },
    ]

    let personalizedTasks = [...baseTasks]

    if (personalization) {
      // Tarefas baseadas no pilar principal
      if (personalization.pilarPrincipal === 'desinflamar' || personalization.intensidadeFoco.desinflamar > 40) {
        personalizedTasks.push(
          { id: 'anti-inflammatory', label: 'Chá anti-inflamatório', icon: Flame, completed: false },
          { id: 'vegetables', label: 'Incluir vegetais no almoço', icon: Apple, completed: false },
        )
      }

      if (personalization.pilarPrincipal === 'reequilibrar' || personalization.intensidadeFoco.reequilibrar > 40) {
        personalizedTasks.push(
          { id: 'morning-walk', label: 'Caminhada metabólica (10 min)', icon: Footprints, completed: false },
          { id: 'breakfast', label: 'Café da manhã azul', icon: Coffee, completed: false },
        )
      }

      if (personalization.pilarPrincipal === 'rejuvenescer' || personalization.intensidadeFoco.rejuvenescer > 40) {
        personalizedTasks.push(
          { id: 'breathing', label: 'Respiração 4-4-6', icon: Activity, completed: false },
          { id: 'night-ritual', label: 'Ritual noturno', icon: Moon, completed: false },
          { id: 'sleep', label: 'Dormir até 22h', icon: Star, completed: false },
        )
      }
    } else {
      // Tarefas padrão se não houver personalização
      personalizedTasks = [
        { id: 'gratitude', label: 'Gratidão matinal', icon: Sparkles, completed: false },
        { id: 'water', label: 'Beber 500ml de água', icon: Droplet, completed: false },
        { id: 'morning-walk', label: 'Caminhada de 10 min', icon: Footprints, completed: false },
        { id: 'breakfast', label: 'Café da manhã azul', icon: Coffee, completed: false },
        { id: 'lunch', label: 'Almoço do "Prato Azul"', icon: Apple, completed: false },
        { id: 'post-meal-walk', label: 'Caminhada pós-refeição', icon: Footprints, completed: false },
        { id: 'night-ritual', label: 'Ritual noturno', icon: Moon, completed: false },
        { id: 'sleep', label: 'Dormir até 22h', icon: Star, completed: false },
      ]
    }

    setTasks(personalizedTasks)
  }, [personalization])

  const getDayTips = () => {
    const week = Math.ceil(currentDay / 7)
    const baseTips = [
      {
        day: 1,
        goal: 'Começar com leveza e intenção',
        tip: 'Hoje é sobre criar consciência. Não precisa ser perfeito, apenas comece.',
        reward: 'Estrela Azul da Consciência',
      },
      {
        day: 2,
        goal: 'Manter a consistência',
        tip: 'A repetição cria o hábito. Continue mostrando para si mesmo que você consegue.',
        reward: 'Flor da Persistência',
      },
      {
        day: 3,
        goal: 'Celebrar pequenas vitórias',
        tip: 'Você já está 3 dias mais próximo da sua transformação. Isso é incrível!',
        reward: 'Cristal do Comprometimento',
      },
    ]

    // Personalizar tips baseado no pilar principal
    if (personalization && currentDay > 3) {
      const pilarInfo = {
        desinflamar: {
          goal: 'Foco em Desinflamar',
          tip: 'Priorize alimentos anti-inflamatórios e hidratação constante.',
          reward: 'Chama Azul do Equilíbrio',
        },
        reequilibrar: {
          goal: 'Ativar o Metabolismo',
          tip: 'Movimento e jejum circadiano são seus aliados hoje.',
          reward: 'Energia Metabólica',
        },
        rejuvenescer: {
          goal: 'Rejuvenescer de Dentro',
          tip: 'Respiração consciente e sono reparador são seu foco.',
          reward: 'Estrela do Autocuidado',
        },
      }

      return pilarInfo[personalization.pilarPrincipal]
    }

    return baseTips[Math.min(currentDay - 1, baseTips.length - 1)]
  }

  const currentDayInfo = getDayTips()

  useEffect(() => {
    const progress = localStorage.getItem('journeyProgress')
    if (progress) {
      const { currentDay: savedDay } = JSON.parse(progress)
      setCurrentDay(savedDay || 1)
    }
  }, [])

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const allCompleted = completedCount === tasks.length

  const handleCompleteDay = () => {
    if (allCompleted) {
      const newDay = currentDay + 1
      const completedDays = currentDay

      localStorage.setItem(
        'journeyProgress',
        JSON.stringify({
          currentDay: newDay,
          completedDays,
        }),
      )

      toast({
        title: '🌟 Dia concluído!',
        description: `Parabéns! Você ganhou: ${currentDayInfo.reward}`,
      })

      // Resetar tasks para o próximo dia
      setTasks(tasks.map(task => ({ ...task, completed: false })))
      setCurrentDay(newDay)

      // Mostrar animação de recompensa
      setTimeout(() => {
        toast({
          title: '💙 Continue assim!',
          description: 'Você está criando uma nova versão de si mesmo',
        })
      }, 2000)
    } else {
      toast({
        title: 'Ainda faltam algumas tarefas',
        description: 'Complete todas as atividades do dia para prosseguir',
        variant: 'destructive',
      })
    }
  }

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
              <h1 className="text-xl font-bold text-primary">Dia {currentDay}</h1>
              <p className="text-sm text-muted-foreground">Jornada de 30 Dias</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {completedCount}/{tasks.length}
              </p>
              <p className="text-xs text-muted-foreground">tarefas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Meta do Dia */}
        <Card className="p-6 rounded-2xl shadow-card mb-6 gradient-azure">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-soft mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-semibold text-primary">Meta do Dia</h2>
                {personalization && (
                  <Badge variant="outline" className="text-xs">
                    Foco:{' '}
                    {personalization.pilarPrincipal === 'desinflamar'
                      ? 'Desinflamar'
                      : personalization.pilarPrincipal === 'reequilibrar'
                      ? 'Reequilibrar'
                      : 'Rejuvenescer'}
                  </Badge>
                )}
              </div>
              <p className="text-foreground font-medium mb-2">{currentDayInfo.goal}</p>
              <p className="text-sm text-muted-foreground">{currentDayInfo.tip}</p>
            </div>
          </div>
        </Card>

        {/* Checklist */}
        <Card className="p-6 rounded-2xl shadow-card mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent-vibrant" />
            Checklist do Dia
          </h2>

          <div className="space-y-4">
            {tasks.map(task => {
              const Icon = task.icon
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-smooth ${
                    task.completed ? 'bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    className="w-5 h-5"
                  />
                  <Icon className={`w-5 h-5 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                  <label
                    htmlFor={task.id}
                    className={`flex-1 cursor-pointer transition-smooth ${
                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {task.label}
                  </label>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recompensa */}
        {allCompleted && (
          <Card className="p-6 rounded-2xl shadow-float mb-6 gradient-energy animate-bloom">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary-foreground animate-pulse-soft" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2">Dia Completo! 🎉</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">Você ganhou: {currentDayInfo.reward}</p>
            </div>
          </Card>
        )}

        {/* Botão de Conclusão */}
        <Button
          onClick={handleCompleteDay}
          disabled={!allCompleted}
          className="w-full rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
          size="lg"
        >
          {allCompleted ? 'Concluir Dia e Avançar' : 'Complete Todas as Tarefas'}
        </Button>

        {/* Mensagem de Reforço */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">💙 Cada pequeno passo conta na sua transformação</p>
        </div>
      </div>
    </div>
  )
}
