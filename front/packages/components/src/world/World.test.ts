import {clone} from '@hopara/object/src/clone'
import { CameraType, ProjectionType, World } from './World'

export class TestWorld extends World {
}

const anyWorld = new TestWorld(
  {
    projection: ProjectionType.WEBMERCATOR,
    camera: CameraType.ORTHOGRAPHIC,
  },
)

export function getAnyWorld(props = {}) : TestWorld {
  return clone<TestWorld>(anyWorld, props)
}

test('any world', () => {
  expect(getAnyWorld().isProjection(ProjectionType.WEBMERCATOR)).toBeTruthy()
})
