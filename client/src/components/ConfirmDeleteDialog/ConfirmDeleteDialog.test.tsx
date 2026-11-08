import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buildInvoice } from '../../test/factories'
import { renderWithTheme } from '../../test/render'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'

const renderDialog = (invoice = buildInvoice()) => {
  const props = { onCancel: vi.fn(), onConfirm: vi.fn(), onVoidInstead: vi.fn() }
  renderWithTheme(<ConfirmDeleteDialog invoice={invoice} busy={false} {...props} />)
  return props
}

describe('ConfirmDeleteDialog', () => {
  it('is a labelled modal that starts focus on cancel', () => {
    renderDialog()
    const dialog = screen.getByRole('alertdialog', { name: /delete INV-/ })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription(/already sent/)
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('keeps tab focus inside the dialog', async () => {
    const user = userEvent.setup()
    renderDialog()
    await user.tab()
    await user.tab()
    await user.tab()
    // cancel, void instead, delete, then back round to cancel
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('cancels on escape', async () => {
    const user = userEvent.setup()
    const props = renderDialog()
    await user.keyboard('{Escape}')
    expect(props.onCancel).toHaveBeenCalled()
  })

  it('only offers void for sent invoices', () => {
    renderDialog(buildInvoice({ status: 'Draft', paymentStatus: 'Unsent' }))
    expect(screen.queryByRole('button', { name: 'Void instead' })).not.toBeInTheDocument()
  })
})
