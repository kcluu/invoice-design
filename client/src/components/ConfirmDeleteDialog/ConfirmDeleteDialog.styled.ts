import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => theme.color.overlay};
`;

export const Panel = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.dialog};
`;

export const Title = styled.h2`
  font-size: 17px;
  font-weight: 600;
`;

export const Body = styled.p`
  color: #3d3d3b;
`;

export const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surfaceMuted};

  strong {
    font-variant-numeric: tabular-nums;
  }
`;

export const FinePrint = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;
