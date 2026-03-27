import {BaseBounds} from './BaseBounds'
import { Position2D } from '../Position'

export const createAnyGeometry = ({positionCount}) => {
  const geometry = [...new Array(positionCount)].map((_, index) => [index, index] as Position2D)
  return [...geometry, geometry[0]]
}

describe('Bounds', () => {
  describe('positions', () => {
    const bounds = new BaseBounds(...createAnyGeometry({positionCount: 4}))
    it('should return the position 0 for bottomLeft', () => {
      expect(bounds.getBottomLeft()).toEqual(bounds[0])
    })
    it('should return the position 1 for topLeft', () => {
      expect(bounds.getTopLeft()).toEqual(bounds[1])
    })
    it('should return the position 2 for topRight', () => {
      expect(bounds.getTopRight()).toEqual(bounds[2])
    })
    it('should return the position 3 for bottomRight', () => {
      expect(bounds.getBottomRight()).toEqual(bounds[3])
    })
  })
})
