import { Button, Card, Title } from '@mantine/core'

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
    <Card>
      <Title order={2}>ログインページ</Title>
      <Button onClick={onSubmit}>Googleでログイン</Button>
    </Card>
  )
}

export default LoginPage
