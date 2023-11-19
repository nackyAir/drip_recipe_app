import { Button } from '@mantine/core'

import { useRouter } from 'next/router'

import { RecipeForm } from '~/components/mol/Form/recipeform'

export const PageExist = () => {
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

      <RecipeForm />
    </>
  )
}
