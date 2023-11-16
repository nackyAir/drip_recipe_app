import { Box, Card, Modal, Title, createStyles } from '@mantine/core'
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
import { CreateRecipeForm } from '~/components/mol/Form/createRecipeForm'
import { getFirebaseStore } from '~/libs/firebase'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'
import { RecipeType } from '~/types'

const Home = () => {
  return (
    <Layout>
      <Title align="center">Recipe List</Title>
      <RecipeList />
    </Layout>
  )
}

const RecipeList = () => {
  const { user } = useAuthContext()
  const [opened, { open, close }] = useDisclosure(false)
  const [recipe, setRecipe] = React.useState<RecipeType[]>([])

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

  return (
    <>
      <Box className={classes.box}>
        <Card className={classes.addRecipeCard} onClick={open}>
          Create Recipe
        </Card>
        {recipe.map((value: RecipeType) => (
          <RecipeCard key={value.id} value={value} classes={classes.card} />
        ))}
      </Box>

      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        centered
        transitionProps={{
          transition: 'fade',
          duration: 200,
        }}
      >
        <Modal.Title
          style={{
            fontSize: 30,
            fontWeight: 600,
            textAlign: 'center',
            paddingBottom: 20,
          }}
        >
          Create Recipe
        </Modal.Title>
        <Modal.Body>
          <CreateRecipeForm close={close} />
        </Modal.Body>
      </Modal>
    </>
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
