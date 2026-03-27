import { ModifyMode as NebulaModifyMode } from 'nebula.gl'
import { OrthographicViewport } from '../../../../../view/deck/OrthographicViewport'
import { FeatureCollection, FeatureOf, GuideFeatureCollection, LineString, ModeProps, Point, StartDraggingEvent, StopDraggingEvent, Viewport } from '@nebula.gl/edit-modes'
import { NearestPointType } from '@nebula.gl/edit-modes/dist-types/utils'
import { polygonToLine } from '@turf/polygon-to-line'
import { Position } from 'deck.gl'
import { point } from '@turf/helpers'
import WebMercatorViewport from '../../../../../view/deck/WebMercatorViewport'
import { geometricFromViewport } from '../../../../../geometric/GeometricFactory'

export class ModifyMode extends NebulaModifyMode {
  isDragging = false

  getNearestPoint(
    line: FeatureOf<LineString>,
    inPoint: FeatureOf<Point>,
    viewport: Viewport | null | undefined,
  ): NearestPointType {
    return super.getNearestPoint(line, inPoint, viewport instanceof OrthographicViewport ? null : viewport)
  }

  getPickedEditHandle(pointerDownPicks) {
    const picked = pointerDownPicks?.find((pick) => pick.isGuide && (pick.featureType === 'editHandle' || pick.featureType === 'points'))
    return picked?.object ?? null
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    this.isDragging = true
    super.handleStartDragging(event, props)
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes
    const editHandle = this.getPickedEditHandle(event.pointerDownPicks)
    if (selectedFeatureIndexes.length && editHandle) {
      this._dragEditHandle('finishMovePosition', props, editHandle, event)
    }
    this.isDragging = false
  }

  modifyIntermediatePoint(props: ModeProps<FeatureCollection> & {pickingRadius: number}, featureCollection: GuideFeatureCollection, mapCoords?: Position) {
    const intermediateFeature = featureCollection.features.find((feature) => (feature.properties as any).editHandleType === 'intermediate')
    if (!intermediateFeature) return featureCollection
    
    const isWebmercator = props.modeConfig.viewport instanceof WebMercatorViewport
    const geometric = geometricFromViewport(props.modeConfig.viewport)
    const inPoint = point(mapCoords as any)
    const dist = geometric.getDistance(inPoint as any, intermediateFeature as any)
    const distInPx = props.modeConfig.viewport.getSizePixels(isWebmercator ? dist * 1000 : dist, isWebmercator ? 'meters' : 'common')

    featureCollection.features = featureCollection.features.filter((feature) => {
      if ((feature.properties as any).editHandleType === 'intermediate') return distInPx <= props.pickingRadius
      return true
    })

    return featureCollection
  }

  getGuides(props: ModeProps<FeatureCollection> & {pickingRadius: number}) {
    const featureCollection = super.getGuides(props)
    if (this.isDragging) return {type: 'FeatureCollection', features: []} as any
    featureCollection.features.push(polygonToLine(props.data.features[0] as any) as any)

    const mapCoords = props.lastPointerMoveEvent && props.lastPointerMoveEvent.mapCoords
    
    return this.modifyIntermediatePoint(props, featureCollection, mapCoords)
  }

  getCursor(event: any): string | null | undefined {
    const picks = (event && event.picks) || []

    const picked = this.getPickedEditHandle(picks)

    if (picked?.properties?.editHandleType === 'existing' || this.isDragging) {
      return 'move'
    } else if (picked?.properties?.editHandleType === 'intermediate') {
      return 'default'
    }
    return null
  }
}
