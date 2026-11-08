import { useState } from 'react'
import { useFocusOnReady } from '../../hooks/useFocusOnReady'
import { paths } from '../../hooks/useHashRoute'
import { useInvoice } from '../../hooks/useInvoice'
import { useInvoiceActions } from '../../hooks/useInvoiceActions'
import { REVENUE_ACCOUNTS, type Invoice } from '../../types/invoice'
import { formatDate, formatTimestamp } from '../../utils/dates'
import { displayStatus, dueInfo, isOutstanding, type DueInfo } from '../../utils/invoiceStatus'
import { availableActions } from '../../utils/invoicePermissions'
import { computeTotals, lineAmount } from '../../utils/invoiceTotals'
import { formatMoney, formatPercent, formatQuantity, formatUnitPrice } from '../../utils/money'
import { Button } from '../Button/Button'
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog/ConfirmDeleteDialog'
import { ErrorState } from '../ErrorState/ErrorState'
import { InvoiceDetailSkeleton } from '../InvoiceDetailSkeleton/InvoiceDetailSkeleton'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import {
  Actions,
  Activity,
  BackLink,
  Balance,
  Banner,
  type BannerTone,
  Card,
  CardTitle,
  Columns,
  DetailGrid,
  DueHint,
  ErrorBanner,
  Header,
  LineTable,
  MainColumn,
  Meta,
  Page,
  SideColumn,
  TableScroll,
  Title,
  TitleRow,
  Totals,
  TotalsRow,
  Wide,
} from './InvoiceDetailPage.styled'

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

// one line of context at the top so the state of the invoice is obvious
const bannerFor = (invoice: Invoice, due: DueInfo): { tone: BannerTone; text: string } | null => {
  const status = displayStatus(invoice)
  if (status === 'Overdue')
    return { tone: 'late', text: `This invoice is ${due.label}. Follow up with ${invoice.customerName} or record a payment.` }
  if (status === 'Open' && due.isDueSoon) return { tone: 'soon', text: `${due.label}. The balance is still open.` }
  if (status === 'Draft') return { tone: 'neutral', text: 'Draft. Not sent to the customer yet, so it isn’t in AR aging.' }
  if (status === 'Void') return { tone: 'neutral', text: 'Voided. Kept for the audit trail and excluded from AR.' }
  return null
}

export const InvoiceDetailPage = ({ id, asOfDate, onBack, onEdit, onUpdated, onDeleted }: InvoiceDetailPageProp) => {
  const { invoice, status, error, setInvoice, reload } = useInvoice(id)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const headingRef = useFocusOnReady<HTMLHeadingElement>(status === 'success')
  const actions = useInvoiceActions({
    onUpdated: (updated) => {
      setInvoice(updated)
      onUpdated(updated)
    },
    onDeleted,
  })

  if (status === 'loading') return <InvoiceDetailSkeleton />
  if (status === 'error' || !invoice) {
    return (
      <ErrorState
        title="Couldn’t open this invoice"
        message={error ?? 'Something went wrong.'}
        onRetry={() => void reload()}
        backHref={`#${paths.list()}`}
      />
    )
  }

  const totals = computeTotals(invoice)
  const due = dueInfo(invoice, asOfDate)
  const money = (amount: number) => formatMoney(amount, invoice.currency)
  const allowed = availableActions(invoice)
  const busy = actions.pending !== null
  const pendingAction = actions.pending?.action
  const banner = bannerFor(invoice, due)
  const balance = isOutstanding(invoice) || invoice.status === 'Draft' ? totals.total : 0

  return (
    <Page>
      <BackLink type="button" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        All invoices
      </BackLink>

      <Header>
        <div>
          <TitleRow>
            <Title ref={headingRef} tabIndex={-1}>
              {invoice.invoiceNumber}
            </Title>
            <StatusBadge status={displayStatus(invoice)} />
          </TitleRow>
          <Meta>
            {invoice.customerName} · {invoice.currency} · Issued {formatDate(invoice.issueDate)}
          </Meta>
        </div>
        <Actions>
          {allowed.canEdit && <Button onClick={() => onEdit(invoice.id)}>Edit</Button>}
          {allowed.canVoid && (
            <Button disabled={busy} onClick={() => void actions.run(invoice, 'void')}>
              {pendingAction === 'void' ? 'Voiding…' : 'Void'}
            </Button>
          )}
          {allowed.canDelete && (
            <Button variant="danger" disabled={busy} onClick={() => setConfirmingDelete(true)}>
              Delete
            </Button>
          )}
          {allowed.canSend && (
            <Button variant="primary" disabled={busy} onClick={() => void actions.run(invoice, 'send')}>
              {pendingAction === 'send' ? 'Sending…' : 'Send invoice'}
            </Button>
          )}
          {allowed.canRecordPayment && (
            <Button variant="primary" disabled={busy} onClick={() => void actions.run(invoice, 'recordPayment')}>
              {pendingAction === 'recordPayment' ? 'Recording…' : 'Record payment'}
            </Button>
          )}
        </Actions>
      </Header>

      {banner && (
        <Banner $tone={banner.tone}>
          <span>{banner.text}</span>
        </Banner>
      )}
      {actions.error && (
        <ErrorBanner role="alert">
          <span>{actions.error}</span>
          <Button size="sm" variant="ghost" onClick={actions.clearError}>
            Dismiss
          </Button>
        </ErrorBanner>
      )}

      <Columns>
        <MainColumn>
          <Card>
            <CardTitle>Details</CardTitle>
            <DetailGrid>
              <div>
                <dt>Customer</dt>
                <dd>{invoice.customerName}</dd>
              </div>
              <div>
                <dt>Billing email</dt>
                <dd>{invoice.billingEmail}</dd>
              </div>
              <div>
                <dt>Billing address</dt>
                <dd>{invoice.billingAddress || '—'}</dd>
              </div>
              <div>
                <dt>Invoice date</dt>
                <dd>{formatDate(invoice.issueDate)}</dd>
              </div>
              <div>
                <dt>Due date</dt>
                <dd>
                  {formatDate(invoice.dueDate)} <DueHint $tone={due.tone}>· {due.label}</DueHint>
                </dd>
              </div>
              <div>
                <dt>Terms</dt>
                <dd>{invoice.paymentTerms}</dd>
              </div>
              <Wide>
                <dt>Memo</dt>
                <dd>{invoice.memo || '—'}</dd>
              </Wide>
            </DetailGrid>
          </Card>

          <Card>
            <CardTitle>Products</CardTitle>
            <TableScroll>
              <LineTable>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Account</th>
                    <th className="num">Qty</th>
                    <th className="num">Unit price</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((line) => (
                    <tr key={line.id}>
                      <td>{line.description}</td>
                      <td>{accountLabel(line.accountCode)}</td>
                      <td className="num">{formatQuantity(line.quantity)}</td>
                      <td className="num">{formatUnitPrice(line.unitPrice, invoice.currency)}</td>
                      <td className="num">{money(lineAmount(line))}</td>
                    </tr>
                  ))}
                </tbody>
              </LineTable>
            </TableScroll>
            <TotalsRow>
              <Totals>
                <dt>Subtotal</dt>
                <dd>{money(totals.subtotal)}</dd>
                <dt>Discount</dt>
                <dd>{totals.discount ? `−${money(totals.discount)}` : money(0)}</dd>
                <dt>Tax ({formatPercent(invoice.taxRate)})</dt>
                <dd>{money(totals.tax)}</dd>
                <dt>Total</dt>
                <dd>{money(totals.total)}</dd>
              </Totals>
            </TotalsRow>
          </Card>
        </MainColumn>

        <SideColumn>
          <Card>
            <Balance>
              <span>Balance due</span>
              <strong>{money(balance)}</strong>
              <DueHint $tone={due.tone}>{due.label}</DueHint>
            </Balance>
          </Card>

          <Card>
            <CardTitle>Activity</CardTitle>
            <Activity>
              {[...invoice.activity].reverse().map((entry) => (
                <li key={entry.id}>
                  <div>
                    {entry.action}
                    <small>
                      {entry.actor} · {formatTimestamp(entry.timestamp)}
                    </small>
                  </div>
                </li>
              ))}
            </Activity>
          </Card>
        </SideColumn>
      </Columns>

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
    </Page>
  )
}
