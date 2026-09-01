'use client'

import { Modal } from '@mantine/core'

import { UserEditForm } from '~/components/mol/Form/userEditform'

export const UserEditModal = ({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <div>
          <h2 className="modal-title">プロフィールを編集</h2>
          <p className="modal-lead">
            アプリに表示される名前とメールアドレスを変更します。
          </p>
        </div>
      }
    >
      <UserEditForm />
    </Modal>
  )
}
