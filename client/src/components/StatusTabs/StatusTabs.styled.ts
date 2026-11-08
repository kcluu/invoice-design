import styled from 'styled-components'

export const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const Tab = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 10px;
  margin-bottom: -1px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.textSecondary)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.color.accent : 'transparent')};

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`

export const Count = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.font.size.xs};
  padding: 0 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ $active }) => ($active ? '#E3E3DE' : '#F0F0EC')};
  color: #4a4a47;
`
