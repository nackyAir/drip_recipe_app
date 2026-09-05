'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { ActionIcon, Button, Group, SimpleGrid, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'

import { createRecipe, deleteRecipe, updateRecipe } from '~/actions/recipes'
import { useAuthContext } from '~/lib/auth-context'
import { RecipeSchema, RecipeType } from '~/types'

export const RecipeForm = ({
  data,
  close,
}: {
  close: () => void
  data?: RecipeType
}) => {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const onSubmit = async () => {
    setLoading(true)

    try {
      const result = data
        ? await updateRecipe(form.values)
        : await createRecipe(form.values)

      if (result.error) {
        toast.error(result.error, {
          theme: 'light',
          position: 'top-center',
          autoClose: 2000,
        })
        return
      }

      toast.success(data ? 'レシピを更新しました' : 'レシピを作成しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
      router.refresh()
      close()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'エラーが発生しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    if (!data) return
    setLoading(true)

    try {
      const result = await deleteRecipe(data.id)

      if (result.error) {
        toast.error(result.error, {
          theme: 'light',
          position: 'top-center',
          autoClose: 2000,
        })
        return
      }

      toast.success('レシピを削除しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
      router.refresh()
      close()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'エラーが発生しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  const form = useForm<RecipeType>({
    validate: zodResolver(RecipeSchema),

    initialValues: {
      id: data?.id || '',
      userId: user?.id,
      name: data?.name || '',
      beansName: data?.beansName || '',
      origin: data?.origin || '',
      variety: data?.variety || '',
      elevation: data?.elevation || '',
      roast: data?.roast || '',
      process: data?.process || '',
      taste: data?.taste || '',
      mesh: data?.mesh || '',
      temp: data?.temp || '',
      brewTime: data?.brewTime || [
        {
          key: randomId(),
          gram: '',
          time: '',
        },
      ],
    },
  })

  const pourFields = form.values.brewTime.map((item, index) => {
    return (
      <div className="pour-editor-row" key={item.key}>
        <span className="pour-index" aria-hidden>
          {index + 1}
        </span>
        <TextInput
          placeholder="0:45"
          label={index === 0 ? '時間' : undefined}
          {...form.getInputProps(`brewTime.${index}.time`)}
        />
        <TextInput
          className="pour-gram-field"
          label={index === 0 ? '累計グラム' : undefined}
          placeholder="60g"
          {...form.getInputProps(`brewTime.${index}.gram`)}
        />
        <ActionIcon
          color="red"
          variant="subtle"
          size="lg"
          mb={4}
          disabled={form.values.brewTime.length === 1}
          onClick={() => form.removeListItem('brewTime', index)}
          aria-label={`${index + 1}投目を削除`}
        >
          <AiFillDelete size="1.25rem" />
        </ActionIcon>
      </div>
    )
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <section className="form-section">
        <h3 className="form-section-title">基本情報</h3>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <TextInput
            {...form.getInputProps('name')}
            label="レシピ名"
            placeholder="朝の浅煎り"
          />
          <TextInput
            {...form.getInputProps('beansName')}
            label="豆の名前"
            placeholder="Ethiopia Yirgacheffe"
          />
        </SimpleGrid>
      </section>

      <section className="form-section">
        <h3 className="form-section-title">豆のプロフィール</h3>
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
          mb="sm"
        >
          <TextInput
            label="産地"
            {...form.getInputProps('origin')}
            placeholder="エチオピア イルガチェフェ"
          />
          <TextInput
            label="品種"
            {...form.getInputProps('variety')}
            placeholder="Heirloom"
          />
          <TextInput
            label="標高"
            {...form.getInputProps('elevation')}
            placeholder="1900m"
          />
          <TextInput
            label="焙煎"
            {...form.getInputProps('roast')}
            placeholder="浅煎り"
          />
          <TextInput
            label="精製方法"
            {...form.getInputProps('process')}
            placeholder="Washed"
          />
          <TextInput
            label="味わい"
            {...form.getInputProps('taste')}
            placeholder="柑橘、ジャスミン"
          />
        </SimpleGrid>
      </section>

      <section className="form-section">
        <h3 className="form-section-title">抽出設定</h3>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <TextInput
            label="粒度"
            {...form.getInputProps('mesh')}
            placeholder="中細挽き"
          />
          <TextInput
            label="湯温"
            {...form.getInputProps('temp')}
            placeholder="91℃"
          />
        </SimpleGrid>
      </section>

      <section className="form-section">
        <h3 className="form-section-title">注湯スケジュール</h3>
        <p className="modal-lead" style={{ marginBottom: 12 }}>
          投ごとに時間と、その時点の累計グラムを記録します。
        </p>
        <div className="pour-editor">{pourFields}</div>
        <Button
          type="button"
          variant="light"
          mt="md"
          onClick={() =>
            form.insertListItem('brewTime', {
              key: randomId(),
              gram: '',
              time: '',
            })
          }
        >
          注湯を追加
        </Button>
      </section>

      <Group position="apart" mt="xl" spacing="sm">
        {data ? (
          confirmDelete ? (
            <Group spacing="xs">
              <Button
                type="button"
                color="red"
                loading={loading}
                onClick={onDelete}
              >
                削除する
              </Button>
              <Button
                type="button"
                variant="subtle"
                color="gray"
                onClick={() => setConfirmDelete(false)}
              >
                やめる
              </Button>
            </Group>
          ) : (
            <Button
              type="button"
              variant="subtle"
              color="red"
              onClick={() => setConfirmDelete(true)}
            >
              レシピを削除
            </Button>
          )
        ) : (
          <Button type="button" variant="subtle" color="gray" onClick={close}>
            キャンセル
          </Button>
        )}

        <Button type="submit" loading={loading}>
          {data ? '変更を保存' : 'レシピを作成'}
        </Button>
      </Group>
    </form>
  )
}
