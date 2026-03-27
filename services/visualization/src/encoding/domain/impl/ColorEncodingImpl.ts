import {ColorAnimation} from '../spec/Animation.js'
import {ColorEncoding as ColorEncodingSpec, ColorLiteral, ColorScale} from '../spec/ColorEncoding.js'
import {ColorCondition} from '../spec/Condition.js'

const DEFAULT_SCHEME = 'redyellowgreen'

export class ColorEncodingImpl {
  field?: string
  value: ColorLiteral
  opacity?: number
  saturation?: number
  scale?: ColorScale
  animation?: ColorAnimation
  conditions?: ColorCondition[]

  constructor(props?: ColorEncodingSpec) {
    Object.assign(this, {...(props ?? {})})
    if (!this.scale) {
      this.scale = {scheme: DEFAULT_SCHEME}
    }
  }
}
