import { Card, Text } from '@mantine/core'

import { RecipeType } from '~/types'

export const RecipeCard = (value: RecipeType) => {
  return (
    <Card>
      <Text>{value.name}</Text>
      <Text>{value.beansName}</Text>
      <Text>{value.elevation}</Text>
    </Card>
  )
}
