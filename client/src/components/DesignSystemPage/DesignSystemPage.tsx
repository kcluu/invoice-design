import { useFocusOnReady } from '../../hooks/useFocusOnReady';
import { theme } from '../../theme/theme';
import type { DisplayStatus, Invoice } from '../../types/invoice';
import { dueInfo } from '../../utils/invoiceStatus';
import { Button } from '../Button/Button';
import { Icon, ICON_NAMES } from '../Icon/Icon';
import { Banner } from '../InvoiceDetailPage/InvoiceDetailPage.styled';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import {
  Arrow,
  Cols,
  Grid,
  GroupTitle,
  IconTile,
  Lede,
  Lifecycle,
  Mono,
  Muted,
  Node,
  Page,
  Principles,
  Row,
  Section,
  SectionTitle,
  Subtitle,
  Swatch,
  Table,
  Title,
} from './DesignSystemPage.styled';

// a light reference for the design choices, built from the real tokens and components so it can't drift from the app

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (fg: string, bg = '#FFFFFF') => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  const value = (hi + 0.05) / (lo + 0.05);
  return `${value.toFixed(1)}:1 ${value >= 7 ? 'AAA' : value >= 4.5 ? 'AA' : ''}`.trim();
};

const COLOR_GROUPS: Array<{ name: string; tokens: Array<keyof typeof theme.color>; text?: Array<keyof typeof theme.color> }> = [
  { name: 'Text', tokens: ['text', 'textSecondary', 'textMuted'], text: ['text', 'textSecondary', 'textMuted'] },
  { name: 'Surface & border', tokens: ['page', 'surfaceMuted', 'divider', 'border', 'borderStrong'] },
  { name: 'Accent', tokens: ['accent', 'accentHover', 'accentSoft'], text: ['accent'] },
  { name: 'Danger', tokens: ['danger', 'dangerSoft', 'dangerBorder'], text: ['danger'] },
  { name: 'Warning', tokens: ['warningText', 'warningSoft', 'warningBorder'], text: ['warningText'] },
];

const TYPE_USE: Record<string, string> = {
  xxl: 'Page titles',
  xl: 'Large numbers',
  lg: 'Section emphasis',
  md: 'Body, inputs, buttons',
  sm: 'Hints, meta, pills',
  xs: 'Avatar initials',
};

const STATUSES: Array<{ status: DisplayStatus; means: string; actions: string; why: string }> = [
  {
    status: 'Draft',
    means: 'Saved, never sent. Not owed yet.',
    actions: 'Edit · Send · Delete',
    why: 'Dashed outline reads as "not issued yet".',
  },
  { status: 'Open', means: 'Sent, not past due.', actions: 'Edit dates & memo · Record payment · Void', why: 'Blue. Active and healthy.' },
  {
    status: 'Overdue',
    means: 'Sent and past its due date.',
    actions: 'Edit dates & memo · Record payment · Void',
    why: 'Red-orange. Needs follow up.',
  },
  { status: 'Paid', means: 'Payment recorded. Closed.', actions: 'Download', why: 'Green. Done.' },
  { status: 'Void', means: 'Sent, then cancelled. Kept on record.', actions: 'Download', why: 'Filled gray. Closed, inactive.' },
];

// sample invoices for dueInfo(), measured from the seed data's "today"
const AS_OF = '2026-05-04';
const sample = (dueDate: string, overrides: Partial<Invoice> = {}) =>
  ({ status: 'Sent', paymentStatus: 'Open', paidDate: null, dueDate, ...overrides }) as Invoice;
const DUE_EXAMPLES = [
  { when: 'Past due', invoice: sample('2026-04-10', { paymentStatus: 'Overdue' }) },
  { when: 'Due today', invoice: sample('2026-05-04') },
  { when: 'Within 14 days', invoice: sample('2026-05-13') },
  { when: 'Later', invoice: sample('2026-06-03') },
  { when: 'Paid', invoice: sample('2026-05-16', { status: 'Paid', paymentStatus: 'Paid', paidDate: '2026-05-02' }) },
];

const PRINCIPLES = [
  [
    'Triage first',
    "Finance users ask what's owed, what's late and what to chase. Summary cards and due labels answer that before anything else.",
  ],
  ['Never rely on color alone', 'Status pills differ in shape and label, and every text color meets WCAG AA.'],
  ['Follow accounting rules', 'Only drafts can be deleted. Anything a customer has seen is voided so it stays on record.'],
  ['Only offer valid actions', "Menus show what the status allows and explain what's missing."],
  ['AI drafts, people decide', 'Draft from text fills the form and flags anything inferred. Nothing is saved without review.'],
];

export const DesignSystemPage = () => {
  const headingRef = useFocusOnReady<HTMLHeadingElement>(true);

  return (
    <Page>
      <div>
        <Title ref={headingRef} tabIndex={-1}>
          Design System
        </Title>
        <Subtitle>The tokens, components and status language behind the invoice workflow.</Subtitle>
      </div>

      <Section aria-labelledby="ds-principles">
        <SectionTitle id="ds-principles">Principles</SectionTitle>
        <Principles>
          {PRINCIPLES.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <Muted>{text}</Muted>
            </li>
          ))}
        </Principles>
      </Section>

      <Section aria-labelledby="ds-status">
        <SectionTitle id="ds-status">Status</SectionTitle>
        <Lede>One pill per invoice. Shape and color together, so status never relies on color alone.</Lede>
        <Table>
          <thead>
            <tr>
              <th scope="col">Pill</th>
              <th scope="col">Means</th>
              <th scope="col">Actions</th>
              <th scope="col">Why it looks this way</th>
            </tr>
          </thead>
          <tbody>
            {STATUSES.map((item) => (
              <tr key={item.status}>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>{item.means}</td>
                <td>{item.actions}</td>
                <td>
                  <Muted>{item.why}</Muted>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <GroupTitle>Lifecycle</GroupTitle>
        <Lifecycle>
          <Node>
            <StatusBadge status="Draft" />
            <Muted>created</Muted>
          </Node>
          <Arrow>send →</Arrow>
          <div>
            <Node>
              <StatusBadge status="Open" />
              <Muted>before due date</Muted>
            </Node>
            <Node>
              <StatusBadge status="Overdue" />
              <Muted>after due date</Muted>
            </Node>
          </div>
          <Arrow>record payment →</Arrow>
          <Node>
            <StatusBadge status="Paid" />
            <Muted>closed</Muted>
          </Node>
        </Lifecycle>
        <Muted as="p">
          Drafts can be deleted. Open and Overdue invoices are voided instead, which is final. Sending re-dates a draft to the send day.
        </Muted>
      </Section>

      <Cols>
        <Section aria-labelledby="ds-due">
          <SectionTitle id="ds-due">Due date labels</SectionTitle>
          <Lede>From dueInfo(), as of May 4, 2026.</Lede>
          <Table>
            <tbody>
              {DUE_EXAMPLES.map(({ when, invoice }) => {
                const due = dueInfo(invoice, AS_OF);
                return (
                  <tr key={when}>
                    <td>
                      <Muted>{when}</Muted>
                    </td>
                    <td style={{ color: theme.tone[due.tone], fontWeight: 500 }}>{due.label}</td>
                    <td>
                      <Muted>{due.detail}</Muted>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Section>

        <Section aria-labelledby="ds-banners">
          <SectionTitle id="ds-banners">Detail page banners</SectionTitle>
          <Lede>At most one, picked by bannerFor(). Open invoices due later and Paid ones show none.</Lede>
          <Grid $min="100%">
            <Banner $tone="late">This invoice is 24 days overdue. Follow up with Juniper Supply Co. or record a payment.</Banner>
            <Banner $tone="soon">Due in 9 days. The balance is still open.</Banner>
            <Banner $tone="neutral">Draft. Not sent to the customer yet, so it isn't in AR aging.</Banner>
          </Grid>
        </Section>
      </Cols>

      <Section aria-labelledby="ds-color">
        <SectionTitle id="ds-color">Color</SectionTitle>
        <Lede>Text tokens meet WCAG AA on white. Soft and border tints are backgrounds only.</Lede>
        {COLOR_GROUPS.map((group) => (
          <div key={group.name}>
            <GroupTitle>{group.name}</GroupTitle>
            <Grid $min="150px">
              {group.tokens.map((token) => (
                <Swatch key={token}>
                  <span style={{ background: theme.color[token] }} />
                  <div>
                    <Mono>color.{token}</Mono>
                    <Mono>{theme.color[token]}</Mono>
                    {group.text?.includes(token) && <Muted>{contrast(theme.color[token])} on white</Muted>}
                  </div>
                </Swatch>
              ))}
            </Grid>
          </div>
        ))}
      </Section>

      <Section aria-labelledby="ds-type">
        <SectionTitle id="ds-type">Typography</SectionTitle>
        <Lede>Inter, weights 400 / 500 / 600.</Lede>
        {Object.entries(theme.font.size)
          .reverse()
          .map(([key, size]) => (
            <Row key={key}>
              <Mono style={{ width: 80 }}>size.{key}</Mono>
              <Muted style={{ width: 40 }}>{size}</Muted>
              <span style={{ fontSize: size, fontWeight: key === 'xxl' ? 600 : 400, flex: 1 }}>INV-2026-0412 · Acme Labs</span>
              <Muted>{TYPE_USE[key]}</Muted>
            </Row>
          ))}
      </Section>

      <Section aria-labelledby="ds-components">
        <SectionTitle id="ds-components">Buttons & icons</SectionTitle>
        <Lede>One primary action per view. Icons sit on a 24×24 grid with a 1.8 stroke and are always paired with a visible label.</Lede>
        <Row>
          <Button variant="primary">Send invoice</Button>
          <Button>
            <Icon name="download" size={14} />
            Download
          </Button>
          <Button variant="ghost">
            <Icon name="sparkle" size={15} />
            Draft from text
          </Button>
          <Button variant="danger">Delete</Button>
          <Button disabled>Disabled</Button>
        </Row>
        <Grid $min="150px" style={{ marginTop: 16 }}>
          {ICON_NAMES.map((name) => (
            <IconTile key={name}>
              <Icon name={name} size={18} />
              <Mono>{name}</Mono>
            </IconTile>
          ))}
        </Grid>
      </Section>
    </Page>
  );
};
