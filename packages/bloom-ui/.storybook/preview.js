import '../src/styles/global.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { DefaultTheme } from '@bloom-trade/themes'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const withMuiTheme = (Story) => (
  <ThemeProvider theme={DefaultTheme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
)

export const decorators = [withMuiTheme]
