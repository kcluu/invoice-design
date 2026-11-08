import styled from 'styled-components'

export const Wrap = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
`

export const Cell = styled.td`
  padding: 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.divider};

  span + span {
    margin-top: 8px;
  }

  tr:last-child & {
    border-bottom: none;
  }
`
