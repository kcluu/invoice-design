import { useState } from 'react'
import { useInvoice } from '../../hooks/useInvoice'
import { useInvoiceActions } from '../../hooks/useInvoiceActions'
import { REVENUE_ACCOUNTS, type Invoice } from '../../types/invoice'
import { formatDate, formatTimestamp } from '../../utils/dates'
import { displayStatus, dueInfo } from '../../utils/invoiceStatus'
import { availableActions } from '../../utils/invoicePermissions'
import { computeTotals, lineAmount } from '../../utils/invoiceTotals'
import { formatMoney, formatPercent, formatQuantity, formatUnitPrice } from '../../utils/money'
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog/ConfirmDeleteDialog'
import { InvoiceDetailSkeleton } from '../InvoiceDetailSkeleton/InvoiceDetailSkeleton'

interface InvoiceDetailPageProp {
  id: string
  asOfDate: string
  onBack: () => void
  onEdit: (id: string) => void
  onUpdated: (invoice: Invoice) => void
  onDeleted: (invoice: Invoice) => void
}

const accountLabel = (code: string) => {
  const account = REVENUE_ACCOUNTS.find((item) => item.code === code)
  return account ? `${code} · ${account.name}` : code
}

export const InvoiceDetailPage = ({ id, asOfDate, onBack, onEdit, onUpdated, onDeleted }: InvoiceDetailPageProp) => {
  const { invoice, status, error, setInvoice } = useInvoice(id)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const actions = useInvoiceActions({
    onUpdated: (updated) => {
      setInvoice(updated)
      onUpdated(updated)
    },
    onDeleted,
  })

  if (status === 'loading') return <InvoiceDetailSkeleton />
  if (status === 'error' || !invoice) return <p>{error}</p>

  const totals = computeTotals(invoice)
  const due = dueInfo(invoice, asOfDate)
  const money = (amount: number) => formatMoney(amount, invoice.currency)
  const allowed = availableActions(invoice)
  const busy = actions.pending !== null
  const pendingAction = actions.pending?.action

  return (
    <section>
      <button type="button" onClick={onBack}>
        All invoices
      </button>
      <h1>{invoice.invoiceNumber}</h1>
      <p>
        {displayStatus(invoice)} · {invoice.customerName} · {invoice.currency}
      </p>

      <div>
        {allowed.canEdit && (
          <button type="button" onClick={() => onEdit(invoice.id)}>
            Edit
          </button>
        )}
        {allowed.canSend && (
          <button type="button" disabled={busy} onClick={() => void actions.run(invoice, 'send')}>
            {pendingAction === 'send' ? 'Sending…' : 'Send invoice'}
          </button>
        )}
        {allowed.canRecordPayment && (
          <button type="button" disabled={busy} onClick={() => void actions.run(invoice, 'recordPayment')}>
            {pendingAction === 'recordPayment' ? 'Recording…' : 'Record payment'}
          </button>
        )}
        {allowed.canVoid && (
          <button type="button" disabled={busy} onClick={() => void actions.run(invoice, 'void')}>
            {pendingAction === 'void' ? 'Voiding…' : 'Void'}
          </button>
        )}
        {allowed.canDelete && (
          <button type="button" disabled={busy} onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
        )}
      </div>
      {actions.error && <p>{actions.error}</p>}

      <h2>Details</h2>
      <dl>
        <dt>Customer</dt>
        <dd>{invoice.customerName}</dd>
        <dt>Billing email</dt>
        <dd>{invoice.billingEmail}</dd>
        <dt>Billing address</dt>
        <dd>{invoice.billingAddress || '—'}</dd>
        <dt>Invoice date</dt>
        <dd>{formatDate(invoice.issueDate)}</dd>
        <dt>Due date</dt>
        <dd>
          {formatDate(invoice.dueDate)} ({due.label})
        </dd>
        <dt>Terms</dt>
        <dd>{invoice.paymentTerms}</dd>
        <dt>Memo</dt>
        <dd>{invoice.memo || '—'}</dd>
      </dl>

      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Account</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((line) => (
            <tr key={line.id}>
              <td>{line.description}</td>
              <td>{accountLabel(line.accountCode)}</td>
              <td>{formatQuantity(line.quantity)}</td>
              <td>{formatUnitPrice(line.unitPrice, invoice.currency)}</td>
              <td>{money(lineAmount(line))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl>
        <dt>Subtotal</dt>
        <dd>{money(totals.subtotal)}</dd>
        <dt>Discount</dt>
        <dd>{money(-totals.discount)}</dd>
        <dt>Tax ({formatPercent(invoice.taxRate)})</dt>
        <dd>{money(totals.tax)}</dd>
        <dt>Total</dt>
        <dd>{money(totals.total)}</dd>
      </dl>

      <h2>Activity</h2>
      <ol>
        {[...invoice.activity].reverse().map((entry) => (
          <li key={entry.id}>
            {entry.action} — {entry.actor}, {formatTimestamp(entry.timestamp)}
          </li>
        ))}
      </ol>

      {confirmingDelete && (
        <ConfirmDeleteDialog
          invoice={invoice}
          busy={busy}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => void actions.run(invoice, 'delete')}
          onVoidInstead={async () => {
            if (await actions.run(invoice, 'void')) setConfirmingDelete(false)
          }}
        />
      )}
    </section>
  )
}
