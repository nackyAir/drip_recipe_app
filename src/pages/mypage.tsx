import { Box, Button, Group, TextInput, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { updateEmail, updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'
import React from 'react'
import { z } from 'zod'

import Router from 'next/router'

import { Layout } from '~/Layout/layout'
import { getFirebaseStore } from '~/libs/firebase'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'

const MyPage = () => {
  const db = getFirebaseStore()
  const { user, Logout } = useAuthContext()
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
    if (user) {
      await updateProfile(user, {
        displayName: form.values.name,
      })

      await updateEmail(user, form.values.email).catch(() => {
        form.setFieldError('email', 'このメールアドレスは既に使用されています')
      })

      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        name: form.values.name,
        email: form.values.email,
      })
    }
  }

  return (
    <Layout>
      <Title order={2}>MyPage</Title>

      <Box
        style={{
          margin: '0 auto',
          maxWidth: 500,
          gap: 20,
          padding: 20,
        }}
      >
        <form>
          <TextInput label="name" {...form.getInputProps('name')} />
          <TextInput label="email" {...form.getInputProps('email')} />
        </form>
        <Group>
          <Button onClick={onsubmit} disabled={!form.isValid()}>
            更新
          </Button>
          <Button
            my={40}
            color="red"
            onClick={() => {
              Logout()
              Router.push('/login')
            }}
          >
            ログアウト
          </Button>
        </Group>
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = firebaseAdmin.auth()
  const cookies = nookies.get(ctx)
  const session = cookies.session || ''

  const userSettion = await auth
    .verifySessionCookie(session, true)
    .catch(() => null)

  if (!userSettion) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { userSettion },
  }
}

export default MyPage
