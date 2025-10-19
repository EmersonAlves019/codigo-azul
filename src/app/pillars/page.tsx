'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Flame, RefreshCw, Sparkles, Leaf, Apple, Moon } from 'lucide-react'

export default function Pillars() {
  const router = useRouter()

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
              <h1 className="text-xl font-bold text-primary">3 Pilares do Código Azul</h1>
              <p className="text-sm text-muted-foreground">Fundamentos da transformação</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Tabs defaultValue="desinflame" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 rounded-2xl">
            <TabsTrigger
              value="desinflame"
              className="rounded-xl py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Flame className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Desinflamar</span>
              <span className="sm:hidden">1</span>
            </TabsTrigger>
            <TabsTrigger
              value="reequilibre"
              className="rounded-xl py-3 data-[state=active]:bg-secondary-dark data-[state=active]:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reequilibrar</span>
              <span className="sm:hidden">2</span>
            </TabsTrigger>
            <TabsTrigger
              value="rejuvenescer"
              className="rounded-xl py-3 data-[state=active]:bg-accent-vibrant data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Rejuvenescer</span>
              <span className="sm:hidden">3</span>
            </TabsTrigger>
          </TabsList>

          {/* Pilar 1: Desinflamar */}
          <TabsContent value="desinflame" className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-card gradient-azure">
              <div className="flex items-start gap-3 mb-4">
                <Flame className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-primary mb-2">Desinflamar para Emagrecer</h2>
                  <p className="text-sm text-foreground">
                    A inflamação silenciosa é a raiz de muitos problemas de saúde. Quando desinflama, o corpo
                    naturalmente volta ao equilíbrio.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-secondary-dark" />
                Alimentos Anti-inflamatórios
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Chás naturais',
                  'Vegetais verdes',
                  'Frutas vermelhas',
                  'Gengibre',
                  'Cúrcuma',
                  'Alho',
                  'Abacate',
                  'Nozes',
                ].map(food => (
                  <div key={food} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Apple className="w-4 h-4 text-primary" />
                    <span className="text-sm">{food}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Moon className="w-5 h-5 text-accent-vibrant" />
                Ritual Noturno Anti-inflamatório
              </h3>
              <div className="space-y-3 text-sm text-foreground">
                <p>🌙 Jantar leve até 19h</p>
                <p>🫖 Chá de camomila ou melissa</p>
                <p>📵 Desconectar das telas 1h antes de dormir</p>
                <p>🧘‍♀️ Respiração profunda (5 minutos)</p>
                <p>💤 Dormir até 22h para regeneração celular</p>
              </div>
            </Card>
          </TabsContent>

          {/* Pilar 2: Reequilibrar */}
          <TabsContent value="reequilibre" className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-card gradient-energy">
              <div className="flex items-start gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-primary mb-2">Reequilibrar o Metabolismo</h2>
                  <p className="text-sm text-primary-foreground">
                    Seu metabolismo não está quebrado, apenas desregulado. Pequenos ajustes no timing das refeições
                    fazem grandes diferenças.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3">Jejum de 12 Horas</h3>
              <div className="bg-primary/5 rounded-xl p-4 mb-4">
                <p className="text-sm text-foreground mb-2">Jantar às 19h → Café da manhã às 7h</p>
                <p className="text-xs text-muted-foreground">
                  Durante o sono, o corpo trabalha para reparar e regenerar
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>✨ Ativa autofagia (limpeza celular)</p>
                <p>🔥 Melhora sensibilidade à insulina</p>
                <p>⚡ Aumenta produção de energia</p>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3">Caminhada Metabólica</h3>
              <div className="space-y-3 text-sm text-foreground">
                <p>🚶‍♀️ 10 minutos após as principais refeições</p>
                <p>🎯 Reduz picos de glicose em até 30%</p>
                <p>💚 Ativa músculos e metabolismo</p>
                <p>🧠 Melhora clareza mental</p>
              </div>
            </Card>
          </TabsContent>

          {/* Pilar 3: Rejuvenescer */}
          <TabsContent value="rejuvenescer" className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-card bg-gradient-to-br from-accent/20 to-primary-lighter/20">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-accent-vibrant mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-primary mb-2">Rejuvenescer de Dentro para Fora</h2>
                  <p className="text-sm text-foreground">
                    Juventude não é uma questão de idade, mas de vitalidade. Cuidar da mente é tão importante quanto
                    cuidar do corpo.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3">Respiração Consciente</h3>
              <div className="bg-accent/10 rounded-xl p-4 mb-3">
                <p className="text-sm font-medium mb-2">Técnica 4-7-8:</p>
                <div className="space-y-2 text-sm text-foreground">
                  <p>1️⃣ Inspire pelo nariz por 4 segundos</p>
                  <p>2️⃣ Segure por 7 segundos</p>
                  <p>3️⃣ Expire pela boca por 8 segundos</p>
                  <p className="text-xs text-muted-foreground mt-2">Repita 4 vezes, 2x ao dia</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Reduz cortisol, acalma sistema nervoso e melhora sono</p>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3">Rotina Matinal Regeneradora</h3>
              <div className="space-y-3 text-sm text-foreground">
                <p>☀️ Acordar no mesmo horário todos os dias</p>
                <p>🙏 3 minutos de gratidão</p>
                <p>💧 Copo de água em jejum</p>
                <p>🧘‍♀️ 5 minutos de alongamento ou respiração</p>
                <p>🍵 Chá ou café sem açúcar</p>
                <p>📝 Definir intenção do dia</p>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold mb-3">Planner Noturno</h3>
              <div className="space-y-3 text-sm text-foreground">
                <p>📱 Telas desligadas 1h antes de dormir</p>
                <p>📖 Leitura leve (10-15 minutos)</p>
                <p>🫖 Chá relaxante (camomila, melissa)</p>
                <p>🌡️ Quarto fresco (18-20°C)</p>
                <p>🌙 Sono entre 22h-6h para regeneração celular</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 p-6 rounded-2xl shadow-card gradient-azure text-center">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">A Magia está na Consistência</h3>
          <p className="text-sm text-foreground">
            Não é sobre ser perfeito, é sobre ser presente. Cada dia que você pratica, está investindo na melhor versão
            de você.
          </p>
        </Card>
      </div>
    </div>
  )
}
