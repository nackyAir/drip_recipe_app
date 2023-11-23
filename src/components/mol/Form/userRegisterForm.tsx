import { Anchor, Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useToggle } from '@mantine/hooks'
import { z } from 'zod'

import { useAuthContext } from '~/libs/firebase/auth'

export const UserRegisterForm = () => {
  const { EmailWithSignIn, EmailWithSignUp } = useAuthContext()
  const [type, toggle] = useToggle(['login', 'register'])

  const userRegisterShema = z
    .object({
      email: z.string().email({ message: 'Please enter a valid email' }),
      password: z.string().min(8, {
        message: 'Password must be at least 8 characters long',
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
        message: 'Passwords do not match',
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
