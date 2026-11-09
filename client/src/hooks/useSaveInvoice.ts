import { useCallback, useState } from 'react';
import { ApiError, errorMessage } from '../api/http';
import { invoicesApi } from '../api/invoicesApi';
import type { FieldErrors, Invoice, InvoiceInput } from '../types/invoice';
import { SENT_EDITABLE_FIELDS } from '../utils/invoicePermissions';

type SaveRequest = { mode: 'create'; input: InvoiceInput; send: boolean } | { mode: 'edit'; invoice: Invoice; input: InvoiceInput };

export type SaveResult = { ok: true; invoice: Invoice } | { ok: false; fieldErrors: FieldErrors };

export const useSaveInvoice = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (request: SaveRequest): Promise<SaveResult> => {
    setSaving(true);
    setError(null);
    try {
      if (request.mode === 'create') {
        return { ok: true, invoice: await invoicesApi.create(request.input, { send: request.send }) };
      }
      // sent invoices only accept the unlocked fields
      const changes =
        request.invoice.status === 'Sent'
          ? Object.fromEntries(SENT_EDITABLE_FIELDS.map((key) => [key, request.input[key]]))
          : request.input;
      return { ok: true, invoice: await invoicesApi.update(request.invoice.id, changes) };
    } catch (err) {
      // field errors get shown inline, anything else goes in the banner
      if (err instanceof ApiError && err.hasFieldErrors) return { ok: false, fieldErrors: err.fields };
      setError(errorMessage(err, "Couldn't save the invoice. Try again."));
      return { ok: false, fieldErrors: {} };
    } finally {
      setSaving(false);
    }
  }, []);

  return { save, saving, error, clearError: () => setError(null) };
};
