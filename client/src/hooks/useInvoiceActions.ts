import { useCallback, useState } from 'react'
import { errorMessage } from '../api/http'
import { invoicesApi } from '../api/invoicesApi'
import type { Invoice } from '../types/invoice'

export type InvoiceAction = 'send' | 'recordPayment' | 'void' | 'delete'

interface UseInvoiceActionsOptions {
  onUpdated: (invoice: Invoice) => void
  onDeleted: (invoice: Invoice) => void
  onNotify?: (message: string) => void
}

const successMessage = (invoice: Invoice, action: InvoiceAction) =>
  ({
    send: `${invoice.invoiceNumber} sent to ${invoice.billingEmail}`,
    recordPayment: `Payment recorded on ${invoice.invoiceNumber}`,
    void: `${invoice.invoiceNumber} voided`,
    delete: `${invoice.invoiceNumber} deleted`,
  })[action]

export const useInvoiceActions = ({ onUpdated, onDeleted, onNotify }: UseInvoiceActionsOptions) => {
  const [pending, setPending] = useState<{ id: string; action: InvoiceAction } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (invoice: Invoice, action: InvoiceAction) => {
      setPending({ id: invoice.id, action })
      setError(null)
      try {
        if (action === 'delete') {
          await invoicesApi.remove(invoice.id)
          onDeleted(invoice)
        } else {
          const call = { send: invoicesApi.send, recordPayment: invoicesApi.recordPayment, void: invoicesApi.void }[action]
          onUpdated(await call(invoice.id))
        }
        onNotify?.(successMessage(invoice, action))
        return true
      } catch (err) {
        setError(errorMessage(err, 'That didn’t work. Try again.'))
        return false
      } finally {
        setPending(null)
      }
    },
    [onUpdated, onDeleted, onNotify]
  )

  return { run, pending, error, clearError: () => setError(null) }
}
