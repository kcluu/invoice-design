import { useEffect, useState } from 'react'
import { invoicesApi } from '../api/invoicesApi'
import type { AppMeta } from '../types/invoice'

// until the api answers, measure due dates from today
const fallbackMeta: AppMeta = {
  companyName: 'Northstar Metrics',
  baseCurrency: 'USD',
  asOfDate: new Date().toISOString().slice(0, 10),
}

export const useMeta = () => {
  const [meta, setMeta] = useState<AppMeta>(fallbackMeta)

  useEffect(() => {
    let active = true
    invoicesApi
      .meta()
      .then((data) => {
        if (active) setMeta(data)
      })
      .catch(() => {
        // keep the fallback, the invoice list surfaces api errors itself
      })
    return () => {
      active = false
    }
  }, [])

  return meta
}
