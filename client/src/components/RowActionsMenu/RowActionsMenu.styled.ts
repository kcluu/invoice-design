import styled from 'styled-components'

export const MenuWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
`

export const Trigger = styled.button`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.color.textSecondary};
  cursor: pointer;

  &:hover,
  &[aria-expanded='true'] {
    background: ${({ theme }) => theme.color.surfaceMuted};
    border-color: ${({ theme }) => theme.color.border};
  }
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 30;
  width: 200px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #fff;
  border: 1px solid #e0e0db;
  border-radius: 9px;
  box-shadow: ${({ theme }) => theme.shadow.menu};
`

export const MenuItem = styled.button<{ $danger?: boolean }>`
  all: unset;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $danger }) => ($danger ? theme.color.danger : theme.color.text)};
  font-weight: ${({ $danger }) => ($danger ? 500 : 400)};

  &:hover {
    background: ${({ theme, $danger }) => ($danger ? theme.color.dangerSoft : theme.color.surfaceMuted)};
  }
`

export const Divider = styled.div`
  height: 1px;
  margin: 4px 0;
  background: ${({ theme }) => theme.color.divider};
`

export const MenuNote = styled.p`
  padding: 8px 10px;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`
