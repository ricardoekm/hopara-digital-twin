import { rgbColor } from './Colors'
import {getScheme, getHexScheme, getRgbScheme, getColor, getSteps} from './Schemes'

test('Get Scheme', () => {
  expect(getHexScheme('purpleblue')).toStrictEqual({
    name: 'purpleblue',
    colors: [
      '#c8cee4',
      '#b1c3de',
      '#97b7d8',
      '#7bacd1',
      '#5b9fc9',
      '#3a90c0',
      '#1e7fb7',
      '#0b70ab',
    ],
  })
})

test('Get Custom Scheme', () => {
  expect(getHexScheme('greenyellowred')).toStrictEqual({
    name: 'greenyellowred',
    colors: [
      '#2e7d32',
      '#ffc107',
      '#f44336',
    ],
  })

  expect(getHexScheme('graygreen')).toStrictEqual({
    name: 'graygreen',
    colors: [
      '#7f7f7f',
      '#2e7d32',
    ],
  })
})

test('Get Color Scheme', () => {
  const colors = ['#7f7f7f', '#2e7d32']
  expect(getColor(colors, 0)).toEqual('#7f7f7f')
  expect(getColor(colors, 0.2)).toEqual('#7f7f7f')
  expect(getColor(colors, 0.4)).toEqual('#7f7f7f')
  expect(getColor(colors, 0.6)).toEqual('#2e7d32')
  expect(getColor(colors, 0.8)).toEqual('#2e7d32')
  expect(getColor(colors, 1)).toEqual('#2e7d32')
  expect(getColor(colors, 2)).toEqual('#2e7d32')
})

test('Get Steps', () => {
  expect(getSteps(3)).toEqual([0.0, 0.5, 1.0])
  expect(getSteps(6)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
  expect(getSteps(1)).toEqual([0.0])
})


test('Get Scheme is case insensitive', () => {
  expect(getHexScheme('PurpleBlue')).toStrictEqual({
    name: 'purpleblue',
    colors: [
      '#c8cee4',
      '#b1c3de',
      '#97b7d8',
      '#7bacd1',
      '#5b9fc9',
      '#3a90c0',
      '#1e7fb7',
      '#0b70ab',
    ],
  })
})

test('Returns default Scheme if not found', () => {
  expect(getHexScheme('any-scheme')).toStrictEqual({
    name: 'redyellowgreen',
    colors: [
      '#d4322c',
      '#f16e43',
      '#fcac63',
      '#fedd8d',
      '#f9f7ae',
      '#d7ee8e',
      '#a4d86e',
      '#64bc61',
    ],
  })
})

test('Get RGB Scheme', () => {
  expect(getRgbScheme('yellowgreen')).toStrictEqual({
    name: 'yellowgreen',
    colors: [
      [209, 236, 160, 255],
      [185, 226, 148, 255],
      [158, 214, 136, 255],
      [128, 201, 124, 255],
      [98, 187, 110, 255],
      [71, 170, 94, 255],
      [50, 151, 80, 255],
      [32, 131, 68, 255],
    ],
  })
})

test('Opacity adds alpha to color RGB', () => {
  const Scheme = getRgbScheme('yellowgreen', false, 0.5)
  const alphaIndex = 3

  expect(Scheme.colors[0][alphaIndex]).toBe(127)
})

test('Get reversed RGB Scheme', () => {
  expect(getRgbScheme('yellowgreen', true)).toStrictEqual({
    'name': 'yellowgreen-reversed',
    'colors': [
      [32, 131, 68, 255],
      [50, 151, 80, 255],
      [71, 170, 94, 255],
      [98, 187, 110, 255],
      [128, 201, 124, 255],
      [158, 214, 136, 255],
      [185, 226, 148, 255],
      [209, 236, 160, 255],
    ],
  })
})

test('get discrete Schemes', () => {
  expect(getScheme('accent')).toStrictEqual({
    'name': 'accent',
    'colors': [
      rgbColor('#7fc97f'),
      rgbColor('#beaed4'),
      rgbColor('#fdc086'),
      rgbColor('#ffff99'),
      rgbColor('#386cb0'),
      rgbColor('#f0027f'),
      rgbColor('#bf5b17'),
      rgbColor('#666666'),
    ],
  })

  expect(getScheme('blues')).toStrictEqual({
    'name': 'blues',
    'colors': [
      rgbColor('rgb(190, 216, 236)'),
      rgbColor('rgb(168, 206, 229)'),
      rgbColor('rgb(143, 193, 222)'),
      rgbColor('rgb(116, 178, 215)'),
      rgbColor('rgb(91, 163, 207)'),
      rgbColor('rgb(69, 146, 198)'),
      rgbColor('rgb(49, 129, 189)'),
      rgbColor('rgb(32, 111, 178)'),
    ],
  })
})
