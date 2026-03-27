import { Exclude } from 'class-transformer'
import { omit } from 'lodash/fp'

export enum LightName {
  ambientLight = 'ambientLight',
  directionalLight1 = 'directionalLight1',
  directionalLight2 = 'directionalLight2',
  directionalLight3 = 'directionalLight3',
}

export interface AmbientLight {
  color: number[]
  intensity: number
}

export interface DirectionalLight {
  color: number[]
  intensity: number
  direction: number[]
}

export class Lights {
  @Exclude({ toPlainOnly: true })
  createdTimestamp: Date
  
  [LightName.ambientLight]: AmbientLight
  [LightName.directionalLight1]: DirectionalLight
  [LightName.directionalLight2]: DirectionalLight
  [LightName.directionalLight3]: DirectionalLight

  constructor(props?: Partial<Lights>) {
    Object.assign(this, props)
    if (!this.createdTimestamp) this.createdTimestamp = new Date()
  }

  clone() {
    return new Lights({...omit(['createdTimestamp'], this)})
  }

  getLights() {
    return {
      [LightName.ambientLight]: this[LightName.ambientLight],
      [LightName.directionalLight1]: this[LightName.directionalLight1],
      [LightName.directionalLight2]: this[LightName.directionalLight2],
      [LightName.directionalLight3]: this[LightName.directionalLight3],
    }
  }

  setLight(lightName: LightName, light: AmbientLight | DirectionalLight) {
    const cloned = this.clone()
    cloned[lightName] = light as any
    return cloned
  }

  updateLight(lightName: LightName, light: AmbientLight | DirectionalLight) {
    const cloned = this.clone()
    cloned[lightName] = light as any
    return cloned
  }
}
