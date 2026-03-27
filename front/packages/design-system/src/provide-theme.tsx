import React, {ReactElement} from 'react'
import {ThemeProvider} from '@mui/material/styles'
import {ThemeSpec} from './theme/ThemeSpec'
import {MaterialYouUtilities} from './theme/MaterialYou'

export const provideTheme = (child: ReactElement): ReactElement => {
  const scheme = {
    primary: 0,
    onPrimary: 0,
    primaryContainer: 0,
    onPrimaryContainer: 0,
    secondary: 0,
    onSecondary: 0,
    secondaryContainer: 0,
    onSecondaryContainer: 0,
    tertiary: 0,
    onTertiary: 0,
    tertiaryContainer: 0,
    onTertiaryContainer: 0,
    error: 0,
    onError: 0,
    errorContainer: 0,
    onErrorContainer: 0,
    surface: 0,
    onSurface: 0,
    surfaceContainer: 0,
    onSurfaceContainer: 0,
    outline: 0,
    surfaceVariant: 0,
    onSurfaceVariant: 0,
    inverseSurface: 0,
    inversePrimary: 0,
    inverseOnSurface: 0,
    background: 0,
    onBackground: 0,
  }

  const fakeMaterialYouUtilities = {
    themeFromSourceColor: () => ({
      schemes: {
        light: scheme,
        dark: scheme,
      },
      palettes: {
        neutral: {tone: () => 0},
        primary: {tone: () => 0},
        secondary: {tone: () => 0},
        tertiary: {tone: () => 0},
        error: {tone: () => 0},
        neutralVariant: {tone: () => 0},
      },
      source: {},
      customColors: {},
    }),
    argbFromHex: () => 0,
    applyTheme: () => undefined,
    hexFromArgb: () => '#000000',
  } as MaterialYouUtilities

  const theme = ThemeSpec.fromBrand({
    logoUrl: 'any-logo-url',
    logoSmallUrl: 'any-logo-small-url',
    color: '#000000',
  }, fakeMaterialYouUtilities).toTheme()

  return (
    <ThemeProvider theme={theme}>
      {child}
    </ThemeProvider>
  )
}
