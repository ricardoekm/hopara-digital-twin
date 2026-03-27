import {LayerExtension} from '@deck.gl/core'
import { UNIT } from '@deck.gl/core/typed'
import { isNil } from 'lodash/fp'

const getZoomScale = (zoom: number, scaleFactor = 1) => {
  if (isNil(zoom)) return 1
  return Math.pow(2, zoom) / scaleFactor
}

export class OffsetExtension extends LayerExtension {
  // eslint-disable-next-line no-restricted-syntax
  static get componentName() {
    return 'OffsetExtension'
  }

  getShaders() {
    return {
      ...super.getShaders(null),
      inject: {
        'vs:#decl': `
          uniform float offsetX;
          uniform float offsetY;
          uniform float offsetMinPixelsX;
          uniform float offsetMaxPixelsX;
          uniform float offsetMinPixelsY;
          uniform float offsetMaxPixelsY;
          uniform int offsetUnits;
          uniform bool offsetResizable;
          uniform float offsetResizeScale;
          uniform float offsetMaxZoomScale;
        `,
        'vs:DECKGL_FILTER_GL_POSITION': `
          float projectedOffsetX = project_size_to_pixel(offsetX, offsetUnits);
          float projectedOffsetY = project_size_to_pixel(offsetY, offsetUnits);
          float projectedOffsetMaxPixelsX = offsetMaxPixelsX;
          float projectedOffsetMaxPixelsY = offsetMaxPixelsY;

          if (offsetResizable || offsetUnits == UNIT_COMMON) {
            projectedOffsetX = project_size_to_pixel(offsetX / offsetResizeScale, UNIT_COMMON);
            projectedOffsetY = project_size_to_pixel(offsetY / offsetResizeScale, UNIT_COMMON);

            // we use the max zoom scale to calculate the max offset pixels
            projectedOffsetMaxPixelsX = offsetX / offsetResizeScale * offsetMaxZoomScale;
            projectedOffsetMaxPixelsY = offsetY / offsetResizeScale * offsetMaxZoomScale;
          }

          float offsetMinX = offsetMinPixelsX;
          float offsetMaxX = projectedOffsetMaxPixelsX;
          float offsetMinY = offsetMinPixelsY;
          float offsetMaxY = projectedOffsetMaxPixelsY;

          if (projectedOffsetMaxPixelsX < 0.0) {
            offsetMinX = projectedOffsetMaxPixelsX;
            offsetMaxX = offsetMaxPixelsX;
          }

          if (projectedOffsetMaxPixelsY < 0.0) {
            offsetMinY = projectedOffsetMaxPixelsY;
            offsetMaxY = offsetMaxPixelsY;
          }

          float offsetPixelsX = clamp(projectedOffsetX, offsetMinX, offsetMaxX);
          float offsetPixelsY = clamp(projectedOffsetY, offsetMinY, offsetMaxY);
          vec2 offsetPosition = project_pixel_size_to_clipspace(vec2(offsetPixelsX, offsetPixelsY));

          position.x -= offsetPosition.x;
          position.y -= offsetPosition.y;
        `,
      },
    }
  }
  
  updateState(params) {
    if (!params || !params.props) return

    const {
      offsetMinPixelsY = -Number.MAX_SAFE_INTEGER,
      offsetMaxPixelsY = Number.MAX_SAFE_INTEGER,
      offsetMinPixelsX = -Number.MAX_SAFE_INTEGER,
      offsetMaxPixelsX = Number.MAX_SAFE_INTEGER,
      offsetY = 0,
      offsetX = 0,
      offsetUnits = 'pixels',
      offsetReferenceZoom,
      offsetMaxZoom,
    } = params.props
    const {viewport} = params.context
    const models = (this as any).getModels()
    for (const model of models) {
      model.setUniforms({
        offsetMinPixelsY,
        offsetMaxPixelsY,
        offsetMinPixelsX,
        offsetMaxPixelsX,
        offsetX: offsetX * -1,
        offsetY: offsetY * -1,
        offsetUnits: UNIT[offsetUnits],
        offsetResizable: !isNil(offsetReferenceZoom),
        offsetResizeScale: getZoomScale(offsetReferenceZoom, viewport.scaleFactor),
        offsetMaxZoomScale: getZoomScale(offsetMaxZoom ?? (params.context.deck.props.viewState.maxZoom ?? 24), viewport.scaleFactor),
      })
    }
  }

  getSubLayerProps() {
    if (!(this as any).props) return
    const {
      offsetMinPixelsY,
      offsetMaxPixelsY,
      offsetMinPixelsX,
      offsetMaxPixelsX,
      offsetY,
      offsetX,
      offsetUnits,
      offsetReferenceZoom,
      offsetMaxZoom,
    } = (this as any).props
    return {
      offsetMinPixelsY,
      offsetMaxPixelsY,
      offsetMinPixelsX,
      offsetMaxPixelsX,
      offsetX,
      offsetY,
      offsetUnits,
      offsetReferenceZoom,
      offsetMaxZoom} as any
  }
}
