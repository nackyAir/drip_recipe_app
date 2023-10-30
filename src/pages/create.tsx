import {
  Box,
  Button,
  Container,
  Group,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { collection, doc, setDoc } from 'firebase/firestore'
import { z } from 'zod'

import { getFirebaseAuth, getFirebaseStore } from '~/libs/firebase'

const CreateRecipe = () => {
  const auth = getFirebaseAuth()

  const schema = z.object({
    id: z.string(),
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

  const form = useForm<RecipeType>({
    validate: zodResolver(schema),

    initialValues: {
      id: randomId(),
      userId: auth.currentUser?.uid,
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
      <Group
        key={item.key}
        style={{
          paddingBottom: 30,
        }}
      >
        <TextInput
          placeholder="1m 30s"
          style={{ flex: 1 }}
          {...form.getInputProps(`brewTime.${index}.time`)}
        />
        <TextInput
          placeholder="30g"
          style={{ flex: 1 }}
          {...form.getInputProps(`brewTime.${index}.gram`)}
        />
      </Group>
    )
  })

  const onSubmit = async () => {
    const db = getFirebaseStore()
    const recipeRef = doc(collection(db, 'recipes', randomId()))

    await setDoc(recipeRef, form.values)
  }

  return (
    <Container>
      <Title
        style={{
          paddingTop: 20,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        Create Recipe
      </Title>

      <form {...form.onSubmit(onSubmit)}>
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

        <Box>
          {filds.length > 0 ? (
            <Group mb="xs">
              <Text fw={500} size="sm" style={{ flex: 1 }}>
                Time
              </Text>
              <Text fw={500} size="sm" pr={90}>
                Gram
              </Text>
            </Group>
          ) : (
            <Text>add Time</Text>
          )}
        </Box>

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

        <Button type="submit">レシピの追加</Button>
      </form>
    </Container>
  )
}

export default CreateRecipe
