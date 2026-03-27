import React from 'react'
import {Box, Switch, SxProps, Typography} from '@mui/material'
import {styled} from '../theme'
import {HelperButton} from '../HelperButton'
import {PureComponent} from '../component/PureComponent'

const CardGroupStyle = styled(Box, {name: 'CardGroup'})(({theme}) => ({
  'padding': '6px 0',
  'borderBottom': `1px solid ${theme.palette.spec.borderColor}`,
  'display': 'grid',
  'alignItems': 'center',
  'gridTemplateColumns': 'var(--grid-template-columns)',
  'rowGap': 6,
  '&:last-of-type': {
    'borderBottom': 'none',
    'paddingBottom': 0,
  },
  '&:first-of-type': {
    'paddingTop': 0,
  },
}))

const CardGroupContent = styled(Box, {name: 'CardGroupContent'})(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}))

interface Props {
  title?: string
  helperText?: string
  canBeEnabled?: boolean
  enabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
  children?: React.ReactNode;
  inline?: boolean
  secondaryAction?: React.ReactNode;
  sx?: SxProps;
  testId?: string
}

export class PanelGroup extends PureComponent<Props> {
  render() {
    function getTemplateColumns(inline?: boolean, canBeEnabled?: boolean) {
      if (!inline) return 'auto-fill'
      if (canBeEnabled) return '0.8fr 0.2fr'
      return '1fr 2fr'
    }

    const showCardContent = (this.props.canBeEnabled && this.props.enabled) || !this.props.canBeEnabled
    return (
      <CardGroupStyle
        sx={{
          ...this.props.sx,
          '--grid-template-columns': getTemplateColumns(this.props.inline, this.props.canBeEnabled),
      }}>
        {this.props.title && <Typography
          variant="h6"
          sx={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.25,
            display: 'flex',
            placeItems: 'center',
            gap: 3,
            whiteSpace: 'pre-line',
          }}
        >
          {this.props.title}
          {this.props.helperText &&
            <HelperButton
              description={this.props.helperText}
              size="small"
            />
          }
        </Typography>}
        {this.props.secondaryAction}
        {this.props.canBeEnabled && !this.props.secondaryAction &&
          <Box sx={{textAlign: 'right'}}>
            <Switch
              sx={{margin: '-12px auto'}}
              checked={this.props.enabled}
              onChange={() => this.props.onEnabledChange?.(!this.props.enabled)}/>
          </Box>
        }
        <CardGroupContent sx={
          this.props.inline && (this.props.canBeEnabled || this.props.secondaryAction) ? {
            gridColumnStart: 1,
            gridColumnEnd: -1,
          } : {}
        }>
          {showCardContent && this.props.children}
        </CardGroupContent>
      </CardGroupStyle>
    )
  }
}
