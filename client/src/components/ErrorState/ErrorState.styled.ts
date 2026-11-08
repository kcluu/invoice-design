import styled from 'styled-components'

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 16px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: 600;
`

export const Message = styled.p`
  max-width: 420px;
  color: ${({ theme }) => theme.color.textSecondary};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
`
