import type { InvoiceAction } from '../../hooks/useInvoiceActions'
import type { Invoice } from '../../types/invoice'
import { formatDate } from '../../utils/dates'
import { displayStatus, dueInfo, isOutstanding } from '../../utils/invoiceStatus'
import { computeTotals } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'
import { RowActionsMenu } from '../RowActionsMenu/RowActionsMenu'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { DueLabel, Empty, NumberButton, Primary, Row, Secondary, Table, TableWrap, Td, Th } from './InvoiceTable.styled'

interface InvoiceTableProp {
  invoices: Invoice[]
  asOfDate: string
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onAction: (invoice: Invoice, action: Exclude<InvoiceAction, 'delete'>) => void
  onRequestDelete: (invoice: Invoice) => void
}

const balanceNote = (invoice: Invoice, total: number) => {
  const status = displayStatus(invoice)
  if (isOutstanding(invoice)) return `Balance ${formatMoney(total, invoice.currency)}`
  if (status === 'Draft') return 'Not sent'
  if (status === 'Paid') return 'Paid in full'
  return 'No balance'
}

export const InvoiceTable = ({ invoices, asOfDate, onOpen, onEdit, onAction, onRequestDelete }: InvoiceTableProp) => {
  if (!invoices.length) return <Empty>No invoices match this view.</Empty>

  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>Invoice</Th>
            <Th>Customer</Th>
            <Th>Issued</Th>
            <Th>Due</Th>
            <Th>Status</Th>
            <Th $align="right">Amount</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const due = dueInfo(invoice, asOfDate)
            const total = computeTotals(invoice).total
            return (
              <Row key={invoice.id}>
                <Td>
                  <NumberButton type="button" onClick={() => onOpen(invoice.id)}>
                    {invoice.invoiceNumber}
                  </NumberButton>
                  <Secondary>{invoice.memo}</Secondary>
                </Td>
                <Td>
                  <Primary>{invoice.customerName}</Primary>
                  <Secondary>{invoice.paymentTerms}</Secondary>
                </Td>
                <Td>{formatDate(invoice.issueDate)}</Td>
                <Td>
                  <DueLabel $tone={due.tone}>{due.label}</DueLabel>
                  <Secondary>{due.detail}</Secondary>
                </Td>
                <Td>
                  <StatusBadge status={displayStatus(invoice)} />
                </Td>
                <Td $align="right">
                  <Primary>{formatMoney(total, invoice.currency)}</Primary>
                  <Secondary>{balanceNote(invoice, total)}</Secondary>
                </Td>
                <Td>
                  <RowActionsMenu
                    invoice={invoice}
                    onView={() => onOpen(invoice.id)}
                    onEdit={() => onEdit(invoice.id)}
                    onAction={(action) => onAction(invoice, action)}
                    onRequestDelete={() => onRequestDelete(invoice)}
                  />
                </Td>
              </Row>
            )
          })}
        </tbody>
      </Table>
    </TableWrap>
  )
}
