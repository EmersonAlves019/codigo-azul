import admin from 'firebase-admin'
import { readFileSync } from 'fs'


let initialized = false

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin
  }

  let credential

  try {
    const serviceAccount = JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || '', 'utf8'))
    credential = admin.credential.cert(serviceAccount)
  } catch {
    throw new Error('Firebase credentials not found. Either provide service-account-key.json or set FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, and FIREBASE_CLIENT_EMAIL environment variables.')
  }

  try {
    admin.initializeApp({
      credential,
    })
    initialized = true
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    throw new Error('Failed to initialize Firebase Admin SDK. Check your credentials.')
  }

  return admin
}


if (process.env.NODE_ENV === 'production' || process.env.FIREBASE_PROJECT_ID) {
  try {
    initializeFirebase()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase Admin not initialized:', error)
    }
  }
}

export default admin
export { initializeFirebase }
