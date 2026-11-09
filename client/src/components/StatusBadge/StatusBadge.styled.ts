import styled from 'styled-components';
import type { DisplayStatus } from '../../types/invoice';

export const Badge = styled.span<{ $status: DisplayStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border: ${({ theme, $status }) => theme.status[$status].border};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  white-space: nowrap;
  background: ${({ theme, $status }) => theme.status[$status].bg};
  color: ${({ theme, $status }) => theme.status[$status].fg};
`;
