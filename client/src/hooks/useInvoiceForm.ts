import { useCallback, useMemo, useState } from 'react'
import type { FieldErrors, Invoice, InvoiceInput, PaymentTerms } from '../types/invoice'
import type { CustomerProfile } from '../utils/customers'
import { addDays, TERM_DAYS } from '../utils/dates'
import { computeTotals } from '../utils/invoiceTotals'
import { summarizeErrors, validateInvoiceForm } from '../utils/validateInvoiceForm'

// inputs hold strings so a half-typed number like "0." doesn't get mangled
export interface LineDraft {
  key: string
  id?: string
  description: string
  quantity: string
  unitPrice: string
  accountCode: string
}

export interface InvoiceFormValues {
  customerName: string
  billingEmail: string
  billingAddress: string
  paymentTerms: PaymentTerms
  currency: string
  issueDate: string
  dueDate: string
  memo: string
  taxPercent: string
  discount: string
  lineItems: LineDraft[]
}

type FieldKey = Exclude<keyof InvoiceFormValues, 'lineItems'>
type LineField = Exclude<keyof LineDraft, 'key' | 'id'>

let lineKey = 0
const nextKey = () => `line-${++lineKey}`

export const emptyLine = (overrides: Partial<LineDraft> = {}): LineDraft => ({
  key: nextKey(),
  description: '',
  quantity: '1',
  unitPrice: '',
  accountCode: '4000',
  ...overrides,
})

const percentOf = (rate: number) => String(Number((rate * 100).toFixed(3)))

export const emptyForm = (asOfDate: string): InvoiceFormValues => ({
  customerName: '',
  billingEmail: '',
  billingAddress: '',
  paymentTerms: 'Net 30',
  currency: 'USD',
  issueDate: asOfDate,
  dueDate: addDays(asOfDate, TERM_DAYS['Net 30']),
  memo: '',
  taxPercent: '0',
  discount: '0',
  lineItems: [emptyLine()],
})

export const formFromInput = (input: InvoiceInput): InvoiceFormValues => ({
  customerName: input.customerName,
  billingEmail: input.billingEmail,
  billingAddress: input.billingAddress,
  paymentTerms: input.paymentTerms,
  currency: input.currency,
  issueDate: input.issueDate,
  dueDate: input.dueDate,
  memo: input.memo,
  taxPercent: percentOf(input.taxRate),
  discount: String(input.discount),
  lineItems: input.lineItems.length
    ? input.lineItems.map((line) =>
        emptyLine({
          id: line.id,
          description: line.description,
          quantity: String(line.quantity),
          unitPrice: String(line.unitPrice),
          accountCode: line.accountCode,
        })
      )
    : [emptyLine()],
})

export const formFromInvoice = (invoice: Invoice): InvoiceFormValues => formFromInput(invoice)

// a blank field stays not-a-number so validation can tell empty apart from a real 0
export const parseNumber = (value: string) => (value.trim() === '' ? Number.NaN : Number(value.replace(/,/g, '')))

export const toInvoiceInput = (values: InvoiceFormValues): InvoiceInput => ({
  customerName: values.customerName.trim(),
  billingEmail: values.billingEmail.trim(),
  billingAddress: values.billingAddress.trim(),
  paymentTerms: values.paymentTerms,
  currency: values.currency,
  issueDate: values.issueDate,
  dueDate: values.dueDate,
  memo: values.memo.trim(),
  taxRate: Number((parseNumber(values.taxPercent) / 100).toFixed(4)),
  discount: parseNumber(values.discount),
  lineItems: values.lineItems.map((line) => ({
    ...(line.id ? { id: line.id } : {}),
    description: line.description.trim(),
    quantity: parseNumber(line.quantity),
    unitPrice: parseNumber(line.unitPrice),
    accountCode: line.accountCode,
  })),
})

const safe = (value: number) => (Number.isFinite(value) ? value : 0)

interface UseInvoiceFormOptions {
  initialValues: InvoiceFormValues
  customers: CustomerProfile[]
}

export const useInvoiceForm = ({ initialValues, customers }: UseInvoiceFormOptions) => {
  const [values, setRawValues] = useState<InvoiceFormValues>(initialValues)
  // errors stay hidden until the first save attempt, then update live as fields are fixed
  const [showErrors, setShowErrors] = useState(false)
  const [serverErrors, setServerErrors] = useState<FieldErrors>({})

  // any edit makes the last server response stale
  const setValues = useCallback((update: (current: InvoiceFormValues) => InvoiceFormValues) => {
    setServerErrors((current) => (Object.keys(current).length ? {} : current))
    setRawValues(update)
  }, [])

  const setField = useCallback(
    <K extends FieldKey>(key: K, value: InvoiceFormValues[K]) => {
      setValues((current) => {
        const next = { ...current, [key]: value }

        // picking a known customer fills in their usual billing details
        if (key === 'customerName') {
          const customer = customers.find((item) => item.name === value)
          if (customer) {
            next.billingEmail = customer.email
            next.billingAddress = customer.address
            next.currency = customer.currency
            next.paymentTerms = customer.paymentTerms
            next.taxPercent = percentOf(customer.taxRate)
          }
        }

        // recalculate the due date when the terms or invoice date move, a hand-picked date sticks otherwise
        if (key === 'customerName' || key === 'paymentTerms' || key === 'issueDate') {
          if (next.issueDate) next.dueDate = addDays(next.issueDate, TERM_DAYS[next.paymentTerms])
        }
        return next
      })
    },
    [customers, setValues]
  )

  const setLine = useCallback(
    (key: string, field: LineField, value: string) => {
      setValues((current) => ({
        ...current,
        lineItems: current.lineItems.map((line) => (line.key === key ? { ...line, [field]: value } : line)),
      }))
    },
    [setValues]
  )

  const addLine = useCallback(() => {
    setValues((current) => ({ ...current, lineItems: [...current.lineItems, emptyLine()] }))
  }, [setValues])

  const removeLine = useCallback(
    (key: string) => {
      setValues((current) => ({ ...current, lineItems: current.lineItems.filter((line) => line.key !== key) }))
    },
    [setValues]
  )

  const clientErrors = useMemo(() => validateInvoiceForm(values), [values])
  const errors = useMemo<FieldErrors>(
    () => (showErrors ? { ...serverErrors, ...clientErrors } : {}),
    [showErrors, serverErrors, clientErrors]
  )

  // returns true when the form is ready to send to the api
  const validate = useCallback(() => {
    setShowErrors(true)
    return Object.keys(clientErrors).length === 0
  }, [clientErrors])

  const applyServerErrors = useCallback((fields: FieldErrors) => {
    setServerErrors(fields)
    setShowErrors(true)
  }, [])

  const input = useMemo(() => toInvoiceInput(values), [values])

  const totals = useMemo(
    () =>
      computeTotals({
        discount: safe(input.discount),
        taxRate: safe(input.taxRate),
        lineItems: input.lineItems.map((line) => ({ ...line, quantity: safe(line.quantity), unitPrice: safe(line.unitPrice) })),
      }),
    [input]
  )

  return {
    values,
    setValues,
    setField,
    setLine,
    addLine,
    removeLine,
    input,
    totals,
    errors,
    errorSummary: summarizeErrors(errors),
    validate,
    applyServerErrors,
  }
}
