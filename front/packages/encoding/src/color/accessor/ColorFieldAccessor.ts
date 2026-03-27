import {Accessor} from './ColorAccessor'
import {ColorLiteralAccessor} from './ColorLiteralAccessor'
import {ColorEncoding} from '../ColorEncoding'
import {Rows, Row, geti, Column} from '@hopara/dataset'
import {RgbaColor} from '../Colors'
import {isNil} from 'lodash/fp'

// Resolves color in case it should be calculated based on a row field
export class ColorFieldAccessor implements Accessor {
  private scale

  constructor(private colorEncoding:ColorEncoding) {
  }

  getColor(rows: Rows, row:Row, column?:Column): RgbaColor | undefined {
    const value = geti(this.colorEncoding.getField(), row)

    if (isNil(value)) {
      return new ColorLiteralAccessor(new ColorEncoding({...this.colorEncoding})).getColor()
    }

    if (this.colorEncoding.isManaged()) {
      return new ColorLiteralAccessor(new ColorEncoding({...this.colorEncoding, value})).getColor()
    }

    if (!this.scale) {
      this.scale = this.colorEncoding.getScaleFunction(rows, column, undefined)
    }
    return this.scale(value)
  }
}
