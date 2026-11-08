import { useInvoiceForm, type InvoiceFormValues } from '../../hooks/useInvoiceForm'
import { useSaveInvoice } from '../../hooks/useSaveInvoice'
import { CURRENCIES, PAYMENT_TERMS, type Invoice, type PaymentTerms } from '../../types/invoice'
import type { CustomerProfile } from '../../utils/customers'
import { availableActions } from '../../utils/invoicePermissions'
import { formatMoney } from '../../utils/money'
import { LineItemsEditor } from '../LineItemsEditor/LineItemsEditor'

interface InvoiceFormProp {
  invoice: Invoice | null
  initialValues: InvoiceFormValues
  customers: CustomerProfile[]
  onSaved: (invoice: Invoice) => void
  onCancel: () => void
}

export const InvoiceForm = ({ invoice, initialValues, customers, onSaved, onCancel }: InvoiceFormProp) => {
  const { values, setField, setLine, addLine, removeLine, input, totals } = useInvoiceForm({ initialValues, customers })
  const { save, saving, error } = useSaveInvoice()
  const locked = invoice ? availableActions(invoice).isLocked : false
  const money = (amount: number) => formatMoney(amount, values.currency)

  const submit = async (send: boolean) => {
    const saved = invoice ? await save({ mode: 'edit', invoice, input }) : await save({ mode: 'create', input, send })
    if (saved) onSaved(saved)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit(false)
      }}
    >
      <h1>{invoice ? `Edit ${invoice.invoiceNumber}` : 'New invoice'}</h1>
      {locked && (
        <p>This invoice was already sent. You can change the dates, terms and memo. Void and reissue it to change anything else.</p>
      )}
      {error && <p>{error}</p>}

      <fieldset>
        <legend>Details</legend>
        <label>
          Customer
          <input
            list="customer-options"
            value={values.customerName}
            disabled={locked}
            onChange={(event) => setField('customerName', event.target.value)}
          />
          <datalist id="customer-options">
            {customers.map((customer) => (
              <option key={customer.name} value={customer.name} />
            ))}
          </datalist>
        </label>
        <label>
          Billing email
          <input
            type="email"
            value={values.billingEmail}
            disabled={locked}
            onChange={(event) => setField('billingEmail', event.target.value)}
          />
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
          <input type="date" value={values.issueDate} onChange={(event) => setField('issueDate', event.target.value)} />
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
          <input type="date" value={values.dueDate} onChange={(event) => setField('dueDate', event.target.value)} />
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
          />
        </label>
        <label>
          Discount ({values.currency})
          <input
            type="number"
            min="0"
            value={values.discount}
            disabled={locked}
            onChange={(event) => setField('discount', event.target.value)}
          />
        </label>
        <label>
          Memo
          <input maxLength={250} value={values.memo} onChange={(event) => setField('memo', event.target.value)} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Products</legend>
        <LineItemsEditor
          lines={values.lineItems}
          currency={values.currency}
          disabled={locked}
          onChange={setLine}
          onAdd={addLine}
          onRemove={removeLine}
        />
      </fieldset>

      <dl>
        <dt>Subtotal</dt>
        <dd>{money(totals.subtotal)}</dd>
        <dt>Discount</dt>
        <dd>{money(-totals.discount)}</dd>
        <dt>Tax</dt>
        <dd>{money(totals.tax)}</dd>
        <dt>Total</dt>
        <dd>{money(totals.total)}</dd>
      </dl>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      {invoice ? (
        <button type="submit" disabled={saving}>
          Save changes
        </button>
      ) : (
        <>
          <button type="submit" disabled={saving}>
            Save as draft
          </button>
          <button type="button" disabled={saving} onClick={() => void submit(true)}>
            Save and send
          </button>
        </>
      )}
    </form>
  )
}
