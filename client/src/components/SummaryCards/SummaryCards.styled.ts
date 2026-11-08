import styled from 'styled-components'
import type { AppTheme } from '../../theme/theme'

type SummaryTone = keyof AppTheme['summary']

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`

export const Card = styled.button<{ $active: boolean; $tone: SummaryTone }>`
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 44px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme, $active, $tone }) => ($active ? theme.summary[$tone].color : theme.color.border)};
  box-shadow: ${({ theme, $active, $tone }) => ($active ? `inset 0 0 0 1px ${theme.summary[$tone].color}` : 'none')};
  background: ${({ theme, $active, $tone }) => ($active ? theme.summary[$tone].tint : '#fff')};
  transition: border-color 120ms ease;

  &:hover {
    border-color: ${({ theme, $tone }) => theme.summary[$tone].color};
  }
`

export const CardTop = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.color.textSecondary};
`

export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const Dot = styled.span<{ $tone: SummaryTone }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $tone }) => theme.summary[$tone].color};
`

export const Hint = styled.span<{ $active: boolean; $tone: SummaryTone }>`
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
  color: ${({ theme, $active, $tone }) => ($active ? theme.summary[$tone].color : theme.color.textMuted)};
`

export const Amount = styled.strong`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

export const Sub = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`
