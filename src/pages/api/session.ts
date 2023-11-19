import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

import { firebaseAdmin } from '~/libs/firebase/admin'

const sessionApi = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(404).json({ message: 'Not Found' })

  const auth = firebaseAdmin.auth()

  const expiresIn = 60 * 60 * 24 * 5 * 1000
  const idToken = (JSON.parse(req.body).id || '') as string

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn,
  })

  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    path: '/',
  }

  setCookie({ res }, 'session', sessionCookie, options)

  res.end(JSON.stringify({ status: 'success' }))
}

export default sessionApi
