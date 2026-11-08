import { useCallback, useEffect, useRef, useState } from 'react'
import { errorMessage } from '../api/http'
import { invoicesApi } from '../api/invoicesApi'
import type { Invoice } from '../types/invoice'

export type LoadStatus = 'loading' | 'success' | 'error'

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  // ignore responses from requests that were superseded by a newer one
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const id = ++requestId.current
    setStatus('loading')
    setError(null)
    try {
      const data = await invoicesApi.list()
      if (id !== requestId.current) return
      setInvoices(data)
      setStatus('success')
    } catch (err) {
      if (id !== requestId.current) return
      setError(errorMessage(err, 'Couldn’t load invoices.'))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
    return () => {
      requestId.current += 1
    }
  }, [load])

  const upsertInvoice = useCallback((invoice: Invoice) => {
    setInvoices((current) =>
      current.some((item) => item.id === invoice.id)
        ? current.map((item) => (item.id === invoice.id ? invoice : item))
        : [invoice, ...current]
    )
  }, [])

  const removeInvoice = useCallback((id: string) => {
    setInvoices((current) => current.filter((item) => item.id !== id))
  }, [])

  return { invoices, status, error, reload: load, upsertInvoice, removeInvoice }
}
