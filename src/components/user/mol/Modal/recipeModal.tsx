import { Modal } from '@mantine/core'

import { RecipeForm } from '~/components/user/mol/Form/recipeform'
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
      size="xl"
      centered
      transitionProps={{
        transition: 'fade',
        duration: 200,
      }}
    >
      <Modal.Title
        style={{
          fontSize: 30,
          fontWeight: 600,
          textAlign: 'center',
          paddingBottom: 20,
        }}
      >
        {data ? 'Edit Recipe' : 'Create Recipe'}
      </Modal.Title>
      <Modal.Body>
        <RecipeForm data={data} close={onClose} />
      </Modal.Body>
    </Modal>
  )
}
