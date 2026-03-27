import React from 'react'
import {Store} from '../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import actions from '../state/Actions'
import {connect} from '@hopara/state'
import {VisualizationEditStatus} from './VisualizationEditStatus'
import {PureComponent} from '@hopara/design-system'
import {PanelPillButton} from '@hopara/design-system/src/buttons/PanelPillButton'
import {Layer} from '../layer/Layer'
import {ModalDialog} from '@hopara/design-system/src/dialogs/ModalDialog'
import {i18n} from '@hopara/i18n'
import {Area} from './pages/Area'
import {Box} from '@mui/material'

interface StateProps {
  visualizationStatus?: VisualizationEditStatus
  layer?: Layer
  exitDestination?: Area
}

interface ActionProps {
  onSaveClick: () => void
  onDiscardClick: () => void
}

function mapState(state: Store): StateProps {
  const layer = state.layerStore.getSelectedLayer()
  return {
    layer,
    visualizationStatus: state.visualizationStore.editStatus,
    exitDestination: state.visualizationStore.exitDestination,
  }
}

function mapActions(dispatch: Dispatch, stateProps: StateProps): ActionProps {
  return {
    onSaveClick: () => {
      dispatch(actions.visualization.save.request())
    },
    onDiscardClick: () => {
      if (stateProps.visualizationStatus === VisualizationEditStatus.DIRTY) {
        dispatch(actions.visualization.editorDiscardChangesRequest())
      }
    },
  }
}

type State = {
  exitConfirmOpen: boolean
  discardConfirmOpen: boolean
}

type Props = StateProps & ActionProps

export class SaveDiscardEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      discardConfirmOpen: false,
      exitConfirmOpen: false,
    }
  }

  discard() {
    this.setState({discardConfirmOpen: false})
    this.props.onDiscardClick()
  }

  tryDiscard() {
    this.setState({discardConfirmOpen: true})
  }

  render() {
    const isSaving = this.props.visualizationStatus === VisualizationEditStatus.SAVING
    const isDiscarding = this.props.visualizationStatus === VisualizationEditStatus.DISCARDING
    const isDirty = this.props.visualizationStatus === VisualizationEditStatus.DIRTY

    return (
      <>
        <Box sx={{display: 'flex', gap: 5, marginInlineEnd: 1}}>
          {(isDirty || isDiscarding) &&
            <PanelPillButton onClick={() => this.tryDiscard()} _pillVariant="default" disabled={isDiscarding}>
              {isDiscarding ? i18n('DISCARDING_ELLIPSIS') : i18n('DISCARD')}
            </PanelPillButton>}
          {(isDirty || isSaving) && <PanelPillButton onClick={this.props.onSaveClick} _pillVariant="primary" disabled={isSaving}>
            {isSaving ? i18n('SAVING_ELLIPSIS') : i18n('SAVE')}
          </PanelPillButton>}
        </Box>
        <ModalDialog
          _isWarning
          open={this.state.discardConfirmOpen}
          onCancel={() => this.setState({discardConfirmOpen: false})}
          onConfirm={() => this.discard()}
          title={i18n('DISCARD_CHANGES')}
          description={i18n('ARE_YOU_SURE_YOU_WANT_TO_DISCARD_CHANGES')}
          confirmText={i18n('DISCARD')}
        />
      </>
    )
  }
}

export const SaveDiscardEditorContainer = connect(mapState, mapActions)(SaveDiscardEditor)
