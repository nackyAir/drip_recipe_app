'use client'

import { KeyboardEvent } from 'react'

import { RecipeModal } from '../Modal/recipeModal'

import { useDisclosure } from '@mantine/hooks'

import { RecipeType } from '~/types'

const SPECS: {
  key: 'roast' | 'process' | 'mesh' | 'temp' | 'elevation'
  label: string
}[] = [
  { key: 'roast', label: '焙煎' },
  { key: 'process', label: '精製' },
  { key: 'mesh', label: '粒度' },
  { key: 'temp', label: '湯温' },
  { key: 'elevation', label: '標高' },
]

export const RecipeCard = ({ value }: { value: RecipeType }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const lastPour = value.brewTime[value.brewTime.length - 1]

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  return (
    <>
      <article
        className="recipe-card"
        onClick={open}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${value.name}を編集`}
      >
        <div className="recipe-card-top">
          <div>
            <h2 className="recipe-name">{value.name}</h2>
            <p className="recipe-beans">{value.beansName}</p>
          </div>
          <span className="recipe-edit-hint">編集</span>
        </div>

        {value.taste && <p className="taste-note">味わい：{value.taste}</p>}

        <div className="spec-grid">
          {SPECS.map((spec) => (
            <div className="spec-item" key={spec.key}>
              <span className="spec-label">{spec.label}</span>
              <span className="spec-value">{value[spec.key] || '—'}</span>
            </div>
          ))}
        </div>

        {value.brewTime.length > 0 && (
          <div>
            <div className="pour-head">
              <span>注湯スケジュール</span>
              <span>
                {value.brewTime.length}投
                {lastPour?.gram ? ` · 累計 ${lastPour.gram}` : ''}
              </span>
            </div>
            <div className="pour-list">
              {value.brewTime.map((item, index) => (
                <div className="pour-step" key={item.key}>
                  <span className="pour-index">{index + 1}</span>
                  <span className="pour-time">{item.time || '—'}</span>
                  <span className="pour-gram">{item.gram || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
      <RecipeModal onClose={close} opened={opened} data={value} />
    </>
  )
}
