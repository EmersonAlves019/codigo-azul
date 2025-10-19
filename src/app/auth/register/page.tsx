import { Suspense } from 'react'
import { SignupForm } from '@/app/auth/register/_components/signup-form'
import { Loading } from '@/components/ui/loading'

export default function SignUp() {
  return (
    <Suspense fallback={<Loading variant="centered" message="Carregando formulário..." showLogo />}>
      <SignupForm />
    </Suspense>
  )
}
