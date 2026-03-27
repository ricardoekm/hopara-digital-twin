import {Components} from './ThemeComponents'

export {ThemeProvider, CssBaseline} from '@mui/material'
import {
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  Palette as MuiPalette,
  PaletteColor,
  TypeText as MuiTypeText,
} from '@mui/material/styles'
import {Shape as MuiShape} from '@mui/system/createTheme/shape'
import {ThemeSpec} from './ThemeSpec'
import {getThemeFactory} from './SpecFromTenant'

interface Shape extends MuiShape {
  paddingInner: number
}

interface TypeText extends MuiTypeText {
  component: string
}

export interface Palette extends MuiPalette {
  hue: number,
  contrast: boolean,
  original: {main: string, contrastText: string},
  tertiary: PaletteColor
  text: TypeText,
  spec: ThemeSpec
}

interface HoparaShape extends Shape {
  paddingInner: number
  borderLight: string
}

export interface Theme extends MuiTheme {
  shape: HoparaShape
  components: Components
  palette: Palette
}

// allow configuration using `createTheme`
export interface ThemeOptions extends MuiThemeOptions {
  shape: Shape
  components: Components
  palette: Palette
}


export const createThemeFromTenant = (tenant: string, mode: string): Theme => {
  return getThemeFactory().getSpec(tenant, mode).toTheme()
}

export const userPrefersDarkMode = (): boolean => {
  return window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches
}
