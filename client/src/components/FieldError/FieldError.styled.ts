import styled from 'styled-components'

export const Message = styled.span`
  display: block;
  margin-top: 4px;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.danger};
`
