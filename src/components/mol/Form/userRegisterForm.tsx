'use client'

import { z } from 'zod'

import { Anchor, Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useToggle } from '@mantine/hooks'

import { useAuthContext } from '~/lib/auth-context'

export const UserRegisterForm = () => {
  const { EmailWithSignIn, EmailWithSignUp, loading } = useAuthContext()
  const [type, toggle] = useToggle(['login', 'register'])

  const userRegisterShema = z
    .object({
      email: z
        .string()
        .email({ message: 'メールアドレスの形式が正しくありません' }),
      password: z.string().min(8, {
        message: 'パスワードは8文字以上で入力してください',
      }),
      confirm: z.string(),
    })
    .refine(
      (data) => {
        if (type === 'register') {
          return data.password === data.confirm
        }
        return true
      },
      {
        message: 'パスワードが一致しません',
        path: ['confirm'],
      },
    )

  type Registration = z.infer<typeof userRegisterShema>

  const form = useForm<Registration>({
    validate: zodResolver(userRegisterShema),
    initialValues: {
      email: '',
      password: '',
      confirm: '',
    },
    validateInputOnChange: true,
  })

  const onSubmit = async () => {
    if (type === 'login') {
      await EmailWithSignIn(form.values.email, form.values.password)
    } else {
      await EmailWithSignUp(form.values.email, form.values.password)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <TextInput
        {...form.getInputProps('email')}
        label="メールアドレス"
        placeholder="you@example.com"
        autoComplete="email"
        py="xs"
      />
      <PasswordInput
        py="xs"
        label="パスワード"
        placeholder="8文字以上"
        autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        {...form.getInputProps('password')}
      />
      {type === 'register' && (
        <PasswordInput
          py="xs"
          label="パスワード（確認）"
          placeholder="もう一度入力"
          autoComplete="new-password"
          {...form.getInputProps('confirm')}
        />
      )}

      <Button
        type="submit"
        disabled={!form.isValid()}
        loading={loading}
        radius="md"
        size="md"
        fullWidth
        mt="md"
      >
        {type === 'login' ? 'ログイン' : 'アカウントを作成'}
      </Button>

      <Anchor
        component="button"
        type="button"
        onClick={() => toggle()}
        mt="md"
        size="sm"
        color="coffee"
      >
        {type === 'register'
          ? 'すでにアカウントがある方はログイン'
          : '初めての方はアカウント作成'}
      </Anchor>
    </form>
  )
}
