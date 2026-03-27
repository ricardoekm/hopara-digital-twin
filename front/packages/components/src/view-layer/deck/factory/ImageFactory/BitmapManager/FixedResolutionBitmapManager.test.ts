import { ImageResolution } from '@hopara/encoding'
import { FixedResolutionBitmapManager } from './FixedResolutionBitmapManager'

test('Set image resolution', () => {
  const manager = new FixedResolutionBitmapManager(ImageResolution.xs)
  const url = manager.getLoadUrl('https://resource.hopara.app/tenant/hopara.io/image-library/library/image/id?angle=45&max-size=16383')
  expect(url).toBe('https://resource.hopara.app/tenant/hopara.io/image-library/library/image/id?angle=45&max-size=16383&resolution=xs')
})
