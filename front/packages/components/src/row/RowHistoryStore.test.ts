import { Row } from '@hopara/dataset'
import { ResourceHistoryType, RowHistoryStore, RowSavedStatus } from './RowHistoryStore'

describe('RowHistoryStore', () => {
  it('should create an instance', () => {
    expect(new RowHistoryStore()).toBeTruthy()
  })

  it('should create an instance with props', () => {
    const store = new RowHistoryStore({status: RowSavedStatus.idle})
    expect(store.status).toBe('idle')
  })

  it('should set status', () => {
    const store = new RowHistoryStore().setStatus(RowSavedStatus.saving)
    expect(store.status).toBe('saving')
  })

  it('should clear history', () => {
    const store = new RowHistoryStore({history: [{layerId: '1', rowsetId: '1', row: new Row({})}]})
    expect(store.clear().history).toEqual([])
  })

  it('should push history', () => {
    const row = new Row({})
    const store = new RowHistoryStore().push({layerId: '1', rowsetId: '1', row}).push({layerId: '2', rowsetId: '2', row})
    expect(store.history).toEqual([{layerId: '2', rowsetId: '2', row}, {layerId: '1', rowsetId: '1', row}])
  })

  it('should get last history', () => {
    const row = new Row({_id: 1})
    const store = new RowHistoryStore()
      .push({layerId: '1', rowsetId: '1', row})
      .push({layerId: '2', rowsetId: '2', row, type: ResourceHistoryType.image, version: 1})
    expect(store.last()).toEqual({layerId: '2', rowsetId: '2', row, type: ResourceHistoryType.image, version: 1})
  })

  it('should get last row history', () => {
    const row = new Row({_id: 1})
    const store = new RowHistoryStore()
      .push({layerId: '1', rowsetId: '1', row})
      .push({layerId: '2', rowsetId: '2', row, type: ResourceHistoryType.image, version: 1})
    expect(store.lastRowHistory()).toEqual({layerId: '1', rowsetId: '1', row})
  })

  it('should get last row history from layer', () => {
    const row = new Row({_id: 1})
    const store = new RowHistoryStore()
      .push({layerId: '1', rowsetId: '1', row})
      .push({layerId: '1', rowsetId: '1', row: new Row({_id: 2})})
      .push({layerId: '2', rowsetId: '2', row})
    expect(store.lastRowHistory('1')).toEqual({layerId: '1', rowsetId: '1', row: new Row({_id: 2})})
  })
})
