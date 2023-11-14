import { z } from 'zod'

export const RecipeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  beansName: z.string().min(1, { message: 'Beans name is required' }),
  elevation: z.string().min(1, { message: 'Elevation is required' }),
  roast: z.string().min(1, { message: 'Roast is required' }),
  process: z.string().min(1, { message: 'Process is required' }),
  taste: z.string().min(1, { message: 'Taste is required' }),
  mesh: z.string().min(1, { message: 'Mesh is required' }),
  temp: z.string().min(1, { message: 'Temp is required' }),
  createdAt: z.date(),
  updatedAt: z.date(),
  brewTime: z.array(
    z.object({
      key: z.string(),
      gram: z.string().min(1, { message: 'Gram is required' }),
      time: z.string().min(1, { message: 'Time is required' }),
    }),
  ),
})

export type RecipeType = z.infer<typeof RecipeSchema>
