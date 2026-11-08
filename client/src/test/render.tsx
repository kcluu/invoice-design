import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../theme/theme'

// styled components read tokens from the theme, so tests need the provider too
export const renderWithTheme = (ui: ReactElement) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
