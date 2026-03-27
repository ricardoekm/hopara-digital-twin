import 'reflect-metadata'
import { refreshData, watchForInitialLoadComplete } from './RowsetSaga'
import { RowsetStore } from './RowsetStore'
import rowsetActions from './RowsetActions'
import { RowsetStatus } from './RowsetStatus'
import { World } from '../world/World'
import ViewState from '../view-state/ViewState'
import QueryStore from '../query/QueryStore'
import { LayerStore } from '../layer/state/LayerStore'
import { VisualizationStore } from '../visualization/state/VisualizationStore'
import { Layers } from '../layer/Layers'
import { Layer, PlainLayer } from '../layer/Layer'
import { Data } from '@hopara/encoding'
import { FilterStore } from '../filter/state/FilterStore'
import { FloorStore } from '../floor/FloorStore'
import { Floor } from '../floor/Floor'
import { SelectedFilters } from '../filter/domain/SelectedFilters'
import { SelectedFilter } from '../filter/domain/SelectedFilter'
import {runSaga} from '@hopara/state/src/Effects/Saga.test'
import {container} from 'tsyringe'
import { FetchController, FetchControllerToken } from './fetch/FetchController'
import { SimpleFetchController } from './fetch/SimpleFetchController'

container.register<FetchController>(FetchControllerToken, {useClass: SimpleFetchController})

describe('watchForInitialLoadComplete', () => {
  test('should dispatch loadComplete if all rowset are loaded', async () => {
    const dispatched = await runSaga(
      { rowsetStore: new RowsetStore({}, {rowset1: RowsetStatus.LOADED, rowset2: RowsetStatus.LOADED}) },
      watchForInitialLoadComplete,
    )

    expect(dispatched).toEqual([rowsetActions.loadComplete()])
  })

  test('should not dispatch loadComplete if has any rowset not loaded yet', async () => {
    const dispatched = await runSaga(
      { rowsetStore: new RowsetStore({}, {rowset1: RowsetStatus.LOADED, rowset2: RowsetStatus.LOADING}) },
      watchForInitialLoadComplete,
    )

    expect(dispatched).toEqual([])
  })
})

describe('refreshData', () => {
  const getMockStore = (overrides = {}) => ({
    rowsetStore: new RowsetStore(),
    layerStore: new LayerStore({
      layers: new Layers(new Layer({data: new Data({source: 'test-source', query: 'test-query'})} as PlainLayer)),
    }),
    visualizationStore: new VisualizationStore(),
    world: new World(),
    viewState: new ViewState(),
    queryStore: new QueryStore(),
    filterStore: new FilterStore(),
    floorStore: new FloorStore(),
    ...overrides,
  })

  const getExpectedPayload = (mockStore: any, overrides = {}) => ({
    visualization: mockStore.visualizationStore.visualization,
    rowset: mockStore.layerStore.layers[0].getRowset()!,
    viewState: mockStore.viewState,
    selectedFilters: mockStore.filterStore.selectedFilters,
    prefetch: false,
    floor: mockStore.floorStore.current,
    ...overrides,
  })

  test('should dispatch fetch with floor', async () => {
    const floor = new Floor({id: 'test-floor'})
    const mockStore = getMockStore({ floorStore: new FloorStore().setCurrent(floor) })
    const dispatched = await runSaga(mockStore, refreshData)
    expect(dispatched).toEqual([rowsetActions.fetchDataRequested(getExpectedPayload(mockStore, {floor}))])
  })

  test('should dispatch fetch with filters', async () => {
    const selectedFilters = new SelectedFilters(new SelectedFilter({field: 'test-field', values: ['test-value']}))
    const mockStore = getMockStore({ filterStore: new FilterStore().setSelectedFilters(selectedFilters) })
    const dispatched = await runSaga(mockStore, refreshData)
    expect(dispatched).toEqual([rowsetActions.fetchDataRequested(getExpectedPayload(mockStore, { selectedFilters }))])
  })
})
