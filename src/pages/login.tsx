import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'

import { Card, Container, Divider, Group, Title } from '@mantine/core'

import { GoogleButton } from '~/components/atm/Button/googleButon'
import { UserRegisterForm } from '~/components/mol/Form/userRegisterForm'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'

const LoginPage = () => {
  const router = useRouter()

  const { GoogleWithLogin } = useAuthContext()

  const onSubmit = async () => {
    await GoogleWithLogin()
    router.push('/')
  }

  return (
    <Container
      style={{
        margin: '0 auto',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Card
        withBorder
        style={{
          display: 'flex',
          padding: 50,
          flexDirection: 'column',
          borderRadius: 10,
          boxShadow: '0 0 20px rgba(0, 0, 0, .1)',
          border: '1px solid #eee',
        }}
      >
        <Title order={2} align="center">
          Signin with Google Or Email
        </Title>
        <Group grow pt={50}>
          <GoogleButton radius="xl" size="md" onClick={onSubmit}>
            Sign in with Google
          </GoogleButton>
        </Group>
        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />
        <UserRegisterForm />
      </Card>
    </Container>
  )
}

export default LoginPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = firebaseAdmin.auth()
  const cookies = nookies.get(ctx)

  const session = cookies.session || ''

  const userSettion = await auth
    .verifySessionCookie(session, true)
    .catch(() => null)

  if (userSettion) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { userSettion },
  }
}
