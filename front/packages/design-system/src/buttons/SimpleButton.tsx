import React, {PropsWithChildren, PureComponent} from 'react'
import Button from '@mui/material/Button'
import {styled} from '../theme'
import {SxProps} from '@mui/system'

type Props = PropsWithChildren & SxProps & {
  'data-testid'?: string;
  color?: any
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const SimpleButtonStyle = styled(Button, {name: 'SimpleButton'})(({theme}) => ({
  'textTransform': 'revert',
  'padding': '4px 9px',
  'margin': 0,
  'borderRadius': '3px',
  'width': 'max-content',
  'minWidth': 'revert',
  'color': theme.palette.spec.foregroundCanvasButton,
  'backgroundColor': theme.palette.spec.buttonBackground,
  'boxShadow': theme.palette.spec.shadowCanvasButton,
  'fontSize': 12,
  'transition': 'none',
  '&:hover': {
    color: theme.palette.spec.foregroundCanvasButtonHover,
    backgroundColor: theme.palette.spec.buttonBackgroundHover,
    boxShadow: theme.palette.spec.shadowCanvasButton,
  },
  '&:active': {
    color: theme.palette.spec.foregroundCanvasButtonActive,
    backgroundColor: theme.palette.spec.buttonBackgroundHover,
    boxShadow: theme.palette.spec.shadowCanvasButton,
    transform: 'scale(0.975)',
  },
}))

export class SimpleButton extends PureComponent<Props> {
  render() {
    return (
      <SimpleButtonStyle
        {...this.props}
        disableRipple
        size="small"
        variant="contained"
        translate={(this.props as any).translate}
        content={(this.props as any).content}
      />
    )
  }
}

export default SimpleButton
