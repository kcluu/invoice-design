import { useId, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { Invoice } from '../../types/invoice';
import { computeTotals } from '../../utils/invoiceTotals';
import { formatMoney } from '../../utils/money';
import { Button } from '../Button/Button';
import { Backdrop, Body, FinePrint, Footer, Panel, Summary, Title } from './ConfirmDeleteDialog.styled';

interface ConfirmDeleteDialogProp {
  invoice: Invoice;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteDialog = ({ invoice, busy, onCancel, onConfirm }: ConfirmDeleteDialogProp) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();

  // start on cancel, the safe choice for a destructive dialog
  useFocusTrap(panelRef, { onEscape: busy ? undefined : onCancel, initialFocus: '[data-autofocus]' });

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <Panel ref={panelRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId} aria-busy={busy}>
        <Title id={titleId}>Delete {invoice.invoiceNumber}?</Title>
        <Body id={bodyId}>This draft was never sent, so deleting it has no effect on your books.</Body>
        <Summary>
          <span>{invoice.customerName}</span>
          <strong>{formatMoney(computeTotals(invoice).total, invoice.currency)}</strong>
        </Summary>
        <FinePrint>This can't be undone.</FinePrint>
        <Footer>
          <Button data-autofocus onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete invoice'}
          </Button>
        </Footer>
      </Panel>
    </Backdrop>
  );
};
