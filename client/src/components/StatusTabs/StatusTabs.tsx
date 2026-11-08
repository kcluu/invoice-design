import { STATUS_TABS, type InvoiceFilter } from '../../hooks/useInvoiceFilters'
import type { DisplayStatus } from '../../types/invoice'

interface StatusTabsProp {
  value: InvoiceFilter
  counts: Record<'all' | DisplayStatus, number>
  onChange: (filter: InvoiceFilter) => void
}

export const StatusTabs = ({ value, counts, onChange }: StatusTabsProp) => (
  <div>
    {STATUS_TABS.map((tab) => (
      <button key={tab.value} type="button" onClick={() => onChange(tab.value)} disabled={tab.value === value}>
        {tab.label} ({counts[tab.value as 'all' | DisplayStatus]})
      </button>
    ))}
  </div>
)
