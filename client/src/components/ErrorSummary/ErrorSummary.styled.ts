import styled from 'styled-components'

export const Box = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 9px;
  background: ${({ theme }) => theme.color.dangerSoft};
  border: 1px solid ${({ theme }) => theme.color.dangerBorder};
  color: #8a2418;

  svg {
    flex: none;
    margin-top: 2px;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  list-style: disc;
  display: flex;
  flex-direction: column;
  gap: 3px;
`
