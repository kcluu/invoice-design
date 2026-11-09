import { STATUS_TABS, type InvoiceFilter } from '../../hooks/useInvoiceFilters';
import type { DisplayStatus } from '../../types/invoice';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { Count, Tab, TabList } from './StatusTabs.styled';

interface StatusTabsProp {
  value: InvoiceFilter;
  counts: Record<'all' | DisplayStatus, number>;
  onChange: (filter: InvoiceFilter) => void;
}

export const StatusTabs = ({ value, counts, onChange }: StatusTabsProp) => (
  <TabList role="group" aria-label="Filter by status">
    {STATUS_TABS.map((tab) => {
      const active = tab.value === value;
      return (
        <Tab key={tab.value} type="button" aria-pressed={active} $active={active} onClick={() => onChange(tab.value)}>
          {tab.label}
          <Count $active={active}>
            <VisuallyHidden>(</VisuallyHidden>
            {counts[tab.value as 'all' | DisplayStatus]}
            <VisuallyHidden>)</VisuallyHidden>
          </Count>
        </Tab>
      );
    })}
  </TabList>
);
