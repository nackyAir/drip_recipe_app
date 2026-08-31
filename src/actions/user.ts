'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, ne } from 'drizzle-orm'

import { db } from '~/db'
import { user } from '~/db/schema'
import { getSession } from '~/lib/session'

export const updateProfile = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  const session = await getSession()

  if (!session) {
    return { error: 'ログインが必要です' }
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(and(eq(user.email, email), ne(user.id, session.user.id)))
    .limit(1)

  if (existing) {
    return { error: 'このメールアドレスは既に使用されています' }
  }

  await db
    .update(user)
    .set({
      name,
      email,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id))

  revalidatePath('/', 'layout')
  return { success: true }
}
