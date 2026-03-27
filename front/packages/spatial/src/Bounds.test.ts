import {Bounds} from './Bounds'
import { OrthographicBounds } from './bounds/OrthographicBounds'
import { WebMercatorBounds } from './bounds/WebMercatorBounds'

describe('Bounds', () => {
  describe('fromPlain', () => {
    it('should return webmercator bounds', () => {
      const bounds = Bounds.fromGeometry([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]])
      expect(bounds).toBeInstanceOf(WebMercatorBounds)
    })

    it('should return orthographic bounds', () => {
      const bounds = Bounds.fromGeometry([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]], {orthographic: true})
      expect(bounds).toBeInstanceOf(OrthographicBounds)
    })
  })
})
