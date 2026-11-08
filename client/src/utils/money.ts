export const formatMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

// unit prices can be fractions of a cent, e.g. $0.012 per event
export const formatUnitPrice = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(
      amount
    )
  } catch {
    return `${currency} ${amount}`
  }
}

export const formatQuantity = (quantity: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(quantity)

export const formatPercent = (rate: number) => `${Number((rate * 100).toFixed(2))}%`

// several currencies can't be added together, so list a total per currency
export const formatMoneyByCurrency = (amounts: Array<{ amount: number; currency: string }>, fallbackCurrency = 'USD') => {
  const totals = new Map<string, number>()
  for (const { amount, currency } of amounts) totals.set(currency, (totals.get(currency) ?? 0) + amount)
  if (!totals.size) return formatMoney(0, fallbackCurrency)
  return [...totals].map(([currency, amount]) => formatMoney(amount, currency)).join(' + ')
}
