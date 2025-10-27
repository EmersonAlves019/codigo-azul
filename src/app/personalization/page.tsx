'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Sparkles, Heart, Brain, Droplet } from 'lucide-react'
import { usePersonalization } from '@/hooks/usePersonalization'
import { useToast } from '@/hooks/use-toast'
import { NotificationOnboardingModal } from '@/components/notifications/notification-onboarding-modal'

export default function Personalization() {
  const router = useRouter()
  const { toast } = useToast()
  const { savePersonalization, calculatePersonalization } = usePersonalization()
  const [step, setStep] = useState(1)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [answers, setAnswers] = useState({
    objetivo: '',
    outroObjetivo: '',
    inflamacao: '',
    sono: '',
    atividadeFisica: '',
    alimentacao: '',
    jejum: '',
  })

  const handleAnswer = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value })
  }

  const nextStep = () => {
    if (step === 1 && !answers.objetivo) {
      toast({
        title: 'Selecione uma opção',
        description: 'Por favor, escolha seu objetivo principal',
        variant: 'destructive',
      })
      return
    }
    if (step === 1 && answers.objetivo === 'outro' && !answers.outroObjetivo) {
      toast({
        title: 'Complete sua resposta',
        description: 'Por favor, descreva seu objetivo',
        variant: 'destructive',
      })
      return
    }
    if (step < 6) {
      setStep(step + 1)
    } else {
      finishPersonalization()
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const finishPersonalization = () => {
    const personalizationData = calculatePersonalization(answers)
    savePersonalization(personalizationData)

    toast({
      title: '✨ Plano personalizado criado!',
      description: 'Sua jornada azul foi adaptada especialmente para você',
    })

    // Verificar se já mostramos o onboarding de notificações
    const hasShownNotificationOnboarding = localStorage.getItem('notification-onboarding-shown')

    setTimeout(() => {
      if (!hasShownNotificationOnboarding) {
        setShowNotificationModal(true)
      } else {
        router.push('/dashboard')
      }
    }, 1500)
  }

  const handleNotificationModalClose = () => {
    localStorage.setItem('notification-onboarding-shown', 'true')
    localStorage.setItem('onboarding-completed', 'true')
    router.push('/dashboard')
  }

  const questions = [
    {
      title: 'Qual é o seu principal objetivo ao iniciar a Jornada Azul?',
      icon: Heart,
      options: [
        { value: 'perder-peso', label: 'Perder peso' },
        { value: 'energia', label: 'Ter mais energia' },
        { value: 'sono', label: 'Melhorar a qualidade do sono' },
        { value: 'inchaco', label: 'Reduzir inchaço/inflamação' },
        { value: 'pele', label: 'Rejuvenescer a pele' },
        { value: 'digestao', label: 'Melhorar a digestão' },
        { value: 'outro', label: 'Outro' },
      ],
      field: 'objetivo',
    },
    {
      title: 'Com que frequência você sente inchaço, cansaço ou dores articulares sem causa aparente?',
      icon: Droplet,
      options: [
        { value: 'nunca', label: 'Nunca' },
        { value: 'raramente', label: 'Raramente' },
        { value: 'as-vezes', label: 'Às vezes' },
        { value: 'frequentemente', label: 'Frequentemente' },
        { value: 'sempre', label: 'Sempre' },
      ],
      field: 'inflamacao',
    },
    {
      title: 'Como você avalia a qualidade do seu sono?',
      icon: Brain,
      options: [
        { value: 'muito-boa', label: 'Muito boa' },
        { value: 'boa', label: 'Boa' },
        { value: 'regular', label: 'Regular' },
        { value: 'ruim', label: 'Ruim' },
      ],
      field: 'sono',
    },
    {
      title: 'Você pratica alguma atividade física regularmente?',
      icon: Sparkles,
      options: [
        { value: 'todos-dias', label: 'Sim, todos os dias' },
        { value: '3-4x', label: 'Sim, 3-4x/semana' },
        { value: '1-2x', label: 'Sim, 1-2x/semana' },
        { value: 'raramente', label: 'Não, raramente' },
        { value: 'nunca', label: 'Não, nunca' },
      ],
      field: 'atividadeFisica',
    },
    {
      title: 'Como é sua alimentação diária?',
      icon: Heart,
      options: [
        { value: 'equilibrada', label: 'Rica em vegetais e proteínas' },
        { value: 'alguns-processados', label: 'Equilibrada com alguns processados' },
        { value: 'processados', label: 'Com muitos alimentos processados' },
        { value: 'desregrada', label: 'Não tenho alimentação regrada' },
      ],
      field: 'alimentacao',
    },
    {
      title: 'Você costuma fazer jejum intermitente ou jejum circadiano?',
      icon: Droplet,
      options: [
        { value: 'regularmente', label: 'Sim, regularmente' },
        { value: 'ocasionalmente', label: 'Sim, ocasionalmente' },
        { value: 'interesse', label: 'Não, mas tenho interesse' },
        { value: 'sem-interesse', label: 'Não, e não tenho interesse' },
      ],
      field: 'jejum',
    },
  ]

  const currentQuestion = questions[step - 1]
  const Icon = currentQuestion.icon
  const progress = (step / 6) * 100

  return (
    <div className="min-h-screen gradient-calm">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-soft" />
          <h1 className="text-2xl font-bold text-primary mb-2">Minha Jornada Azul</h1>
          <p className="text-muted-foreground">
            Vamos entender seu momento atual para criar um plano sob medida para você
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-energy transition-smooth" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">Pergunta {step} de 6</p>
        </div>

        {/* Question Card */}
        <Card className="p-6 rounded-2xl shadow-card mb-6">
          <div className="flex items-start gap-3 mb-6">
            <Icon className="w-6 h-6 text-primary mt-1" />
            <h2 className="text-lg font-semibold text-foreground">{currentQuestion.title}</h2>
          </div>

          <RadioGroup
            value={answers[currentQuestion.field as keyof typeof answers]}
            onValueChange={value => handleAnswer(currentQuestion.field, value)}
          >
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer text-foreground">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* Campo adicional para "Outro" */}
          {step === 1 && answers.objetivo === 'outro' && (
            <div className="mt-4">
              <Input
                placeholder="Descreva seu objetivo..."
                value={answers.outroObjetivo}
                onChange={e => handleAnswer('outroObjetivo', e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline" className="flex-1 rounded-xl h-12 font-semibold">
              Voltar
            </Button>
          )}
          <Button
            onClick={nextStep}
            className="flex-1 rounded-xl h-12 font-semibold shadow-soft hover:shadow-float transition-smooth"
          >
            {step === 6 ? 'Criar Meu Plano' : 'Próxima'}
          </Button>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">💙 Cada resposta nos ajuda a criar a melhor jornada para você</p>
        </div>
      </div>

      <NotificationOnboardingModal isOpen={showNotificationModal} onClose={handleNotificationModalClose} />
    </div>
  )
}
