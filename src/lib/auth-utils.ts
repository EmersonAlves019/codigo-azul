'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Obtém o ID do usuário autenticado
 * @throws {Error} Se o usuário não estiver autenticado
 * @returns {Promise<string>} ID do usuário
 */
export async function getAuthenticatedUser(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers()
  })    

  if (!session?.session?.userId) {
    throw new Error('User not authenticated')
  }

  return session.session.userId
}

