/* eslint-disable */
// Firebase SDK Compat para Service Workers
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyDgV0a1NbLt4OTWAVZwynDgECJ3L2JRtZE',
  authDomain: 'balanca-no-azul.firebaseapp.com',
  projectId: 'balanca-no-azul',
  storageBucket: 'balanca-no-azul.firebasestorage.app',
  messagingSenderId: '553092680252',
  appId: '1:553092680252:web:45552f89a7ada66bfb1139',
}

// Inicializar Firebase
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification?.title || 'Nova notificação'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.fcmOptions?.link || 'notification',
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || '/',
    },
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})
