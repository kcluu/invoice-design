import styled from 'styled-components'
import { controlStyles } from '../InvoiceForm/InvoiceForm.styled'

export const Wrap = styled.div`
  clear: both;
`

export const TableScroll = styled.div`
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
`

export const Th = styled.th<{ $width?: string; $align?: 'left' | 'right' }>`
  width: ${({ $width = 'auto' }) => $width};
  padding: 10px 8px;
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.color.textMuted};

  &:first-child {
    padding-left: 18px;
  }
`

export const Td = styled.td<{ $align?: 'left' | 'right' }>`
  padding: 8px;
  vertical-align: top;
  text-align: ${({ $align = 'left' }) => $align};
  border-top: 1px solid ${({ theme }) => theme.color.divider};

  &:first-child {
    padding-left: 18px;
  }

  &:last-child {
    padding-right: 18px;
  }

  input,
  select {
    ${controlStyles}
    min-height: 34px;
    padding: 0 8px;
  }

  input[type='number'] {
    text-align: right;
  }
`

export const Amount = styled.span`
  display: inline-block;
  padding-top: 8px;
  font-weight: 500;
`

export const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.surfaceMuted};
    color: ${({ theme }) => theme.color.danger};
  }
`

export const AddRow = styled.div`
  padding: 10px 18px 14px;
`
