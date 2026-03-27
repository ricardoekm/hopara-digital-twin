import { ThreeDLights } from './3DLights.js'

const DEFAULT_LIGHTS: ThreeDLights = {
  ambientLight: {
    color: [255, 255, 255],
    intensity: 1.15,
  },
  directionalLight1: {
    color: [255, 255, 255],
    intensity: 4.5,
    direction: [-16.25, 17, 26],
  },
  directionalLight2: {
    color: [255, 255, 255],
    intensity: 4.2,
    direction: [17.5, 16, -26.75],
  },
  directionalLight3: {
    color: [255, 255, 255],
    intensity: 1.25,
    direction: [-8.75, -14, 6.75],
  },
}

export class ThreeDLightsFactory {
  static fromSpec(spec?: ThreeDLights): ThreeDLights {
    if (spec) return spec
    return DEFAULT_LIGHTS
  }
}
