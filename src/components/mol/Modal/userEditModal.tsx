import { Modal, Title } from '@mantine/core'

import { UserEditForm } from '~/components/mol/Form/userEditform'

export const UserEditModal = ({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) => {
  return (
    <Modal opened={opened} onClose={onClose} centered>
      <Title order={3} align="center">
        User Edit
      </Title>
      <Modal.Body>
        <UserEditForm />
      </Modal.Body>
    </Modal>
  )
}
