import { describe, expect, it } from 'vitest'
import { emptyForm, emptyLine } from '../hooks/useInvoiceForm'
import { summarizeErrors, validateInvoiceForm } from './validateInvoiceForm'

const filled = () => ({
  ...emptyForm('2026-05-04'),
  customerName: 'Acme Labs',
  billingEmail: 'ap@acmelabs.example',
  lineItems: [emptyLine({ description: 'Platform subscription', quantity: '1', unitPrice: '12000' })],
})

describe('validateInvoiceForm', () => {
  it('passes a complete form', () => {
    expect(validateInvoiceForm(filled())).toEqual({})
  })

  it('flags each invalid field by the same key the api uses', () => {
    const errors = validateInvoiceForm({
      ...filled(),
      customerName: '',
      billingEmail: 'ap@',
      dueDate: '2026-05-01',
      lineItems: [emptyLine({ description: '', quantity: '0', unitPrice: '' })],
    })
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining([
        'customerName',
        'billingEmail',
        'dueDate',
        'lineItems.0.description',
        'lineItems.0.quantity',
        'lineItems.0.unitPrice',
      ])
    )
  })

  it('writes a readable summary line per error', () => {
    const summary = summarizeErrors({ 'lineItems.1.unitPrice': 'Enter a unit price of 0 or more.' })
    expect(summary).toEqual(['Product line 2 unit price: enter a unit price of 0 or more.'])
  })
})
