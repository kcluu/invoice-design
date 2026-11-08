import { Message } from './FieldError.styled'

interface FieldErrorProp {
  id: string
  message?: string
}

export const FieldError = ({ id, message }: FieldErrorProp) => (message ? <Message id={id}>{message}</Message> : null)
