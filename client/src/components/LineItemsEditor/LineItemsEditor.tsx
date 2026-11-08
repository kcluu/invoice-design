import type { LineDraft } from '../../hooks/useInvoiceForm'
import { REVENUE_ACCOUNTS, type FieldErrors } from '../../types/invoice'
import { lineAmount } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'
import { FieldError } from '../FieldError/FieldError'

type LineField = 'description' | 'quantity' | 'unitPrice' | 'accountCode'

interface LineItemsEditorProp {
  lines: LineDraft[]
  currency: string
  disabled: boolean
  errors: FieldErrors
  onChange: (key: string, field: LineField, value: string) => void
  onAdd: () => void
  onRemove: (key: string) => void
}

const amountOf = (line: LineDraft) => lineAmount({ quantity: Number(line.quantity) || 0, unitPrice: Number(line.unitPrice) || 0 })

export const LineItemsEditor = ({ lines, currency, disabled, errors, onChange, onAdd, onRemove }: LineItemsEditorProp) => {
  // server and client both key line errors by line position and field name
  const fieldProps = (index: number, field: LineField) => {
    const key = `lineItems.${index}.${field}`
    return {
      'aria-invalid': errors[key] ? true : undefined,
      'aria-describedby': errors[key] ? `${key}-error` : undefined,
    }
  }
  const errorFor = (index: number, field: LineField) => {
    const key = `lineItems.${index}.${field}`
    return <FieldError id={`${key}-error`} message={errors[key]} />
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Revenue account</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr key={line.key}>
              <td>
                <input
                  value={line.description}
                  disabled={disabled}
                  onChange={(event) => onChange(line.key, 'description', event.target.value)}
                  {...fieldProps(index, 'description')}
                />
                {errorFor(index, 'description')}
              </td>
              <td>
                <select
                  value={line.accountCode}
                  disabled={disabled}
                  onChange={(event) => onChange(line.key, 'accountCode', event.target.value)}
                >
                  {REVENUE_ACCOUNTS.map((account) => (
                    <option key={account.code} value={account.code}>
                      {account.code} {account.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={line.quantity}
                  disabled={disabled}
                  onChange={(event) => onChange(line.key, 'quantity', event.target.value)}
                  {...fieldProps(index, 'quantity')}
                />
                {errorFor(index, 'quantity')}
              </td>
              <td>
                <input
                  type="number"
                  step="0.001"
                  value={line.unitPrice}
                  disabled={disabled}
                  onChange={(event) => onChange(line.key, 'unitPrice', event.target.value)}
                  {...fieldProps(index, 'unitPrice')}
                />
                {errorFor(index, 'unitPrice')}
              </td>
              <td>{formatMoney(amountOf(line), currency)}</td>
              <td>
                {!disabled && lines.length > 1 && (
                  <button type="button" onClick={() => onRemove(line.key)}>
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!disabled && (
        <button type="button" onClick={onAdd}>
          Add product
        </button>
      )}
    </div>
  )
}
