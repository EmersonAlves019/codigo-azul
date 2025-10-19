'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, BookOpen, Heart, Trophy, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DiaryEntry {
  date: string
  victories: string
  challenges: string
  gratitude: string
}

export default function Diary() {
  const router = useRouter()
  const { toast } = useToast()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({
    date: new Date().toLocaleDateString('pt-BR'),
    victories: '',
    challenges: '',
    gratitude: '',
  })

  useEffect(() => {
    const savedEntries = localStorage.getItem('diaryEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const handleSave = () => {
    if (!currentEntry.victories && !currentEntry.challenges && !currentEntry.gratitude) {
      toast({
        title: 'Escreva algo primeiro',
        description: 'Preencha ao menos um campo para salvar',
        variant: 'destructive',
      })
      return
    }

    const newEntries = [...entries, currentEntry]
    setEntries(newEntries)
    localStorage.setItem('diaryEntries', JSON.stringify(newEntries))

    toast({
      title: '✨ Entrada salva!',
      description: 'Seu progresso foi registrado com carinho',
    })

    setCurrentEntry({
      date: new Date().toLocaleDateString('pt-BR'),
      victories: '',
      challenges: '',
      gratitude: '',
    })
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
              <h1 className="text-xl font-bold text-primary">Diário Azul</h1>
              <p className="text-sm text-muted-foreground">Registre sua jornada</p>
            </div>
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Entrada de Hoje */}
        <Card className="p-6 rounded-2xl shadow-card mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent-vibrant" />
            <h2 className="font-semibold">Entrada de Hoje</h2>
            <span className="text-sm text-muted-foreground ml-auto">{currentEntry.date}</span>
          </div>

          <div className="space-y-6">
            {/* Vitórias */}
            <div>
              <label className="flex items-center gap-2 font-medium text-sm mb-2">
                <Trophy className="w-4 h-4 text-primary" />
                Vitórias do Dia
              </label>
              <Textarea
                placeholder="O que você conquistou hoje? Cada pequena vitória importa..."
                value={currentEntry.victories}
                onChange={e => setCurrentEntry({ ...currentEntry, victories: e.target.value })}
                className="min-h-[100px] rounded-xl resize-none"
              />
            </div>

            {/* Desafios */}
            <div>
              <label className="flex items-center gap-2 font-medium text-sm mb-2">
                <Sparkles className="w-4 h-4 text-secondary-dark" />
                Desafios Superados
              </label>
              <Textarea
                placeholder="Que obstáculos você enfrentou e como lidou com eles?"
                value={currentEntry.challenges}
                onChange={e => setCurrentEntry({ ...currentEntry, challenges: e.target.value })}
                className="min-h-[100px] rounded-xl resize-none"
              />
            </div>

            {/* Gratidão */}
            <div>
              <label className="flex items-center gap-2 font-medium text-sm mb-2">
                <Heart className="w-4 h-4 text-accent-vibrant" />
                Gratidão
              </label>
              <Textarea
                placeholder="Pelo que você é grato hoje?"
                value={currentEntry.gratitude}
                onChange={e => setCurrentEntry({ ...currentEntry, gratitude: e.target.value })}
                className="min-h-[100px] rounded-xl resize-none"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full mt-6 rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
            size="lg"
          >
            Salvar Entrada
          </Button>
        </Card>

        {/* Entradas Anteriores */}
        {entries.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Entradas Anteriores
            </h3>

            {entries
              .slice()
              .reverse()
              .map((entry, index) => (
                <Card key={index} className="p-5 rounded-2xl shadow-card hover:shadow-float transition-smooth">
                  <p className="text-sm font-medium text-muted-foreground mb-3">{entry.date}</p>

                  {entry.victories && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-1">
                        <Trophy className="w-3 h-3" />
                        Vitórias
                      </p>
                      <p className="text-sm text-foreground">{entry.victories}</p>
                    </div>
                  )}

                  {entry.challenges && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-secondary-dark flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3" />
                        Desafios
                      </p>
                      <p className="text-sm text-foreground">{entry.challenges}</p>
                    </div>
                  )}

                  {entry.gratitude && (
                    <div>
                      <p className="text-xs font-semibold text-accent-vibrant flex items-center gap-1 mb-1">
                        <Heart className="w-3 h-3" />
                        Gratidão
                      </p>
                      <p className="text-sm text-foreground">{entry.gratitude}</p>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        )}

        {entries.length === 0 && (
          <Card className="p-8 rounded-2xl shadow-card text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Suas entradas aparecerão aqui após você salvá-las</p>
          </Card>
        )}
      </div>
    </div>
  )
}
