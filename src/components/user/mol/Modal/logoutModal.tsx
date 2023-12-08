import Router from 'next/router'

import { Button, Group, Modal, Title } from '@mantine/core'

import { useAuthContext } from '~/libs/user/auth'

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
      transitionProps={{
        transition: 'fade',
        duration: 200,
      }}
    >
      <Modal.Body style={{}}>
        <Title order={2} align="center">
          ログアウトしますか？
        </Title>
        <Group
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: '2rem',
            padding: '2rem 0',
          }}
        >
          <Button
            color="blue"
            size="lg"
            onClick={() => {
              close()
            }}
          >
            No
          </Button>
          <Button
            color="red"
            size="lg"
            loading={loading}
            onClick={async () => {
              await Logout()
              Router.push('/user/login')
            }}
          >
            Yes
          </Button>
        </Group>
      </Modal.Body>
    </Modal>
  )
}
