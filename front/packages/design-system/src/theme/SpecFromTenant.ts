import { Theme } from './Theme'
import { ThemeFactory } from './ThemeFactory'
import { HoparaThemeFactory } from './hopara/HoparaThemeFactory'

export function getThemeFactory(): ThemeFactory {
  return new HoparaThemeFactory()
}

export const getDefaultTheme = (): Theme => {
  const dark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return getThemeFactory().getSpec('hopara.io', dark ? 'dark' : 'light').toTheme()
}
