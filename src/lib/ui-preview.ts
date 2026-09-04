import { RecipeType } from '~/types'

export const isUiPreviewEnabled = () =>
  process.env.NEXT_PUBLIC_UI_PREVIEW === 'true' &&
  process.env.NODE_ENV !== 'production'

export const previewUser = {
  id: 'ui-preview-user',
  name: 'プレビューユーザー',
  email: 'preview@example.com',
  image: null as string | null,
}

export const previewRecipes: RecipeType[] = [
  {
    id: 'preview-1',
    userId: previewUser.id,
    name: '朝の浅煎り',
    beansName: 'Ethiopia Yirgacheffe',
    elevation: '1900m',
    roast: '浅煎り',
    process: 'Washed',
    taste: '柑橘、ジャスミン、紅茶',
    mesh: '中細挽き',
    temp: '91℃',
    brewTime: [
      { key: 'a', time: '0:30', gram: '50g' },
      { key: 'b', time: '1:00', gram: '100g' },
      { key: 'c', time: '2:00', gram: '180g' },
    ],
  },
  {
    id: 'preview-2',
    userId: previewUser.id,
    name: '午後のブレンド',
    beansName: 'Brazil / Guatemala',
    elevation: '1200m',
    roast: '中煎り',
    process: 'Natural',
    taste: 'チョコレート、ナッツ',
    mesh: '中挽き',
    temp: '88℃',
    brewTime: [
      { key: 'd', time: '0:45', gram: '60g' },
      { key: 'e', time: '1:45', gram: '200g' },
    ],
  },
]
