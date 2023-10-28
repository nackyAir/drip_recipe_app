import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React from 'react'

import { getFirebaseAuth } from '~/libs/firebase'

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
    const provider = new GoogleAuthProvider()

    const res = await signInWithPopup(auth, provider)
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
