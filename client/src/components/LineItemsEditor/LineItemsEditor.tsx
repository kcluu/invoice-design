import type { LineDraft } from '../../hooks/useInvoiceForm'
import { REVENUE_ACCOUNTS, type FieldErrors } from '../../types/invoice'
import { lineAmount } from '../../utils/invoiceTotals'
import { formatMoney } from '../../utils/money'
import { Button } from '../Button/Button'
import { FieldError } from '../FieldError/FieldError'
import { AddRow, Amount, RemoveButton, Table, TableScroll, Td, Th, Wrap } from './LineItemsEditor.styled'

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
    <Wrap>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>Description</Th>
              <Th $width="150px">Revenue account</Th>
              <Th $width="110px">Qty</Th>
              <Th $width="130px">Unit price</Th>
              <Th $width="130px" $align="right">
                Amount
              </Th>
              <Th $width="48px" />
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={line.key}>
                <Td>
                  <input
                    value={line.description}
                    disabled={disabled}
                    placeholder="Product or service"
                    onChange={(event) => onChange(line.key, 'description', event.target.value)}
                    {...fieldProps(index, 'description')}
                  />
                  {errorFor(index, 'description')}
                </Td>
                <Td>
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
                </Td>
                <Td>
                  <input
                    type="number"
                    value={line.quantity}
                    disabled={disabled}
                    onChange={(event) => onChange(line.key, 'quantity', event.target.value)}
                    {...fieldProps(index, 'quantity')}
                  />
                  {errorFor(index, 'quantity')}
                </Td>
                <Td>
                  <input
                    type="number"
                    step="0.001"
                    value={line.unitPrice}
                    disabled={disabled}
                    onChange={(event) => onChange(line.key, 'unitPrice', event.target.value)}
                    {...fieldProps(index, 'unitPrice')}
                  />
                  {errorFor(index, 'unitPrice')}
                </Td>
                <Td $align="right">
                  <Amount>{formatMoney(amountOf(line), currency)}</Amount>
                </Td>
                <Td>
                  {!disabled && lines.length > 1 && (
                    <RemoveButton type="button" title="Remove" onClick={() => onRemove(line.key)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </RemoveButton>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>
      {!disabled && (
        <AddRow>
          <Button size="sm" onClick={onAdd}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add product
          </Button>
        </AddRow>
      )}
    </Wrap>
  )
}
