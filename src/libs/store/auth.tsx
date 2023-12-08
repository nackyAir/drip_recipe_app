import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React from 'react'

import { getFirebaseAuth, getFirebaseStore } from '~/libs/firebase'

const StoreAuthContext = React.createContext<{
  loading: boolean
  store: User | null
  GoogleWithLogin: () => void
  Logout: () => void
}>({
  loading: false,
  store: null,
  GoogleWithLogin: () => {},
  Logout: () => {},
})

export const StoreAuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [store, setStore] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const auth = getFirebaseAuth()
  const db = getFirebaseStore()

  const GoogleWithLogin = async () => {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)

    setLoading(true)

    const storeRef = doc(db, 'stores', res.user.uid)
    const storeSnap = await getDoc(storeRef)

    if (!storeSnap.exists()) {
      await setDoc(storeRef, {
        uid: res.user.uid,
        name: res.user.displayName,
        email: res.user.email,
        photoUrl: res.user.photoURL,
      })
    }

    const id = await res.user.getIdToken()
    await fetch('/api/store/session', {
      method: 'POST',
      body: JSON.stringify({ sroreId: id }),
    })

    setLoading(false)
  }

  const Logout = async () => {
    setLoading(true)
    await fetch('/api/store/sessionLogout', {
      method: 'POST',
    })
    setLoading(false)
  }

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setStore(user)
      } else {
        setStore(null)
      }
    })
  })

  return (
    <StoreAuthContext.Provider
      value={{
        loading,
        store,
        GoogleWithLogin,
        Logout,
      }}
    >
      {children}
    </StoreAuthContext.Provider>
  )
}

export const useStoreAuthContext = () => React.useContext(StoreAuthContext)
