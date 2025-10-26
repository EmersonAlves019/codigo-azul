'use client'

import { authClient } from '@/lib/auth-client'
import { useQuery } from '@tanstack/react-query'


async function getSubscriptions() {
  const session = await  authClient.getSession()
  
  if (!session?.data?.user?.id) {
    return { subscriptions: [] }
  }

  const response = await fetch('/api/notifications/subscriptions')
  
  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions')
  }

  return response.json()
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ['notifications', 'subscriptions'],
    queryFn: getSubscriptions,
    retry: 1,
  })
}
