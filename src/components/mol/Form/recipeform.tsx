import { ActionIcon, Button, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { AiFillDelete } from 'react-icons/ai'
import { updateRecipe } from '~/libs/api/recipe'

import { useAuthContext } from '~/libs/firebase/auth'
import { RecipeSchema, RecipeType } from '~/types'

export const RecipeForm = ({ data ,recipe_id  }: { data?: RecipeType,recipe_id?: string }) => {
  const { user } = useAuthContext()

  const onSubmit = async() => {
    if  (data) {
     
    }
  }

  const form = useForm<RecipeType>({
    validate: zodResolver(RecipeSchema),

    initialValues: {
      id: data?.id  || '' ,
      userId: user?.uid,
      name: data?.name || '',
      beansName: data?.beansName || '',
      elevation: data?.elevation || '',
      roast: data?.roast || '',
      process: data?.process || '',
      taste: data?.taste || '',
      mesh: data?.mesh || '',
      temp: data?.temp || '',
      brewTime: data?.brewTime || [
        {
          key: randomId(),
          gram: "",
          time :''
        }
      ]

      
    }


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
    </form>
  )
}
