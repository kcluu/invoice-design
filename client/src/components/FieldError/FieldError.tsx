interface FieldErrorProp {
  id: string
  message?: string
}

export const FieldError = ({ id, message }: FieldErrorProp) => (message ? <span id={id}>{message}</span> : null)
