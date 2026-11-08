interface ErrorSummaryProp {
  messages: string[]
}

export const ErrorSummary = ({ messages }: ErrorSummaryProp) => {
  if (!messages.length) return null
  return (
    <div role="alert">
      <strong>Fix these before saving</strong>
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  )
}
