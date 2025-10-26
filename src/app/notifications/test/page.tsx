'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useNotificationContext } from '@/components/notifications/notification-provider'
import { SubscribeButton } from '@/components/notifications/subscribe-button'
import { toast } from 'sonner'
import { useSubscriptions } from '@/services/notifications/queries/use-subscription'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Bell, AlertCircle } from 'lucide-react'

export default function NotificationTestPage() {
  const { permission, fcmToken, isSupported } = useNotificationContext()
  const { data: subscriptionsData, refetch } = useSubscriptions()
  const [logs, setLogs] = useState<string[]>([])
  const [testTitle, setTestTitle] = useState('Teste de Notificação')
  const [testBody, setTestBody] = useState('Esta é uma notificação de teste!')
  const [testUrl, setTestUrl] = useState('/dashboard')
  const [isSending, setIsSending] = useState(false)

  const subscriptions = subscriptionsData?.subscriptions || []

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50))
  }

  useEffect(() => {
    addLog('Página de teste carregada')
    addLog(`Suporte: ${isSupported ? 'Sim' : 'Não'}`)
    addLog(`Permissão: ${permission}`)
    addLog(`FCM Token: ${fcmToken ? 'Sim' : 'Não'}`)
  }, [isSupported, permission, fcmToken])

  const handleSendTest = async () => {
    if (!fcmToken) {
      toast.error('Você precisa se inscrever primeiro')
      return
    }

    setIsSending(true)
    addLog('Enviando notificação de teste...')

    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: testTitle,
          body: testBody,
          url: testUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        addLog(`Notificação enviada com sucesso (${data.sent} dispositivos)`)
        toast.success('Notificação de teste enviada!')
        refetch()
      } else {
        addLog(`Erro: ${data.error}`)
        toast.error(data.error)
      }
    } catch (error) {
      addLog(`Erro ao enviar: ${error}`)
      toast.error('Falha ao enviar notificação de teste')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendQuickTest = (type: 'daily' | 'morning' | 'evening') => {
    const quickTests = {
      daily: {
        title: '🎯 Suas tarefas diárias estão liberadas!',
        body: 'Comece sua jornada de bem-estar hoje.',
        url: '/dashboard',
      },
      morning: {
        title: '☀️ Bom dia! Pronto para tornar hoje especial?',
        body: 'Hora de começar seu dia com energia!',
        url: '/dashboard',
      },
      evening: {
        title: '🌙 Não esqueça de completar sua reflexão diária',
        body: 'Registre seus pensamentos e progressos.',
        url: '/diary',
      },
    }

    const test = quickTests[type]
    setTestTitle(test.title)
    setTestBody(test.body)
    setTestUrl(test.url)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teste de Notificações</h1>
        <p className="text-muted-foreground">Teste o sistema de notificações push e FCM</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>Informações sobre o sistema de notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Suporte:</span>
            {isSupported ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Suportado
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Não Suportado
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Permissão:</span>
            <Badge
              variant={permission === 'granted' ? 'default' : permission === 'denied' ? 'destructive' : 'secondary'}
            >
              {permission === 'granted' ? 'Concedida' : permission === 'denied' ? 'Negada' : 'Não solicitada'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Token FCM:</span>
            {fcmToken ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Não configurado
              </Badge>
            )}
          </div>

          {fcmToken && <div className="p-3 bg-muted rounded-md text-xs font-mono break-all">{fcmToken}</div>}

          <div className="flex items-center gap-2">
            <span className="font-medium">Inscrições ativas:</span>
            <Badge>{subscriptions.length} dispositivo(s)</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <SubscribeButton />
        </CardFooter>
      </Card>

      {/* Quick Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Testes Rápidos</CardTitle>
          <CardDescription>Exemplos de notificações pré-configuradas</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button onClick={() => handleSendQuickTest('daily')} variant="outline" size="sm">
            📋 Tarefas Diárias
          </Button>
          <Button onClick={() => handleSendQuickTest('morning')} variant="outline" size="sm">
            ☀️ Motivação Matinal
          </Button>
          <Button onClick={() => handleSendQuickTest('evening')} variant="outline" size="sm">
            🌙 Lembrete Noturno
          </Button>
        </CardContent>
      </Card>

      {/* Custom Notification Form */}
      <Card>
        <CardHeader>
          <CardTitle>Notificação Personalizada</CardTitle>
          <CardDescription>Crie e envie uma notificação customizada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={testTitle}
              onChange={e => setTestTitle(e.target.value)}
              placeholder="Título da notificação"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Mensagem</Label>
            <Textarea
              id="body"
              value={testBody}
              onChange={e => setTestBody(e.target.value)}
              placeholder="Mensagem da notificação"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL de destino</Label>
            <Input id="url" value={testUrl} onChange={e => setTestUrl(e.target.value)} placeholder="/dashboard" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendTest} disabled={isSending || !fcmToken} className="w-full">
            {isSending ? 'Enviando...' : 'Enviar Notificação'}
          </Button>
        </CardFooter>
      </Card>

      {/* Subscriptions List */}
      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Inscritos</CardTitle>
            <CardDescription>Seus dispositivos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscriptions.map(
                (sub: { id: string; deviceInfo: string | null; createdAt: string; enabled: boolean }) => (
                  <div key={sub.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">
                          {sub.deviceInfo
                            ? JSON.parse(sub.deviceInfo).userAgent.substring(0, 50) + '...'
                            : 'Dispositivo'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(sub.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <Badge variant={sub.enabled ? 'default' : 'secondary'}>{sub.enabled ? 'Ativo' : 'Inativo'}</Badge>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>Registro de atividades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">Nenhum log ainda</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="p-2 hover:bg-muted rounded">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setLogs([])} variant="outline" size="sm">
            Limpar Logs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
