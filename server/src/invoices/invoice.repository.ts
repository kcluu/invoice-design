import type { Pool } from 'pg';
import type { ActivityEntry, Invoice, InvoiceStatus, LineItem, PaymentStatus, PaymentTerms } from './invoice.types';

export interface InvoiceRepository {
  list(): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  insert(invoice: Invoice): Promise<Invoice>;
  update(invoice: Invoice): Promise<Invoice>;
  remove(id: string): Promise<boolean>;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  customer_name: string;
  billing_email: string;
  billing_address: string;
  payment_terms: PaymentTerms;
  status: InvoiceStatus;
  payment_status: PaymentStatus;
  currency: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  memo: string;
  tax_rate: string;
  discount: string;
  line_items: LineItem[];
  activity: ActivityEntry[];
}

// numeric columns come back from pg as strings
const fromRow = (row: InvoiceRow): Invoice => ({
  id: row.id,
  invoiceNumber: row.invoice_number,
  customerName: row.customer_name,
  billingEmail: row.billing_email,
  billingAddress: row.billing_address,
  paymentTerms: row.payment_terms,
  status: row.status,
  paymentStatus: row.payment_status,
  currency: row.currency,
  issueDate: row.issue_date,
  dueDate: row.due_date,
  paidDate: row.paid_date,
  memo: row.memo,
  taxRate: Number(row.tax_rate),
  discount: Number(row.discount),
  lineItems: row.line_items,
  activity: row.activity,
});

const toParams = (invoice: Invoice) => [
  invoice.id,
  invoice.invoiceNumber,
  invoice.customerName,
  invoice.billingEmail,
  invoice.billingAddress,
  invoice.paymentTerms,
  invoice.status,
  invoice.paymentStatus,
  invoice.currency,
  invoice.issueDate,
  invoice.dueDate,
  invoice.paidDate,
  invoice.memo,
  invoice.taxRate,
  invoice.discount,
  JSON.stringify(invoice.lineItems),
  JSON.stringify(invoice.activity),
];

export const createPgRepository = (db: Pool): InvoiceRepository => ({
  async list() {
    const { rows } = await db.query<InvoiceRow>('select * from invoices order by issue_date desc, invoice_number desc');
    return rows.map(fromRow);
  },

  async findById(id) {
    const { rows } = await db.query<InvoiceRow>('select * from invoices where id = $1', [id]);
    return rows[0] ? fromRow(rows[0]) : null;
  },

  async insert(invoice) {
    const { rows } = await db.query<InvoiceRow>(
      `insert into invoices (
        id, invoice_number, customer_name, billing_email, billing_address, payment_terms, status, payment_status,
        currency, issue_date, due_date, paid_date, memo, tax_rate, discount, line_items, activity
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      returning *`,
      toParams(invoice)
    );
    return fromRow(rows[0]);
  },

  async update(invoice) {
    const { rows } = await db.query<InvoiceRow>(
      `update invoices set
        invoice_number = $2, customer_name = $3, billing_email = $4, billing_address = $5, payment_terms = $6,
        status = $7, payment_status = $8, currency = $9, issue_date = $10, due_date = $11, paid_date = $12,
        memo = $13, tax_rate = $14, discount = $15, line_items = $16, activity = $17, updated_at = now()
      where id = $1
      returning *`,
      toParams(invoice)
    );
    return fromRow(rows[0]);
  },

  async remove(id) {
    const result = await db.query('delete from invoices where id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
});
