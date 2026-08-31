'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { ActionIcon, Button, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'

import { createRecipe, deleteRecipe, updateRecipe } from '~/actions/recipes'
import { useAuthContext } from '~/lib/auth-context'
import { RecipeSchema, RecipeType } from '~/types'

export const RecipeForm = ({
  data,
  close,
}: {
  close: () => void
  data?: RecipeType
}) => {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async () => {
    setLoading(true)

    try {
      const result = data
        ? await updateRecipe(form.values)
        : await createRecipe(form.values)

      if (result.error) {
        toast.error(result.error, {
          theme: 'light',
          position: 'top-center',
          autoClose: 2000,
        })
        return
      }

      toast.success(data ? 'Recipe Updated' : 'Recipe Created', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
      router.refresh()
      close()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    if (!data) return
    setLoading(true)

    try {
      const result = await deleteRecipe(data.id)

      if (result.error) {
        toast.error(result.error, {
          theme: 'light',
          position: 'top-center',
          autoClose: 2000,
        })
        return
      }

      toast.success('Recipe Deleted', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
      router.refresh()
      close()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const form = useForm<RecipeType>({
    validate: zodResolver(RecipeSchema),

    initialValues: {
      id: data?.id || '',
      userId: user?.id,
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
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        {...form.getInputProps('name')}
        label="Recipe Name"
        placeholder="name"
      />
      <TextInput
        {...form.getInputProps('beansName')}
        label="Beans Name"
        placeholder="Ethiopia"
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
          type="button"
          onClick={() =>
            form.insertListItem('brewTime', {
              key: randomId(),
              gram: '',
              time: '',
            })
          }
        >
          add Time / Gram
        </Button>
      </Group>

      <Button type="submit" mx={20} loading={loading}>
        {data ? 'Update' : 'Create'}
      </Button>

      {data && (
        <Button
          type="button"
          loading={loading}
          color="red"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
    </form>
  )
}
