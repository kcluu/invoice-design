import { useId, useMemo, useState, type ComponentProps, type KeyboardEvent } from 'react';
import type { CustomerProfile } from '../../utils/customers';
import { Icon } from '../Icon/Icon';
import { Chevron, Empty, Listbox, Match, Option, OptionDetail, Wrap } from './CustomerCombobox.styled';

interface CustomerComboboxProp extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'role'> {
  id: string;
  value: string;
  customers: CustomerProfile[];
  onChange: (value: string) => void;
}

const matches = (customer: CustomerProfile, query: string) =>
  !query || customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query);

// bold the part of the name that matches what was typed
const Highlight = ({ text, query }: { text: string; query: string }) => {
  const start = query ? text.toLowerCase().indexOf(query) : -1;
  if (start < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, start)}
      <Match>{text.slice(start, start + query.length)}</Match>
      {text.slice(start + query.length)}
    </>
  );
};

// search as you type over saved customers, following the aria combobox pattern.
// free text is still allowed so a new customer can be typed in
export const CustomerCombobox = ({ id, value, customers, onChange, disabled, ...inputProps }: CustomerComboboxProp) => {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = value.trim().toLowerCase();
  // an exact match means a customer was picked, so show the full list again to make switching easy
  const exact = customers.some((customer) => customer.name.toLowerCase() === query);
  const options = useMemo(() => customers.filter((customer) => matches(customer, exact ? '' : query)), [customers, query, exact]);
  const showList = open && !disabled && customers.length > 0;

  const openList = () => {
    setOpen(true);
    setActive(-1);
  };

  const choose = (customer: CustomerProfile) => {
    onChange(customer.name);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) return openList();
      if (!options.length) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((index) => (index + step + options.length) % options.length);
    } else if (event.key === 'Enter' && showList && options[active]) {
      // only take over enter when an option is highlighted, otherwise it submits the form as usual
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <Wrap>
      <input
        {...inputProps}
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={openList}
        onClick={() => !open && openList()}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      <Chevron $open={showList}>
        <Icon name="chevronDown" size={14} />
      </Chevron>

      <Listbox id={listId} role="listbox" aria-label="Saved customers" hidden={!showList || !options.length}>
        {options.map((customer, index) => (
          <Option
            key={customer.name}
            id={optionId(index)}
            role="option"
            aria-selected={index === active}
            $active={index === active}
            // keep focus in the input so blur doesn't close the list before the click lands
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(customer)}
            onMouseEnter={() => setActive(index)}
          >
            <span>
              <Highlight text={customer.name} query={exact ? '' : query} />
            </span>
            <OptionDetail>{customer.email}</OptionDetail>
          </Option>
        ))}
      </Listbox>
      {showList && !options.length && (
        <Empty role="status">No saved customer matches. “{value.trim()}” will be saved as a new customer.</Empty>
      )}
    </Wrap>
  );
};
