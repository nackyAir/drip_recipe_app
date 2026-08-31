'use client'

import React from 'react'

import { Box, Card, Title, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { RecipeCard } from '~/components/mol/Card/recipeCard'
import { RecipeModal } from '~/components/mol/Modal/recipeModal'
import { RecipeType } from '~/types'

export const RecipeList = ({ recipes }: { recipes: RecipeType[] }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const styles = createStyles(() => {
    return {
      box: {
        padding: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
        margin: '0 auto',
      },

      addRecipeCard: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 0 20px rgba(0, 0, 0, .1)',
        border: '1px solid #eee',
        display: 'flex',
        gridTemplateRows: 'repeat(auto-fill, minmax(30px, 1fr))',
        gap: 10,
        cursor: 'pointer',
      },

      card: {
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 0 20px rgba(0, 0, 0, .1)',
        border: '1px solid #eee',
        display: 'grid',
        gap: 10,
        '& > *': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      },
    }
  })

  const { classes } = styles()

  return (
    <>
      <Title align="center">Recipe List</Title>
      <Box className={classes.box}>
        <Card className={classes.addRecipeCard} onClick={open}>
          Create Recipe
        </Card>
        {recipes.map((value: RecipeType) => (
          <RecipeCard key={value.id} value={value} classes={classes.card} />
        ))}
      </Box>
      <RecipeModal onClose={close} opened={opened} />
    </>
  )
}
