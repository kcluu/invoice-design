import type { InvoiceAction } from '../../hooks/useInvoiceActions';
import type { Invoice } from '../../types/invoice';
import { formatDate } from '../../utils/dates';
import { displayStatus, dueInfo, isOutstanding } from '../../utils/invoiceStatus';
import { computeTotals } from '../../utils/invoiceTotals';
import { formatMoney } from '../../utils/money';
import { RowActionsMenu } from '../RowActionsMenu/RowActionsMenu';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { Caption, DueLabel, Empty, NumberButton, Primary, Row, Secondary, Table, TableWrap, Td, Th } from './InvoiceTable.styled';

interface InvoiceTableProp {
  invoices: Invoice[];
  asOfDate: string;
  caption: string;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onAction: (invoice: Invoice, action: Exclude<InvoiceAction, 'delete'>) => void;
  onRequestDelete: (invoice: Invoice) => void;
}

const balanceNote = (invoice: Invoice, total: number) => {
  const status = displayStatus(invoice);
  if (isOutstanding(invoice)) return `Balance ${formatMoney(total, invoice.currency)}`;
  if (status === 'Draft') return 'Not sent';
  if (status === 'Paid') return 'Paid in full';
  return 'No balance';
};

export const InvoiceTable = ({ invoices, asOfDate, caption, onOpen, onEdit, onAction, onRequestDelete }: InvoiceTableProp) => {
  if (!invoices.length) return <Empty role="status">No invoices match this view.</Empty>;

  return (
    <TableWrap>
      <Table>
        <Caption>{caption}</Caption>
        <thead>
          <tr>
            <Th scope="col">Invoice</Th>
            <Th scope="col">Customer</Th>
            <Th scope="col">Issued</Th>
            <Th scope="col">Due</Th>
            <Th scope="col">Status</Th>
            <Th scope="col" $align="right">
              Amount
            </Th>
            <Th scope="col">
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const due = dueInfo(invoice, asOfDate);
            const total = computeTotals(invoice).total;
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
                  {displayStatus(invoice) === 'Void' ? (
                    // a voided invoice is never due, the status column already says why
                    <DueLabel $tone={due.tone}>
                      <span aria-hidden="true">—</span>
                      <VisuallyHidden>Not due</VisuallyHidden>
                    </DueLabel>
                  ) : (
                    <DueLabel $tone={due.tone}>{due.label}</DueLabel>
                  )}
                  <Secondary>{due.detail}</Secondary>
                </Td>
                <Td $valign="middle">
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
            );
          })}
        </tbody>
      </Table>
    </TableWrap>
  );
};
