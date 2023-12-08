import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie, parseCookies } from 'nookies'

import { firebaseAdmin } from '~/libs/firebase/admin'

const settionLogout = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(404).json({ message: 'Not Found' })

  const auth = firebaseAdmin.auth()

  const sessionId = parseCookies({ req }).session || ''

  const decodedClaims = await auth
    .verifySessionCookie(sessionId)
    .catch(() => null)

  if (decodedClaims) {
    await auth.revokeRefreshTokens(decodedClaims.sub)
  }

  destroyCookie({ res }, 'session', { path: '/' })
  res.send(JSON.stringify({ status: 'success' }))
}

export default settionLogout
