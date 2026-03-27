import { ZoomRange } from '../ZoomRange'
import { ZoomValue } from '../ZoomValue'

export const translateFixed = (zoomValue: ZoomValue, zoomRange:ZoomRange): number => {
  const value = zoomValue.value as number 
  if (value < zoomRange.getMin()) {
    return zoomRange.getMin()
  } else if (value > zoomRange.getMaxVisible()) {
    return zoomRange.getMaxVisible()
  }

  return value
}
