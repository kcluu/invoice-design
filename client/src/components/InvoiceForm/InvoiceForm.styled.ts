import styled, { css } from 'styled-components'

// shared look for every text input and select in the form
export const controlStyles = css`
  min-height: 36px;
  width: 100%;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: 7px;
  background: #fff;
  color: ${({ theme }) => theme.color.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.color.accent};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.surfaceMuted};
    color: ${({ theme }) => theme.color.textSecondary};
    cursor: not-allowed;
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.color.danger};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.color.danger};
    background: #fffbfa;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: 600;
  letter-spacing: -0.01em;

  &:focus {
    outline: none;
  }
`

export const Subtitle = styled.p`
  margin-top: 4px;
  color: ${({ theme }) => theme.color.textMuted};
`

export const Note = styled.p`
  padding: 12px 14px;
  border-radius: 9px;
  background: #f3f5f8;
  border: 1px solid #dce3ec;
  color: #2c3e57;
`

export const ErrorBanner = styled.p`
  padding: 12px 14px;
  border-radius: 9px;
  background: ${({ theme }) => theme.color.dangerSoft};
  border: 1px solid ${({ theme }) => theme.color.dangerBorder};
  color: #8a2418;
`

export const Card = styled.fieldset`
  margin: 0;
  padding: 0;
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`

export const CardTitle = styled.legend`
  float: left;
  width: 100%;
  padding: 14px 18px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.color.divider};

  & + * {
    clear: both;
  }
`

export const FieldGrid = styled.div`
  clear: both;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px 20px;
`

export const Field = styled.label<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.color.textSecondary};

  input,
  select {
    ${controlStyles}
    font-size: ${({ theme }) => theme.font.size.md};
    font-weight: 400;
  }
`

export const Required = styled.span`
  color: ${({ theme }) => theme.color.danger};
`

export const Hint = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.color.textMuted};
`

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
`

export const TotalsRow = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.color.divider};
`

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 0;
  background: #fff;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`
