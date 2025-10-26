import admin from 'firebase-admin'
import { readFileSync } from 'fs'


let initialized = false

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin
  }

  const credentialsPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
  
  if (!credentialsPath) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable is not set')
  }

  let credential

  try {
    const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'))
    credential = admin.credential.cert(serviceAccount)
  } catch (error) {
    console.error('Failed to load Firebase service account from:', credentialsPath)
    throw new Error(`Failed to load Firebase credentials from ${credentialsPath}. ${error instanceof Error ? error.message : 'Unknown error'}`)
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
