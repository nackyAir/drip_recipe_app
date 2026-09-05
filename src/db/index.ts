import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

const isPlaceholderDatabaseUrl = (value?: string) =>
  !value ||
  value.includes('[PROJECT-REF]') ||
  value.includes('[PASSWORD]') ||
  value.includes('[REGION]')

const getConnectionString = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!isPlaceholderDatabaseUrl(databaseUrl)) {
    return databaseUrl as string
  }

  // Build / UI preview should not crash just because secrets are not wired yet.
  if (isBuildPhase || process.env.NEXT_PUBLIC_UI_PREVIEW === 'true') {
    return 'postgresql://postgres:postgres@127.0.0.1:5432/postgres'
  }

  throw new Error('DATABASE_URL is not set')
}

const conn =
  globalForDb.conn ??
  postgres(getConnectionString(), {
    prepare: false,
    max: 10,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = conn
}

export const db = drizzle(conn, { schema })
