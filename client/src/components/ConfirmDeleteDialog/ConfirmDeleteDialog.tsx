import type { Invoice } from '../../types/invoice'
import { displayStatus } from '../../utils/invoiceStatus'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'

interface ConfirmDeleteDialogProp {
  invoice: Invoice
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
  onVoidInstead: () => void
}

export const deleteMessage = (invoice: Invoice) => {
  const status = displayStatus(invoice)
  if (status === 'Draft') return 'This draft was never sent, so deleting it has no effect on your books.'
  if (status === 'Void') return 'This removes the voided record from the invoice list.'
  return `This invoice was already sent to ${invoice.customerName}. Deleting it removes it from AR aging. Voiding keeps a record instead.`
}

export const ConfirmDeleteDialog = ({ invoice, busy, onCancel, onConfirm, onVoidInstead }: ConfirmDeleteDialogProp) => {
  const canVoid = invoice.status === 'Sent'

  return (
    <div role="dialog">
      <h2>Delete {invoice.invoiceNumber}?</h2>
      <p>{deleteMessage(invoice)}</p>
      <p>
        {invoice.customerName} · {formatMoney(computeTotals(invoice).total, invoice.currency)}
      </p>
      <p>This can’t be undone.</p>
      <button type="button" onClick={onCancel} disabled={busy}>
        Cancel
      </button>
      {canVoid && (
        <button type="button" onClick={onVoidInstead} disabled={busy}>
          Void instead
        </button>
      )}
      <button type="button" onClick={onConfirm} disabled={busy}>
        {busy ? 'Deleting…' : 'Delete invoice'}
      </button>
    </div>
  )
}
