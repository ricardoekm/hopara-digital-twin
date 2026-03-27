import {Row} from '@hopara/dataset'
import {PositionEncoding} from '@hopara/encoding'
import {getAnyViewState} from '../view-state/ViewState.test'
import {DefaultTransform} from './DefaultTransform'
import { Coordinates, RowCoordinates } from '@hopara/spatial'

test('should get row with centroid placed', async () => {
  const transformer = new DefaultTransform()
  const row = new Row({_id: 1})
  const expectedCoordinates = new RowCoordinates({x: -0.34332275390591876, y: 0.19500694772780292})

  const coordinates = await transformer
    .getCoordinates({
      viewState: getAnyViewState(),
      row,
      position: new PositionEncoding({
        x: {field: 'longitude'},
        y: {field: 'latitude'},
      }),
      placeCoordinates: Coordinates.fromArray([-0.34332275390591876, 0.19500694772780292]),
    })

  expect(coordinates).toEqual(expectedCoordinates)
})
