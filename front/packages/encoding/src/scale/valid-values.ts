import { Rows } from '@hopara/dataset'
import { isBoolean, isEmpty, isNumber, uniq } from 'lodash'

export function getValidValues(rows: Rows | undefined, field?: string): number[] {
  if (!rows?.length) {
    return []
  }

  const valids = rows.getValues(field)
    .filter((value) => isNumber(value) || isBoolean(value) || !isEmpty(value))
  return uniq(valids)
}
