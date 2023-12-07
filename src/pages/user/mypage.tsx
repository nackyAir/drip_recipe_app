import { GetServerSideProps } from 'next'
import nookies from 'nookies'
import React from 'react'
import { FiEdit3 } from 'react-icons/fi'

import {
  Anchor,
  Avatar,
  Button,
  Card,
  Group,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { Layout } from '~/Layout/layout'
import { LogoutModal } from '~/components/mol/Modal/logoutModal'
import { UserEditModal } from '~/components/mol/Modal/userEditModal'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'

const MyPage = () => {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <Layout>
      <Anchor href="/user">← Home</Anchor>
      <Title align="center" py={20}>
        MyPage
      </Title>
      <UserCard />
      <Group
        style={{
          padding: '2rem 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button onClick={open} size="md" color="red">
          ログアウト
        </Button>
      </Group>
      <LogoutModal close={close} opened={opened} />
    </Layout>
  )
}

const UserCard = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { user } = useAuthContext()

  const styles = createStyles((theme) => ({
    card: {
      border: `2px solid ${theme.colors.gray[3]}`,
      margin: '0 auto',
      maxWidth: 500,
      gap: 20,
      padding: 20,
    },
    avater: {
      borderRadius: '100%',
      width: 100,
      height: 100,
      margin: '0 auto',
    },
    group: {
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fomtSize: 30,
    },
    icon: {
      cursor: 'pointer',
      fontSize: 30,
    },
  }))

  const { classes } = styles()

  return (
    <Card className={classes.card}>
      <Group>
        <Avatar src={user ? user.photoURL : null} className={classes.avater} />
      </Group>
      <Group className={classes.group}>
        <Text className={classes.text}>{user ? user.displayName : null}</Text>
        <Text>{user ? user.email : null}</Text>
        <FiEdit3 onClick={open} className={classes.icon} />
      </Group>
      <UserEditModal onClose={close} opened={opened} />
    </Card>
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
        destination: '/user/login',
        permanent: false,
      },
    }
  }

  return {
    props: { userSettion },
  }
}

export default MyPage
