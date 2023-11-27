import { Button, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { updateEmail, updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { z } from 'zod'

import { getFirebaseStore } from '~/libs/firebase'
import { useAuthContext } from '~/libs/firebase/auth'

export const UserEditForm = () => {
  const db = getFirebaseStore()
  const { user } = useAuthContext()

  const [loading, setLoading] = useState(false)

  const userShema = z.object({
    name: z.string(),
    email: z
      .string()
      .email({ message: 'メールアドレスの形式が正しくありません' }),
  })

  const form = useForm({
    initialValues: {
      name: user?.displayName || '',
      email: user?.email || '',
    },
    validate: zodResolver(userShema),
    validateInputOnChange: true,
  })

  const onsubmit = async () => {
    setLoading(true)
    if (user) {
      await updateProfile(user, {
        displayName: form.values.name,
      })

      await updateEmail(user, form.values.email).catch(() => {
        setLoading(false)
        form.setFieldError('email', 'このメールアドレスは既に使用されています')
      })

      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        name: form.values.name,
        email: form.values.email,
      })
    }
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
