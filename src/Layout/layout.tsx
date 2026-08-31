'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import {
  AppShell,
  Avatar,
  Footer,
  Group,
  Header,
  Title,
  createStyles,
} from '@mantine/core'

import { AuthUser, useAuthContext } from '~/lib/auth-context'

export const Layout = ({
  children,
  user,
}: {
  children: ReactNode
  user?: AuthUser
}) => {
  const { user: sessionUser } = useAuthContext()
  const displayUser = user ?? sessionUser
  const router = useRouter()

  const styles = createStyles((themes) => {
    return {
      footer: {
        backgroundColor: themes.colorScheme === 'dark' ? '#000' : '#fff',
        color: themes.colorScheme === 'dark' ? '#fff' : '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      header: {
        backgroundColor: themes.colorScheme === 'dark' ? '#000' : '#fff',
        color: themes.colorScheme === 'dark' ? '#fff' : '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
      },
    }
  })

  const { classes } = styles()

  return (
    <AppShell
      header={
        <Header height={70} className={classes.header}>
          <Group>
            <Link href="/user">
              <Title order={3}>Coffee Recipe App</Title>
            </Link>
          </Group>
          <Group>
            <Avatar
              src={displayUser ? displayUser.image : ''}
              radius="xl"
              size={45}
              style={{ cursor: 'pointer' }}
              onClick={() => router.push('/user/mypage')}
            />
          </Group>
        </Header>
      }
      footer={
        <Footer height={50} className={classes.footer}>
          {new Date().getFullYear()} © Coffee Recipe App
        </Footer>
      }
    >
      {children}
    </AppShell>
  )
}
