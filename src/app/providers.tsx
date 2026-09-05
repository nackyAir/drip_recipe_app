'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

import { CacheProvider } from '@emotion/react'
import { MantineProvider, useEmotionCache } from '@mantine/core'

import { AuthProvider } from '~/lib/auth-context'
import { appTheme } from '~/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache()
  cache.compat = true

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ))

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        emotionCache={cache}
        theme={appTheme}
      >
        <AuthProvider>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            theme="colored"
            toastClassName="app-toast"
          />
          {children}
        </AuthProvider>
      </MantineProvider>
    </CacheProvider>
  )
}
