import { useEffect, useRef } from 'react'

// after a route change, move focus to the new page heading so screen readers announce it
export const useFocusOnReady = <T extends HTMLElement>(ready: boolean) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ready) ref.current?.focus()
  }, [ready])

  return ref
}
