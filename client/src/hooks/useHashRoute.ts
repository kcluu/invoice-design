import { useCallback, useEffect, useState } from 'react'

export type Route = { name: 'list' } | { name: 'new' } | { name: 'detail'; id: string } | { name: 'edit'; id: string }

export const paths = {
  list: () => '/invoices',
  new: () => '/invoices/new',
  detail: (id: string) => `/invoices/${encodeURIComponent(id)}`,
  edit: (id: string) => `/invoices/${encodeURIComponent(id)}/edit`,
}

export const parseRoute = (hash: string): Route => {
  const [section, id, action] = hash.replace(/^#/, '').split('/').filter(Boolean)
  if (section !== 'invoices' || !id) return { name: 'list' }
  if (id === 'new') return { name: 'new' }
  const decoded = decodeURIComponent(id)
  return action === 'edit' ? { name: 'edit', id: decoded } : { name: 'detail', id: decoded }
}

// tiny hash router, enough for four screens without pulling in a library
export const useHashRoute = () => {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((path: string) => {
    window.location.hash = path
  }, [])

  return { route, navigate }
}
