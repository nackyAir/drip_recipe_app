import { Card, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { RecipeType } from '~/types'

import { RecipeModal } from '../Modal/recipeModal'

export const RecipeCard = ({
  value,
  classes,
}: {
  value: RecipeType
  classes: string
}) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Card className={classes} onClick={open}>
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
      </Card>
      <RecipeModal onClose={close} opened={opened} data={value} />
    </>
  )
}
