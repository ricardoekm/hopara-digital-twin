import {ScaleMode as NebulaScaleMode} from 'nebula.gl'
import {featureCollection, lineString, point, polygon} from '@turf/helpers'
import {getCoord, getCoords} from '@turf/invariant'
import turfTransformScale from '@turf/transform-scale'
import {FeatureCollection, GuideFeatureCollection, ModeProps, Position, StartDraggingEvent, StopDraggingEvent} from '@nebula.gl/edit-modes'
import {OrthographicViewport} from '../../../../../view/deck/OrthographicViewport'
import {coordEach} from '@turf/meta'
import { polygonScale } from 'geometric'
import turfCentroid from '@turf/centroid'
import turfBearing from '@turf/bearing'
import { isEqual } from 'lodash/fp'
import { geometricFromViewport } from '../../../../../geometric/GeometricFactory'

export class ScaleMode extends NebulaScaleMode {
  _startDragPoint
  _originDragPoint

  getOrthopraphicScaleAction = (
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ): any => {
    const self = this
    if (!self._selectedEditHandle) {
      return null
    }
    const geo = geometricFromViewport(props.modeConfig.viewport)

    const oppositeHandle = self._getOppositeScaleHandle(self._selectedEditHandle)
    self._originDragPoint = self._originDragPoint ?? getCoord(oppositeHandle)

    const scaleFactor = geo.getScaleFactor(self._originDragPoint as any, startDragPoint as any, currentPoint as any)

    const scaledFeatures: any = featureCollection([])

    for (const feature of self._geometryBeingScaled!.features) {
      const coords = getCoords(feature as any) ?? []
      const polygonCoords = coords.length > 1 ? coords : coords[0] as Position[]
      const scaledGeom = polygonScale(
        polygonCoords,
        scaleFactor,
        self._originDragPoint as any,
      )
  
      const scaledPolygon = isEqual(scaledGeom[0], scaledGeom[scaledGeom.length - 1]) ? polygon([scaledGeom]) : lineString(scaledGeom)
      scaledFeatures.features.push(scaledPolygon as any)
    }

    return {
      updatedData: self._getUpdatedData(props, scaledFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    }
  }

  getGeoScaleAction = (
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ) => {
    const self = this
    if (!self._selectedEditHandle) {
      return null
    }
    const geo = geometricFromViewport(props.modeConfig.viewport)

    const oppositeHandle = self._getOppositeScaleHandle(self._selectedEditHandle)
    self._originDragPoint = self._originDragPoint ?? getCoord(oppositeHandle)
    const scaleFactor = geo.getScaleFactor(self._originDragPoint as any, startDragPoint as any, currentPoint as any)
    const scaledFeatures: FeatureCollection = turfTransformScale(
      self._geometryBeingScaled as any,
      scaleFactor,
      {origin: self._originDragPoint},
    )

    return {
      updatedData: self._getUpdatedData(props, scaledFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    }
  }

  getScaleAction = (
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ): any => {
    const self = this
    self._startDragPoint = self._startDragPoint ?? startDragPoint
    if (props.modeConfig.viewport instanceof OrthographicViewport) {
      return self.getOrthopraphicScaleAction(self._startDragPoint, currentPoint, editType, props)
    }

    return self.getGeoScaleAction(self._startDragPoint, currentPoint, editType, props)
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    this._cornerGuidePoints = []
    const selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props)

    // Add buffer to the enveloping box if a single Point feature is selected
    if (this._isSinglePointGeometrySelected(selectedGeometry)) {
      return {type: 'FeatureCollection', features: []}
    }
    const geo = geometricFromViewport(props.modeConfig.viewport)
    const rotatedBBox = geo.getRotatedBBox(selectedGeometry as any)
    rotatedBBox.properties!.mode = 'scale'
    const cornerGuidePoints = [] as any[]

    coordEach(rotatedBBox, (coord, coordIndex) => {
      if (coordIndex < 4) {
        // Get corner midpoint guides from the enveloping box
        const cornerPoint = point(coord, {
          guideType: 'editHandle',
          editHandleType: 'scale',
          positionIndexes: [coordIndex],
        })
        cornerGuidePoints.push(cornerPoint)
      }
    })

    this._cornerGuidePoints = cornerGuidePoints

    if ((props as any).context.hideGuides) return {type: 'FeatureCollection', features: []}
    return featureCollection([rotatedBBox as any, ...this._cornerGuidePoints]) as any
  }

  getPickedHandle(picks: any[]) {
    const guidePicks = picks?.filter((pick) => pick.isGuide && pick.object.properties.guideType === 'editHandle') ?? []
    return guidePicks
             .filter((pick) => pick.object.properties.editHandleType === 'scale')
             .map((pick) => pick.object)[0] ?? null
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {
    this._selectedEditHandle = this.getPickedHandle(event.picks)
    super.handleStartDragging(event, props);
    (props as any).context.hideGuides = (props as any).context.hideGuides || this._isScaling
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {
    super.handleStopDragging(event, props)
    this._startDragPoint = null
    this._originDragPoint = null
  }

  handleDragging(event: any, props: ModeProps<FeatureCollection>) {
    if (!this._isScaling) {
      return
    }

    this.updateCursor(props)

    const scaleAction = this.getScaleAction(
      event.pointerDownMapCoords,
      event.mapCoords,
      'scaling',
      props
    )
    if (scaleAction) {
      props.onEdit(scaleAction)
    }

    event.cancelPan()
  }

  updateCursor = (props: ModeProps<FeatureCollection>) => {
    if (this._selectedEditHandle) {
      if (this._cursor) {
        props.onUpdateCursor(this._cursor)
      }
      const cursorGeometry = this.getSelectedFeaturesAsFeatureCollection(props) as any
      const centroid = turfCentroid(cursorGeometry)
      let bearing = turfBearing(centroid, this._selectedEditHandle)
      const handleCoord = getCoord(this._selectedEditHandle) as Position
      const geo = geometricFromViewport(props.modeConfig.viewport)
      const rotatedBBox = geo.getRotatedBBox(cursorGeometry as any)
      const bboxCoords = (getCoords(rotatedBBox) as Position[]).slice(0, 4)
      const coordsAlmostEqual = (a: Position, b: Position) =>
        Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6

      const currentIndex = bboxCoords.findIndex((coord) => coordsAlmostEqual(coord, handleCoord))
      if (currentIndex !== -1) {
        const prevCoord = bboxCoords[(currentIndex + 3) % 4]
        const nextCoord = bboxCoords[(currentIndex + 1) % 4]
        const normalizeVector = (target: Position) => {
          const dx = target[0] - handleCoord[0]
          const dy = target[1] - handleCoord[1]
          const length = Math.hypot(dx, dy) || 1
          return [dx / length, dy / length]
        }

        const prevVector = normalizeVector(prevCoord)
        const nextVector = normalizeVector(nextCoord)
        const diagonalVector = [prevVector[0] + nextVector[0], prevVector[1] + nextVector[1]]

        bearing = (Math.atan2(diagonalVector[1], diagonalVector[0]) * 180) / Math.PI
      }

      const positiveBearing = (bearing + 360) % 360
      const eightDirectionCursors = [
        'ns-resize',
        'nesw-resize',
        'ew-resize',
        'nwse-resize',
        'ns-resize',
        'nesw-resize',
        'ew-resize',
        'nwse-resize',
      ]
      const directionIndex = Math.floor((positiveBearing + 22.5) / 45) % eightDirectionCursors.length
      const cursor = eightDirectionCursors[directionIndex]

      this._cursor = cursor
      props.onUpdateCursor(cursor)
    } else {
      props.onUpdateCursor(null)
      this._cursor = null
    }
  }
}
