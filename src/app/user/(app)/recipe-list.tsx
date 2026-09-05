'use client'

import Link from 'next/link'
import { FiCamera, FiPlus } from 'react-icons/fi'

import { Button, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { RecipeCard } from '~/components/mol/Card/recipeCard'
import { RecipeModal } from '~/components/mol/Modal/recipeModal'
import { RecipeType } from '~/types'

export const RecipeList = ({ recipes }: { recipes: RecipeType[] }) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <div className="page-hero">
        <div>
          <p className="page-kicker">RECIPES</p>
          <h1 className="page-title">ドリップレシピ</h1>
          <p className="page-lead">
            豆・焙煎・抽出条件・注湯の記録を、カードで見比べて再現できます。
          </p>
        </div>
        <Group spacing="sm">
          <Button
            component={Link}
            href="/user/scan"
            variant="light"
            leftIcon={<FiCamera />}
            size="md"
          >
            豆をスキャン
          </Button>
          <Button leftIcon={<FiPlus />} size="md" onClick={open}>
            新しいレシピ
          </Button>
        </Group>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p className="page-kicker">FIRST BREW</p>
          <h2>まだレシピがありません</h2>
          <p>
            袋を撮影して豆のプロフィールからレシピを提案するか、抽出条件を手入力して最初の一杯を記録できます。
          </p>
          <Group spacing="sm" mt="sm" position="center">
            <Button
              component={Link}
              href="/user/scan"
              variant="light"
              leftIcon={<FiCamera />}
              size="md"
            >
              豆をスキャン
            </Button>
            <Button leftIcon={<FiPlus />} size="md" onClick={open}>
              最初のレシピを作る
            </Button>
          </Group>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((value) => (
            <RecipeCard key={value.id} value={value} />
          ))}
        </div>
      )}

      <RecipeModal onClose={close} opened={opened} />
    </>
  )
}
