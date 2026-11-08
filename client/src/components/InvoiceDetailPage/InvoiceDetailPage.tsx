import { useInvoice } from '../../hooks/useInvoice'
import { REVENUE_ACCOUNTS } from '../../types/invoice'
import { formatDate, formatTimestamp } from '../../utils/dates'
import { displayStatus, dueInfo } from '../../utils/invoiceStatus'
import { computeTotals, lineAmount } from '../../utils/invoiceTotals'
import { formatMoney, formatPercent, formatQuantity, formatUnitPrice } from '../../utils/money'

interface InvoiceDetailPageProp {
  id: string
  asOfDate: string
  onBack: () => void
}

const accountLabel = (code: string) => {
  const account = REVENUE_ACCOUNTS.find((item) => item.code === code)
  return account ? `${code} · ${account.name}` : code
}

export const InvoiceDetailPage = ({ id, asOfDate, onBack }: InvoiceDetailPageProp) => {
  const { invoice, status, error } = useInvoice(id)

  if (status === 'loading') return <p>Loading invoice…</p>
  if (status === 'error' || !invoice) return <p>{error}</p>

  const totals = computeTotals(invoice)
  const due = dueInfo(invoice, asOfDate)
  const money = (amount: number) => formatMoney(amount, invoice.currency)

  return (
    <section>
      <button type="button" onClick={onBack}>
        All invoices
      </button>
      <h1>{invoice.invoiceNumber}</h1>
      <p>
        {displayStatus(invoice)} · {invoice.customerName} · {invoice.currency}
      </p>

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
    </section>
  )
}
