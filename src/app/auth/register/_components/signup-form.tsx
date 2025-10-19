'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signupSchema } from '@/schemas/signup-schema'
import { Input } from '@/components/ui/input'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Sparkles,
  Heart,
  Droplet,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Calendar,
  TrendingUp,
  BookOpen,
  Target,
  CheckCircle,
} from 'lucide-react'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/welcome'

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: callbackUrl,
      },
      {
        onSuccess: () => {
          toast.success('Cadastro realizado com sucesso!', {
            description: 'Bem-vindo à sua jornada de transformação',
          })
          router.push(callbackUrl)
        },
        onError: ctx => {
          toast.error('Erro ao cadastrar', {
            description: ctx.error.message,
          })
        },
      },
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Signup Form */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Sua Balança no Azul</h1>
            <p className="text-sm text-muted-foreground">Comece sua jornada de transformação</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold text-center text-primary">Criar Conta</CardTitle>
              <CardDescription className="text-center">
                Já tem uma conta?{' '}
                <Link className="text-primary font-semibold hover:underline" href="/auth/login">
                  Fazer login
                </Link>
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nome completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="Seu nome completo" className="pl-10 rounded-xl h-12" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="seu@email.com" className="pl-10 rounded-xl h-12" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="***********"
                            className="pl-10 pr-10 rounded-xl h-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Confirmar senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="***********"
                            className="pl-10 pr-10 rounded-xl h-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-xl h-12 text-base font-semibold shadow-soft hover:shadow-float transition-smooth"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Spinner className="w-4 h-4 mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Começar Jornada
                </Button>
              </form>
            </Form>

            <CardFooter className="px-0 pt-6">
              <p className="text-xs text-muted-foreground text-center w-full">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Column - Informational Content */}
      <div className="hidden lg:flex lg:w-3/5 gradient-calm relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/20"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-secondary/20"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 rounded-full bg-accent/20"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-primary/20"></div>
        </div>

        {/* Main Content Card */}
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <Card className="w-full max-w-lg p-8 bg-white/95 backdrop-blur-sm shadow-float">
            {/* Illustration */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-energy mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">Transforme sua vida em 30 dias!</h2>
              <p className="text-muted-foreground">
                Junte-se a milhares de pessoas que já descobriram o poder do método "O Código Azul".
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                <CheckCircle className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Plano Personalizado</p>
                  <p className="text-xs text-muted-foreground">Questionário adapta sua jornada</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10">
                <TrendingUp className="w-5 h-5 text-secondary-dark" />
                <div>
                  <p className="font-medium text-sm">Acompanhamento Diário</p>
                  <p className="text-xs text-muted-foreground">Tarefas personalizadas para cada dia</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/10">
                <BookOpen className="w-5 h-5 text-accent-vibrant" />
                <div>
                  <p className="font-medium text-sm">Diário de Progresso</p>
                  <p className="text-xs text-muted-foreground">Registre suas vitórias e aprendizados</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">3 Pilares Fundamentais</p>
                  <p className="text-xs text-muted-foreground">Desinflamar, Reequilibrar, Rejuvenescer</p>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center p-4 rounded-xl gradient-azure">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">"Sua transformação começa hoje"</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
