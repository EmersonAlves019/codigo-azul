'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Heart, Droplet } from 'lucide-react'

export default function Welcome() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [goal, setGoal] = useState('')

  const handleStart = () => {
    if (name && age && goal) {
      localStorage.setItem(
        'userData',
        JSON.stringify({ name, idade: age, objetivo: goal, startDate: new Date().toISOString() }),
      )
      router.push('/personalization')
    }
  }

  return (
    <div className="min-h-screen gradient-calm flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-pulse-soft">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Sua Balança no Azul</h1>

          <p className="text-lg text-muted-foreground mb-2">Bem-vindo à sua jornada de transformação</p>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            30 dias para <span className="text-primary font-semibold">desinflamar</span>,{' '}
            <span className="text-secondary-dark font-semibold">reequilibrar</span> e{' '}
            <span className="text-accent-vibrant font-semibold">rejuvenescer</span> naturalmente
          </p>
        </div>

        <div className="bg-card shadow-float rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Como você gostaria de ser chamado?
            </Label>
            <Input
              id="name"
              placeholder="Seu primeiro nome"
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">
              Qual sua idade?
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Sua idade"
              value={age}
              onChange={e => setAge(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-medium">
              Qual seu principal objetivo?
            </Label>
            <Input
              id="goal"
              placeholder="Ex: Perder barriga, Dormir melhor, Ter mais energia"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleStart}
              disabled={!name || !age || !goal}
              className="w-full rounded-xl h-12 text-base font-semibold shadow-soft hover:shadow-float transition-smooth"
              size="lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Começar Minha Jornada Azul
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-primary-light" />
              <span>Natural</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-secondary" />
              <span>Sustentável</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-vibrant" />
              <span>Transformador</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">Baseado no método &quot;O Código Azul&quot;</p>
      </div>
    </div>
  )
}
