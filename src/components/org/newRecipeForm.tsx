import { ActionIcon, Button, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { doc, setDoc } from 'firebase/firestore'
import { AiFillDelete } from 'react-icons/ai'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { getFirebaseStore } from '~/libs/firebase'
import { useAuthContext } from '~/libs/firebase/auth'

export const CreateRecipeForm = () => {
  const store = getFirebaseStore()

  const { user } = useAuthContext()

  const schema = z.object({
    userId: z.string().optional(),
    name: z.string().min(1, { message: 'Name is required' }),
    beansName: z.string().min(1, { message: 'Beans name is required' }),
    elevation: z.string().min(1, { message: 'Elevation is required' }),
    roast: z.string().min(1, { message: 'Roast is required' }),
    process: z.string().min(1, { message: 'Process is required' }),
    taste: z.string().min(1, { message: 'Taste is required' }),
    mesh: z.string().min(1, { message: 'Mesh is required' }),
    temp: z.string().min(1, { message: 'Temp is required' }),
    brewTime: z.array(
      z.object({
        key: z.string(),
        gram: z.string().min(1, { message: 'Gram is required' }),
        time: z.string().min(1, { message: 'Time is required' }),
      }),
    ),
  })

  type RecipeType = z.infer<typeof schema>

  // onSubmitがされない
  // なぜかはわからない
  const onSubmit = async () => {
    const id = uuid()

    const recipeRef = doc(store, 'recipes', id)
    await setDoc(recipeRef, {
      ...form.values,
      id: id,
    })

    form.reset()
  }

  const form = useForm<RecipeType>({
    validate: zodResolver(schema),

    initialValues: {
      userId: user.
      name: '',
      beansName: '',
      elevation: '',
      roast: '',
      process: '',
      taste: '',
      mesh: '',
      temp: '',

      brewTime: [
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
    <form>
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

      <Button onClick={onSubmit}>Create Recipe</Button>
    </form>
  )
}
