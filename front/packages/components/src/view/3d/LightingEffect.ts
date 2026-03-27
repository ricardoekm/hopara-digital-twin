import {LightingEffect as DeckLightingEffect, AmbientLight, DirectionalLight} from '@deck.gl/core'
import { Lights } from '../../lights/Lights'

export class LightingEffect extends DeckLightingEffect {
  createdTimestamp: Date
  constructor(lights: Lights) {
    const deckLights = {
      ambientLight: new AmbientLight(lights.ambientLight),
      directionalLight1: new DirectionalLight(lights.directionalLight1),
      directionalLight2: new DirectionalLight(lights.directionalLight2),
      directionalLight3: new DirectionalLight(lights.directionalLight3),
    }
    super(deckLights)
    this.createdTimestamp = new Date()
  }
}
