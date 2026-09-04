'use client'

import { Modal } from '@mantine/core'

import { RecipeForm } from '~/components/mol/Form/recipeform'
import { RecipeType } from '~/types'

export const RecipeModal = ({
  data,
  onClose,
  opened,
}: {
  data?: RecipeType
  onClose: () => void
  opened: boolean
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      title={
        <div>
          <h2 className="modal-title">
            {data ? 'レシピを編集' : '新しいレシピ'}
          </h2>
          <p className="modal-lead">
            {data
              ? '抽出条件を更新するか、不要になったレシピを削除できます。'
              : '再現したい抽出を、豆の情報から注湯まで順に記録します。'}
          </p>
        </div>
      }
      transitionProps={{
        transition: 'fade',
        duration: 200,
      }}
    >
      <RecipeForm data={data} close={onClose} />
    </Modal>
  )
}
