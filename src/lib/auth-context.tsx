'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { authClient } from '~/lib/auth-client'
import { getAuthErrorMessage } from '~/lib/auth-errors'

export type AuthUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

const AuthContext = React.createContext<{
  loading: boolean
  user: AuthUser | null
  GoogleWithLogin: () => Promise<void>
  EmailWithSignIn: (email: string, password: string) => Promise<void>
  EmailWithSignUp: (email: string, password: string) => Promise<void>
  Logout: () => Promise<void>
}>({
  loading: false,
  user: null,
  GoogleWithLogin: async () => {},
  EmailWithSignIn: async () => {},
  EmailWithSignUp: async () => {},
  Logout: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null

  const EmailWithSignUp = async (email: string, password: string) => {
    setLoading(true)

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split('@')[0] || email,
      callbackURL: '/user',
    })

    setLoading(false)

    if (error) {
      toast.error(getAuthErrorMessage(error), {
        position: 'top-center',
        autoClose: 2000,
      })
      return
    }

    toast.success('Hello!!!', {
      position: 'top-center',
      autoClose: 2000,
    })
    router.push('/user')
    router.refresh()
  }

  const EmailWithSignIn = async (email: string, password: string) => {
    setLoading(true)

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/user',
    })

    setLoading(false)

    if (error) {
      toast.error(getAuthErrorMessage(error), {
        position: 'top-center',
        autoClose: 2000,
      })
      return
    }

    toast.success(`Hello!!! ${data?.user.name ?? ''}!`, {
      position: 'top-center',
      autoClose: 2000,
    })
    router.push('/user')
    router.refresh()
  }

  const GoogleWithLogin = async () => {
    setLoading(true)

    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/user',
    })

    if (error) {
      setLoading(false)
      toast.error(getAuthErrorMessage(error), {
        position: 'top-center',
        autoClose: 2000,
      })
    }
  }

  const Logout = async () => {
    setLoading(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/user/login')
          router.refresh()
        },
      },
    })
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        EmailWithSignIn,
        EmailWithSignUp,
        GoogleWithLogin,
        Logout,
        user,
        loading: loading || isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => React.useContext(AuthContext)
