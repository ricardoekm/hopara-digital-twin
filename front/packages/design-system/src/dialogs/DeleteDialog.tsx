import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {i18n} from '@hopara/i18n'
import {ModalDialog} from './ModalDialog'

interface Props {
  open: boolean
  onCancel: () => void
  onDelete: () => void
  isDeleting: boolean
  error?: string
  message: string
  title?: string
  deleteText?: string
}

export class DeleteDialog extends PureComponent<Props> {
  render() {
    return (<ModalDialog
      _isWarning
      title={this.props.title ?? i18n('DELETE')}
      description={this.props.message}
      cancelText={i18n('CANCEL')}
      confirmText={this.props.deleteText ?? i18n('DELETE')}
      confirmingText={i18n('DELETING_ELLIPSIS')}
      open={this.props.open}
      onCancel={this.props.onCancel}
      onConfirm={this.props.onDelete}
      isConfirming={this.props.isDeleting}
      error={this.props.error}
    />)
  }
}
