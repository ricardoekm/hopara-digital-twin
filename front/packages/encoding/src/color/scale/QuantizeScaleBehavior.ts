import {max, min} from 'lodash/fp'
import {scaleQuantize as d3ScaleQuantize} from 'd3'
import {ColumnStats} from '@hopara/dataset'
import {DomainInput, ScaleBehavior} from '../../scale/ScaleBehavior'
import { getValidValues } from '../../scale/valid-values'

export function getDataRange(values:number[]): [number, number] {
  const minValue = min(values) || 0
  const maxValue = max(values) || 0

  return [minValue, maxValue]
}
 
export function getDomainFromStats(columnStats:ColumnStats): [number, number] {
  return [columnStats.min, columnStats.max]
}

export class QuantizeScaleBehavior implements ScaleBehavior {
  constructor(private field?: string) {}
  
  getDomain(input:DomainInput): any {
    if (input.fixedDomain) return input.fixedDomain
    if (input.columnStats) return getDomainFromStats(input.columnStats)
    if (input.rows?.length) return getDataRange(getValidValues(input.rows, this.field))
    
    return []
  }
  
  getScale(range, domainInput:DomainInput) {
    const domain = this.getDomain(domainInput)
    return d3ScaleQuantize(domain, range)
  }
}

