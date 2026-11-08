export const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Void'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export const PAYMENT_STATUSES = ['Unsent', 'Open', 'Overdue', 'Paid', 'Voided'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const PAYMENT_TERMS = ['Due on receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60'] as const
export type PaymentTerms = (typeof PAYMENT_TERMS)[number]

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  accountCode: string
}

export interface ActivityEntry {
  id: string
  timestamp: string
  actor: string
  action: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  billingEmail: string
  billingAddress: string
  paymentTerms: PaymentTerms
  status: InvoiceStatus
  paymentStatus: PaymentStatus
  currency: string
  issueDate: string
  dueDate: string
  paidDate: string | null
  memo: string
  taxRate: number
  discount: number
  lineItems: LineItem[]
  activity: ActivityEntry[]
}

// the fields a person fills in, everything else is owned by the server
export interface InvoiceInput {
  customerName: string
  billingEmail: string
  billingAddress: string
  paymentTerms: PaymentTerms
  currency: string
  issueDate: string
  dueDate: string
  memo: string
  taxRate: number
  discount: number
  lineItems: Array<Omit<LineItem, 'id'> & { id?: string }>
}

export type FieldErrors = Record<string, string>

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors }
