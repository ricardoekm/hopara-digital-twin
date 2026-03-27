import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {Beforeunload} from 'react-beforeunload'
import {i18n} from '@hopara/i18n'
import {PanelMenu} from '@hopara/design-system/src/panel/PanelMenu'
import {MenuOption} from '@hopara/design-system/src/panel/PanelMenuItems'
import {VisualizationEditStatus} from '../visualization/VisualizationEditStatus'
import {Layers} from '../layer/Layers'
import {DetailsState} from '../details/state/DetailsReducer'
import {FilterEditorContainer} from './filter/FilterEditorContainer'
import {LegendEditorContainer} from './legend/LegendEditorContainer'
import {MenuItem} from '../menu/MenuStore'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {SettingsMenuItemId} from './SettingsMenu'
import {ActionsContainer} from '../action/ActionsContainer'
import {SettingsShortcuts} from './SettingsShortcuts'
import {PanelWrapper} from '@hopara/design-system/src/VisualizationLayout'
import {GeneralPanelContainer} from './general/GeneralPanel'
import {Authorization} from '@hopara/authorization'
import {LightsContainer} from '../lights/LightsContainer'
import {FloorEditorContainer} from './floor/FloorEditorContainer'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {CloseEditorButtonContainer} from '../visualization/CloseEditorContainer'
import {SaveDiscardEditorContainer} from '../visualization/SaveDiscardEditorContainer'
import {VisualizationHistoryContainer} from '../visualization/history/VisualizationHistoryContainer'
import {Area} from '../visualization/pages/Area'
import {PanelButton} from '@hopara/design-system/src/buttons/PanelButton'
import { GridEditorContainer } from './grid/GridEditorContainer'

export interface StateProps {
  details?: DetailsState
  visualizationName?: string
  visualizationId?: string
  fallbackVisualizationId?: string
  layers: Layers
  visualizationStatus?: VisualizationEditStatus
  menuItems: MenuItem[]
  selectedMenuItemId?: string
  authorization: Authorization
  historyOpen: boolean
  exitDestination?: Area
}

export interface ActionProps {
  onMenuItemClick: (item: MenuOption) => void
  onLoad: () => void
  onHistoryClick: () => void
}

export class SettingsOutlet extends PureComponent<StateProps & ActionProps> {
  componentDidMount(): void {
    this.props.onLoad()
  }

  getComponent() {
    if (!this.props.selectedMenuItemId) return undefined
    switch (this.props.selectedMenuItemId) {
      case SettingsMenuItemId.FILTERS:
        return <FilterEditorContainer/>
      case SettingsMenuItemId.COLOR_LEGENDS:
        return <LegendEditorContainer/>
      case SettingsMenuItemId.GENERAL:
        return <GeneralPanelContainer/>
      case SettingsMenuItemId.ACTIONS:
        return <ActionsContainer/>
      case SettingsMenuItemId.LIGHTS:
        return <LightsContainer/>
      case SettingsMenuItemId.FLOORS:
        return <FloorEditorContainer/>
      case SettingsMenuItemId.GRID:
        return <GridEditorContainer/>
    }
  }

  getMenuOptions(): MenuOption[] {
    return this.props.menuItems.map((item) => {
      return ({
        id: item.id,
        name: item.name,
        icon: <Icon icon={item.icon ?? 'help'}/>,
        selected: this.props.selectedMenuItemId === item.id,
      })
    })
  }

  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.props.exitDestination && this.props.visualizationStatus === VisualizationEditStatus.DIRTY) {
      event.preventDefault()
    }
  }

  render() {
    const selectedComponent = this.getComponent()
    const isSavingOrDiscarding = this.props.visualizationStatus === VisualizationEditStatus.SAVING || this.props.visualizationStatus === VisualizationEditStatus.DISCARDING
    const isDirty = this.props.visualizationStatus === VisualizationEditStatus.DIRTY
    return (
      <>
        <SettingsShortcuts/>
        <Beforeunload onBeforeunload={this.handleBeforeUnload.bind(this)}/>
        <PanelWrapper opaqueBackground>
          {this.props.historyOpen && <VisualizationHistoryContainer/>}
          {!this.props.historyOpen &&
            <>
              <PanelTitleBar
                title={i18n('SETTINGS')}
                buttons={[
                  <SaveDiscardEditorContainer key="save-discard"/>,
                  <>
                    {isDirty || !isSavingOrDiscarding && <PanelButton onClick={this.props.onHistoryClick} key="history-button">
                      <Icon icon="history"/>
                    </PanelButton>
                    }
                  </>,
                  <CloseEditorButtonContainer key="close"/>,
                ]}>
              </PanelTitleBar>
              <PanelMenu
                items={this.getMenuOptions()}
                onItemClick={this.props.onMenuItemClick}
                loading={false}
              />
              {selectedComponent}
            </>}
        </PanelWrapper>
      </>
    )
  }
}
