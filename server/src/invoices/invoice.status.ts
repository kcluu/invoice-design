import type { Invoice, PaymentStatus } from './invoice.types';

// payment status is derived from status plus the due date so overdue never goes stale
export const derivePaymentStatus = (invoice: Pick<Invoice, 'status' | 'dueDate'>, asOfDate: string): PaymentStatus => {
  switch (invoice.status) {
    case 'Draft':
      return 'Unsent';
    case 'Paid':
      return 'Paid';
    case 'Void':
      return 'Voided';
    case 'Sent':
      return invoice.dueDate < asOfDate ? 'Overdue' : 'Open';
  }
};

export const withPaymentStatus = (invoice: Invoice, asOfDate: string): Invoice => ({
  ...invoice,
  paymentStatus: derivePaymentStatus(invoice, asOfDate),
});
