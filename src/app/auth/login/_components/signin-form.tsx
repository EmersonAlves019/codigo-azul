'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signinSchema } from '@/schemas/signin-schema'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  Heart,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Calendar,
  TrendingUp,
  BookOpen,
  Target,
} from 'lucide-react'

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: callbackUrl,
      },
      {
        onSuccess: () => {
          toast.success('Login realizado com sucesso!', {
            description: 'Bem-vindo de volta à sua jornada azul',
          })
          router.push(callbackUrl)
        },
        onError: ctx => {
          toast.error('Erro ao fazer login', {
            description: ctx.error.message,
          })
        },
      },
    )
  }

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: callbackUrl,
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Sua Balança no Azul</h1>
            <p className="text-sm text-muted-foreground">Continue sua jornada de transformação</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold text-center text-primary">Entrar</CardTitle>
              <CardDescription className="text-center">
                Não tem uma conta?{' '}
                <Link className="text-primary font-semibold hover:underline" href="/auth/register">
                  Criar conta
                </Link>
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                <div className="flex items-center justify-between">
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Esqueceu sua senha?
                  </Link>
                </div>

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
                  Entrar na Jornada
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <Separator className="my-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-muted-foreground">ou</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl h-12 font-semibold"
                onClick={handleSignInWithGoogle}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>

            <CardFooter className="px-0 pt-6">
              <p className="text-xs text-muted-foreground text-center w-full">
                Ao continuar, você concorda com nossos{' '}
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
              <h2 className="text-2xl font-bold text-primary mb-2">Bem-vindo de volta à sua jornada!</h2>
              <p className="text-muted-foreground">
                Continue sua transformação de 30 dias para desinflamar, reequilibrar e rejuvenescer naturalmente.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Plano de 30 Dias</p>
                  <p className="text-xs text-muted-foreground">Continue sua jornada personalizada</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10">
                <TrendingUp className="w-5 h-5 text-secondary-dark" />
                <div>
                  <p className="font-medium text-sm">Acompanhe seu Progresso</p>
                  <p className="text-xs text-muted-foreground">Veja suas conquistas e evolução</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/10">
                <BookOpen className="w-5 h-5 text-accent-vibrant" />
                <div>
                  <p className="font-medium text-sm">Diário Azul</p>
                  <p className="text-xs text-muted-foreground">Registre suas vitórias diárias</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">3 Pilares Azuis</p>
                  <p className="text-xs text-muted-foreground">Aprenda o método completo</p>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center p-4 rounded-xl gradient-azure">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">
                &quot;Cada pequeno passo conta na sua transformação&quot;
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
