import { Column, ColumnType } from '@hopara/dataset'
import { createScaleBehavior } from './ScaleBehaviorFactory'
import { GroupedScaleBehavior } from './GroupedScaleBehavior'
import { SortedScaleBehavior } from './SortedScaleBehavior'

test('should return a QuantileScaleBehavior if column is quantitative', () => {
  const column = new Column({name: 'any-field', type: ColumnType.DECIMAL, quantitative: true})
  const behavior = createScaleBehavior('any-field', { column }) 

  expect(behavior instanceof GroupedScaleBehavior).toBeTruthy()
})

test('if the color scheme is small creates ordinal behavior', () => {
  const behavior = createScaleBehavior('any-field', { colors: ['red', 'green'] })

  expect(behavior instanceof SortedScaleBehavior).toBeTruthy()
})
