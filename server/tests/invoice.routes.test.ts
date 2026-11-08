import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { createApp } from '../src/app'
import { loadSeed } from '../src/db/seedData'
import { createMemoryRepository } from '../src/invoices/invoice.memoryRepository'
import { createInvoiceService } from '../src/invoices/invoice.service'

const newInvoice = {
  customerName: 'Brightline Health',
  billingEmail: 'finance@brightline.example',
  billingAddress: '18 Boylston Street, Boston, MA 02116',
  paymentTerms: 'Net 15',
  currency: 'USD',
  issueDate: '2026-05-04',
  dueDate: '2026-05-19',
  memo: 'Implementation services milestone 3.',
  taxRate: 0,
  discount: 0,
  lineItems: [{ description: 'Implementation services', quantity: 10, unitPrice: 275, accountCode: '4100' }],
}

describe('invoice routes', () => {
  let app: Express

  beforeEach(() => {
    const seed = loadSeed()
    // fresh in-memory copy of the seed for every test
    const repository = createMemoryRepository(seed.invoices)
    const service = createInvoiceService(repository, { asOfDate: seed.currentDate })
    app = createApp({ service, meta: { companyName: seed.company.name, baseCurrency: seed.company.baseCurrency, asOfDate: seed.currentDate } })
  })

  it('lists the seeded invoices with derived payment status', async () => {
    const res = await request(app).get('/api/invoices').expect(200)
    expect(res.body).toHaveLength(5)
    const juniper = res.body.find((invoice: { invoiceNumber: string }) => invoice.invoiceNumber === 'INV-2026-0408')
    expect(juniper.paymentStatus).toBe('Overdue')
  })

  it('returns 404 for an unknown invoice', async () => {
    await request(app).get('/api/invoices/does-not-exist').expect(404)
  })

  it('creates a draft with the next invoice number', async () => {
    const res = await request(app).post('/api/invoices').send(newInvoice).expect(201)
    expect(res.body.invoiceNumber).toBe('INV-2026-0415')
    expect(res.body.status).toBe('Draft')
    expect(res.body.paymentStatus).toBe('Unsent')
    expect(res.body.activity).toHaveLength(1)
  })

  it('creates and sends in one step', async () => {
    const res = await request(app).post('/api/invoices').send({ ...newInvoice, send: true }).expect(201)
    expect(res.body.status).toBe('Sent')
    expect(res.body.paymentStatus).toBe('Open')
  })

  it('rejects an invalid invoice with field errors', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .send({ ...newInvoice, customerName: '', billingEmail: 'nope', lineItems: [{ description: '', quantity: -1, unitPrice: 5, accountCode: '4100' }] })
      .expect(422)
    expect(Object.keys(res.body.fields)).toEqual(expect.arrayContaining(['customerName', 'billingEmail', 'lineItems.0.description', 'lineItems.0.quantity']))
  })

  it('edits a draft invoice', async () => {
    const res = await request(app).patch('/api/invoices/inv-2026-0413').send({ discount: 500, memo: 'Milestone 2, revised.' }).expect(200)
    expect(res.body.discount).toBe(500)
    expect(res.body.memo).toBe('Milestone 2, revised.')
  })

  it('only lets a sent invoice change dates, terms and memo', async () => {
    await request(app).patch('/api/invoices/inv-2026-0412').send({ customerName: 'Other Co' }).expect(422)
    const res = await request(app).patch('/api/invoices/inv-2026-0412').send({ memo: 'Covers April.' }).expect(200)
    expect(res.body.memo).toBe('Covers April.')
  })

  it('refuses to edit a paid invoice', async () => {
    await request(app).patch('/api/invoices/inv-2026-0399').send({ memo: 'x' }).expect(409)
  })

  it('sends, records payment on and voids invoices', async () => {
    const sent = await request(app).post('/api/invoices/inv-2026-0413/send').expect(200)
    expect(sent.body.status).toBe('Sent')

    const paid = await request(app).post('/api/invoices/inv-2026-0413/payments').expect(200)
    expect(paid.body.status).toBe('Paid')
    expect(paid.body.paidDate).toBe('2026-05-04')

    const voided = await request(app).post('/api/invoices/inv-2026-0412/void').expect(200)
    expect(voided.body.status).toBe('Void')
  })

  it('deletes a draft but not a paid invoice', async () => {
    await request(app).delete('/api/invoices/inv-2026-0413').expect(204)
    await request(app).get('/api/invoices/inv-2026-0413').expect(404)
    await request(app).delete('/api/invoices/inv-2026-0399').expect(409)
  })
})
