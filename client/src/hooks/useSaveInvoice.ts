import { useCallback, useState } from 'react'
import { invoicesApi } from '../api/invoicesApi'
import type { Invoice, InvoiceInput } from '../types/invoice'
import { SENT_EDITABLE_FIELDS } from '../utils/invoicePermissions'

type SaveRequest = { mode: 'create'; input: InvoiceInput; send: boolean } | { mode: 'edit'; invoice: Invoice; input: InvoiceInput }

export const useSaveInvoice = () => {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = useCallback(async (request: SaveRequest): Promise<Invoice | null> => {
    setSaving(true)
    setError(null)
    try {
      if (request.mode === 'create') return await invoicesApi.create(request.input, { send: request.send })

      // sent invoices only accept the unlocked fields
      const changes =
        request.invoice.status === 'Sent' ? Object.fromEntries(SENT_EDITABLE_FIELDS.map((key) => [key, request.input[key]])) : request.input
      return await invoicesApi.update(request.invoice.id, changes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t save the invoice')
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  return { save, saving, error }
}
