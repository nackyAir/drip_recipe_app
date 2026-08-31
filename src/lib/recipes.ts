import { desc, eq } from 'drizzle-orm'

import { db } from '~/db'
import { recipes } from '~/db/schema'
import { RecipeType } from '~/types'

const toRecipe = (row: typeof recipes.$inferSelect): RecipeType => ({
  id: row.id,
  userId: row.userId,
  name: row.name,
  beansName: row.beansName,
  elevation: row.elevation,
  roast: row.roast,
  process: row.process,
  taste: row.taste,
  mesh: row.mesh,
  temp: row.temp,
  brewTime: row.brewTime,
})

export const getRecipesByUserId = async (userId: string) => {
  const rows = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt))

  return rows.map(toRecipe)
}
