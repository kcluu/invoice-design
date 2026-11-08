import { useInvoiceForm, type InvoiceFormValues } from '../../hooks/useInvoiceForm'
import { useSaveInvoice } from '../../hooks/useSaveInvoice'
import { CURRENCIES, PAYMENT_TERMS, type Invoice, type PaymentTerms } from '../../types/invoice'
import type { CustomerProfile } from '../../utils/customers'
import { availableActions } from '../../utils/invoicePermissions'
import { formatMoney } from '../../utils/money'
import { ErrorSummary } from '../ErrorSummary/ErrorSummary'
import { FieldError } from '../FieldError/FieldError'
import { LineItemsEditor } from '../LineItemsEditor/LineItemsEditor'

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
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void submit(false)
      }}
    >
      <h1>{invoice ? `Edit ${invoice.invoiceNumber}` : 'New invoice'}</h1>
      {locked && (
        <p>This invoice was already sent. You can change the dates, terms and memo. Void and reissue it to change anything else.</p>
      )}
      {error && <p role="alert">{error}</p>}
      <ErrorSummary messages={form.errorSummary} />

      <fieldset>
        <legend>Details</legend>
        <label>
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
        </label>
        <label>
          Billing email
          <input
            type="email"
            value={values.billingEmail}
            disabled={locked}
            onChange={(event) => setField('billingEmail', event.target.value)}
            {...errorProps('billingEmail')}
          />
          <FieldError id="billingEmail-error" message={errors.billingEmail} />
        </label>
        <label>
          Billing address
          <input value={values.billingAddress} disabled={locked} onChange={(event) => setField('billingAddress', event.target.value)} />
        </label>
        <label>
          Currency
          <select value={values.currency} disabled={locked} onChange={(event) => setField('currency', event.target.value)}>
            {CURRENCIES.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </label>
        <label>
          Invoice date
          <input
            type="date"
            value={values.issueDate}
            onChange={(event) => setField('issueDate', event.target.value)}
            {...errorProps('issueDate')}
          />
          <FieldError id="issueDate-error" message={errors.issueDate} />
        </label>
        <label>
          Terms
          <select value={values.paymentTerms} onChange={(event) => setField('paymentTerms', event.target.value as PaymentTerms)}>
            {PAYMENT_TERMS.map((terms) => (
              <option key={terms}>{terms}</option>
            ))}
          </select>
        </label>
        <label>
          Due date
          <input
            type="date"
            value={values.dueDate}
            onChange={(event) => setField('dueDate', event.target.value)}
            {...errorProps('dueDate')}
          />
          <FieldError id="dueDate-error" message={errors.dueDate} />
        </label>
        <label>
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
        </label>
        <label>
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
        </label>
        <label>
          Memo
          <input maxLength={250} value={values.memo} onChange={(event) => setField('memo', event.target.value)} {...errorProps('memo')} />
          <FieldError id="memo-error" message={errors.memo} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Products</legend>
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
      </fieldset>

      <dl>
        <dt>Subtotal</dt>
        <dd>{money(form.totals.subtotal)}</dd>
        <dt>Discount</dt>
        <dd>{money(-form.totals.discount)}</dd>
        <dt>Tax</dt>
        <dd>{money(form.totals.tax)}</dd>
        <dt>Total</dt>
        <dd>{money(form.totals.total)}</dd>
      </dl>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      {invoice ? (
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      ) : (
        <>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save as draft'}
          </button>
          <button type="button" disabled={saving} onClick={() => void submit(true)}>
            {saving ? 'Saving…' : 'Save and send'}
          </button>
        </>
      )}
    </form>
  )
}
