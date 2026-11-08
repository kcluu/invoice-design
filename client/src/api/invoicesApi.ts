import type { AppMeta, DraftExample, DraftResult, Invoice, InvoiceInput } from '../types/invoice'
import { request } from './http'

const invoicePath = (id: string) => `/api/invoices/${encodeURIComponent(id)}`

export const invoicesApi = {
  meta: () => request<AppMeta>('/api/meta'),

  list: () => request<Invoice[]>('/api/invoices'),

  get: (id: string) => request<Invoice>(invoicePath(id)),

  create: (input: InvoiceInput, { send = false } = {}) =>
    request<Invoice>('/api/invoices', { method: 'POST', body: JSON.stringify({ ...input, send }) }),

  update: (id: string, changes: Partial<InvoiceInput>) =>
    request<Invoice>(invoicePath(id), { method: 'PATCH', body: JSON.stringify(changes) }),

  send: (id: string) => request<Invoice>(`${invoicePath(id)}/send`, { method: 'POST' }),

  recordPayment: (id: string) => request<Invoice>(`${invoicePath(id)}/payments`, { method: 'POST' }),

  void: (id: string) => request<Invoice>(`${invoicePath(id)}/void`, { method: 'POST' }),

  remove: (id: string) => request<void>(invoicePath(id), { method: 'DELETE' }),

  draftExamples: () => request<DraftExample[]>('/api/invoices/draft-examples'),

  // parses a plain text billing request into form values, nothing is saved
  draftFromText: (text: string) =>
    request<DraftResult>('/api/invoices/draft-from-text', { method: 'POST', body: JSON.stringify({ text }) }),
}
