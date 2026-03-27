import {createTheme as muiCreateTheme, getLuminance} from '@mui/material/styles'
import {MaterialYouUtilities} from './MaterialYou'
import {createComponents} from './ThemeComponents'
import {Palette, Theme, ThemeOptions} from './Theme'
import colorsys from 'colorsys'
import { TenantBrand } from './TenantBrand'

export class ThemeSpec {
  mode: 'light' | 'dark'

  logoUrl?: string
  logoSmallUrl?: string

  original: string
  onOriginal: string

  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string

  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string

  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string

  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string

  background: string
  onBackground: string
  onBackgroundLight: string
  surface: string
  onSurface: string

  outline: string
  surfaceVariant: string
  onSurfaceVariant: string

  inverseSurface: string
  inversePrimary: string
  inverseOnSurface: string

  borderRadius: number
  fontSize: number

  inputBackground: string
  inputBackgroundDisabled: string
  inputBackgroundHover: string
  inputBackgroundActive: string
  backgroundBlur: string
  inputColorDisabled: string

  buttonBackground: string
  buttonBackgroundHover: string

  selectBackground: string
  selectBackgroundHover: string

  success: string
  borderColor: string
  listItem: string

  foregroundCanvasButton: string
  foregroundCanvasButtonHover: string
  foregroundCanvasButtonActive: string
  backgroundCanvasButton: string
  backgroundCanvasButtonHover: string
  backgroundCanvasButtonActive: string
  shadowCanvasButton: string
  editAccentColor: string

  tabColorForeground: string
  tabColorBackground: string
  accentTabColorForeground: string
  accentTabColorBackground: string

  emptyStateBackgroundColor: string
  foregroundEmptyStateBackgroundColor: string
  linkEmptyStateBackgroundColor: string
  linkEmptyStateBackgroundColorHover: string
  tableBackgroundStripedEven: string
  tableBackgroundStripedOdd: string
  tableBorder: string

  tabColorText: string

  listBackground: string
  itemBackgroundHover: string
  itemBackgroundActive: string

  backgroundListActionButton: string

  backgroundLegendView: string

  backgroundPanel: string

  foregroundPanelButton: string
  foregroundPanelButtonHover: string
  foregroundPanelButtonActive: string
  backgroundPanelButton: string
  backgroundPanelButtonHover: string
  backgroundPanelButtonActive: string
  shadowPanelButton: string

  backgroundPanelPillButton: string
  backgroundPanelPillButtonHover: string
  backgroundPanelPillButtonPrimary: string
  backgroundPanelPillButtonPrimaryHover: string
  shadowPanelPillButton: string

  backgroundObjectEditorTab: string
  backgroundObjectEditorTabContainer: string

  tonal: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    tertiary: Record<string, string>;
    error: Record<string, string>;
    neutral: Record<string, string>;
    neutralVariant: Record<string, string>;
  }
  palette: any

  spotlightLinkBackground: string
  spotlightLinkForeground: string

  constructor(props: Partial<ThemeSpec>) {
    Object.assign(this, props)
  }

  static fromBrand(
    tenantBrand: TenantBrand,
    materialYouUtilities: MaterialYouUtilities,
    mode?: string,
  ): ThemeSpec {
    const {themeFromSourceColor, argbFromHex, applyTheme, hexFromArgb} =
      materialYouUtilities
    const materialYou = themeFromSourceColor(argbFromHex(tenantBrand.color))
    applyTheme(materialYou, {target: document.body})

    const luminance = getLuminance(tenantBrand.color)
    const onOriginalLight = hexFromArgb(materialYou.palettes.primary.tone(30))
    const onOriginalDark = hexFromArgb(materialYou.palettes.primary.tone(95))

    const tones = new Array(21).fill(0).map((_, i) => i * 5)

    const dark = mode === 'dark'

    const material = dark ? materialYou.schemes.dark : materialYou.schemes.light

    return new ThemeSpec({
      mode: dark ? 'dark' : 'light',

      inputBackground: dark ? '#0D0D0D' : '#F2F2F2',
      inputBackgroundDisabled: dark ? '#0A0A0A' : '#F5F5F5',
      inputBackgroundHover: dark ? '#2E2E2E' : '#E6E6E6',
      inputBackgroundActive: dark ? '#2E2E2E' : '#E6E6E6',
      inputColorDisabled: dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',

      buttonBackground: dark ? 'hsla(0, 0%, 100%, 0.15)' : 'hsla(0, 0%, 100%, 1)',
      buttonBackgroundHover: dark ? 'hsla(0, 0%, 100%, 0.20)' : 'hsla(0, 0%, 100%, 1)',

      selectBackground: dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)',
      selectBackgroundHover: dark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.09)',

      success: dark ? '#76DC81' : '#02BD58',

      borderColor: dark ? '#2B2B2B' : '#E6E6E6',

      listItem: dark ? 'rgba(256,256,256,0.05)' : 'rgba(0,0,0,0.05)',
      listBackground: dark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.05)',
      itemBackgroundHover: dark ? '#141414' : '#F7F7F7',
      itemBackgroundActive: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',

      foregroundCanvasButton: dark ? 'hsla(0, 0%, 93%, 1)' : 'hsla(0, 0%, 7%, 1)',
      foregroundCanvasButtonHover: dark ? 'hsla(0, 0%, 100%, 1)' : 'hsla(0, 0%, 40%, 1)',
      foregroundCanvasButtonActive: dark ? 'hsla(0, 0%, 100%, 1)' : 'hsla(0, 0%, 40%, 1)',
      backgroundCanvasButton: dark ? 'hsla(0, 0%, 0%, 0.8)' : 'hsla(0, 0%, 100%, 0.75)',
      backgroundCanvasButtonHover: dark ? 'hsla(0, 0%, 0%, 1)' : 'hsla(0, 0%, 100%, 1)',
      backgroundCanvasButtonActive: dark ? 'hsla(0, 0%, 0%, 1)' : 'hsla(0, 0%, 100%, 1)',
      shadowCanvasButton: dark ? '0 0 0 1px rgba(255,255,255,0.1), 0 1px 2px 0 rgba(0,0,0,0.50)' : '0 0 0 1px rgba(0,0,0,0.05), 0 1px 3px -0.5px rgba(0,0,0,0.20)',

      foregroundPanelButton: dark ? 'hsla(0, 0%, 93%, 1)' : 'hsla(0, 0%, 7%, 0.33)',
      foregroundPanelButtonHover: dark ? 'hsla(0, 0%, 100%, 1)' : 'hsla(0, 0%, 7%, 0.5)',
      foregroundPanelButtonActive: dark ? 'hsla(0, 0%, 100%, 1)' : 'hsla(0, 0%, 7%, 0.5)',
      backgroundPanelButton: dark ? 'hsla(0, 0%, 0%, 0)' : 'hsla(0, 0%, 100%, 0)',
      backgroundPanelButtonHover: dark ? 'hsla(0, 0%, 100%, 0.15)' : 'hsla(0, 0%, 95%, 0.5)',
      backgroundPanelButtonActive: dark ? 'hsla(0, 0%, 100%, 0.15)' : 'hsla(0, 0%, 95%, 0.5)',


      tabColorText: hexFromArgb(materialYou.schemes.light.onPrimary),
      editAccentColor: hexFromArgb(materialYou.schemes.light.primary),

      tabColorForeground: dark ? hexFromArgb(materialYou.palettes.primary.tone(90)) : hexFromArgb(materialYou.palettes.primary.tone(35)),
      tabColorBackground: dark ? hexFromArgb(materialYou.palettes.primary.tone(40)) : hexFromArgb(materialYou.palettes.primary.tone(95)),
      accentTabColorForeground: hexFromArgb(materialYou.schemes.light.onPrimary),
      accentTabColorBackground: hexFromArgb(materialYou.schemes.light.primary),

      tableBorder: dark ? 'rgba(255,255,255,0.1)' : 'hsla(0, 0%, 90%, 1)',

      emptyStateBackgroundColor: dark ? hexFromArgb(materialYou.palettes.primary.tone(30)) : hexFromArgb(materialYou.palettes.primary.tone(95)),
      foregroundEmptyStateBackgroundColor: dark ? hexFromArgb(materialYou.palettes.primary.tone(90)) : hexFromArgb(materialYou.palettes.primary.tone(10)),
      linkEmptyStateBackgroundColor: dark ? hexFromArgb(materialYou.palettes.primary.tone(10)) : hexFromArgb(materialYou.palettes.primary.tone(90)),
      linkEmptyStateBackgroundColorHover: dark ? hexFromArgb(materialYou.palettes.primary.tone(20)) : hexFromArgb(materialYou.palettes.primary.tone(90)),

      backgroundPanel: dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',


      backgroundObjectEditorTab: dark ? 'rgba(113,113,113,1)' : 'rgba(255,255,255,1)',
      backgroundObjectEditorTabContainer: dark ? 'rgba(60,60,60,1)' : 'rgba(242,242,242,1)',

      // Hopara Specs

      borderRadius: 3,
      fontSize: 12,
      backgroundBlur: 'blur(9px)',

      // Tenant

      logoUrl: tenantBrand.logoUrl,
      logoSmallUrl: tenantBrand.logoSmallUrl,
      original: tenantBrand.color,
      onOriginal: luminance > 0.4 ? onOriginalLight : onOriginalDark,

      primary: hexFromArgb(material.primary),
      onPrimary: hexFromArgb(material.onPrimary),
      primaryContainer: hexFromArgb(material.primaryContainer),
      onPrimaryContainer: hexFromArgb(material.onPrimaryContainer),

      secondary: hexFromArgb(material.secondary),
      onSecondary: hexFromArgb(material.onSecondary),
      secondaryContainer: hexFromArgb(material.secondaryContainer),
      onSecondaryContainer: hexFromArgb(material.onSecondaryContainer),

      tertiary: hexFromArgb(material.tertiary),
      onTertiary: hexFromArgb(material.onTertiary),
      tertiaryContainer: hexFromArgb(material.tertiaryContainer),
      onTertiaryContainer: hexFromArgb(material.onTertiaryContainer),

      error: hexFromArgb(material.error),
      onError: hexFromArgb(material.onError),
      errorContainer: hexFromArgb(material.errorContainer),
      onErrorContainer: hexFromArgb(material.onErrorContainer),

      surface: hexFromArgb(material.surface),
      onSurface: hexFromArgb(material.onSurface),
      background: hexFromArgb(material.background),
      onBackground: hexFromArgb(material.onBackground),
      onBackgroundLight: hexFromArgb(materialYou.palettes.neutral.tone(50)),

      outline: hexFromArgb(material.outline),

      surfaceVariant: hexFromArgb(material.surfaceVariant),
      onSurfaceVariant: hexFromArgb(material.onSurfaceVariant),
      inverseSurface: hexFromArgb(material.inverseSurface),
      inversePrimary: hexFromArgb(material.inversePrimary),
      inverseOnSurface: hexFromArgb(material.inverseOnSurface),

      backgroundListActionButton: dark ? 'rgba(255,255,255,0.05)' : 'transparent',

      backgroundLegendView: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)',

      backgroundPanelPillButton: dark
        ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        : 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
      backgroundPanelPillButtonHover: dark
        ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)'
        : 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
      backgroundPanelPillButtonPrimary: dark
        ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        : 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
      backgroundPanelPillButtonPrimaryHover: dark
        ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)'
        : 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
      shadowPanelPillButton: dark
        ? '0 0 0 1px rgba(255,255,255,0.1), 0 1px 3px 0 rgba(0,0,0,0.20)'
        : '0 0 0 1px rgba(0,0,0,0.08), 0 1px 3px 0 rgba(0,0,0,0.20)',

      tonal: {
        primary: Object.fromEntries(
          tones.map((tone) => [
            tone,
            hexFromArgb(materialYou.palettes.primary.tone(tone)),
          ]),
        ),
        secondary: Object.fromEntries(
          tones.map((tone) => [
            tone,
            hexFromArgb(materialYou.palettes.secondary.tone(tone)),
          ]),
        ),
        tertiary: Object.fromEntries(
          tones.map((tone) => [
            tone,
            hexFromArgb(materialYou.palettes.tertiary.tone(tone)),
          ]),
        ),
        error: Object.fromEntries(
          tones.map((tone) => [
            tone,
            hexFromArgb(materialYou.palettes.error.tone(tone)),
          ]),
        ),
        neutral: Object.fromEntries(
          tones.map((tone) => [
            tone,
            hexFromArgb(materialYou.palettes.neutral.tone(tone)),
          ]),
        ),
        neutralVariant: Object.fromEntries(
          tones.map((tone) => [
            tone,
            hexFromArgb(materialYou.palettes.neutralVariant.tone(tone)),
          ]),
        ),
      },
      spotlightLinkBackground: dark
        ? hexFromArgb(materialYou.palettes.neutralVariant.tone(0))
        : hexFromArgb(materialYou.palettes.primary.tone(95)),
      spotlightLinkForeground: dark
        ? hexFromArgb(materialYou.palettes.primary.tone(60))
        : hexFromArgb(materialYou.palettes.primary.tone(20)),
    })
  }

  toTheme() {
    const luminance = getLuminance(this.original)
    const dark = this.mode === 'dark'
    return muiCreateTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
      palette: {
        hue: colorsys.rgb_to_hsl(colorsys.parseCss(this.primary)).h,
        contrast: luminance <= 0.4,
        spec: this,
        mode: this.mode,

        original: {
          main: this.original,
          contrastText: this.onOriginal,
        },

        primary: {
          main: this.primary,
          light: this.primaryContainer,
          contrastText: this.onPrimary,
          dark: this.onPrimaryContainer,
        },

        secondary: {
          main: this.secondary,
          light: this.secondaryContainer,
          contrastText: this.onSecondary,
          dark: this.onSecondaryContainer,
        },

        tertiary: {
          main: this.tertiary,
          light: this.tertiaryContainer,
          contrastText: this.onTertiary,
          dark: this.onTertiaryContainer,
        },

        error: {
          main: this.tonal.error[50],
          light: this.tonal.error[70],
          contrastText: this.tonal.error[50],
          dark: this.tonal.error[20],
        },

        background: {
          default: dark ? this.background : 'white',
        },

        text: {
          primary: this.onBackground,
          secondary: this.onSurface,
          component: this.onBackgroundLight,
          disabled: this.onBackgroundLight,
        },
      } as any as Palette,
      shape: {
        borderRadius: this.borderRadius,
        paddingInner: this.fontSize,
      },
      typography: {
        fontSize: this.fontSize,
        fontFamily: 'custom, Inter, sans-serif',
      },
      spacing: 1,
      components: createComponents(this),
    } as ThemeOptions) as Theme
  }
}
