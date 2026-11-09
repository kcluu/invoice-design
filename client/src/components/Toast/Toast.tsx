import { Bubble, Dismiss, Region } from './Toast.styled';

interface ToastProp {
  message: string | null;
  onDismiss: () => void;
}

// the live region stays mounted so screen readers notice when a message appears
export const Toast = ({ message, onDismiss }: ToastProp) => (
  <Region role="status" aria-live="polite">
    {message && (
      <Bubble>
        <span>{message}</span>
        <Dismiss type="button" aria-label="Dismiss notification" onClick={onDismiss}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Dismiss>
      </Bubble>
    )}
  </Region>
);
