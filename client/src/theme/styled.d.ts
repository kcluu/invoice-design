import 'styled-components';
import type { AppTheme } from './theme';

declare module 'styled-components' {
  // lets styled components read theme tokens with full types
  export interface DefaultTheme extends AppTheme {}
}
