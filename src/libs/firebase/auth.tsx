import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'

import { getFirebaseAuth, getFirebaseStore } from '~/libs/firebase'

const AuthContext = React.createContext<{
  loading: boolean
  user: User | null
  GoogleWithLogin: () => void
  EmailWithSignIn: (email: string, password: string) => void
  EmailWithSignUp: (email: string, password: string) => void
  Logout: () => void
}>({
  loading: false,
  user: null,
  GoogleWithLogin: () => {},
  EmailWithSignIn: () => {},
  EmailWithSignUp: () => {},
  Logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const auth = getFirebaseAuth()
  const db = getFirebaseStore()
  const router = useRouter()

  const EmailWithSignUp = async (email: string, password: string) => {
    //EmailandPasswordを使用してregisterとloginの処理を分ける

    const res = await createUserWithEmailAndPassword(auth, email, password)
    setLoading(true)

    setDoc(doc(db, 'users', res.user.uid), {
      uid: res.user.uid,
      name: res.user.displayName,
      email: res.user.email,
      photoUrl: res.user.photoURL,
    })

    const id = await res.user.getIdToken()

    await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }).then(() => {
      toast.success(`Hello!!! ${res.user.displayName}!`, {
        position: 'top-center',
        autoClose: 2000,
      })
    })

    setLoading(false)
    router.push('/')
  }

  const EmailWithSignIn = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password)

    setLoading(true)

    const id = await res.user.getIdToken()

    await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }).then(() => {
      toast.success(`Hello!!! ${res.user.displayName}!`, {
        position: 'top-center',
        autoClose: 2000,
      })
    })

    setLoading(false)
    router.push('/')
  }

  const GoogleWithLogin = async () => {
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
    }).then(() => {
      toast.success(`Hello!!! ${res.user.displayName}!`, {
        position: 'top-center',
        autoClose: 2000,
      })
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

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
  })

  return (
    <AuthContext.Provider
      value={{
        EmailWithSignIn,
        EmailWithSignUp,
        GoogleWithLogin,
        Logout,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuthContext = () => React.useContext(AuthContext)
