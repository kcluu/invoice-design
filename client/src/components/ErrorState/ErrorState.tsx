interface ErrorStateProp {
  title: string
  message: string
  onRetry?: () => void
  backHref?: string
  backLabel?: string
}

// full-panel error for when a page's data couldn't load at all
export const ErrorState = ({ title, message, onRetry, backHref, backLabel = 'Back to invoices' }: ErrorStateProp) => (
  <div role="alert">
    <h2>{title}</h2>
    <p>{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry}>
        Try again
      </button>
    )}
    {backHref && <a href={backHref}>{backLabel}</a>}
  </div>
)
