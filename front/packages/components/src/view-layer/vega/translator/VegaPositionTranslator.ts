import { PositionEncoding, PositionScaleType, PositionScales } from '@hopara/encoding'
import { isNil } from 'lodash/fp'

export class VegaPositionTranslator {
  getAdditionalProperties(positionScaleType?: PositionScaleType) {
    if (positionScaleType === PositionScaleType.TIME) {
      return {
        type: 'temporal',
      }
    } else if (positionScaleType === PositionScaleType.LINEAR) {
      return {
        type: 'quantitative',
      }
    } else if (positionScaleType === PositionScaleType.ORDINAL) {
      return {
        type: 'nominal',
        sort: null,
      }
    }
    
    return {}
  }

  getAxisPositionEncoding(axis:string, positionEncoding?: PositionEncoding, positionScales?: PositionScales) {    
    if (!positionEncoding || !positionEncoding[axis]) {      
      return undefined
    }
    
    const axisPositionEncoding = {} as any
    
    if (positionEncoding[axis].field) {
      axisPositionEncoding.field = positionEncoding[axis].field
    }

    if (!isNil(positionEncoding[axis].value)) {
      axisPositionEncoding.value = positionEncoding[axis].value
    }

    if (positionScales) {
      const referenceAxis = axis.replace('2', '')
      return {
        ...axisPositionEncoding,
        ...this.getAdditionalProperties(positionScales[referenceAxis]),
      }
    }

    return axisPositionEncoding
  }

  translate(positionEncoding?: PositionEncoding, positionScales?: PositionScales) : any {
    return { 
      x: this.getAxisPositionEncoding('x', positionEncoding, positionScales),
      x2: this.getAxisPositionEncoding('x2', positionEncoding, positionScales),
      y: this.getAxisPositionEncoding('y', positionEncoding, positionScales),
      y2: this.getAxisPositionEncoding('y2', positionEncoding, positionScales),
    }
  }
}
