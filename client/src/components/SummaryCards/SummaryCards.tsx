import type { InvoiceFilter } from '../../hooks/useInvoiceFilters'
import type { Invoice } from '../../types/invoice'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoneyByCurrency } from '../../utils/money'
import { Skeleton } from '../Skeleton/Skeleton'
import { Amount, Card, CardTop, Dot, Grid, Hint, Label, Sub } from './SummaryCards.styled'

interface SummaryCardsProp {
  groups: { outstanding: Invoice[]; overdue: Invoice[]; dueSoon: Invoice[]; drafts: Invoice[] }
  activeFilter: InvoiceFilter
  loading: boolean
  onSelect: (filter: InvoiceFilter) => void
}

export const SUMMARY_CARDS = [
  { filter: 'outstanding', label: 'Outstanding', group: 'outstanding', empty: 'No open invoices' },
  { filter: 'Overdue', label: 'Overdue', group: 'overdue', empty: 'Nothing past due' },
  { filter: 'dueSoon', label: 'Due in next 14 days', group: 'dueSoon', empty: 'Nothing due soon' },
  { filter: 'Draft', label: 'Drafts to send', group: 'drafts', empty: 'No drafts' },
] as const

const amountOf = (invoices: Invoice[]) =>
  formatMoneyByCurrency(invoices.map((invoice) => ({ amount: computeTotals(invoice).total, currency: invoice.currency })))

const countLabel = (count: number) => `${count} invoice${count === 1 ? '' : 's'}`

export const SummaryCards = ({ groups, activeFilter, loading, onSelect }: SummaryCardsProp) => (
  <Grid role="group" aria-label="Invoice summary. Choose a card to filter the table.">
    {SUMMARY_CARDS.map((card) => {
      const invoices = groups[card.group]
      const active = activeFilter === card.filter
      return (
        // clicking the active card again clears the filter
        <Card
          key={card.filter}
          type="button"
          aria-pressed={active}
          $active={active}
          $tone={card.group}
          onClick={() => onSelect(active ? 'all' : card.filter)}
        >
          <CardTop>
            <Label>
              <Dot $tone={card.group} aria-hidden="true" />
              {card.label}
            </Label>
            <Hint $active={active} $tone={card.group} aria-hidden="true">
              {active ? 'Showing' : 'View'}
            </Hint>
          </CardTop>
          {loading ? (
            <>
              <Skeleton width="60%" height={18} />
              <Skeleton width="35%" height={8} />
            </>
          ) : (
            <>
              <Amount>{amountOf(invoices)}</Amount>
              <Sub>{invoices.length ? countLabel(invoices.length) : card.empty}</Sub>
            </>
          )}
        </Card>
      )
    })}
  </Grid>
)
