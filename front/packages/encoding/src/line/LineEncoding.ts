import { BaseEncoding } from '../BaseEncoding'

export enum LineCap {
  BUTT = 'butt',
  ROUND = 'round',
}

export class LineEncoding extends BaseEncoding<LineEncoding> {
  segmentLength?: number
  cap?: LineCap
  animation?: {
    speed?: number
  }
  
  group?: { 
    field: string
  }

  constructor(props?: Partial<LineEncoding>) {
    super()
    Object.assign(this, props)
  }

  isRenderable(): boolean {
    return true
  }
}
