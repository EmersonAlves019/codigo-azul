import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Middleware para proteger rotas API com autenticação
 * @param handler Função que processa a requisição com o userId autenticado
 * @returns {Promise<NextResponse>} Resposta da API
 */
export async function withAuth(
  handler: (userId: string, request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      })

      if (!session?.session?.userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }

      return handler(session.session.userId, request)
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}

/**
 * Obtém o ID do usuário autenticado de uma requisição
 * @returns {Promise<string>} ID do usuário autenticado
 * @throws {Error} Se o usuário não estiver autenticado
 */
export async function getAuthenticatedUserFromRequest(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.session?.userId) {
    throw new Error('Not authenticated')
  }

  return session.session.userId
}

