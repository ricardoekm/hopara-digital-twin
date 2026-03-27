import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {Dialog} from '@hopara/design-system/src/dialogs/Dialog'
import {DialogTitle} from '@hopara/design-system/src/dialogs/DialogTitle'
import {DialogCloseButton} from '@hopara/design-system/src/dialogs/DialogCloseButton'
import {DialogContent} from '@hopara/design-system/src/dialogs/DialogContent'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {DialogActions} from '@hopara/design-system/src/dialogs/DialogActions'
import {DialogContentText} from '@mui/material'
import {PillButton} from '@hopara/design-system/src/buttons/PillButton'

interface Props {
  open: boolean
  onCancel: () => void
  onSave: () => void
  onDiscard: () => void
  isSaving: boolean
  isDiscarding: boolean
  error?: string
  title: string
  description?: string
}

export class SaveDiscardDialog extends PureComponent<Props> {
  render() {
    return (<Dialog open={this.props.open}>
      <DialogTitle>{this.props.title}</DialogTitle>
      <DialogCloseButton onClick={this.props.onCancel}/>
      <DialogContent>
        <DialogContentText>{this.props.description}</DialogContentText>
        <ErrorPanel error={this.props.error}/>
      </DialogContent>
      <DialogActions>
        <PillButton
          disabled={this.props.isSaving || this.props.isDiscarding}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            this.props.onDiscard()
          }}
        >
          {this.props.isDiscarding ? i18n('DISCARDING_ELLIPSIS') : i18n('DISCARD')}
        </PillButton>
        <PillButton
          pillVariant="primary"
          disabled={this.props.isSaving || this.props.isDiscarding}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            this.props.onSave()
          }}
          data-testid="save"
        >
          {this.props.isSaving ? i18n('SAVING_ELLIPSIS') : i18n('SAVE')}
        </PillButton>
      </DialogActions>
    </Dialog>)
  }
}
