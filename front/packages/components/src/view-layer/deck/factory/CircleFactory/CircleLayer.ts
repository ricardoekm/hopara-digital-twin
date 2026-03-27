import {ScatterplotLayer, ScatterplotLayerProps} from '@deck.gl/layers'
import {UNIT} from '../../animation/Constants'
import vs from './circle-layer-vertex.glsl'
import fs from './circle-layer-fragment.glsl'

export class CircleLayer<T> extends ScatterplotLayer<T, ScatterplotLayerProps<T>> {
  static layerName = 'CircleLayer'

  getShaders() {
    const shaders = super.getShaders()
    shaders.vs = vs
    shaders.fs = fs
    return shaders
  }

  draw(opts) {
    const {
      radiusUnits,
      radiusScale,
      radiusMinPixels,
      radiusMaxPixels,
      stroked,
      filled,
      billboard,
      antialiasing,
      lineWidthUnits,
      lineWidthScale,
      lineWidthMinPixels,
      lineWidthMaxPixels,
      innerShadow,
      outerShadow,
    } = this.props as any

    this.state.model
      .setUniforms(opts.uniforms)
      .setUniforms({
        stroked: stroked ? 1 : 0,
        filled,
        billboard,
        antialiasing,
        radiusUnits: UNIT[radiusUnits],
        radiusScale,
        radiusMinPixels,
        radiusMaxPixels,
        lineWidthUnits: UNIT[lineWidthUnits],
        lineWidthScale,
        lineWidthMinPixels,
        lineWidthMaxPixels,
        innerShadow: innerShadow ?? false,
        outerShadow: outerShadow ? 0.4 : 0,
      })
      .draw()
  }
}
