import {
  AppShell,
  Avatar,
  Footer,
  Group,
  Header,
  Title,
  createStyles,
} from '@mantine/core'
import { ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuthContext } from '~/libs/firebase/auth'

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext()
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
            <Link href="/" passHref legacyBehavior>
              <Title order={3}>Coffee Recipe App</Title>
            </Link>
          </Group>
          <Group>
            <Avatar
              src={user ? user.photoURL : ''}
              radius="xl"
              size={45}
              onClick={() => router.push('/mypage')}
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
