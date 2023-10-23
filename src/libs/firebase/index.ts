import * as app from 'firebase/app'
import * as auth from 'firebase/auth'
import * as store from 'firebase/firestore'

export const firebaseCofig: app.FirebaseOptions = {
  apiKey: 'AIzaSyCVzT9y9JA3tx7HTt0XMf4iupjydfHRpcY',
  authDomain: 'coffeerecipeapp-59c25.firebaseapp.com',
  projectId: 'coffeerecipeapp-59c25',
  storageBucket: 'coffeerecipeapp-59c25.appspot.com',
  messagingSenderId: '433767915559',
  appId: '1:433767915559:web:945bda7ede9c94cedb2e02',
}

const getFirebaseApp = (): app.FirebaseApp | undefined => {
  if (typeof window !== 'undefined') return
  return app.getApps()[0] || app.initializeApp(firebaseCofig)
}

const getFirebaseAuth = (): auth.Auth => {
  const app = getFirebaseApp()
  return auth.getAuth(app)
}

const getFirebaseStore = (): store.Firestore => {
  return store.getFirestore()
}

export { getFirebaseApp, getFirebaseAuth, getFirebaseStore }
