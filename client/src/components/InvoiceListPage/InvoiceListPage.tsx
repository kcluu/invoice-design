import { useState } from 'react'
import { useInvoiceActions } from '../../hooks/useInvoiceActions'
import { useInvoiceFilters } from '../../hooks/useInvoiceFilters'
import type { LoadStatus } from '../../hooks/useInvoices'
import type { Invoice } from '../../types/invoice'
import { Button } from '../Button/Button'
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog/ConfirmDeleteDialog'
import { ErrorState } from '../ErrorState/ErrorState'
import { InvoiceTable } from '../InvoiceTable/InvoiceTable'
import { InvoiceTableSkeleton } from '../InvoiceTableSkeleton/InvoiceTableSkeleton'
import { StatusTabs } from '../StatusTabs/StatusTabs'
import { SummaryCards } from '../SummaryCards/SummaryCards'
import {
  Banner,
  FocusChip,
  FocusNote,
  Header,
  HeaderActions,
  LinkButton,
  Page,
  Search,
  Subtitle,
  Title,
  TitleBlock,
  Toolbar,
} from './InvoiceListPage.styled'

interface InvoiceListPageProp {
  invoices: Invoice[]
  status: LoadStatus
  error: string | null
  asOfDate: string
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onCreate: () => void
  onRetry: () => void
  onUpdated: (invoice: Invoice) => void
  onDeleted: (invoice: Invoice) => void
}

// the two summary views with no matching tab get a short explanation above the table
const FOCUS_NOTES = {
  outstanding: { label: 'Outstanding', note: 'Sent and unpaid, soonest due first.' },
  dueSoon: { label: 'Due in next 14 days', note: 'Open invoices coming due, soonest first.' },
} as const

export const InvoiceListPage = ({
  invoices,
  status,
  error,
  asOfDate,
  onOpen,
  onEdit,
  onCreate,
  onRetry,
  onUpdated,
  onDeleted,
}: InvoiceListPageProp) => {
  const { filter, setFilter, query, setQuery, visible, counts, groups } = useInvoiceFilters(invoices, asOfDate)
  const actions = useInvoiceActions({ onUpdated, onDeleted })
  const [deleting, setDeleting] = useState<Invoice | null>(null)
  const focus = filter === 'outstanding' || filter === 'dueSoon' ? FOCUS_NOTES[filter] : null
  const currencies = [...new Set(invoices.map((invoice) => invoice.currency))].join(', ')

  const confirmDelete = async () => {
    if (deleting && (await actions.run(deleting, 'delete'))) setDeleting(null)
  }

  const voidInstead = async () => {
    if (deleting && (await actions.run(deleting, 'void'))) setDeleting(null)
  }

  return (
    <Page>
      <Header>
        <TitleBlock>
          <Title>Invoices</Title>
          <Subtitle>
            {status === 'success' ? `${invoices.length} invoices${currencies ? ` across ${currencies}` : ''}` : 'Customer invoices'}
          </Subtitle>
        </TitleBlock>
        <HeaderActions>
          <Button variant="primary" onClick={onCreate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add invoice
          </Button>
        </HeaderActions>
      </Header>

      <SummaryCards groups={groups} activeFilter={filter} loading={status === 'loading'} onSelect={setFilter} />

      <Toolbar>
        <StatusTabs value={filter} counts={counts} onChange={setFilter} />
        <Search>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search number or customer" />
        </Search>
      </Toolbar>

      {focus && (
        <FocusNote>
          <FocusChip>
            {focus.label} · {visible.length}
          </FocusChip>
          <span>{focus.note}</span>
          <LinkButton type="button" onClick={() => setFilter('all')}>
            Show all invoices
          </LinkButton>
        </FocusNote>
      )}

      {actions.error && (
        <Banner role="alert">
          <span>{actions.error}</span>
          <Button size="sm" variant="ghost" onClick={actions.clearError}>
            Dismiss
          </Button>
        </Banner>
      )}

      {status === 'loading' && <InvoiceTableSkeleton />}
      {status === 'error' && <ErrorState title="Couldn’t load invoices" message={error ?? 'Something went wrong.'} onRetry={onRetry} />}
      {status === 'success' && (
        <InvoiceTable
          invoices={visible}
          asOfDate={asOfDate}
          onOpen={onOpen}
          onEdit={onEdit}
          onAction={(invoice, action) => void actions.run(invoice, action)}
          onRequestDelete={setDeleting}
        />
      )}

      {deleting && (
        <ConfirmDeleteDialog
          invoice={deleting}
          busy={actions.pending?.id === deleting.id}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void confirmDelete()}
          onVoidInstead={() => void voidInstead()}
        />
      )}
    </Page>
  )
}
