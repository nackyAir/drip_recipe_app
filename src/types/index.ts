import { z } from 'zod'

export const RecipeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string().min(1, { message: 'レシピ名を入力してください' }),
  beansName: z.string().min(1, { message: '豆の名前を入力してください' }),
  elevation: z.string().min(1, { message: '標高を入力してください' }),
  roast: z.string().min(1, { message: '焙煎を入力してください' }),
  process: z.string().min(1, { message: '精製方法を入力してください' }),
  taste: z.string().min(1, { message: '味わいを入力してください' }),
  mesh: z.string().min(1, { message: '粒度を入力してください' }),
  temp: z.string().min(1, { message: '湯温を入力してください' }),
  brewTime: z.array(
    z.object({
      key: z.string(),
      gram: z.string().min(1, { message: '累計グラムを入力してください' }),
      time: z.string().min(1, { message: '時間を入力してください' }),
    }),
  ),
})

export type RecipeType = z.infer<typeof RecipeSchema>
