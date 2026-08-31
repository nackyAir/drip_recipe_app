import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

const getConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  if (isBuildPhase) {
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
