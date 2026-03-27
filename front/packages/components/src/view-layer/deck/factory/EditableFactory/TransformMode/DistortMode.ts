import {
  DraggingEvent,
  FeatureCollection,
  GeoJsonEditMode,
  GuideFeatureCollection,
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
} from '@nebula.gl/edit-modes'
import {Feature, featureCollection, Point, point, Position, LineString} from '@turf/helpers'
import {getCoord, getCoords} from '@turf/invariant'
import {coordEach} from '@turf/meta'
import turfCentroid from '@turf/centroid'
import turfBearing from '@turf/bearing'
import {EditHandleFeature} from '@nebula.gl/edit-modes/src/types'
import lineToPolygon from '@turf/line-to-polygon'
import { geometricFromViewport } from '../../../../../geometric/GeometricFactory'

export class DistortMode extends GeoJsonEditMode {
  _isDistorting = false
  _selectedEditHandle: EditHandleFeature | null | undefined
  private _geometryBeingDistorted: FeatureCollection | null | undefined
  _cursor: string | null | undefined
  _bboxBeingDistorted: Feature<LineString>
  private _guidePoints: Feature<Point>[]
  rotatedOrigin: any

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    this._guidePoints = [] as Feature<Point>[]
    const selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props)
    if (getCoords(selectedGeometry.features[0] as any).length !== 1) return featureCollection(this._guidePoints) as any
    const geo = geometricFromViewport(props.modeConfig.viewport)
    this._bboxBeingDistorted = geo.getRotatedBBox(selectedGeometry as any)
    this._bboxBeingDistorted.properties!.mode = 'scale'
    coordEach(this._bboxBeingDistorted, (coord, coordIndex) => {
      if (coordIndex > 3) return
      const point2 = getCoords(this._bboxBeingDistorted)[(coordIndex + 1)]
      const midpoint = geo.getMidPoint(coord as any, point2 as any)
      const midPointHandle = point(getCoords(midpoint), {
        guideType: 'editHandle',
        editHandleType: 'distort',
        positionIndexes: [coordIndex],
      })
      this._guidePoints.push(midPointHandle)
    })

    if ((props as any).context.hideGuides) return {type: 'FeatureCollection', features: []}
    return featureCollection(this._guidePoints) as any
  }


  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isDistorting) {
      this._selectedEditHandle = this.getPickedHandle(event.picks)
    }

    this.updateCursor(props)
  }

  getPickedHandle(picks: any[]) {
    const guidePicks = picks?.filter((pick) => pick.isGuide && pick.object.properties.guideType === 'editHandle') ?? []
    return guidePicks
             .filter((pick) => pick.object.properties.editHandleType === 'distort')
             .map((pick) => pick.object)[0] ?? null
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    this._selectedEditHandle = this.getPickedHandle(event.picks)

    if (this._selectedEditHandle) {
      this._isDistorting = true
      this._geometryBeingDistorted = this.getSelectedFeaturesAsFeatureCollection(props)
    }

    (props as any).context.hideGuides = (props as any).context.hideGuides || this._isDistorting
  }

  _getOppositeScaleHandle(selectedHandle: EditHandleFeature) {
    const selectedHandleIndex =
      selectedHandle &&
      selectedHandle.properties &&
      Array.isArray(selectedHandle.properties.positionIndexes) &&
      selectedHandle.properties.positionIndexes[0]

    if (typeof selectedHandleIndex !== 'number') {
      return null
    }
    if (selectedHandleIndex === 0) {
      return this._guidePoints[2]
    }
    if (selectedHandleIndex === 1) {
      return this._guidePoints[3]
    }
    if (selectedHandleIndex === 2) {
      return this._guidePoints[0]
    }
    if (selectedHandleIndex === 3) {
      return this._guidePoints[1]
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isDistorting) {
      return
    }

    props.onUpdateCursor(this._cursor)

    const distortAction = this.getDistortAction(
      event.pointerDownMapCoords,
      event.mapCoords,
      'distoring',
      props,
    )
    if (distortAction) {
      props.onEdit(distortAction)
    }
    event.cancelPan()
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._isDistorting) {
      // Scale the geometry
      const distortAction = this.getDistortAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'distorted',
        props,
      )
      if (distortAction) {
        props.onEdit(distortAction)
      }

      props.onUpdateCursor(null)

      this._geometryBeingDistorted = null
      this._selectedEditHandle = null
      this._cursor = null
      this._isDistorting = false
      this.rotatedOrigin = null
    }
  }

  getOppositeMidPoint(positionIndex: number, rotated: any, props: ModeProps<FeatureCollection>) {
    const geo = geometricFromViewport(props.modeConfig.viewport)
    const index1 = positionIndex
    const index2 = positionIndex + 1
    const point1 = getCoords(rotated)[0][index1]
    const point2 = getCoords(rotated)[0][index2]
    return geo.getMidPoint(point1 as any, point2 as any)
  }

  getDistortAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ): any {
    const geometric = geometricFromViewport(props.modeConfig.viewport)
    if (!this._selectedEditHandle) {
      return null
    }
    const oppositeHandle = this._getOppositeScaleHandle(this._selectedEditHandle)

    const distotedFeatures = featureCollection([])

    for (const feature of this._geometryBeingDistorted!.features) {
      const angle = geometric.getBearing(feature as any)
      const centroid = geometric.getCentroid(this._geometryBeingDistorted as any)
  
      const rotated = geometric.polygonRotate(feature as any, -angle, centroid)
      const rotatedBBox = geometric.polygonRotate(lineToPolygon(this._bboxBeingDistorted) as any, -angle, centroid)
  
      this.rotatedOrigin = this.rotatedOrigin ?? this.getOppositeMidPoint(oppositeHandle!.properties!.positionIndexes[0], rotatedBBox, props)
      const scaleFactor = geometric.getScaleFactor(getCoord(oppositeHandle!) as any, startDragPoint as any, currentPoint as any)
      const scaledGeom = geometric.scalePolygon(rotated, scaleFactor, this.rotatedOrigin, this._selectedEditHandle.properties.positionIndexes![0])
  
      distotedFeatures.features.push(geometric.polygonRotate(scaledGeom, angle, centroid))
    }

    return {
      updatedData: distotedFeatures,
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    }
  }

  updateCursor = (props: ModeProps<FeatureCollection>) => {
    if (this._selectedEditHandle) {
      if (this._cursor) {
        props.onUpdateCursor(this._cursor)
      }
      const cursorGeometry = this.getSelectedFeaturesAsFeatureCollection(props) as any
      // Get resize cursor direction from the hovered scale editHandle (e.g. nesw or nwse)
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
      const directionIndex =
        Math.floor((positiveBearing + 22.5) / 45) % eightDirectionCursors.length
      const cursor = eightDirectionCursors[directionIndex]

      this._cursor = cursor
      props.onUpdateCursor(cursor)
    } else {
      props.onUpdateCursor(null)
      this._cursor = null
    }
  }
}
