import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { buildInvoice } from '../test/factories'
import { jsonResponse, mockFetch } from '../test/fetchMock'
import { useInvoices } from './useInvoices'

describe('useInvoices', () => {
  let fetchMock: ReturnType<typeof mockFetch>

  beforeEach(() => {
    fetchMock = mockFetch()
  })

  it('loads invoices from the api', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([buildInvoice(), buildInvoice()]))
    const { result } = renderHook(() => useInvoices())

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.invoices).toHaveLength(2)
    expect(fetchMock).toHaveBeenCalledWith('/api/invoices', expect.anything())
  })

  it('replaces and removes invoices locally', async () => {
    const first = buildInvoice()
    const second = buildInvoice()
    fetchMock.mockResolvedValueOnce(jsonResponse([first, second]))
    const { result } = renderHook(() => useInvoices())
    await waitFor(() => expect(result.current.status).toBe('success'))

    act(() => result.current.upsertInvoice({ ...first, memo: 'changed' }))
    expect(result.current.invoices[0].memo).toBe('changed')

    act(() => result.current.removeInvoice(second.id))
    expect(result.current.invoices.map((invoice) => invoice.id)).toEqual([first.id])
  })
})
