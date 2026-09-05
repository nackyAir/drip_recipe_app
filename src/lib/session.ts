import { cache } from 'react'
import { headers } from 'next/headers'

import { auth } from '~/lib/auth'

export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: headers(),
    })
  } catch {
    return null
  }
})
