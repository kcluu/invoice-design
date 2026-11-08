import type { DisplayStatus } from '../types/invoice'
import type { DueTone } from '../utils/invoiceStatus'

export const theme = {
  color: {
    page: '#FFFFFF',
    sidebar: '#F7F7F5',
    surfaceMuted: '#F7F7F5',
    border: '#E6E6E2',
    borderStrong: '#D9D9D4',
    divider: '#EFEFEB',
    text: '#1A1A19',
    textSecondary: '#55554F',
    textMuted: '#8A8A84',
    accent: '#1F5A44',
    accentHover: '#173F31',
    accentSoft: '#E8F0EC',
    danger: '#B3261E',
    dangerSoft: '#FDF0EE',
    dangerBorder: '#F0C9C2',
    warningText: '#8A5300',
    warningSoft: '#FFF7E6',
    warningBorder: '#F1DDB0',
    skeleton: '#E9E9E5',
    overlay: 'rgba(20, 20, 19, 0.38)',
  },
  status: {
    Draft: { bg: '#EFEFEC', fg: '#4A4A47' },
    Open: { bg: '#E7EFFA', fg: '#1D4E89' },
    Overdue: { bg: '#FCEAE3', fg: '#9A3412' },
    Paid: { bg: '#E5F3EA', fg: '#1E6B43' },
    Void: { bg: '#EFEFEC', fg: '#8A8A84' },
  } satisfies Record<DisplayStatus, { bg: string; fg: string }>,
  tone: {
    normal: '#1A1A19',
    soon: '#B26B00',
    late: '#C2410C',
    muted: '#8A8A84',
  } satisfies Record<DueTone, string>,
  radius: { sm: '6px', md: '8px', lg: '10px', xl: '12px', pill: '999px' },
  font: {
    family: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    size: { xs: '11px', sm: '12px', md: '13px', lg: '15px', xl: '18px', xxl: '22px' },
  },
  shadow: {
    menu: '0 8px 24px rgba(20, 20, 19, 0.12)',
    dialog: '0 20px 48px rgba(20, 20, 19, 0.2)',
  },
  layout: { sidebarWidth: '232px', gutter: '28px' },
}

export type AppTheme = typeof theme
