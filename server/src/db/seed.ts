import { fileURLToPath } from 'node:url'
import { createPgRepository } from '../invoices/invoice.repository'
import { migrate } from './migrate'
import { pool } from './pool'
import { loadSeed } from './seedData'

// pass --reset to wipe the table before seeding
export const seed = async ({ reset = false } = {}) => {
  await migrate()
  if (reset) await pool.query('truncate table invoices')

  const repository = createPgRepository(pool)
  const { invoices } = loadSeed()
  let inserted = 0

  for (const invoice of invoices) {
    if (await repository.findById(invoice.id)) continue
    await repository.insert(invoice)
    inserted += 1
  }

  console.log(`seeded ${inserted} of ${invoices.length} invoices`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed({ reset: process.argv.includes('--reset') })
    .then(() => pool.end())
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
