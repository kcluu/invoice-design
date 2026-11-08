import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetch } from '../../test/fetchMock'
import { renderWithTheme } from '../../test/render'
import type { DraftResult } from '../../types/invoice'
import { DraftFromText } from './DraftFromText'

const result: DraftResult = {
  draft: {
    customerName: 'Brightline Health',
    billingEmail: 'finance@brightline.example',
    billingAddress: '18 Boylston Street, Boston, MA 02116',
    paymentTerms: 'Net 15',
    currency: 'USD',
    issueDate: '2026-05-04',
    dueDate: '2026-05-19',
    memo: 'Implementation services, Migration support.',
    taxRate: 0,
    discount: 1000,
    lineItems: [{ description: 'Implementation services', quantity: 40, unitPrice: 275, accountCode: '4100' }],
  },
  needsReview: ['Tax was unclear, so it’s set to 0%. Confirm before sending.'],
  filledFields: ['customerName', 'lineItems', 'discount'],
}

describe('DraftFromText', () => {
  let fetchMock: ReturnType<typeof mockFetch>

  beforeEach(() => {
    fetchMock = mockFetch()
    // examples load on mount, drafting posts the text
    fetchMock.mockImplementation(async (url: string) =>
      url.endsWith('/draft-examples')
        ? jsonResponse([{ id: 'prompt-2', label: 'Incomplete services request', input: 'Create an invoice for Brightline Health…' }])
        : jsonResponse(result)
    )
  })

  it('drafts from an example and lists what needs review', async () => {
    const onDraft = vi.fn()
    const user = userEvent.setup()
    renderWithTheme(<DraftFromText onDraft={onDraft} />)

    await user.click(await screen.findByRole('button', { name: 'Incomplete services request' }))

    await waitFor(() => expect(onDraft).toHaveBeenCalledWith(result))
    expect(screen.getByText('Check these before sending')).toBeInTheDocument()
    expect(screen.getByText(/Tax was unclear/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Describe the invoice/)).toHaveValue('Create an invoice for Brightline Health…')
  })

  it('asks for a description before calling the api', async () => {
    const user = userEvent.setup()
    renderWithTheme(<DraftFromText onDraft={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Draft invoice' }))

    expect(screen.getByText(/Describe the invoice first/)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalledWith('/api/invoices/draft-from-text', expect.anything())
  })
})
