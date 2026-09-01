import { redirect } from 'next/navigation'

import { Layout } from '~/Layout/layout'
import { getSession } from '~/lib/session'
import { isUiPreviewEnabled, previewUser } from '~/lib/ui-preview'

export const dynamic = 'force-dynamic'

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isUiPreviewEnabled()) {
    return <Layout user={previewUser}>{children}</Layout>
  }

  const session = await getSession()

  if (!session) {
    redirect('/user/login')
  }

  return <Layout user={session.user}>{children}</Layout>
}
