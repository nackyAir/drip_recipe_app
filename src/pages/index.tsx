import { Button, Card, Group, Modal, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'
import { useEffect, useState } from 'react'

import { Layout } from '~/Layout/layout'
import { RecipeCard } from '~/components/mol/Card/recipeCard'
import { CreateRecipeForm } from '~/components/org/newRecipeForm'
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
  const [recipe, setRecipe] = useState<RecipeType[]>([])

  useEffect(() => {
    if (user) {
      const db = getFirebaseStore()
      const recipeRef = collection(db, 'recipes')
      const q = query(recipeRef, where('userId', '==', user?.uid))

      const ununsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          console.log('レシピデータがありません')
          return
        }

        let data: RecipeType[] = []

        snapshot.forEach((docs) => {
          data.push(docs.data() as RecipeType)
        })

        setRecipe(data)
      })
      return ununsubscribe
    }
  }, [user])

  return (
    <>
      {recipe.map((value: RecipeType) => {
        return (
          <Card key={value.id}>
            <Text>{value.name}</Text>
            <Text>{value.beansName}</Text>
            <Text>{value.elevation}</Text>
            {value.brewTime.map((d) => (
              <Group key={d.key}>
                <Text>{d.time}</Text>
                <Text>{d.gram}</Text>
              </Group>
            ))}
          </Card>
        )
      })}

      <RecipeCard value={recipe} />

      <Button onClick={open}>Create Recipe</Button>
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

  const user = await auth.verifySessionCookie(session, true).catch(() => null)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
}

export default Home
