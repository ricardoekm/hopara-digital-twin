import {Row} from '@hopara/dataset'
import { drop } from 'lodash/fp'

export enum RowSavedStatus {
  idle = 'idle',
  saving = 'saving',
  fitting = 'fitting',
  saved = 'saved',
}

export const SAVING_STATUSES = [RowSavedStatus.saving, RowSavedStatus.fitting]

export interface RowHistory {
  layerId: string
  rowsetId: string
  row: Row
}

export enum ResourceHistoryType {
  image = 'image',
  model = 'model',
}

export interface ResourceHistory extends RowHistory {
  version: number
  type: ResourceHistoryType
}

export class RowHistoryStore {
  status?: RowSavedStatus
  history: Array<RowHistory | ResourceHistory>

  constructor(props?: Partial<RowHistoryStore>) {
    Object.assign(this, props)
    if (!this.history) this.history = []
  }

  setStatus(status: RowSavedStatus) {
    return new RowHistoryStore({...this, status})
  }

  clear() {
    return new RowHistoryStore({
      ...this,
      history: [],
    })
  }

  push(history: RowHistory | ResourceHistory) {
    return new RowHistoryStore({
      ...this,
      history: [history].concat(this.history),
    })
  }

  last(): RowHistory | ResourceHistory | undefined {
    if (!this.history.length) return
    return this.history[0]
  }

  isRowHistory(history: RowHistory | ResourceHistory): history is RowHistory {
    return !('type' in history)
  }

  lastRowHistory(layerId?: string): RowHistory | undefined {
    return this.history.find((h) => {
      const isOfRowHistoryType = this.isRowHistory(h)
      if (!isOfRowHistoryType) return false
      return layerId ? h.layerId === layerId : true
    })
  }

  removeLast() {
    return new RowHistoryStore({
      ...this,
      history: drop(1, this.history),
    })
  }
}
