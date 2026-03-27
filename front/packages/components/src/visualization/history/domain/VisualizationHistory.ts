import { clone } from 'lodash/fp'

export enum VisualizationHistoryStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
}

export interface VisualizationHistoryItem {
  version: number,
  editedBy: string,
  editedAt: Date
}

export class VisualizationHistory extends Array<VisualizationHistoryItem> {
  public status: VisualizationHistoryStatus

  clone() {
    return new VisualizationHistory(...clone(this))
  }

  constructor(...args: any[]) {
    super(...args)
    this.status = VisualizationHistoryStatus.IDLE
  }
}
