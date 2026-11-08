import { InvoiceDetailPage } from './components/InvoiceDetailPage/InvoiceDetailPage'
import { InvoiceListPage } from './components/InvoiceListPage/InvoiceListPage'
import { paths, useHashRoute } from './hooks/useHashRoute'
import { useInvoices } from './hooks/useInvoices'
import { useMeta } from './hooks/useMeta'

export const App = () => {
  const { route, navigate } = useHashRoute()
  const meta = useMeta()
  const { invoices, status, error } = useInvoices()

  if (route.name === 'detail') {
    return <InvoiceDetailPage id={route.id} asOfDate={meta.asOfDate} onBack={() => navigate(paths.list())} />
  }

  return (
    <InvoiceListPage
      invoices={invoices}
      status={status}
      error={error}
      asOfDate={meta.asOfDate}
      onOpen={(id) => navigate(paths.detail(id))}
      onCreate={() => navigate(paths.new())}
    />
  )
}
