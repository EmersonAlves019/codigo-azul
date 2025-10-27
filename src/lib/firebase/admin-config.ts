import admin from 'firebase-admin'

let initialized = false

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase environment variables not set. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY')
  }

  let credential

  try {
    // Handle the private key - it might have escaped newlines or actual newlines
    const formattedPrivateKey = privateKey
      .replace(/\\n/g, '\n')  // Replace escaped newlines
      .replace(/\\"/g, '"')   // Replace escaped quotes
    
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: formattedPrivateKey,
    })
  } catch (error) {
    console.error('Failed to initialize Firebase credentials:', error)
    throw new Error(`Failed to initialize Firebase credentials. ${error instanceof Error ? error.message : 'Unknown error'}`)
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
