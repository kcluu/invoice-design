import { useId, useRef } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { Invoice } from '../../types/invoice'
import { displayStatus } from '../../utils/invoiceStatus'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'
import { Button } from '../Button/Button'
import { Backdrop, Body, FinePrint, Footer, Panel, Summary, Title } from './ConfirmDeleteDialog.styled'

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
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const bodyId = useId()
  const canVoid = invoice.status === 'Sent'

  // start on cancel, the safe choice for a destructive dialog
  useFocusTrap(panelRef, { onEscape: busy ? undefined : onCancel, initialFocus: '[data-autofocus]' })

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <Panel ref={panelRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId} aria-busy={busy}>
        <Title id={titleId}>Delete {invoice.invoiceNumber}?</Title>
        <Body id={bodyId}>{deleteMessage(invoice)}</Body>
        <Summary>
          <span>{invoice.customerName}</span>
          <strong>{formatMoney(computeTotals(invoice).total, invoice.currency)}</strong>
        </Summary>
        <FinePrint>This can’t be undone. The deletion is kept in the audit trail.</FinePrint>
        <Footer>
          <Button data-autofocus onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          {canVoid && (
            <Button onClick={onVoidInstead} disabled={busy}>
              Void instead
            </Button>
          )}
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete invoice'}
          </Button>
        </Footer>
      </Panel>
    </Backdrop>
  )
}
