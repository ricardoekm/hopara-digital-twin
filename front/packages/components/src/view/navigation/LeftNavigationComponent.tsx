import React from 'react'
import Visualization from '../../visualization/Visualization'
import {Floor} from '../../floor/Floor'
import {PureComponent} from '@hopara/design-system'
import {Authorization} from '@hopara/authorization'
import {SelectedFilters} from '../../filter/domain/SelectedFilters'
import {JumpBackButton} from './buttons/JumpBackButton'
import {FilterButton} from './buttons/FilterButton'
import {ObjectEditorButton} from './buttons/ObjectEditorButton'
import {SettingsButton} from './buttons/SettingsButton'
import {CanvasNavigationBar} from '@hopara/design-system/src/navigation/CanvasNavigationBar'
import {VisualizationsListButton} from './buttons/VisualizationsListButton'
import {Config} from '@hopara/config'
import { JumpVisualization } from '../../jump/state/JumpReducer'
import {LayerEditorButton} from './buttons/LayerEditorButton'
import { HistoryBackButton } from './buttons/HistoryBackButton'

export interface StateProps {
  currentFloor: Floor | undefined
  jumpedVisualization?: JumpVisualization
  visualization?: Visualization
  fallbackVisualizationId?: string
  isJumping?: boolean
  hasFilters: boolean
  authorization: Authorization
  selectedFilters: SelectedFilters
  isOnObjectEditor: boolean
  isOnSettings: boolean
  isOnLayerEditor: boolean
  isOnFilters: boolean
  settingsLink: string
  layerEditorLink: string
  visualizationsListLink: string
  isOnViewerMode: boolean
  hasSelectedFilters: boolean,
  visible?: boolean
  isEditingDirtyVisualization: boolean
  canNavigateBack: boolean
}

export interface ActionProps {
  onJumpBackClick: () => void
  onZoomInClick: () => void
  onZoomOutClick: () => void
  onFiltersClick: () => void
  onGoToObjectEditorClick: () => void
  onGoToSettingsClick: (event: any) => void
  onVisualizationListClick: (event: any) => void
  onGoToLayerEditorClick: (event: any) => void
  onHistoryBackClick: (event:any) => void
}

export class LeftNavigationComponent extends PureComponent<StateProps & ActionProps> {
  render() {
    const isEmbedded = Config.getValueAsBoolean('IS_EMBEDDED')
    const canEditRow = this.props.authorization.canEditRow()
    const canEditVisualization = this.props.authorization.canEditVisualization()

    return (
      <CanvasNavigationBar
        className={this.props.visible ? 'canvasNavigationBarisVisible' : 'canvasNavigationBarisHidden'}
        sx={{ 'gridRowEnd': -1, '--gridArea': 'left' }}>
        {!isEmbedded && !this.props.isJumping &&
          <VisualizationsListButton
            link={this.props.visualizationsListLink}
            onClick={this.props.onVisualizationListClick}/>
        }
        {this.props.canNavigateBack &&
          <HistoryBackButton onClick={this.props.onHistoryBackClick}/>
        }
        <JumpBackButton
          onClick={this.props.onJumpBackClick}
          isJumping={this.props.isJumping}/>
        {canEditRow &&
          <ObjectEditorButton
            onClick={this.props.onGoToObjectEditorClick}
            active={this.props.isOnObjectEditor}
            tenant={this.props.authorization.tenant}
          />
        }
        {canEditVisualization &&
          <LayerEditorButton
            href={this.props.layerEditorLink}
            onClick={this.props.onGoToLayerEditorClick}
            active={this.props.isOnLayerEditor}
          />
        }
        {canEditVisualization &&
          <SettingsButton
            href={this.props.settingsLink}
            onClick={this.props.onGoToSettingsClick}
            active={this.props.isOnSettings}
          />
        }
        {this.props.hasFilters &&
          <FilterButton
            hasSelectedFilters={this.props.hasSelectedFilters}
            onClick={this.props.onFiltersClick}
            active={this.props.isOnFilters}/>
        }
      </CanvasNavigationBar>
    )
  }
}
