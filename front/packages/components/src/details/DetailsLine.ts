import { RgbaColor } from '@hopara/encoding'

// A ready to show details, used for presentation purposes
export type DetailsLine = {
  title: string
  value?: string
  image?: string
  color?: RgbaColor
}
