import { Button, Title } from '@mantine/core'

import { useRouter } from 'next/router'

import { RecipeType } from '~/types'

export const PageExist = ({ data }: { data: RecipeType }) => {
  const router = useRouter()
  return (
    <>
      <Button
        onClick={() => {
          router.back()
        }}
      >
        ←back
      </Button>
      <Title>{data.name}</Title>
      <Title>{data.beansName}</Title>
      <Title>{data.elevation}</Title>
    </>
  )
}
