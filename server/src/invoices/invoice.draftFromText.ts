import { addDays } from './invoice.dates'
import { PAYMENT_TERMS, type Invoice, type InvoiceInput, type PaymentTerms } from './invoice.types'

export interface DraftResult {
  draft: InvoiceInput
  // things a person should check before the draft is saved or sent
  needsReview: string[]
  // which fields were read straight from the text rather than defaulted
  filledFields: Array<keyof InvoiceInput>
}

interface DraftContext {
  invoices: Invoice[]
  asOfDate: string
}

const TERM_DAYS: Record<PaymentTerms, number> = { 'Due on receipt': 0, 'Net 15': 15, 'Net 30': 30, 'Net 45': 45, 'Net 60': 60 }

const toNumber = (value: string) => Number(value.replace(/,/g, ''))

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const latestFor = (invoices: Invoice[], customerName: string) =>
  invoices.filter((invoice) => invoice.customerName === customerName).sort((a, b) => b.issueDate.localeCompare(a.issueDate))[0]

// first pass at turning a billing request into a draft, rule based for now so it is predictable and testable
// the result shape is what an llm-backed version would return too
export const draftFromText = (text: string, { invoices, asOfDate }: DraftContext): DraftResult => {
  const lower = text.toLowerCase()
  const needsReview: string[] = []
  const filled = new Set<keyof InvoiceInput>()

  // customer: match against people we've billed before
  const customerNames = [...new Set(invoices.map((invoice) => invoice.customerName))]
  const customerName = customerNames.find((name) => lower.includes(name.toLowerCase()))
  const previous = customerName ? latestFor(invoices, customerName) : undefined
  if (customerName) filled.add('customerName')
  else needsReview.push('Couldn’t match a customer. Pick one before saving.')

  // terms: explicit "net 30" or "due on receipt", otherwise the customer's usual terms
  let paymentTerms: PaymentTerms = previous?.paymentTerms ?? 'Net 30'
  const net = lower.match(/net\s?(\d+)/)
  const namedTerms = net ? PAYMENT_TERMS.find((terms) => terms === `Net ${net[1]}`) : undefined
  if (namedTerms || lower.includes('due on receipt')) {
    paymentTerms = namedTerms ?? 'Due on receipt'
    filled.add('paymentTerms')
    filled.add('dueDate')
  } else {
    needsReview.push(`Terms weren’t stated. Used ${previous ? `${customerName}’s usual ` : ''}${paymentTerms}.`)
  }

  // line items
  const lineItems: InvoiceInput['lineItems'] = []
  const subscription = text.match(/subscription[^$]{0,40}\$([\d,]+(?:\.\d+)?)/i)
  if (subscription) {
    lineItems.push({ description: 'Platform subscription', quantity: 1, unitPrice: toNumber(subscription[1]), accountCode: '4000' })
  }
  const quantityPattern = /(\d[\d,]*)\s+(hours?|hrs?|billable events|events)(?:\s+of\s+([a-z ]+?))?\s+at\s+\$([\d.,]+)/gi
  for (const match of text.matchAll(quantityPattern)) {
    const [, quantity, unit, what, price] = match
    const isUsage = unit.toLowerCase().includes('event')
    const description = isUsage
      ? 'Usage overage: event volume'
      : what
        ? capitalise(what.trim())
        : lower.includes('implementation')
          ? 'Implementation services'
          : 'Professional services'
    lineItems.push({ description, quantity: toNumber(quantity), unitPrice: toNumber(price), accountCode: isUsage ? '4010' : '4100' })
  }
  if (lineItems.length) filled.add('lineItems')
  else needsReview.push('No products or amounts were found. Add line items by hand.')

  // discount: "the usual discount" means whatever this customer got last time
  let discount = 0
  if (lower.includes('discount')) {
    const prior = customerName
      ? invoices
          .filter((invoice) => invoice.customerName === customerName && invoice.discount > 0)
          .sort((a, b) => b.issueDate.localeCompare(a.issueDate))[0]
      : undefined
    if (prior) {
      discount = prior.discount
      filled.add('discount')
      needsReview.push(`Applied the usual discount of ${prior.discount} ${prior.currency} from ${prior.invoiceNumber}. Confirm the amount.`)
    } else {
      needsReview.push('A discount was mentioned but there’s no earlier discount to copy. Enter it by hand.')
    }
  }

  // tax: default to the customer's rate unless the request says it's unclear
  let taxRate = previous?.taxRate ?? 0
  if (/not sure.*tax|whether tax|tax.*(unsure|unclear)/.test(lower)) {
    taxRate = 0
    needsReview.push(
      `Tax was unclear, so it’s set to 0%.${previous ? ` ${customerName}’s last invoice used ${Number((previous.taxRate * 100).toFixed(2))}%.` : ''} Confirm before sending.`
    )
  }

  // memo: "add a memo that this covers ..." wins, otherwise describe the work
  let memo = ''
  const memoMatch = text.match(/memo (?:that |saying )?(?:this )?(?:covers |is for )?(.+?)\.?$/i)
  if (memoMatch) {
    memo = `${capitalise(memoMatch[1].trim())}.`
    filled.add('memo')
  } else if (lineItems.length) {
    memo = `${lineItems.map((line) => line.description).join(', ')}.`
  }

  const issueDate = asOfDate
  return {
    draft: {
      customerName: customerName ?? '',
      billingEmail: previous?.billingEmail ?? '',
      billingAddress: previous?.billingAddress ?? '',
      paymentTerms,
      currency: previous?.currency ?? 'USD',
      issueDate,
      dueDate: addDays(issueDate, TERM_DAYS[paymentTerms]),
      memo: memo.slice(0, 250),
      taxRate,
      discount,
      lineItems,
    },
    needsReview,
    filledFields: [...filled],
  }
}
