import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { buildInvoice } from '../test/factories'
import { deriveCustomers } from '../utils/customers'
import { emptyForm, formFromInvoice, useInvoiceForm } from './useInvoiceForm'

const AS_OF = '2026-05-04'
const customers = deriveCustomers([
  buildInvoice({
    customerName: 'Juniper Supply Co.',
    billingEmail: 'invoices@junipersupply.example',
    currency: 'CAD',
    paymentTerms: 'Due on receipt',
    taxRate: 0.13,
  }),
])

describe('useInvoiceForm', () => {
  it('fills billing details when a known customer is picked', () => {
    const { result } = renderHook(() => useInvoiceForm({ initialValues: emptyForm(AS_OF), customers }))
    act(() => result.current.setField('customerName', 'Juniper Supply Co.'))

    expect(result.current.values).toMatchObject({
      billingEmail: 'invoices@junipersupply.example',
      currency: 'CAD',
      paymentTerms: 'Due on receipt',
      taxPercent: '13',
      dueDate: AS_OF,
    })
  })

  it('moves the due date when terms change', () => {
    const { result } = renderHook(() => useInvoiceForm({ initialValues: emptyForm(AS_OF), customers }))
    act(() => result.current.setField('paymentTerms', 'Net 15'))
    expect(result.current.values.dueDate).toBe('2026-05-19')
  })

  it('totals line items, discount and tax', () => {
    const invoice = buildInvoice({
      discount: 1000,
      taxRate: 0.1,
      lineItems: [
        { id: 'a', description: 'Implementation', quantity: 40, unitPrice: 275, accountCode: '4100' },
        { id: 'b', description: 'Migration', quantity: 12, unitPrice: 225, accountCode: '4100' },
      ],
    })
    const { result } = renderHook(() => useInvoiceForm({ initialValues: formFromInvoice(invoice), customers }))
    expect(result.current.totals).toEqual({ subtotal: 13700, discount: 1000, tax: 1270, total: 13970 })
  })

  it('adds and removes product lines', () => {
    const { result } = renderHook(() => useInvoiceForm({ initialValues: emptyForm(AS_OF), customers }))
    act(() => result.current.addLine())
    expect(result.current.values.lineItems).toHaveLength(2)

    const [, second] = result.current.values.lineItems
    act(() => result.current.removeLine(second.key))
    expect(result.current.values.lineItems).toHaveLength(1)
  })
})
