import { ZoomRange } from '../ZoomRange'
import { ZoomValue } from '../ZoomValue'
import { translateFixed } from './TranslateFixed'

test('should translate fixed zoom', () => {
  const zoom: ZoomValue = { value: 15 }
  const zoomRange = new ZoomRange({ min: { value: 0}, max: {value: 20} })

  expect(translateFixed(zoom, zoomRange)).toEqual(15)
})
