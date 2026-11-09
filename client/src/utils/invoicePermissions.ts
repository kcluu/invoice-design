import type { Invoice } from '../types/invoice';

// sent invoices keep their customer, money and products so posted revenue stays in sync
export const SENT_EDITABLE_FIELDS = ['issueDate', 'dueDate', 'paymentTerms', 'memo'] as const;

export const availableActions = (invoice: Pick<Invoice, 'status'>) => ({
  canEdit: invoice.status === 'Draft' || invoice.status === 'Sent',
  canSend: invoice.status === 'Draft',
  canRecordPayment: invoice.status === 'Sent',
  canVoid: invoice.status === 'Sent',
  // only drafts can be deleted, anything the customer has seen is voided instead so it stays on record
  canDelete: invoice.status === 'Draft',
  isLocked: invoice.status === 'Sent',
});
