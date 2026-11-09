import type { InvoiceAction } from '../../hooks/useInvoiceActions';
import { useMenu } from '../../hooks/useMenu';
import type { Invoice } from '../../types/invoice';
import { availableActions } from '../../utils/invoicePermissions';
import { Divider, Menu, MenuItem, MenuNote, MenuWrap, Trigger } from './RowActionsMenu.styled';

// why delete is missing, so the menu points to the right action instead
const deleteBlockedNote: Record<Exclude<Invoice['status'], 'Draft'>, string> = {
  Sent: "Sent invoices can't be deleted. Void it instead.",
  Void: 'Voided invoices stay on record.',
  Paid: "Paid invoices can't be deleted.",
};

interface RowActionsMenuProp {
  invoice: Invoice;
  onView: () => void;
  onEdit: () => void;
  onAction: (action: Exclude<InvoiceAction, 'delete'>) => void;
  onRequestDelete: () => void;
}

export const RowActionsMenu = ({ invoice, onView, onEdit, onAction, onRequestDelete }: RowActionsMenuProp) => {
  const menu = useMenu();
  const actions = availableActions(invoice);

  // return focus to the trigger first so a dialog opened next can hand it back there
  const pick = (fn: () => void) => () => {
    menu.close();
    fn();
  };

  return (
    <MenuWrap>
      <Trigger
        ref={menu.triggerRef}
        type="button"
        aria-label={`More actions for ${invoice.invoiceNumber}`}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menu.menuId : undefined}
        onClick={menu.toggle}
        onKeyDown={menu.onTriggerKeyDown}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </Trigger>
      {menu.open && (
        <Menu
          ref={menu.menuRef}
          style={menu.menuStyle}
          id={menu.menuId}
          role="menu"
          aria-label={`Actions for ${invoice.invoiceNumber}`}
          onKeyDown={menu.onMenuKeyDown}
        >
          <MenuItem type="button" role="menuitem" tabIndex={-1} onClick={pick(onView)}>
            View invoice
          </MenuItem>
          {actions.canEdit && (
            <MenuItem type="button" role="menuitem" tabIndex={-1} onClick={pick(onEdit)}>
              Edit
            </MenuItem>
          )}
          {actions.canSend && (
            <MenuItem type="button" role="menuitem" tabIndex={-1} onClick={pick(() => onAction('send'))}>
              Send
            </MenuItem>
          )}
          {actions.canRecordPayment && (
            <MenuItem type="button" role="menuitem" tabIndex={-1} onClick={pick(() => onAction('recordPayment'))}>
              Record payment
            </MenuItem>
          )}
          {actions.canVoid && (
            <MenuItem type="button" role="menuitem" tabIndex={-1} onClick={pick(() => onAction('void'))}>
              Void
            </MenuItem>
          )}
          <Divider role="separator" />
          {actions.canDelete ? (
            <MenuItem type="button" role="menuitem" tabIndex={-1} $danger onClick={pick(onRequestDelete)}>
              Delete
            </MenuItem>
          ) : (
            <MenuNote role="none">{invoice.status !== 'Draft' && deleteBlockedNote[invoice.status]}</MenuNote>
          )}
        </Menu>
      )}
    </MenuWrap>
  );
};
