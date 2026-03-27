import { Row, Rows } from '@hopara/dataset'
import { Layer } from '../layer/Layer'
import { Layers } from '../layer/Layers'
import { LayerStore } from '../layer/state/LayerStore'
import actions from '../state/Actions'
import { getAnyViewState } from '../view-state/ViewState.test'
import { saveImageBounds } from './ImageSaga'
import { RowsetStore } from '../rowset/RowsetStore'
import { Rowset } from '../rowset/Rowset'
import { Data, Encodings, PositionEncoding, TransformType } from '@hopara/encoding'
import { RowCoordinates } from '@hopara/spatial'
import {runSaga} from '@hopara/state/src/Effects/Saga.test'

describe('saveImageBounds', () => {
  const getStore = (overrides = {}) => ({
    viewState: getAnyViewState(),
    layerStore: new LayerStore({
      layers: new Layers(Layer.fromPlain({id: 'my-layer', encoding: new Encodings({ position: new PositionEncoding()})})),
    }),
    rowsetStore: new RowsetStore({
      'my-rowset': new Rowset({rows: new Rows(new Row({_id: 'my-row'}))}),
    }),
    ...overrides,
  })

  const getAction = (action: any, overrides?: any) => {
    return action({
      layerId: 'my-layer',
      resourceId: 'my-resource',
      dimensions: {
        width: 100,
        height: 100,
      },
      row: new Row({_id: 'my-row', _coordinates: new RowCoordinates({geometry: [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]})}),
      rowsetId: 'my-rowset',
      version: 0,
      ...overrides,
    })
  }

  test('should dispatch error if rowset doesnt existsi', async () => {
    const dispatched = await runSaga(
      getStore({ rowsetStore: new RowsetStore() }),
      saveImageBounds,
      getAction(actions.image.upload.success),
    )

    expect(dispatched[0].type).toEqual(actions.image.saveImageBoundsError({} as any).type)
  })

  test('should create new bounds based on action dimensions', async () => {
    const dispatched = await runSaga(
      getStore(),
      saveImageBounds,
      getAction(actions.image.upload.success),
    )

    expect(dispatched).toEqual([actions.image.boundsCreated({
      layerId: 'my-layer',
      rowsetId: 'no-source#no-query#no-position-source#no-position-query#no-transform#no-pos#no-refresh',
      row: new Row({_id: 'my-row', _coordinates: new RowCoordinates({geometry: [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]})}),
      rowCoordinates: new RowCoordinates({geometry: [
        [-0.07893771522060433, 0.09562109017928755],
        [0.08634248273540379, 10.056786331454632],
        [10.08516268560254, 9.906227139210642],
        [9.919912003156469, -0.05609007112520095],
        [-0.07893771522060433, 0.09562109017928755],
      ]}),
    })])
  })

  test('should use place transform as default bounds', async () => {
    const dispatched = await runSaga(
      getStore({
        layerStore: new LayerStore({
          layers: new Layers(Layer.fromPlain({data: new Data({transform: {type: TransformType.place} as any}), id: 'my-layer', encoding: new Encodings({ position: new PositionEncoding()})})),
        }),
      }),
      saveImageBounds,
      getAction(actions.image.upload.success, {row: new Row({_id: 'my-row'})}),
    )

    expect(dispatched).toEqual([actions.image.boundsCreated({
      layerId: 'my-layer',
      rowsetId: 'no-source#no-query#no-position-source#no-position-query#no-transform#no-pos#no-refresh',
      row: new Row({_id: 'my-row'}),
      rowCoordinates: new RowCoordinates({geometry: [
        [-0.18457199285433035, -0.18456804475995683],
        [-0.18456823885071572, 0.18457186517054028],
        [0.1845723861292754, 0.1845680345465668],
        [0.18456863212554708, -0.18457187538393038],
        [-0.18457199285433035, -0.18456804475995683],
      ]}),
    })])
  })
})
