'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signinSchema } from '@/schemas/signin-schema'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import Link from 'next/link'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'

export function SigninForm() {
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
        callbackURL: '/home',
      },
      {
        onSuccess: () => {
          toast.success('Login realizado com sucesso', {
            description: 'Você será redirecionado para a página de home',
          })
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
      callbackURL: '/home',
    })
  }

  return (
    <Card className="w-full max-w-lg p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Cadastro</CardTitle>
        <CardDescription className="text-center">Preencha os campos abaixo para se cadastrar.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" {...field} />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="***********" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className="size-4 animate-spin" />}
            Entrar
          </Button>
        </form>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link className="text-primary" href="/auth/register">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Form>

      <div>
        <div>
          <Separator />
          <p>ou</p>
          <Separator />
        </div>
        <Button variant="outline" className="w-full" onClick={handleSignInWithGoogle}>
          Entrar com Google
        </Button>
      </div>
    </Card>
  )
}
