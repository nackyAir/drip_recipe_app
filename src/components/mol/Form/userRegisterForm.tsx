import { Anchor, Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useToggle } from '@mantine/hooks'

import { useAuthContext } from '~/libs/firebase/auth'

export const UserRegisterForm = () => {
  const [type, toggle] = useToggle(['login', 'register'])

  const { EmailWithSignIn, EmailWithSignUp } = useAuthContext()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirm: '',
    },
    validateInputOnChange: true,
    validate: {
      email: (value) => {
        if (!value.includes('@')) {
          return 'Email is invalid'
        }
      },
      password: (value) => {
        if (value.length < 6) {
          return 'Password must be at least 6 characters long'
        }
      },
      confirm: (value) => {
        if (type === 'login') return
        if (value !== form.values.password) {
          return 'Passwords do not match'
        }
      },
    },
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
      <div>
        <TextInput {...form.getInputProps('email')} label="Email" py="xs" />
        <PasswordInput
          py="xs"
          label="Password"
          {...form.getInputProps('password')}
        />
        {type === 'register' && (
          <PasswordInput
            py="xs"
            label="Password Confirmation"
            {...form.getInputProps('confirm')}
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

          <Button
            onClick={onSubmit}
            disabled={!form.isValid()}
            radius="xl"
            size="md"
          >
            {type === 'login' ? 'Login' : 'Register'}
          </Button>
        </Group>
      </div>
    </>
  )
}
