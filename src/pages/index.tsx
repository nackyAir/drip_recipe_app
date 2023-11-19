import { Box, Card, Title, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'
import React from 'react'

import { Layout } from '~/Layout/layout'
import { RecipeCard } from '~/components/mol/Card/recipeCard'
import { RecipeModal } from '~/components/mol/Modal/recipeModal'
import { getFirebaseStore } from '~/libs/firebase'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'
import { RecipeType } from '~/types'

const Home = () => {
  const { user } = useAuthContext()
  const [opened, { open, close }] = useDisclosure(false)
  const [recipe, setRecipe] = React.useState<RecipeType[]>([])

  const styles = createStyles(() => {
    return {
      bottuonGroup: {
        padding: '2rem 0',
      },

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

  React.useMemo(() => {
    if (user) {
      const db = getFirebaseStore()
      const recipeRef = collection(db, 'recipes')

      const q = query(
        recipeRef,
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc'),
      )

      onSnapshot(q, (snapshot) => {
        if (snapshot.empty) return

        let data: RecipeType[] = []

        snapshot.forEach((docs) => {
          data.push(docs.data() as RecipeType)
        })

        setRecipe(data)
      })
    }
  }, [user])
  return (
    <Layout>
      <Title align="center">Recipe List</Title>
      <Box className={classes.box}>
        <Card className={classes.addRecipeCard} onClick={open}>
          Create Recipe
        </Card>
        {recipe.map((value: RecipeType) => (
          <RecipeCard key={value.id} value={value} classes={classes.card} />
        ))}
      </Box>
      <RecipeModal onClose={close} opened={opened} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = firebaseAdmin.auth()
  const cookies = nookies.get(ctx)
  const session = cookies.session || ''

  const userSettion = await auth
    .verifySessionCookie(session, true)
    .catch(() => null)

  if (!userSettion) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { userSettion },
  }
}

export default Home
