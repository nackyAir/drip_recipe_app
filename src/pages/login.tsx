import { Card, Container, Group, Title } from '@mantine/core'

import { useRouter } from 'next/router'

import { GoogleButton } from '~/components/atm/Button/googleButon'
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
          Signin with Google
        </Title>
        <Group grow pt={50}>
          <GoogleButton radius="xl" size="md" onClick={onSubmit}>
            Sign in with Google
          </GoogleButton>
        </Group>
        {/* <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />
        <UserRegisterForm /> */}
      </Card>
    </Container>
  )
}

export default LoginPage
