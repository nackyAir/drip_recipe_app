'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { Button, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { updateProfile } from '~/actions/user'
import { useAuthContext } from '~/lib/auth-context'

export const UserEditForm = () => {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const userShema = z.object({
    name: z.string().min(1, { message: '表示名を入力してください' }),
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
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onsubmit()
      }}
    >
      <Stack spacing="sm">
        <TextInput
          label="表示名"
          placeholder="バリスタ名"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="メールアドレス"
          placeholder="you@example.com"
          {...form.getInputProps('email')}
        />
        <Button
          type="submit"
          loading={loading}
          disabled={!form.isValid()}
          size="md"
          mt="sm"
        >
          変更を保存
        </Button>
      </Stack>
    </form>
  )
}
