import { getResizeImageParameters, getTextureParameters } from './ParseImage'

describe('ParseImage texture parameters', () => {
  it('should get texture params of horizontal image bounds', () => {
    const params = getTextureParameters({width: 100, height: 100} as any, 1.5)
    expect(params.width).toBe(100)
    expect(params.height).toBe(67)
  })

  it('should get texture params of horizontal image bounds', () => {
    const params = getTextureParameters({width: 120, height: 60} as any, 1.5)
    expect(params.width).toBe(120)
    expect(params.height).toBe(80)
  })

  it('should get texture params of horizontal image bounds', () => {
    const params = getTextureParameters({width: 120, height: 60} as any, 3.5)
    expect(params.width).toBe(120)
    expect(params.height).toBe(34)
  })

  it('should get texture params of vertical image bounds', () => {
    const params = getTextureParameters({width: 100, height: 100} as any, 0.5)
    expect(params.width).toBe(50)
    expect(params.height).toBe(100)
  })

  it('should get texture params of vertical image bounds', () => {
    const params = getTextureParameters({width: 80, height: 120} as any, 0.5)
    expect(params.width).toBe(60)
    expect(params.height).toBe(120)
  })

  it('should get texture params of square image bounds', () => {
    const params = getTextureParameters({width: 100, height: 120} as any, 1)
    expect(params.width).toBe(120)
    expect(params.height).toBe(120)
  })

  it('should get texture params of square image bounds', () => {
    const params = getTextureParameters({width: 100, height: 120} as any, 1)
    expect(params.width).toBe(120)
    expect(params.height).toBe(120)
  })
})

describe('ParseImage resize image parameters', () => {
  it('should get resize params of horizontal bounds and squere image', () => {
    const params = getResizeImageParameters({width: 100, height: 100} as any, {width: 100, height: 67})
    expect(params.width).toBe(67)
    expect(params.height).toBe(67)
  })

  it('should get resize params of vertial bounds and squere image', () => {
    const params = getResizeImageParameters({width: 100, height: 100} as any, {width: 50, height: 100})
    expect(params.width).toBe(50)
    expect(params.height).toBe(50)
  })

  it('should get resize params of square bounds and squere image', () => {
    const params = getResizeImageParameters({width: 120, height: 120} as any, {width: 120, height: 120})
    expect(params.width).toBe(120)
    expect(params.height).toBe(120)
  })

  it('should get resize params of horizontal bounds and horizontal image', () => {
    const params = getResizeImageParameters({width: 120, height: 60} as any, {width: 120, height: 50})
    expect(params.width).toBe(100)
    expect(params.height).toBe(50)
  })

  it('should get resize params of vertial bounds and horizontal image', () => {
    const params = getResizeImageParameters({width: 120, height: 60} as any, {width: 50, height: 100})
    expect(params.width).toBe(50)
    expect(params.height).toBe(25)
  })

  it('should get resize params of square bounds and horizontal image', () => {
    const params = getResizeImageParameters({width: 120, height: 60} as any, {width: 100, height: 100})
    expect(params.width).toBe(100)
    expect(params.height).toBe(50)
  })

  it('should get resize params of horizontal bounds and vertial image', () => {
    const params = getResizeImageParameters({width: 60, height: 120} as any, {width: 100, height: 50})
    expect(params.width).toBe(25)
    expect(params.height).toBe(50)
  })

  it('should get resize params of vertial bounds and horizontal image', () => {
    const params = getResizeImageParameters({width: 60, height: 120} as any, {width: 50, height: 100})
    expect(params.width).toBe(50)
    expect(params.height).toBe(100)
  })

  it('should get resize params of square bounds and horizontal image', () => {
    const params = getResizeImageParameters({width: 120, height: 60} as any, {width: 100, height: 100})
    expect(params.width).toBe(100)
    expect(params.height).toBe(50)
  })
})
