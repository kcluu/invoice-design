import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { buildInvoice } from '../../test/factories';
import { renderWithTheme } from '../../test/render';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

// only drafts can be deleted, sent invoices are voided instead
const renderDialog = (invoice = buildInvoice({ status: 'Draft', paymentStatus: 'Unsent' })) => {
  const props = { onCancel: vi.fn(), onConfirm: vi.fn() };
  renderWithTheme(<ConfirmDeleteDialog invoice={invoice} busy={false} {...props} />);
  return props;
};

describe('ConfirmDeleteDialog', () => {
  it('is a labelled modal that starts focus on cancel', () => {
    renderDialog();
    const dialog = screen.getByRole('alertdialog', { name: /delete INV-/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription(/never sent/);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('keeps tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.tab();
    await user.tab();
    // cancel, delete, then back round to cancel
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('cancels on escape', async () => {
    const user = userEvent.setup();
    const props = renderDialog();
    await user.keyboard('{Escape}');
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('confirms the delete', async () => {
    const user = userEvent.setup();
    const props = renderDialog();
    await user.click(screen.getByRole('button', { name: 'Delete invoice' }));
    expect(props.onConfirm).toHaveBeenCalled();
  });
});
