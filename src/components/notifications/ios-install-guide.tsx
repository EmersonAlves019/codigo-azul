'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Share2, Plus, Home } from 'lucide-react'

interface iOSInstallGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function IosInstallGuide({ isOpen, onClose }: iOSInstallGuideProps) {
  const [userAgent, setUserAgent] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent)
    }
  }, [])

  const isIOS = /iPhone|iPad|iPod/.test(userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  // Só mostrar se for iOS e não estiver instalado
  if (!isOpen || !isIOS || isStandalone) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-3xl shadow-float">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-2 animate-pulse-soft">
            <Download className="w-10 h-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-primary">Instalar no iOS</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-base">
            Adicione Sua Balança no Azul à sua tela inicial para acesso rápido e melhor experiência
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            {/* Passo 1 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-smooth">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Abra o Menu Compartilhar</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toque no botão de compartilhar <span className="font-semibold">(□ ↖)</span> na barra inferior do
                  Safari
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-smooth">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-secondary-foreground font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-5 h-5 text-secondary-dark" />
                  <h3 className="font-semibold text-foreground">Selecione &quot;Adicionar à Tela Inicial&quot;</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Role para baixo e toque em <span className="font-semibold">&quot;Adicionar à Tela Inicial&quot;</span>{' '}
                  ou <span className="font-semibold">&quot;Adicionar ao Menu Inicial&quot;</span>
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-accent/10 hover:bg-accent/20 transition-smooth">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-accent-vibrant" />
                  <h3 className="font-semibold text-foreground">Confirme a Instalação</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toque em <span className="font-semibold">&quot;Adicionar&quot;</span> para finalizar. O app aparecerá
                  na sua tela inicial!
                </p>
              </div>
            </div>
          </div>

          {/* Dica */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary font-medium text-center">
              💡 Dica: Após instalar, abra o app diretamente da tela inicial para a melhor experiência
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            size="lg"
            onClick={onClose}
            className="w-full rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
          >
            Entendi, vamos lá!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
