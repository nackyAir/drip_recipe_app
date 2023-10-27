import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { getFirebaseAuth } from '~/libs/firebase'

export const Login = async () => {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()

  const res = await signInWithPopup(auth, provider)
  const id = await res.user.getIdToken()

  await fetch('/api/session', { method: 'POST', body: JSON.stringify({ id }) })
}

export const Logout = async () => {
  await fetch('/api/sessionLogout', {
    method: 'POST',
  })
}
