import { z } from 'zod';
import { subtotalOf } from './invoice.totals';
import { PAYMENT_TERMS, type FieldErrors, type Invoice, type InvoiceInput, type ValidationResult } from './invoice.types';

const isoDate = z
  .string({ required_error: 'is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date like 2026-05-04')
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), 'is not a real date');

const money = (label: string) => z.number({ required_error: 'is required', invalid_type_error: `${label} must be a number` });

const lineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string({ required_error: 'is required' }).trim().min(1, 'is required').max(200, 'must be 200 characters or fewer'),
  quantity: money('quantity').positive('must be greater than 0'),
  unitPrice: money('unit price').min(0, "can't be negative"),
  accountCode: z.string().regex(/^\d{4}$/, 'must be a 4 digit revenue account'),
});

const invoiceFieldsSchema = z.object({
  customerName: z.string({ required_error: 'is required' }).trim().min(1, 'is required').max(200, 'must be 200 characters or fewer'),
  billingEmail: z.string({ required_error: 'is required' }).trim().min(1, 'is required').email('must be a valid email address'),
  billingAddress: z.string().trim().max(500, 'must be 500 characters or fewer').default(''),
  paymentTerms: z.enum(PAYMENT_TERMS, { errorMap: () => ({ message: `must be one of ${PAYMENT_TERMS.join(', ')}` }) }),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'must be a 3 letter currency code'),
  issueDate: isoDate,
  dueDate: isoDate,
  memo: z.string().trim().max(250, 'must be 250 characters or fewer').default(''),
  taxRate: money('tax rate').min(0, "can't be negative").max(1, 'must be between 0% and 100%'),
  discount: money('discount').min(0, "can't be negative").default(0),
  lineItems: z.array(lineItemSchema, { required_error: 'is required' }).min(1, 'needs at least one product line'),
});

export const invoiceInputSchema = invoiceFieldsSchema.superRefine((value, ctx) => {
  if (value.dueDate < value.issueDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dueDate'], message: "can't be before the invoice date" });
  }
  if (value.discount > subtotalOf(value.lineItems)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['discount'], message: "can't be more than the subtotal" });
  }
});

const toFieldErrors = (error: z.ZodError): FieldErrors => {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join('.') : 'body';
    // keep the first message per field, it's usually the most useful one
    errors[key] ??= issue.message;
  }
  return errors;
};

export const validateInvoiceInput = (body: unknown): ValidationResult<InvoiceInput> => {
  const parsed = invoiceInputSchema.safeParse(body);
  return parsed.success ? { ok: true, value: parsed.data } : { ok: false, errors: toFieldErrors(parsed.error) };
};

export const toInvoiceInput = (invoice: Invoice): InvoiceInput => ({
  customerName: invoice.customerName,
  billingEmail: invoice.billingEmail,
  billingAddress: invoice.billingAddress,
  paymentTerms: invoice.paymentTerms,
  currency: invoice.currency,
  issueDate: invoice.issueDate,
  dueDate: invoice.dueDate,
  memo: invoice.memo,
  taxRate: invoice.taxRate,
  discount: invoice.discount,
  lineItems: invoice.lineItems.map((line) => ({ ...line })),
});

// once sent, only these can change so posted revenue stays in sync
export const SENT_EDITABLE_FIELDS = ['issueDate', 'dueDate', 'paymentTerms', 'memo'] as const;

const INPUT_FIELDS = invoiceFieldsSchema.keyof().options;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateInvoiceUpdate = (existing: Invoice, body: unknown): ValidationResult<InvoiceInput> => {
  if (!isRecord(body)) return { ok: false, errors: { body: 'must be a json object' } };

  const current = toInvoiceInput(existing);
  const changes = Object.fromEntries(Object.entries(body).filter(([key]) => INPUT_FIELDS.includes(key as keyof InvoiceInput)));

  if (existing.status === 'Sent') {
    const locked: FieldErrors = {};
    for (const [key, value] of Object.entries(changes)) {
      const editable = (SENT_EDITABLE_FIELDS as readonly string[]).includes(key);
      const unchanged = JSON.stringify(value) === JSON.stringify(current[key as keyof InvoiceInput]);
      if (!editable && !unchanged) locked[key] = 'is locked once the invoice is sent';
    }
    if (Object.keys(locked).length) return { ok: false, errors: locked };
  }

  return validateInvoiceInput({ ...current, ...changes });
};
