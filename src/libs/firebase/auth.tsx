import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React from 'react'

import { getFirebaseAuth, getFirebaseStore } from '~/libs/firebase'

const AuthContext = React.createContext<{
  Login: () => void
  Logout: () => void
}>({
  Login: () => {},
  Logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const Login = async () => {
    const auth = getFirebaseAuth()
    const db = getFirebaseStore()

    const provider = new GoogleAuthProvider()

    const res = await signInWithPopup(auth, provider)

    const userRef = doc(db, 'users', res.user.uid)

    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: res.user.uid,
        name: res.user.displayName,
        email: res.user.email,
        photoUrl: res.user.photoURL,
      })
    }

    const id = await res.user.getIdToken()

    await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
  }

  const Logout = async () => {
    await fetch('/api/sessionLogout', {
      method: 'POST',
    })
  }

  return (
    <AuthContext.Provider value={{ Login, Logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => React.useContext(AuthContext)
