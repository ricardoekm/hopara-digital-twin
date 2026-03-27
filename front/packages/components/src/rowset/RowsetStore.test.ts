import {RowsetStatus} from './RowsetStatus'
import {RowsetStore} from './RowsetStore'
import {Rowset} from './Rowset'
import {Rows} from '@hopara/dataset'
import { getAnyData } from '../query/Data.test'
import { PositionEncoding } from '@hopara/encoding'
import { Data } from '@hopara/encoding'
import { SimpleFetchState } from './fetch/SimpleFetchState'

let rowsetA
let rowsetB

export function getAnyRowsetStore() : RowsetStore {
  const rowsetStore = new RowsetStore()
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'longitude',
    },
    y: {
      field: 'latitude',
    },
  })


  const rowset = new Rowset({
    data: getAnyData(),
    positionEncoding,
  })
  rowset.rows = new Rows([{_id: '1'}, {_id: '2'}])
  rowsetStore.add(rowset)
  return rowsetStore
}

beforeEach(() => {
  rowsetA = new Rowset({data: new Data({query: '123', source: 'ds'}), fetchState: new SimpleFetchState({})})
  rowsetB = new Rowset({data: new Data({query: '456', source: 'ds'}), fetchState: new SimpleFetchState({})})
})


test('Clone doesnt change the original', () => {
  const rowsetStore1 = new RowsetStore()

  const rowsetStore2 = rowsetStore1.clone()
  rowsetStore2.add(rowsetA)
  expect(rowsetStore1.getByTargetRowset(rowsetA)).toBeUndefined()
  expect(rowsetStore2.getByTargetRowset(rowsetA)).toBe(rowsetA)
})

test('Get by target rowset', () => {
  const rowsetStore = new RowsetStore()
  rowsetStore.add(rowsetA)
  rowsetStore.add(rowsetB)

  expect(rowsetStore.getByTargetRowset(rowsetA)).toEqual(rowsetA)
})

test('Invalidate by id', () => {
  const rowsetStore = new RowsetStore()
  rowsetStore.add(rowsetA)
  rowsetStore.add(rowsetB)
  rowsetStore.invalidateById(rowsetA.getId())

  expect(rowsetStore.getByTargetRowset(rowsetA)?.fetchState?.isInvalidated()).toBeTruthy()
  expect(rowsetStore.getByTargetRowset(rowsetB)?.fetchState?.isInvalidated()).toBeFalsy()
})

test('Some loading', () => {
  const rowsetStore = new RowsetStore()
  rowsetStore.status['a'] = RowsetStatus.NONE
  rowsetStore.status['b'] = RowsetStatus.LOADING

  expect(rowsetStore.someLoading()).toEqual(true)
})

test('All loaded', () => {
  const rowsetStore = new RowsetStore()
  expect(rowsetStore.allLoaded()).toEqual(true)

  rowsetStore.status['a'] = RowsetStatus.NONE
  rowsetStore.status['b'] = RowsetStatus.LOADING
  expect(rowsetStore.allLoaded()).toEqual(false)

  rowsetStore.status['a'] = RowsetStatus.LOADED
  rowsetStore.status['b'] = RowsetStatus.LOADED
  expect(rowsetStore.allLoaded()).toEqual(true)
})

test('None filled', () => {
  const rowsetStore = new RowsetStore()
  expect(rowsetStore.noneFilled()).toEqual(true)
  rowsetStore.add(rowsetA)
  expect(rowsetStore.noneFilled()).toEqual(false)
})

test('every with error', () => {
  const rowsetStore = new RowsetStore()
  rowsetStore.add(rowsetA)
  rowsetStore.add(rowsetB)
  expect(rowsetStore.everyWithError()).toEqual(false)

  const rowsetStoreWithSomeErrors = rowsetStore.setStatus(rowsetA, RowsetStatus.ERROR)
  expect(rowsetStoreWithSomeErrors.everyWithError()).toEqual(false)

  const rowsetStoreWithErrors = rowsetStore.setStatus(rowsetA, RowsetStatus.ERROR)
                                           .setStatus(rowsetB, RowsetStatus.ERROR)
  expect(rowsetStoreWithErrors.everyWithError()).toEqual(true)
})
