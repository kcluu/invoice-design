import { useMemo, type ReactNode } from 'react';
import { AppShell, type Breadcrumb } from './components/AppShell/AppShell';
import { DesignSystemPage } from './components/DesignSystemPage/DesignSystemPage';
import { Toast } from './components/Toast/Toast';
import { InvoiceDetailPage } from './components/InvoiceDetailPage/InvoiceDetailPage';
import { InvoiceFormPage } from './components/InvoiceFormPage/InvoiceFormPage';
import { InvoiceListPage } from './components/InvoiceListPage/InvoiceListPage';
import { paths, useHashRoute } from './hooks/useHashRoute';
import { useInvoices } from './hooks/useInvoices';
import { useMeta } from './hooks/useMeta';
import { useToast } from './hooks/useToast';
import type { Invoice } from './types/invoice';
import { deriveCustomers } from './utils/customers';

export const App = () => {
  const { route, navigate } = useHashRoute();
  const meta = useMeta();
  const { invoices, status, error, reload, upsertInvoice, removeInvoice } = useInvoices();
  const customers = useMemo(() => deriveCustomers(invoices), [invoices]);
  const toast = useToast();

  const handleSaved = (invoice: Invoice) => {
    upsertInvoice(invoice);
    toast.notify(`${invoice.invoiceNumber} saved`);
    navigate(paths.detail(invoice.id));
  };

  const handleDeleted = (invoice: Invoice) => {
    removeInvoice(invoice.id);
    if (route.name !== 'list') navigate(paths.list());
  };

  const numberFor = (id: string) => invoices.find((item) => item.id === id)?.invoiceNumber ?? id.toUpperCase();
  // accounts receivable has no page of its own yet, so only invoices links back
  const breadcrumbs: Breadcrumb[] =
    route.name === 'docs'
      ? [{ label: 'Documentation' }]
      : [{ label: 'Accounts Receivable' }, { label: 'Invoices', href: `#${paths.list()}` }];
  let page: ReactNode;

  switch (route.name) {
    case 'docs':
      breadcrumbs.push({ label: 'Design System' });
      page = <DesignSystemPage />;
      break;
    case 'new':
      breadcrumbs.push({ label: 'New invoice' });
      page = (
        <InvoiceFormPage
          invoiceId={null}
          startWithDraft={route.fromText}
          customers={customers}
          asOfDate={meta.asOfDate}
          onSaved={handleSaved}
          onCancel={() => navigate(paths.list())}
        />
      );
      break;
    case 'edit':
      breadcrumbs.push({ label: numberFor(route.id), href: `#${paths.detail(route.id)}` }, { label: 'Edit' });
      page = (
        <InvoiceFormPage
          invoiceId={route.id}
          customers={customers}
          asOfDate={meta.asOfDate}
          onSaved={handleSaved}
          onCancel={() => navigate(paths.detail(route.id))}
        />
      );
      break;
    case 'detail':
      breadcrumbs.push({ label: numberFor(route.id) });
      page = (
        <InvoiceDetailPage
          id={route.id}
          asOfDate={meta.asOfDate}
          onBack={() => navigate(paths.list())}
          onEdit={(id) => navigate(paths.edit(id))}
          onUpdated={upsertInvoice}
          onDeleted={handleDeleted}
          onNotify={toast.notify}
        />
      );
      break;
    default:
      page = (
        <InvoiceListPage
          invoices={invoices}
          status={status}
          error={error}
          asOfDate={meta.asOfDate}
          onOpen={(id) => navigate(paths.detail(id))}
          onEdit={(id) => navigate(paths.edit(id))}
          onCreate={() => navigate(paths.new())}
          onDraftFromText={() => navigate(paths.newFromText())}
          onRetry={() => void reload()}
          onUpdated={upsertInvoice}
          onDeleted={handleDeleted}
          onNotify={toast.notify}
        />
      );
  }

  return (
    <AppShell
      companyName={meta.companyName}
      asOfDate={meta.asOfDate}
      breadcrumbs={breadcrumbs}
      section={route.name === 'docs' ? 'docs' : 'invoices'}
    >
      {page}
      <Toast message={toast.message} onDismiss={toast.dismiss} />
    </AppShell>
  );
};
