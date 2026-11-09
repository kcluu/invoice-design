import styled from 'styled-components';
import { controlStyles } from '../../InvoiceForm/InvoiceForm.styled';

export const Composer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.color.divider};

  textarea {
    ${controlStyles}
    min-height: 72px;
    padding: 8px 10px;
    resize: vertical;
    font: inherit;
    font-size: ${({ theme }) => theme.font.size.md};
    line-height: 1.45;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const List = styled.ol`
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
`;

export const Avatar = styled.span`
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.accentSoft};
  color: ${({ theme }) => theme.color.accent};
  display: grid;
  place-items: center;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
`;

export const Author = styled.div`
  font-weight: 600;

  small {
    margin-left: 4px;
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 400;
    color: ${({ theme }) => theme.color.textMuted};
  }
`;

export const Body = styled.p`
  margin: 2px 0 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const Empty = styled.p`
  margin: 0;
  padding: 14px 18px;
  color: ${({ theme }) => theme.color.textMuted};
`;
