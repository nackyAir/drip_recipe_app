import { Button, Card, Container, Title } from '@mantine/core'

import { useRouter } from 'next/router'

import { useAuthContext } from '~/libs/firebase/auth'

const LoginPage = () => {
  const router = useRouter()

  const { Login } = useAuthContext()

  const onSubmit = async () => {
    await Login()
    router.push('/')
  }

  return (
    <Container
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 0 20px rgba(0, 0, 0, .1)',
          border: '1px solid #eee',
        }}
      >
        <Title order={2} className="py-6">
          ログイン
        </Title>
        <Button onClick={onSubmit}>Googleでログイン</Button>
      </Card>
    </Container>
  )
}

export default LoginPage
