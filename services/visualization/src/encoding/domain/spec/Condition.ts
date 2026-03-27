import { ColorEncodingImpl } from '../impl/ColorEncodingImpl.js'
import { IconEncodingImpl } from '../impl/IconEncodingImpl.js'

export interface ConditionTest {
    field?: string,
    value?: string | number
    reverse?: boolean
}

export interface Condition {
  test: ConditionTest
}

export interface ColorCondition extends ColorEncodingImpl {
  test: ConditionTest
}

export interface IconCondition extends IconEncodingImpl {
  test: ConditionTest
}


