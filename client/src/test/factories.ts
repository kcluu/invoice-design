import type { Invoice } from '../types/invoice'

let counter = 500

export const buildInvoice = (overrides: Partial<Invoice> = {}): Invoice => {
  counter += 1
  return {
    id: `inv-2026-0${counter}`,
    invoiceNumber: `INV-2026-0${counter}`,
    customerName: 'Acme Labs',
    billingEmail: 'ap@acmelabs.example',
    billingAddress: '415 Market Street, San Francisco, CA 94105',
    paymentTerms: 'Net 30',
    status: 'Sent',
    paymentStatus: 'Open',
    currency: 'USD',
    issueDate: '2026-04-28',
    dueDate: '2026-05-28',
    paidDate: null,
    memo: 'April platform subscription.',
    taxRate: 0.085,
    discount: 0,
    lineItems: [{ id: `li-${counter}`, description: 'Platform subscription', quantity: 1, unitPrice: 12000, accountCode: '4000' }],
    activity: [{ id: `act-${counter}`, timestamp: '2026-04-28T10:14:00-04:00', actor: 'Maya Chen', action: 'Created invoice' }],
    ...overrides,
  }
}
