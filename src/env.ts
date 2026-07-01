import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Single source of truth for environment variables. Invalid/missing config fails
 * at build/dev time (imported in next.config.ts). Set SKIP_ENV_VALIDATION=1 to bypass.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required (Postgres/Neon connection string)'),
    PAYLOAD_SECRET: z.string().min(16, 'PAYLOAD_SECRET must be long enough (>=16 chars)'),
    CRON_SECRET: z.string().optional(),
    PREVIEW_SECRET: z.string().optional(),
    // Vercel Blob read/write token (production media storage). Absent locally → local disk.
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
    PREVIEW_SECRET: process.env.PREVIEW_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
