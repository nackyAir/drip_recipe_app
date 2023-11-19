import { MantineProvider } from '@mantine/core'

import type { AppProps } from 'next/app'

import { AuthProvider } from '~/libs/firebase/auth'
import '~/styles/globals.css'
import "react-toastify/ReactToastify.css"
import { ToastContainer } from 'react-toastify'

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
