import React, {ReactElement} from 'react'
import {ThemeProvider} from '@mui/material/styles'
import {getDefaultTheme} from './theme/SpecFromTenant'

const theme = getDefaultTheme()

export const DefaultThemeProvider = ({children}: { children: ReactElement }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
)

export const provideTheme = (children: ReactElement): ReactElement => {
  return (
    <DefaultThemeProvider>
      {children}
    </DefaultThemeProvider>
  )
}
