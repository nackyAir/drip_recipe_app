import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

import { MantineProvider } from '@mantine/core'

import { AuthProvider } from '~/libs/user/auth'
import '~/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <ToastContainer />
          <Component {...pageProps} />
        </MantineProvider>
      </AuthProvider>
    </>
  )
}
