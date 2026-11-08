import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import type { DraftExample } from './db/seedData'
import { createInvoiceRouter } from './invoices/invoice.routes'
import { ServiceError, type InvoiceService } from './invoices/invoice.service'

export interface AppMeta {
  companyName: string
  baseCurrency: string
  asOfDate: string
}

interface CreateAppOptions {
  service: InvoiceService
  meta: AppMeta
  draftExamples?: DraftExample[]
}

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ServiceError) {
    res.status(error.status).json({ error: error.message, fields: error.fields })
    return
  }
  // body-parser throws this for malformed json
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'request body is not valid json' })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'something went wrong on our side' })
}

export const createApp = ({ service, meta, draftExamples = [] }: CreateAppOptions) => {
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })
  app.get('/api/meta', (_req, res) => {
    res.json(meta)
  })
  app.use('/api/invoices', createInvoiceRouter(service, draftExamples))

  app.use((_req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  app.use(errorHandler)

  return app
}
