import {ImageLayerImpl} from './ImageLayerImpl.js'

describe('ImageLayer', () => {
  describe('constructor', () => {
    it('should not have details by default', () => {
      const layer = new ImageLayerImpl({details: {}} as any) as any
      expect(layer.details.tooltip).toBe(false)
    })
  })
})
