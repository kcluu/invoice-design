import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

export const Bar = styled.span<{ $width: string; $height: number; $radius: string }>`
  display: block;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height}px;
  border-radius: ${({ $radius }) => $radius};
  background: ${({ theme }) => theme.color.skeleton};
  animation: ${pulse} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
