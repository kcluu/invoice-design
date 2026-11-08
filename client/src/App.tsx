import { useMemo, type ReactNode } from 'react'
import { AppShell } from './components/AppShell/AppShell'
import { InvoiceDetailPage } from './components/InvoiceDetailPage/InvoiceDetailPage'
import { InvoiceFormPage } from './components/InvoiceFormPage/InvoiceFormPage'
import { InvoiceListPage } from './components/InvoiceListPage/InvoiceListPage'
import { paths, useHashRoute } from './hooks/useHashRoute'
import { useInvoices } from './hooks/useInvoices'
import { useMeta } from './hooks/useMeta'
import type { Invoice } from './types/invoice'
import { deriveCustomers } from './utils/customers'

export const App = () => {
  const { route, navigate } = useHashRoute()
  const meta = useMeta()
  const { invoices, status, error, reload, upsertInvoice, removeInvoice } = useInvoices()
  const customers = useMemo(() => deriveCustomers(invoices), [invoices])

  const handleSaved = (invoice: Invoice) => {
    upsertInvoice(invoice)
    navigate(paths.detail(invoice.id))
  }

  const handleDeleted = (invoice: Invoice) => {
    removeInvoice(invoice.id)
    if (route.name !== 'list') navigate(paths.list())
  }

  const numberFor = (id: string) => invoices.find((item) => item.id === id)?.invoiceNumber ?? id.toUpperCase()
  const breadcrumbs = ['Accounts receivable', 'Invoices']
  let page: ReactNode

  switch (route.name) {
    case 'new':
      breadcrumbs.push('New invoice')
      page = (
        <InvoiceFormPage
          invoiceId={null}
          customers={customers}
          asOfDate={meta.asOfDate}
          onSaved={handleSaved}
          onCancel={() => navigate(paths.list())}
        />
      )
      break
    case 'edit':
      breadcrumbs.push(`Edit ${numberFor(route.id)}`)
      page = (
        <InvoiceFormPage
          invoiceId={route.id}
          customers={customers}
          asOfDate={meta.asOfDate}
          onSaved={handleSaved}
          onCancel={() => navigate(paths.detail(route.id))}
        />
      )
      break
    case 'detail':
      breadcrumbs.push(numberFor(route.id))
      page = (
        <InvoiceDetailPage
          id={route.id}
          asOfDate={meta.asOfDate}
          onBack={() => navigate(paths.list())}
          onEdit={(id) => navigate(paths.edit(id))}
          onUpdated={upsertInvoice}
          onDeleted={handleDeleted}
        />
      )
      break
    default:
      page = (
        <InvoiceListPage
          invoices={invoices}
          status={status}
          error={error}
          asOfDate={meta.asOfDate}
          onOpen={(id) => navigate(paths.detail(id))}
          onEdit={(id) => navigate(paths.edit(id))}
          onCreate={() => navigate(paths.new())}
          onRetry={() => void reload()}
          onUpdated={upsertInvoice}
          onDeleted={handleDeleted}
        />
      )
  }

  return (
    <AppShell companyName={meta.companyName} asOfDate={meta.asOfDate} breadcrumbs={breadcrumbs}>
      {page}
    </AppShell>
  )
}
