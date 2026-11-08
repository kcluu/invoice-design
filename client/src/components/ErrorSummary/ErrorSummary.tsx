import { useEffect, useId, useRef } from 'react'
import { Box, Content, List, SummaryLink } from './ErrorSummary.styled'

interface ErrorSummaryProp {
  items: Array<{ key: string; text: string }>
  // bump this after a failed save to pull focus to the summary
  focusSignal: number
  onSelect: (key: string) => void
}

export const ErrorSummary = ({ items, focusSignal, onSelect }: ErrorSummaryProp) => {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const hasItems = items.length > 0

  useEffect(() => {
    if (focusSignal > 0 && hasItems) ref.current?.focus()
  }, [focusSignal, hasItems])

  if (!hasItems) return null
  return (
    <Box ref={ref} role="alert" tabIndex={-1} aria-labelledby={titleId}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.5" />
      </svg>
      <Content>
        <strong id={titleId}>Fix these before saving</strong>
        <List>
          {items.map((item) => (
            <li key={item.key}>
              <SummaryLink type="button" onClick={() => onSelect(item.key)}>
                {item.text}
              </SummaryLink>
            </li>
          ))}
        </List>
      </Content>
    </Box>
  )
}
