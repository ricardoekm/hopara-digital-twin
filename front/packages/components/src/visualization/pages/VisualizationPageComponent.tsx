import React from 'react'
import {Helmet} from 'react-helmet'
import {Authorization} from '@hopara/authorization'
import {VisualizationRouteProvider} from '../VisualizationRouteProvider'
import {PureComponent} from '@hopara/design-system'
import {VisualizationLayout} from '@hopara/design-system/src/VisualizationLayout'
import {Outlet} from 'react-router-dom'
import {ViewContainer} from '../../view/ViewContainer'
import {NavigationContainer} from '../../view/navigation/NavigationContainer'
import {LeftNavigationContainer} from '../../view/navigation/LeftNavigationContainer'
import {TopNavigationComponent} from '../../view/navigation/TopNavigationComponent'
import {LegendContainer} from '../../legend/LegendContainer'
import TooltipContainer from '../../tooltip/TooltipContainer'

import {Area} from './Area'
import {VisualizationEditStatus} from '../VisualizationEditStatus'
import {i18n} from '@hopara/i18n'
import {Layer} from '../../layer/Layer'
import {SaveDiscardDialog} from './SaveDiscardDialog'

export interface StateProps {
  authorization: Authorization
  visualizationName?: string
  fullScreen: boolean
  area: Area
  hasRow: boolean
  isAdvancedMode: boolean
  hasPanelOpened: boolean
  layer?: Layer
  exitDestination?: Area
  visualizationStatus?: VisualizationEditStatus
  isPanelCollapsed?: boolean
}

export interface ActionProps {
  onFullScreenExit: () => void
  onDiscardClick: () => void
  onSaveClick: () => void
  onCancelClick: () => void
}

export class VisualizationPageComponent extends PureComponent<StateProps & ActionProps> {
  // TODO: do for each
  getPageTitle() {
    if (!this.props.visualizationName) return
    if (this.props.authorization?.tenant && this.props.authorization.tenant === 'hopara.io') {
      return `${this.props.visualizationName} - Hopara`
    } else if (this.props.authorization?.tenant) {
      return `${this.props.visualizationName} - ${this.props.authorization.tenant} - Hopara`
    }

    return `${this.props.visualizationName} - Hopara`
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.props.onFullScreenExit()
      }
    })
  }

  getPanelColumnSize() {
    if (this.props.isAdvancedMode) return 'large'
    if (this.props.hasPanelOpened && !this.props.isPanelCollapsed) return 'small'
    if (this.props.hasPanelOpened && this.props.isPanelCollapsed && this.props.area === Area.OBJECT_EDITOR) return 'collapsed'
    if (this.props.hasPanelOpened && this.props.isPanelCollapsed) return 'small'
    return undefined
  }

  render() {
    const pageTitle = this.getPageTitle()
    return (
      <VisualizationRouteProvider>
        <Helmet>
          {pageTitle && <title>{pageTitle}</title>}
        </Helmet>
        <VisualizationLayout
          _fullScreen={this.props.fullScreen}
          _panelColumnSize={this.getPanelColumnSize()}
        >
          <Outlet/>

          <TopNavigationComponent/>
          <LeftNavigationContainer/>
          <NavigationContainer/>
          <LegendContainer/>
          <TooltipContainer/>

          <ViewContainer/>

        </VisualizationLayout>
        <SaveDiscardDialog
          open={!!this.props.exitDestination && this.props.visualizationStatus === VisualizationEditStatus.DIRTY}
          onCancel={this.props.onCancelClick}
          onDiscard={() => this.props.onDiscardClick()}
          onSave={() => this.props.onSaveClick()}
          title={i18n('YOU_HAVE_UNSAVED_CHANGES')}
          description={i18n('SAVE_OR_DISCARD_TO_CONTINUE')}
          isSaving={this.props.visualizationStatus === VisualizationEditStatus.SAVING}
          isDiscarding={this.props.visualizationStatus === VisualizationEditStatus.DISCARDING}
        />
      </VisualizationRouteProvider>
    )
  }
}
