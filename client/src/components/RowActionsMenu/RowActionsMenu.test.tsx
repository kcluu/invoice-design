import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buildInvoice } from '../../test/factories'
import { renderWithTheme } from '../../test/render'
import { RowActionsMenu } from './RowActionsMenu'

const renderMenu = (invoice = buildInvoice({ invoiceNumber: 'INV-2026-0412' })) => {
  const props = { onView: vi.fn(), onEdit: vi.fn(), onAction: vi.fn(), onRequestDelete: vi.fn() }
  renderWithTheme(<RowActionsMenu invoice={invoice} {...props} />)
  return props
}

describe('RowActionsMenu', () => {
  it('opens from the keyboard and moves focus with the arrow keys', async () => {
    const user = userEvent.setup()
    renderMenu()

    const trigger = screen.getByRole('button', { name: 'More actions for INV-2026-0412' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')

    const items = screen.getAllByRole('menuitem')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(items[0]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(items[1]).toHaveFocus()
    await user.keyboard('{End}')
    expect(items[items.length - 1]).toHaveFocus()
  })

  it('closes on escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    renderMenu()
    const trigger = screen.getByRole('button', { name: /more actions/i })

    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('explains why a paid invoice has no delete option', async () => {
    const user = userEvent.setup()
    renderMenu(buildInvoice({ status: 'Paid', paymentStatus: 'Paid', paidDate: '2026-04-24' }))
    await user.click(screen.getByRole('button', { name: /more actions/i }))

    expect(screen.queryByRole('menuitem', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.getByText(/can’t be deleted/)).toBeInTheDocument()
  })
})
