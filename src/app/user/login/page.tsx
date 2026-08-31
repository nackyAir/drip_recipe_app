'use client'

import { Card, Container, Divider, Group, Title } from '@mantine/core'

import { GoogleButton } from '~/components/atm/Button/googleButon'
import { UserRegisterForm } from '~/components/mol/Form/userRegisterForm'
import { useAuthContext } from '~/lib/auth-context'

const LoginPage = () => {
  const { GoogleWithLogin } = useAuthContext()

  const onSubmit = async () => {
    await GoogleWithLogin()
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
