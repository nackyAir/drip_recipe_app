import { BeanProfile, RecipeType } from '~/types'

export type SuggestedRecipe = {
  recipe: RecipeType
  reasons: string[]
}

type RoastLevel = 'light' | 'medium' | 'dark'
type ProcessKind = 'washed' | 'natural' | 'honey' | 'anaerobic' | 'other'

const BASE_TEMP = 92
const TOTAL_WATER_G = 250

const includesAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword))

export const parseElevationMeters = (elevation: string): number | null => {
  const normalized = elevation.replace(/,/g, '').replace(/，/g, '')
  const range = normalized.match(/(\d+(?:\.\d+)?)\s*[-~〜～to]+\s*(\d+(?:\.\d+)?)/i)

  if (range) {
    const low = Number(range[1])
    const high = Number(range[2])
    if (Number.isFinite(low) && Number.isFinite(high)) {
      return Math.round((low + high) / 2)
    }
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)/)
  if (!match) return null

  const value = Number(match[1])
  return Number.isFinite(value) ? value : null
}

export const classifyProcess = (process: string): ProcessKind => {
  const value = process.toLowerCase()
  if (includesAny(value, ['anaerobic', 'アナエロ', '嫌気'])) return 'anaerobic'
  if (includesAny(value, ['natural', 'ナチュラル', '乾燥', 'dry'])) return 'natural'
  if (includesAny(value, ['honey', 'ハニー', 'pulped'])) return 'honey'
  if (includesAny(value, ['washed', 'ウォッシュ', 'ウォシュ', '水洗'])) {
    return 'washed'
  }
  return 'other'
}

export const classifyRoast = (roast: string): RoastLevel => {
  const value = roast.toLowerCase()
  if (includesAny(value, ['dark', '深煎', 'french', 'full city', 'フルシティ'])) {
    return 'dark'
  }
  if (includesAny(value, ['light', '浅煎', 'cinnamon', 'ライト'])) {
    return 'light'
  }
  return 'medium'
}

const classifyTaste = (taste: string) => {
  const value = taste.toLowerCase()
  const bright = includesAny(value, [
    'floral',
    'citrus',
    'bright',
    'フローラル',
    '柑橘',
    'ジャスミン',
    '明るい',
    '酸',
  ])
  const chocolate = includesAny(value, [
    'chocolate',
    'nutty',
    'チョコ',
    'ナッツ',
    'ココア',
    'カカオ',
  ])
  const fruit = includesAny(value, [
    'berry',
    'fruit',
    'ベリー',
    '果実',
    'ストロベリー',
    'ワイン',
  ])

  return { bright, chocolate, fruit }
}

const meshLabel = (score: number) => {
  if (score <= -2) return '細挽き'
  if (score === -1) return '中細挽き'
  if (score === 0) return '中挽き'
  if (score === 1) return '中粗挽き'
  return '粗挽き'
}

const formatClock = (totalSeconds: number) => {
  const safe = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const buildName = (profile: BeanProfile, process: ProcessKind) => {
  const processLabel =
    process === 'other' ? profile.process.trim() : process
  const origin = profile.origin.trim()
  if (origin && processLabel) {
    return `${origin} ${processLabel} ドリップ`
  }
  if (profile.beansName.trim()) {
    return `${profile.beansName.trim()} ドリップ`
  }
  return 'スキャンレシピ'
}

export const suggestRecipe = (profile: BeanProfile): SuggestedRecipe => {
  const reasons: string[] = []
  const process = classifyProcess(profile.process)
  const roast = profile.roast.trim()
    ? classifyRoast(profile.roast)
    : 'medium'
  const elevationM = parseElevationMeters(profile.elevation)
  const taste = classifyTaste(profile.taste)

  let grind = 0
  let temp = BASE_TEMP
  let bloomG = 45
  let finishAt = 150

  if (process === 'washed') {
    grind -= 1
    temp += 1
    bloomG = 50
    finishAt += 10
    reasons.push('ウォッシュトはクリーンに出すため、やや細挽き・高温・多めの蒸らしにしています')
  } else if (process === 'natural' || process === 'anaerobic') {
    grind += 1
    temp -= 2
    bloomG = 40
    finishAt -= 15
    reasons.push(
      'ナチュラル／嫌気は甘みを残すため、やや粗挽き・低温・短めの抽出にしています',
    )
  } else if (process === 'honey') {
    reasons.push('ハニーはウォッシュトとナチュラルの中間設定です')
  }

  if (elevationM !== null && elevationM >= 1800) {
    grind -= 1
    temp += 1
    finishAt += 10
    reasons.push('高標高の密度の高い豆なので、挽きを細かくし湯温を上げています')
  } else if (elevationM !== null && elevationM < 1200) {
    grind += 1
    temp -= 1
    finishAt -= 10
    reasons.push('低標高の豆なので、過抽出を避けるためやや粗く低温にしています')
  } else if (elevationM === null && profile.elevation.trim()) {
    reasons.push('標高が読み取れなかったため、中標高の基準で組んでいます')
  }

  if (roast === 'light') {
    grind -= 1
    temp += 3
    finishAt += 20
    reasons.push('浅煎りは溶け出しが遅いので、細挽き・高温・長めにしています')
  } else if (roast === 'dark') {
    grind += 1
    temp -= 4
    finishAt -= 20
    reasons.push('深煎りは抽出が速いので、粗挽き・低温・短めにしています')
  } else if (!profile.roast.trim()) {
    reasons.push('焙煎が不明なため、中浅煎り相当で組んでいます')
  }

  if (taste.bright) {
    temp += 1
    reasons.push('明るい酸のテイストを残すため、湯温を少し上げています')
  }
  if (taste.fruit && !taste.bright) {
    temp -= 2
    reasons.push('果実味を出すため、ナチュラル寄りの低温にしています')
  }
  if (taste.chocolate && !taste.bright && !taste.fruit) {
    reasons.push('チョコ／ナッツ系はボディが出やすい中温のままにしています')
  }

  const mesh = meshLabel(grind)
  const temperature = `${clamp(temp, 86, 96)}℃`
  const bloomTime = bloomG >= 50 ? 45 : 40
  const mid2 = Math.round(bloomTime + (finishAt - bloomTime) * 0.28)
  const mid3 = Math.round(bloomTime + (finishAt - bloomTime) * 0.58)
  const pour2G = Math.round(bloomG + (TOTAL_WATER_G - bloomG) * 0.38)
  const pour3G = Math.round(bloomG + (TOTAL_WATER_G - bloomG) * 0.7)

  const recipe: RecipeType = {
    id: '',
    name: buildName(profile, process),
    beansName: profile.beansName.trim() || profile.origin.trim() || 'スキャンした豆',
    origin: profile.origin.trim(),
    variety: profile.variety.trim(),
    elevation: profile.elevation.trim() || '不明',
    roast: profile.roast.trim() || '中浅煎り',
    process: profile.process.trim() || '不明',
    taste: profile.taste.trim() || 'バランス',
    mesh,
    temp: temperature,
    brewTime: [
      { key: 'pour-1', time: formatClock(bloomTime), gram: `${bloomG}g` },
      { key: 'pour-2', time: formatClock(mid2), gram: `${pour2G}g` },
      { key: 'pour-3', time: formatClock(mid3), gram: `${pour3G}g` },
      { key: 'pour-4', time: formatClock(finishAt), gram: `${TOTAL_WATER_G}g` },
    ],
  }

  return { recipe, reasons }
}
