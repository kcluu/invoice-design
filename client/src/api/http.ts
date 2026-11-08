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
}

export const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-User-Name': CURRENT_USER.name, ...init.headers },
  })

  if (res.status === 204) return undefined as T
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`, body?.fields ?? {})
  return body as T
}
