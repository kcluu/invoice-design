import styled, { css } from 'styled-components';

// hides content visually but keeps it in the accessibility tree
export const visuallyHidden = css`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

export const Hidden = styled.span`
  ${visuallyHidden}
`;
