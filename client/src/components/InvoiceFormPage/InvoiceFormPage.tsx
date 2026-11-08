import { useMemo } from 'react'
import { paths } from '../../hooks/useHashRoute'
import { emptyForm, formFromInvoice } from '../../hooks/useInvoiceForm'
import { useInvoice } from '../../hooks/useInvoice'
import type { Invoice } from '../../types/invoice'
import type { CustomerProfile } from '../../utils/customers'
import { ErrorState } from '../ErrorState/ErrorState'
import { InvoiceDetailSkeleton } from '../InvoiceDetailSkeleton/InvoiceDetailSkeleton'
import { InvoiceForm } from '../InvoiceForm/InvoiceForm'

interface InvoiceFormPageProp {
  invoiceId: string | null
  customers: CustomerProfile[]
  asOfDate: string
  onSaved: (invoice: Invoice) => void
  onCancel: () => void
}

export const InvoiceFormPage = ({ invoiceId, customers, asOfDate, onSaved, onCancel }: InvoiceFormPageProp) => {
  const { invoice, status, error, reload } = useInvoice(invoiceId)
  const createValues = useMemo(() => emptyForm(asOfDate), [asOfDate])

  if (!invoiceId) {
    return <InvoiceForm invoice={null} initialValues={createValues} customers={customers} onSaved={onSaved} onCancel={onCancel} />
  }
  if (status === 'loading') return <InvoiceDetailSkeleton />
  if (status === 'error' || !invoice) {
    return (
      <ErrorState
        title="Couldn’t load this invoice for editing"
        message={error ?? 'Something went wrong.'}
        onRetry={() => void reload()}
        backHref={`#${paths.list()}`}
      />
    )
  }

  // key resets the form state if a different invoice loads
  return (
    <InvoiceForm
      key={invoice.id}
      invoice={invoice}
      initialValues={formFromInvoice(invoice)}
      customers={customers}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  )
}
