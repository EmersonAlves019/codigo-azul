'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useNotificationPreferences } from '@/services/notifications/queries/use-preferences'
import { useSubscriptions } from '@/services/notifications/queries/use-subscription'
import { updateNotificationPreferences } from '@/services/notifications/actions/update-preferences'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Bell, Clock, Globe } from 'lucide-react'

export default function NotificationPreferencesPage() {
  const queryClient = useQueryClient()
  const { data: preferencesData, isLoading } = useNotificationPreferences()
  const { data: subscriptionsData } = useSubscriptions()

  const preferences = preferencesData?.preferences || null
  const subscriptions = subscriptionsData?.subscriptions || []

  const [dailyTasksEnabled, setDailyTasksEnabled] = useState(preferences?.dailyTasksEnabled ?? true)
  const [dailyTasksTime, setDailyTasksTime] = useState(preferences?.dailyTasksTime ?? '09:00')
  const [morningEnabled, setMorningEnabled] = useState(preferences?.morningEnabled ?? false)
  const [morningTime, setMorningTime] = useState(preferences?.morningTime ?? '07:00')
  const [eveningEnabled, setEveningEnabled] = useState(preferences?.eveningEnabled ?? false)
  const [eveningTime, setEveningTime] = useState(preferences?.eveningTime ?? '19:00')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const result = await updateNotificationPreferences({
        dailyTasksEnabled,
        dailyTasksTime,
        morningEnabled,
        morningTime,
        eveningEnabled,
        eveningTime,
      })

      if (result.success) {
        toast.success('Preferências salvas com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] })
      } else {
        toast.error(result.error || 'Falha ao salvar preferências')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Erro ao salvar preferências')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendTestNotification = async () => {
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '🔔 Notificação de Teste',
          body: 'Suas preferências de notificação foram configuradas com sucesso!',
          url: '/settings/notifications',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Notificação de teste enviada!')
      } else {
        toast.error(data.error || 'Falha ao enviar notificação de teste')
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
      toast.error('Erro ao enviar notificação de teste')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Preferências de Notificações</h1>
        <p className="text-muted-foreground">Configure quando e como você deseja receber notificações</p>
      </div>

      {/* Daily Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Tarefas Diárias</CardTitle>
          </div>
          <CardDescription>Receba notificações quando suas tarefas diárias estiverem disponíveis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-tasks">Notificações de Tarefas Diárias</Label>
              <p className="text-sm text-muted-foreground">Ative para receber lembretes sobre suas tarefas</p>
            </div>
            <Switch id="daily-tasks" checked={dailyTasksEnabled} onCheckedChange={setDailyTasksEnabled} />
          </div>

          {dailyTasksEnabled && (
            <div className="flex items-center gap-4">
              <Label htmlFor="daily-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário:
              </Label>
              <Input
                id="daily-time"
                type="time"
                value={dailyTasksTime}
                onChange={e => setDailyTasksTime(e.target.value)}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Morning Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Motivação Matinal</CardTitle>
          </div>
          <CardDescription>Comece o dia com uma dose de motivação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="morning">Notificações Matinais</Label>
              <p className="text-sm text-muted-foreground">Mensagens inspiradoras para começar bem o dia</p>
            </div>
            <Switch id="morning" checked={morningEnabled} onCheckedChange={setMorningEnabled} />
          </div>

          {morningEnabled && (
            <div className="flex items-center gap-4">
              <Label htmlFor="morning-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário:
              </Label>
              <Input
                id="morning-time"
                type="time"
                value={morningTime}
                onChange={e => setMorningTime(e.target.value)}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evening Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Lembrete Noturno</CardTitle>
          </div>
          <CardDescription>Receba lembretes para completar suas atividades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="evening">Notificações Noturnas</Label>
              <p className="text-sm text-muted-foreground">Lembrete para completar sua reflexão diária</p>
            </div>
            <Switch id="evening" checked={eveningEnabled} onCheckedChange={setEveningEnabled} />
          </div>

          {eveningEnabled && (
            <div className="flex items-center gap-4">
              <Label htmlFor="evening-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário:
              </Label>
              <Input
                id="evening-time"
                type="time"
                value={eveningTime}
                onChange={e => setEveningTime(e.target.value)}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Devices */}
      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Dispositivos Conectados</CardTitle>
            </div>
            <CardDescription>Seus dispositivos registrados para receber notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscriptions.map(
                (sub: { id: string; deviceInfo: string | null; createdAt: string; enabled: boolean }) => {
                  const deviceInfo = sub.deviceInfo ? JSON.parse(sub.deviceInfo) : null
                  return (
                    <div key={sub.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="text-sm font-medium">
                          {deviceInfo?.userAgent?.substring(0, 60) || 'Dispositivo'}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Registrado em {new Date(sub.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Preferências
        </Button>
        <Button onClick={handleSendTestNotification} variant="outline">
          Enviar Notificação de Teste
        </Button>
      </div>
    </div>
  )
}
