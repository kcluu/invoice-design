import type { ComponentProps } from 'react';
import { StyledButton, type ButtonSize, type ButtonVariant } from './Button.styled';

interface ButtonProp extends Omit<ComponentProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({ variant = 'secondary', size = 'md', type = 'button', ...rest }: ButtonProp) => (
  <StyledButton type={type} $variant={variant} $size={size} {...rest} />
);
