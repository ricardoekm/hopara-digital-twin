import DeckView from '../DeckView'
import { ViewLayers } from '../../view-layer/ViewLayers'
import OrbitView from '../deck/OrbitView'
import { createViewLayers } from '../../view-layer/DeckLayerFactory'
import { LightingEffect } from './LightingEffect'

export const DEFAULT_ORBIT_AXIS = 'Y'

export class ThreeDViewComponent extends DeckView {
  doGetViewLayers(): ViewLayers {
    const deckViewLayerProps = this.getFactoryProps()
    return createViewLayers(deckViewLayerProps)
  }

  getViews() {
    return [
      new OrbitView({
        id: 'main-view',
        orbitAxis: DEFAULT_ORBIT_AXIS,
        controller: this.getViewController(),
      }),
    ]
  }

  lightingEffect: LightingEffect | undefined

  getLightingEffect() {
    if (!this.props.lights) return

    if (!this.lightingEffect || this.lightingEffect.createdTimestamp < this.props.lights.createdTimestamp) {
      this.lightingEffect = new LightingEffect(this.props.lights)
    }

    return this.lightingEffect
  }

  getEffects() {
    const lightingEffect = this.getLightingEffect()
    if (!lightingEffect) return []
    return [this.lightingEffect]
  }

  getPickingRadius() {
    return !!this.props.isOnObjectEditor && (this.state.rowEdit || this.props.rowSelection) ? 20 : 0
  }
}
