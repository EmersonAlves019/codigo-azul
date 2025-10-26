import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getMessaging, Messaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | undefined
let messaging: Messaging | undefined

// Inicializar apenas no cliente
if (typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
    
    // Inicializar messaging de forma síncrona
    if (app && 'Notification' in window && 'serviceWorker' in navigator) {
      messaging = getMessaging(app)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao inicializar Firebase:', error)
    }
  }
}

export { app, messaging }
