'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'

import { db } from '~/db'
import { recipes } from '~/db/schema'
import { getSession } from '~/lib/session'
import { RecipeType } from '~/types'

const revalidateRecipes = () => {
  revalidatePath('/user')
}

export const createRecipe = async (value: RecipeType) => {
  const session = await getSession()

  if (!session) {
    return { error: 'ログインが必要です' }
  }

  const id = crypto.randomUUID()

  await db.insert(recipes).values({
    id,
    userId: session.user.id,
    name: value.name,
    beansName: value.beansName,
    elevation: value.elevation,
    roast: value.roast,
    process: value.process,
    taste: value.taste,
    mesh: value.mesh,
    temp: value.temp,
    brewTime: value.brewTime,
  })

  revalidateRecipes()
  return { id }
}

export const updateRecipe = async (value: RecipeType) => {
  const session = await getSession()

  if (!session) {
    return { error: 'ログインが必要です' }
  }

  await db
    .update(recipes)
    .set({
      name: value.name,
      beansName: value.beansName,
      elevation: value.elevation,
      roast: value.roast,
      process: value.process,
      taste: value.taste,
      mesh: value.mesh,
      temp: value.temp,
      brewTime: value.brewTime,
      updatedAt: new Date(),
    })
    .where(and(eq(recipes.id, value.id), eq(recipes.userId, session.user.id)))

  revalidateRecipes()
  return { id: value.id }
}

export const deleteRecipe = async (recipeId: string) => {
  const session = await getSession()

  if (!session) {
    return { error: 'ログインが必要です' }
  }

  await db
    .delete(recipes)
    .where(and(eq(recipes.id, recipeId), eq(recipes.userId, session.user.id)))

  revalidateRecipes()
  return { id: recipeId }
}
