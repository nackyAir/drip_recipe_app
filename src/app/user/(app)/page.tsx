import { redirect } from 'next/navigation'

import { RecipeList } from '~/app/user/(app)/recipe-list'
import { getRecipesByUserId } from '~/lib/recipes'
import { getSession } from '~/lib/session'

export const dynamic = 'force-dynamic'

export default async function UserPage() {
  const session = await getSession()

  if (!session) {
    redirect('/user/login')
  }

  const recipes = await getRecipesByUserId(session.user.id)

  return <RecipeList recipes={recipes} />
}
