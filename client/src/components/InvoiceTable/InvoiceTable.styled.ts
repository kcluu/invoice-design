import styled from 'styled-components'
import type { DueTone } from '../../utils/invoiceStatus'

export const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
`

export const Th = styled.th<{ $align?: 'left' | 'right' }>`
  padding: 10px 12px;
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.color.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  white-space: nowrap;
`

export const Row = styled.tr`
  &:hover td {
    background: #fbfbfa;
  }

  &:last-child td {
    border-bottom: none;
  }
`

export const Td = styled.td<{ $align?: 'left' | 'right' }>`
  padding: 12px;
  text-align: ${({ $align = 'left' }) => $align};
  vertical-align: top;
  border-bottom: 1px solid ${({ theme }) => theme.color.divider};
`

export const NumberButton = styled.button`
  all: unset;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: #d0d0ca;
  text-underline-offset: 3px;

  &:hover {
    text-decoration-color: currentColor;
  }
`

export const Primary = styled.div`
  font-weight: 500;
`

export const Secondary = styled.div`
  margin-top: 2px;
  max-width: 260px;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const DueLabel = styled.div<{ $tone: DueTone }>`
  font-weight: ${({ $tone }) => ($tone === 'soon' || $tone === 'late' ? 600 : 500)};
  color: ${({ theme, $tone }) => theme.tone[$tone]};
`

export const Empty = styled.p`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.textMuted};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`
