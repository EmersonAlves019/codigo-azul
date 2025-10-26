import admin from 'firebase-admin'

let initialized = false

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set')
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
    initialized = true
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    throw new Error('Failed to initialize Firebase Admin SDK. Check your environment variables.')
  }

  return admin
}

// Initialize Firebase Admin when this module is imported
// Only throw errors when actually using the admin instance
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    initializeFirebase()
  } catch (error) {
    // Don't fail during build if Firebase is not properly configured
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase Admin not initialized:', error)
    }
  }
}

export default admin
export { initializeFirebase }
