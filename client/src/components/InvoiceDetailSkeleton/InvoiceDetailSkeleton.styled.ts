import styled from 'styled-components';

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

export const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
`;

export const Card = styled.div<{ $wide?: boolean }>`
  flex: ${({ $wide }) => ($wide ? '999 1 520px' : '1 1 300px')};
  min-width: 0;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px 24px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
