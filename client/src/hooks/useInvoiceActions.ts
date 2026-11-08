import { useCallback, useState } from 'react'
import { invoicesApi } from '../api/invoicesApi'
import type { Invoice } from '../types/invoice'

export type InvoiceAction = 'send' | 'recordPayment' | 'void' | 'delete'

interface UseInvoiceActionsOptions {
  onUpdated: (invoice: Invoice) => void
  onDeleted: (invoice: Invoice) => void
}

export const useInvoiceActions = ({ onUpdated, onDeleted }: UseInvoiceActionsOptions) => {
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
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'That didn’t work, try again')
        return false
      } finally {
        setPending(null)
      }
    },
    [onUpdated, onDeleted]
  )

  return { run, pending, error, clearError: () => setError(null) }
}
