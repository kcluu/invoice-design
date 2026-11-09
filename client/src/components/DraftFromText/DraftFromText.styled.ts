import styled from 'styled-components';

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid #d5e2da;
  background: #f5f9f7;
`;

export const Heading = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 600;
  color: ${({ theme }) => theme.color.accent};
`;

export const Label = styled.label`
  color: #3d3d3b;
`;

export const TextArea = styled.textarea`
  min-height: 84px;
  padding: 10px 12px;
  resize: vertical;
  border: 1px solid #c9d8cf;
  border-radius: 7px;
  background: #fff;
  color: ${({ theme }) => theme.color.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.color.accent};
  }
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textSecondary};
`;

export const Chip = styled.button`
  min-height: 30px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid #c9d8cf;
  background: #fff;
  color: ${({ theme }) => theme.color.accent};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Loading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #d5e2da;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: #3d5a4c;
`;

export const Review = styled.div`
  padding-top: 10px;
  border-top: 1px solid #d5e2da;
  color: #5c3a0e;

  strong {
    display: block;
    margin-bottom: 6px;
    color: #7a4100;
  }

  ul {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const Success = styled.p`
  padding-top: 10px;
  border-top: 1px solid #d5e2da;
  color: #1e6b43;
  font-weight: 500;
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.color.danger};
`;
