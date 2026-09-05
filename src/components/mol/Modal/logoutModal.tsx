'use client'

import { Button, Group, Modal } from '@mantine/core'

import { useAuthContext } from '~/lib/auth-context'

export const LogoutModal = ({
  opened,
  close,
}: {
  opened: boolean
  close: () => void
}) => {
  const { Logout, loading } = useAuthContext()
  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={
        <div>
          <h2 className="modal-title">ログアウトしますか？</h2>
          <p className="modal-lead">
            レシピ一覧を見るには、もう一度ログインが必要です。
          </p>
        </div>
      }
      transitionProps={{
        transition: 'fade',
        duration: 200,
      }}
    >
      <Group position="center" mt="md" spacing="sm">
        <Button variant="default" size="md" onClick={close}>
          キャンセル
        </Button>
        <Button
          color="red"
          size="md"
          loading={loading}
          onClick={async () => {
            await Logout()
          }}
        >
          ログアウト
        </Button>
      </Group>
    </Modal>
  )
}
