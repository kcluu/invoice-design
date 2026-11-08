import { useMemo } from 'react'
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
  const { invoices, status, error, upsertInvoice, removeInvoice } = useInvoices()
  const customers = useMemo(() => deriveCustomers(invoices), [invoices])

  const handleSaved = (invoice: Invoice) => {
    upsertInvoice(invoice)
    navigate(paths.detail(invoice.id))
  }

  const handleDeleted = (invoice: Invoice) => {
    removeInvoice(invoice.id)
    if (route.name !== 'list') navigate(paths.list())
  }

  switch (route.name) {
    case 'new':
    case 'edit':
      return (
        <InvoiceFormPage
          invoiceId={route.name === 'edit' ? route.id : null}
          customers={customers}
          asOfDate={meta.asOfDate}
          onSaved={handleSaved}
          onCancel={() => navigate(route.name === 'edit' ? paths.detail(route.id) : paths.list())}
        />
      )
    case 'detail':
      return (
        <InvoiceDetailPage
          id={route.id}
          asOfDate={meta.asOfDate}
          onBack={() => navigate(paths.list())}
          onEdit={(id) => navigate(paths.edit(id))}
          onUpdated={upsertInvoice}
          onDeleted={handleDeleted}
        />
      )
    default:
      return (
        <InvoiceListPage
          invoices={invoices}
          status={status}
          error={error}
          asOfDate={meta.asOfDate}
          onOpen={(id) => navigate(paths.detail(id))}
          onEdit={(id) => navigate(paths.edit(id))}
          onCreate={() => navigate(paths.new())}
          onUpdated={upsertInvoice}
          onDeleted={handleDeleted}
        />
      )
  }
}
