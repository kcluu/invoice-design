import { useMemo, useState } from 'react'
import type { DisplayStatus, Invoice } from '../types/invoice'
import { displayStatus, dueInfo, isOutstanding } from '../utils/invoiceStatus'

// status tabs plus the two summary-only views that don't map to a single status
export type InvoiceFilter = 'all' | DisplayStatus | 'outstanding' | 'dueSoon'

export const STATUS_TABS: Array<{ value: InvoiceFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Open', label: 'Open' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Void', label: 'Void' },
]

const byDueDate = (a: Invoice, b: Invoice) => a.dueDate.localeCompare(b.dueDate)

export const useInvoiceFilters = (invoices: Invoice[], asOfDate: string) => {
  const [filter, setFilter] = useState<InvoiceFilter>('all')
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const isDueSoon = (invoice: Invoice) => displayStatus(invoice) === 'Open' && dueInfo(invoice, asOfDate).isDueSoon
    return {
      outstanding: invoices.filter(isOutstanding),
      overdue: invoices.filter((invoice) => displayStatus(invoice) === 'Overdue'),
      dueSoon: invoices.filter(isDueSoon),
      drafts: invoices.filter((invoice) => displayStatus(invoice) === 'Draft'),
      isDueSoon,
    }
  }, [invoices, asOfDate])

  const counts = useMemo(() => {
    const result: Record<'all' | DisplayStatus, number> = { all: invoices.length, Draft: 0, Open: 0, Overdue: 0, Paid: 0, Void: 0 }
    for (const invoice of invoices) result[displayStatus(invoice)] += 1
    return result
  }, [invoices])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const matchesFilter = (invoice: Invoice) => {
      if (filter === 'all') return true
      if (filter === 'outstanding') return isOutstanding(invoice)
      if (filter === 'dueSoon') return groups.isDueSoon(invoice)
      return displayStatus(invoice) === filter
    }
    const matchesQuery = (invoice: Invoice) =>
      !term || invoice.invoiceNumber.toLowerCase().includes(term) || invoice.customerName.toLowerCase().includes(term)

    const result = invoices.filter((invoice) => matchesFilter(invoice) && matchesQuery(invoice))
    // money owed reads best soonest-due first
    if (filter === 'outstanding' || filter === 'Overdue' || filter === 'dueSoon') result.sort(byDueDate)
    return result
  }, [invoices, filter, query, groups])

  return { filter, setFilter, query, setQuery, visible, counts, groups }
}
