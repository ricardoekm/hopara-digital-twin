import {SizeAnimation} from '../spec/Animation.js'
import {SizeScale} from '../spec/SizeEncoding.js'

export class SizeEncodingImpl {
  animation?: SizeAnimation
  scale?: SizeScale
  value: number
  field?: string
  multiplier?: number
  referenceZoom?: number

  constructor(props: Partial<SizeEncodingImpl>) {
    Object.assign(this, {...(props ?? {})})
  }
}
