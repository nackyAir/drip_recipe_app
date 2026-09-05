import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parseElevationMeters, suggestRecipe } from './recipe-engine'

describe('parseElevationMeters', () => {
  it('parses a single meter value', () => {
    assert.equal(parseElevationMeters('1900m'), 1900)
  })

  it('averages a range', () => {
    assert.equal(parseElevationMeters('1,800-2,000m'), 1900)
  })

  it('returns null when elevation cannot be parsed', () => {
    assert.equal(parseElevationMeters('高地'), null)
  })
})

describe('suggestRecipe', () => {
  it('makes a finer, hotter, longer brew for washed high-elevation light roast', () => {
    const { recipe, reasons } = suggestRecipe({
      beansName: 'Yirgacheffe',
      origin: 'Ethiopia',
      variety: 'Heirloom',
      process: 'washed',
      elevation: '2000m',
      roast: 'light',
      taste: 'citrus floral',
    })

    assert.equal(recipe.mesh, '細挽き')
    assert.equal(recipe.temp, '96℃')
    assert.equal(recipe.brewTime[0]?.gram, '50g')
    assert.equal(recipe.brewTime[3]?.gram, '250g')
    assert.equal(recipe.brewTime[3]?.time, '3:10')
    assert.equal(recipe.origin, 'Ethiopia')
    assert.equal(recipe.variety, 'Heirloom')
    assert.ok(reasons.some((reason) => reason.includes('ウォッシュト')))
    assert.ok(reasons.some((reason) => reason.includes('高標高')))
    assert.ok(reasons.some((reason) => reason.includes('浅煎り')))
  })

  it('makes a coarser, cooler, shorter brew for natural low-elevation dark roast', () => {
    const { recipe } = suggestRecipe({
      beansName: 'Cerrado',
      origin: 'Brazil',
      variety: 'Catuai',
      process: 'natural',
      elevation: '900m',
      roast: 'dark',
      taste: 'chocolate nutty',
    })

    assert.equal(recipe.mesh, '粗挽き')
    assert.equal(recipe.temp, '86℃')
    assert.equal(recipe.brewTime[0]?.gram, '40g')
    assert.equal(recipe.brewTime[3]?.time, '1:45')
  })

  it('treats unreadable elevation as mid elevation', () => {
    const { recipe, reasons } = suggestRecipe({
      beansName: 'Mystery lot',
      origin: '',
      variety: '',
      process: 'honey',
      elevation: '不明',
      roast: 'medium',
      taste: '',
    })

    assert.equal(recipe.mesh, '中挽き')
    assert.equal(recipe.temp, '92℃')
    assert.equal(recipe.elevation, '不明')
    assert.ok(reasons.some((reason) => reason.includes('標高が読み取れなかった')))
  })
})
