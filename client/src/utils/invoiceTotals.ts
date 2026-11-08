import type { InvoiceInput } from '../types/invoice'

const round = (value: number) => Math.round(value * 100) / 100

export const lineAmount = (line: { quantity: number; unitPrice: number }) => round(line.quantity * line.unitPrice)

// mirrors the server so the form preview matches what gets saved
export const computeTotals = (invoice: Pick<InvoiceInput, 'lineItems' | 'discount' | 'taxRate'>) => {
  const subtotal = round(invoice.lineItems.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0))
  const discount = Math.min(invoice.discount, subtotal)
  const tax = round((subtotal - discount) * invoice.taxRate)
  return { subtotal, discount, tax, total: round(subtotal - discount + tax) }
}
