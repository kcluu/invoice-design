import { useState } from 'react'
import type { InvoiceAction } from '../../hooks/useInvoiceActions'
import type { Invoice } from '../../types/invoice'
import { availableActions } from '../../utils/invoicePermissions'

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
    <div>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        Actions
      </button>
      {open && (
        <div>
          <button type="button" onClick={pick(onView)}>
            View invoice
          </button>
          {actions.canEdit && (
            <button type="button" onClick={pick(onEdit)}>
              Edit
            </button>
          )}
          {actions.canSend && (
            <button type="button" onClick={pick(() => onAction('send'))}>
              Send
            </button>
          )}
          {actions.canRecordPayment && (
            <button type="button" onClick={pick(() => onAction('recordPayment'))}>
              Record payment
            </button>
          )}
          {actions.canVoid && (
            <button type="button" onClick={pick(() => onAction('void'))}>
              Void
            </button>
          )}
          {actions.canDelete ? (
            <button type="button" onClick={pick(onRequestDelete)}>
              Delete
            </button>
          ) : (
            <p>Paid invoices can’t be deleted. Reverse the payment first.</p>
          )}
        </div>
      )}
    </div>
  )
}
