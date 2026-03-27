import { isNil } from 'lodash/fp'
import {scaleOrdinal as d3ScaleOrdinal} from 'd3'
import { ScaleBehavior } from '../../scale/ScaleBehavior'

export class HashedScaleBehavior implements ScaleBehavior {
  getNumber(value:string, ceil: number) {
    let sum = 0
    for (let i = 0; i < value.length; i++) {
      sum += value.charCodeAt(i)
    }

    return sum % ceil
  }

  getIndex(value:any, ceil:number) {
    if (isNil(value)) {
      return 0
    }

    return this.getNumber(value.toString(), ceil)
  }

  getScale(colors: any) {
    const domain = Array.from(Array(colors.length).keys())
    return (value) => {
      const scaleFunction = d3ScaleOrdinal(domain, colors)
      const index = this.getIndex(value, colors.length)
      return scaleFunction(index) 
    }
  }
}
