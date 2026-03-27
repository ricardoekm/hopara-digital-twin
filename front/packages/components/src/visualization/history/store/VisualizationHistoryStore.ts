import { isNil } from 'lodash/fp'
import { VisualizationHistory } from '../domain/VisualizationHistory'

export enum HistoryStatus {
  CLOSED= 'closed',
  IDLE= 'idle',
  LOADING= 'loading',
  ERROR= 'error',
}

export class VisualizationHistoryStore {
  status: HistoryStatus
  history: VisualizationHistory
  currentVersion?: number

  constructor(props?: Partial<VisualizationHistoryStore>) {
    Object.assign(this, props)
    this.history = this.history ?? new VisualizationHistory()
    if (isNil(this.status)) this.status = HistoryStatus.CLOSED
  }

  setHistory(history: VisualizationHistory) {
    return new VisualizationHistoryStore({ history, status: HistoryStatus.IDLE })
  }

  setLoadStatus(loadStatus: HistoryStatus) {
    return new VisualizationHistoryStore({ status: loadStatus, history: this.history })
  }

  setCurrentVersion(version: number | undefined) {
    return new VisualizationHistoryStore({
      history: this.history,
      status: this.status,
      currentVersion: version,
    })
  }
}
