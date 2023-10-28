import { MantineProvider } from '@mantine/core'

import type { AppProps } from 'next/app'

import { AuthProvider } from '~/libs/firebase/auth'
import '~/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <Component {...pageProps} />
        </MantineProvider>
      </AuthProvider>
    </>
  )
}
