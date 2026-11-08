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
  SkipLink,
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
    <SkipLink
      href="#main"
      onClick={(event) => {
        // the hash drives routing, so move focus by hand instead of following the link
        event.preventDefault()
        document.getElementById('main')?.focus()
      }}
    >
      Skip to main content
    </SkipLink>
    <Sidebar>
      <Workspace>
        <WorkspaceMark aria-hidden="true">{companyName.charAt(0)}</WorkspaceMark>
        <WorkspaceName>
          {companyName}
          <small>Accounts receivable</small>
        </WorkspaceName>
      </Workspace>
      <nav aria-label="Main">
        <NavList>
          <li>
            <NavGroupLabel>Accounts receivable</NavGroupLabel>
            <NavList>
              <li>
                <NavLink $nested $active aria-current="page" href={`#${paths.list()}`}>
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
        <nav aria-label="Breadcrumb">
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb} aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}>
                {crumb}
              </li>
            ))}
          </Breadcrumbs>
        </nav>
        <TopBarMeta>
          <span>As of {formatDate(asOfDate)}</span>
          <Avatar role="img" aria-label={`Signed in as ${CURRENT_USER.name}`}>
            {CURRENT_USER.initials}
          </Avatar>
        </TopBarMeta>
      </TopBar>
      <Content id="main" tabIndex={-1}>
        {children}
      </Content>
    </Main>
  </Shell>
)
