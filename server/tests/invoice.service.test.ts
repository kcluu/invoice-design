import { describe, expect, it } from 'vitest'
import { loadSeed } from '../src/db/seedData'
import { createMemoryRepository } from '../src/invoices/invoice.memoryRepository'
import { createInvoiceService, ServiceError } from '../src/invoices/invoice.service'

const setup = () => {
  const seed = loadSeed()
  const fixedNow = new Date('2026-05-04T15:00:00Z')
  return createInvoiceService(createMemoryRepository(seed.invoices), { asOfDate: seed.currentDate, now: () => fixedNow })
}

describe('invoice service', () => {
  it('writes a readable activity entry for edits', async () => {
    const service = setup()
    const updated = await service.update('inv-2026-0412', { memo: 'Covers April.', dueDate: '2026-06-01' }, 'Maya Chen')
    expect(updated.activity.at(-1)).toMatchObject({ actor: 'Maya Chen', action: 'Edited due date, memo' })
  })

  it('records the paid amount in the activity log', async () => {
    const service = setup()
    const paid = await service.recordPayment('inv-2026-0408', 'Priya Raman')
    expect(paid.activity.at(-1)?.action).toBe('Payment received: CA$9,605.00')
  })

  it('flips an open invoice to overdue once its due date passes', async () => {
    const seed = loadSeed()
    const later = createInvoiceService(createMemoryRepository(seed.invoices), { asOfDate: '2026-06-01' })
    const invoice = await later.get('inv-2026-0412')
    expect(invoice.paymentStatus).toBe('Overdue')
  })

  it('throws a 409 when voiding a draft', async () => {
    const service = setup()
    await expect(service.void('inv-2026-0413', 'Jordan Lee')).rejects.toMatchObject({ status: 409 })
    await expect(service.void('inv-2026-0413', 'Jordan Lee')).rejects.toBeInstanceOf(ServiceError)
  })
})
