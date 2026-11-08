import { CURRENT_USER } from '../config'
import type { FieldErrors } from '../types/invoice'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: FieldErrors = {}
  ) {
    super(message)
  }

  get hasFieldErrors() {
    return Object.keys(this.fields).length > 0
  }
}

// server messages are lowercase fragments, turn them into sentences for the ui
const toSentence = (message: string) => {
  const trimmed = message.trim()
  if (!trimmed) return trimmed
  const capitalised = trimmed[0].toUpperCase() + trimmed.slice(1)
  return /[.!?]$/.test(capitalised) ? capitalised : `${capitalised}.`
}

const messageFor = (status: number, serverMessage?: string) => {
  if (status >= 500) return 'Something went wrong on our side. Try again in a moment.'
  if (status === 404) return 'We couldn’t find that invoice. It may have been deleted.'
  if (status === 422) return 'Some fields need fixing before this can be saved.'
  return serverMessage ? toSentence(serverMessage) : `Request failed (${status}).`
}

export const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', 'X-User-Name': CURRENT_USER.name, ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'Can’t reach the server. Check your connection and try again.')
  }

  if (res.status === 204) return undefined as T
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, messageFor(res.status, body?.error), body?.fields ?? {})
  return body as T
}

export const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback)
