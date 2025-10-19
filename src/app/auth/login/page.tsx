import { Suspense } from 'react'
import { SigninForm } from './_components/signin-form'
import { Loading } from '@/components/ui/loading'

export default function SignIn() {
  return (
    <Suspense fallback={<Loading variant="centered" message="Carregando formulário..." showLogo />}>
      <SigninForm />
    </Suspense>
  )
}
