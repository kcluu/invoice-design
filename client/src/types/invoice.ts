export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Void'
export type PaymentStatus = 'Unsent' | 'Open' | 'Overdue' | 'Paid' | 'Voided'

// what a person sees in the list, derived from the payment status
export type DisplayStatus = 'Draft' | 'Open' | 'Overdue' | 'Paid' | 'Void'

export const PAYMENT_TERMS = ['Due on receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60'] as const
export type PaymentTerms = (typeof PAYMENT_TERMS)[number]

export const CURRENCIES = ['USD', 'CAD', 'GBP', 'EUR'] as const

export const REVENUE_ACCOUNTS = [
  { code: '4000', name: 'Subscription' },
  { code: '4010', name: 'Usage' },
  { code: '4100', name: 'Services' },
  { code: '4200', name: 'Advisory' },
  { code: '4300', name: 'Support' },
] as const

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

export interface AppMeta {
  companyName: string
  baseCurrency: string
  asOfDate: string
}

export type FieldErrors = Record<string, string>
