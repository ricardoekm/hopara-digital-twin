import {scaleQuantile as d3ScaleQuantile} from 'd3'
import {ColumnStats} from '@hopara/dataset'
import {DomainInput, ScaleBehavior} from '../../scale/ScaleBehavior'
import { getValidValues } from '../../scale/valid-values'
import { isEmpty } from 'lodash/fp'

export function getDataDomain(values:number[]): [ number, number] {
  return (values?.sort() ?? [])as [number, number]
}

function getDomainFromStats(columnStats:ColumnStats) {
  return columnStats?.percentiles ?? []
}

export class GroupedScaleBehavior implements ScaleBehavior {
  constructor(private readonly field?: string) {}
  
  getDomain(input:DomainInput): any[] {
    if (input.fixedDomain) return input.fixedDomain
    if (!isEmpty(input.columnStats)) return getDomainFromStats(input.columnStats)
    else if (input.rows?.length) return getDataDomain(getValidValues(input.rows, this.field))
    
    return []
  }
  
  getScale(range, domainInput:DomainInput) {
    const domain = this.getDomain(domainInput)

    // By default D3 send to the last color
    if (domain.length === 1) {
      range = [range[0]]
    }

    return d3ScaleQuantile(domain, range)
  }
}

