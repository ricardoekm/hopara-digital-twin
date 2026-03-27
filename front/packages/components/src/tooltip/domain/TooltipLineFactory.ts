import { Columns } from '@hopara/dataset'
import { Details } from '../../details/Details'
import { createDetailLines } from '../../details/DetailsLineFactory'
import { take } from 'lodash/fp'

export const getLines = (row:any, tenant: string, columns?: Columns, details?: Details): any[] => {
  if (!row || !details) {
    return []
  }

  const tooltipFieldLines = createDetailLines(row, tenant, columns, details)
  return take(5, tooltipFieldLines.filter((line) => !!line && !line.image && line.value))
}
