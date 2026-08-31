'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { Button, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { updateProfile } from '~/actions/user'
import { useAuthContext } from '~/lib/auth-context'

export const UserEditForm = () => {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const userShema = z.object({
    name: z.string(),
    email: z
      .string()
      .email({ message: 'メールアドレスの形式が正しくありません' }),
  })

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    validate: zodResolver(userShema),
    validateInputOnChange: true,
  })

  const onsubmit = async () => {
    setLoading(true)

    const result = await updateProfile({
      name: form.values.name,
      email: form.values.email,
    })

    if (result.error) {
      form.setFieldError('email', result.error)
      setLoading(false)
      return
    }

    toast.success('プロフィールを更新しました', {
      position: 'top-center',
      autoClose: 2000,
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <form
        style={{
          paddingTop: '2rem',
        }}
      >
        <TextInput label="name" {...form.getInputProps('name')} />
        <TextInput label="email" {...form.getInputProps('email')} />
      </form>
      <Group
        style={{
          padding: '2rem 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={onsubmit}
          loading={loading}
          disabled={!form.isValid()}
          size="md"
        >
          更新
        </Button>
      </Group>
    </>
  )
}
