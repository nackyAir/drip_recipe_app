import type { Metadata } from 'next'

import { Providers } from '~/app/providers'
import '~/styles/globals.css'

export const metadata: Metadata = {
  title: 'Coffee Recipe App',
  description: 'バリスタ目線に沿ったコーヒーのドリップレシピを管理するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
