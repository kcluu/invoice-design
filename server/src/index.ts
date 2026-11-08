import { createApp } from './app'
import { config } from './config'
import { pool } from './db/pool'
import { loadSeed } from './db/seedData'
import { createPgRepository } from './invoices/invoice.repository'
import { createInvoiceService } from './invoices/invoice.service'

const seed = loadSeed()
const asOfDate = config.asOfDate ?? seed.currentDate

const service = createInvoiceService(createPgRepository(pool), { asOfDate })
const app = createApp({
  service,
  meta: { companyName: seed.company.name, baseCurrency: seed.company.baseCurrency, asOfDate },
})

app.listen(config.port, () => {
  console.log(`invoice api listening on http://localhost:${config.port} (as of ${asOfDate})`)
})
