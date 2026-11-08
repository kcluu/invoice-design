import { Button } from '../Button/Button'
import { Actions, Message, Panel, Title } from './ErrorState.styled'

interface ErrorStateProp {
  title: string
  message: string
  onRetry?: () => void
  backHref?: string
  backLabel?: string
}

// full-panel error for when a page's data couldn't load at all
export const ErrorState = ({ title, message, onRetry, backHref, backLabel = 'Back to invoices' }: ErrorStateProp) => (
  <Panel role="alert">
    <Title>{title}</Title>
    <Message>{message}</Message>
    <Actions>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
      {backHref && <a href={backHref}>{backLabel}</a>}
    </Actions>
  </Panel>
)
