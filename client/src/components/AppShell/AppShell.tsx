import type { ReactNode } from 'react';
import { CURRENT_USER } from '../../config';
import { paths } from '../../hooks/useHashRoute';
import { formatDate } from '../../utils/dates';
import { Icon } from '../Icon/Icon';
import {
  Avatar,
  BreadcrumbLink,
  Breadcrumbs,
  Content,
  Main,
  NavGroupLabel,
  NavLink,
  NavList,
  NavStatic,
  Shell,
  Sidebar,
  SidebarFooter,
  SkipLink,
  TopBar,
  TopBarMeta,
  Workspace,
  WorkspaceMark,
  WorkspaceName,
} from './AppShell.styled';

// earlier crumbs link back up the trail, the last one is the current page
export interface Breadcrumb {
  label: string;
  href?: string;
}

interface AppShellProp {
  companyName: string;
  asOfDate: string;
  breadcrumbs: Breadcrumb[];
  // which sidebar link is the current page
  section: 'invoices' | 'docs';
  children: ReactNode;
}

// these sections aren't built yet, they show the full navigation for the demo but aren't clickable
const RECEIVABLE_PAGES = ['Customers', 'Contracts', 'Invoices', 'Credit Memos', 'AR Aging'];

export const AppShell = ({ companyName, asOfDate, breadcrumbs, section, children }: AppShellProp) => (
  <Shell>
    <SkipLink
      href="#main"
      onClick={(event) => {
        // the hash drives routing, so move focus by hand instead of following the link
        event.preventDefault();
        document.getElementById('main')?.focus();
      }}
    >
      Skip to main content
    </SkipLink>
    <Sidebar>
      <Workspace>
        <WorkspaceMark aria-hidden="true">{companyName.charAt(0)}</WorkspaceMark>
        <WorkspaceName>
          {companyName}
          <small>B2B SaaS</small>
        </WorkspaceName>
      </Workspace>
      <nav aria-label="Main">
        <NavList>
          <li>
            <NavStatic>
              <Icon name="launchpad" />
              Launchpad
            </NavStatic>
          </li>
          <li>
            <NavStatic>
              <Icon name="ledger" />
              General Ledger
            </NavStatic>
          </li>
          <li>
            <NavGroupLabel>
              <Icon name="receivable" />
              Accounts Receivable
            </NavGroupLabel>
            <NavList>
              {RECEIVABLE_PAGES.map((page) =>
                page === 'Invoices' ? (
                  <li key={page}>
                    <NavLink
                      $nested
                      $active={section === 'invoices'}
                      aria-current={section === 'invoices' ? 'page' : undefined}
                      href={`#${paths.list()}`}
                    >
                      Invoices
                    </NavLink>
                  </li>
                ) : (
                  <li key={page}>
                    <NavStatic $nested>{page}</NavStatic>
                  </li>
                )
              )}
            </NavList>
          </li>
          <li>
            <NavStatic>
              <Icon name="payable" />
              Accounts Payable
            </NavStatic>
          </li>
          <li>
            <NavStatic>
              <Icon name="reports" />
              Reports
            </NavStatic>
          </li>
        </NavList>
      </nav>
      <SidebarFooter aria-label="Help">
        <NavLink $active={section === 'docs'} aria-current={section === 'docs' ? 'page' : undefined} href={`#${paths.docs()}`}>
          <Icon name="book" />
          Documentation
        </NavLink>
      </SidebarFooter>
    </Sidebar>

    <Main>
      <TopBar>
        <nav aria-label="Breadcrumb">
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => {
              const current = index === breadcrumbs.length - 1;
              return (
                <li key={crumb.label} aria-current={current ? 'page' : undefined}>
                  {crumb.href && !current ? <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink> : crumb.label}
                </li>
              );
            })}
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
);
