import { useMemo } from 'react'
import { emptyForm, formFromInvoice } from '../../hooks/useInvoiceForm'
import { useInvoice } from '../../hooks/useInvoice'
import type { Invoice } from '../../types/invoice'
import type { CustomerProfile } from '../../utils/customers'
import { InvoiceForm } from '../InvoiceForm/InvoiceForm'

interface InvoiceFormPageProp {
  invoiceId: string | null
  customers: CustomerProfile[]
  asOfDate: string
  onSaved: (invoice: Invoice) => void
  onCancel: () => void
}

export const InvoiceFormPage = ({ invoiceId, customers, asOfDate, onSaved, onCancel }: InvoiceFormPageProp) => {
  const { invoice, status, error } = useInvoice(invoiceId)
  const createValues = useMemo(() => emptyForm(asOfDate), [asOfDate])

  if (!invoiceId) {
    return <InvoiceForm invoice={null} initialValues={createValues} customers={customers} onSaved={onSaved} onCancel={onCancel} />
  }
  if (status === 'loading') return <p>Loading invoice…</p>
  if (status === 'error' || !invoice) return <p>{error}</p>

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
