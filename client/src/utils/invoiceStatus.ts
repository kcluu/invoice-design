import type { DisplayStatus, Invoice } from '../types/invoice'
import { daysBetween, formatDate } from './dates'

export const DUE_SOON_DAYS = 14

const STATUS_BY_PAYMENT: Record<Invoice['paymentStatus'], DisplayStatus> = {
  Unsent: 'Draft',
  Open: 'Open',
  Overdue: 'Overdue',
  Paid: 'Paid',
  Voided: 'Void',
}

export const displayStatus = (invoice: Pick<Invoice, 'paymentStatus'>): DisplayStatus => STATUS_BY_PAYMENT[invoice.paymentStatus]

export const isOutstanding = (invoice: Pick<Invoice, 'paymentStatus'>) => ['Open', 'Overdue'].includes(displayStatus(invoice))

export type DueTone = 'normal' | 'soon' | 'late' | 'muted'

export interface DueInfo {
  label: string
  detail: string
  tone: DueTone
  isDueSoon: boolean
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export const dueInfo = (invoice: Invoice, asOfDate: string): DueInfo => {
  const status = displayStatus(invoice)
  const days = daysBetween(asOfDate, invoice.dueDate)

  if (status === 'Paid') {
    return { label: `Paid ${formatDate(invoice.paidDate)}`, detail: `Due ${formatDate(invoice.dueDate)}`, tone: 'muted', isDueSoon: false }
  }
  if (status === 'Void') {
    return { label: 'Voided', detail: `Was due ${formatDate(invoice.dueDate)}`, tone: 'muted', isDueSoon: false }
  }
  if (days < 0) {
    return { label: `${plural(-days, 'day')} overdue`, detail: `Due ${formatDate(invoice.dueDate)}`, tone: 'late', isDueSoon: false }
  }
  if (days === 0) {
    return { label: 'Due today', detail: formatDate(invoice.dueDate), tone: 'soon', isDueSoon: true }
  }
  if (days <= DUE_SOON_DAYS) {
    return { label: `Due in ${plural(days, 'day')}`, detail: formatDate(invoice.dueDate), tone: 'soon', isDueSoon: true }
  }
  return { label: formatDate(invoice.dueDate), detail: `in ${plural(days, 'day')}`, tone: 'normal', isDueSoon: false }
}
