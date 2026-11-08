import { useState } from 'react'
import { useInvoiceActions } from '../../hooks/useInvoiceActions'
import { useInvoiceFilters } from '../../hooks/useInvoiceFilters'
import type { LoadStatus } from '../../hooks/useInvoices'
import type { Invoice } from '../../types/invoice'
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog/ConfirmDeleteDialog'
import { ErrorState } from '../ErrorState/ErrorState'
import { InvoiceTable } from '../InvoiceTable/InvoiceTable'
import { InvoiceTableSkeleton } from '../InvoiceTableSkeleton/InvoiceTableSkeleton'
import { StatusTabs } from '../StatusTabs/StatusTabs'
import { SummaryCards } from '../SummaryCards/SummaryCards'

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

  const confirmDelete = async () => {
    if (deleting && (await actions.run(deleting, 'delete'))) setDeleting(null)
  }

  const voidInstead = async () => {
    if (deleting && (await actions.run(deleting, 'void'))) setDeleting(null)
  }

  return (
    <section>
      <h1>Invoices</h1>
      <button type="button" onClick={onCreate}>
        Add invoice
      </button>

      <SummaryCards groups={groups} activeFilter={filter} loading={status === 'loading'} onSelect={setFilter} />
      <StatusTabs value={filter} counts={counts} onChange={setFilter} />
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search number or customer" />

      {actions.error && (
        <div role="alert">
          <p>{actions.error}</p>
          <button type="button" onClick={actions.clearError}>
            Dismiss
          </button>
        </div>
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
    </section>
  )
}
