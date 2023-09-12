import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'

import '~/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}
