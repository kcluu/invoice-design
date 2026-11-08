import type { InvoiceInput } from './invoice.types'

const round = (value: number) => Math.round(value * 100) / 100

export const subtotalOf = (lineItems: InvoiceInput['lineItems']) =>
  round(lineItems.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0))

export const computeTotals = (invoice: Pick<InvoiceInput, 'lineItems' | 'discount' | 'taxRate'>) => {
  const subtotal = subtotalOf(invoice.lineItems)
  const discount = Math.min(invoice.discount, subtotal)
  const tax = round((subtotal - discount) * invoice.taxRate)
  return { subtotal, discount, tax, total: round(subtotal - discount + tax) }
}
