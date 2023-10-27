import admin from 'firebase-admin'

export const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(
    /\\n/g,
    '\n',
  ),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
}

export const firebaseAdmin =
  admin.apps[0] ||
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
