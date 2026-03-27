import React from 'react'
import {Box, BoxProps} from '@mui/material'
import {PureComponent} from '../component/PureComponent'
import {PanelContent} from '../VisualizationLayout'
import {styled} from '../theme'

export interface Props extends Omit<BoxProps, 'title'> {
  header?: React.ReactNode
  fullHeight?: boolean
}

export const PanelStyle = styled(Box, {name: 'Panel'})(() => ({
  'display': 'flex',
  'flexDirection': 'column',
  'height': 'auto',
  'minHeight': 0, // precisa de min-height para funcionar com o infinite scroll
  'width': '100%',
  'overflowX': 'visible',
  '&.fullHeight': {
    'height': '100vh',
    'maxHeight': '100%',
  },
}))

export class Panel extends PureComponent<Props> {
  render() {
    return (
      <PanelStyle className={this.props.fullHeight ? 'fullHeight' : ''}>
        {this.props.header}
        <PanelContent>
          {this.props.children}
        </PanelContent>
      </PanelStyle>
    )
  }
}

