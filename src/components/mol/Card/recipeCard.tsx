import { Card, Group, Modal, Text } from '@mantine/core'


import { RecipeType } from '~/types'
import { RecipeModal } from '../Modal/recipeModal'
import { useDisclosure } from '@mantine/hooks'

export const RecipeCard = ({ value, classes, open, opened,onClose,recipe_id}: {
  recipe_id?: string
  opened: boolean
  onClose: () => void
  open:   () => void
  value: RecipeType
  classes: string
}) => {

  return (
    <>
      <Card className={classes} onClick={open} key={recipe_id}>
        <Text>{value.name}</Text>
        <Text>{value.beansName}</Text>
        <Text>{value.elevation}</Text>
        <Text>{value.process}</Text>
        <Text>{value.mesh}</Text>
        <Text>{value.temp}</Text>
        {value.brewTime.map((value) => (
          <Group key={value.key}>
            <Text>{value.time}</Text>
            <Text>{value.gram}</Text>
          </Group>

        ))}
        <RecipeModal opened={opened} onClose={onClose} data={value} recipe_id={recipe_id}  />
        </Card>

    </>
  )
}
