import { ActionIcon, Button, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { v4 } from 'uuid'

import { deleteReciepe } from '~/libs/api/recipe'
import { getFirebaseStore } from '~/libs/firebase'
import { useAuthContext } from '~/libs/firebase/auth'
import { RecipeSchema, RecipeType } from '~/types'

export const RecipeForm = ({
  data,
  close,
}: {
  close: () => void
  data?: RecipeType
}) => {
  const { user } = useAuthContext()
  const db = getFirebaseStore()

  const [loading, setLoading] = React.useState(false)

  const uuid = v4()

  const onSubmit = async () => {
    setLoading(true)
    if (data) {
      await updateDoc(doc(db, 'recipes', data.id), {
        ...form.values,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          toast.success('Recipe Updated', {
            theme: 'light',
            position: 'top-center',
            autoClose: 2000,
          })
        })
        .catch((err) => {
          toast.error(err.message, {
            theme: 'light',
            position: 'top-center',
            autoClose: 2000,
          })
        })
    } else {
      await setDoc(doc(db, 'recipes', uuid), {
        ...form.values,
        id: uuid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          toast.success('Recipe Created', {
            theme: 'light',
            position: 'top-center',
            autoClose: 2000,
          })
        })
        .catch((err) => {
          toast.error(err.message, {
            theme: 'light',
            position: 'top-center',
            autoClose: 2000,
          })
        })
    }
    setLoading(false)
    close()
  }

  const onDelete = async () => {
    if (!data) return
    setLoading(true)
    await deleteReciepe(data.id)
      .then(() => {
        toast.success('Recipe Deleted', {
          theme: 'light',
          position: 'top-center',
          autoClose: 2000,
        })
      })
      .catch((err) => {
        toast.error(err.message, {
          theme: 'light',
          position: 'top-center',
          autoClose: 2000,
        })
      })
    setLoading(false)
  }

  const form = useForm<RecipeType>({
    validate: zodResolver(RecipeSchema),

    initialValues: {
      id: data?.id || '',
      userId: user?.uid,
      name: data?.name || '',
      beansName: data?.beansName || '',
      elevation: data?.elevation || '',
      roast: data?.roast || '',
      process: data?.process || '',
      taste: data?.taste || '',
      mesh: data?.mesh || '',
      temp: data?.temp || '',
      brewTime: data?.brewTime || [
        {
          key: randomId(),
          gram: '',
          time: '',
        },
      ],
    },
  })

  const filds = form.values.brewTime.map((item, index) => {
    return (
      <Group key={item.key}>
        <TextInput
          placeholder="1m 30s"
          label="Time"
          {...form.getInputProps(`brewTime.${index}.time`)}
        />
        <TextInput
          label="Gram"
          placeholder="30g"
          {...form.getInputProps(`brewTime.${index}.gram`)}
        />
        <ActionIcon
          color="red"
          onClick={() => form.removeListItem('brewTime', index)}
        >
          <AiFillDelete size="3rem" />
        </ActionIcon>
      </Group>
    )
  })

  return (
    <form {...form.onSubmit(onSubmit)}>
      <TextInput
        {...form.getInputProps('name')}
        required
        label="Name"
        placeholder="name"
      />
      <TextInput
        {...form.getInputProps('beansName')}
        label="BeansName"
        placeholder="Ehiopia"
      />
      <TextInput
        label="Elevation"
        {...form.getInputProps('elevation')}
        placeholder="1500m"
      />
      <TextInput
        label="Roast"
        {...form.getInputProps('roast')}
        placeholder="light"
      />
      <TextInput
        label="Process"
        {...form.getInputProps('process')}
        placeholder="washed"
      />
      <TextInput
        label="Teste"
        {...form.getInputProps('taste')}
        placeholder="sweet"
      />
      <TextInput
        label="Mesh"
        {...form.getInputProps('mesh')}
        placeholder="medium"
      />
      <TextInput
        label="Temp"
        {...form.getInputProps('temp')}
        placeholder="90"
      />

      <Group
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}
      >
        {filds}
        <Button
          onClick={() =>
            form.insertListItem('brewTime', {
              key: randomId(),
              gram: '',
              time: '',
            })
          }
        >
          add Time
        </Button>
      </Group>

      <Button onClick={onSubmit} mx={20} loading={loading}>
        {data ? 'Update' : 'Create'}
      </Button>

      {data && (
        <Button loading={loading} color="red" onClick={onDelete}>
          Delete
        </Button>
      )}
    </form>
  )
}
