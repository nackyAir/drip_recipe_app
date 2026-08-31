import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'

import { db } from '~/db'
import { account, session, user, verification } from '~/db/schema'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

const getSecret = () => {
  if (process.env.BETTER_AUTH_SECRET) {
    return process.env.BETTER_AUTH_SECRET
  }

  // `next build` (including Vercel) evaluates auth during page-data collection.
  // Use a placeholder so the build can finish; runtime still requires the real secret.
  if (isBuildPhase) {
    return 'build-placeholder-secret-min-32-chars!!'
  }

  return process.env.BETTER_AUTH_SECRET
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  secret: getSecret(),
  baseURL: getBaseURL(),
  trustedOrigins: [
    getBaseURL(),
    'https://*.vercel.app',
    'http://localhost:3000',
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
  plugins: [nextCookies()],
})
