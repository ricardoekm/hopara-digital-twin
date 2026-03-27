import {SizeEncodingImpl} from './SizeEncodingImpl.js'

describe('constructor', () => {
  it('should create a pixel based spec when value parameter is number', () => {
    const size = new SizeEncodingImpl({value: 20})
    expect(size).toEqual({
      value: 20,
    })
  })

  it('should create a size encoding with all properties', () => {
    const size = new SizeEncodingImpl({value: 10,
                                       field: 'temperature', 
                                       scale: { range: [10, 100] }})
    expect(size).toEqual({
      value: 10,
      field: 'temperature',
      scale: { range: [10, 100] },
    })
  })
})
