import { RgbaColor } from '@hopara/encoding'

export const getRgbaStyle = (color?:RgbaColor) => {
  if (!color) {
    return 'inherit'
  }

  return `rgba(${color.join(',')})`
}
