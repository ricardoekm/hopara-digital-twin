import { EditableGeojsonLayerProps } from '@nebula.gl/layers/dist-types/layers/editable-geojson-layer'
import {EditableGeoJsonLayer as NebulaEditableGeoJsonLayer} from 'nebula.gl'

export class EditableGeoJsonLayer extends NebulaEditableGeoJsonLayer {
  static layerName = 'EditableGeoJsonLayer'

  _onpanmove(event: any) {
    const { srcEvent } = event
    const screenCoords = this.getScreenCoords(srcEvent) as any
    const mapCoords = this.getMapCoords(screenCoords)

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
    } = this.state._editableLayerState

    this.onDragging({
      screenCoords,
      mapCoords,
      picks: [],
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
      cancelPan: event.stopImmediatePropagation,
    })
  }
 
  picks = []
  _onpointermove(event: any) {
    const { srcEvent } = event
    const screenCoords = this.getScreenCoords(srcEvent) as any
    const mapCoords = this.getMapCoords(screenCoords)

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
    } = this.state._editableLayerState
    
    if (!event.rightButton && !event.leftButton) {
      this.picks = this.getPicks(screenCoords)
    }

    this.onPointerMove({
      screenCoords,
      mapCoords,
      picks: this.picks,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
    } as any)
  }

  createTooltipsLayers() {
    return []
  }

  getModeProps(props: EditableGeojsonLayerProps<any> & {onUpdateCursor?: (cursor: string) => void}) {
    const modeProps = super.getModeProps(props)
    modeProps.onUpdateCursor = (cursor) => props.onUpdateCursor && props.onUpdateCursor(cursor)
    return {...modeProps, pickingRadius: props.pickingRadius ?? NebulaEditableGeoJsonLayer.defaultProps.pickingRadius}
  }
}
