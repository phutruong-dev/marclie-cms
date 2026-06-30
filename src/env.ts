import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Nguồn chân lý cho biến môi trường. Config sai/thiếu sẽ fail ngay lúc build/dev
 * (import trong next.config.ts). Đặt SKIP_ENV_VALIDATION=1 để bỏ qua (vd Docker build).
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1, 'DATABASE_URL bắt buộc (Postgres/Neon connection string)'),
    PAYLOAD_SECRET: z.string().min(16, 'PAYLOAD_SECRET phải đủ dài (≥16 ký tự)'),
    CRON_SECRET: z.string().optional(),
    PREVIEW_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
    PREVIEW_SECRET: process.env.PREVIEW_SECRET,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
