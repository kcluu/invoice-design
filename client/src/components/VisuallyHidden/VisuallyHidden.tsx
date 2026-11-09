import type { ReactNode } from 'react';
import { Hidden } from './VisuallyHidden.styled';

interface VisuallyHiddenProp {
  children: ReactNode;
  id?: string;
}

export const VisuallyHidden = ({ children, id }: VisuallyHiddenProp) => <Hidden id={id}>{children}</Hidden>;
