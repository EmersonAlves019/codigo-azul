'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'

export function SignoutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      toast.success('Logout realizado com sucesso!', {
        description: 'Obrigado por usar nossa plataforma',
      })
      router.push('/auth/login')
    } catch {
      toast.error('Erro ao fazer logout', {
        description: 'Tente novamente',
      })
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut} className="rounded-xl">
      <LogOut className="w-4 h-4 mr-2" />
      Sair
    </Button>
  )
}
