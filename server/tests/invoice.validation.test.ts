import { describe, expect, it } from 'vitest'
import { loadSeed } from '../src/db/seedData'
import { toInvoiceInput, validateInvoiceInput, validateInvoiceUpdate } from '../src/invoices/invoice.validation'
import type { InvoiceInput } from '../src/invoices/invoice.types'

const validInput = (): InvoiceInput => ({
  customerName: 'Acme Labs',
  billingEmail: 'ap@acmelabs.example',
  billingAddress: '415 Market Street, San Francisco, CA 94105',
  paymentTerms: 'Net 30',
  currency: 'USD',
  issueDate: '2026-05-04',
  dueDate: '2026-06-03',
  memo: 'May platform subscription.',
  taxRate: 0.085,
  discount: 0,
  lineItems: [{ description: 'Platform subscription', quantity: 1, unitPrice: 12000, accountCode: '4000' }],
})

describe('validateInvoiceInput', () => {
  it('accepts a complete invoice', () => {
    const result = validateInvoiceInput(validInput())
    expect(result.ok).toBe(true)
  })

  it('accepts every invoice in the seed file', () => {
    for (const invoice of loadSeed().invoices) {
      expect(validateInvoiceInput(toInvoiceInput(invoice)).ok).toBe(true)
    }
  })

  it('requires a customer and a valid billing email', () => {
    const result = validateInvoiceInput({ ...validInput(), customerName: '  ', billingEmail: 'not-an-email' })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.customerName).toBeDefined()
    expect(result.errors.billingEmail).toBeDefined()
  })

  it('needs at least one line item with a positive quantity', () => {
    const empty = validateInvoiceInput({ ...validInput(), lineItems: [] })
    expect(empty.ok).toBe(false)

    const badQty = validateInvoiceInput({
      ...validInput(),
      lineItems: [{ description: 'Support', quantity: 0, unitPrice: 100, accountCode: '4300' }],
    })
    expect(badQty.ok).toBe(false)
    if (badQty.ok) return
    expect(badQty.errors['lineItems.0.quantity']).toBeDefined()
  })

  it('rejects a due date before the invoice date', () => {
    const result = validateInvoiceInput({ ...validInput(), dueDate: '2026-05-01' })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.dueDate).toMatch(/before/)
  })

  it('rejects a discount larger than the subtotal', () => {
    const result = validateInvoiceInput({ ...validInput(), discount: 50000 })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.discount).toBeDefined()
  })

  it('caps the memo at 250 characters and tax at 100%', () => {
    const result = validateInvoiceInput({ ...validInput(), memo: 'x'.repeat(251), taxRate: 1.5 })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.memo).toBeDefined()
    expect(result.errors.taxRate).toBeDefined()
  })
})

describe('validateInvoiceUpdate', () => {
  const sent = loadSeed().invoices.find((invoice) => invoice.status === 'Sent')!

  it('lets a sent invoice change its memo and dates', () => {
    const result = validateInvoiceUpdate(sent, { memo: 'Updated memo', dueDate: '2026-06-15' })
    expect(result.ok).toBe(true)
  })

  it('locks customer and line items once an invoice is sent', () => {
    const result = validateInvoiceUpdate(sent, { customerName: 'Someone Else', lineItems: [] })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.customerName).toMatch(/locked/)
    expect(result.errors.lineItems).toMatch(/locked/)
  })
})
