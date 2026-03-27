import { Row, geti } from '@hopara/dataset'
import { isNil } from 'lodash/fp'

export type ConditionTest = {
  field: string
  value?: string | number
  reverse?: boolean
}


export type Condition = {
  test: ConditionTest
  parentTest?: ConditionTest
}

function handleReverse(result:any, reverse?: boolean) {
  if (reverse) {
    return !result
  }

  return !!result
}

function runTest(test: ConditionTest, row: Row, defaultResult = false) {
  if ( !test?.field ) {
    return defaultResult
  }

  let result = geti(test.field, row)
  if (!isNil(test.value)) {
    result = (result === test.value)
  }

  return handleReverse(result, test.reverse)
}

export function testCondition(condition: Condition | undefined, row: Row | undefined, defaultResult = false) {
  if (!condition || !row) {
    return defaultResult
  }

  if ( condition.parentTest ) {
    if (!runTest(condition.parentTest, row, defaultResult)) {
      return false
    }
  }

  return runTest(condition.test, row, defaultResult)
}

