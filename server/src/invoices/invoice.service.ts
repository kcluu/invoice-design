import { randomUUID } from 'node:crypto'
import type { InvoiceRepository } from './invoice.repository'
import { derivePaymentStatus, withPaymentStatus } from './invoice.status'
import { computeTotals } from './invoice.totals'
import type { ActivityEntry, FieldErrors, Invoice, InvoiceInput, InvoiceStatus } from './invoice.types'
import { validateInvoiceInput, validateInvoiceUpdate } from './invoice.validation'

export class ServiceError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: FieldErrors
  ) {
    super(message)
  }
}

export interface InvoiceServiceOptions {
  asOfDate: string
  now?: () => Date
}

const CHANGE_LABELS: Partial<Record<keyof InvoiceInput, string>> = {
  customerName: 'customer',
  billingEmail: 'billing email',
  billingAddress: 'billing address',
  paymentTerms: 'terms',
  currency: 'currency',
  issueDate: 'invoice date',
  dueDate: 'due date',
  memo: 'memo',
  taxRate: 'tax rate',
  discount: 'discount',
  lineItems: 'products',
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

export const createInvoiceService = (repository: InvoiceRepository, { asOfDate, now = () => new Date() }: InvoiceServiceOptions) => {
  const shortId = () => randomUUID().slice(0, 8)

  const entry = (actor: string, action: string): ActivityEntry => ({
    id: `act-${shortId()}`,
    timestamp: now().toISOString(),
    actor,
    action,
  })

  const present = (invoice: Invoice) => withPaymentStatus(invoice, asOfDate)

  const getOrThrow = async (id: string) => {
    const invoice = await repository.findById(id)
    if (!invoice) throw new ServiceError(404, 'invoice not found')
    return invoice
  }

  const requireStatus = (invoice: Invoice, allowed: InvoiceStatus[], message: string) => {
    if (!allowed.includes(invoice.status)) throw new ServiceError(409, message)
  }

  const save = async (invoice: Invoice) =>
    present(await repository.update({ ...invoice, paymentStatus: derivePaymentStatus(invoice, asOfDate) }))

  const withLineIds = (input: InvoiceInput) => input.lineItems.map((line) => ({ ...line, id: line.id ?? `li-${shortId()}` }))

  // invoice numbers run per year and count up from the highest one so far
  const nextInvoiceNumber = async () => {
    const prefix = `INV-${asOfDate.slice(0, 4)}-`
    const highest = (await repository.list())
      .filter((invoice) => invoice.invoiceNumber.startsWith(prefix))
      .reduce((max, invoice) => Math.max(max, Number(invoice.invoiceNumber.slice(prefix.length)) || 0), 0)
    return `${prefix}${String(highest + 1).padStart(4, '0')}`
  }

  const describeChanges = (before: Invoice, after: InvoiceInput) => {
    const changed = (Object.keys(CHANGE_LABELS) as Array<keyof InvoiceInput>).filter(
      (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])
    )
    return changed.length ? `Edited ${changed.map((key) => CHANGE_LABELS[key]).join(', ')}` : 'Saved invoice without changes'
  }

  const formatAmount = (invoice: Invoice) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(computeTotals(invoice).total)

  return {
    async list() {
      return (await repository.list()).map(present)
    },

    async get(id: string) {
      return present(await getOrThrow(id))
    },

    async create(body: unknown, actor: string) {
      const send = isRecord(body) && body.send === true
      const result = validateInvoiceInput(body)
      if (!result.ok) throw new ServiceError(422, 'invoice has invalid fields', result.errors)

      const input = result.value
      const invoiceNumber = await nextInvoiceNumber()
      const status: InvoiceStatus = send ? 'Sent' : 'Draft'
      const invoice: Invoice = {
        ...input,
        id: invoiceNumber.toLowerCase(),
        invoiceNumber,
        status,
        paymentStatus: derivePaymentStatus({ status, dueDate: input.dueDate }, asOfDate),
        paidDate: null,
        lineItems: withLineIds(input),
        activity: send
          ? [entry(actor, 'Created invoice'), entry(actor, `Sent invoice to ${input.billingEmail}`)]
          : [entry(actor, 'Created draft invoice')],
      }
      return present(await repository.insert(invoice))
    },

    async update(id: string, body: unknown, actor: string) {
      const existing = await getOrThrow(id)
      requireStatus(existing, ['Draft', 'Sent'], `${existing.status.toLowerCase()} invoices can’t be edited`)

      const result = validateInvoiceUpdate(existing, body)
      if (!result.ok) throw new ServiceError(422, 'invoice has invalid fields', result.errors)

      return save({
        ...existing,
        ...result.value,
        lineItems: withLineIds(result.value),
        activity: [...existing.activity, entry(actor, describeChanges(existing, result.value))],
      })
    },

    async send(id: string, actor: string) {
      const invoice = await getOrThrow(id)
      requireStatus(invoice, ['Draft'], 'only draft invoices can be sent')
      return save({ ...invoice, status: 'Sent', activity: [...invoice.activity, entry(actor, `Sent invoice to ${invoice.billingEmail}`)] })
    },

    async recordPayment(id: string, actor: string) {
      const invoice = await getOrThrow(id)
      requireStatus(invoice, ['Sent'], 'only sent invoices can be paid')
      return save({
        ...invoice,
        status: 'Paid',
        paidDate: asOfDate,
        activity: [...invoice.activity, entry(actor, `Payment received: ${formatAmount(invoice)}`)],
      })
    },

    async void(id: string, actor: string) {
      const invoice = await getOrThrow(id)
      requireStatus(invoice, ['Sent'], 'only sent invoices can be voided, delete drafts instead')
      return save({ ...invoice, status: 'Void', activity: [...invoice.activity, entry(actor, 'Voided invoice')] })
    },

    async remove(id: string) {
      const invoice = await getOrThrow(id)
      if (invoice.status === 'Paid') throw new ServiceError(409, 'paid invoices can’t be deleted, reverse the payment first')
      await repository.remove(id)
    },
  }
}

export type InvoiceService = ReturnType<typeof createInvoiceService>
