import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildInvoice } from '../../test/factories'
import { jsonResponse, mockFetch } from '../../test/fetchMock'
import { InvoiceListPage } from './InvoiceListPage'

const AS_OF = '2026-05-04'

const acme = buildInvoice({ invoiceNumber: 'INV-2026-0412', customerName: 'Acme Labs', dueDate: '2026-05-28' })
const brightline = buildInvoice({
  invoiceNumber: 'INV-2026-0413',
  customerName: 'Brightline Health',
  status: 'Draft',
  paymentStatus: 'Unsent',
})
const juniper = buildInvoice({
  invoiceNumber: 'INV-2026-0408',
  customerName: 'Juniper Supply Co.',
  dueDate: '2026-04-10',
  paymentStatus: 'Overdue',
})

const renderPage = (overrides: Partial<Parameters<typeof InvoiceListPage>[0]> = {}) => {
  const props = {
    invoices: [acme, brightline, juniper],
    status: 'success' as const,
    error: null,
    asOfDate: AS_OF,
    onOpen: vi.fn(),
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onUpdated: vi.fn(),
    onDeleted: vi.fn(),
    ...overrides,
  }
  render(<InvoiceListPage {...props} />)
  return props
}

const bodyRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1)

describe('InvoiceListPage', () => {
  beforeEach(() => {
    mockFetch()
  })

  it('shows a row per invoice with its due label', () => {
    renderPage()
    expect(bodyRows()).toHaveLength(3)
    expect(screen.getByText('24 days overdue')).toBeInTheDocument()
  })

  it('narrows the table when a summary card is clicked', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByText('Drafts to send'))
    expect(bodyRows()).toHaveLength(1)
    expect(within(bodyRows()[0]).getByText('Brightline Health')).toBeInTheDocument()
  })

  it('opens an invoice from its number', async () => {
    const user = userEvent.setup()
    const props = renderPage()
    await user.click(screen.getByRole('button', { name: 'INV-2026-0412' }))
    expect(props.onOpen).toHaveBeenCalledWith(acme.id)
  })

  it('deletes a draft after confirming', async () => {
    const fetchMock = mockFetch()
    fetchMock.mockResolvedValueOnce(jsonResponse(null, 204))
    const user = userEvent.setup()
    const props = renderPage()

    const row = bodyRows().find((item) => within(item).queryByText('Brightline Health'))!
    await user.click(within(row).getByRole('button', { name: 'Actions' }))
    await user.click(within(row).getByRole('button', { name: 'Delete' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete invoice' }))

    await waitFor(() => expect(props.onDeleted).toHaveBeenCalledWith(brightline))
    expect(fetchMock).toHaveBeenCalledWith(`/api/invoices/${brightline.id}`, expect.objectContaining({ method: 'DELETE' }))
  })
})
