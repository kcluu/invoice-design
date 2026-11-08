import { useFocusOnReady } from '../../hooks/useFocusOnReady'
import { useInvoiceForm, type InvoiceFormValues } from '../../hooks/useInvoiceForm'
import { useSaveInvoice } from '../../hooks/useSaveInvoice'
import { CURRENCIES, PAYMENT_TERMS, type Invoice, type PaymentTerms } from '../../types/invoice'
import type { CustomerProfile } from '../../utils/customers'
import { availableActions } from '../../utils/invoicePermissions'
import { formatMoney } from '../../utils/money'
import { Button } from '../Button/Button'
import { ErrorSummary } from '../ErrorSummary/ErrorSummary'
import { FieldError } from '../FieldError/FieldError'
import { LineItemsEditor } from '../LineItemsEditor/LineItemsEditor'
import {
  Card,
  CardTitle,
  ErrorBanner,
  Field,
  FieldGrid,
  Footer,
  Form,
  Hint,
  Note,
  Subtitle,
  Title,
  Totals,
  TotalsRow,
} from './InvoiceForm.styled'

interface InvoiceFormProp {
  invoice: Invoice | null
  initialValues: InvoiceFormValues
  customers: CustomerProfile[]
  onSaved: (invoice: Invoice) => void
  onCancel: () => void
}

export const InvoiceForm = ({ invoice, initialValues, customers, onSaved, onCancel }: InvoiceFormProp) => {
  const form = useInvoiceForm({ initialValues, customers })
  const { values, setField, errors } = form
  const { save, saving, error } = useSaveInvoice()
  const locked = invoice ? availableActions(invoice).isLocked : false
  const headingRef = useFocusOnReady<HTMLHeadingElement>(true)
  const money = (amount: number) => formatMoney(amount, values.currency)

  // wires an input to its inline error message
  const errorProps = (key: string) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  })

  const submit = async (send: boolean) => {
    if (saving || !form.validate()) return
    const result = invoice
      ? await save({ mode: 'edit', invoice, input: form.input })
      : await save({ mode: 'create', input: form.input, send })
    if (result.ok) onSaved(result.invoice)
    else form.applyServerErrors(result.fieldErrors)
  }

  return (
    <Form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void submit(false)
      }}
    >
      <div>
        <Title ref={headingRef} tabIndex={-1}>
          {invoice ? `Edit ${invoice.invoiceNumber}` : 'New invoice'}
        </Title>
        <Subtitle>
          {invoice ? `${invoice.customerName} · ${invoice.status}` : 'Creates a draft you can review before it goes to the customer.'}
        </Subtitle>
      </div>

      {locked && (
        <Note>
          This invoice was already sent. You can change the dates, terms and memo. Customer, currency, tax and products are locked so posted
          revenue stays in sync. Void and reissue it to change them.
        </Note>
      )}
      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
      <ErrorSummary messages={form.errorSummary} />

      <Card>
        <CardTitle>Details</CardTitle>
        <FieldGrid>
          <Field>
            Customer
            <input
              list="customer-options"
              value={values.customerName}
              disabled={locked}
              onChange={(event) => setField('customerName', event.target.value)}
              {...errorProps('customerName')}
            />
            <datalist id="customer-options">
              {customers.map((customer) => (
                <option key={customer.name} value={customer.name} />
              ))}
            </datalist>
            <FieldError id="customerName-error" message={errors.customerName} />
          </Field>
          <Field>
            Billing email
            <input
              type="email"
              value={values.billingEmail}
              disabled={locked}
              onChange={(event) => setField('billingEmail', event.target.value)}
              {...errorProps('billingEmail')}
            />
            <FieldError id="billingEmail-error" message={errors.billingEmail} />
          </Field>
          <Field>
            Billing address
            <input value={values.billingAddress} disabled={locked} onChange={(event) => setField('billingAddress', event.target.value)} />
          </Field>
          <Field>
            Currency
            <select value={values.currency} disabled={locked} onChange={(event) => setField('currency', event.target.value)}>
              {CURRENCIES.map((currency) => (
                <option key={currency}>{currency}</option>
              ))}
            </select>
          </Field>
          <Field>
            Invoice date
            <input
              type="date"
              value={values.issueDate}
              onChange={(event) => setField('issueDate', event.target.value)}
              {...errorProps('issueDate')}
            />
            <FieldError id="issueDate-error" message={errors.issueDate} />
          </Field>
          <Field>
            Terms
            <select value={values.paymentTerms} onChange={(event) => setField('paymentTerms', event.target.value as PaymentTerms)}>
              {PAYMENT_TERMS.map((terms) => (
                <option key={terms}>{terms}</option>
              ))}
            </select>
          </Field>
          <Field>
            Due date
            <input
              type="date"
              value={values.dueDate}
              onChange={(event) => setField('dueDate', event.target.value)}
              {...errorProps('dueDate')}
            />
            <FieldError id="dueDate-error" message={errors.dueDate} />
          </Field>
          <Field>
            Tax rate (%)
            <input
              type="number"
              step="0.1"
              min="0"
              value={values.taxPercent}
              disabled={locked}
              onChange={(event) => setField('taxPercent', event.target.value)}
              {...errorProps('taxRate')}
            />
            <FieldError id="taxRate-error" message={errors.taxRate} />
          </Field>
          <Field>
            Discount ({values.currency})
            <input
              type="number"
              min="0"
              value={values.discount}
              disabled={locked}
              onChange={(event) => setField('discount', event.target.value)}
              {...errorProps('discount')}
            />
            <FieldError id="discount-error" message={errors.discount} />
          </Field>
          <Field $wide>
            <span>
              Memo <Hint>· {values.memo.length}/250</Hint>
            </span>
            <input maxLength={250} value={values.memo} onChange={(event) => setField('memo', event.target.value)} {...errorProps('memo')} />
            <FieldError id="memo-error" message={errors.memo} />
          </Field>
        </FieldGrid>
      </Card>

      <Card>
        <CardTitle>Products</CardTitle>
        <FieldError id="lineItems-error" message={errors.lineItems} />
        <LineItemsEditor
          lines={values.lineItems}
          currency={values.currency}
          disabled={locked}
          errors={errors}
          onChange={form.setLine}
          onAdd={form.addLine}
          onRemove={form.removeLine}
        />
        <TotalsRow>
          <Totals>
            <dt>Subtotal</dt>
            <dd>{money(form.totals.subtotal)}</dd>
            <dt>Discount</dt>
            <dd>{form.totals.discount ? `−${money(form.totals.discount)}` : money(0)}</dd>
            <dt>Tax</dt>
            <dd>{money(form.totals.tax)}</dd>
            <dt>Total</dt>
            <dd>{money(form.totals.total)}</dd>
          </Totals>
        </TotalsRow>
      </Card>

      <Footer>
        <Button onClick={onCancel}>Cancel</Button>
        {invoice ? (
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        ) : (
          <>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save as draft'}
            </Button>
            <Button variant="primary" disabled={saving} onClick={() => void submit(true)}>
              {saving ? 'Saving…' : 'Save and send'}
            </Button>
          </>
        )}
      </Footer>
    </Form>
  )
}
