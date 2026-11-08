import type { LineDraft } from '../../hooks/useInvoiceForm'
import { REVENUE_ACCOUNTS } from '../../types/invoice'
import { lineAmount } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'

interface LineItemsEditorProp {
  lines: LineDraft[]
  currency: string
  disabled: boolean
  onChange: (key: string, field: 'description' | 'quantity' | 'unitPrice' | 'accountCode', value: string) => void
  onAdd: () => void
  onRemove: (key: string) => void
}

const amountOf = (line: LineDraft) => lineAmount({ quantity: Number(line.quantity) || 0, unitPrice: Number(line.unitPrice) || 0 })

export const LineItemsEditor = ({ lines, currency, disabled, onChange, onAdd, onRemove }: LineItemsEditorProp) => (
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
        {lines.map((line) => (
          <tr key={line.key}>
            <td>
              <input
                value={line.description}
                disabled={disabled}
                onChange={(event) => onChange(line.key, 'description', event.target.value)}
              />
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
              />
            </td>
            <td>
              <input
                type="number"
                step="0.001"
                value={line.unitPrice}
                disabled={disabled}
                onChange={(event) => onChange(line.key, 'unitPrice', event.target.value)}
              />
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
