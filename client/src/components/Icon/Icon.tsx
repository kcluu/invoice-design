import { StyledIcon } from './Icon.styled';

// svg path data on a 24x24 grid, stroked
const ICON_PATHS = {
  launchpad: 'M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-4H4zM14 4v4h6V4z',
  ledger: 'M5 4h14v16H5zM9 8h6M9 12h6M9 16h3',
  receivable: 'M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6',
  payable: 'M4 7h16v12H4zM4 11h16M8 15h3',
  reports: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevronDown: 'M6 9l6 6 6-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  pencil: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  sparkle: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z',
};

export type IconName = keyof typeof ICON_PATHS;

interface IconProp {
  name: IconName;
  size?: number;
}

// decorative only, so it's hidden from screen readers and the visible label carries the meaning
export const Icon = ({ name, size = 16 }: IconProp) => (
  <StyledIcon width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d={ICON_PATHS[name]} />
  </StyledIcon>
);
