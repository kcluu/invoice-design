import { useCallback, useEffect, useRef, useState } from 'react'
import { invoicesApi } from '../api/invoicesApi'
import type { Invoice } from '../types/invoice'
import type { LoadStatus } from './useInvoices'

export const useInvoice = (id: string | null) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const load = useCallback(async () => {
    if (!id) return
    const current = ++requestId.current
    setStatus('loading')
    setError(null)
    try {
      const data = await invoicesApi.get(id)
      if (current !== requestId.current) return
      setInvoice(data)
      setStatus('success')
    } catch (err) {
      if (current !== requestId.current) return
      setError(err instanceof Error ? err.message : 'Couldn’t load this invoice')
      setStatus('error')
    }
  }, [id])

  useEffect(() => {
    void load()
    return () => {
      requestId.current += 1
    }
  }, [load])

  return { invoice, status, error, reload: load, setInvoice }
}
