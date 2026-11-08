import type { ReactNode } from 'react'
import { CURRENT_USER } from '../../config'
import { paths } from '../../hooks/useHashRoute'
import { formatDate } from '../../utils/dates'
import {
  Avatar,
  Breadcrumbs,
  Content,
  Main,
  NavGroupLabel,
  NavLink,
  NavList,
  Shell,
  Sidebar,
  TopBar,
  TopBarMeta,
  Workspace,
  WorkspaceMark,
  WorkspaceName,
} from './AppShell.styled'

interface AppShellProp {
  companyName: string
  asOfDate: string
  breadcrumbs: string[]
  children: ReactNode
}

export const AppShell = ({ companyName, asOfDate, breadcrumbs, children }: AppShellProp) => (
  <Shell>
    <Sidebar>
      <Workspace>
        <WorkspaceMark>{companyName.charAt(0)}</WorkspaceMark>
        <WorkspaceName>
          {companyName}
          <small>Accounts receivable</small>
        </WorkspaceName>
      </Workspace>
      <nav>
        <NavList>
          <li>
            <NavGroupLabel>Accounts receivable</NavGroupLabel>
            <NavList>
              <li>
                <NavLink $nested $active href={`#${paths.list()}`}>
                  Invoices
                </NavLink>
              </li>
            </NavList>
          </li>
        </NavList>
      </nav>
    </Sidebar>

    <Main>
      <TopBar>
        <Breadcrumbs>
          {breadcrumbs.map((crumb) => (
            <li key={crumb}>{crumb}</li>
          ))}
        </Breadcrumbs>
        <TopBarMeta>
          <span>As of {formatDate(asOfDate)}</span>
          <Avatar title={CURRENT_USER.name}>{CURRENT_USER.initials}</Avatar>
        </TopBarMeta>
      </TopBar>
      <Content>{children}</Content>
    </Main>
  </Shell>
)
