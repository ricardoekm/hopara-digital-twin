import React from 'react'
import { PureComponent } from '../../../component/PureComponent'
import { Icon } from '../../../icons/Icon'
import { RowPlaceCardBorder } from '../RowPlaceCardBorder'
import { Props as DraggableProps, RowPlaceStatus } from './RowPlaceCardDraggable'
import { Box } from '@mui/system'

interface Props extends DraggableProps {
  onClickMobile: () => void
}

export class RowPlaceCardMobile extends PureComponent<Props> {
  _ref: React.RefObject<HTMLSpanElement>

  constructor(props) {
    super(props)
    this._ref = props.forwardedRef || React.createRef<HTMLSpanElement>()
  }

  isEnabled() {
    return this.props.canPlace
  }

  getStatus() {
    if (this.props.isSaving) return RowPlaceStatus.SAVING
    if (this.props.isPlaced) return RowPlaceStatus.PLACED
    return RowPlaceStatus.NOT_PLACED
  }

  getIcon() {
    const status = this.getStatus()
    if (status === RowPlaceStatus.SAVING) {
      return <Icon icon="progress-activity" size={this.props.size === 'large' ? 'xl' : 'md'} />
    }
    return this.props.getIcon(false)
  }

  render() {
    const enabled = this.isEnabled()
    const status = this.getStatus()
    return <RowPlaceCardBorder
      data-testid="row-place-button"
      ref={this._ref as any}
      status={status}
      enabled={enabled}
      size={this.props.size}
      isImage={this.props.isImage}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!this.props.canPlace) return
        return this.props.onClickMobile()
      }}
    >
      {this.getIcon()}
      {!this.props.isPlaced && !this.props.isSaving &&
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          color: (theme) => !this.props.canPlace ? theme.palette.text.primary : theme.palette.spec.onPrimary,
          backgroundColor: (theme) => !this.props.canPlace ? theme.palette.spec.inputBackgroundDisabled : theme.palette.spec.primary,
          boxShadow: (theme) => theme.palette.spec.shadowCanvasButton,
          borderRadius: '50%',
          width: 24,
          height: 24,
          position: 'absolute',
          right: -4,
          bottom: -4,
        }}>
        <Icon icon='zoom-in' size='sm' />
      </Box>
      }
    </RowPlaceCardBorder>
  }
}
