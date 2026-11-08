import type { InvoiceAction } from '../../hooks/useInvoiceActions'
import type { Invoice } from '../../types/invoice'
import { formatDate } from '../../utils/dates'
import { displayStatus, dueInfo } from '../../utils/invoiceStatus'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'
import { RowActionsMenu } from '../RowActionsMenu/RowActionsMenu'

interface InvoiceTableProp {
  invoices: Invoice[]
  asOfDate: string
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onAction: (invoice: Invoice, action: Exclude<InvoiceAction, 'delete'>) => void
  onRequestDelete: (invoice: Invoice) => void
}

export const InvoiceTable = ({ invoices, asOfDate, onOpen, onEdit, onAction, onRequestDelete }: InvoiceTableProp) => {
  if (!invoices.length) return <p>No invoices match this view.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Invoice</th>
          <th>Customer</th>
          <th>Issued</th>
          <th>Due</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => {
          const due = dueInfo(invoice, asOfDate)
          return (
            <tr key={invoice.id}>
              <td>
                <button type="button" onClick={() => onOpen(invoice.id)}>
                  {invoice.invoiceNumber}
                </button>
                <div>{invoice.memo}</div>
              </td>
              <td>{invoice.customerName}</td>
              <td>{formatDate(invoice.issueDate)}</td>
              <td>
                {due.label}
                <div>{due.detail}</div>
              </td>
              <td>{displayStatus(invoice)}</td>
              <td>{formatMoney(computeTotals(invoice).total, invoice.currency)}</td>
              <td>
                <RowActionsMenu
                  invoice={invoice}
                  onView={() => onOpen(invoice.id)}
                  onEdit={() => onEdit(invoice.id)}
                  onAction={(action) => onAction(invoice, action)}
                  onRequestDelete={() => onRequestDelete(invoice)}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
