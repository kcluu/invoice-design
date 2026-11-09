import { describe, expect, it } from 'vitest';
import { buildInvoice } from '../test/factories';
import { displayStatus, dueInfo } from './invoiceStatus';

const AS_OF = '2026-05-04';

describe('displayStatus', () => {
  it('maps payment status to what the list shows', () => {
    expect(displayStatus(buildInvoice({ status: 'Draft', paymentStatus: 'Unsent' }))).toBe('Draft');
    expect(displayStatus(buildInvoice({ paymentStatus: 'Open' }))).toBe('Open');
    expect(displayStatus(buildInvoice({ paymentStatus: 'Overdue' }))).toBe('Overdue');
    expect(displayStatus(buildInvoice({ status: 'Paid', paymentStatus: 'Paid' }))).toBe('Paid');
    expect(displayStatus(buildInvoice({ status: 'Void', paymentStatus: 'Voided' }))).toBe('Void');
  });
});

describe('dueInfo', () => {
  it('counts days overdue', () => {
    const info = dueInfo(buildInvoice({ dueDate: '2026-04-10', paymentStatus: 'Overdue' }), AS_OF);
    expect(info.label).toBe('24 days overdue');
    expect(info.tone).toBe('late');
  });

  it('flags invoices due within two weeks', () => {
    const info = dueInfo(buildInvoice({ dueDate: '2026-05-16' }), AS_OF);
    expect(info.label).toBe('Due in 12 days');
    expect(info.isDueSoon).toBe(true);
  });

  it('says due today on the due date', () => {
    expect(dueInfo(buildInvoice({ dueDate: AS_OF }), AS_OF).label).toBe('Due today');
  });

  it('shows the date when it is further out', () => {
    const info = dueInfo(buildInvoice({ dueDate: '2026-05-28' }), AS_OF);
    expect(info.label).toBe('May 28, 2026');
    expect(info.isDueSoon).toBe(false);
  });

  it('shows the paid date for paid invoices', () => {
    const info = dueInfo(buildInvoice({ status: 'Paid', paymentStatus: 'Paid', paidDate: '2026-04-24' }), AS_OF);
    expect(info.label).toBe('Paid Apr 24, 2026');
  });
});
