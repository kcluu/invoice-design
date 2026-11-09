import styled from 'styled-components';

export const Region = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 60;
  transform: translateX(-50%);
  max-width: calc(100% - 32px);
`;

export const Bubble = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 10px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.text};
  color: #fff;
  box-shadow: 0 8px 24px rgba(20, 20, 19, 0.25);
`;

export const Dismiss = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  &:focus-visible {
    outline-color: #fff;
  }
`;
