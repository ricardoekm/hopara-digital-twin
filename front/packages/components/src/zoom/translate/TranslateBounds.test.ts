import {Navigate} from '../../action/Action'
import {translateBounds} from './TranslateBounds'
import {Visible} from '../../layer/Visible'
import {ZoomRange} from '../ZoomRange'
import {Row} from '@hopara/dataset'
import {getAnyViewState} from '../../view-state/ViewState.test'
import {Layer, PlainLayer} from '../../layer/Layer'
import {Encodings, SizeEncoding} from '@hopara/encoding'
import { getBBox } from './BoundingBox'
import { SizeUnits } from '@hopara/encoding/src/size/SizeEncoding'
import { RowCoordinates } from '@hopara/spatial'
import { EncodingConfig } from '@hopara/encoding/src/config/EncodingConfig'

test('should translate relative zoom with referenced row bounds', () => {
  const action: Navigate = {zoom: {}}
  const layer = new Layer({
    visible: new Visible({
      zoomRange: new ZoomRange({
        min: {value: 5},
        max: {value: 15},
      }),
    }),
  } as PlainLayer)
  const coordinates = new RowCoordinates({geometry: [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]})
  const row = new Row({_coordinates: coordinates})
  const viewState = getAnyViewState({dimensions: {width: 1200, height: 768}, orthographic: true})

  expect(translateBounds(layer, row, viewState, action)).toEqual(5.4)
})

test('should translate relative zoom with referenced row bounds with increment', () => {
  const action: Navigate = { zoom: { increment: 2 } }
  const layer = new Layer({
    visible: new Visible({
      zoomRange: new ZoomRange({
        min: {value: 5},
        max: {value: 15},
      }),
    }),
  } as PlainLayer)

  const coordinates = new RowCoordinates({geometry: [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]})
  const row = new Row({_coordinates: coordinates})
  const viewState = getAnyViewState({dimensions: {width: 1200, height: 768}, orthographic: true})

  expect(translateBounds(layer, row, viewState, action)).toEqual(7.4)
})

test('should translate relative zoom with referenced row bounds with custom padding', () => {
  const action: Navigate = { zoom: { padding: 33 } }
  const layer = new Layer({
    visible: new Visible({
      zoomRange: new ZoomRange({min: {value: 5}, max: {value: 15}}),
    }),
  } as PlainLayer)
  const coordinates = new RowCoordinates({geometry: [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]})
  const row = new Row({_coordinates: coordinates})
  const viewState = getAnyViewState({dimensions: {width: 1200, height: 768}, orthographic: true})

  expect(translateBounds(layer, row, viewState, action)).toEqual(5)
})

test('should get bbox of any geometry with layer size', () => {
  const viewState = getAnyViewState({dimensions: {width: 1200, height: 768}, orthographic: true})
  const layer = new Layer({encoding: new Encodings({size: new SizeEncoding({value: 10}), config: new EncodingConfig({units: SizeUnits.COMMON})})} as PlainLayer)
  expect(getBBox([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]], viewState, layer)).toEqual([
    [-3.515624999999683, -3.513421045639472], [13.515625000000256, 13.44175800741691],
  ])
  expect(getBBox([[0, 0], [0, 10], [10, 10]], viewState, layer)).toEqual([
    [-3.515624999999683, -3.513421045639472], [13.515625000000256, 13.44175800741691],
  ])
  expect(getBBox([[0, 0], [0, 10]], viewState, layer)).toEqual([
    [-3.515624999999683, -3.513421045639472], [3.515625000000166, 13.44175800741691],
  ])
  expect(getBBox([[0, 0]], viewState, layer)).toEqual([
    [-3.515624999999683, -3.513421045639472], [3.515625000000166, 3.513421045640439]])
})
