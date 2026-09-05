'use server'

import { extractBeanProfileFromImage } from '~/lib/bean-scan'
import { getSession } from '~/lib/session'
import { isUiPreviewEnabled } from '~/lib/ui-preview'

export const extractBeanProfile = async (input: {
  imageBase64: string
  mimeType: string
}) => {
  const session = await getSession()

  if (!session && !isUiPreviewEnabled()) {
    return { error: 'ログインが必要です' }
  }

  try {
    const profile = await extractBeanProfileFromImage(
      input.imageBase64,
      input.mimeType,
    )
    return { profile }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : '画像の解析に失敗しました',
    }
  }
}
