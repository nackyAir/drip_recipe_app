'use client'

import { FiPlus } from 'react-icons/fi'

import { Button } from '@mantine/core'
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
        <Button leftIcon={<FiPlus />} size="md" onClick={open}>
          新しいレシピ
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p className="page-kicker">FIRST BREW</p>
          <h2>まだレシピがありません</h2>
          <p>
            最初の一杯を記録しましょう。豆の名前、焙煎、湯温、注湯の時間とグラムを残しておくと、次に同じ味を再現しやすくなります。
          </p>
          <Button leftIcon={<FiPlus />} size="md" mt="sm" onClick={open}>
            最初のレシピを作る
          </Button>
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
