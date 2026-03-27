import {Accessor} from './ColorAccessor'
import {ColorLiteralAccessor} from './ColorLiteralAccessor'
import {ColorEncoding} from '../ColorEncoding'
import {Rows, Row, Column} from '@hopara/dataset'
import {RgbaColor} from '../Colors'
import {ColorFieldAccessor} from './ColorFieldAccessor'
import { testCondition } from '../../condition/Condition'

// Resolves color in case it should be calculated based on a row field
export class ColorConditionalAccessor implements Accessor {
  acessor: any

  getAcessor(colorEncoding:ColorEncoding) : any {
    if (colorEncoding.isFieldBased()) {
      return new ColorFieldAccessor(colorEncoding)
    } else {
      return new ColorLiteralAccessor(colorEncoding)
    }
  }

  constructor(private colorEncoding:ColorEncoding) {
    this.acessor = this.getAcessor(colorEncoding)
  }

  getColor(rows: Rows, row: Row, column?: Column): RgbaColor | undefined {
    if (this.colorEncoding.hasCondition()) {
      for (const condition of this.colorEncoding.conditions!) {
        if (testCondition(condition, row)) {
          const conditionAccessor = this.getAcessor(new ColorEncoding(condition))
          return conditionAccessor.getColor(rows, row, column)
        }
      }
    }
    
    return this.acessor.getColor(rows, row, column)
  }
}
