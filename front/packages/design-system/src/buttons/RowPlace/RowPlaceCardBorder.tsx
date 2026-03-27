import React from 'react'
import {BoxProps} from '@mui/material'
import {Theme, withTheme} from '../../theme'
import {RowPlaceStatus} from './RowPlaceCard'
import {ImageWrapper} from '../../image/ImageWrapper'
import {withForwardedRef} from '../../component/withForwardedRef'
import { PureComponent } from '../../component/PureComponent'

interface Props extends BoxProps {
  status: RowPlaceStatus
  size?: 'small' | 'large'
  enabled: boolean
  theme: Theme
  isImage: boolean
  forwardedRef?: React.Ref<any>
}

export function getCursor(status: RowPlaceStatus, enabled: boolean) {
  if (status === RowPlaceStatus.PLACED || status === RowPlaceStatus.SAVING) {
    return 'inherit'
  }
  if (!enabled) {
    return 'not-allowed'
  }
  if ([RowPlaceStatus.PLACING, RowPlaceStatus.SAVING].includes(status)) {
    return 'not-allowed'
  }
  return 'move'
}

export function getUserSelect(status: RowPlaceStatus, enabled: boolean) {
  if (!enabled) {
    return 'none'
  }
  if ([
    RowPlaceStatus.PLACING,
    RowPlaceStatus.PLACED,
    RowPlaceStatus.SAVING,
  ].includes(status)) {
    return 'none'
  }
  return 'inherit'
}

export function getBorderWidth(status: RowPlaceStatus) {
  if (status === RowPlaceStatus.PLACED) return 0
  return 2
}

export function getBorderColor(status: RowPlaceStatus, enabled: boolean, theme: Theme) {
  if (status === RowPlaceStatus.PLACED) return 'transparent'
  if ([RowPlaceStatus.SAVING, RowPlaceStatus.PLACING].includes(status) || !enabled) {
    return theme.palette.spec.borderColor
  }
  return theme.palette.primary.main
}

class RowPlaceBoxComp extends PureComponent<Props> {
  render() {
    const {enabled = true, status, theme, isImage, forwardedRef, ...rest} = this.props

    const sx = {
      borderColor: getBorderColor(status, enabled, theme),
      borderWidth: getBorderWidth(status),
      borderStyle: 'solid',
      zIndex: 999,
      userSelect: getUserSelect(status, enabled),
      opacity: 1,
      position: 'relative',
      overflow: 'none',
      padding: 1,
    }

    if (status === RowPlaceStatus.NOT_PLACED) sx['borderRadius'] = '4px'

    return <ImageWrapper
      ref={forwardedRef}
      {...rest}
      asThumb={this.props.size === 'small'}
      fullWidth={!isImage}
      boxSx={{ cursor: getCursor(status, enabled) }}
      sx={sx}>
      {this.props.children}
    </ImageWrapper>
  }
}

export const RowPlaceCardBorder = withForwardedRef(withTheme<Props>(RowPlaceBoxComp))

