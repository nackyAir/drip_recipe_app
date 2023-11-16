import { Button } from '@mantine/core'

import { useRouter } from 'next/router'

import { EditRecipeform } from '~/components/mol/Form/editRecipeForm'
import { RecipeType } from '~/types'

export const PageExist = (recipeData: RecipeType) => {
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

      <EditRecipeform data={recipeData} />
    </>
  )
}
