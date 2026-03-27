import Visualization from '../Visualization'
import visualization from '../Visualization'
import {VisualizationEditStatus} from '../VisualizationEditStatus'
import {VisualizationLoadStatus} from '../VisualizationLoadStatus'
import {Action, VisualizationJump} from '../../action/Action'
import {Actions} from '../../action/Actions'
import {SettingsMenuItemId} from '../../settings/SettingsMenu'
import { LightName } from '../../lights/Lights'

import {Area} from '../pages/Area'

export class VisualizationStore {
  visualization: Visualization
  editStatus?: VisualizationEditStatus
  loadStatus: VisualizationLoadStatus
  area: Area
  version?: number
  fallbackVisualizationId?: string
  exitDestination?: Area
  selectedActionId?: string
  advancedModeArea: SettingsMenuItemId[]
  isFullScreen: boolean

  constructor(props?: Partial<VisualizationStore>) {
    Object.assign(this, props)
    this.loadStatus = this.loadStatus ?? VisualizationLoadStatus.LOADING
    this.advancedModeArea = this.advancedModeArea ?? []
    this.isFullScreen = this.isFullScreen ?? false
    this.area = this.area ?? Area.VISUALIZATION
  }

  clone(): VisualizationStore {
    return new VisualizationStore(this)
  }

  setVisualization(visualization: Visualization): VisualizationStore {
    const cloned = this.clone()
    cloned.visualization = visualization
    return cloned
  }

  setArea(area: any): VisualizationStore {
    const cloned = this.clone()
    cloned.area = area
    cloned.exitDestination = undefined
    return cloned
  }

  setEditStatus(status: VisualizationEditStatus) {
    const cloned = this.clone()
    cloned.editStatus = status
    return cloned
  }

  setLoadStatus(status: VisualizationLoadStatus): VisualizationStore {
    return new VisualizationStore({
      ...this,
      loadStatus: status,
    })
  }

  isReady(): boolean {
    return !!this.visualization && this.loadStatus === VisualizationLoadStatus.LOADED
  }

  setVersion(version?: number): VisualizationStore {
    return new VisualizationStore({
      ...this,
      version,
      editStatus: version ? VisualizationEditStatus.DIRTY : this.editStatus,
    })
  }

  setFallbackVisualizationId(fallbackVisualizationId?: string): VisualizationStore {
    return new VisualizationStore({
      ...this,
      fallbackVisualizationId,
    })
  }

  setExitingDestination(destination?: Area) {
    const cloned = this.clone()
    cloned.exitDestination = destination
    return cloned
  }

  changeActions(actions: Actions): VisualizationStore {
    return this.setVisualization(this.visualization.immutableUpdateActions(actions))
  }

  selectAction(id?: string) {
    const cloned = this.clone()
    cloned.selectedActionId = id
    return cloned
  }

  changeAction(action: Action) {
    const cloned = this.clone()
    cloned.visualization = cloned.visualization.immutableUpdateActions(cloned.visualization.actions.immutableUpsert(action))
    return cloned
  }

  deleteAction(actionId: string) {
    const cloned = this.clone()
    cloned.visualization = cloned.visualization.immutableUpdateActions(cloned.visualization.actions.immutableRemove(actionId))
    return cloned
  }

  createAction() {
    const cloned = this.clone()
    const action = new VisualizationJump()
    cloned.visualization = cloned.visualization.immutableUpdateActions(cloned.visualization.actions.immutableUpsert(action))
    cloned.selectedActionId = action.id
    return cloned
  }

  moveAction(sourceIndex: number, destinationIndex: number) {
    const cloned = this.clone()
    cloned.visualization = cloned.visualization.immutableUpdateActions(cloned.visualization.actions.immutableMove(sourceIndex, destinationIndex))
    return cloned
  }

  setRefreshPeriod(refreshPeriod: number | undefined) {
    const cloned = this.clone()
    cloned.visualization = new visualization(cloned.visualization)
    cloned.visualization.refreshPeriod = refreshPeriod
    return cloned
  }

  setAutoNavigation(autoNavigation: any) {
    const cloned = this.clone()
    cloned.visualization = new visualization(cloned.visualization)
    cloned.visualization.autoNavigation = autoNavigation
    return cloned
  }

  setAdvancedModeArea(area: SettingsMenuItemId, enabled: boolean) {
    const cloned = this.clone()
    if (enabled) {
      cloned.advancedModeArea = [...cloned.advancedModeArea, area]
    } else {
      cloned.advancedModeArea = cloned.advancedModeArea.filter((a) => a !== area)
    }
    return cloned
  }

  clearAdvancedModeArea() {
    const cloned = this.clone()
    cloned.advancedModeArea = []
    return cloned
  }

  setFullScreen(fullScreen: boolean) {
    const cloned = this.clone()
    cloned.isFullScreen = fullScreen
    return cloned
  }

  setLight(name: LightName, light: any) {
    const cloned = this.clone()
    cloned.visualization = new Visualization({
      ...cloned.visualization,
      lights: cloned.visualization.lights!.setLight(name, light),
    })
    return cloned
  }

  isOnObjectEditor() {
    return this.area === Area.OBJECT_EDITOR
  }

  isOnViewerMode() {
    return this.area === Area.VISUALIZATION
  }

  isOnSettings() {
    return this.area === Area.SETTINGS
  }

  isOnLayerEditor() {
    return this.area === Area.LAYER_EDITOR
  }
}
