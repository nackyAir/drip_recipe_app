import { redirect } from 'next/navigation'

import { Layout } from '~/Layout/layout'
import { getSession } from '~/lib/session'

export const dynamic = 'force-dynamic'

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/user/login')
  }

  return <Layout user={session.user}>{children}</Layout>
}
