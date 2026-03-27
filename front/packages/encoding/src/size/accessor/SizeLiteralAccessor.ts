import { SizeEncoding } from '../SizeEncoding'

export class SizeLiteralAccessor {
  sizeEncoding: SizeEncoding

  constructor(sizeEnconding: SizeEncoding) {
    this.sizeEncoding = sizeEnconding
  }

  getSize() : number {
    return this.sizeEncoding.getRenderValue()
  }
}
