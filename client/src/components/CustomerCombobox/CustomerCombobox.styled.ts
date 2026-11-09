import styled, { css } from 'styled-components';

export const Wrap = styled.div`
  position: relative;

  input {
    padding-right: 32px;
  }
`;

export const Chevron = styled.span<{ $open: boolean }>`
  position: absolute;
  top: 0;
  right: 11px;
  height: 36px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.textMuted};
  pointer-events: none;
  transition: transform 120ms ease;
  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(180deg);
    `}
`;

const popover = css`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 30;
  background: #fff;
  border: 1px solid #e0e0db;
  border-radius: 9px;
  box-shadow: ${({ theme }) => theme.shadow.menu};
`;

export const Listbox = styled.ul`
  ${popover}
  margin: 0;
  padding: 6px;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;

  &[hidden] {
    display: none;
  }
`;

export const Option = styled.li<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 400;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme, $active }) => ($active ? theme.color.surfaceMuted : 'transparent')};
`;

export const OptionDetail = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`;

export const Match = styled.strong`
  font-weight: 600;
`;

export const Empty = styled.div`
  ${popover}
  padding: 10px 12px;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 400;
  color: ${({ theme }) => theme.color.textSecondary};
`;
