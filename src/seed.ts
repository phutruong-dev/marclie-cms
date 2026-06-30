import 'dotenv/config'

import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'

import { seed } from '@/endpoints/seed'

// CLI seed runner: `pnpm seed` (payload run src/seed.ts).
// Rebuilds demo content (home page, nav, posts, contact form/page, media).
const main = async (): Promise<void> => {
  const payload = await getPayload({ config })
  payload.logger.info('Starting seed...')

  const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
  const req = await createLocalReq({ user: users.docs[0] ?? undefined }, payload)

  await seed({ payload, req })
  payload.logger.info('Seed complete.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('SEED FAILED:', err)
    process.exit(1)
  })
