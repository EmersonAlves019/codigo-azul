'use client'

import { useQuery } from '@tanstack/react-query'

async function getPreferences() {
  const response = await fetch('/api/notifications/preferences')
  
  if (!response.ok) {
    throw new Error('Failed to fetch preferences')
  }

  return response.json()
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: getPreferences,
    retry: 1,
  })
}
