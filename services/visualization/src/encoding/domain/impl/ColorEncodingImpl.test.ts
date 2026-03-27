import {ColorEncodingImpl} from './ColorEncodingImpl.js'

describe('constructor', () => {
  it('should fallback spec when nothing arrives', () => {
    expect(new ColorEncodingImpl()).toEqual({
      scale: {
        scheme: 'redyellowgreen',
      },
    })
  })
})
