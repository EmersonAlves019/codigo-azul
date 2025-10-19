import { NextRequest, NextResponse } from 'next/server'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
]

// Rotas que precisam de autenticação
const protectedRoutes = [
  '/dashboard',
  '/welcome',
  '/personalization',
  '/journey',
  '/diary',
  '/progress',
  '/pillars',
  '/home',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Se não é nem pública nem protegida, permitir acesso
  if (!isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // Se é uma rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Se é uma rota protegida, verificar autenticação via cookie
  if (isProtectedRoute) {
    try {
      // Verificar se existe o cookie de sessão do Better Auth
      const sessionCookie = request.cookies.get('better-auth.session_token')
      
      // Se não há cookie de sessão, redirecionar para login
      if (!sessionCookie) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Se há cookie de sessão, permitir acesso (a validação real será feita no cliente)
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware auth error:', error)
      // Em caso de erro, redirecionar para login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
