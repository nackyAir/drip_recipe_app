import type { Metadata, Viewport } from 'next'
import { Fraunces, Noto_Sans_JP } from 'next/font/google'

import { Providers } from '~/app/providers'
import '~/styles/globals.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Coffee Recipe | ドリップレシピ帳',
  description:
    '豆のプロフィールから注湯スケジュールまで、バリスタのためのコーヒーレシピ管理アプリ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
