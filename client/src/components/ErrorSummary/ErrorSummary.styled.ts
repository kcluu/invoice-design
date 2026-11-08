import styled from 'styled-components'

export const Box = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 9px;
  background: ${({ theme }) => theme.color.dangerSoft};
  border: 1px solid ${({ theme }) => theme.color.dangerBorder};
  color: #8a2418;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.danger};
    outline-offset: 2px;
  }

  svg {
    flex: none;
    margin-top: 2px;
  }
`

export const SummaryLink = styled.button`
  all: unset;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    text-decoration-thickness: 2px;
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
