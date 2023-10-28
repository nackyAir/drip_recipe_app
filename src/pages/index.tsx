import { Button, Container, Text } from '@mantine/core'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'

import { useRouter } from 'next/router'

import { RecipeCard } from '~/components/mol/Card/recipeCard'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'

const Home = () => {
  const router = useRouter()
  const { Logout } = useAuthContext()

  const onLogout = async () => {
    await Logout()
    router.push('/login')
  }

  return (
    <Container>
      <Button onClick={onLogout}>Logout</Button>
      <Text>Recipe List</Text>
      <RecipeCard />
    </Container>
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
