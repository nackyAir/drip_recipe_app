import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import { getFirebaseAuth, getFirebaseStore } from '~/libs/firebase'

const AuthContext = React.createContext<{
  loading: boolean
  user: User | null
  Login: () => void
  Logout: () => void
}>({
  loading: false,
  user: null,
  Login: () => {},
  Logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const auth = getFirebaseAuth()

  const Login = async () => {
    const auth = getFirebaseAuth()
    const db = getFirebaseStore()

    const provider = new GoogleAuthProvider()

    const res = await signInWithPopup(auth, provider)

    setLoading(true)

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

    setLoading(false)
  }

  const Logout = async () => {
    setLoading(true)
    await fetch('/api/sessionLogout', {
      method: 'POST',
    })

    setLoading(false)
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) setUser(user)
      return setUser(null)
    })
  })

  return (
    <AuthContext.Provider value={{ Login, Logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => React.useContext(AuthContext)
