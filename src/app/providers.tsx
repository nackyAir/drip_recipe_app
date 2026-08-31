'use client'

import { CacheProvider } from '@emotion/react'
import { MantineProvider, useEmotionCache } from '@mantine/core'
import { useServerInsertedHTML } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

import { AuthProvider } from '~/lib/auth-context'

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
      >
        <AuthProvider>
          <ToastContainer />
          {children}
        </AuthProvider>
      </MantineProvider>
    </CacheProvider>
  )
}
