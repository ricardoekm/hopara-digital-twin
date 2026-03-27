import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {DialogContentText} from '@mui/material'
import {Dialog} from './Dialog'
import {DialogActions} from './DialogActions'
import {DialogContent} from './DialogContent'
import {DialogTitle} from './DialogTitle'
import {i18n} from '@hopara/i18n'
import { ErrorPanel } from '../error/ErrorPanel'
import {DialogCloseButton} from './DialogCloseButton'
import {PillButton} from '../buttons/PillButton'

interface Props {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  isConfirming?: boolean
  error?: string
  title: string
  description?: string
  cancelText?: string
  confirmText?: string
  confirmingText?: string
  _isWarning?:boolean
}

export class ModalDialog extends PureComponent<Props> {
  render() {
  const cancelText = this.props.cancelText ?? i18n('CANCEL')
  const confirmText = this.props.confirmText ?? i18n('CONFIRM')
  const confirmingText = this.props.confirmingText ?? this.props.confirmText

    return (<Dialog
      open={this.props.open}
      onClose={this.props.onCancel}
    >
      <DialogTitle>{this.props.title}</DialogTitle>
      <DialogCloseButton onClick={this.props.onCancel} />
      <DialogContent>
        <DialogContentText>{this.props.description}</DialogContentText>
        <ErrorPanel error={this.props.error}/>
      </DialogContent>
      <DialogActions>
        <PillButton
          disabled={this.props.isConfirming}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            this.props.onCancel()
          }}
        >
          {cancelText}
        </PillButton>
        <PillButton
          pillVariant={this.props._isWarning ? 'warning' : 'primary'}
          disabled={this.props.isConfirming}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            this.props.onConfirm()
          }}
          data-testid="confirm"
        >
          {this.props.isConfirming ? confirmingText : confirmText}
        </PillButton>
      </DialogActions>
    </Dialog>)
  }
}
