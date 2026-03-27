import React from 'react'
import {Box} from '@mui/material'
import {styled} from '../theme'
import {Icon} from '../icons/Icon'
import {PanelButton} from '../buttons/PanelButton'
import {PureComponent} from '../component/PureComponent'

interface Props {
  onCloseClick: () => void
}

const CloseButtonWrapperStyle = styled(Box, {name: 'PanelTitleBarWithCloseOnly'})(() => ({
  position: 'absolute',
  top: 5,
  right: 5,
}))

export class PanelTitleBarWithCloseOnly extends PureComponent<Props> {
  render() {
    return (
      <CloseButtonWrapperStyle>
        <PanelButton onClick={this.props.onCloseClick}>
          <Icon icon="color-legend-close"/>
        </PanelButton>
      </CloseButtonWrapperStyle>
    )
  }
}
