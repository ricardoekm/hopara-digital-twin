export interface BaseLight {
  /**
   * @description The light intensity. Default is 1.
   * @default 1
  */
  intensity?: number
  /**
   * @description The light color. Default is [255, 255, 255] (white).
   * @default [255, 255, 255]
  */
  color?: [number, number, number]
}

export interface DirectionalLight extends BaseLight {
  /**
   * @description The light direction. Default is [0, 0, 0].
   * @default [0, 0, 0]
  */
  direction?: [number, number, number]
}

export interface ThreeDLights {
  ambientLight: BaseLight
  directionalLight1: DirectionalLight
  directionalLight2: DirectionalLight
  directionalLight3: DirectionalLight
}
  
