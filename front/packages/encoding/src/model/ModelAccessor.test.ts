import { Row } from '@hopara/dataset'
import { ModelAccessor } from './ModelAccessor'
import { ModelEncoding } from './ModelEncoding'


test('fixed value icon', () => {
  const encoding = new ModelEncoding({value: 'refrigerator'})

  const model = ModelAccessor.getModel(encoding, undefined)
  expect(model).toEqual('refrigerator')
})

test('if field is defined get icon based on field value', () => {
  const encoding = new ModelEncoding({field: 'type'})

  const model = ModelAccessor.getModel(encoding, new Row({type: 'refrigerator'}))
  expect(model).toEqual('refrigerator')
})

