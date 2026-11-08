import { useInvoiceFilters } from '../../hooks/useInvoiceFilters'
import type { LoadStatus } from '../../hooks/useInvoices'
import type { Invoice } from '../../types/invoice'
import { InvoiceTable } from '../InvoiceTable/InvoiceTable'
import { StatusTabs } from '../StatusTabs/StatusTabs'
import { SummaryCards } from '../SummaryCards/SummaryCards'

interface InvoiceListPageProp {
  invoices: Invoice[]
  status: LoadStatus
  error: string | null
  asOfDate: string
  onOpen: (id: string) => void
  onCreate: () => void
}

export const InvoiceListPage = ({ invoices, status, error, asOfDate, onOpen, onCreate }: InvoiceListPageProp) => {
  const { filter, setFilter, query, setQuery, visible, counts, groups } = useInvoiceFilters(invoices, asOfDate)

  return (
    <section>
      <h1>Invoices</h1>
      <button type="button" onClick={onCreate}>
        Add invoice
      </button>

      <SummaryCards groups={groups} activeFilter={filter} onSelect={setFilter} />
      <StatusTabs value={filter} counts={counts} onChange={setFilter} />
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search number or customer" />

      {status === 'loading' && <p>Loading invoices…</p>}
      {status === 'error' && <p>{error}</p>}
      {status === 'success' && <InvoiceTable invoices={visible} asOfDate={asOfDate} onOpen={onOpen} />}
    </section>
  )
}
