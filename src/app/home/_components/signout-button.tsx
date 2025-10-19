'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function SignoutButton() {
  const handleSignOut = async () => {
    await authClient.signOut()
  }
  return <Button onClick={handleSignOut}>Sair</Button>
}
