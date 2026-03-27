import {scaleOrdinal as d3ScaleOrdinal} from 'd3'
import {concat, difference} from 'lodash/fp'
import { DomainInput, ScaleBehavior } from '../../scale/ScaleBehavior'
import { getValidValues } from '../../scale/valid-values'
import { ColumnType } from '@hopara/dataset'

export class SortedScaleBehavior implements ScaleBehavior {
  constructor(private field?: string) {
  }

  getDomainFromStats(columnStats) {
    return columnStats?.values ?? [columnStats.min, columnStats.max]
  }

  getDomain(input:DomainInput): any[] {
    if (input.fixedDomain && input.columnType !== ColumnType.BOOLEAN) return input.fixedDomain
    if (input.columnStats?.values?.length) {
      const rowsDomain = getValidValues(input.rows, this.field)
      const statsDomain = this.getDomainFromStats(input.columnStats)
      return concat(statsDomain, difference(rowsDomain.sort(), statsDomain)).sort()
    } else if (input.rows?.length) {
      return getValidValues(input.rows, this.field).sort()
    }
    
    return []
  }

  getScale(range, domainInput:DomainInput) {
    const domain = this.getDomain(domainInput)

    if (domainInput.columnType === ColumnType.BOOLEAN) {
      range = [range[0], range[range.length - 1]]
    }

    return d3ScaleOrdinal(domain, range)
  }
}
