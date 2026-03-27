import {SizeEncoding} from '../SizeEncoding'
import {DeckSizeType, getSizeAccessor} from './SizeAccessor'
import {Rows} from '@hopara/dataset'

describe('getAccessor', () => {
  it('should get literal if it has not field', () => {
    const encoding = new SizeEncoding({value: 10})
    expect(getSizeAccessor(
      new Rows(),
      encoding,
    )).toEqual(10)
  })
  it('should get function if it has field', () => {
    const row = {'any-field': 20}
    const encoding = new SizeEncoding({field: 'any-field', value: 30})
    const accessor = getSizeAccessor(
      new Rows(),
      encoding,
    ) as Function
    const value = accessor(row)
    expect(value).toEqual(30)
  })
  it('should get 5 if input is 10 and factor is 0.5', () => {
    const encoding = new SizeEncoding({value: 10})
    expect(getSizeAccessor(
      new Rows(),
      encoding,
      undefined,
      DeckSizeType.RADIUS,
    )).toEqual(5)
  })
})
