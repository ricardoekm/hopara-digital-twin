import { Logger } from '@hopara/internals'
import actions, {ActionTypes} from '../../state/Actions'
import {getType} from 'typesafe-actions'
import { Reducer } from '@hopara/state'

export interface JumpVisualization {
  visualizationId: string
  fallbackVisualizationId: string | undefined
}

class JumpHistory extends Array<JumpVisualization> {
  isJumping(): boolean {
    return this.length > 1
  }

  getPreviousVisualization(): JumpVisualization | undefined {
    return this[this.length - 2]
  }
}

const storeKey = 'hopara-jump-history'

export class JumpStore {
  history: JumpHistory

  constructor(history?: JumpHistory | JumpVisualization[]) {
    this.history = new JumpHistory(...(history ?? []))
  }

  persist(history: JumpVisualization[]): void {
    try {
      sessionStorage?.setItem(storeKey, JSON.stringify(history))
    } catch (e) {
      Logger.error(new Error('Failed to persist jump history ' + e))
    }
  }

  static restore(): JumpVisualization[] | undefined {
    try {
      const history = sessionStorage?.getItem(storeKey)
      if (!history) return undefined
      const parsed = JSON.parse(history)
      return parsed?.filter((item: any) => typeof item === 'object' && item.visualizationId)
    } catch (e) {
      Logger.error(new Error('Failed to restore jump history ' + e))
      return
    }
  }

  toggleHistoryItem(visualizationId?: string, fallbackVisualizationId?: string): JumpStore {
    if (!visualizationId) return this

    const previousVisualization = this.history.getPreviousVisualization()
    let history

    if (
      previousVisualization?.visualizationId === visualizationId &&
      previousVisualization.fallbackVisualizationId === fallbackVisualizationId
    ) {
      history = this.history.slice(0, -1)
    } else {
      history = [...this.history, {visualizationId, fallbackVisualizationId}]
    }

    this.persist(history)
    return new JumpStore(history)
}

  static init(visualizationId?: string, fallbackVisualizationId?: string): JumpStore {
    const storedHistory = this.restore()
    const isSameAsLast = storedHistory &&
                         storedHistory[storedHistory.length - 1]?.visualizationId === visualizationId &&
                         storedHistory[storedHistory.length - 1]?.fallbackVisualizationId === fallbackVisualizationId

    if (isSameAsLast) {
      return new JumpStore(storedHistory)
    }

    return new JumpStore(visualizationId ? [{visualizationId, fallbackVisualizationId}] : [])
  }
}

export const jumpReducer: Reducer<JumpStore, ActionTypes> = (state, action, globalState): JumpStore => {
  if (!state && globalState?.jump) return globalState?.jump
  else if (!state) return new JumpStore()

  switch (action.type) {
    case getType(actions.visualization.routeChanged): {
      let jumpState = state
      if (!action.payload.jumpBack || !action.payload.oldParams) return jumpState
      if (!state.history.length) jumpState = JumpStore.init(action.payload.oldParams.visualizationId, action.payload.oldParams.fallbackVisualizationId)
      return jumpState.toggleHistoryItem(action.payload.params.visualizationId, action.payload.params.fallbackVisualizationId)
    }
    default:
      return state
  }
}
