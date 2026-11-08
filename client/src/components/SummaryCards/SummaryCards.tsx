import type { InvoiceFilter } from '../../hooks/useInvoiceFilters'
import type { Invoice } from '../../types/invoice'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoneyByCurrency } from '../../utils/money'
import { Skeleton } from '../Skeleton/Skeleton'

interface SummaryCardsProp {
  groups: { outstanding: Invoice[]; overdue: Invoice[]; dueSoon: Invoice[]; drafts: Invoice[] }
  activeFilter: InvoiceFilter
  loading: boolean
  onSelect: (filter: InvoiceFilter) => void
}

const amountOf = (invoices: Invoice[]) =>
  formatMoneyByCurrency(invoices.map((invoice) => ({ amount: computeTotals(invoice).total, currency: invoice.currency })))

export const SummaryCards = ({ groups, activeFilter, loading, onSelect }: SummaryCardsProp) => {
  const cards: Array<{ filter: InvoiceFilter; label: string; invoices: Invoice[] }> = [
    { filter: 'outstanding', label: 'Outstanding', invoices: groups.outstanding },
    { filter: 'Overdue', label: 'Overdue', invoices: groups.overdue },
    { filter: 'dueSoon', label: 'Due in next 14 days', invoices: groups.dueSoon },
    { filter: 'Draft', label: 'Drafts to send', invoices: groups.drafts },
  ]

  return (
    <div>
      {cards.map((card) => (
        // clicking the active card again clears the filter
        <button key={card.filter} type="button" onClick={() => onSelect(activeFilter === card.filter ? 'all' : card.filter)}>
          <span>{card.label}</span>
          {loading ? (
            <>
              <Skeleton width="60%" height={18} />
              <Skeleton width="35%" height={8} />
            </>
          ) : (
            <>
              <strong>{amountOf(card.invoices)}</strong>
              <span>{card.invoices.length} invoices</span>
            </>
          )}
        </button>
      ))}
    </div>
  )
}
