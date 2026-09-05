'use client'

import { FiEdit3 } from 'react-icons/fi'

import { Avatar, Button, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { LogoutModal } from '~/components/mol/Modal/logoutModal'
import { UserEditModal } from '~/components/mol/Modal/userEditModal'
import { useAuthContext } from '~/lib/auth-context'

const MyPage = () => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <div className="page-hero">
        <div>
          <p className="page-kicker">ACCOUNT</p>
          <h1 className="page-title">マイページ</h1>
          <p className="page-lead">
            表示名とメールアドレスを確認・変更できます。ログアウトもこちらから。
          </p>
        </div>
      </div>
      <UserCard />
      <Group position="center" mt="xl">
        <Button variant="outline" color="red" onClick={open} size="md">
          ログアウト
        </Button>
      </Group>
      <LogoutModal close={close} opened={opened} />
    </>
  )
}

const UserCard = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { user } = useAuthContext()

  return (
    <section className="profile-card">
      <div className="profile-identity">
        <Avatar src={user?.image || undefined} radius="xl" size={84} />
        <div>
          <p className="page-kicker" style={{ marginBottom: 4 }}>
            PROFILE
          </p>
          <h2 className="recipe-name">{user?.name || '未設定'}</h2>
        </div>
      </div>
      <div className="profile-fields">
        <div>
          <div className="profile-field-label">表示名</div>
          <div className="profile-field-value">{user?.name || '—'}</div>
        </div>
        <div>
          <div className="profile-field-label">メールアドレス</div>
          <div className="profile-field-value">{user?.email || '—'}</div>
        </div>
      </div>
      <Button leftIcon={<FiEdit3 />} variant="light" mt="lg" onClick={open}>
        プロフィールを編集
      </Button>
      <UserEditModal onClose={close} opened={opened} />
    </section>
  )
}

export default MyPage
