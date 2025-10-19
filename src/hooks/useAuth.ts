'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession()
        if (session?.data?.user) {
          setUser(session.data.user as User)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Poll for session changes every 30 seconds
    const interval = setInterval(checkAuth, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
  }
}
