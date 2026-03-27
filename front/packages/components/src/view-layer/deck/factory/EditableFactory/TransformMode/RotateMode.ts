import {RotateMode as NebulaRotateMode} from 'nebula.gl'
import {ImmutableFeatureCollection, Position, StartDraggingEvent} from '@nebula.gl/edit-modes'
import {GuideFeatureCollection, ModeProps} from '@nebula.gl/edit-modes/src/types'
import {FeatureCollection} from '@nebula.gl/edit-modes/src/geojson-types'
import {Feature, featureCollection, lineString, point, polygon} from '@turf/helpers'
import {getCoord, getCoords} from '@turf/invariant'
import {lineAngle, polygonRotate} from 'geometric'
import turfDistance from '@turf/distance'
import {coordEach} from '@turf/meta'
import {OrthographicViewport} from '../../../../../view/deck/OrthographicViewport'
import { isEqual } from 'lodash/fp'
import nearestPoint from '@turf/nearest-point'
import rewind from '@turf/rewind'
import WebMercatorViewport from '../../../../../view/deck/WebMercatorViewport'
import { geometricFromViewport } from '../../../../../geometric/GeometricFactory'

export function getIntermediatePosition(position1: Position, position2: Position): Position {
  // @ts-ignore
  return [
    (position1[0] + position2[0]) / 2.0,
    (position1[1] + position2[1]) / 2.0,
  ]
}

export class RotateMode extends NebulaRotateMode {
  getRotateGuide(geometry: FeatureCollection, bbox: Feature, props: ModeProps<FeatureCollection>) {
    const geometric = geometricFromViewport(props.modeConfig.viewport)
    const coords = getCoords(bbox as any)
    const bboxAsPoints = featureCollection(coords.map((coord) => point(coord)))
    const geometryRewinded = rewind(geometry.features[0] as any, {reverse: true})
    const bounds = geometric.getBounds(geometryRewinded as any)
    const bottomLeftPoint = nearestPoint(point([bounds[0], bounds[1]]), bboxAsPoints)
    const nearstIndexOnBBox = coords.findIndex((coord) => isEqual(coord, getCoords(bottomLeftPoint)))

    let nextPointIndex
    if (props.modeConfig.viewport instanceof WebMercatorViewport) {
      nextPointIndex = nearstIndexOnBBox === coords.length - 1 ? 1 : nearstIndexOnBBox + 1
    } else {
      nextPointIndex = nearstIndexOnBBox === 0 ? coords.length - 2 : nearstIndexOnBBox - 1
    }

    const point0 = coords[nearstIndexOnBBox]
    const point100 = coords[nextPointIndex]

    const point50 = geometric.getMidPoint(point0, point100)
    const point25 = geometric.getMidPoint(point0, getCoord(point50) as any)
    const rotationAngle = props.modeConfig.viewport instanceof OrthographicViewport ? 90 : -90
    const topCenterLine = geometric.lineRotate(lineString([getCoord(point25), getCoord(point50)]), rotationAngle, point50)
    const handleCoord = getCoords(topCenterLine)[0]

    const rotateHandle = point(handleCoord, {
      guideType: 'editHandle',
      editHandleType: 'rotate',
    })

    return [
      rotateHandle,
      topCenterLine,
    ]
  }

  _getUpdatedData = (props: ModeProps<FeatureCollection>, editedData: FeatureCollection) => {
    let updatedData = new ImmutableFeatureCollection(props.data)
    const selectedIndexes = props.selectedIndexes
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i]
      const movedFeature = editedData.features[i]
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry)
    }
    return updatedData.getObject()
  }

  getOrthographicRotateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ): any {
    if (!this._geometryBeingRotated) {
      return null
    }

    const geo = geometricFromViewport(props.modeConfig.viewport)

    const centroid = geo.getCentroid(this._geometryBeingRotated as any)
    const angleStart = lineAngle([getCoords(centroid), startDragPoint] as any)
    const angleCurrent = lineAngle([getCoords(centroid), currentPoint] as any)
    const angle = angleCurrent - angleStart

    const scaledFeatures = featureCollection([])

    for (const feature of this._geometryBeingRotated!.features) {
      const coords = getCoords(feature as any) ?? []
      const polygonCoords = coords.length > 1 ? coords : coords[0] as Position[]
      const rotatedGeom = polygonRotate(
        polygonCoords,
        angle,
        getCoords(centroid) as any,
      )
  
      const scaledPolygon = isEqual(rotatedGeom[0], rotatedGeom[rotatedGeom.length - 1]) ? polygon([rotatedGeom]) : lineString(rotatedGeom)
      scaledFeatures.features.push(scaledPolygon)
    }

    return {
      updatedData: this._getUpdatedData(props, scaledFeatures as any),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const selectedGeometry = this._geometryBeingRotated || this.getSelectedFeaturesAsFeatureCollection(props)

    if (this._isSinglePointGeometrySelected(selectedGeometry) || ((props as any).context.hideGuides && !this._isRotating) || this._isRotating) {
      return {type: 'FeatureCollection', features: []}
    }

    const geo = geometricFromViewport(props.modeConfig.viewport)
    const rotatedBBox = geo.getRotatedBBox(selectedGeometry as any)

    let previousCoord: number[] | null = null
    let topEdgeMidpointCoords: Position | null = null
    let longestEdgeLength = 0

    coordEach(rotatedBBox, (coord) => {
      if (previousCoord) {
        const edgeMidpoint = getIntermediatePosition(coord as any, previousCoord as any)
        if (!topEdgeMidpointCoords || edgeMidpoint[1] > topEdgeMidpointCoords[1]) {
          // Get the top edge midpoint of the enveloping box
          topEdgeMidpointCoords = edgeMidpoint
        }
        // Get the length of the longest edge of the enveloping box
        const edgeDistance = turfDistance(coord, previousCoord)
        longestEdgeLength = Math.max(longestEdgeLength, edgeDistance)
      }
      previousCoord = coord
    })

    // Scale the length of the line between the rotate handler and the enveloping box
    // relative to the length of the longest edge of the enveloping box
    const rotateGuides = this.getRotateGuide(selectedGeometry, rotatedBBox, props)

     
    // @ts-ignore
    return featureCollection([
      rotatedBBox,
       
      // @ts-ignore
      ...rotateGuides,
    ])
  }

  getRotateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ): any {
    if (props.modeConfig.viewport instanceof OrthographicViewport) {
      return this.getOrthographicRotateAction(startDragPoint, currentPoint, editType, props)
    }

    return super.getRotateAction(startDragPoint, currentPoint, editType, props)
  }

  getPickedHandle(picks: any[]) {
    const guidePicks = picks?.filter((pick) => pick.isGuide && pick.object.properties.guideType === 'editHandle') ?? []
    return guidePicks
             .filter((pick) => pick.object.properties.editHandleType === 'rotate')
             .map((pick) => pick.object)[0] ?? null
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {
    this._selectedEditHandle = this.getPickedHandle(event.picks)
    super.handleStartDragging(event, props);
    (props as any).context.hideGuides = (props as any).context.hideGuides || this._isRotating
  }

  updateCursor(props: ModeProps<FeatureCollection>) {
    if (this._selectedEditHandle) {
      props.onUpdateCursor('move')
    } else {
      props.onUpdateCursor(null)
    }
  }
}
