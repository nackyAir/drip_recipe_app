import { Card, Group, Text } from '@mantine/core'

import Link from 'next/link'

import { RecipeType } from '~/types'

type Props = {
  value: RecipeType
  classes?: string
}

export const RecipeCard = ({ value, classes }: Props) => {
  return (
    <Link href={`/${value.id}`} passHref legacyBehavior>
      <Card className={classes}>
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
    </Link>
  )
}
