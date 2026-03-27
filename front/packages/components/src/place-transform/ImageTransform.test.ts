import {Row} from '@hopara/dataset'
import {getAnyViewState} from '../view-state/ViewState.test'
import {ImageTransform} from './ImageTransform'
import {ImageEncoding, PositionEncoding} from '@hopara/encoding'
import { Coordinates, RowCoordinates } from '@hopara/spatial'

const getAnyImageTransform = () => {
  return new ImageTransform(new ImageEncoding({field: 'imageField'}))
}

test('should add default bounds on row', async () => {
  const transformer = getAnyImageTransform()
  const row = new Row({_id: '1'})
  const expectedCoordinates = new RowCoordinates({
    geometry: [
      [0.27465820312508615, 0.19500694772821003],
      [0.27465820312508615, 0.263670944337299],
      [0.3433227539061732, 0.263670944337299],
      [0.3433227539061732, 0.19500694772821003],
      [0.27465820312508615, 0.19500694772821003],
    ],
  })

  const coordinates = await transformer.getCoordinates({
    viewState: getAnyViewState(),
    row,
    position: new PositionEncoding({
      coordinates: {field: 'imageBounds'},
    }),
    placeCoordinates: Coordinates.fromArray([0.3089904785153752, 0.22933898720471044]),
  })

  expect(coordinates).toEqual(expectedCoordinates)
})

test('should add bounds with target zoom', async () => {
  const transformer = getAnyImageTransform()
  const row = new Row({_id: '1'})
  const expectedCoordinates = new RowCoordinates({
    geometry: [
      [0.3046989440917131, 0.2250474865203597],
      [0.3046989440917131, 0.23363048660225966],
      [0.31328201293952074, 0.23363048660225966],
      [0.31328201293952074, 0.2250474865203597],
      [0.3046989440917131, 0.2250474865203597],
    ],
  })

  const coordinates = await transformer.getCoordinates({
    viewState: getAnyViewState(),
    row,
    position: new PositionEncoding({
      coordinates: {field: 'imageBounds'},
    }),
    placeCoordinates: Coordinates.fromArray([0.3089904785153752, 0.22933898720471044]),
    targetZoom: 13,
  })

  expect(coordinates).toEqual(expectedCoordinates)
})
