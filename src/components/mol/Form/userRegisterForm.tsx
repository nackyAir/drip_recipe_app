import { Anchor, Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useToggle } from '@mantine/hooks'
import { z } from 'zod'

import { useAuthContext } from '~/libs/firebase/auth'

export const UserRegisterForm = () => {
  const [type, toggle] = useToggle(['login', 'register'])

  const { EmailWithSignIn, EmailWithSignUp } = useAuthContext()

  const registarShema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6),
  })
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validate: zodResolver(registarShema),
  })

  const onSubmit = async () => {
    if (type === 'login') {
      await EmailWithSignIn(form.values.email, form.values.password)
    } else {
      await EmailWithSignUp(form.values.email, form.values.password)
    }
  }

  return (
    <>
      <form>
        <TextInput
          required
          {...form.getInputProps('email')}
          label="Email"
          py="xs"
        />
        <PasswordInput
          py="xs"
          required
          label="Password"
          {...form.getInputProps('password')}
        />
        {type === 'register' && (
          <PasswordInput
            required
            py="xs"
            label="Password Confirmation"
            {...form.getInputProps('passwordConfirmation')}
          />
        )}

        <Group
          style={{
            justifyContent: 'space-between',
            paddingTop: 20,
          }}
        >
          <Anchor onClick={() => toggle()}>
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>

          <Button onClick={onSubmit} radius="xl" size="md">
            {type === 'login' ? 'Login' : 'Register'}
          </Button>
        </Group>
      </form>
    </>
  )
}
