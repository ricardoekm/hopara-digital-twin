import {memoize} from '@hopara/memoize'
import {scheme as vegaScheme} from 'vega'
import {ColorFormat} from '..'
import {rgbColor, toRGBArray} from './Colors'
import {RGBColor} from 'd3/dist/d3.min'
import {isArray, isFunction} from 'lodash/fp'

export const continuous = [
  'greenred',
  'greenyellowred',
  'whiteyellowred',
  'greens',
  'reds',
  'blues',
  'redPurple',
  'redGrey',
  'redYellowGreen',
]

export const discrete = [
  'graygreen',
  'accent',
  'category10',
  'category20',
  'category20b',
  'category20c',
  'tableau10',
  'tableau20',
  'material700',
  'set1',
  'set2',
  'set3',
]

export const getColor = (colors: any, step: number) => {
  if (isFunction(colors)) {
    return colors(step)
  }

  if (isArray(colors)) {
    const index = (colors.length - 1) * step
    if (index >= colors.length) {
      return colors[colors.length - 1]
    }

    return colors[Math.round(index)]
  }

  return '#000000'
}

export const getSteps = (count: number) => {
  if (count <= 1) {
    return [0]
  }

  return Array.from(Array(count), (_, i) =>
    i / (count - 1),
  )
}

export const getSchemes = (schemeNames: string[], count?: number) => {
  if (count) {
    const steps = getSteps(count)
    return Object.fromEntries(schemeNames.map((name: string) => {
      let colors = vegaScheme(name)
      colors = steps.map((step) => getColor(colors, step))
      return [name.toLowerCase(), colors]
    }))
  }
  return Object.fromEntries(schemeNames.map((name: string) => {
    return [name.toLowerCase(), vegaScheme(name)]
  }))
}

export const getContinuousSchemes = (count: number) => {
  return getSchemes(continuous, count)
}

export const getDiscreteSchemes = (count?: number): any => {
  return getSchemes(discrete, count)
}

vegaScheme('greenred', [
  '#2e7d32',
  '#f44336',
])

vegaScheme('greenyellowred', [
  '#2e7d32',
  '#ffc107',
  '#f44336',
])

vegaScheme('whiteyellowred', [
  '#ffffff',
  '#ffc107',
  '#f44336',
])

vegaScheme('graygreen', [
  '#7f7f7f',
  '#2e7d32',
])

vegaScheme('material700', [
  '#388e3c',
  '#303f9f',
  '#d32f2f',
  '#fbc02d',
  '#689f38',
  '#616161',
  '#0288d1',
  '#e64a19',
  '#00796b',
  '#5d4037',
  '#f57c00',
  '#512da8',
  '#455a64',
  '#c2185b',
  '#afb42b',
  '#1976d2',
  '#ffa000',
  '#7b1fa2',
  '#0097a7',
  '#0097a7',
])

export const DEFAULT_COLOR_SCHEME = 'redYellowGreen'

export type Scheme = {
  name: string,
  colors: RGBColor[]
}

export type HexScheme = {
  name: string,
  colors: string[]
}

export type RgbScheme = {
  name: string,
  colors: [number, number, number, number?][]
}

const seqPaletteSteps = Array.from({length: 8}, (_, i) => (i + 1) / 10)

export function getScheme(paletteName: string): Scheme | null {
  const name = paletteName.toLocaleLowerCase()

  let colors = vegaScheme(paletteName)
  if (!colors) return null

  if (typeof colors === 'function') {
    colors = seqPaletteSteps.map((step) => rgbColor(colors(step)))
  } else {
    colors = colors.map((c) => rgbColor(c))
  }

  if (!colors.length) return null

  return {
    name,
    colors,
  }
}

const getOpacity = (alpha = 255): number => {
  return alpha / 255
}

export const getCustomScheme = (scheme: string[] | number[][]): Scheme => {
  return {
    name: 'custom',
    colors: scheme.map((color) => {
      if (Array.isArray(color)) {
        return rgbColor(`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${getOpacity(color[3])})`)
      }
      return rgbColor(color)
    }),
  }
}

export function formatColorScheme(scheme: string | string[] | undefined, colorFormat: ColorFormat, opacity = 1): HexScheme | RgbScheme {
  let colorScheme
  if (typeof scheme === 'string') {
    colorScheme = getScheme(scheme.toLocaleLowerCase())
  } else if (Array.isArray(scheme)) {
    colorScheme = getCustomScheme(scheme)
  }
  if (!colorScheme) {
    colorScheme = getScheme(DEFAULT_COLOR_SCHEME) as Scheme
  }

  return {
    name: colorScheme.name,
    colors: colorScheme.colors.map((c) => {
      const color = c.copy({opacity})
      if (colorFormat === ColorFormat.hex) return color.formatHex()
      return toRGBArray(color)
    }),
  }
}

export function getHexScheme(scheme?: string | string[], reverse = false): HexScheme {
  const colorScheme = formatColorScheme(scheme, ColorFormat.hex) as HexScheme
  if (reverse) return {name: `${colorScheme.name}-reversed`, colors: [...colorScheme.colors].reverse()}
  return colorScheme
}

// Fast-memoize doesnt work with default parameters, don't add it
function doGetRgbScheme(name: string | undefined, reverse: boolean, opacity: number): RgbScheme {
  const colorScheme = formatColorScheme(name, ColorFormat.rgb, opacity) as RgbScheme
  if (reverse) return {name: `${colorScheme.name}-reversed`, colors: [...colorScheme.colors].reverse()}
  return colorScheme
}

const getRgbSchemeCache = memoize(doGetRgbScheme)

export function getRgbScheme(scheme?: string | string[], reverse = false, opacity = 1): RgbScheme {
  return getRgbSchemeCache(scheme, reverse, opacity)
}
