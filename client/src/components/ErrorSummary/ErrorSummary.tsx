import { Box, Content, List } from './ErrorSummary.styled'

interface ErrorSummaryProp {
  messages: string[]
}

export const ErrorSummary = ({ messages }: ErrorSummaryProp) => {
  if (!messages.length) return null
  return (
    <Box role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.5" />
      </svg>
      <Content>
        <strong>Fix these before saving</strong>
        <List>
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </List>
      </Content>
    </Box>
  )
}
