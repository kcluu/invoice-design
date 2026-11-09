import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildInvoice } from '../test/factories';
import { useInvoiceFilters } from './useInvoiceFilters';

const AS_OF = '2026-05-04';

const invoices = [
  buildInvoice({ customerName: 'Acme Labs', dueDate: '2026-05-28', paymentStatus: 'Open' }),
  buildInvoice({ customerName: 'Brightline Health', status: 'Draft', paymentStatus: 'Unsent', dueDate: '2026-05-16' }),
  buildInvoice({ customerName: 'Juniper Supply Co.', dueDate: '2026-04-10', paymentStatus: 'Overdue' }),
  buildInvoice({ customerName: 'Pine Robotics', dueDate: '2026-05-10', paymentStatus: 'Open' }),
];

describe('useInvoiceFilters', () => {
  it('counts invoices per status', () => {
    const { result } = renderHook(() => useInvoiceFilters(invoices, AS_OF));
    expect(result.current.counts).toMatchObject({ all: 4, Draft: 1, Open: 2, Overdue: 1 });
  });

  it('groups outstanding, overdue, due soon and drafts', () => {
    const { result } = renderHook(() => useInvoiceFilters(invoices, AS_OF));
    expect(result.current.groups.outstanding).toHaveLength(3);
    expect(result.current.groups.overdue).toHaveLength(1);
    expect(result.current.groups.dueSoon.map((invoice) => invoice.customerName)).toEqual(['Pine Robotics']);
    expect(result.current.groups.drafts).toHaveLength(1);
  });

  it('filters outstanding invoices soonest due first', () => {
    const { result } = renderHook(() => useInvoiceFilters(invoices, AS_OF));
    act(() => result.current.setFilter('outstanding'));
    expect(result.current.visible.map((invoice) => invoice.customerName)).toEqual(['Juniper Supply Co.', 'Pine Robotics', 'Acme Labs']);
  });

  it('searches by customer or invoice number', () => {
    const { result } = renderHook(() => useInvoiceFilters(invoices, AS_OF));
    act(() => result.current.setQuery('bright'));
    expect(result.current.visible).toHaveLength(1);
  });
});
