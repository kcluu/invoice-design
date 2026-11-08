import type { Invoice, PaymentTerms } from '../types/invoice'

export interface CustomerProfile {
  name: string
  email: string
  address: string
  paymentTerms: PaymentTerms
  currency: string
  taxRate: number
}

// there's no customers table yet, so build profiles from each customer's latest invoice
export const deriveCustomers = (invoices: Invoice[]): CustomerProfile[] => {
  const latest = new Map<string, Invoice>()
  for (const invoice of invoices) {
    const seen = latest.get(invoice.customerName)
    if (!seen || invoice.issueDate > seen.issueDate) latest.set(invoice.customerName, invoice)
  }
  return [...latest.values()]
    .map((invoice) => ({
      name: invoice.customerName,
      email: invoice.billingEmail,
      address: invoice.billingAddress,
      paymentTerms: invoice.paymentTerms,
      currency: invoice.currency,
      taxRate: invoice.taxRate,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
