import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined
}

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/postgres'

const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    prepare: false,
    max: 10,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = conn
}

export const db = drizzle(conn, { schema })
