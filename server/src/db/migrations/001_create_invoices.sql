-- one table holds the whole invoice, line items and activity live in jsonb
create table if not exists invoices (
  id               text primary key,
  invoice_number   text not null unique,
  customer_name    text not null check (length(trim(customer_name)) > 0),
  billing_email    text not null check (billing_email like '%_@_%'),
  billing_address  text not null default '',
  payment_terms    text not null check (payment_terms in ('Due on receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60')),
  status           text not null check (status in ('Draft', 'Sent', 'Paid', 'Void')),
  payment_status   text not null check (payment_status in ('Unsent', 'Open', 'Overdue', 'Paid', 'Voided')),
  currency         char(3) not null,
  issue_date       date not null,
  due_date         date not null,
  paid_date        date,
  memo             text not null default '' check (length(memo) <= 250),
  tax_rate         numeric(6, 4) not null default 0 check (tax_rate >= 0 and tax_rate <= 1),
  discount         numeric(14, 2) not null default 0 check (discount >= 0),
  line_items       jsonb not null default '[]'::jsonb check (jsonb_typeof(line_items) = 'array'),
  activity         jsonb not null default '[]'::jsonb check (jsonb_typeof(activity) = 'array'),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (due_date >= issue_date)
);

create index if not exists invoices_status_idx on invoices (status);
create index if not exists invoices_due_date_idx on invoices (due_date);
