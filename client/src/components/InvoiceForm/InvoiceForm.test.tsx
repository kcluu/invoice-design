import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { emptyForm } from '../../hooks/useInvoiceForm'
import { jsonResponse, mockFetch } from '../../test/fetchMock'
import { renderWithTheme } from '../../test/render'
import { InvoiceForm } from './InvoiceForm'

const renderForm = () => {
  const onSaved = vi.fn()
  renderWithTheme(
    <InvoiceForm invoice={null} initialValues={emptyForm('2026-05-04')} customers={[]} onSaved={onSaved} onCancel={vi.fn()} />
  )
  return { onSaved }
}

describe('InvoiceForm', () => {
  let fetchMock: ReturnType<typeof mockFetch>

  beforeEach(() => {
    fetchMock = mockFetch()
  })

  it('lists every problem and marks the fields invalid instead of saving', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: 'Save as draft' }))

    const summary = screen.getByRole('alert')
    expect(within(summary).getByText('Fix these before saving')).toBeInTheDocument()
    expect(within(summary).getAllByRole('listitem').length).toBeGreaterThanOrEqual(3)
    expect(screen.getByLabelText(/Billing email/)).toHaveAttribute('aria-invalid', 'true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows field errors the api sends back', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: 'invoice has invalid fields', fields: { billingEmail: 'must be a valid email address' } }, 422)
    )
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/Customer/), 'Acme Labs')
    await user.type(screen.getByLabelText(/Billing email/), 'ap@acmelabs.example')
    await user.type(screen.getAllByRole('textbox').find((input) => input.closest('td'))!, 'Platform subscription')
    await user.type(screen.getAllByRole('spinbutton').filter((input) => input.closest('td'))[1], '12000')
    await user.click(screen.getByRole('button', { name: 'Save as draft' }))

    // shown inline and in the summary
    expect(await screen.findAllByText(/must be a valid email address/)).toHaveLength(2)
    expect(screen.getByLabelText(/Billing email/)).toHaveAttribute('aria-invalid', 'true')
  })
})
