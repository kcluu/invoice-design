import { useState } from 'react'
import type { InvoiceAction } from '../../hooks/useInvoiceActions'
import type { Invoice } from '../../types/invoice'
import { availableActions } from '../../utils/invoicePermissions'
import { Divider, Menu, MenuItem, MenuNote, MenuWrap, Trigger } from './RowActionsMenu.styled'

interface RowActionsMenuProp {
  invoice: Invoice
  onView: () => void
  onEdit: () => void
  onAction: (action: Exclude<InvoiceAction, 'delete'>) => void
  onRequestDelete: () => void
}

export const RowActionsMenu = ({ invoice, onView, onEdit, onAction, onRequestDelete }: RowActionsMenuProp) => {
  const [open, setOpen] = useState(false)
  const actions = availableActions(invoice)
  const pick = (fn: () => void) => () => {
    setOpen(false)
    fn()
  }

  return (
    <MenuWrap>
      <Trigger type="button" title="Actions" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </Trigger>
      {open && (
        <Menu>
          <MenuItem type="button" onClick={pick(onView)}>
            View invoice
          </MenuItem>
          {actions.canEdit && (
            <MenuItem type="button" onClick={pick(onEdit)}>
              Edit
            </MenuItem>
          )}
          {actions.canSend && (
            <MenuItem type="button" onClick={pick(() => onAction('send'))}>
              Send
            </MenuItem>
          )}
          {actions.canRecordPayment && (
            <MenuItem type="button" onClick={pick(() => onAction('recordPayment'))}>
              Record payment
            </MenuItem>
          )}
          {actions.canVoid && (
            <MenuItem type="button" onClick={pick(() => onAction('void'))}>
              Void
            </MenuItem>
          )}
          <Divider />
          {actions.canDelete ? (
            <MenuItem type="button" $danger onClick={pick(onRequestDelete)}>
              Delete
            </MenuItem>
          ) : (
            <MenuNote>Paid invoices can’t be deleted. Reverse the payment first.</MenuNote>
          )}
        </Menu>
      )}
    </MenuWrap>
  )
}
