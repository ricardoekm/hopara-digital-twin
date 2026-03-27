import { Coordinates } from '@hopara/spatial'
import ViewState from '../../view-state/ViewState'
import { Layer } from '../../layer/Layer'
import { Row } from '@hopara/dataset'
import { getTextDimensions } from './TextDimensions'

const getSizePixels = (layer:Layer, viewState: ViewState) => {
  return viewState.getViewport()?.getSizePixels(
    layer?.encoding?.size?.getRenderValue() ?? 1,
    layer?.encoding?.getUnits()) ?? 1
}

const getUnprojectedBBox = (bbox: number[][], width: number, height: number, viewState: ViewState) => {
  return [
    viewState.unprojectCoordinate(Coordinates.fromArray([
      bbox[0][0] - (width / 2),
      bbox[0][1] + (height / 2), // the Y is inverted because this number is the screen pixel
    ])),
    viewState.unprojectCoordinate(Coordinates.fromArray([
      bbox[1][0] + (width / 2),
      bbox[1][1] - (height / 2), // the Y is inverted because this number is the screen pixel
    ])),
  ] as unknown as [[number, number], [number, number]]
}

export const getBBox = (coordinates: number[][], viewState: ViewState, referenceLayer: Layer): [[number, number], [number, number]] => {
  const bbox = coordinates.reduce((acc, coord) => {
    return [
      [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
      [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])],
    ]
  }, [[Infinity, Infinity], [-Infinity, -Infinity]])

  if (referenceLayer && !referenceLayer.isCoordinatesBased() && referenceLayer?.encoding?.size) {
    const unprojectBbox = bbox.map((coord) => viewState.projectCoordinate(Coordinates.fromArray(coord)))
    const size = getSizePixels(referenceLayer, viewState)
    return getUnprojectedBBox(
      unprojectBbox,
      size,
      size,
      viewState,
    )
  }
  
  return bbox as unknown as [[number, number], [number, number]]
}

export const getTextBBox = (row: Row, bounds: number[][], viewState: ViewState, referenceLayer: Layer): [[number, number], [number, number]] => {
  const text = row[referenceLayer.encoding.text?.field ?? '']
  if (!text) return getBBox(bounds, viewState, referenceLayer)
  
  const size = getSizePixels(referenceLayer, viewState)
  const {width, height} = getTextDimensions(text, size)
  const projectCentroid = viewState.projectCoordinate(Coordinates.fromArray(bounds[0]))
  return getUnprojectedBBox(
    [projectCentroid, projectCentroid],
    width,
    height,
    viewState,
  )
}
