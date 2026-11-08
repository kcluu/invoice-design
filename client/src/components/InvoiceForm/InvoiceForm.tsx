import { useState } from 'react'
import { useFocusOnReady } from '../../hooks/useFocusOnReady'
import { useInvoiceForm, type InvoiceFormValues } from '../../hooks/useInvoiceForm'
import { useSaveInvoice } from '../../hooks/useSaveInvoice'
import { CURRENCIES, PAYMENT_TERMS, type Invoice, type PaymentTerms } from '../../types/invoice'
import type { CustomerProfile } from '../../utils/customers'
import { fieldId } from '../../utils/fieldId'
import { availableActions } from '../../utils/invoicePermissions'
import { formatMoney } from '../../utils/money'
import { Button } from '../Button/Button'
import { ErrorSummary } from '../ErrorSummary/ErrorSummary'
import { FieldError } from '../FieldError/FieldError'
import { LineItemsEditor } from '../LineItemsEditor/LineItemsEditor'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
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
  Required,
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

  // counts failed save attempts so the error summary can take focus each time
  const [failedAttempts, setFailedAttempts] = useState(0)

  // ties an input to its id, required state, hint and inline error
  const fieldProps = (key: string, { required = false, hintId }: { required?: boolean; hintId?: string } = {}) => ({
    id: fieldId(key),
    'aria-required': required || undefined,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': [errors[key] ? `${key}-error` : null, hintId].filter(Boolean).join(' ') || undefined,
  })

  const submit = async (send: boolean) => {
    if (saving) return
    if (!form.validate()) {
      setFailedAttempts((count) => count + 1)
      return
    }
    const result = invoice
      ? await save({ mode: 'edit', invoice, input: form.input })
      : await save({ mode: 'create', input: form.input, send })
    if (result.ok) {
      onSaved(result.invoice)
      return
    }
    form.applyServerErrors(result.fieldErrors)
    if (Object.keys(result.fieldErrors).length) setFailedAttempts((count) => count + 1)
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

      <Hint>
        Fields marked <Required aria-hidden="true">*</Required>
        <VisuallyHidden>with an asterisk</VisuallyHidden> are required.
      </Hint>

      {locked && (
        <Note>
          This invoice was already sent. You can change the dates, terms and memo. Customer, currency, tax and products are locked so posted
          revenue stays in sync. Void and reissue it to change them.
        </Note>
      )}
      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
      <ErrorSummary
        items={form.errorSummary}
        focusSignal={failedAttempts}
        onSelect={(key) => document.getElementById(fieldId(key))?.focus()}
      />

      <Card>
        <CardTitle>Details</CardTitle>
        <FieldGrid>
          <Field>
            <span>
              Customer <Required aria-hidden="true">*</Required>
            </span>
            <input
              list="customer-options"
              value={values.customerName}
              disabled={locked}
              onChange={(event) => setField('customerName', event.target.value)}
              {...fieldProps('customerName', { required: true })}
            />
            <datalist id="customer-options">
              {customers.map((customer) => (
                <option key={customer.name} value={customer.name} />
              ))}
            </datalist>
            <FieldError id="customerName-error" message={errors.customerName} />
          </Field>
          <Field>
            <span>
              Billing email <Required aria-hidden="true">*</Required>
            </span>
            <input
              type="email"
              value={values.billingEmail}
              disabled={locked}
              onChange={(event) => setField('billingEmail', event.target.value)}
              {...fieldProps('billingEmail', { required: true })}
            />
            <FieldError id="billingEmail-error" message={errors.billingEmail} />
          </Field>
          <Field>
            Billing address
            <input
              id={fieldId('billingAddress')}
              value={values.billingAddress}
              disabled={locked}
              onChange={(event) => setField('billingAddress', event.target.value)}
            />
          </Field>
          <Field>
            Currency
            <select
              id={fieldId('currency')}
              value={values.currency}
              disabled={locked}
              onChange={(event) => setField('currency', event.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency}>{currency}</option>
              ))}
            </select>
          </Field>
          <Field>
            <span>
              Invoice date <Required aria-hidden="true">*</Required>
            </span>
            <input
              type="date"
              value={values.issueDate}
              onChange={(event) => setField('issueDate', event.target.value)}
              {...fieldProps('issueDate', { required: true })}
            />
            <FieldError id="issueDate-error" message={errors.issueDate} />
          </Field>
          <Field>
            Terms
            <select
              id={fieldId('paymentTerms')}
              value={values.paymentTerms}
              onChange={(event) => setField('paymentTerms', event.target.value as PaymentTerms)}
            >
              {PAYMENT_TERMS.map((terms) => (
                <option key={terms}>{terms}</option>
              ))}
            </select>
          </Field>
          <Field>
            <span>
              Due date <Required aria-hidden="true">*</Required>
            </span>
            <input
              type="date"
              value={values.dueDate}
              onChange={(event) => setField('dueDate', event.target.value)}
              {...fieldProps('dueDate', { required: true })}
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
              {...fieldProps('taxRate')}
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
              {...fieldProps('discount')}
            />
            <FieldError id="discount-error" message={errors.discount} />
          </Field>
          <Field $wide>
            <span>
              Memo <Hint id="memo-count">· {values.memo.length}/250 characters</Hint>
            </span>
            <input
              maxLength={250}
              value={values.memo}
              onChange={(event) => setField('memo', event.target.value)}
              {...fieldProps('memo', { hintId: 'memo-count' })}
            />
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
