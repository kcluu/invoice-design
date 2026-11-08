import type { Invoice } from '../../types/invoice'
import { formatDate } from '../../utils/dates'
import { displayStatus, dueInfo } from '../../utils/invoiceStatus'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'

interface InvoiceTableProp {
  invoices: Invoice[]
  asOfDate: string
  onOpen: (id: string) => void
}

export const InvoiceTable = ({ invoices, asOfDate, onOpen }: InvoiceTableProp) => {
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
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
