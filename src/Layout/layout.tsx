import {
  AppShell,
  Avatar,
  Footer,
  Group,
  Header,
  Title,
  createStyles,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { LogoutModal } from '~/components/mol/Modal/logoutModal'
import { useAuthContext } from '~/libs/firebase/auth'

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext()
  const router = useRouter()
  const [opened, { open, close }] = useDisclosure(false)

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
            <LogoutModal opened={opened} close={close} />
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
