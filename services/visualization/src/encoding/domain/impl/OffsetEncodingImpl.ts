import {OffsetAxisEncoding, OffsetEncoding as OffsetEncodingSpec} from '../spec/OffsetEncoding.js'

export class OffsetEncodingImpl {
  x?: OffsetAxisEncoding
  y?: OffsetAxisEncoding

  constructor({x, y}: OffsetEncodingSpec = {}) {
    this.x = x ?? {value: 0}
    this.y = y ?? {value: 0}
  }
}
