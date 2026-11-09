import type { InvoiceFormValues } from '../hooks/useInvoiceForm';
import type { FieldErrors } from '../types/invoice';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABELS: Record<string, string> = {
  customerName: 'Customer',
  billingEmail: 'Billing email',
  billingAddress: 'Billing address',
  currency: 'Currency',
  paymentTerms: 'Terms',
  issueDate: 'Invoice date',
  dueDate: 'Due date',
  taxRate: 'Tax rate',
  discount: 'Discount',
  memo: 'Memo',
  lineItems: 'Products',
};

const LINE_FIELD_LABELS: Record<string, string> = {
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unit price',
  accountCode: 'revenue account',
};

const num = (value: string) => (value.trim() === '' ? Number.NaN : Number(value.replace(/,/g, '')));

// same rules as the api, checked here so people get feedback before a round trip
export const validateInvoiceForm = (values: InvoiceFormValues): FieldErrors => {
  const errors: FieldErrors = {};
  const email = values.billingEmail.trim();

  if (!values.customerName.trim()) errors.customerName = 'Choose or enter a customer.';
  if (!email) errors.billingEmail = 'Add a billing email so the invoice can be sent.';
  else if (!EMAIL_PATTERN.test(email)) errors.billingEmail = 'Enter a valid email address, like ap@company.com.';
  if (!values.issueDate) errors.issueDate = 'Choose an invoice date.';
  if (!values.dueDate) errors.dueDate = 'Choose a due date.';
  else if (values.issueDate && values.dueDate < values.issueDate) errors.dueDate = "The due date can't be before the invoice date.";

  const tax = num(values.taxPercent);
  if (!Number.isFinite(tax) || tax < 0 || tax > 100) errors.taxRate = 'Enter a tax rate between 0 and 100.';

  if (values.memo.trim().length > 250) errors.memo = 'Keep the memo to 250 characters or fewer.';

  if (!values.lineItems.length) errors.lineItems = 'Add at least one product line.';
  let subtotal = 0;
  values.lineItems.forEach((line, index) => {
    const quantity = num(line.quantity);
    const unitPrice = num(line.unitPrice);
    if (!line.description.trim()) errors[`lineItems.${index}.description`] = 'Add a description.';
    if (!(quantity > 0)) errors[`lineItems.${index}.quantity`] = 'Enter a quantity above 0.';
    if (!Number.isFinite(unitPrice) || unitPrice < 0) errors[`lineItems.${index}.unitPrice`] = 'Enter a unit price of 0 or more.';
    if (quantity > 0 && unitPrice >= 0) subtotal += quantity * unitPrice;
  });

  const discount = num(values.discount);
  if (!Number.isFinite(discount) || discount < 0) errors.discount = 'Enter a discount of 0 or more.';
  else if (discount > subtotal && subtotal > 0) errors.discount = "The discount can't be more than the subtotal.";

  return errors;
};

export const labelForField = (key: string) => {
  const line = key.match(/^lineItems\.(\d+)\.(\w+)$/);
  if (line) return `Product line ${Number(line[1]) + 1} ${LINE_FIELD_LABELS[line[2]] ?? line[2]}`;
  return FIELD_LABELS[key] ?? key;
};

// one readable line per error for the summary at the top of the form
export const summarizeErrors = (errors: FieldErrors) =>
  Object.entries(errors).map(([key, message]) => ({
    key,
    text: `${labelForField(key)}: ${message.charAt(0).toLowerCase()}${message.slice(1)}`,
  }));
