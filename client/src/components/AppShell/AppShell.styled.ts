import styled from 'styled-components'

export const SkipLink = styled.a`
  position: absolute;
  left: 12px;
  top: -48px;
  z-index: 100;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.text};
  color: #fff;
  font-weight: 600;

  &:focus {
    top: 12px;
  }
`

export const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
`

export const Sidebar = styled.aside`
  flex: 1 1 ${({ theme }) => theme.layout.sidebarWidth};
  max-width: 100%;
  background: ${({ theme }) => theme.color.sidebar};
  border-right: 1px solid ${({ theme }) => theme.color.border};
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 900px) {
    flex: 0 0 ${({ theme }) => theme.layout.sidebarWidth};
  }
`

export const Workspace = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
`

export const WorkspaceMark = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: ${({ theme }) => theme.color.text};
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
`

export const WorkspaceName = styled.span`
  display: flex;
  flex-direction: column;
  font-weight: 600;

  small {
    font-weight: 400;
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.color.textMuted};
  }
`

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const NavGroupLabel = styled.span`
  display: block;
  padding: 8px 10px;
  font-weight: 600;
`

export const NavLink = styled.a<{ $active?: boolean; $nested?: boolean }>`
  display: block;
  padding: ${({ $nested }) => ($nested ? '6px 10px 6px 24px' : '8px 10px')};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.textSecondary)};
  background: ${({ $active }) => ($active ? '#EAEAE6' : 'transparent')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-decoration: none;

  &:hover {
    background: #eeeeea;
  }
`

export const Main = styled.div`
  flex: 999 1 640px;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

export const TopBar = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px ${({ theme }) => theme.layout.gutter};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

export const Breadcrumbs = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.color.textMuted};

  li + li::before {
    content: '/';
    margin-right: 8px;
  }

  li:last-child {
    color: ${({ theme }) => theme.color.text};
    font-weight: 500;
  }
`

export const TopBarMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

export const Avatar = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.accentSoft};
  color: ${({ theme }) => theme.color.accent};
  display: grid;
  place-items: center;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
`

export const Content = styled.main`
  outline: none;
  padding: 24px ${({ theme }) => theme.layout.gutter} 48px;

  @media (max-width: 600px) {
    padding: 16px 16px 40px;
  }
`
