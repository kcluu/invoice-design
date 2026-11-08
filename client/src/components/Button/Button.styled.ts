import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const variants = {
  primary: css`
    background: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
    color: #fff;
    font-weight: 600;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.accentHover};
      border-color: ${({ theme }) => theme.color.accentHover};
    }
  `,
  secondary: css`
    background: #fff;
    border-color: ${({ theme }) => theme.color.borderStrong};
    color: ${({ theme }) => theme.color.text};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.surfaceMuted};
    }
  `,
  danger: css`
    background: #fff;
    border-color: ${({ theme }) => theme.color.dangerBorder};
    color: ${({ theme }) => theme.color.danger};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.dangerSoft};
    }
  `,
  ghost: css`
    background: transparent;
    border-color: transparent;
    color: ${({ theme }) => theme.color.textSecondary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.surfaceMuted};
    }
  `,
}

export const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: ${({ $size }) => ($size === 'sm' ? '32px' : '36px')};
  padding: 0 ${({ $size }) => ($size === 'sm' ? '10px' : '14px')};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 120ms ease,
    border-color 120ms ease;

  ${({ $variant }) => variants[$variant]}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    flex: none;
  }
`
