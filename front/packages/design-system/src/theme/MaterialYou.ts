interface Scheme {
  primary: number
  onPrimary
  primaryContainer: number
  onPrimaryContainer: number
  secondary: number
  onSecondary: number
  secondaryContainer: number
  onSecondaryContainer: number
  tertiary: number
  onTertiary: number
  tertiaryContainer: number
  onTertiaryContainer: number
  error: number
  onError: number
  errorContainer: number
  onErrorContainer: number
  surface: number
  onSurface: number
  surfaceContainer: number
  onSurfaceContainer: number
  outline: number
  surfaceVariant: number
  onSurfaceVariant: number
  inverseSurface: number
  inversePrimary: number
  inverseOnSurface: number
  background: number
  onBackground: number
}

export interface MaterialYouTheme {
  schemes: {
    light: Scheme
    dark: Scheme
  }
  palettes: {
    neutral: { tone: (n: number) => any },
    primary: { tone: (n: number) => any },
    secondary: { tone: (n: number) => any },
    tertiary: { tone: (n: number) => any },
    error: { tone: (n: number) => any }
    neutralVariant: { tone: (n: number) => any },
  }
  source: any
  customColors: any
}

export interface MaterialYouUtilities {
  themeFromSourceColor: (sourceColor: number) => MaterialYouTheme
  argbFromHex: (hex: string) => number
  applyTheme: (theme: MaterialYouTheme, target: any) => void
  hexFromArgb: (argb: number) => string
}
