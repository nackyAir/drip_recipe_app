import { BeanProfile, BeanProfileSchema } from '~/types'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const extractJsonObject = (text: string) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('豆の情報をJSONとして読み取れませんでした')
  }

  return JSON.parse(candidate.slice(start, end + 1)) as unknown
}

export const parseBeanProfileJson = (raw: unknown): BeanProfile => {
  const parsed = typeof raw === 'string' ? extractJsonObject(raw) : raw
  return BeanProfileSchema.parse(parsed)
}

export const normalizeImagePayload = (imageBase64: string, mimeType: string) => {
  const mime = mimeType.toLowerCase()
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    throw new Error('JPEG / PNG / WebP / GIF の画像を選んでください')
  }

  const data = imageBase64.replace(/^data:[^;]+;base64,/, '')
  if (!data || data.length > 2_000_000) {
    throw new Error('画像が大きすぎます。別の写真で試してください')
  }

  return { data, mime }
}

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
  error?: {
    message?: string
  }
}

export const extractBeanProfileFromImage = async (
  imageBase64: string,
  mimeType: string,
  apiKey = process.env.OPENAI_API_KEY,
) => {
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY が未設定です。豆の情報を手入力してレシピを提案できます',
    )
  }

  const { data, mime } = normalizeImagePayload(imageBase64, mimeType)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You extract specialty coffee bag label fields. Return JSON only with keys beansName, origin, variety, process, elevation, roast, taste. Use empty strings when unknown. Keep original language when possible. taste should be short flavor notes.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'このコーヒー袋のラベルから産地・品種・プロセス・標高・焙煎・テイストを抽出してください。',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mime};base64,${data}`,
              },
            },
          ],
        },
      ],
    }),
  })

  const payload = (await response.json()) as OpenAIChatResponse

  if (!response.ok) {
    throw new Error(payload.error?.message || '画像の解析に失敗しました')
  }

  const content = payload.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('画像から豆の情報を読み取れませんでした')
  }

  return parseBeanProfileJson(content)
}
