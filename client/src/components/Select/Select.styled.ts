import styled, { css } from 'styled-components';
import { controlStyles } from '../InvoiceForm/InvoiceForm.styled';

export type SelectSize = 'md' | 'sm';

export const Trigger = styled.button<{ $size: SelectSize }>`
  ${controlStyles}
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 400;
  cursor: pointer;
  ${({ $size }) =>
    $size === 'sm' &&
    css`
      min-height: 34px;
      padding: 0 8px;
    `}
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  margin-left: auto;
  padding-left: 2px;
  color: ${({ theme }) => theme.color.textMuted};
  transition: transform 120ms ease;
  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(180deg);
    `}
`;

// same look as the customer search list, positioned by the component so scrolling containers don't clip it
export const Listbox = styled.ul`
  position: fixed;
  z-index: 40;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #fff;
  border: 1px solid #e0e0db;
  border-radius: 9px;
  box-shadow: ${({ theme }) => theme.shadow.menu};

  &[hidden] {
    display: none;
  }
`;

export const Option = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 400;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme, $active }) => ($active ? theme.color.surfaceMuted : 'transparent')};
`;

export const OptionLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OptionDetail = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
`;

export const Check = styled.span`
  display: flex;
  width: 14px;
  margin-left: auto;
  color: ${({ theme }) => theme.color.accent};
`;
