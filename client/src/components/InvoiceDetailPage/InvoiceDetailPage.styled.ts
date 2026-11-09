import styled from 'styled-components';
import type { DueTone } from '../../utils/invoiceStatus';

export type BannerTone = 'late' | 'soon' | 'neutral';

const bannerColors = {
  late: { bg: '#FDF0EA', fg: '#7C2D12', border: '#F4D0BF' },
  soon: { bg: '#FFF7E6', fg: '#6B4200', border: '#F1DDB0' },
  neutral: { bg: '#F4F4F1', fg: '#3D3D3B', border: '#E3E3DE' },
};

export const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const BackLink = styled.button`
  all: unset;
  cursor: pointer;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: 600;
  letter-spacing: -0.01em;

  &:focus {
    outline: none;
  }
`;

export const Meta = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Banner = styled.div<{ $tone: BannerTone }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 9px;
  background: ${({ $tone }) => bannerColors[$tone].bg};
  color: ${({ $tone }) => bannerColors[$tone].fg};
  border: 1px solid ${({ $tone }) => bannerColors[$tone].border};
`;

export const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 9px;
  background: ${({ theme }) => theme.color.dangerSoft};
  border: 1px solid ${({ theme }) => theme.color.dangerBorder};
  color: #8a2418;
`;

export const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
`;

export const MainColumn = styled.div`
  flex: 999 1 520px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SideColumn = styled.div`
  flex: 1 1 300px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const CardTitle = styled.h2`
  padding: 14px 18px;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.color.divider};
`;

export const DetailGrid = styled.dl`
  margin: 0;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px 24px;

  dt {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.color.textMuted};
  }

  dd {
    margin: 2px 0 0;
  }
`;

export const Wide = styled.div`
  grid-column: 1 / -1;
`;

export const DueHint = styled.span<{ $tone: DueTone }>`
  font-weight: 600;
  color: ${({ theme, $tone }) => theme.tone[$tone]};
`;

export const TableScroll = styled.div`
  overflow-x: auto;
`;

export const LineTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  th {
    padding: 10px 12px;
    text-align: left;
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 500;
    color: ${({ theme }) => theme.color.textMuted};
  }

  td {
    padding: 12px;
    border-top: 1px solid ${({ theme }) => theme.color.divider};
  }

  th:first-child,
  td:first-child {
    padding-left: 18px;
  }

  th:last-child,
  td:last-child {
    padding-right: 18px;
  }

  .num {
    text-align: right;
  }
`;

export const Totals = styled.dl`
  margin: 0 0 0 auto;
  padding: 12px 18px 18px;
  width: 100%;
  max-width: 320px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 16px;
  font-variant-numeric: tabular-nums;

  dt {
    color: ${({ theme }) => theme.color.textSecondary};
  }

  dd {
    margin: 0;
    text-align: right;
  }

  dt:last-of-type,
  dd:last-of-type {
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    font-weight: 600;
    font-size: ${({ theme }) => theme.font.size.lg};
    color: ${({ theme }) => theme.color.text};
  }
`;

export const TotalsRow = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.color.divider};
`;

export const Balance = styled.div`
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  span:first-child {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.color.textMuted};
  }

  strong {
    font-size: 24px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const Activity = styled.ol`
  list-style: none;
  margin: 0;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  li {
    display: flex;
    gap: 10px;
  }

  li::before {
    content: '';
    flex: none;
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 50%;
    background: #b9b9b2;
  }

  small {
    display: block;
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.color.textMuted};
  }
`;
