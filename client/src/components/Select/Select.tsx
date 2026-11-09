import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ComponentProps, type KeyboardEvent } from 'react';
import { Icon } from '../Icon/Icon';
import { Check, Chevron, Listbox, Option, OptionDetail, OptionLabel, Trigger, type SelectSize } from './Select.styled';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  // muted text after the label, e.g. an account name next to its code
  detail?: string;
}

interface SelectProp<T extends string> extends Omit<ComponentProps<'button'>, 'value' | 'onChange' | 'role' | 'type'> {
  id: string;
  value: T;
  options: ReadonlyArray<SelectOption<T>>;
  onChange: (value: T) => void;
  size?: SelectSize;
}

const LIST_MAX_HEIGHT = 240;

// fixed positioning keeps the list from being clipped by scrolling containers like the line items table.
// it opens upward when there isn't room below
const positionFor = (trigger: HTMLElement): CSSProperties => {
  const rect = trigger.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom;
  const base = { left: rect.left, minWidth: rect.width };
  return below < LIST_MAX_HEIGHT + 8 && rect.top > below
    ? { ...base, bottom: window.innerHeight - rect.top + 4 }
    : { ...base, top: rect.bottom + 4 };
};

// a select-only combobox (aria pattern): looks like the customer search but can't be typed into.
// typing a letter jumps to the first option starting with it, like a native select
export const Select = <T extends string>({ id, value, options, onChange, size = 'md', disabled, ...buttonProps }: SelectProp<T>) => {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef({ text: '', timer: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selected = options.find((option) => option.value === value);
  const optionId = (index: number) => `${listId}-option-${index}`;

  const openList = (index = selectedIndex) => {
    if (disabled) return;
    setActive(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    setOpen(false);
  };

  // place the list next to the trigger, and keep it there while the page or a container scrolls
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => triggerRef.current && setPosition(positionFor(triggerRef.current));
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' });
  });

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  const jumpTo = (char: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.text += char.toLowerCase();
    state.timer = window.setTimeout(() => (state.text = ''), 500);
    const start = open ? active : selectedIndex;
    // repeated presses of one letter cycle through the options starting with it
    const query = state.text.split('').every((c) => c === state.text[0]) ? state.text[0] : state.text;
    const ordered = [...options.slice(start + 1), ...options.slice(0, start + 1)];
    const match = ordered.find((option) => option.label.toLowerCase().startsWith(query));
    if (match) openList(options.indexOf(match));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) return openList();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive((index) => Math.min(last, Math.max(0, index + step)));
        return;
      }
      case 'Home':
      case 'End':
        event.preventDefault();
        openList(event.key === 'Home' ? 0 : last);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case 'Tab':
        if (open) choose(active);
        return;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) jumpTo(event.key);
    }
  };

  return (
    <>
      <Trigger
        {...buttonProps}
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        $size={size}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      >
        <OptionLabel>
          {selected?.label ?? value}
          {selected?.detail && <OptionDetail> {selected.detail}</OptionDetail>}
        </OptionLabel>
        <Chevron $open={open}>
          <Icon name="chevronDown" size={14} />
        </Chevron>
      </Trigger>

      <Listbox
        id={listId}
        role="listbox"
        // named the same way as the field, not by the trigger, whose text is the current value
        aria-labelledby={buttonProps['aria-labelledby']}
        aria-label={buttonProps['aria-label']}
        hidden={!open}
        style={position}
      >
        {options.map((option, index) => (
          <Option
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={index === active}
            $active={index === active}
            // keep focus on the trigger so blur doesn't close the list before the click lands
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
            onMouseEnter={() => setActive(index)}
          >
            <OptionLabel>
              {option.label}
              {option.detail && <OptionDetail> {option.detail}</OptionDetail>}
            </OptionLabel>
            <Check aria-hidden="true">{option.value === value && <Icon name="check" size={14} />}</Check>
          </Option>
        ))}
      </Listbox>
    </>
  );
};
